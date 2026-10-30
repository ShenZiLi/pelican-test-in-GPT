import {paper,cached,path,line,ellipse,rng,TAU} from '../kit/draw.js';
import {brushTexture} from '../kit/brush.js';
import {poseAt} from '../rig/pose.js';
import {smooth} from '../beat/timeline.js';

const INK='#171715', PALE='#a4a092', PAPER='#eee9de';

// Uneven ink edges are separate translucent deposits, rather than a cartoon outline.
function wet(c,d,color=INK,opacity=1){
  c.save();c.globalAlpha*=opacity;c.shadowColor=color+'28';c.shadowBlur=.65;
  for(const [x,y,a] of [[-1.2,.5,.08],[1.3,-.6,.09],[0,0,.98]]){
    c.save();c.translate(x,y);c.globalAlpha*=a;path(c,d,color);c.restore();
  }c.restore();
}
function stroke(c,d,width=3,color=INK,alpha=1){
  c.save();c.globalAlpha*=alpha;c.lineCap='round';c.lineJoin='round';path(c,d,null,color,width);c.restore();
}

function still(c){
  c.save();c.translate(-210,18);c.globalAlpha=.38;
  const r=rng(8017);
  // One bowed, exhausted lotus: its long stem makes the blank upper field intentional.
  stroke(c,'M 1056 899 C 1057 786 1020 690 1021 571 C 1024 521 1051 481 1049 433',4,PALE,.60);
  stroke(c,'M 1057 894 C 1046 758 1009 657 1019 574',2.1,INK,.66);
  stroke(c,'M 1021 601 Q 960 556 909 476 Q 889 449 865 444',3.3,INK,.82);
  stroke(c,'M 967 548 L 946 491 M 1018 619 Q 1086 553 1120 554',1.5,INK,.67);
  wet(c,'M 1049 438 C 1022 433 996 447 973 432 Q 1008 413 1024 416 Q 1055 407 1077 420 L 1105 431 Q 1080 449 1049 438 Z',INK,.86);
  stroke(c,'M 984 432 Q 1044 421 1091 433',1,PAPER,.50);
  wet(c,'M 1119 554 Q 1142 550 1165 564 Q 1148 581 1127 570 L 1119 554',INK,.69);
  for(let i=0;i<13;i++)stroke(c,`M ${1000+r()*72} ${424+r()*9} l ${r()*12+1} ${r()*3-1}`,r()*1.6+.5,PAPER,.25);
  // The tiny observer is a single pear-shaped wash and three calligraphic marks.
  wet(c,'M 866 444 Q 843 437 840 414 Q 839 392 857 387 Q 876 387 882 409 Q 891 429 876 442 Z',INK,.90);
  wet(c,'M 849 397 Q 831 395 827 408 L 842 413 Z',INK);
  stroke(c,'M 869 439 L 873 451 M 878 439 L 881 450',1.4);
  stroke(c,'M 858 441 L 849 463 L 872 448',2);
  ellipse(c,847,405,4.9,5.3,PAPER);ellipse(c,845,403,1.8,2.1,INK);
  stroke(c,'M 866 413 Q 874 425 868 431',1.4,PAPER,.5);
  // Barely present ripples and a few dry deposits; no continuous landscape horizon.
  stroke(c,'M 940 901 Q 1030 896 1107 902 M 1080 916 L 1161 913',1.0,PALE,.43);
  for(let i=0;i<34;i++){c.globalAlpha=.06+r()*.12;ellipse(c,998+r()*100,844+r()*76,r()*2+.3,r()*.5+.2,INK);}c.globalAlpha=1;
  c.restore();
}

function body(c){
  c.translate(500,805);
  wet(c,'M -133 -221 Q -121 -255 -84 -258 Q -36 -259 0 -233 Q 19 -226 37 -219 Q 3 -190 -48 -193 Q -104 -195 -133 -221 Z',PALE,.28);
  // The back and wing each use one tapered brush gesture, leaving paper inside the breast.
  wet(c,'M -132 -224 Q -120 -255 -84 -258 Q -37 -261 -5 -236 L -19 -240 L -21 -235 L -36 -243 L -39 -238 L -57 -245 L -62 -239 L -78 -245 L -87 -238 L -101 -240 L -106 -232 L -118 -230 Z',INK,.95);
  wet(c,'M -101 -235 Q -70 -253 -33 -233 L 12 -212 Q -36 -204 -69 -215 Z',INK,.88);
  wet(c,'M -57 -201 Q -44 -197 -30 -197 L -36 -181 L -44 -180 Z',INK,.70);
  wet(c,'M -124 -221 L -148 -236 L -135 -217 L -154 -218 L -119 -207 Z',INK,.91);
  wet(c,'M 8 -222 Q 30 -246 27 -275 Q 25 -304 40 -316 Q 45 -321 54 -320 Q 41 -304 42 -282 Q 48 -249 40 -230 L 26 -211 Z',INK,.87);
  // Angular, dark brow supports the characteristic large white eye.
  wet(c,'M 30 -317 Q 36 -343 61 -341 Q 86 -340 87 -317 L 77 -296 Q 47 -290 32 -306 Z',INK);
  stroke(c,'M 78 -316 Q 147 -314 228 -302 Q 172 -298 81 -303',2.2,INK,.98);
  stroke(c,'M 82 -302 Q 139 -271 197 -299',1.7,INK,.68);
  stroke(c,'M 91 -301 Q 142 -284 183 -298',5.8,PALE,.35);
  stroke(c,'M -6 -224 Q 30 -197 39 -189 L 86 -191',3.7,INK,.91);
  // Sparse broken bristle trails reveal dry paper, restricted to the broad ink strokes.
  const r=rng(8017);for(let i=0;i<28;i++){
    let x=-113+r()*104,y=-242+r()*10;
    stroke(c,`M ${x} ${y} l ${6+r()*18} ${2+r()*3}`,r()*.9+.3,PAPER,.25+r()*.30);
  }
  // Pinholes and short fibres live inside the ink deposits, like absorbent xuan paper.
  c.save();c.clip(new Path2D('M -132 -224 Q -117 -257 -78 -257 Q -33 -256 -5 -236 Q -55 -249 -105 -232 Z M -101 -235 Q -70 -253 -33 -233 L 12 -212 Q -36 -204 -69 -215 Z M 8 -222 Q 30 -246 27 -275 Q 25 -304 40 -316 L 54 -320 Q 41 -304 42 -282 Q 48 -249 40 -230 Z'));
  for(let i=0;i<175;i++){
    const x=-142+r()*202,y=-322+r()*121;
    stroke(c,`M ${x} ${y} l ${.6+r()*3.5} ${r()*.7}`,r()*.7+.25,PAPER,.14+r()*.31);
  }c.restore();
  stroke(c,'M 32 -264 Q 35 -283 35 -293',1,PAPER,.58);
}

