import {cached, rng, path, line, ellipse, text, TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
import {smooth} from '../beat/timeline.js';

const BLACK='#252821', WHITE='#e3dfcc', FAINT='#969988';
const stroke=(c,d,w=2.2,col=WHITE)=>path(c,d,null,col,w*1.35);

function cloud(c,x,y,s=1){
  c.save();c.translate(x,y);c.scale(s,s);
  stroke(c,'M-65 9 C-95 9-91-16-72-16 C-53-16-51 5-66 4 C-76 4-74-7-67-7 M-57-13 C-46-39-18-37-9-17 C1-35 28-31 33-13 C64-24 79 2 58 14 L-65 14',1.4);
  stroke(c,'M-45 4 Q-24-9-9 4 Q8-7 23 4 L51 4 M-30 23 L49 23',1);
  c.restore();
}
function beast(c,x,y,s=1){
  c.save();c.translate(x,y);c.scale(s,s);
  stroke(c,'M-90 5 Q-57-7-39 0 Q-18 13 11-1 L41-17 L56-39 L72-32 L87-16 L65-9 L58 4 L39 12 L15 10 Q-7 33-38 21 L-68 18 Q-87 38-106 24 Q-117 13-107 5 Q-98-2-91 5 Q-84 16-98 19',2.5);
  stroke(c,'M-42 21 L-33 42 L-6 42 L-24 30 L-16 20 M28 12 L49 34 L75 34 L57 24 L55 4 M57-39 L54-59 L66-43 M70-31 L75-49 L81-27',2);
  for(let i=0;i<10;i++)stroke(c,`M${-56+i*9} ${6+Math.sin(i)*3} l8 8 l-8 7`,1);
  stroke(c,'M-27-1 Q-58-45-88-38 Q-65-17-43-13 M-22-4 Q-40-54-63-58 Q-47-29-30-21',1.5);
  ellipse(c,68,-23,2,2,WHITE);c.restore();
}
function staticStone(c){
  c.fillStyle=BLACK;c.fillRect(-389,0,1778,1000);
  const r=rng(7339);
  for(let i=0;i<26000;i++){
    let x=-389+r()*1778,y=r()*1000;
    c.globalAlpha=.035+r()*.09;c.fillStyle=i%5?'#aaa993':'#050b08';
    c.fillRect(x,y,.5+r()*2,.3+r()*1.4);
  }
  c.globalAlpha=1;
  // Fragments of the stone's outer lip and the paired relief registers.
  for(const y of [43,51,312,321,843,853,951,961])line(c,[[-389,y],[1389,y]],y<60||y>940?FAINT:WHITE,y%2?1.4:.8);
  for(let x=-380;x<1390;x+=48){
    stroke(c,`M${x} 53 v17 h29 v-10 h-19 v20 h35`,1.2,FAINT);
    if(!((x>-290&&x<-90)||(x>1060&&x<1290)))stroke(c,`M${x} 932 l23-18 l23 18 l-23 18 Z M${x+11} 933 l12-9 l12 9 l-12 9 Z`,1.2,FAINT);
  }
  for(let x=-315;x<1390;x+=354){cloud(c,x,112,1.3);if(Math.abs(x+140-500)>180)beast(c,x+140,269,.62);}
  // Inscription occupies its own stone register, with no modern caption card.
  // All identification is supplied below the external gallery frame. The
  // stone's upper register remains relief ornament, not a modern title card.
  beast(c,290,244,.93);beast(c,740,244,.93);
  cloud(c,500,167,1.2);
  // Shallow architectural relief behind the passage; quiet enough for white figures.
  c.globalAlpha=.34;
  for(const x of [-350,1190]){
    stroke(c,`M${x-90} 580 v-168 h180 v168 M${x-109} 412 l52-21 h113 l52 21 Z M${x-69} 392 l39-26 h90 l39 26 M${x-40} 580 v-138 h80 v138 M${x-102} 583 h204`,2,FAINT);
    for(let i=0;i<8;i++)stroke(c,`M${x-83+i*24} 416 v13`,1,FAINT);
  }
  for(const [x,y,s] of [[-60,361,.55],[310,366,.5],[750,367,.65],[1070,350,.4]])cloud(c,x,y,s);
  c.globalAlpha=1;
  // The lower register is a continuous incised wave with fishes, a typical relief rhythm.
  for(let x=-380;x<1390;x+=110){
    stroke(c,`M${x} 894 q28-31 55 0 t55 0 M${x} 901 q28-31 55 0 t55 0`,1.1,FAINT);
    stroke(c,`M${x+23} 882 q17-16 34 0 q-17 13-34 0 l-8-8 v16 Z`,1.2,FAINT);
  }
  // Hairline stone fractures deliberately stop short of important outlines.
  c.globalAlpha=.24;
  stroke(c,'M-230 0 l25 105 l-15 57 l36 73 l-11 62 M1008 0 l-28 56 l18 80 l-27 79 l11 85 M-373 662 l78 23 l18 43 l71 18 M1122 998 l-20-59 l29-48',1.3,FAINT);
  c.globalAlpha=1;
}

function wheel(c,x,y,r,a){
  ellipse(c,x,y,r,r,BLACK,WHITE,2.6);ellipse(c,x,y,r-5,r-5,null,WHITE,1);
  for(let i=0;i<12;i++){const q=a+i*TAU/12;line(c,[[x,y],[x+Math.cos(q)*(r-6),y+Math.sin(q)*(r-6)]],WHITE,1.1);}
  ellipse(c,x,y,8,8,BLACK,WHITE,2);ellipse(c,x,y,2,2,WHITE);
}

function official(c,x,y,s=1,turn=0,driver=false){
  c.save();c.translate(x,y);c.scale(s,s);
  // The leader's head turns alone; his body and ritual bearing never change.
  const head=turn>.35?-1:1;
  path(c,'M-13-107 L-25-42 L-41 0 L32 0 L13-107 Z',BLACK,WHITE,2.7);
  stroke(c,'M-9-99 L10-59 L20-5 M-20-48 L25-40 M-13-45 L-17-6 M-4-43 L-5-3',1.1);
  stroke(c,'M-23-91 L-45-58 L-22-44 L8-62 M11-91 L28-71 L55-75',2);
  if(driver)stroke(c,'M50-75 L145-28 M47-71 L150-22',.9);
  else stroke(c,'M55-75 L86-72 L116-92',1);
  stroke(c,'M-23 0 L-30 21 L-8 21 M16 0 L22 21 L42 21',2.4);
  c.save();c.translate(0,-116);c.scale(head,1);
  stroke(c,'M-9-13 L9-13 L10-5 L17 0 L10 4 L8 16 L-6 17 L-13 7 Z',1.7);
  stroke(c,'M-14-13 L-15-29 L10-30 L13-14 Z M-15-24 h28 M-10 12 L-10 27 L-1 22',1.6);
  ellipse(c,7,-2,1.3,1.3,WHITE);c.restore();c.restore();
}

function horse(c,x,ground,s,at,phase=0,harness=false){
  c.save();c.translate(x,ground);c.scale(s,s);
  const a=at*TAU*.55+phase;
  // Far legs first, with a measured four-beat walking cycle.
  c.globalAlpha=.63;
  for(const [root,ph] of [[-69,0],[64,Math.PI]]){
    const swing=Math.sin(a+ph)*15,lift=Math.max(0,Math.cos(a+ph))*9;
    stroke(c,`M${root} -138 L${root-15-swing} -72 L${root+10+swing} ${-8-lift} l19 3 l-2 5 h-27`,3);
  }
  c.globalAlpha=1;
  path(c,'M-106-174 Q-77-203-22-184 Q20-180 56-187 L80-240 L83-279 L101-305 L109-282 L128-278 L140-250 L176-235 L171-217 L137-214 L116-227 L104-165 Q91-139 59-134 L-42-137 Q-80-135-96-155 Z',BLACK,WHITE,2.8);
  // Tail, mane, muzzle, and distinctive long arched Han horse neck.
  stroke(c,'M-102-174 Q-126-181-133-144 L-140-109 Q-125-129-122-151 M85-274 Q63-263 70-227 L52-190 M93-276 L83-252 M93-262 L81-239 M95-250 L82-227 M101-239 L86-213',2);
  stroke(c,'M132-255 L139-230 L171-225 M122-274 L112-266 M107-299 L101-286',1.4);
  ellipse(c,126,-252,2.1,2.1,WHITE);
  stroke(c,'M-48-177 Q-21-168 19-176 L24-145 L-43-147 Z M-43-170 L19-169 M-45-153 L20-153',1.5);
  for(let i=0;i<8;i++)stroke(c,`M${-41+i*8} -167 l4 8 l-4 5`,.9);
  for(const [root,ph] of [[-71,Math.PI],[66,0]]){
    const swing=Math.sin(a+ph)*19,lift=Math.max(0,Math.cos(a+ph))*12;
    stroke(c,`M${root} -143 L${root+12+swing} -79 L${root-5-swing} ${-8-lift} l23 4 l-1 5 h-30`,3.1);
    stroke(c,`M${root+4} -137 L${root+17+swing} -81`,1);
  }
  stroke(c,'M119-266 Q109-221 135-218 L149-224 M137-218 L33-166',1.2);
  if(harness){
    stroke(c,'M83-230 L62-177 L87-142 M71-209 L-74-168 M57-179 L-111-156 M58-150 L-115-128',2);
    for(const xx of [-63,-25,13,50])ellipse(c,xx,-171,3,3,WHITE);
  }
  c.restore();
}

function chariot(c,x,at){
  c.save();c.translate(x,805);
  // Tall curved canopy, suspended tassels, paneled carriage and two true axle wheels.
  stroke(c,'M-107-335 Q-32-398 49-357 L112-335 Z M-106-331 h217 M-77-334 L-63-159 M79-334 L69-156',2.5);
  for(let i=0;i<8;i++)stroke(c,`M${-92+i*27} -334 v18 l-4 8 l4 5 l4-5 l-4-8`,1.1);
  stroke(c,'M-10-373 L-10-385 L12-385 L12-373 M-69-346 Q-20-375 39-354',1.4);
  official(c,9,-135,.93,0,true);
  path(c,'M-91-173 L86-173 L75-94 L-78-94 Z',BLACK,WHITE,2.5);
  for(let i=0;i<6;i++){
    const z=-72+i*25;stroke(c,`M${z} -162 v56 h18 v-56 Z M${z+2} -145 l7-10 l7 10 l-7 10 Z`,1);
  }
  stroke(c,'M-94-176 h184 M-83-91 h166 M53-112 L292-141 M63-102 L295-129',2.5);
  c.save();c.globalAlpha=.6;wheel(c,43,-70,69,at*105/69);c.restore();
  wheel(c,-46,-70,70,at*105/70);
  stroke(c,'M-106-122 Q-134-121-130-151 L-122-176 M-93-185 h184',1.5);
  c.restore();
}

function carvedPelican(c,at){
  const p=poseAt(at);c.save();c.translate(500,805);
  for(const x of [-106,111])wheel(c,x,-62,62,p.wheelAngle);
  const crank=[p.crank.x,p.crank.y];
  path(c,'M-106-62 L-51-150 H65 L111-62 L-8-71Z',BLACK);
  stroke(c,'M-106-62 L-51-150 L-8-71 Z M-51-150 H65 L111-62 L-8-71 L65-150 M65-150 L64-180 L87-191 L99-188 M-51-150 L-54-173 M-77-173 H-39',3);
  ellipse(c,-8,-71,18,18,BLACK,WHITE,2);
  const leg=(i,opacity=1)=>{const k=p.knees[i],f=p.feet[i];c.globalAlpha=opacity;line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],WHITE,3);line(c,[[f.x-9,f.y],[f.x+12,f.y]],WHITE,3);line(c,[crank,[f.x,f.y]],WHITE,2);c.globalAlpha=1;};
  leg(1,.5);
  c.save();c.translate(0,p.bob);
  path(c,'M-101-200 Q-139-222-113-252 Q-81-281-39-262 L12-240 Q-1-300 29-324 Q51-339 72-320 Q88-303 65-287 Q47-277 56-228 Q49-193-14-184 Q-66-178-101-200 Z',BLACK,WHITE,2.8);
  path(c,'M69-315 L232-303 Q201-290 79-295 L67-299 Z',BLACK,WHITE,2);
  stroke(c,'M79-295 Q142-258 194-297 M-108-211 L-149-222 L-125-220 L-141-236 L-104-222',2);
  stroke(c,'M-93-242 Q-45-267 8-214 Q-35-191-89-224 Z',2);
  for(let i=0;i<8;i++)stroke(c,`M${-85+i*10} ${-237+i*.9} q8 16 27 24`,1);
  for(let i=0;i<10;i++)stroke(c,`M${91+i*8} ${-293+i*.1} l4 ${10+Math.sin(i/3)*7}`,1);
  stroke(c,'M10-222 L38-188 L86-191',3);
  ellipse(c,61,-314,3.4,3.4,WHITE);ellipse(c,62,-314,1.4,1.4,BLACK);
  // Parallel cuts on the neck make the bird belong to the same stone as the horses.
  stroke(c,'M22-306 Q16-282 25-259 M28-302 Q23-283 31-265 M35-298 Q29-282 37-267',.9);
  c.restore();leg(0);c.restore();
}

