import {SAMPLE_RATE,SAMPLE_FRAMES,DURATION,MOTIF,CUES,SCORE_METADATA,scoreEvents,vaporIntegral,vaporRateAt,vaporSegments} from './score.js';
import {scheduleNote,noiseBuffer,impulse} from './synth.js';

let renderPromise;
let vaporPromise;
let lastAnalysis=null;
const offline=seconds=>new OfflineAudioContext(2,Math.round(seconds*SAMPLE_RATE),SAMPLE_RATE);

function reverbBus(ctx,target,seconds,level,seed=77) {
  const reverb=ctx.createConvolver(),gain=ctx.createGain();
  reverb.buffer=impulse(ctx,seconds,seed);gain.gain.value=level;
  reverb.connect(gain).connect(target);return reverb;
}

export function jazzEvents() {
  const events=[];
  const add=(output,instrument,midi,duration,gain,pan=0)=>events.push({time:vaporIntegral(output),instrument,midi:midi+4,duration:duration*vaporRateAt(output),gain,pan,output});
  const chords=[[50,53,57,60,64],[46,50,53,57,60],[48,52,55,59,62]];
  for(let bar=0;bar<3;bar++){
    for(const offset of[0,.75,1.5])for(let i=0;i<5;i++)add(bar*2+offset,'fm-ep',chords[bar][i],.65,.054,(i-2)*.25);
    for(let k=0;k<4;k++)add(bar*2+k*.5,'fm-bass',[38,34,36][bar]+(k===3?7:0),.44,.13,-.15);
    for(let k=0;k<8;k++)add(bar*2+k*.25,k%4===2?'drum':'hat',k%4===2?57:38,.1,k%4===2?.09:.03,.3);
  }
  for(const [beat,note,length]of MOTIF)add(beat*.5+.06,'fm-sax',note+12,length*.5,.105,.18);
  return events.sort((a,b)=>a.time-b.time);
}

// Stage one is genuinely rendered FM jazz at +4 semitones. Stage two reads
// that AudioBuffer through tape-rate automation, not a substitute pad voice.
export async function renderVaporwave() {
  if(vaporPromise)return vaporPromise;
  vaporPromise=(async()=>{
    const dryContext=offline(7),drumReverb=reverbBus(dryContext,dryContext.destination,.14,.17,944);
    const room=reverbBus(dryContext,dryContext.destination,.65,.12,945);
    for(const event of jazzEvents())scheduleNote(dryContext,dryContext.destination,event,{send:event.instrument==='drum'?drumReverb:room,sendGain:.1});
    const dry=await dryContext.startRendering();
    const wetContext=offline(6),filter=wetContext.createBiquadFilter(),output=wetContext.createGain();
    filter.type='lowpass';filter.frequency.value=4000;filter.Q.value=.55;
    output.gain.setValueAtTime(0,0);output.gain.linearRampToValueAtTime(.94,.025);output.gain.setValueAtTime(.94,5.72);output.gain.linearRampToValueAtTime(0,6);
    output.connect(wetContext.destination);
    const wetBus=reverbBus(wetContext,output,4,.72,991),dryGain=wetContext.createGain();dryGain.gain.value=.65;
    filter.connect(dryGain).connect(output);filter.connect(wetBus);
    for(const segment of vaporSegments()) {
      const source=wetContext.createBufferSource(),gain=wetContext.createGain();source.buffer=dry;
      const {output:at,duration,source:offset}=segment,points=Array.from({length:Math.max(8,Math.round(duration*120))},(_,i)=>vaporRateAt(at+i*duration/(Math.max(8,Math.round(duration*120))-1)));
      source.playbackRate.setValueCurveAtTime(new Float32Array(points),at,duration);
      const wow=Float32Array.from({length:Math.max(8,Math.round(duration*100))},(_,i)=>3*Math.sin(Math.PI*(at+i*duration/(Math.max(8,Math.round(duration*100))-1))));
      source.detune.setValueCurveAtTime(wow,at,duration);
      gain.gain.setValueAtTime(segment.output===0?1:0,at);gain.gain.linearRampToValueAtTime(1,at+.006);
      gain.gain.setValueAtTime(1,at+duration-.006);gain.gain.linearRampToValueAtTime(0,at+duration+.006);
      source.connect(gain).connect(filter);source.start(at,offset);source.stop(at+duration+.008);
    }
    const hiss=wetContext.createBufferSource(),hissFilter=wetContext.createBiquadFilter(),hissGain=wetContext.createGain();
    hiss.buffer=noiseBuffer(wetContext,6,889);hissFilter.type='highpass';hissFilter.frequency.value=850;hissGain.gain.value=.0018;
    hiss.connect(hissFilter).connect(hissGain).connect(output);hiss.start();
    const wet=await wetContext.startRendering();
    return{dry,wet,events:jazzEvents(),metadata:SCORE_METADATA.vapor};
  })();
  return vaporPromise;
}

export function analyzeBuffer(buffer) {
  let peak=0,sum=0,nonfinite=0,clipped=0;
  const secondRms=Array.from({length:Math.ceil(buffer.duration)},()=>0);
  const count=Array(secondRms.length).fill(0);
  for(let ch=0;ch<buffer.numberOfChannels;ch++){
    const samples=buffer.getChannelData(ch);
    for(let i=0;i<samples.length;i++){
      const x=samples[i];if(!Number.isFinite(x)){nonfinite++;continue;}
      const a=Math.abs(x);peak=Math.max(peak,a);if(a>=1)clipped++;sum+=x*x;
      const second=Math.floor(i/buffer.sampleRate);secondRms[second]+=x*x;count[second]++;
    }
  }
  return{peak,peakDbfs:20*Math.log10(peak||1e-12),rms:Math.sqrt(sum/(buffer.length*buffer.numberOfChannels)),nonfinite,clipped,secondRms:secondRms.map((s,i)=>Math.sqrt(s/count[i])),sampleFrames:buffer.length,sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,duration:buffer.duration};
}

