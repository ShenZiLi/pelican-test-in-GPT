import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {DURATION,SAMPLE_RATE,SAMPLE_FRAMES,MOTIF,PROFILES,CUES,SCORE_METADATA,scoreEvents,midiHz,vaporRateAt,vaporIntegral,vaporSourceAt,vaporSegments,VAPOR_RATE,VAPOR_SOURCE_BPM} from '../audio/score.js';
import {jazzEvents} from '../audio/engine.js';
import {wavHeader,pcmChunk} from '../audio/wav.js';
import {inspectWav} from '../tools/audio.mjs';

test('score has exact absolute sample positions, original three-bar motif and twenty profiles',()=>{
  assert.equal(DURATION,137);assert.equal(SAMPLE_FRAMES,6576000);assert.equal(SAMPLE_RATE,48000);
  assert.equal(new Set(PROFILES).size,20);assert.equal(MOTIF[0][0],0);assert.ok(MOTIF.at(-1)[0]<12);
  assert.equal(midiHz(69),440);assert.equal(SCORE_METADATA.barOrigin,5);
  const events=scoreEvents();assert.ok(events.length>650);
  for(const event of events){assert.equal(event.sample,Math.round(event.time*48000));assert.ok(event.time>=0&&event.time<137);assert.ok(event.duration>0);assert.ok(event.gain>0&&event.gain<1);}
  for(let scene=1;scene<=20;scene++)if(scene!==18)assert.ok(events.some(e=>e.scene===scene&&e.role==='motif'));
  assert.deepEqual(events,scoreEvents());
});
test('cue contract follows absolute film beats through the isolated final bell',()=>{
  const time=id=>CUES.find(c=>c.id===id)?.time;
  assert.equal(time('intro-caption'),3);assert.equal(time('frame-01'),5);assert.equal(time('frame-15'),89);
  assert.equal(time('coin'),97);assert.equal(time('one-up'),98);assert.equal(time('tape-loop-start'),109);assert.equal(time('tape-loop-end'),110);
  assert.equal(time('final-bell'),136.5);
  const events=scoreEvents();assert.deepEqual(events.filter(e=>e.time>=136.5).map(e=>e.cue),['final-bell']);
  assert.equal(new Set(events.filter(e=>e.role==='outro-reprise').map(e=>e.scene)).size,20);
  for(let scene=1;scene<=20;scene++)assert.equal(events.filter(e=>e.role==='outro-reprise'&&e.scene===scene).length,MOTIF.length);
});
test('two-stage tape plan has correct transposition, source tempo, rate integral and repeated fragment',()=>{
  assert.ok(Math.abs(VAPOR_RATE-.7937005259840998)<1e-14);assert.ok(Math.abs(VAPOR_SOURCE_BPM*VAPOR_RATE-120)<1e-12);
  assert.equal(vaporRateAt(0),1);assert.equal(vaporRateAt(1),VAPOR_RATE);assert.equal(vaporRateAt(6),1);
  for(const t of[.1,.24,1,2,3,5.6,5.9,6]){
    const step=t/20000;let integral=0;for(let k=0;k<20000;k++)integral+=vaporRateAt((k+.5)*step)*step;
    assert.ok(Math.abs(integral-vaporIntegral(t))<1e-8);
  }
  const segments=vaporSegments();assert.equal(segments.length,6);assert.equal(segments.reduce((s,e)=>s+e.duration,0),6);
  for(const t of[2.05,2.3,2.55,2.8])assert.ok(Math.abs(vaporSourceAt(t)-vaporSourceAt(2.05))<1e-10);
  assert.equal(vaporSourceAt(3),vaporIntegral(3));
  const jazz=jazzEvents();for(const voice of['fm-ep','fm-bass','fm-sax','drum'])assert.ok(jazz.some(e=>e.instrument===voice));
  const bass=jazz.filter(e=>e.instrument==='fm-bass');assert.ok(Math.abs((bass[2].time-bass[1].time)/VAPOR_RATE-.5)<1e-12);
});
test('chip arrangement explicitly uses two pulses, triangle and noise channels',()=>{
  const chip=scoreEvents().filter(e=>e.time>=95&&e.time<101);
  for(const voice of['chip-square','chip-square2','chip-triangle','chip-noise'])assert.ok(chip.some(e=>e.instrument===voice));
  assert.equal(chip.filter(e=>e.instrument==='chip-triangle').length,24);
});
test('streamed PCM16 writer preserves channel order, byte count and bounded peak',()=>{
  const samples=[new Float32Array([0,.5,-.5]),new Float32Array([.25,-.25,0])];
  const buffer={numberOfChannels:2,getChannelData:ch=>samples[ch]};
  const bytes=Buffer.concat([Buffer.from(wavHeader(3)),Buffer.from(pcmChunk(buffer,0,3))]);
  assert.equal(bytes.readInt16LE(46),8192);assert.equal(bytes.readInt16LE(48),16384);assert.equal(bytes.readInt16LE(52),-16384);
  const actual=inspectWav(bytes);assert.equal(actual.sampleFrames,3);assert.equal(actual.channels,2);assert.equal(actual.peak,.5);assert.equal(actual.clipped,0);
});
test('audio sources contain no external audio, unseeded noise or speech inputs',async()=>{
  for(const name of await readdir(new URL('../audio/',import.meta.url)))if(/\.(js|html)$/.test(name)){
    const source=await readFile(new URL(`../audio/${name}`,import.meta.url),'utf8');
    assert.doesNotMatch(source,/https?:\/\/|speechSynthesis|Math\.random\(/,name);
    // The player may decode its own hash-verified generated WAV. The actual
    // score and instrument generators still have no loading/decoding inputs.
    if(['score.js','synth.js'].includes(name))assert.doesNotMatch(source,/fetch\(|decodeAudioData/,name);
  }
});
test('rendered full WAV and manifest agree when exporter has been run',async()=>{
  const dir=path.resolve('out/final');let manifest;
  try{manifest=JSON.parse(await readFile(path.join(dir,'audio-manifest.json'),'utf8'));}catch(error){if(error.code==='ENOENT')return;throw error;}
  const actual=inspectWav(await readFile(path.join(dir,'score.wav')));
  assert.equal(actual.sampleFrames,6576000);assert.equal(actual.duration,137);assert.equal(actual.sampleRate,48000);assert.equal(actual.clipped,0);assert.ok(actual.peak<.9&&actual.peak>.85);
  assert.equal(actual.sha256,manifest.wav.sha256);assert.equal(manifest.analysis.nonfinite,0);assert.ok(manifest.live.shared);
  for(let i=1;i<133;i++)assert.ok(actual.secondRms[i]>.0001,`unexpected silent second ${i}`);
});