function cycle(c,p,at){
  c.save();c.translate(500,805);
  for(const x of [-106,111]){
    // A broken second pass suggests bristles, while centres retain the shared rig geometry.
    c.save();c.translate(x,-62);c.rotate(-.14);
    stroke(c,'M 0 -62 C 35 -64 63 -33 62 0 C 61 35 34 63 0 62 C -34 63 -63 34 -62 0 C -63 -34 -33 -63 0 -62',3.8,INK,.79);
    stroke(c,'M -57 4 Q -52 48 -13 57 M 39 -43 Q 57 -27 58 -8',1.1,INK,.43);
    for(let i=0;i<4;i++){const a=p.wheelAngle+i*TAU/4;line(c,[[0,0],[Math.cos(a)*58,Math.sin(a)*58]],PALE,1.15);}
    ellipse(c,0,0,3.7,3.3,INK);c.restore();
  }
  stroke(c,'M -106 -62 L -51 -150 L -8 -71 Z M -51 -150 L 65 -150 L 111 -62 L -8 -71 L 65 -150',3.3,INK,.83);
  stroke(c,'M 65 -150 L 64 -180 L 89 -191 L 100 -187 M -51 -150 L -54 -173 M -76 -173 L -38 -173',4.1,INK,.91);
  ellipse(c,-8,-71,17.5,17.5,null,PALE,1.5);
  const leg=(i,alpha)=>{const f=p.feet[i],k=p.knees[i];
    stroke(c,`M -39 -181 L ${k.x} ${k.y} L ${f.x} ${f.y}`,3.5,INK,alpha);
    stroke(c,`M ${f.x-8} ${f.y-1} l 20 0`,4.1,INK,alpha);
    stroke(c,`M -8 -71 L ${f.x} ${f.y}`,2.0,INK,.65);
  };
  leg(1,.30);c.restore();
  c.save();c.translate(0,p.bob);cached(c,'bada:body:8017:v4',body);c.restore();
  c.save();c.translate(500,805);leg(0,.93);
  const roll=smooth((at-1.8)/.2)*(1-smooth((at-4)/.35));
  ellipse(c,60,-315+p.bob,9+8*roll,7+11*roll,PAPER);
  ellipse(c,64-8*roll,-314-14*roll+p.bob,3.7,3.7,INK);
  // Upper brow becomes a flat, judgmental cap while everything below keeps pedalling.
  stroke(c,`M 40 ${-325-9*roll+p.bob} Q56 ${-331-5*roll+p.bob} 77 ${-325-8*roll+p.bob}`,2.8,INK,.98);c.restore();
}

export function renderSubject(c,t,scene){cycle(c,poseAt(scene.start+t),t);}

export default function renderAt(c,t,scene={}){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  paper(c,{base:PAPER,seed:8017});brushTexture(c,{alpha:.021});
  cached(c,'bada:lotus:8017:v4',still);
  const at=scene.start+t,p=poseAt(at);
  // A quiet moving earth-mark carries the shared road without consuming the empty sheet.
  c.save();c.globalAlpha=.30;
  stroke(c,'M 295 806 Q 469 802 671 807',1.1,PALE);
  for(let i=-2;i<4;i++){const x=380+i*88-(at*105%88);stroke(c,`M ${x} 819 l 18 -1`,.7,PALE,.35);}c.restore();
  if(scene.subject!==false)renderSubject(c,t,scene);
}

export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:1};}
export function renderGallery(c,t,scene={}){
  paper(c,{base:PAPER,seed:8017});cached(c,'bada:lotus:8017:v4',still);
  // Three quiet marks leave more than three quarters of the sheet unoccupied.
  stroke(c,'M 240 824 Q 416 818 626 824',.8,PALE,.3);
  if(scene.subject!==false){const p=galleryPose(t);c.save();c.translate(p.x-500,0);renderSubject(c,t,{start:53,...scene});c.restore();}
}
