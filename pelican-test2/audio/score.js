export const SAMPLE_RATE=48000;
export const DURATION=137;
export const SAMPLE_FRAMES=SAMPLE_RATE*DURATION;
export const BPM=120;
export const VAPOR_RATE=2**(-4/12);
export const VAPOR_SOURCE_BPM=BPM/VAPOR_RATE;
export const MOTIF=Object.freeze([
  [0,62,.7],[1,69,.45],[1.75,72,.22],[2.5,69,.4],[3.25,65,.55],
  [4,67,.7],[5,64,.45],[5.75,65,.23],[6.5,62,.65],[7.5,57,.3],
  [8,60,.7],[9,64,.4],[9.75,67,.22],[10.5,65,.4],[11.25,62,.65],
].map(Object.freeze));
export const PROFILES=Object.freeze([
  'frame-drum-chant','harp','bronze-chimes','pipa','guqin','dizi-ensemble',
  'ocarina-wood','sitar-tabla','xiao','gamelan','shamisen','bowed-strings',
  'expressionist-strings','piano-organ','oscilloscope','four-channel-chip',
  'midi-chime','fm-mall-jazz','pop-pluck','piano-synth',
]);
export const CUES=Object.freeze([
  ...Array.from({length:21},(_,i)=>({id:`frame-${String(i+1).padStart(2,'0')}`,time:5+6*i,type:'crossing'})),
  {id:'intro-caption',time:3,type:'accent'},
  {id:'egypt-freeze',time:13,type:'stop'},{id:'egypt-release',time:14,type:'release'},
  {id:'scream-glide',time:79,type:'glide'},
  {id:'scope-distort',time:91,type:'bend'},{id:'scope-restore',time:92,type:'restore'},
  {id:'coin',time:97,type:'coin'},{id:'one-up',time:98,type:'coin'},
  {id:'chat-shake',time:103,type:'message'},{id:'chat-message',time:104,type:'message'},
  {id:'tape-loop-start',time:109,type:'loop'},{id:'tape-loop-end',time:110,type:'resume'},
  ...[129,131,133].map(time=>({id:`flash-${time}`,time,type:'flash'})),
  {id:'final-bell',time:136.5,type:'bell'},
].map(cue=>Object.freeze({...cue,sample:Math.round(cue.time*SAMPLE_RATE)})).sort((a,b)=>a.time-b.time));

export const midiHz=midi=>440*2**((midi-69)/12);
export const sampleAt=time=>Math.round(time*SAMPLE_RATE);

// The same piecewise linear rate automation is integrated for source offsets.
export function vaporRateAt(t) {
  const x=Math.max(0,Math.min(6,t));
  if(x===0||x===6)return 1;
  if(x<.24)return 1+(VAPOR_RATE-1)*x/.24;
  if(x>5.6)return VAPOR_RATE+(1-VAPOR_RATE)*(x-5.6)/.4;
  return VAPOR_RATE;
}
export function vaporIntegral(t) {
  const x=Math.max(0,Math.min(6,t)),a=Math.min(x,.24);
  let result=a+(VAPOR_RATE-1)*a*a/.48;
  if(x>.24)result+=(Math.min(x,5.6)-.24)*VAPOR_RATE;
  if(x>5.6){const b=x-5.6;result+=b*VAPOR_RATE+(1-VAPOR_RATE)*b*b/.8;}
  return result;
}
export function vaporSourceAt(t) {
  if(t>=2&&t<3)return vaporIntegral(2)+(t-2)% .25*VAPOR_RATE;
  return vaporIntegral(t);
}
export function vaporSegments() {
  return [
    {output:0,duration:2,source:vaporIntegral(0)},
    ...Array.from({length:4},(_,i)=>({output:2+i*.25,duration:.25,source:vaporIntegral(2)})),
    {output:3,duration:3,source:vaporIntegral(3)},
  ];
}

