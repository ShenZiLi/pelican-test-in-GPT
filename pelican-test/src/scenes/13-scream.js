import {cached,rng,path,line,ellipse,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
import {smooth} from '../beat/timeline.js';

// Original reverse-diagonal quay: the water spirals toward a distant promontory.
function landscape(c){
  c.fillStyle='#b75d3c';c.fillRect(-389,0,1778,1000);
  // Unequal strokes bend around the inlet, with quiet areas between them.
  const bands=[
    ['M-389 25 C-120 100 15-35 258 42 S621 149 932 41 S1190 4 1389 72','#e2a36a',49],
    ['M-389 111 C-111 222 108 31 340 135 S704 225 1032 121 S1255 98 1389 141','#8f3c36',61],
    ['M-389 137 C-90 259 120 100 338 179 S674 293 947 195 S1200 127 1389 212','#d8864b',39],
    ['M-389 264 C-80 350 151 216 358 289 S688 355 862 300 S1165 203 1389 310','#edb16b',54],
    ['M-389 310 C-79 445 158 264 385 359 S729 420 933 359 S1165 289 1389 366','#9a4439',57],
    ['M-389 380 C-113 487 162 355 378 408 S714 484 928 408 S1236 365 1389 447','#cf7944',40]
  ];
  for(const [d,col,w]of bands)path(c,d,null,col,w);
  const r=rng(8469);c.save();
  for(let i=0;i<310;i++){
    const x=r()*1778-389,y=r()*450,len=16+r()*92;
    c.globalAlpha=.14+r()*.28;
    path(c,`M${x} ${y} q${len*.42} ${Math.sin(x*.007+y*.013)*18} ${len} ${Math.sin(y*.01)*13}`,null,['#f2b96d','#8d4037','#d88b4d'][i%3],1+r()*6);
  }c.restore();
  path(c,'M-389 505 C-90 370 102 472 295 439 C493 430 552 328 705 374 C864 433 1091 388 1389 454 L1389 797 L-389 797Z','#293f46','#263c42',8);
  path(c,'M-389 564 C-107 446 130 545 338 474 C497 441 526 388 682 401 C488 444 598 519 375 552 C180 600-98 521-389 644Z','#698279');
  // Broad eddies, irregular lengths and gaps, rather than a ruled field of stripes.
  const pools=[['M-120 570 C50 460 260 613 448 526 S722 424 900 494','#8c9576',18],['M150 603 C405 624 471 462 671 462 C848 456 777 576 991 558','#a39b75',11],['M-230 656 C-10 557 234 692 413 618 S662 540 752 591','#3b6063',24],['M495 621 C655 504 863 676 1120 546 S1290 582 1389 589','#627e73',17]];
  for(const [d,col,w]of pools)path(c,d,null,col,w);
  path(c,'M1010 436 C900 398 818 441 774 463 C865 452 891 475 947 485 C1109 529 1293 504 1389 528 L1389 429Z','#253936','#607067',4);
  path(c,'M-389 810 L1389 533 L1389 1000 L-389 1000Z','#88674b','#293c3e',9);
  // Five structural deck boards establish perspective; broken scumbles describe wood.
  for(const y of [799,859,930,1013,1110])line(c,[[-420,y],[1410,y-277]],'#584736',5);
  c.save();for(let i=0;i<430;i++){const x=r()*1778-389,y=555+r()*445;if(y<750-x*.155)continue;c.globalAlpha=.2+r()*.35;const len=8+r()*65;path(c,`M${x} ${y} q${len*.45} ${-r()*7} ${len} ${-len*.15}`,null,['#c99f6a','#4c4439','#ac7b4b'][i%3],1+r()*4);}c.restore();
  // The far rail belongs behind the rider and the foreground spectator.
  for(let x=-360;x<1400;x+=145){const y=705-(x+389)*.155;line(c,[[x,y+77],[x-12,y-95]],'#263b3d',11);line(c,[[x-3,y+73],[x-15,y-92]],'#b18b5e',3);}
  for(const dy of [-98,-62,31]){line(c,[[-430,705+dy],[1420,418+dy]],'#233b3d',dy===-98?14:8);line(c,[[-430,701+dy],[1420,414+dy]],'#c19761',3);}
  c.save();for(let i=0;i<2600;i++){const x=r()*1778-389,y=r()*1000;c.globalAlpha=.025+r()*.04;line(c,[[x,y],[x+3+r()*9,y-r()*3]],i%2?'#f3dab0':'#172f36',.5+r()*1.4);}c.restore();
}

function spectator(c,t,scene={}){
  const nose=(scene.rider?.x??galleryPose(t).x)+220;
  const rise=smooth((nose-490)/90),mouth=smooth((nose-565)/65),q=smooth((nose-600)/85);
  c.save();c.translate(838,903);c.rotate(-.055*q);
  // A bundled commuter with a terracotta scarf, long olive coat, and intact hair.
  path(c,'M -25 -237 C -55 -210 -50 -140 -57 -26 Q -22 -13 42 -28 L 24 -225 Z','#384e46','#223e42',6);
  path(c,'M -23 -216 C -16 -158 -5 -94 -19 -29 M 7 -217 C 26 -151 12 -66 27 -29',null,'#7c805b',8);
  path(c,'M -26 -216 L 5 -178 L 25 -231 L 3 -248 Z','#b5754b','#294247',4);
  line(c,[[-28,-27],[-29,0],[-49,2]],'#263a3e',12);line(c,[[21,-27],[25,-2],[41,0]],'#263a3e',12);
  c.save();c.translate(-5-10*rise,-271);c.rotate(-.15*rise);
  path(c,'M -27 -12 C -27 -45 7 -52 25 -24 C 39 -1 23 29 1 34 C -17 29 -30 7 -27 -12 Z','#d3bd8b','#2c4143',4);
  path(c,'M -29 -12 C -39 -49 -5 -63 20 -42 Q 40 -29 27 -5 L 15 -26 L -3 -35 L -20 -18 Z','#323e3c','#8b704c',3);
  line(c,[[-19,-10],[-8,-12]],'#293f46',3.5);line(c,[[5,-14],[17,-13]],'#293f46',3.5);
  ellipse(c,-11-rise*2,-4,2.8,4,'#253c41');ellipse(c,11-rise*3,-5,2.8,4,'#253c41');
  path(c,'M 0 -3 L -4 9 L 4 10',null,'#9d7250',2);
  ellipse(c,1,21,4+mouth*7,2+mouth*15,'#293b3e','#a47a52',2);
  c.restore();
  // Elbows spread and hands arrive at the cheeks within the specified half-second.
  const ly=-140-112*q,ry=-149-111*q;
  line(c,[[-30,-216],[-69,-173-29*q],[-43+13*q,ly]],'#283e3e',20);
  line(c,[[25,-220],[67,-177-24*q],[45-20*q,ry]],'#293f40',20);
  line(c,[[-32,-214],[-68,-175-29*q],[-43+13*q,ly]],'#7f835e',7);
  line(c,[[25,-218],[65,-176-24*q],[45-20*q,ry]],'#7f835e',6);
  ellipse(c,-43+13*q,ly,8,17,'#c7b181','#344444',3);ellipse(c,45-20*q,ry,8,17,'#c7b181','#344444',3);
  if(q>.55){c.globalAlpha=(q-.55)*1.6;for(let i=0;i<3;i++)path(c,`M ${46+i*11} ${-300-i*8} q 17 22 8 42`,null,'#e3bb79',2.5);}
  c.restore();
}

function rider(c,at){
  const p=poseAt(at),ink='#273d40';
  c.save();c.translate(500,805);c.lineJoin='round';c.lineCap='round';
  ellipse(c,0,5,165,8,'#23383a55');
  for(const x of [-106,111]){
    ellipse(c,x,-62,62,62,'#40514b22',ink,7);ellipse(c,x,-62,57,57,null,'#b5ac7e',2);
    for(let i=0;i<12;i++){const a=p.wheelAngle+i*TAU/12;line(c,[[x,-62],[x+Math.cos(a)*58,-62+Math.sin(a)*58]],'#505e52',1.8);}
    ellipse(c,x,-62,5,5,'#c2ab75',ink,2);
  }
  line(c,[[-106,-62],[-51,-150],[-8,-71],[-106,-62]],ink,6);
  line(c,[[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150]],ink,6);
  line(c,[[-51,-150],[65,-150],[111,-62]],'#b47d4c',2.5);
  line(c,[[65,-150],[64,-180],[89,-191],[99,-188]],ink,6);line(c,[[-54,-150],[-54,-173],[-78,-173],[-39,-173]],ink,6);
  const leg=i=>{const f=p.feet[i],k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#8e7649',6);line(c,[[f.x-10,f.y],[f.x+13,f.y]],ink,5);line(c,[[-8,-71],[f.x,f.y]],ink,4);};
  leg(1);
  c.save();c.translate(0,p.bob);
  const body='M-103-199 C-136-215-126-249-90-262 C-46-282-8-249 10-239 C2-278 6-309 28-326 C43-337 67-329 77-315 C85-301 75-287 61-282 C48-264 58-246 55-225 C48-195 12-178-33-181 C-64-181-82-194-103-199Z';
  path(c,body,'#d6c99e',ink,6);
  c.save();c.clip(new Path2D(body));const br=rng(1349);for(let i=0;i<140;i++){const x=-130+br()*225,y=-340+br()*170,l=9+br()*24;path(c,`M${x} ${y} q${l*.6} ${y<-270?-18:11} ${l} ${y<-270?-30:6}`,null,['#b4b68b','#e8d6a4','#8c9a7b'][i%3],2+br()*4);}c.restore();
  path(c,'M -109 -209 L -144 -231 L -115 -224 L -131 -243 L -95 -222 Z','#b9b991',ink,3);
  path(c,'M -91 -242 C -52 -266 -12 -236 7 -214 C -15 -196 -68 -195 -92 -224 Z','#a7ad88',ink,3);
  for(let i=0;i<7;i++){path(c,`M ${-94+i*14} ${-240+Math.sin(i*.5)*7} q 14 27 33 26`,null,i%2?'#e2cca0':'#747e64',2.2);}
  path(c,'M 18 -247 C 20 -276 13 -299 34 -316 M 33 -238 C 37 -266 27 -288 45 -309',null,'#b5b88d',5);
  path(c,'M 71 -315 L 232 -303 Q 193 -289 79 -295 L 67 -301 Z','#ce9854',ink,3);
  path(c,'M 80 -294 Q 147 -257 194 -297','#b6ad80',ink,3);path(c,'M 89 -291 Q 144 -272 177 -289',null,'#d3ba85',4);
  line(c,[[84,-307],[211,-302]],'#ead29a',2);
  line(c,[[4,-222],[37,-188],[86,-191]],ink,6);line(c,[[4,-224],[38,-191],[82,-194]],'#aaa77c',2);
  ellipse(c,60,-315,5.6,5.4,'#efddb2',ink,1);ellipse(c,62,-315,2.5,3,ink);line(c,[[52,-323],[67,-322]],ink,2.5);
  c.restore();leg(0);ellipse(c,-8,-71,19,19,null,ink,4);c.restore();
}

function scenery(c,t,scene){
  cached(c,'scream-8469-v3',landscape);
  const resonance=Math.sin(Math.max(0,t-2)*7)*smooth((t-2)/.4)*(1-smooth((t-4.4)/1.4));
  c.save();c.globalAlpha=.18*Math.abs(resonance);
  for(let i=0;i<3;i++)path(c,`M230 ${265+i*39} C424 ${230+i*42+resonance*8} 657 ${341+i*27} 1050 ${272+i*42}`,null,'#edb775',3+i);c.restore();
}
export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:1};}
export function renderForeground(c,t,scene){spectator(c,t,scene);}
export function renderGallery(c,t,scene={start:77}){
  scenery(c,t,scene);
  if(scene.subject!==false){c.save();c.translate(galleryPose(t).x-500,0);renderSubject(c,t,scene);c.restore();}
  renderForeground(c,t,{...scene,rider:galleryPose(t)});
}
export default function renderAt(c,t,scene){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  scenery(c,t,scene);if(scene.subject!==false)renderSubject(c,t,scene);renderForeground(c,t,{...scene,rider:{x:500}});
}
export function renderSubject(c,t,scene){rider(c,scene.start+t);}
