import path from 'node:path';
import {mkdir,readdir,stat,rename} from 'node:fs/promises';
import {sampleTimes} from '../src/beat/timeline.js';
import {openFilm} from './browser.mjs';
import {startServer} from './serve.mjs';
import {parseArgs,dimensions,framePlan,frameName,provenance,readJSON,writeJSON,isMain,runCLI} from './common.mjs';

export function completedRanges(indices) {
  const sorted=[...indices].sort((a,b)=>a-b),ranges=[];
  for(const index of sorted) {
    const last=ranges.at(-1);
    if(last&&last[1]===index)last[1]=index+1;
    else ranges.push([index,index+1]);
  }
  return ranges;
}

export function assertResumeMatches(previous,current) {
  for(const key of ['config','source','browser']) {
    if(JSON.stringify(previous[key])!==JSON.stringify(current[key]))throw new Error(`Cannot resume: ${key} differs from existing manifest. Use a new output directory.`);
  }
}

export async function renderFrames(options={}) {
  if(!options.out)throw new Error('Usage: node tools/render.mjs --from 0 --to 137 --fps 30 --width 960 --height 540 --out out/proxy [--workers 2] [--resume]');
  const range=framePlan(options),size=dimensions(options);
  const times=sampleTimes(range.fps,range.from,range.to);
  if(times.length!==range.count||!times.length)throw new Error('Frame range has no samples or disagrees with source timeline');
  const workers=Number(options.workers??1);
  if(!Number.isInteger(workers)||workers<1||workers>8)throw new Error('--workers must be an integer from 1 to 8');
  const out=path.resolve(options.out),manifestPath=path.join(out,'manifest.json');
  await mkdir(out,{recursive:true});
  let previous=null;
  if(options.resume)previous=await readJSON(manifestPath);
  else if((await readdir(out)).some(name=>/^frame-\d+\.png$/.test(name)||name==='manifest.json'))throw new Error('Output contains a previous render; use --resume or a new output directory');
  const source=await provenance();
  const site=options.url?null:await startServer();
  const films=[];
  let manifest,canWrite=false,checkpoint=Promise.resolve();
  const done=new Set();
  const save=()=>{
    manifest.completedRanges=completedRanges(done);
    manifest.completedCount=done.size;
    manifest.updatedAt=new Date().toISOString();
    const snapshot=JSON.parse(JSON.stringify(manifest));
    checkpoint=checkpoint.then(()=>writeJSON(manifestPath,snapshot));
    return checkpoint;
  };
  try {
    const first=await openFilm({...size,url:options.url||site.url});films.push(first);
    const config={...range,...size,timeGrid:'absolute',firstTime:times[0],lastTime:times.at(-1),url:options.url??null};
    manifest={version:1,status:'rendering',config,source,browser:await first.browser.version(),film:await first.page.evaluate(()=>window.film.metadata),createdAt:previous?.createdAt??new Date().toISOString(),completedCount:0,completedRanges:[],errors:[]};
    if(previous) {
      assertResumeMatches(previous,manifest);
      for(const [start,end] of previous.completedRanges||[]) {
        if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>range.count||end<start)throw new Error('Invalid completed ranges in manifest');
        for(let index=start;index<end;index++) {
          try {if((await stat(path.join(out,frameName(index)))).size>0)done.add(index);}catch(error){if(error.code!=='ENOENT')throw error;}
        }
      }
    }
    canWrite=true;
    await save();
    const pending=times.map((time,index)=>({time,index})).filter(frame=>!done.has(frame.index));
    const activeCount=Math.min(workers,Math.max(1,pending.length));
    for(let i=1;i<activeCount;i++)films.push(await openFilm({...size,url:options.url||site.url}));
    console.log(`Render ${range.count} frames ${size.width}×${size.height} @ ${range.fps}fps; ${done.size} resumed; ${activeCount} worker(s)`);
    let cursor=0,abort=false,lastLog=Date.now();
    const started=Date.now();
    const results=await Promise.allSettled(films.map(async film=>{
      // Bounded chunks limit manifest writes while preserving restartable progress.
      while(!abort&&cursor<pending.length) {
        const chunk=pending.slice(cursor,cursor+=10);
        try {
          for(const {time,index} of chunk) {
            if(abort)break;
            await film.page.evaluate(t=>window.film.renderAt(t),time);
            film.assertClean();
            const output=path.join(out,frameName(index));
            await film.page.screenshot({path:`${output}.tmp`,type:'png',optimizeForSpeed:true});
            film.assertClean();
            await rename(`${output}.tmp`,output);
            done.add(index);
          }
          await save();
          if(Date.now()-lastLog>10000||done.size===range.count) {
            lastLog=Date.now();
            const elapsed=(Date.now()-started)/1000;
            console.log(`${done.size}/${range.count} (${elapsed.toFixed(1)}s elapsed)`);
          }
        }catch(error){abort=true;throw error;}
      }
    }));
    const failed=results.find(result=>result.status==='rejected');
    if(failed)throw failed.reason;
    const after=await provenance();
    if(JSON.stringify(source)!==JSON.stringify(after))throw new Error('Source changed during render; do not mix these frames with a later render');
    if(done.size!==range.count)throw new Error(`Incomplete render ${done.size}/${range.count}`);
    manifest.status='complete';manifest.elapsedSeconds=(Date.now()-started)/1000;
    await save();
    console.log(`Complete: ${manifestPath}`);
    return manifest;
  }catch(error){
    if(manifest&&canWrite){manifest.status='failed';manifest.errors.push(error.message);await save();}
    throw error;
  }finally{
    try {await checkpoint;}
    finally {
      await Promise.allSettled(films.map(film=>film.close()));
      if(site)await site.close();
    }
  }
}

if(isMain(import.meta.url))runCLI(()=>renderFrames(parseArgs()));
