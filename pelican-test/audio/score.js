import {SCENES,smooth} from '../src/beat/timeline.js';
export const MELODY=Object.freeze([62,69,65,64,67,65,64,69,72,69,64,62]);
export const TAPE_RATE=2**(-4/12);
export const TAPE_SOURCE_BPM=120/TAPE_RATE;
export const VOICES=Object.freeze(['chant','harp','bell','pipa','guqin','dizi','ocarina','sitar','xiao','gamelan','shamisen','strings','strings','piano','sine','square1','midi','tape','pop','piano']);
export function buildScore(){const events=[];const add=(time,duration,midi,voice,velocity=.15,extra={})=>events.push({time,duration:Math.min(duration,137-time),midi,voice,velocity,pan:0,kind:'note',role:'accompaniment',scene:0,...extra});
add(0,3.0,38,'strings',.17,{role:'intro'});add(1,3.5,45,'strings',.10,{role:'intro'});add(3,1.7,50,'bell',.10,{role:'intro'});
for(const s of SCENES){const voice=VOICES[s.id-1];for(let i=0;i<12;i++){const kind=s.id===16&&i===5?'coin':'note';add(s.start+i*.5,.43,MELODY[i],voice,.16,{scene:s.id,role:'melody',kind});}
if(s.id===16){for(let i=0;i<12;i++){add(s.start+i*.5,.40,i%4===0?38:45,'triangle',.09,{scene:16});add(s.start+i*.5+.25,.19,[53,57,60][i%3],'square2',.035,{scene:16});add(s.start+i*.5,.06,0,'noise',i%2?.035:.06,{scene:16,role:'percussion'});}continue;}
if(s.id===18){add(s.start,6,0,'tape',1,{scene:18,kind:'tape',role:'effect'});continue;}
for(let bar=0;bar<3;bar++){const root=[50,46,48][bar];if(![9,15].includes(s.id)){add(s.start+bar*2,1.65,root,s.id===14?'organ':s.id===20?'synth':voice,.045,{scene:s.id,pan:-.22});add(s.start+bar*2+.5,1.1,root+7,s.id===14?'organ':s.id===20?'synth':voice,.032,{scene:s.id,pan:.24});}}
for(let i=0;i<12;i++){const drum=s.id===1?'handdrum':s.id===6?'handdrum':s.id===7?'wooddrum':s.id===8?'tabla':s.id===19?'popdrum':s.id===10?'gamelan':s.id===17?'message':'chain';add(s.start+i*.5,.09,drum==='gamelan'?81:0,drum,[5,9,14,15].includes(s.id)?.008:i%2?.014:.029,{scene:s.id,role:'percussion'});}
if(s.id===6)add(s.start,1.8,45,'gong',.06,{scene:6});
if(s.id===15){add(s.start,6,43,'hum',.025,{scene:15,role:'ambience'});add(91,.5,77,'sine',.09,{scene:15,kind:'fault',role:'effect'});}
if(s.id===13)add(79,.5,87,'strings',.10,{scene:13,kind:'scream',role:'effect'});
}
for(let beat=0;beat<16;beat++){const t=125+beat*.5,fade=1-smooth((t-129)/4);for(let j=0;j<20;j++){const v=VOICES[j]==='tape'?'fm-sax':VOICES[j];add(t,.42,MELODY[beat%12]+(j%5===0?-12:j%5===4?12:0),v,.018*fade,{role:'orchestra',pan:(j/19-.5)*1.2});}
// Secondary instruments also return in the ensemble, spaced below the melody.
for(const [j,v]of ['handdrum','wooddrum','tabla','gong','organ','hum','triangle','square2','noise','message','fm-epiano','fretlessbass','gateddrums','synth','popdrum'].entries()){const percussion=['handdrum','wooddrum','tabla','noise','message','gateddrums','popdrum'].includes(v);if(v==='gong'&&beat%4)continue;add(t,percussion?.10:.38,percussion?0:(v==='fretlessbass'?38:[50,57,60][j%3]),v,(percussion?.010:.012)*fade,{role:'orchestra',pan:(j/14-.5)*1.1});}}
add(129,.09,0,'shutter',.055,{role:'effect'});add(131,.09,0,'shutter',.045,{role:'effect'});add(136.5,.49,86,'cyclebell',.35,{kind:'final-bell',role:'effect'});
return events.sort((a,b)=>a.time-b.time);
}
