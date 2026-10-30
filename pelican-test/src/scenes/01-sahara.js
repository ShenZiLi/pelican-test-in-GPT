
import {cached,rng,path,line,ellipse,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
import {smooth} from '../beat/timeline.js';
const OCHRE='#843f29',DARK='#713c2a';
function rock(c){
 c.fillStyle='#b29369';c.fillRect(-389,0,1778,1000);const r=rng(7113);
 // Sloping bedding planes, mineral blooms and spalled lips establish a rock face.
 for(let i=0;i<13;i++){
  const x=-470+r()*1500,y=-100+r()*1050,w=180+r()*750,h=70+r()*260;
  c.globalAlpha=.16+r()*.15;
  path(c,`M${x} ${y} l${w*.39} ${-h*.21} l${w*.61} ${-h*.07} l${-w*.11} ${h*.65} l${-w*.47} ${h*.35} l${-w*.5} ${-h*.12}Z`,i%3?'#e3c9a0':'#6a543c');
  path(c,`M${x} ${y} l${w*.39} ${-h*.21} l${w*.61} ${-h*.07}`,null,'#eddbb7',1.4);
 }c.globalAlpha=1;
 for(let i=0;i<90;i++){const x=r()*1778-389,y=r()*1000,rad=40+r()*180,g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,i%2?'#4e3e2822':'#f8e3b627');g.addColorStop(1,'#c4ab8100');c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(const d of ['M-70 70 L90 154 L179 162 L245 240 L409 267 L478 317','M795 -40 L721 101 L760 202 L701 296 L746 384','M1120 380 L909 456 L873 543 L913 630 L851 694 L878 855 L797 1000','M-40 736 L141 697 L182 724 L312 702']){path(c,d,null,'#e0c59c',5);path(c,d,null,'#68543c',1.8);}
 for(let i=0;i<32000;i++){c.globalAlpha=.05+r()*.17;c.fillStyle=i%3?'#ecd2a5':'#493b2c';c.fillRect(r()*1778-389,r()*1000,.5+r()*4,.4+r()*2);}c.globalAlpha=1;
 c.save();c.globalAlpha=.19;c.translate(480,165);c.rotate(-.12);path(c,'M-142 6 Q-123-21-62-9 L5-14 L29-33 L47-24 L31-6 L2 6 L-96 18Z',OCHRE);line(c,[[-104,11],[-119,54]],OCHRE,6);line(c,[[-28,8],[-12,47]],OCHRE,6);path(c,'M29-31 q-7-34 12-28 M40-27 q26-32 24-13',null,OCHRE,4);c.restore();
}
function cattle(c,x,y,s,t,index){
 const stop=2+index*.12,clock=Math.min(t,stop),turn=smooth((t-stop)/.32);c.save();c.translate(x-clock*13,y);c.scale(s,s);c.rotate(index===1?-.075:.025);const color=index===1?'#a05e3a':OCHRE;
 for(const [xx,ph] of [[-67,0],[-35,1],[37,2],[61,3]])line(c,[[xx,-43],[xx+Math.sin(clock*3+ph)*8,-9],[xx-7+Math.sin(clock*3+ph)*12,17]],color,7-index*.7);
 path(c,'M-92-71 Q-96-108-44-108 Q-6-111 49-101 L71-80 L60-44 Q0-30-64-43 L-84-58Z',color);path(c,'M-86-79 Q-116-80-119-41 L-125-22',null,color,4);
 // The heads swing down toward the unusual traveller, then hold.
 c.save();c.translate(60,-86);c.rotate(turn*.77);path(c,'M-3-13 L38-38 L65-30 L74-5 L54 7 L18-1 L4 18Z',color);path(c,'M41-34 Q17-71 34-89 M57-31 Q86-64 69-87',null,color,5);line(c,[[40,-11],[65,-5]],DARK,2.5);ellipse(c,54,-22,2.7,2.7,'#ddbf8d');c.restore();c.save();c.globalAlpha=.23;for(let j=0;j<6;j++)line(c,[[-70+j*20,-89],[-77+j*20,-53]],'#d1ad77',4+j%2);c.restore();c.restore();
}
function herder(c,x,y,s,t,index){
 const stop=2+index*.17,clock=Math.min(t,stop),look=smooth((t-stop)/.23),gait=Math.sin(clock*3+index);c.save();c.translate(x-clock*13,y);c.scale(s,s);c.rotate(index===1?-.1:.05);
 line(c,[[-9,-53],[-16,-12],[-29-gait*13,23]],OCHRE,8);line(c,[[5,-54],[19,-9],[25+gait*13,18]],OCHRE,7);path(c,'M-15-119 L10-123 L20-52 L-12-49 L-26-83Z',OCHRE);
 line(c,[[9,-106],[38,-91-look*30],[61,-82-look*44]],OCHRE,7);line(c,[[59,-126-look*8],[65,-3-look*12]],DARK,5);line(c,[[-15,-105],[-43,-73],[-42,-47]],OCHRE,6);
 c.save();c.translate(-1,-143);c.rotate(look*.85);ellipse(c,0,0,14,19,OCHRE);path(c,'M7-7 L27 3 L10 9Z',OCHRE);c.restore();c.restore();
}
function rider(c,t){
 const p=poseAt(t);c.save();c.translate(500,805);
 for(const x of [-106,111]){const pts=Array.from({length:43},(_,i)=>{const a=i/42*TAU,r=61+Math.sin(i*2.3)*1.3;return[x+Math.cos(a)*r,-62+Math.sin(a)*r];});line(c,pts,OCHRE,5.2);for(let j=0;j<6;j++){const a=p.wheelAngle+j*TAU/6;line(c,[[x,-62],[x+Math.cos(a)*59,-62+Math.sin(a)*59]],OCHRE,3);}}
 line(c,[[-106,-62],[-52,-153],[-8,-71],[-106,-62]],OCHRE,6);line(c,[[-52,-153],[65,-153],[111,-62],[-8,-71],[65,-153],[62,-184],[94,-191]],OCHRE,5);line(c,[[-75,-177],[-39,-177]],OCHRE,7);
 for(const i of [1,0]){const k=p.knees[i],f=p.feet[i];line(c,[[-39,-181],[k.x,k.y],[f.x,f.y],[f.x+15,f.y+2]],OCHRE,6);}c.translate(0,p.bob);
 path(c,'M-130-208 L-109-231 Q-67-269-14-242 L15-228 L21-295 Q15-324 45-334 Q70-342 79-317 L68-293 L60-260 L66-223 Q41-188-12-187 Q-79-180-103-200 L-151-219Z',OCHRE);path(c,'M66-320 L235-302 Q198-281 76-297 L67-302Z',OCHRE);path(c,'M78-296 Q142-262 197-292 L151-281 L105-284Z','#9c5231');line(c,[[5,-223],[35,-190],[93,-191]],OCHRE,8);ellipse(c,57,-320,3.3,3.3,'#d3b182');c.restore();
}
function abrasion(c){const r=rng(7114);for(let i=0;i<22000;i++){const x=r()*1778-389,y=r()*1000;c.globalAlpha=.16+r()*.34;path(c,`M${x} ${y} l${1+r()*4} ${r()*2} l${-r()*5} ${1+r()*3}Z`,i%5?'#c1a27a':'#6e533738');}c.globalAlpha=1;}
function group(c,t){cattle(c,232,424,1.18,t,0);cattle(c,655,345,.87,t,1);cattle(c,861,502,.64,t,2);herder(c,365,632,1.1,t,0);herder(c,735,660,.86,t,1);herder(c,160,571,.65,t,2);}
export function renderSubject(c,t,scene){rider(c,scene.start+t);}
export function renderGallery(c,t,scene){cached(c,'rock-strata-v3',rock);group(c,t);if(scene.subject!==false){c.save();c.translate(1070*Math.max(0,Math.min(6,t))/6,805);c.scale(.86,.86);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();}cached(c,'rock-abraded-pigment-v3',abrasion);}
export default function renderAt(c,t,scene){if(scene.gallery){renderGallery(c,t,scene);return;}cached(c,'rock-strata-v3',rock);group(c,t);if(scene.subject!==false)renderSubject(c,t,scene);cached(c,'rock-abraded-pigment-v3',abrasion);}
