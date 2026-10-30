import {cached,path,line,text,rng,rect} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {smooth,clamp} from '../beat/timeline.js';

// Original expressionist stairwell. All irregular plaster and film grain is baked.
function stairwell(c){
  rect(c,-389,0,1778,1000,'#55584f');
  path(c,'M -389 0 L 302 0 L 134 1000 L -389 1000 Z','#76786c');
  path(c,'M 302 0 L 1015 0 L 1389 1000 L 134 1000 Z','#a5a590');
  path(c,'M 932 0 L 1389 0 L 1389 1000 L 1120 1000 Z','#353b37');
  // An impossible trapezoidal shaft of lamplight, rather than a borrowed film set.
  path(c,'M 889 109 L 1055 196 L 922 951 L -190 951 Z','#b8b59f');
  path(c,'M -389 0 L -253 0 L 199 1000 L 58 1000 Z','#252d29');
  path(c,'M 1013 0 L 1053 0 L 1224 1000 L 1178 1000 Z','#1b2422');
  // Crooked plaster seams make the wall plane tangible behind the projected bird.
  line(c,[[298,0],[269,218],[227,452],[183,734],[134,1000]],'#555d52',3);
  line(c,[[-389,383],[207,319],[1029,385]],'#8d907d',2);
  line(c,[[-389,710],[171,680],[1113,720]],'#a09f8b',2);
  path(c,'M 1084 105 L 1263 141 L 1297 401 L 1099 358 Z','#141d1c','#7f8472',7);
  for(let i=0;i<3;i++){
    path(c,`M ${1110+i*47} ${137+i*9} L ${1140+i*47} ${143+i*9} L ${1162+i*50} ${360+i*10} L ${1128+i*49} ${354+i*10} Z`,'#c2c2a9');
  }
  // Stair silhouette climbs through the right extension; its rail is a hard diagonal.
  path(c,'M 664 1000 L 664 927 L 771 927 L 771 860 L 872 860 L 872 790 L 971 790 L 971 718 L 1072 718 L 1072 647 L 1172 647 L 1172 575 L 1277 575 L 1277 505 L 1389 505 L 1389 1000 Z','#343c36');
  for(let i=0;i<7;i++){
    const x=665+i*102,y=927-i*70;
    line(c,[[x,y],[x+102,y]],'#a7ab95',3);
    line(c,[[x+20,y-35],[x+21,y-211]],'#27322d',7);
  }
  line(c,[[682,721],[1389,232]],'#202c27',13);
  line(c,[[679,710],[1389,221]],'#939a85',2);
  // A quiet common horizon makes the return to the next scene legible.
  line(c,[[-389,805],[1389,805]],'#333e3560',1.4);
  const r=rng(8582);
  c.save();
  for(let i=0;i<15500;i++){
    const x=r()*1778-389,y=r()*1000;
    c.globalAlpha=.025+r()*.075;c.fillStyle=r()>.42?'#172320':'#eee6c5';
    c.fillRect(x,y,.4+r()*1.9,.3+r()*1.1);
  }
  c.globalAlpha=.12;
  for(let i=0;i<72;i++){
    const x=r()*1778-389,y=r()*1000;
    line(c,[[x,y],[x+r()*9-4,y+13+r()*68]],'#e4ddbe',.45);
  }
  c.restore();
  const v=c.createRadialGradient(530,490,280,500,510,1050);
  v.addColorStop(0,'#0c171700');v.addColorStop(.7,'#0c171724');v.addColorStop(1,'#06110eee');
  rect(c,-389,0,1778,1000,v);
  // Hand-set silent-film lettering, printed directly into the architecture.
  c.save();c.translate(76,68);c.rotate(-.028);
  line(c,[[-22,7],[-15,-7],[328,-7],[349,7]],'#202b26',2);
  text(c,'默片阴影',0,51,46,'#1c2824',{weight:700});
  text(c,'Silent-film Shadow',1,90,27,'#26312b',{italic:true});
  text(c,'1 9 2 2',2,130,27,'#29362e');
  path(c,'M 165 115 L 187 125 L 165 135 L 170 125 Z','#2b382f');
  line(c,[[0,151],[113,151],[121,143],[130,151],[329,151]],'#26352c',1.5);
  c.restore();
}

