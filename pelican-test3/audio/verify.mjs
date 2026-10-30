import assert from 'node:assert/strict';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve,root} from '../tools/server.mjs';
import {browser,pageAt} from '../tools/browser.mjs';
import path from 'node:path';
const wav=await readFile(path.join(root,'out/soundtrack.wav'));
const sampleRate=wav.readUInt32LE(24),channels=wav.readUInt16LE(22),frames=wav.readUInt32LE(40)/(channels*2);
assert.equal(sampleRate,48000);assert.equal(channels,2);assert.equal(frames/sampleRate,137);
function segment(a,b){let peak=0,sum=0,n=0;for(let i=Math.floor(a*sampleRate);i<Math.floor(b*sampleRate);i++)for(let ch=0;ch<2;ch++){const v=wav.readInt16LE(44+(i*2+ch)*2)/32768;peak=Math.max(peak,Math.abs(v));sum+=v*v;n++}return {peak,rms:Math.sqrt(sum/n)}}
const scenes=Array.from({length:20},(_,i)=>({id:i+1,...segment(5+i*6,11+i*6)}));
for(const s of scenes){assert.ok(s.rms>.001,`scene ${s.id} is audible`);assert.ok(s.peak<.98,`scene ${s.id} is not clipped`)}
const beforeBell=segment(136,136.49),bell=segment(136.5,136.95),tail=segment(136.98,137);
assert.ok(beforeBell.peak<.001);assert.ok(bell.rms>.005);assert.ok(tail.peak<.001);
let playback=null;
if(!process.argv.includes('--pcm-only')){const server=await serve(4191),b=await browser();
try{const p=await pageAt(b,4191,960);playback=await p.evaluate(async()=>{const m=await import('/audio/synth.js');const begun=performance.now();await m.playFrom(91.5);const startupMs=performance.now()-begun;await new Promise(r=>setTimeout(r,180));const playing=m.playhead();m.stop();const parked=m.playhead();await new Promise(r=>setTimeout(r,80));const stopped=m.playhead();const pending=m.playFrom(107);m.stop();await pending;return {startupMs,playing,parked,stopped,cancelled:m.playhead()}});assert.ok(playback.startupMs<30000);assert.ok(playback.playing>91.5&&playback.playing<92.1);assert.equal(playback.parked,playback.stopped);assert.ok(playback.cancelled<107.01);
}finally{await b.close();server.close()}}
const report={wavSha256:createHash('sha256').update(wav).digest('hex'),wavModified:(await stat(path.join(root,'out/soundtrack.wav'))).mtime.toISOString(),seconds:frames/sampleRate,sampleRate,channels,scenes,beforeBell,bell,tail,playback,method:playback?'PCM analysis and actual Web Audio playback clock; not a subjective listening review':'PCM analysis only; not a subjective listening review'};
await writeFile(path.join(root,'out/audio-verification.json'),JSON.stringify(report,null,2));console.log(report);
