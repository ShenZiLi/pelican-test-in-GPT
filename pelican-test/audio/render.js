import {buildScore,MELODY,TAPE_RATE,TAPE_SOURCE_BPM} from './score.js';
import {SAMPLE_RATE,scheduleNote,impulse,random} from './synth.js';
import {SCENES} from '../src/beat/timeline.js';

// Static era-bus calibration from the independently scanned 24-bit reference
// master ff74f403…: reference target RMS=.08, without phrase compression.
export const ERA_LEVELS=Object.freeze([1.072008,1.642371,1.576763,2.709407,1.58545,.770342,.649459,1.768791,.820838,1.57504,3.044189,1.330874,1.289509,1.142962,.663989,.695861,2.700211,.488897,.699225,1.145173]);
export const TAPE_PREROLL_START=106.82;
export const TAPE_SOURCE_PREFIX=.18*(1+TAPE_RATE)/2;
// One real source spans the entry ramp and the first two musical seconds.
// In particular, nothing restarts at 107.5: detune cannot cause a phase rewind.
export const TAPE_SEGMENTS=Object.freeze([
 {time:TAPE_PREROLL_START,duration:109-TAPE_PREROLL_START,offset:0,rate:TAPE_RATE,preroll:true,ramp:{from:1,to:TAPE_RATE,start:TAPE_PREROLL_START,end:107}},
 ...Array.from({length:4},(_,i)=>({time:109+i*.25,duration:.25,offset:TAPE_SOURCE_PREFIX+2*TAPE_RATE,rate:TAPE_RATE,loopCell:i})),
 {time:110,duration:3,offset:TAPE_SOURCE_PREFIX+3*TAPE_RATE,rate:TAPE_RATE,ramp:{from:TAPE_RATE,to:1,start:112.75,end:113}}
].map(s=>({...s,sourceSecondsRead:integratedTapeRead(s,s.time+s.duration)})));

// Integral of the scheduled playbackRate; the separate ±4-cent wow is an
// intentional, continuous pitch fluctuation, never a source-position reset.
export function integratedTapeRead(segment,time){
 const end=Math.max(segment.time,Math.min(time,segment.time+segment.duration)),r=segment.ramp;if(!r)return (end-segment.time)*segment.rate;
 let read=0;if(end>r.start)read+=Math.min(end-r.start,r.end-r.start)*(r.from+(r.from+(r.to-r.from)*Math.min(1,(end-r.start)/(r.end-r.start))))/2;
 if(end>r.end)read+=(end-r.end)*r.to;if(segment.time<r.start)read+=Math.max(0,Math.min(end,r.start)-segment.time)*segment.rate;return read;
}

export async function renderTapeSource(sampleRate=SAMPLE_RATE){
 const ctx=new OfflineAudioContext(2,Math.ceil((TAPE_SOURCE_PREFIX+8*TAPE_RATE)*sampleRate),sampleRate),bus=ctx.createGain();bus.gain.value=.8;bus.connect(ctx.destination);
 const drums=ctx.createGain(),room=ctx.createConvolver(),gate=ctx.createGain();room.buffer=impulse(ctx,.65,271);gate.gain.value=0;drums.connect(bus);drums.connect(room).connect(gate).connect(bus);
 for(let beat=0;beat<16;beat++){const t=TAPE_SOURCE_PREFIX+beat*.5*TAPE_RATE;gate.gain.setValueAtTime(.27,t);gate.gain.setValueAtTime(.27,t+.16*TAPE_RATE);gate.gain.linearRampToValueAtTime(0,t+.22*TAPE_RATE);}
 const add=(time,duration,midi,voice,velocity,pan=0)=>scheduleNote(ctx,{time:TAPE_SOURCE_PREFIX+time*TAPE_RATE,duration:duration*TAPE_RATE,midi:midi+4,voice,velocity,pan,kind:'note'},voice==='gateddrums'?drums:bus,{stopAt:ctx.length/sampleRate});
 // Original quiet pickup occupies the integral of the slowdown; the jazz's
 // first downbeat is physically rendered at source TAPE_SOURCE_PREFIX.
 const pickup=ctx.createGain();pickup.gain.setValueAtTime(1,0);pickup.gain.setValueAtTime(1,TAPE_SOURCE_PREFIX-.025);pickup.gain.linearRampToValueAtTime(0,TAPE_SOURCE_PREFIX);pickup.connect(bus);
 for(const midi of [54,61])scheduleNote(ctx,{time:0,duration:TAPE_SOURCE_PREFIX,midi,voice:'fm-epiano',velocity:.035,pan:0,kind:'note'},pickup,{stopAt:TAPE_SOURCE_PREFIX});
 const chords=[[50,57,60,64,65],[46,53,57,60,62],[48,55,59,62,64]];
 for(let bar=0;bar<4;bar++){
  const chord=chords[bar%3];for(let j=0;j<chord.length;j++)add(bar*2+j*.018,1.6,chord[j]+12,'fm-epiano',.13,j%2?.4:-.4);
  for(let beat=0;beat<4;beat++){add(bar*2+beat*.5,.43,chord[0]-12+(beat===3?7:0),'fretlessbass',.26,-.12);add(bar*2+beat*.5,.22,0,'gateddrums',beat%2?.17:.12,.1);add(bar*2+beat*.5+.25,.075,0,'noise',.035,.2);}
 }
 for(let i=0;i<16;i++)add(i*.5,.43,MELODY[i%12],'fm-sax',.17,.17);
 return ctx.startRendering();
}