export default function renderAt(c,t,scene){
  const absolute=scene.start+t;
  cached(c,'shadow:8582:original-stairwell-v1',stairwell);
  if(scene.subject!==false)renderSubject(c,t,scene);
  // Film gate marks drift analytically; no frame history, noise, or random flicker.
  c.save();c.globalAlpha=.1;
  const scratchX=-280+((absolute*9)%1620);
  line(c,[[scratchX,0],[scratchX+2,1000]],'#e9e3c3',.55);
  c.restore();
}

export function renderSubject(c,t,scene){
  const absolute=scene.start+t;
  // Ascent, uncanny enlarged pause, and an exact return before the green handoff.
  const grow=smooth(t/1.8),settle=1-smooth((t-3.55)/2.15);
  const projection=grow*settle;
  const ascend=smooth((t-.2)/3.1)*settle;
  c.save();c.translate(500-38*projection,805-105*ascend);
  c.transform(1+.42*projection,-.065*projection,-.14*projection,1+.38*projection,0,0);
  pelican(c,absolute,{x:0,y:0,scale:1,style:'shadow',ink:'#151d1b',feathers:false});
  // The projection has settled at t=5.7. No opacity trick conceals a pose jump.
  const electricity=smooth(clamp((t-5.5)/.5));
  if(electricity>0){
    c.save();c.globalAlpha=electricity*.9;
    pelican(c,absolute,{x:0,y:0,scale:1,style:'glow',ink:'#86ffad',feathers:false});
    c.restore();
  }
  c.restore();
}

function stairWallV2(c){
 rect(c,0,0,1000,1000,'#b6b6a8');
 path(c,'M0 0H1000V1000H0Z','#b1b2a3');
 path(c,'M0 0H238L92 1000H0Z','#3b433d');
 path(c,'M238 0L958 0L1000 185L84 1000Z','#cbcab8');
 path(c,'M0 355L1000 100L1000 630L0 980Z','#dedcca');
 path(c,'M932 0H1000V1000H982Z','#182520');
 for(let i=0;i<7;i++){const y=110+i*145;line(c,[[140,y+70],[1000,y-100]],'#878e8060',1.2);}
 // An original low stair and landing, with a continuous diagonal projected path.
 const pts=[[0,1000],[0,980]];for(let i=0;i<11;i++){const x=i*98,y=980-i*18;pts.push([x,y],[x+98,y],[x+98,y-18]);}pts.push([1100,1000]);
 line(c,pts,'#1f2d27',7);path(c,'M0 985L1000 797V1000H0Z','#29382f');
 for(let i=0;i<11;i++){const x=i*97,y=984-i*18;line(c,[[x,y],[x+97,y]],'#9da392',2);}
 line(c,[[0,858],[1000,670]],'#273b30',9);
 for(let i=0;i<9;i++){const x=85+i*113,y=842-i*21.2;line(c,[[x,y],[x,y+115]],'#354535',4);}
 const r=rng(14222);c.save();for(let i=0;i<22000;i++){c.globalAlpha=.025+r()*.07;rect(c,r()*1000,r()*1000,.4+r()*2,.5+r()*1.5,r()>.55?'#faf2d1':'#16251b');}c.restore();
 const vignette=c.createRadialGradient(600,540,140,500,500,770);vignette.addColorStop(0,'#0b160a00');vignette.addColorStop(1,'#07150d9a');rect(c,0,0,1000,1000,vignette);
}
export function galleryPose(t){const u=clamp(t/6),projection=smooth(t/.6)*(1-smooth((t-.6)/5.4));return {x:1070*u,y:805+195*projection,scale:.93};}
export function renderGallery(c,t,scene){
 cached(c,'shadow-wall-v2-14222',stairWallV2);
 if(scene.subject!==false){
  const p=galleryPose(t);c.save();c.translate(p.x,p.y);c.transform(1,-.065,-.075,1.12,0,0);
  pelican(c,scene.start+t,{x:0,y:0,scale:p.scale,style:'shadow',ink:'#17271e',feathers:false});
  const on=smooth((t-5.5)/.5);if(on>0){c.save();c.globalAlpha=on;pelican(c,scene.start+t,{x:0,y:0,scale:p.scale,style:'glow',ink:'#86ffad',feathers:false});c.restore();}c.restore();
 }
 const scratch=60+((scene.start+t)*13%850);line(c,[[scratch,0],[scratch+2,1000]],'#e9e4cb35',.5);
}
