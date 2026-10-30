import {midiHz,SAMPLE_RATE} from './score.js';

const TAU=Math.PI*2;
function random(seed){let a=seed>>>0;return()=>{a^=a<<13;a^=a>>>17;a^=a<<5;return(a>>>0)/4294967296*2-1;};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Every excitation and partial below is generated here, including the breath,
// wood impacts, wordless vowel spectrum and the inharmonic bronze resonances.
export function synthesize(ctx,instrument,midi,duration,{bend=0,seed=12345}={}) {
  const length=Math.ceil((duration+.025)*SAMPLE_RATE),buffer=ctx.createBuffer(1,length,SAMPLE_RATE),out=buffer.getChannelData(0);
  const f=midiHz(midi),noise=random(seed+Math.round(f)*19),decay=Math.max(.06,duration*.45);
  const plucks={harp:[1,2,3,4,5],pipa:[1,2.005,3.012,4.02,6.04],guqin:[1,2,3,4,7],sitar:[1,2.002,3.008,4.022,6.05],shamisen:[1,2,3.02,4.04,5.07]};
  const metal={bronze:[1,2.41,3.78,5.43,6.79],gamelan:[1,2.76,4.09,5.41,6.8],bell:[1,2.01,2.756,4.07,5.42],midi:[1,2,4.01,5,8.02]};
  let state=0,phase=0;
  for(let i=0;i<length;i++) {
    const t=i/SAMPLE_RATE,u=t/duration,attack=1-Math.exp(-t*180),release=clamp((duration-t)/Math.min(.09,duration*.22),0,1);
    let hz=f*2**(bend*Math.sin(Math.PI*clamp(u,0,1))/12);
    if(instrument==='fm-bass')hz*=2**(-.8*Math.exp(-t*38)/12)*(1+.0018*Math.sin(t*TAU*4.7));
    if(['dizi','xiao','ocarina','fm-sax'].includes(instrument))hz*=1+.0035*Math.sin(t*TAU*5.1)*(1-Math.exp(-t*5));
    const n=noise();phase+=TAU*hz/SAMPLE_RATE;
    let x=0;
    if(plucks[instrument]) {
      const harmonics=plucks[instrument],bright=instrument==='guqin'?.58:instrument==='sitar'?.85:.72;
      for(let p=0;p<harmonics.length;p++)x+=Math.sin(phase*harmonics[p])*(bright**p)*Math.exp(-t*(1+p*.65)/decay);
      x*=.48;
      x+=n*Math.exp(-t*90)*.22;
      if(instrument==='sitar')x+=Math.sin(phase*1.005+Math.sin(phase*2)*.23)*Math.exp(-t*2.5)*.16+Math.sin(phase*7.001)*Math.exp(-t*4)*.045;
      if(instrument==='pipa'||instrument==='shamisen')x=Math.tanh(x*1.35)*.85;
    }else if(metal[instrument]) {
      for(let p=0;p<5;p++)x+=Math.sin(phase*metal[instrument][p])*(.62**p)*Math.exp(-t*(2+p*.6)/Math.max(.3,duration));
      x*=.52;
    }else if(['dizi','ocarina','xiao'].includes(instrument)) {
      const breath=instrument==='xiao'?.12:instrument==='dizi'?.065:.025;
      state=.87*state+.13*n;
      const vibrato=Math.sin(t*TAU*5.1)*.009*(1-Math.exp(-t*5));
      x=(Math.sin(phase+vibrato*Math.sin(phase))+.17*Math.sin(phase*2)+.06*Math.sin(phase*3))*Math.sin(Math.PI*clamp(u,0,1))*.7+state*breath;
      if(instrument==='dizi')x+=Math.sin(phase*4)*.07;
    }else if(instrument==='chant') {
      // A wordless /o/→/a/ vowel: harmonic amplitudes follow three formants.
      const formants=[450+200*u,900+250*u,2600];
      for(let h=1;h<=22;h++){
        const freq=f*h,weight=formants.reduce((a,center)=>a+Math.exp(-(((freq-center)/(center*.17+60))**2)),0);
        x+=Math.sin(phase*h+Math.sin(t*TAU*4.8)*.012*h)*weight/(h**.7);
      }
      x*=.43*Math.sin(Math.PI*clamp(u,0,1));
    }else if(['strings','tense-strings','pad','organ'].includes(instrument)) {
      for(let h=1;h<=9;h++){
        const detune=instrument==='tense-strings'?1.007:1.0028;
        const bow=instrument==='tense-strings'?.75+.25*Math.sin(t*TAU*9):1;
        x+=(Math.sin(phase*h)+Math.sin(phase*h*detune+.15))*bow/(h**1.65)*.23;
      }
      x*=1-Math.exp(-t*(instrument==='organ'?30:12));
      if(instrument==='organ')x+=Math.sin(phase*.5)*.18;
    }else if(['piano','fm-ep','pop'].includes(instrument)) {
      const index=instrument==='fm-ep'?2.8:instrument==='pop'?4:1.3;
      x=Math.sin(phase+Math.sin(phase*(instrument==='piano'?2.001:1))*index*Math.exp(-t*5))*.58*Math.exp(-t/(duration*.52));
      x+=Math.sin(phase*2.003)*.16*Math.exp(-t*7)+Math.sin(phase*3.997)*.055*Math.exp(-t*12);
    }else if(instrument==='fm-sax') {
      const env=Math.sin(Math.PI*clamp(u,0,1));
      x=(Math.sin(phase+Math.sin(phase*2)*1.5*env)+.22*Math.sin(phase*3))*env*.62+state*.025;
      state=.8*state+.2*n;
    }else if(['bass','fm-bass'].includes(instrument)) {
      x=(Math.sin(phase+Math.sin(phase)*1.2*Math.exp(-t*5))+.18*Math.sin(phase*2))*.75*Math.exp(-t*2.2);
    }else if(instrument==='scope'||instrument==='tube') {
      x=(Math.sin(phase+.02*Math.sin(t*TAU*50))+.08*Math.sin(phase*2))*.4;
      if(instrument==='tube')x=.5*Math.sin(phase)+.09*Math.sin(t*TAU*50)+n*.008;
    }else if(instrument==='chip-square'||instrument==='chip-square2') {
      // Band-limited pulse Fourier series: two separate square channels.
      const duty=instrument==='chip-square'?.5:.25;
      for(let h=1;h<=Math.min(19,Math.floor(18000/f));h++)x+=Math.sin(phase*h)*Math.sin(Math.PI*h*duty)/h*.6;
      x*=Math.exp(-t*2.5)*.65;
    }else if(instrument==='chip-triangle') {
      for(let h=1;h<12;h+=2)x+=Math.sin(phase*h)*(h%4===1?1:-1)/(h*h)*.6;
    }else if(instrument==='drum'||instrument==='tabla'||instrument==='wood') {
      const base=instrument==='wood'?420:instrument==='tabla'?145:85;
      x=Math.sin(TAU*(base*t+4*(1-Math.exp(-t*22))))*Math.exp(-t*(instrument==='wood'?35:18))*.8+n*Math.exp(-t*65)*.35;
      if(instrument==='tabla')x+=Math.sin(TAU*base*2.71*t)*Math.exp(-t*20)*.25;
    }else if(instrument==='gong') {
      for(let h=0;h<7;h++)x+=Math.sin(phase*[1,1.42,1.91,2.61,3.73,4.89,6.12][h])*Math.exp(-t*(1+h*.22))*.17;
    }else if(instrument==='coin') {
      x=Math.sin(TAU*(t<.085?midiHz(midi):midiHz(midi+7))*t)*Math.exp(-t*15)*.7;
      x+=Math.sin(phase*3)*Math.exp(-t*32)*.15;
    }else if(instrument==='message') {
      x=Math.sin(phase*(t<.1?1:1.25))*Math.exp(-t*13)*.65+Math.sin(phase*2)*Math.exp(-t*23)*.14;
    }else{
      // Chain links, camera shutter and the fourth chip/noise channel all
      // have independent deterministic filtered-noise excitations.
      const fast=instrument==='flash'?42:instrument==='chain'?90:55;
      state=.72*state+.28*n;
      x=(n-state)*Math.exp(-t*fast)*.65;
      if(instrument==='flash')x+=Math.sin(TAU*145*t)*Math.exp(-t*70)*.22;
      if(instrument==='chain')x+=Math.sin(TAU*3600*t)*Math.exp(-t*110)*.16;
    }
    out[i]=x*attack*release;
  }
  return buffer;
}

export function noiseBuffer(ctx,seconds,seed=88) {
  const buffer=ctx.createBuffer(2,Math.round(seconds*SAMPLE_RATE),SAMPLE_RATE),rand=random(seed);
  for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=rand();}
  return buffer;
}
export function impulse(ctx,seconds=1.4,seed=676) {
  const buffer=noiseBuffer(ctx,seconds,seed);
  for(let ch=0;ch<2;ch++){
    const data=buffer.getChannelData(ch);
    let state=0;for(let i=0;i<data.length;i++){state=.6*state+.4*data[i];data[i]=state*Math.exp(-i/SAMPLE_RATE*6.5/seconds)*.22;}
  }
  return buffer;
}

export function scheduleNote(ctx,destination,event,{send=null,sendGain=.1}={}) {
  const source=ctx.createBufferSource(),gain=ctx.createGain(),pan=ctx.createStereoPanner();
  source.buffer=synthesize(ctx,event.instrument,event.midi,event.duration,{bend:event.bend,seed:Math.round(event.time*48000)+173});
  gain.gain.value=event.gain;pan.pan.value=event.pan||0;source.connect(gain).connect(pan).connect(destination);
  if(send){const wet=ctx.createGain();wet.gain.value=sendGain;pan.connect(wet).connect(send);}
  source.start(event.time);
  return source;
}
