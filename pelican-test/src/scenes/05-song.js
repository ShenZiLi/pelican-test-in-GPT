import {paper,rng,path,line,ellipse,title,rect} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {smooth,lerp,clamp} from '../beat/timeline.js';

// One landscape camera transforms terrain, pine trees, path and rider together.
const PAPER='#eee8d9', INK='#2d302c', RIDER_SCALE=.088;
export function songSceneState(t){
  const q=clamp(t/6),x=1070*q,y=805-13*Math.sin(q*Math.PI)**2;
  const find=smooth((t-1.25)/1.35)*(1-smooth((t-4.05)/1.55));
  const scale=lerp(1,3.35,find),focusX=lerp(500,x,find),focusY=lerp(805,y,find);
  return {rider:{x,y,scale:RIDER_SCALE},camera:{scale,focusX,focusY,x:500,y:805},projected:{x:500+(x-focusX)*scale,y:805+(y-focusY)*scale,scale:RIDER_SCALE*scale}};
}
export function galleryPose(t){return songSceneState(t).projected;}
function camera(c,state){const a=state.camera;c.translate(a.x,a.y);c.scale(a.scale,a.scale);c.translate(-a.focusX,-a.focusY);}
// Broken strands follow a structural contour. Grain describes rock volume.
function dry(c,d,width,alpha=.6,seed=1){
  const r=rng(seed);c.save();c.lineCap='round';c.lineJoin='round';
  for(let j=0;j<5;j++){c.save();c.translate((r()-.5)*width*.8,(r()-.5)*width*.3);path(c,d,null,`rgba(37,40,35,${alpha*(.08+r()*.17)})`,width*(.16+r()*.38));c.restore();}
  path(c,d,null,`rgba(35,38,33,${alpha*.6})`,Math.max(.45,width*.17));c.restore();
}
function pine(c,x,y,size,seed){
  const r=rng(seed);c.save();c.translate(x,y);c.scale(size,size);
  dry(c,'M0 0 C-9 -27 6 -53 4 -82 C3 -98 -6 -113 1 -131',7,.9,seed);
  for(let j=0;j<7;j++){
    const y=-40-j*13,side=j%2?1:-1,reach=22+(6-j)*3;
    dry(c,`M3 ${y+12} Q${side*12} ${y-4} ${side*reach} ${y-8}`,2,.9,seed+j);
    for(let k=0;k<9;k++){
      const px=side*(8+k*reach/11),py=y-3-k*.65;
      for(let z=0;z<5;z++){const a=-Math.PI*.87+z*.35;line(c,[[px,py],[px+Math.cos(a)*7+side*r()*5,py+Math.sin(a)*7-r()*4]],`rgba(29,34,28,${.34+r()*.5})`,.6+r()*.5);}
    }
  }c.restore();
}
const MAIN='M-280 742 Q-264 705 -237 691 L-244 657 Q-215 640 -221 613 L-198 590 Q-218 548 -181 516 L-176 474 L-145 456 Q-151 411 -128 382 L-135 344 Q-106 326 -111 289 L-91 275 Q-106 237 -76 215 L-78 178 L-48 155 Q-65 124 -40 101 L-42 77 L-9 62 L-3 31 Q14 17 31 25 L43 53 L73 63 L65 89 Q99 109 96 137 L127 159 L117 192 Q144 209 137 239 L168 269 L159 295 Q185 315 179 353 L201 369 L191 410 Q221 436 213 468 L241 491 L230 523 Q264 551 254 589 L280 616 L272 650 Q313 673 309 706 L344 742Z';
const layers=new Map();
function landscapeLayer(c,key,draw){
  if(!layers.has(key)){const a=document.createElement('canvas');a.width=3556;a.height=2000;const g=a.getContext('2d');g.scale(2,2);g.translate(389,0);draw(g);layers.set(key,a);}
  c.drawImage(layers.get(key),-389,0,1778,1000);
}
function rock(c,{x,y,w,h,seed=1,opacity=1,shape=MAIN}){
  const r=rng(seed);c.save();c.translate(x,y);c.scale(w/600,h/742);c.globalAlpha*=opacity;
  c.save();c.clip(new Path2D(shape));
  c.fillStyle='#c4c2b7';c.fillRect(-320,-20,690,810);
  // The light side and the broken central seam define three solid rock faces.
  path(c,'M-290 742 L-257 450 L-90 83 L-10 24 L31 33 L4 178 L-56 291 L-49 445 L-118 583 L-108 742Z','#ded9cb');
  path(c,'M34 42 Q83 71 62 183 Q88 216 105 253 Q71 310 63 345 Q70 406 99 460 Q64 497 53 552 Q64 640 106 742 L-23 742 Q-5 668 -9 611 Q-49 531 -44 482 Q-14 430 6 352 Q-31 284 -17 233Z','#696860');
  path(c,'M110 143 L141 210 L137 292 L180 365 L166 442 L205 531 L191 634 L244 742 L124 742 L93 643 L116 545 L76 419 L111 309 L86 250Z','#96948a');
  path(c,'M-84 201 L-65 267 L-88 347 L-51 439 L-89 544 L-64 627 L-113 742 L-170 742 L-130 588 L-153 485 L-109 390 L-134 333Z','#b5b1a5');
  const ribs=[[-14,48,5,181],[-56,112,-46,280],[38,81,64,269],[-92,239,-71,438],[103,190,134,388],[-142,334,-98,583],[40,295,79,527],[177,320,185,586],[-174,486,-153,717],[108,497,79,745],[239,523,246,739]];
  for(let i=0;i<ribs.length;i++){
    const [sx,sy,ex,ey]=ribs[i],len=ey-sy;
    dry(c,`M${sx} ${sy} l-9 ${len*.16} l10 ${len*.2} l-19 ${len*.18} L${ex} ${ey}`,8+r()*10,.85,seed+i*31);
    // Slanting axe-cut brush ribbons overlap into shaded planes. Their starts
    // cluster beneath shelves; long paper cracks interrupt the accumulation.
    for(let k=0;k<145;k++){
      const u=r(),yy=sy+len*u,xx=lerp(sx,ex,u)+r()*57-7,l=14+r()*47,lean=-5-r()*11;
      path(c,`M${xx} ${yy} q${lean*.4} ${l*.4} ${lean} ${l} l${5+r()*7} ${-l*.21} q4 ${-l*.2} ${-lean-5} ${-l*.79}Z`,`rgba(35,39,32,${.035+r()*.115})`);
      if(k%9===0)path(c,`M${xx-2} ${yy} q-3 ${l*.5} -8 ${l}`,null,'#eee8d97a',.7+r()*1.7);
    }
    // Staggered stone ledges, with sparse concentrated moss ink.
    for(let j=0;j<3;j++){
      const u=.14+j*.31,yy=lerp(sy,ey,u),xx=lerp(sx,ex,u)-13;
      dry(c,`M${xx} ${yy} l12 -6 l23 2 l12 -9`,4,.8,seed+i*19+j);
      for(let k=0;k<7;k++)ellipse(c,xx+r()*40,yy-4-r()*4,1+r()*2.4,.9+r()*1.7,`rgba(30,34,28,${.36+r()*.42})`);
    }
  }

  // Accumulated dry ink across the entire face destroys clean vector planes.
  // All strokes obey the downward thrust of the massif, with wider axe marks
  // on its shaded right face and finer hemp-fibre texture on its light face.
  for(let k=0;k<4700;k++){
    const xx=-260+r()*600, yy=35+r()*715, len=3+r()*12;
    const lean=-2-r()*9, alpha=.025+r()*.105;
    path(c,`M${xx} ${yy} q${lean*.7} ${len*.4} ${lean} ${len}`,null,`rgba(29,33,28,${alpha})`,.4+r()*1.3);
    if(k%5===0)path(c,`M${xx+2} ${yy} l${lean*.5} ${len*.7}`,null,`rgba(235,229,211,${.1+r()*.3})`,.4+r()*1.3);
  }
  // Uneven ink blooms pool under the ledges instead of forming a flat plane.
  for(let k=0;k<850;k++){
    const yy=80+r()*645, xx=-180+r()*420;
    ellipse(c,xx,yy,2+r()*9,3+r()*11,`rgba(43,43,36,${.015+r()*.045})`);
  }
  // Dry rub over the ink planes, baked once with a fixed seed.
  for(let i=0;i<12500;i++){const xx=-260+r()*600,yy=r()*760;rect(c,xx,yy,.3+r()*1.3,.4+r()*2,`rgba(238,232,217,${.05+r()*.19})`);}
  if(h>300){const fade=c.createLinearGradient(0,572,0,742);fade.addColorStop(0,'#eee8d900');fade.addColorStop(1,PAPER);rect(c,-330,572,700,170,fade);}
  c.restore();dry(c,shape,2,.3,seed+500);c.restore();
}
function distant(c){
  c.save();c.globalAlpha=.37;
  path(c,'M-140 663 Q-83 611 -36 575 Q15 491 57 517 Q91 464 133 471 Q194 400 242 449 Q279 403 314 455 Q351 477 394 548 Q450 531 504 641Z','#b2b7aa');
  path(c,'M584 637 Q610 573 649 544 Q688 469 720 466 Q746 416 769 445 Q806 370 829 411 Q862 421 874 469 Q915 427 944 476 Q1000 496 1047 632Z','#aeb5a8');c.restore();
  const wash=c.createLinearGradient(0,480,0,697);wash.addColorStop(0,'#eee8d900');wash.addColorStop(1,PAPER);rect(c,-430,480,1900,230,wash);
}
const LEFT='M-310 742 Q-300 663 -251 642 L-258 601 Q-207 568 -205 518 L-173 504 Q-183 461 -141 427 L-149 396 L-104 375 Q-98 334 -55 323 L-65 275 L-33 258 L-42 224 L-4 201 L4 168 L45 173 L63 218 L93 235 L82 281 L125 314 L117 360 L166 391 L159 439 Q204 471 199 516 L240 545 L232 588 Q288 635 300 684 L350 742Z';
const RIGHT='M-310 742 L-286 690 Q-259 682 -251 651 L-222 640 Q-218 584 -185 573 L-196 535 L-158 515 L-167 474 L-135 448 L-148 407 L-112 377 L-120 338 L-77 318 L-84 278 L-52 255 L-66 214 L-27 201 L-34 164 L3 147 L0 121 L34 103 L54 122 L69 174 L112 189 L104 232 L140 273 L124 313 L163 349 L154 393 L194 418 L188 467 L230 491 L221 541 L258 582 L248 631 L297 674 L340 742Z';
function boulder(c,x,y,w,h,seed){
  const r=rng(seed);c.save();c.translate(x,y);c.scale(w/100,h/100);
  const d='M-51 100 L-47 78 L-31 69 L-34 44 L-21 39 L-14 15 L7 4 L24 11 L30 29 L43 37 L39 58 L51 70 L55 100Z';
  path(c,d,'#95968a',INK,.6);c.save();c.clip(new Path2D(d));
  path(c,'M-40 100 L-27 64 L-25 45 L-9 44 L-6 19 L7 4 L11 41 L-3 55 L8 81 L-4 100Z','#d1ccbd');
  path(c,'M16 18 L24 41 L17 60 L34 77 L31 100 L8 100 L9 76 L-2 57 L13 41Z','#5c6056');
  for(let j=0;j<250;j++){const xx=r()*110-55,yy=r()*100;line(c,[[xx,yy],[xx-3-r()*4,yy+3+r()*8]],`rgba(40,43,35,${.06+r()*.2})`,.3+r()*.7);}
  c.restore();dry(c,'M-32 66 L-8 55 L5 60 M17 60 L34 77 M-6 20 L-3 42',1,.8,seed);c.restore();
}
function landscape(c){
  distant(c);rock(c,{x:75,y:173,w:530,h:582,seed:2301,opacity:.27,shape:LEFT});rock(c,{x:467,y:58,w:576,h:750,seed:7565});rock(c,{x:825,y:303,w:350,h:434,seed:901,opacity:.4,shape:RIGHT});
  // Blank silk is the waterfall, between two masses of ink.
  path(c,'M655 315 C668 376 637 425 650 478 C659 519 628 554 629 613 C630 653 612 681 611 715',null,PAPER,9);
  path(c,'M657 319 C669 376 640 423 652 477 C661 518 633 556 633 613 C631 653 617 679 616 705',null,'#fffaf0',2.2);
  dry(c,'M671 375 Q660 422 664 454 M645 526 Q639 572 641 609',1,.6,22);
  for(const [y,h,a]of [[611,145,.74],[708,116,.95]]){const mist=c.createLinearGradient(0,y,0,y+h);mist.addColorStop(0,'#eee8d900');mist.addColorStop(.56,`rgba(238,232,217,${a})`);mist.addColorStop(1,'#eee8d900');rect(c,-420,y,1850,h,mist);}
  const roadPoints=Array.from({length:121},(_,i)=>{const x=-400+i*1830/120,q=clamp(x/1070);return [x,805-13*Math.sin(q*Math.PI)**2];});line(c,roadPoints,'#605f4a65',1.8);
  line(c,roadPoints.map(([x,y])=>[x,y+7]),'#a4a08a88',.65);
  boulder(c,254,727,97,43,334);boulder(c,741,727,111,43,411);
  pine(c,322,798,.55,782);pine(c,756,808,.45,802);pine(c,693,773,.32,102);pine(c,276,786,.33,312);
  path(c,'M536 754 Q546 753 554 744 Q563 753 574 754 L569 757 L541 757Z','#5d5c50',INK,.7);path(c,'M544 758 L544 770 L566 770 L566 758',PAPER,INK,.8);line(c,[[554,758],[554,769]],INK,.6);dry(c,'M540 771 L572 771',2,.7,22);
  for(let i=0;i<19;i++){const x=178+i*36;path(c,`M${x} ${824+Math.sin(i*2)*8} q7 -4 17 -1`,null,'#7c7c674f',.7);}
}
function foreground(c){
  path(c,'M-430 1000 L-430 832 Q-212 811 -126 856 Q-33 842 36 885 Q76 897 108 932 Q210 941 288 1000Z','#696c5d');
  boulder(c,-63,820,297,211,123);pine(c,39,950,1.25,402);pine(c,-63,929,1.05,820);
  path(c,'M802 1000 Q844 944 922 952 Q949 900 1019 891 Q1081 835 1430 854 L1430 1000Z','#838577');boulder(c,1020,841,221,195,1802);pine(c,1045,947,.98,312);
  for(const [x,y,w]of [[298,905,83],[393,934,119],[560,892,65],[648,953,112],[410,975,75]])path(c,`M${x} ${y} q${w*.4} -3 ${w} 0`,null,'#7b7e6d4c',.7);
}
function traveller(c,t,scene,state){const p=state.rider;pelican(c,(scene.start||29)+t,{x:p.x,y:p.y,scale:p.scale,style:'ink',body:PAPER,accent:'#d2cbb9',ink:'#292e26',feathers:false});}
function drawWorld(c,t,scene,state,subject=true){c.save();camera(c,state);landscapeLayer(c,'song-v2-ink-landscape-4',landscape);if(subject)traveller(c,t,scene,state);landscapeLayer(c,'song-v2-ink-foreground-4',foreground);c.restore();}
export function renderGallery(c,t,scene={}){paper(c,{base:PAPER,seed:7565});drawWorld(c,t,scene,songSceneState(t),scene.subject!==false);}
export default function renderAt(c,t,scene={}){
  if(scene.gallery&&scene.subject!==false){renderGallery(c,t,scene);return;}
  paper(c,{base:PAPER,seed:7565});const state=songSceneState(t);state.rider={...state.rider,x:500};drawWorld(c,t,scene,state,scene.subject!==false);title(c,scene,{x:1235,y:112,color:INK,vertical:true});
}
// Legacy contexts arrive centred on the external rider, preserving thumbnail API.
export function renderSubject(c,t,scene={}){const state=songSceneState(t);state.rider={...state.rider,x:500};c.save();camera(c,state);traveller(c,t,scene,state);c.restore();}
