// Independent verification of the bytes saved on disk, rather than the render buffer.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';import {root} from './serve.mjs';
export async function verifyAudio(){
 const folder=path.join(root,'exports','audio'),wav=await fs.readFile(path.join(folder,'pelican-score.wav'));
 if(wav.toString('ascii',0,4)!=='RIFF'||wav.toString('ascii',8,12)!=='WAVE'||wav.readUInt16LE(20)!==1||wav.readUInt16LE(22)!==2||wav.readUInt32LE(24)!==48000||wav.readUInt16LE(34)!==24)throw Error('Incorrect saved WAV header');
 const frames=wav.readUInt32LE(40)/6;if(frames!==6576000||wav.length!==44+frames*6)throw Error('Incorrect saved WAV length');
 let peak=0,sum=0,difference=0,clipped=0,silentPeak=0;const scenes=Array.from({length:20},(_,i)=>({id:i+1,start:5+i*6,end:11+i*6,sum:0,peak:0}));
 for(let i=0;i<frames;i++){const left=wav.readIntLE(44+i*6,3)/8388607,right=wav.readIntLE(47+i*6,3)/8388607,framePeak=Math.max(Math.abs(left),Math.abs(right)),energy=left*left+right*right;peak=Math.max(peak,framePeak);sum+=energy;difference+=(left-right)**2;if(framePeak>=1)clipped++;if(i>=133*48000&&i<136.5*48000)silentPeak=Math.max(silentPeak,framePeak);const scene=Math.floor((i/48000-5)/6);if(scene>=0&&scene<20){scenes[scene].sum+=energy;scenes[scene].peak=Math.max(scenes[scene].peak,framePeak);}}
 const metrics={sha256:crypto.createHash('sha256').update(wav).digest('hex'),bytes:wav.length,frames,channels:2,sampleRate:48000,bits:24,duration:frames/48000,peak,rms:Math.sqrt(sum/(frames*2)),stereoDifferenceRMS:Math.sqrt(difference/frames),clippedFrames:clipped,silence133to136_5Peak:silentPeak,scenes:scenes.map(({sum,...s})=>({...s,rms:Math.sqrt(sum/(6*48000*2))}))};
 metrics.eraBalanceRatio=Math.max(...metrics.scenes.map(s=>s.rms))/Math.min(...metrics.scenes.map(s=>s.rms));metrics.eraBalanceDb=20*Math.log10(metrics.eraBalanceRatio);
 if(clipped||peak<.75||peak>.78||silentPeak!==0||metrics.stereoDifferenceRMS<.001||metrics.scenes.some(s=>s.rms<.005)||metrics.eraBalanceRatio>2.2)throw Error('Saved PCM signal verification failed');
 await fs.writeFile(path.join(folder,'wav-verification.json'),JSON.stringify(metrics,null,2));return metrics;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=await verifyAudio();console.log(JSON.stringify(result,null,2));}