function dryRubbing(c){
  const r=rng(7340);
  for(let i=0;i<17000;i++){
    c.globalAlpha=.18+r()*.6;c.fillStyle=BLACK;
    c.fillRect(-389+r()*1778,r()*1000,.4+r()*2.5,.3+r()*1.4);
  }
  for(let i=0;i<130;i++){
    let x=-389+r()*1778,y=r()*1000;c.globalAlpha=.5;
    line(c,[[x,y],[x+4+r()*14,y-r()*2]],BLACK,.5+r()*1.1);
  }
  c.globalAlpha=1;
}

export function renderSubject(c,t,scene){carvedPelican(c,scene.start+t);}

export function galleryPose(t){
  const q=Math.max(0,Math.min(6,t));
  const x=q<2?215*q:q<=4?430+(q-2)*65:560+510*smooth((q-4)/2);
  const edge=smooth(Math.min(q,6-q)/.65);
  return {x,y:805,scale:.82-.15*edge,angle:0,poseTime:17+q};
}
function reliefCuts(c){
  const r=rng(7341);
  // Broken chisel cuts affect the original white relief as well as new figures.
  for(let i=0;i<6000;i++){const x=r()*1000,y=350+r()*470;c.globalAlpha=.25+r()*.6;line(c,[[x,y],[x+2+r()*7,y+.5+r()*2]],BLACK,.8+r()*2);}c.globalAlpha=1;
}
export function renderGallery(c,t,scene){
  const at=scene.start+t,p=galleryPose(t);cached(c,'han-gallery-stone-v5',staticStone);
  // Compact complete carriage, paired horses and two officials all fit within
  // the square. The central gap is reserved for the solemn third vehicle.
  // Keep the entire procession in motion with its newest vehicle. A static cart
  // on the same baseline would be physically ridden through during entry.
  c.save();c.translate(p.x-290,805);c.scale(.76,.76);c.translate(0,-805);chariot(c,0,at);c.restore();
  horse(c,p.x+310,805,.72,at,.2,true);horse(c,p.x+459,805,.55,at,1.7,true);
  official(c,p.x-135,789,.81,0);official(c,p.x+195,789,.75,t>2&&t<4?1:0);
  stroke(c,`M${p.x-103} 737 q18-8 35-17 M${p.x+227} 742 L${p.x+369} 675`,1.5);
  if(scene.subject!==false){c.save();c.translate(p.x,p.y);c.scale(p.scale,p.scale);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();}
  line(c,[[0,808],[1000,808]],WHITE,2.8);line(c,[[0,817],[1000,817]],FAINT,1.1);
  cached(c,'han-relief-chisel-v6',reliefCuts);cached(c,'han-dry-rubbing-7340-v3',dryRubbing);
}