function sceneBus(ctx,start,end,{wet=.12,decay=.6,level=1}={}){
 const input=ctx.createGain(),output=ctx.createGain();output.gain.setValueAtTime(level,start);output.gain.setValueAtTime(level,Math.max(start,end-.02));output.gain.linearRampToValueAtTime(0,end);output.connect(ctx.destination);input.connect(output);
 if(wet){const c=ctx.createConvolver();c.buffer=impulse(ctx,decay);const g=ctx.createGain();g.gain.value=wet;input.connect(c).connect(g).connect(output);}return input;
}

export async function renderScore({sampleRate=SAMPLE_RATE,onProgress=()=>{}}={}){
 onProgress('Rendering original high-pitched 151.1905 BPM jazz source');const tape=await renderTapeSource(sampleRate);onProgress('Scheduling twenty eras and exact effects');
 const ctx=new OfflineAudioContext(2,137*sampleRate,sampleRate),score=buildScore(),buses=new Map();
 buses.set(0,sceneBus(ctx,0,5,{wet:.14,decay:1.2}));
 for(const s of SCENES)buses.set(s.id,sceneBus(ctx,s.start,s.end,{level:ERA_LEVELS[s.id-1],wet:[15,16].includes(s.id)?0:[5,9].includes(s.id)?.22:.12,decay:[5,9].includes(s.id)?1.4:.5}));
 const outro=sceneBus(ctx,125,133,{wet:.1,decay:.55});
 for(const e of score){
  if(e.scene===18)continue;
  const dest=e.time>=125&&e.kind!=='final-bell'?outro:e.kind==='final-bell'?ctx.destination:buses.get(e.scene);
  const scene=SCENES[e.scene-1];const stopAt=['fault','scream'].includes(e.kind)?e.time+e.duration:e.kind==='final-bell'?137:e.time>=125?133:scene?scene.end:5;
  scheduleNote(ctx,e,dest,{stopAt});
 }
 // Tape has its own long high-wet reverb, low-pass and deterministic wow.
 const tapeInput=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4000;lp.Q.value=.65;tapeInput.connect(lp);
 const dry=ctx.createGain(),wet=ctx.createGain(),reverb=ctx.createConvolver(),tapeOut=ctx.createGain();dry.gain.value=.48;wet.gain.value=.80;reverb.buffer=impulse(ctx,4,7319);lp.connect(dry).connect(tapeOut);lp.connect(reverb).connect(wet).connect(tapeOut);tapeOut.gain.setValueAtTime(0,TAPE_PREROLL_START);tapeOut.gain.linearRampToValueAtTime(.8*ERA_LEVELS[17],107);tapeOut.gain.setValueAtTime(.8*ERA_LEVELS[17],112.98);tapeOut.gain.linearRampToValueAtTime(.08*ERA_LEVELS[17],113.06);tapeOut.gain.linearRampToValueAtTime(0,113.6);tapeOut.connect(ctx.destination);
 const wow=ctx.createOscillator(),wowDepth=ctx.createGain();wow.frequency.value=.5;wowDepth.gain.value=4;wow.connect(wowDepth);wow.start(107);wow.stop(113);
 for(const seg of TAPE_SEGMENTS){const source=ctx.createBufferSource(),g=ctx.createGain();source.buffer=tape;source.playbackRate.setValueAtTime(TAPE_RATE,seg.time);
  if(seg.ramp){source.playbackRate.setValueAtTime(seg.ramp.from,seg.ramp.start);source.playbackRate.linearRampToValueAtTime(seg.ramp.to,seg.ramp.end);}
  wowDepth.connect(source.detune);g.gain.setValueAtTime(0,seg.time);g.gain.linearRampToValueAtTime(1,seg.time+.002);g.gain.setValueAtTime(1,seg.time+seg.duration-.003);g.gain.linearRampToValueAtTime(0,seg.time+seg.duration);source.connect(g).connect(tapeInput);source.start(seg.time,seg.offset);source.stop(seg.time+seg.duration);
 }
 const noise=ctx.createBuffer(1,6*sampleRate,sampleRate),rng=random(451);const n=noise.getChannelData(0);let filtered=0;for(let i=0;i<n.length;i++){filtered=.82*filtered+(rng()*2-1)*.18;n[i]=filtered*.009*Math.min(1,i/960,(n.length-i)/960);}const noiseSource=ctx.createBufferSource();noiseSource.buffer=noise;noiseSource.connect(tapeInput);noiseSource.start(107);
 onProgress('OfflineAudioContext rendering 6,576,000 stereo samples');const buffer=await ctx.startRendering();
 let rawPeak=0;for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++)rawPeak=Math.max(rawPeak,Math.abs(data[i]));}
 const normalization=.78/rawPeak;for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]*=normalization;}
 const report=measure(buffer);report.rawPeak=rawPeak;report.normalization=normalization;report.eraLevels=ERA_LEVELS;report.eraBalanceRatio=Math.max(...report.sceneRMS.map(s=>s.rms))/Math.min(...report.sceneRMS.map(s=>s.rms));report.events=score;report.tape={rate:TAPE_RATE,sourceBpm:TAPE_SOURCE_BPM,semitones:4,reverbSeconds:4,lowPassHz:4000,wowHz:.5,wowCents:4,sourceFrames:tape.length,preroll:{start:TAPE_PREROLL_START,end:107,sourcePrefixSeconds:TAPE_SOURCE_PREFIX,musicalStart:107},segments:TAPE_SEGMENTS,loop:{start:109,end:110,cell:.25,repeats:4,resume:110}};return {buffer,report};
}

