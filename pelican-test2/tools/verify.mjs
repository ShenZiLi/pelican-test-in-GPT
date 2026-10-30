import assert from 'node:assert/strict';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {openFilm} from './browser.mjs';
import {captureStill} from './shot.mjs';
import {writeJSON} from './common.mjs';
import {SCENES} from '../src/beat/timeline.js';

const out = path.resolve('out/final'); await mkdir(out, {recursive:true});
const capture = await openFilm({width:1920,height:1080});
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const review = {browser:await capture.browser.version(),checks:[],captureSilent:true,previewAudio:true};
try {
  assert.equal(await capture.page.evaluate(()=>window.film.metadata.silent),true);
  const captures = [];
  const times = [3.7,...SCENES.map(s=>s.highlightCandidate),129,132,134,136.62,136.95];
  for (let i=0;i<times.length;i++) {
    const file = path.join(out,'stills',`shot-${String(i).padStart(3,'0')}-t${times[i].toFixed(3)}.png`);
    const meta = await captureStill(capture,times[i],file); captures.push({...meta,time:times[i],file});
  }
  await writeJSON(path.join(out,'stills/shots.json'),{width:1920,height:1080,captures});
  const baseline = new Map();
  const samples = [3.7,4.99,5,8.15,13.5,32,38,63.17,79,88.99,89,91.5,98.13,104.13,109.75,114.4,119,123,125,129,134,136.62,136.99];
  for (const t of samples) {
    await capture.page.evaluate(t=>window.film.renderAt(t),t);
    baseline.set(t,hash(await capture.page.screenshot({type:'png'})));
  }
  for (const t of [...samples.slice(7),...samples.slice(0,7)].reverse()) {
    await capture.page.evaluate(t=>window.film.renderAt(t),t);
    assert.equal(hash(await capture.page.screenshot({type:'png'})),baseline.get(t),`Random-order frame differs at ${t}`);
  }
  review.checks.push(`Same-time pixel equality in shuffled order: ${samples.length} samples`);
  for (const t of [5,...SCENES.slice(1).map(s=>s.start),125]) {
    for (const delta of [-1/60,0,1/60]) {
      const frame = await capture.page.evaluate(t=>window.film.renderAt(t),t+delta);
      assert.equal(frame.time,t+delta);
      const expected = t+delta>=125?'outro':t+delta<5?'intro':SCENES[Math.floor((t+delta-5)/6)].id;
      assert.equal(frame.sceneId,expected);
    }
  }
  review.checks.push('All 21 boundaries sampled at -1/60s, exact, +1/60s');
  capture.assertClean();
} finally {await capture.close();}

const preview = await openFilm({width:1440,height:810,capture:false});
try {
  await preview.page.click('#play-toggle');
  await preview.page.waitForFunction(()=>window.film.time>.55,{timeout:30000});
  const clock=await preview.page.evaluate(()=>({audio:window.film.audio.time(),visual:window.film.time,silent:window.film.metadata.silent}));
  assert.equal(clock.silent,false);
  assert.ok(Math.abs(clock.audio-clock.visual)<.25,JSON.stringify(clock));
  review.checks.push('Real Web Audio starts on click; visual clock follows the score buffer');
  await preview.page.click('#play-toggle');
  assert.equal(await preview.page.evaluate(()=>window.film.playing),false);
  await preview.page.evaluate(()=>{const slider=document.getElementById('seek');slider.value='114';slider.dispatchEvent(new Event('input',{bubbles:true}));});
  await preview.page.waitForFunction(()=>Math.abs(window.film.time-114)<.0001,{timeout:10000});
  assert.equal(await preview.page.$eval('#scene-name',el=>el.textContent),'竖屏短视频');
  await preview.page.click('[data-scene="05-song-landscape"]');
  await preview.page.waitForFunction(()=>window.film.time===29,{timeout:10000});
  assert.equal(await preview.page.$eval('#scene-name',el=>el.textContent),'宋代山水');
  await preview.page.evaluate(async()=>{await window.film.renderAt(136.5);window.film.play();});
  await preview.page.waitForFunction(()=>window.film.time===137&&!window.film.playing,{timeout:10000});
  await preview.page.click('#play-toggle');
  await preview.page.waitForFunction(()=>window.film.time>0&&window.film.time<2,{timeout:10000});
  await preview.page.evaluate(()=>window.film.pause());
  await preview.page.screenshot({path:path.join(out,'player.png'),fullPage:true});
  preview.assertClean(); review.checks.push('Play/pause, timeline seek, chapter seek, end stop and restart');
} finally {await preview.close();}
review.passed=true;
await writeJSON(path.join(out,'browser-verification.json'),review);
console.log(JSON.stringify(review,null,2));