export default function renderAt(c,t,scene){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  const at=scene.start+t;
  cached(c,'han-stone-7339-v4',staticStone);
  // This is a solemn procession, not a chase. Every gait shares one walking tempo.
  const drift=Math.sin(t*.55)*5;
  chariot(c,-152+drift,at);
  horse(c,132+drift,805,.84,at,.2,true);
  horse(c,1040+drift,805,.9,at,1.7,true);
  horse(c,1308+drift,805,.78,at,3.5,true);
  const glance=Math.max(0,1-Math.abs(t-3)/.72);
  official(c,792+drift,784,.91,glance);
  // The lead rope remains connected while the keeper looks back at the odd member.
  stroke(c,`M${842+drift} 716 Q${894+drift} 735 ${1040+drift+137*.9} ${805-218*.9}`,1.2);
  if(scene.subject!==false)renderSubject(c,t,scene);
  line(c,[[-389,808],[1389,808]],WHITE,2);
  line(c,[[-389,816],[1389,816]],FAINT,.9);
  c.save();c.globalAlpha=.45;
  for(let i=-10;i<26;i++){
    const x=i*76-(at*105%76);stroke(c,`M${x} 825 l25-2 m8 0 l12-1`,1,WHITE);
  }
  c.restore();
  cached(c,'han-dry-rubbing-7340-v3',dryRubbing);
}