export function measure(buffer){
 const left=buffer.getChannelData(0),right=buffer.getChannelData(1),sr=buffer.sampleRate;let peak=0,sum=0,clipped=0,nonFinite=0;
 for(let i=0;i<left.length;i++)for(const v of [left[i],right[i]]){if(!Number.isFinite(v))nonFinite++;peak=Math.max(peak,Math.abs(v));sum+=v*v;if(Math.abs(v)>=1)clipped++;}
 const range=(start,end)=>{let s=0,p=0;const a=Math.floor(start*sr),b=Math.floor(end*sr);for(let i=a;i<b;i++){s+=left[i]**2+right[i]**2;p=Math.max(p,Math.abs(left[i]),Math.abs(right[i]));}return {start,end,rms:Math.sqrt(s/((b-a)*2)),peak:p};};
 const peaks=[];for(let i=0;i<1370;i++){const r=range(i/10,(i+1)/10);peaks.push([r.peak,r.rms]);}
 return {sampleRate:sr,channels:2,duration:buffer.duration,samplesPerChannel:buffer.length,peak,rms:Math.sqrt(sum/(left.length*2)),clippedSamples:clipped,nonFiniteSamples:nonFinite,sceneRMS:SCENES.map(s=>({id:s.id,key:s.key,...range(s.start,s.end)})),silenceBeforeBell:range(133.1,136.5),finalBell:range(136.5,137),peakInterval:.1,peaks};
}

export function encodeWav24(buffer){const frames=buffer.length,channels=buffer.numberOfChannels,bytes=frames*channels*3;const out=new ArrayBuffer(44+bytes),view=new DataView(out);const str=(at,s)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};str(0,'RIFF');view.setUint32(4,36+bytes,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*3,true);view.setUint16(32,channels*3,true);view.setUint16(34,24,true);str(36,'data');view.setUint32(40,bytes,true);const data=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));let at=44;for(let i=0;i<frames;i++)for(let ch=0;ch<channels;ch++){const value=Math.round(Math.max(-1,Math.min(1,data[ch][i]))*8388607);view.setUint8(at++,value&255);view.setUint8(at++,(value>>8)&255);view.setUint8(at++,(value>>16)&255);}return new Uint8Array(out);}