export async function renderScore() {
  if(renderPromise)return renderPromise;
  renderPromise=(async()=>{
    const vapor=await renderVaporwave(),ctx=offline(DURATION),music=ctx.createGain(),highpass=ctx.createBiquadFilter();
    highpass.type='highpass';highpass.frequency.value=28;highpass.Q.value=.6;
    music.connect(highpass).connect(ctx.destination);
    music.gain.setValueAtTime(.95,0);music.gain.setValueAtTime(.95,125);
    music.gain.linearRampToValueAtTime(.52,129);music.gain.linearRampToValueAtTime(.1,133);music.gain.linearRampToValueAtTime(0,136.4);
    const room=reverbBus(ctx,music,1.35,.2,671);
    for(const event of scoreEvents()){
      const final=event.cue==='final-bell';
      scheduleNote(ctx,final?ctx.destination:music,event,{send:final?null:room,sendGain:['chain','coin','message','flash','chip-noise'].includes(event.instrument)?.025:.12});
    }
    const tape=ctx.createBufferSource();tape.buffer=vapor.wet;tape.connect(music);tape.start(107);
    const buffer=await ctx.startRendering();
    if(buffer.length!==SAMPLE_FRAMES)throw new Error('Offline score sample count mismatch');
    const before=analyzeBuffer(buffer),normalization=.89/Math.max(.001,before.peak);
    // A fixed whole-score gain preserves transients and avoids pumping. A
    // sub-1 dBTP margin protects AAC conversion; the tail has a smooth edge.
    for(let ch=0;ch<2;ch++){
      const data=buffer.getChannelData(ch);
      for(let i=0;i<data.length;i++){
        const end=(data.length-1-i)/SAMPLE_RATE;
        data[i]*=normalization*Math.min(1,Math.max(0,end/.012));
      }
    }
    lastAnalysis={...analyzeBuffer(buffer),preNormalizePeak:before.peak,normalization};
    return buffer;
  })();
  return renderPromise;
}
export const audioAnalysis=()=>lastAnalysis;
export {SCORE_METADATA,CUES};

let playbackPromise,playbackOrigin='pending';
async function playbackBuffer(context){
  if(playbackPromise)return playbackPromise;
  playbackPromise=(async()=>{
    try{
      const response=await fetch('/out/final/audio-manifest.json',{cache:'no-store'});
      if(!response.ok)throw new Error('No score cache');
      const manifest=await response.json();
      const files=['audio/engine.js','audio/score.js','audio/synth.js','audio/wav.js'];
      const source=await Promise.all(files.map(async file=>{
        const r=await fetch('/'+file,{cache:'no-store'});if(!r.ok)throw new Error('Missing audio source');
        return file+'\0'+await r.text()+'\0';
      }));
      const hex=buffer=>Array.from(new Uint8Array(buffer),n=>n.toString(16).padStart(2,'0')).join('');
      const sourceHash=hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source.join(''))));
      if(sourceHash!==manifest.audioSourceHash)throw new Error('Score cache source changed');
      const wav=await fetch('/out/final/score.wav',{cache:'no-store'});if(!wav.ok)throw new Error('No score WAV');
      const bytes=await wav.arrayBuffer();
      if(hex(await crypto.subtle.digest('SHA-256',bytes))!==manifest.wav.sha256)throw new Error('Score WAV hash mismatch');
      const decoded=await context.decodeAudioData(bytes);
      if(decoded.length!==SAMPLE_FRAMES||decoded.numberOfChannels!==2||decoded.sampleRate!==SAMPLE_RATE)throw new Error('Score WAV format mismatch');
      playbackOrigin='verified-original-cache';return decoded;
    }catch{
      playbackOrigin='procedural-synthesis';return renderScore();
    }
  })();return playbackPromise;
}

export function createAudioEngine() {
  let context=null,source=null,offset=0,started=0,playing=false,generation=0;
  const pause=()=>{
    generation++;
    if(playing&&context)offset=Math.min(DURATION,offset+context.currentTime-started);
    playing=false;
    if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();source=null;}
  };
  return{
    ready:()=>renderScore(),
    renderOffline:()=>renderScore(),
    async play(t=offset){
      if(!Number.isFinite(t)||t<0||t>DURATION)throw new RangeError('Audio time must lie within 0–137 seconds');
      pause();offset=t;const token=generation;
      // Create/resume before the first await, while the click is active.
      context??=new AudioContext({sampleRate:SAMPLE_RATE});
      const resumed=context.resume(),rendered=playbackBuffer(context);
      await resumed;const buffer=await rendered;
      if(token!==generation||t===DURATION)return;
      source=context.createBufferSource();source.buffer=buffer;source.connect(context.destination);
      started=context.currentTime;playing=true;source.onended=()=>{if(token===generation){offset=DURATION;playing=false;source=null;}};
      source.start(started,t);
    },
    pause,
    get playbackOrigin(){return playbackOrigin;},
    time:()=>playing?Math.min(DURATION,offset+context.currentTime-started):offset,
  };
}
