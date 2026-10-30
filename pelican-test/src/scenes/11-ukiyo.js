import {path,line,ellipse,rect,paper,cached,rng,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';

// An invented roadside station: carved key-lines, separate colour blocks and
// bokashi bands. The landscape is baked once; the rain and actors remain live.
const ink='#233c45', indigo='#244f68', paperTone='#e1d4af', red='#a65e3e';
function pine(c,x,y,s=1){
  c.save();c.translate(x,y);c.scale(s,s);
  path(c,'M-11 0 Q13-95-16-173 Q-26-206-21-256 L-12-256 Q-5-213 8-173 Q34-90 11 0 Z','#62644e',ink,2);
  for(let i=0;i<6;i++){
    const yy=-100-i*26,xx=Math.sin(i*2)*22;
    path(c,`M0 ${yy+34} Q${xx-25} ${yy} ${xx-76} ${yy-5} M1 ${yy+25} Q${xx+21} ${yy-10} ${xx+69} ${yy-6}`,null,ink,3);
    for(const side of [-1,1]){
      const cx=xx+side*48;
      path(c,`M${cx-53} ${yy} Q${cx-48} ${yy-17} ${cx-32} ${yy-16} Q${cx-24} ${yy-36} ${cx-7} ${yy-24} Q${cx+10} ${yy-35} ${cx+18} ${yy-20} Q${cx+46} ${yy-24} ${cx+54} ${yy} Z`,'#3e615c',ink,1.2);
      for(let j=0;j<18;j++)line(c,[[cx-46+j*5,yy-2],[cx-41+j*5,yy-9-(j%4)*2]],'#142f3c',.75);
    }
  }
  for(let k=0;k<7;k++)path(c,`M${-6+k*2} -8 Q${10+k} -85 ${-8+k} -154`,null,ink,.7);
  c.restore();
}
function landscape(c){
 paper(c,{base:paperTone,seed:8243});
 // An original hairpin road above a coastal inlet, composed in the square.
 rect(c,0,0,1000,1000,'#ddd1af');
 for(let i=0;i<100;i++)rect(c,0,i*2.5,1000,2.5,`rgba(36,79,104,${.2*(1-i/100)})`);
 path(c,'M0 415 L117 349 L182 371 L284 302 L372 350 L467 316 L590 370 L692 329 L825 350 L1000 284 L1000 607 L0 607Z','#96a49a',ink,1.3);
 path(c,'M0 480 L127 417 L213 439 L314 380 L400 419 L483 398 L601 446 L712 399 L800 424 L901 383 L1000 404 L1000 640 L0 640Z','#527b80',ink,1.8);
 // Key-block hatching follows each ridge, rather than an all-over uniform texture.
 for(let i=0;i<41;i++){
  const x=8+i*24,y=450+Math.sin(i*.45)*20;
  path(c,`M${x} ${y} l-16 32 m22-26 l-14 28`,null,indigo,.9);
 }
 path(c,'M258 486 Q615 422 1000 447 L1000 756 Q786 738 683 681 L471 672 L230 605Z','#9bad9e',ink,1.7);
 const r=rng(8243);
 for(let i=0;i<130;i++){const x=255+r()*745,y=476+r()*257;line(c,[[x,y],[x+8+r()*50,y]],i%4===0?paperTone:'#557d80',.8);}
 path(c,'M754 513 Q779 523 813 512 L804 525 L765 526Z',ink);line(c,[[790,515],[790,482],[807,496]],ink,1.1);ellipse(c,779,505,3,5,ink);
 // Large diagonals are the print's structure: a rising near bank and the road ribbon.
 path(c,'M0 693 Q192 620 381 477 Q546 362 690 459 Q826 566 1000 654 L1000 1000 L0 1000Z','#65765d',ink,2.5);
 path(c,'M-90 830 Q156 740 355 568 Q487 450 642 506 Q813 574 1080 742 L1080 925 Q831 753 663 700 Q511 652 397 775 Q166 951-90 1056Z','#c8ad78',ink,3.2);
 // A shifted ochre block shows at the carved edge, a restrained registration slip.
 path(c,'M0 839 Q161 768 375 593 Q504 483 628 532 Q800 598 1000 758',null,'#e6cc95',4);
 for(let i=0;i<220;i++){
  const x=-80+r()*1160,y=525+r()*474;
  c.save();c.clip(new Path2D('M-90 830 Q156 740 355 568 Q487 450 642 506 Q813 574 1080 742 L1080 925 Q831 753 663 700 Q511 652 397 775 Q166 951-90 1056Z'));
  line(c,[[x,y],[x+7+r()*18,y-3-r()*6]],'#957b55',.7);c.restore();
 }
 // Cropped shelter at the upper left: a dark roof is a bold carved counterweight.
 path(c,'M-90 198 L242 118 L425 206 L89 278Z','#46555a',ink,3);
 path(c,'M-90 187 L246 99 L443 198 L432 219 L242 136 L-90 222Z','#a58e62',ink,2.2);
 c.save();c.clip(new Path2D('M-90 187 L246 99 L443 198 L432 219 L242 136 L-90 222Z'));
 for(let i=0;i<44;i++){const x=-75+i*11;line(c,[[x,186-(x+75)*.22],[x+31,234-(x+75)*.17]],ink,1);}c.restore();
 path(c,'M55 263 L66 260 L72 444 L58 451Z','#8a7957',ink,2.6);
 path(c,'M285 235 L296 231 L300 371 L287 381Z','#8a7957',ink,2.6);
 path(c,'M70 320 L288 269 L288 337 L71 389Z',indigo,ink,1.5);
 for(let i=0;i<5;i++){const x=93+i*40;path(c,`M${x} ${326-i*9} l0 36`,null,paperTone,1.5);ellipse(c,x+13,335-i*9,5,5,null,paperTone,1);}
 // A clipped right pine and foreground reeds bracket the road without closing it.
 for(let i=0;i<70;i++){const x=r()*1000,y=915+r()*85;path(c,`M${x} ${y} q-1-22-10-33 m10 33 q8-24 18-32`,null,'#3f594f',.9);}
 c.save();c.globalAlpha=.12;
 for(let i=0;i<7000;i++){c.fillStyle=i%4===0?ink:'#f5e7be';c.fillRect(r()*1000,r()*1000,.5+r()*1.8,.4+r()*.8);}c.restore();
}
function traveler(c,x,y,s,t,kind=0){
  const attention=Math.sin(Math.min(1,Math.max(0,(t-1.7)/.9))*Math.PI/2);
  c.save();c.translate(x,y);c.scale(s,s);
  // Straw sandals, slim shins, a patterned travelling kimono, and a sedge hat.
  line(c,[[-8,-24],[-13,-3],[-25,0]],ink,3);line(c,[[12,-24],[14,-5],[23,-2]],ink,3);
  line(c,[[-27,1],[-10,1]],'#a18758',3);line(c,[[13,-1],[26,-1]],'#a18758',3);
  path(c,'M-14-106 Q-29-77-27-28 L-7-23 L5-48 L15-25 L32-33 Q25-84 10-107Z',kind?red:indigo,ink,1.8);
  for(let i=0;i<5;i++)path(c,`M${-20+i*10} -89 l-4 12 l7 3 l-4 12`,null,kind?'#d4aa7c':'#bec8ad',.8);
  path(c,'M-13-103 L10-87 L20-105 M-24-54 L26-58',null,paperTone,2.5);
  ellipse(c,-4,-119,10,14,'#bea77a',ink,1.3);
  path(c,'M-12-124 L-17-118 L-11-116 M-11-111 L-5-110',null,ink,1);
  ellipse(c,-11,-121,1,1,ink);
  path(c,'M-34-126 Q-6-159 29-124 Q-1-117-34-126Z','#c4a66b',ink,1.5);
  for(let i=0;i<12;i++)line(c,[[-5,-146],[-30+i*5,-125]],'#8c7852',.6);
  // Look back and extend one sleeve toward the extraordinary rider.
  path(c,`M-16-97 Q${-36-attention*12} -89 ${-33-attention*31} ${-64-attention*29} L${-24-attention*28} ${-53-attention*29} Q-18-63-10-74Z`,kind?red:indigo,ink,1.4);
  line(c,[[ -32-attention*27,-60-attention*29],[-39-attention*35,-62-attention*29]],ink,2.5);
  line(c,[[23,-85],[38,-67],[41,0]],ink,2);
  if(!kind){
    path(c,'M16-107 L41-110 L51-65 L28-62Z','#b6a375',ink,1.3);
    for(let i=0;i<5;i++)line(c,[[22+i*5,-105],[30+i*4,-66]],'#7b795c',.6);
  }
  c.restore();
}
function bird(c,absolute){
  const p=poseAt(absolute);c.save();c.translate(500,805);c.lineJoin='round';c.lineCap='round';
  // Fine key-block bicycle: a deliberately impossible visitor to this road.
  for(const x of [-106,111]){
    ellipse(c,x,-62,62,62,paperTone,ink,3.2);ellipse(c,x+1,-62,57,57,null,red,.9);
    for(let j=0;j<20;j++){const a=p.wheelAngle+j*TAU/20;line(c,[[x,-62],[x+60*Math.cos(a),-62+60*Math.sin(a)]],ink,.65);}
    ellipse(c,x,-62,4,4,ink);
  }
  line(c,[[-106,-62],[-51,-150],[-8,-71],[-106,-62]],ink,4);
  line(c,[[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150]],ink,4);
  line(c,[[65,-150],[64,-180],[89,-191],[99,-188]],ink,3.8);
  line(c,[[-54,-150],[-54,-173],[-77,-173],[-39,-173]],ink,4);
  line(c,[[-49,-148],[61,-148]],red,1.3);ellipse(c,-8,-71,18,18,null,ink,2);
  const leg=i=>{const f=p.feet[i],k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],ink,4.6);line(c,[[p.hip.x+1,p.hip.y],[k.x+1,k.y],[f.x+1,f.y]],'#aa7550',2.2);line(c,[[-8,-71],[f.x,f.y]],ink,2);line(c,[[f.x-10,f.y],[f.x+13,f.y]],ink,3.4);};
  leg(1);c.save();c.translate(0,p.bob);
  const body='M-100-199 C-141-227-114-264-67-266 C-27-270-8-248 12-240 C5-274 6-307 30-324 C45-334 67-329 78-316 C86-305 79-289 64-286 C45-275 53-249 56-227 C50-199 17-179-32-182 C-56-179-73-189-100-199Z';
  // A small cyan colour-block offset remains visible beside the black outline.
  c.save();c.translate(1.7,-.6);path(c,body,'#718e87');c.restore();
  path(c,body,'#ebe1bb',ink,2.8);
  path(c,'M-111-203 L-149-222 L-125-218 L-143-234 L-105-219Z','#5e7b7a',ink,1.3);
  path(c,'M69-315 L232-303 Q205-291 79-295 L67-299Z','#c09b60',ink,1.6);
  path(c,'M78-295 Q155-258 193-297 Q140-283 78-295Z','#cbb589',ink,1.3);
  path(c,'M82-292 Q137-269 185-294 M88-291 L142-285 M94-289 L149-286',null,'#7b7055',.7);
  path(c,'M30-318 Q16-290 25-259 Q27-244 21-231 M38-321 Q27-295 34-270',null,'#667e77',1.2);
  path(c,'M-89-246 C-56-266-9-241 9-213 C-16-194-65-194-95-220Z','#80968b',ink,1.5);
  // Imbricated feathers read as a cut pattern, not shaded cartoon plumage.
  for(let row=0;row<3;row++)for(let j=0;j<6-row;j++){
    const x=-89+j*15+row*8,y=-241+row*10+j*2;
    path(c,`M${x} ${y} q5 9 14 10 q-2-7-8-11`,row%2?'#bec4a5':'#9eae98',ink,.65);
  }
  for(let i=0;i<8;i++)path(c,`M${-83+i*9} ${-215+i%2*2} q13 11 25 8`,null,ink,.65);
  path(c,'M-92-254 Q-50-269-18-242 M-79-258 Q-48-260-26-244 M-63-258 Q-42-257-30-247',null,'#78897b',.7);
  line(c,[[4,-222],[37,-188],[86,-191]],ink,3.5);line(c,[[5,-222],[38,-190],[84,-192]],'#a7b49b',1.3);
  ellipse(c,60,-315,4.7,4.7,paperTone,ink,1.1);ellipse(c,62,-315,1.9,2.3,ink);
  path(c,'M51-322 Q60-325 68-319',null,ink,1.1);
  c.restore();leg(0);c.restore();
}
export function renderSubject(c,t,scene){bird(c,(scene.start??65)+t);}
export function galleryPose(t){const u=Math.max(0,Math.min(6,t))/6;return {x:1070*u,y:805-205*Math.sin(Math.PI*u),scale:.84,angle:-.34*Math.cos(Math.PI*u)*Math.sin(Math.PI*Math.min(1,u/.14)/2)*Math.sin(Math.PI*Math.min(1,(1-u)/.14)/2)};}
function rain(c,t){
 c.save();c.globalAlpha=.28;
 for(let i=0;i<110;i++){
  const x=((i*173.21-t*80)%1160+1160)%1160-40,y=((i*79.71+t*165)%1110+1110)%1110-55;
  line(c,[[x,y],[x-25,y+62]],indigo,1.1);
 }c.restore();
}
export function renderGallery(c,t,scene={}){
 cached(c,'ukiyo:diagonal-square:v6',landscape);
 // Travellers occupy the far edge of the road. Their size matches the rider.
 if(scene.subject!==false){
  const p=galleryPose(t);c.save();c.translate(p.x,p.y);c.rotate(p.angle);c.scale(p.scale,p.scale);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();
  if(t>2&&t<4){
   const p=galleryPose(t);for(let i=0;i<3;i++)path(c,`M${p.x+88+i*12} ${p.y-1} q${8+i*3}-${10+i*5} ${15+i*4}-1`,null,indigo,1.4);
  }
 }
 // Foreground robes occlude the wheel when the two travel lanes overlap.
 traveler(c,704,666,1.25,t,0);traveler(c,793,718,1.10,t,1);
 cached(c,'ukiyo:foreground-pines:v6',g=>{pine(g,44,835,1.73);pine(g,1027,874,1.03);});
 rain(c,t);
}
export default function renderAt(c,t,scene={}){renderGallery(c,t,scene);}
