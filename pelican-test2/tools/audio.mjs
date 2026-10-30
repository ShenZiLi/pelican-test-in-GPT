import path from 'node:path';
import {mkdir,open,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ROOT,isMain,parseArgs,runCLI,writeJSON} from './common.mjs';
import {startServer} from './serve.mjs';
import {launchChrome} from './browser.mjs';

export function inspectWav(bytes) {
  const b=Buffer.from(bytes);
  if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE'||b.toString('ascii',36,40)!=='data')throw new Error('Expected canonical PCM WAV');
  const channels=b.readUInt16LE(22),sampleRate=b.readUInt32LE(24),bits=b.readUInt16LE(34),dataBytes=b.readUInt32LE(40);
  if(bits!==16||channels!==2||dataBytes+44!==b.length)throw new Error('WAV structure mismatch');
  let peak=0,sum=0,clipped=0;const frames=dataBytes/(channels*2),secondRms=Array(Math.ceil(frames/sampleRate)).fill(0),counts=secondRms.map(()=>0);
  for(let i=44;i<b.length;i+=2){const n=b.readInt16LE(i),x=n/32768;peak=Math.max(peak,Math.abs(x));sum+=x*x;if(Math.abs(n)>=32767)clipped++;const sec=Math.floor((i-44)/(channels*2)/sampleRate);secondRms[sec]+=x*x;counts[sec]++;}
  return{sampleFrames:frames,sampleRate,channels,bits,duration:frames/sampleRate,bytes:b.length,peak,peakDbfs:20*Math.log10(peak||1e-12),rms:Math.sqrt(sum/(frames*channels)),clipped,secondRms:secondRms.map((s,i)=>Math.sqrt(s/counts[i])),sha256:createHash('sha256').update(b).digest('hex')};
}

export async function exportAudio({out='out/final',reviews=true}={}) {
  const folder=path.resolve(ROOT,out);await mkdir(folder,{recursive:true});
  const site=await startServer();let browser;const handles=new Map(),errors=[];
  try{
    browser=await launchChrome();const page=await browser.newPage();page.setDefaultTimeout(180000);
    page.on('pageerror',error=>errors.push(error.message));
    await page.exposeFunction('writeAudioChunk',async(name,base64)=>{
      if(!/^[a-z0-9-]+\.wav$/.test(name))throw new Error('Invalid audio output name');
      if(!handles.has(name))handles.set(name,await open(path.join(folder,name),'w'));
      await handles.get(name).write(Buffer.from(base64,'base64'));
    });
    await page.goto(`${site.url}/audio/render.html`,{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>window.audioRender);
    console.log('Rendering original FM jazz source, tape pass and complete score…');
    const rendered=await page.evaluate(async(wantReviews)=>{
      const api=window.audioRender,score=await api.renderScore(),vapor=await api.renderVaporwave();
      const outputs={};
      const write=async(name,buffer,from=0,to=buffer.duration)=>{outputs[name]=await api.streamWav(buffer,chunk=>window.writeAudioChunk(name,chunk),from,to);};
      await write('score.wav',score);
      if(wantReviews){
        await write('vaporwave-dry.wav',vapor.dry);await write('vaporwave-wet.wav',vapor.wet);
        await write('review-intro-ancient.wav',score,0,23);await write('review-shadow-digital.wav',score,83,107);await write('review-vapor-outro.wav',score,107,137);
      }
      const a=api.createAudioEngine(),b=api.createAudioEngine(),shared=(await a.renderOffline())===(await b.renderOffline());
      const pending=a.play(40);a.pause();await pending;const cancelledTime=a.time();
      await a.play(107);const liveStart=a.time();await new Promise(resolve=>setTimeout(resolve,120));const liveAfter=a.time();a.pause();const paused=a.time();
      await a.play(79);const seek=a.time();a.pause();
      return{outputs,metadata:api.metadata,analysis:api.audioAnalysis(),live:{shared,cancelledTime,liveStart,liveAfter,paused,seek},jazzEvents:vapor.events};
    },Boolean(reviews));
    for(const handle of handles.values())await handle.close();handles.clear();
    if(errors.length)throw new Error(errors.join('\n'));
    const wav=inspectWav(await readFile(path.join(folder,'score.wav')));
    if(wav.sampleFrames!==6576000||wav.sampleRate!==48000||wav.channels!==2||wav.clipped||wav.peak>.9001)throw new Error('Rendered WAV failed output contract');
    if(!rendered.live.shared||Math.abs(rendered.live.cancelledTime-40)>.0001||rendered.live.liveAfter<=rendered.live.liveStart||Math.abs(rendered.live.seek-79)>.03)throw new Error('Live cache/seek/pause validation failed');
    const audioSource=createHash('sha256');
    for(const file of ['audio/engine.js','audio/score.js','audio/synth.js','audio/wav.js'])audioSource.update(file+'\0').update(await readFile(path.join(ROOT,file))).update('\0');
    const manifest={...rendered,wav,audioSourceHash:audioSource.digest('hex'),renderedAt:new Date().toISOString(),browser:await browser.version(),originalAudioOnly:true};
    await writeJSON(path.join(folder,'audio-manifest.json'),manifest);
    console.log(JSON.stringify({output:path.join(folder,'score.wav'),frames:wav.sampleFrames,duration:wav.duration,peakDbfs:wav.peakDbfs,rms:wav.rms,clipped:wav.clipped,live:rendered.live,sha256:wav.sha256},null,2));
    return manifest;
  }finally{
    for(const handle of handles.values())await handle.close();
    if(browser)await browser.close();await site.close();
  }
}

if(isMain(import.meta.url))runCLI(async()=>{const args=parseArgs();await exportAudio({out:args.out||'out/final',reviews:args.reviews!=='false'});});