export function scoreEvents() {
  const events=[];
  const add=(time,instrument,midi,duration,gain=.15,pan=0,extra={})=>events.push({time,sample:sampleAt(time),instrument,midi,duration,gain,pan,...extra});
  add(.1,'strings',38,4.7,.12,-.2);add(.6,'strings',45,4.2,.075,.25);
  add(1,'piano',62,1.8,.1);add(3,'strings',50,1.7,.13);add(4,'chain',0,.13,.035);
  for(let scene=1;scene<=20;scene++) {
    const start=5+(scene-1)*6,end=start+6,profile=PROFILES[scene-1];
    if(scene===18)continue;
    const voices=['chant','harp','bronze','pipa','guqin','dizi','ocarina','sitar','xiao','gamelan','shamisen','strings','tense-strings','piano','scope','chip-square','midi','fm-ep','pop','piano'];
    const voice=voices[scene-1];
    for(const [beat,note,length]of MOTIF) {
      const local=beat*.5;
      if(scene===2&&local>=2&&local<3)continue;
      if((scene===5||scene===9)&&[1.75,3.25,5.75,7.5,9.75].includes(beat))continue;
      add(start+local,voice,note,Math.min(length*.5+(scene===12?.5:0),6-local),scene===1?.13:scene===9?.16:.18,(beat%3-1)*.25,{scene,profile,role:'motif',bend:scene===13&&local===2?-4:0});
    }
    // Three harmonic regions preserve the original motif's D minor / B-flat / C arc.
    const roots=[38,34,36];
    for(let bar=0;bar<3;bar++) {
      const at=start+bar*2,root=roots[bar];
      if(scene===1){add(at,'chant',root+12,1.85,.12,-.25);add(at+.5,'chant',root+19,1.25,.05,.3);}
      else if([2,4,5,8,11].includes(scene)) {
        for(let k=0;k<4;k++)add(at+k*.5,voice,root+12+[0,7,15,19][k],.55,.075,-.45+k*.3,{scene,role:'arpeggio'});
      }else if([6,7,9].includes(scene)){add(at,scene===6?'gong':scene===7?'wood':'xiao',root+12,1.6,scene===9?.045:.07,-.3);}
      else if(scene===3||scene===10){add(at,voice,root+12,1.7,.09,-.45);add(at+.75,voice,root+19,.8,.065,.4);}
      else if([12,13,14,20].includes(scene)){
        for(const interval of[0,7,15])add(at,scene===14?'organ':scene===20?'pad':'strings',root+interval,1.95,.048,(interval-7)/20,{scene,role:'harmony'});
        if(scene===14||scene===20)for(let k=0;k<4;k++)add(at+k*.5,'piano',root+12+[0,7,15,7][k],.6,.07,-.3+k*.2);
      }else if(scene===15){add(at,'tube',root,1.95,.075,-.2);}
      else if(scene===16){
        for(let k=0;k<8;k++){add(at+k*.25,'chip-triangle',root+(k%2?12:0),.22,.12,-.25,{channel:3});add(at+k*.25,'chip-noise',0,.05,k%2?.035:.065,.2,{channel:4});}
        for(let k=0;k<4;k++)add(at+k*.5,'chip-square2',root+24+[0,7,3,7][k],.18,.065,.3,{channel:2});
      }else{
        for(let k=0;k<4;k++)add(at+k*.5,scene===17?'fm-bass':'bass',root,.35,.1,-.15);
        for(const interval of[12,15,19,26])add(at+.25,scene===17?'midi':'pad',root+interval,.4,.035,(interval-18)/16);
      }
    }
    if(scene===1||scene===6||scene===7||scene===8||scene===19) {
      for(let k=0;k<12;k++){
        const instrument=scene===8?'tabla':scene===7?'wood':'drum';
        add(start+k*.5,instrument,k%2?57:38,.24,k%2?.07:.13,k%2?.25:-.15);
        if(scene===19)add(start+k*.5+.25,'hat',0,.08,.035,.35);
      }
    }
    if(scene!==16)for(let k=0;k<12;k++)add(start+k*.5+.25,'chain',0,.09,.017,k%2?.3:-.3);
    add(start,'bell',86,.38,.04,.1,{scene,role:'crossing'});
  }
  for(const cue of CUES) {
    if(['coin','message','flash','bell'].includes(cue.type))add(cue.time,cue.type,cue.id==='one-up'?88:cue.type==='bell'?86:81,cue.type==='bell'?.49:.3,cue.type==='flash'?.105:.13,.05,{cue:cue.id});
    if(cue.type==='bend')add(cue.time,'scope',74,.85,.12,0,{bend:7,cue:cue.id});
    if(cue.type==='restore')add(cue.time,'scope',74,.3,.1,0,{cue:cue.id});
  }
  // All twenty scene timbres return as a softly braided, increasingly sparse reprise.
  const reprise=['chant','harp','bronze','pipa','guqin','dizi','ocarina','sitar','xiao','gamelan','shamisen','strings','tense-strings','organ','scope','chip-square','midi','fm-ep','pop','piano'];
  for(let i=0;i<20;i++) {
    const octave=i<5?-12:i>15?12:0,pan=(i/19-.5)*1.4;
    for(const [beat,note,length]of MOTIF){
      const time=125+beat*.5+(i%4)*.012;
      add(time,reprise[i],note+octave,length*.5+.18,.012*(.78**(beat/4)),pan,{scene:i+1,role:'outro-reprise'});
    }
    for(let bar=3;bar<5;bar++){
      const time=125+bar*2+(i%4)*.125,note=[62,69,65,67,64][i%5]+octave;
      add(time,reprise[i],note,Math.min(1.8,136.3-time),.019*(.55**bar),pan,{scene:i+1,role:'outro-coda'});
    }
  }
  return events.sort((a,b)=>a.time-b.time||a.instrument.localeCompare(b.instrument));
}
export const SCORE_METADATA=Object.freeze({title:'The Reedwheel Variations',composer:'Original procedural composition for Pelican Test 2',duration:DURATION,sampleRate:SAMPLE_RATE,channels:2,sampleFrames:SAMPLE_FRAMES,bpm:BPM,barOrigin:5,motif:MOTIF,profiles:PROFILES,vapor:{rate:VAPOR_RATE,sourceBpm:VAPOR_SOURCE_BPM,transposeSemitones:4,lowpassHz:4000,reverbSeconds:4,wowHz:.5,loop:{start:109,end:110,repeatCount:4,outputFragmentSeconds:.25},segments:vaporSegments()},cues:CUES});
