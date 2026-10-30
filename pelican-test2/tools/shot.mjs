import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {openFilm} from './browser.mjs';
import {parseArgs,dimensions,isMain,runCLI,writeJSON} from './common.mjs';

export async function captureStill(film,time,out) {
  time=Number(time);
  if(!Number.isFinite(time)||time<0||time>137)throw new Error('Still time must be within 0–137 seconds');
  const metadata=await film.page.evaluate(t=>window.film.renderAt(t),time);
  film.assertClean();
  const stage=await film.page.$('#film-stage');
  if(!stage)throw new Error('Missing #film-stage');
  await mkdir(path.dirname(out),{recursive:true});
  await stage.screenshot({path:out,type:'png',optimizeForSpeed:true});
  film.assertClean();
  return metadata;
}

if(isMain(import.meta.url))runCLI(async()=>{
  const options=parseArgs();
  if(!options.out)throw new Error('Usage: node tools/shot.mjs --time 8 --out out/shot.png [--width 1920 --height 1080]');
  const times=options.times?String(options.times).split(',').map(Number):[Number(options.time??0)];
  if(times.some(t=>!Number.isFinite(t)||t<0||t>137))throw new Error('Invalid capture times');
  const size=dimensions(options);
  const film=await openFilm({...size,url:options.url});
  try {
    const captures=[];
    for(let i=0;i<times.length;i++) {
      const out=path.resolve(times.length===1?options.out:path.join(options.out,`shot-${String(i).padStart(3,'0')}-t${times[i].toFixed(3)}.png`));
      const frame=await captureStill(film,times[i],out);
      captures.push({...frame,file:out,time:times[i]});
      console.log(`${times[i].toFixed(3)}s → ${out}`);
    }
    const manifest=times.length===1?`${path.resolve(options.out)}.json`:path.join(path.resolve(options.out),'shots.json');
    await writeJSON(manifest,{...size,browser:await film.browser.version(),captures});
  }finally{await film.close();}
});
