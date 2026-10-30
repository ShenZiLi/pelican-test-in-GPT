// Original deterministic instruments: analytic oscillators, FM, modal resonators,
// filtered noise and decaying harmonic strings. No recorded material is loaded.
export const SAMPLE_RATE=48000;
export const hz=midi=>440*2**((midi-69)/12);
const TAU=Math.PI*2;
export function random(seed=1){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
const cache=new WeakMap();
const plucked=new Set(['harp','pipa','guqin','sitar','shamisen']);
const bells=new Set(['bell','gamelan','gong','cyclebell','midi']);
const winds=new Set(['dizi','ocarina','xiao','fm-sax']);
export const SUPPORTED_VOICES=Object.freeze(['chant','harp','bell','pipa','guqin','dizi','ocarina','sitar','xiao','gamelan','shamisen','strings','piano','organ','sine','hum','square1','square2','triangle','noise','midi','message','fm-epiano','fretlessbass','fm-sax','gateddrums','pop','popdrum','synth','handdrum','wooddrum','tabla','chain','gong','shutter','cyclebell']);

function sample(voice,t,f,noise,kind,duration){
 const p=TAU*f*t;
 if(kind==='coin'){const q=t<.075?f*1.5:f*2;return Math.sign(Math.sin(TAU*q*t))*.45;}
 if(kind==='fault'){const a=Math.sin(Math.PI*Math.min(1,t/.5));return Math.sin(p+18*a*Math.sin(TAU*9*t))*.8;}
 if(kind==='scream'){const a=Math.sin(Math.PI*Math.min(1,t/.5));return .4*(Math.sin(p*(1+.045*a)+5*a*Math.sin(TAU*31*t))+Math.sin(p*1.014*(1+.08*a)));}
 if(plucked.has(voice)){
  const decay={harp:3,pipa:8,guqin:2.8,sitar:3.5,shamisen:10}[voice];let y=0;
  for(let k=1;k<=8;k++){const stretch=voice==='guqin'?1+.00035*k*k:1;const buzz=voice==='sitar'?Math.sin(TAU*73*t)*.025:0;y+=Math.sin(p*k*stretch+buzz*k)*Math.exp(-t*decay*(1+k*.3))/k**1.35;}
  return y*.57+(voice==='shamisen'?noise*Math.exp(-t*150)*.18:0);
 }
 if(bells.has(voice)){
  const ratios=voice==='gong'?[1,1.41,1.89,2.31,2.93,3.72]:voice==='gamelan'?[1,2.76,5.4,8.93]:voice==='cyclebell'?[1,2.01,2.75,4.07,5.43]:[1,2.01,3.98,5.45];
  let y=0;for(let k=0;k<ratios.length;k++)y+=Math.sin(p*ratios[k])*Math.exp(-t*(voice==='gong'?1.2:voice==='cyclebell'?8:voice==='midi'?9:3)*(1+k*.4))/(1+k*1.1);return y*.52;
 }
 if(winds.has(voice)){
  const vib=1+.0028*Math.sin(TAU*5.1*t)*Math.min(1,t*7),phase=p*vib;
  if(voice==='ocarina')return .86*Math.sin(phase)+.04*Math.sin(2*phase);
  if(voice==='fm-sax')return .65*Math.sin(phase+1.15*Math.sin(phase*2)*(.65+.35*Math.exp(-t*7)))+.05*noise;
  return .7*Math.sin(phase)+.13*Math.sin(phase*2)+.08*Math.sin(phase*3)+(voice==='dizi'?.07:.025)*noise;
 }
 if(voice==='chant')return .46*Math.sin(p+.05*Math.sin(TAU*4.7*t))+.13*Math.sin(p*3)+.18*Math.sin(p*5)+.10*Math.sin(p*7);
 if(voice==='strings')return .31*(Math.sin(p+.01*Math.sin(TAU*5.2*t))+Math.sin(p*1.004)+.4*Math.sin(p*2)+.2*Math.sin(p*3));
 if(voice==='piano')return .65*Math.sin(p)*Math.exp(-t*2.5)+.24*Math.sin(p*2.002)*Math.exp(-t*5)+.11*Math.sin(p*3.01)*Math.exp(-t*9);
 if(voice==='fm-epiano')return .72*Math.sin(p+2.2*Math.exp(-t*4)*Math.sin(p*3.001))*Math.exp(-t*1.3)+.12*Math.sin(p*2)*Math.exp(-t*4);
 if(voice==='fretlessbass'){const glide=1-.027*Math.exp(-t*24);return .75*Math.sin(p*glide)+.16*Math.sin(p*2*glide)*Math.exp(-t*3);}
 if(voice==='organ')return .5*Math.sin(p)+.25*Math.sin(2*p)+.12*Math.sin(3*p)+.08*Math.sin(4*p);
 if(voice==='synth')return .55*Math.sin(p+.55*Math.sin(p*2))+.15*Math.sin(p*.5);
 if(voice==='pop')return .67*Math.sin(p+.8*Math.sin(p*2)*Math.exp(-t*7))+.15*Math.sin(p*.5);
 if(voice==='sine')return .85*Math.sin(p);
 if(voice==='hum')return .6*Math.sin(TAU*60*t)+.15*Math.sin(TAU*120*t)+noise*.04;
 if(voice==='square1'||voice==='square2')return Math.sign(Math.sin(p))*.5;
 if(voice==='triangle')return 2/Math.PI*Math.asin(Math.sin(p));
 if(voice==='noise')return noise*.6;
 if(voice==='message')return Math.sin(TAU*(t<.045?987:1318)*t)*Math.exp(-t*31)*.65;
 if(voice==='chain')return noise*Math.exp(-t*75)*.5;
 if(voice==='shutter')return (noise*.7+Math.sin(TAU*1250*t)*.25)*Math.exp(-t*55);
 if(voice==='handdrum')return Math.sin(TAU*(110*t+1.4*(1-Math.exp(-t*45))))*Math.exp(-t*21)+noise*.23*Math.exp(-t*52);
 if(voice==='wooddrum')return (.6*Math.sin(TAU*410*t)+.3*Math.sin(TAU*683*t))*Math.exp(-t*38);
 if(voice==='tabla')return .7*Math.sin(TAU*(142*t+1.8*(1-Math.exp(-t*26))))*Math.exp(-t*17)+.18*Math.sin(TAU*400*t)*Math.exp(-t*29);
 if(voice==='popdrum'||voice==='gateddrums')return .75*Math.sin(TAU*(56*t+2.6*(1-Math.exp(-t*45))))*Math.exp(-t*30)+noise*.5*Math.exp(-t*42)+(voice==='gateddrums'&&t>.024?noise*.18*Math.exp(-(t-.024)*8):0);
 throw Error(`Unknown synthesized voice: ${voice}`);
}

export function noteBuffer(ctx,voice,midi,duration,kind='note'){
 if(!SUPPORTED_VOICES.includes(voice))throw Error(`Unsupported voice ${voice}`);
 let bank=cache.get(ctx);if(!bank){bank=new Map();cache.set(ctx,bank);}
 const key=[voice,midi,duration,kind].join('|');if(bank.has(key))return bank.get(key);
 const tail=plucked.has(voice)||bells.has(voice)||['piano','fm-epiano'].includes(voice)?.24:.045;
 const length=Math.max(1,Math.ceil((duration+tail)*ctx.sampleRate));const b=ctx.createBuffer(1,length,ctx.sampleRate),data=b.getChannelData(0),rng=random(8783+Math.round(midi*101)+voice.length*137);const f=hz(midi);
 let filtered=0;const sustained=winds.has(voice)||['chant','strings','organ','synth','hum'].includes(voice),attack=sustained?.035:.003;
 for(let i=0;i<length;i++){
  const t=i/ctx.sampleRate;filtered=filtered*.55+(rng()*2-1)*.45;
  let env=Math.min(1,t/attack)*Math.min(1,Math.max(0,(duration+tail-t)/(sustained?.07:.025)));
  if(sustained&&t>duration)env*=Math.max(0,1-(t-duration)/tail);
  if(['square1','square2','triangle','noise','sine','message','chain','shutter','handdrum','wooddrum','tabla','popdrum','gateddrums'].includes(voice))env*=Math.min(1,Math.max(0,(duration-t)/.012));
  data[i]=sample(voice,t,f,filtered,kind,duration)*env;
 }
 bank.set(key,b);return b;
}

export function impulse(ctx,seconds,seed=981){const b=ctx.createBuffer(2,Math.ceil(seconds*ctx.sampleRate),ctx.sampleRate);for(let ch=0;ch<2;ch++){const rng=random(seed+ch*77),d=b.getChannelData(ch);let low=0;for(let i=0;i<d.length;i++){low=low*.72+(rng()*2-1)*.28;const t=i/ctx.sampleRate;d[i]=low*Math.exp(-t*7/seconds)*Math.min(1,t/.012);}}return b;}

export function scheduleNote(ctx,event,destination,{time=event.time,midi=event.midi,duration=event.duration,stopAt=137,velocity=event.velocity}={}){
 const source=ctx.createBufferSource();source.buffer=noteBuffer(ctx,event.voice,midi,duration,event.kind);const g=ctx.createGain();g.gain.value=velocity;const p=ctx.createStereoPanner();p.pan.value=event.pan||0;source.connect(g).connect(p).connect(destination);source.start(time);source.stop(Math.max(time+.001,Math.min(time+source.buffer.duration,stopAt)));return source;
}
