import {paper,cached,rng,path,line,ellipse,rect,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
const C={paper:'#e9d5a6',ink:'#423d31',green:'#4b7158',gold:'#b48635',rose:'#a55551',cream:'#f2e4bb',blue:'#568b92',stone:'#d6c19a'};
function flower(c,x,y,s=1,color=C.rose){
 c.save();c.translate(x,y);c.scale(s,s);path(c,'M0 13 Q-4 0 0-15 M-1 4 Q-15-4-12 7 Q-7 10-1 4 M0-1 Q12-11 11 0 Q6 4 0-1',null,C.green,1.25);
 for(let i=0;i<5;i++){const a=i*TAU/5;ellipse(c,Math.cos(a)*4,-15+Math.sin(a)*4,3,4,color,C.ink,.4);}ellipse(c,0,-15,2,2,C.gold);c.restore();
}
function border(c){
 rect(c,13,13,974,974,null,C.ink,1.4);rect(c,22,22,956,956,null,C.gold,3);
 for(const a of [[24,24,952,32],[24,944,952,32],[24,56,32,888],[944,56,32,888]])rect(c,...a,C.cream);
 rect(c,55,55,890,890,null,C.gold,2);rect(c,61,61,878,878,null,C.ink,1.2);
 // A continuous vine turns all four corners inside the square, including the sides.
 for(let side=0;side<4;side++){
  c.save();c.translate(500,500);c.rotate(side*Math.PI/2);c.translate(-500,-500);
  path(c,'M35 38 Q247 21 500 38 T965 38',null,C.gold,1.8);
  for(let i=0;i<27;i++){const x=42+i*35;flower(c,x,43,.62,i%3===0?'#ac654a':'#69866b');path(c,`M${x} 40 q13-14 22-1 q-14 7-22 1`,null,C.gold,.8);}
  c.restore();
 }
}
function cypress(c,x,y,s=1){
 c.save();c.translate(x,y);c.scale(s,s);path(c,'M0 0 C-39-23-33-111 0-185 C33-114 38-26 0 0Z',C.green,C.ink,1.4);
 const r=rng(x+y);for(let i=0;i<105;i++){const yy=-12-r()*150,spread=22*(1-Math.abs(yy+85)/180);const xx=(r()-.5)*spread*2;path(c,`M${xx} ${yy} q5-4 5-10`,null,i%4?'#90a179':'#284e42',.9);}
 path(c,'M0-3 Q4-91 0-163',null,C.gold,.8);c.restore();
}
function arch(c,x,y,w,h){
 const d=`M${x} ${y} L${x} ${y-h*.63} Q${x+w*.1} ${y-h*.85} ${x+w*.5} ${y-h} Q${x+w*.9} ${y-h*.85} ${x+w} ${y-h*.63} L${x+w} ${y}Z`;
 path(c,d,'#385e56',C.ink,1.3);c.save();c.clip(new Path2D(d));
 for(let xx=x-65;xx<x+w+65;xx+=11){line(c,[[xx,y],[xx+h*.7,y-h]],'#c0b78e',.65);line(c,[[xx,y-h],[xx+h*.7,y]],'#c0b78e',.65);}c.restore();
 path(c,`M${x+5} ${y} L${x+5} ${y-h*.62} Q${x+w*.5} ${y-h+8} ${x+w-5} ${y-h*.62} L${x+w-5} ${y}`,null,C.gold,1.1);
}
function garden(c){
 paper(c,{base:C.paper,seed:1600});rect(c,62,62,876,876,'#b5bc91',C.ink,1.2);
 // Flattened elevations above a garden seen from above are deliberate miniature space.
 rect(c,163,227,674,260,'#cfa97b',C.ink,1.4);rect(c,155,220,690,17,C.cream,C.ink,1.2);
 for(let i=0;i<7;i++){arch(c,184+i*92,465,77,158);flower(c,222+i*92,289,.7);}
 // Fine floral pietra-dura panels and jointed sandstone give the elevation a hand-worked finish.
 for(let i=0;i<8;i++){
  const x=177+i*92;path(c,`M${x} 303 L${x} 467`,null,'#a27d58',.65);
  for(let j=0;j<6;j++){const y=321+j*25;path(c,`M${x-5} ${y} l10 0 m-7-4 l5 8`,null,C.gold,.7);}
 }
 for(let x=174;x<838;x+=24){path(c,`M${x} 218 l0-10 l11 0 l0 10`,null,C.ink,.8);rect(c,x,208,11,10,C.cream,C.gold,.5);}
 for(let x=200;x<800;x+=92){flower(c,x,272,.42);path(c,`M${x-17} 275 q18-16 35 0`,null,C.gold,.8);}
 for(let i=0;i<9;i++)path(c,`M${358+i*35} 141 Q${425+i*15} 101 500 78`,null,'#5b7665',.7);
 rect(c,157,475,686,17,C.cream,C.ink,1);rect(c,169,492,662,17,C.stone,C.ink,1);
 rect(c,342,143,316,92,C.cream,C.ink,1.3);
 path(c,'M326 147 Q341 85 500 76 Q657 86 674 147Z','#81937b',C.ink,1.6);path(c,'M334 146 Q500 122 666 146',null,C.gold,3);
 for(let x=366;x<640;x+=47)arch(c,x,224,32,63);
 for(let i=0;i<32;i++)line(c,[[168+i*21,241],[168+i*21,258]],C.gold,.9);
 for(const x of [118,882]){cypress(c,x,514,1.04);cypress(c,x,682,.76);}
 // The pool stops before the transverse stone causeway; there is no water under a tyre.
 rect(c,404,522,192,175,C.cream,C.ink,1.2);rect(c,414,532,172,154,C.blue,C.gold,1.8);
 ellipse(c,500,588,52,27,null,'#d9dab2',1.2);ellipse(c,500,588,14,7,C.cream,C.ink,.7);
 for(let y=542;y<683;y+=13)path(c,`M422 ${y} q20-3 40 0 m27 0 q22 3 47-1`,null,'#b6cdaf',.65);
 // Four walled flower parterres with irregular roses, irises, and fine stone edging.
 const r=rng(288);for(const [x,y,w,h] of [[159,536,219,158],[622,536,219,158],[118,865,340,55],[542,865,340,55]]){
  rect(c,x,y,w,h,'#718b61',C.cream,4);rect(c,x+6,y+6,w-12,h-12,null,C.gold,.7);
  for(let i=0;i<w*h/570;i++)flower(c,x+13+r()*(w-26),y+18+r()*(h-27),.54+r()*.31,i%4?'#b6635f':'#f0d89a');
 }
 path(c,'M62 733 L938 733 L938 850 L62 850Z',C.stone,C.ink,1.4);
 for(let y=744;y<850;y+=28)for(let x=62+(y%3)*23;x<938;x+=71){line(c,[[x,y],[x+67,y]],'#a48b69',.7);line(c,[[x,y],[x,y+26]],'#a48b69',.6);}
 path(c,'M62 732 L938 732 M62 851 L938 851',null,C.cream,4);
 // Small terrace carpets, drawn with gold threads rather than flat empty lawn.
 for(const x of [242,752]){rect(c,x-58,690,116,27,'#8c5750',C.gold,1.2);for(let i=0;i<10;i++)line(c,[[x-53+i*11,694],[x-47+i*11,712]],'#d1ab74',.8);}
 border(c);
}
function guest(c,x,y,s,kind,robe,t){
 const bird=galleryPose(t),dx=bird.x-x,look=Math.max(-1,Math.min(1,dx/180));
 c.save();c.translate(x,y);c.scale(s,s);c.lineJoin='round';
 if(kind===2){
  // Overhead courtier: turban crown, shoulders and cross-legged knees, no elevation silhouette.
  ellipse(c,0,-25,37,21,robe,C.ink,1.4);path(c,'M-27-23 Q-48 2-25 14 L0 3 L25 14 Q49 0 28-23',robe,C.ink,1.2);
  path(c,`M-26-25 L${look*27}-7 L${look*42}-2 M27-24 L${look*32}-6`,null,C.cream,4);
  c.save();c.rotate(look*.48);ellipse(c,0,-39,17,13,'#d3ad7a',C.ink,1);ellipse(c,0,-46,17,10,C.cream,C.ink,1);path(c,'M-13-48 Q0-38 14-48 M-9-52 Q2-43 13-49',null,C.gold,1);path(c,'M-7-29 L2-25 L7-30',null,C.ink,1.2);c.restore();
 }else{
  const side=kind===1?Math.sign(dx)||1:1;
  path(c,'M-17-139 Q-28-104-33-59 L-43-4 Q-13 8 36-3 L22-85 L14-139Z',robe,C.ink,1.5);
  path(c,'M-10-136 L9-107 L16-137 M-29-76 L27-81',null,C.cream,3);
  for(let j=0;j<6;j++)path(c,`M${-20+j*8}-105 q${j-2} 39 ${-8+j*3} 98`,null,C.gold,.65);
  for(let j=0;j<11;j++){
   const yy=-119+j*10;path(c,`M-17 ${yy} l3-3 l3 3 l-3 3Z`,null,j%2?C.cream:C.gold,.7);
   if(j%3===0)flower(c,12,yy,.2,'#dfb581');
  }
  line(c,[[-15,0],[-25,8],[-6,8]],C.ink,2.4);line(c,[[15,0],[31,6],[8,8]],C.ink,2.4);
  c.save();c.translate(look*3,-159);
  if(kind===1){c.scale(side,1);path(c,'M-10-14 Q7-20 15-8 L23-3 L15 1 Q18 13 6 17 L-9 10Z','#c9a072',C.ink,1.1);ellipse(c,12,-5,1.8,1.5,C.ink);path(c,'M8 11 Q16 17 10 23 L-1 17',C.ink);}
  else{ellipse(c,0,0,15,21,'#c9a072',C.ink,1);for(const xx of [-6,7]){path(c,`M${xx-3}-2 q3-2 6 0`,null,C.ink,.8);ellipse(c,xx+look*2,-1,1.5,1.5,C.ink);}path(c,'M0 0 L-2 7 L3 8 M-7 12 Q0 18 8 12',null,C.ink,1.1);}
  path(c,'M-18-11 Q-14-31 4-28 Q22-26 19-10 Q1-5-18-11Z',C.cream,C.ink,1.1);path(c,'M-13-21 Q-1-9 15-19 M-7-26 Q4-15 17-21',null,C.gold,1.1);c.restore();
  // Sleeves point toward the moving visitor; all heads track the same target.
  const hand=look*47;
  path(c,`M-13-130 Q-40-112 ${hand-11}-85 L${hand+3}-94 Q-12-108-5-122`,robe,C.ink,1.2);
  path(c,`M${hand-1}-92 l${look*17} -8 m${-look*8} 4 l${look*3}-8`,null,'#976f45',2.8);
  if(kind===0){path(c,'M19-118 Q36-96 24-78',null,C.cream,5);ellipse(c,24,-78,5,3,C.gold,C.ink,.7);}
 }
 c.restore();
}
function bird(c,t,scene){
 const p=poseAt((scene.start??47)+t);c.save();c.translate(500,805);c.lineCap='round';
 for(const x of [-106,111]){ellipse(c,x,-62,62,62,C.cream,C.ink,3);ellipse(c,x,-62,57,57,null,C.gold,1.1);for(let i=0;i<12;i++){const a=p.wheelAngle+i*TAU/12;line(c,[[x,-62],[x+58*Math.cos(a),-62+58*Math.sin(a)]],C.ink,.8);}ellipse(c,x,-62,4,4,C.gold,C.ink,.8);}
 path(c,'M-106-62 L-51-150 L-8-71 Z M-51-150 L65-150 L111-62 L-8-71 L65-150 M65-150 L64-180 L89-191 L99-188 M-51-150 L-54-173 M-77-173 L-39-173',null,C.ink,4);
 path(c,'M-104-61 L-51-147 L-8-71 M-49-149 L64-149',null,C.gold,1.4);
 const leg=i=>{const k=p.knees[i],f=p.feet[i];line(c,[[-39,-181],[k.x,k.y],[f.x,f.y]],C.ink,4.5);line(c,[[-8,-71],[f.x,f.y]],C.ink,2);line(c,[[f.x-9,f.y],[f.x+11,f.y]],C.ink,3.5);};leg(1);
 c.save();c.translate(0,p.bob);
 path(c,'M-111-201 Q-149-225-118-251 Q-66-285-4-242 Q-7-288 19-319 Q49-345 76-322 Q92-304 71-291 Q48-280 57-240 Q60-202 13-187 Q-60-167-111-201Z',C.cream,C.ink,2.5);
 path(c,'M70-316 Q151-319 231-302 Q152-288 78-296 L70-302Z','#d0a44d',C.ink,2);path(c,'M80-295 Q144-258 195-296',C.paper,C.ink,1.5);
 path(c,'M-112-211 L-150-231 L-127-227 L-144-244 L-105-227Z',C.green,C.ink,1.7);
 path(c,'M-99-241 Q-43-274 3-215 Q-48-183-99-215Z','#a6ae83',C.ink,1.8);
 for(let row=0;row<3;row++)for(let i=0;i<6-row;i++){const x=-91+i*15+row*8,y=-239+row*11+i*2;path(c,`M${x} ${y} q0 9 13 12 q-1-8-9-12`,null,C.ink,.8);ellipse(c,x+7,y+7,1.5,2.3,C.gold);}
 path(c,'M20-305 Q11-278 25-250 M30-307 Q24-283 32-265 M3-223 Q28-199 36-191 L86-191',null,C.ink,2.5);
 ellipse(c,59,-317,6,5,C.cream,C.ink,1);ellipse(c,61,-317,2.1,2.4,C.ink);c.restore();leg(0);c.restore();
}
export function renderSubject(c,t,scene){bird(c,t,scene);}
export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:.65};}
export function renderGallery(c,t,scene={}){
 cached(c,'mughal:square-court:v5',garden);
 guest(c,247,716,.92,0,'#925b53',t);guest(c,752,720,.96,1,'#657b88',t);
 guest(c,649,589,1.02,2,'#a57f40',t);guest(c,349,586,.82,2,'#777254',t);
 if(scene.subject!==false){const p=galleryPose(t);c.save();c.translate(p.x,p.y);c.scale(p.scale,p.scale);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();}
 // The floral frame stays unbroken over the traveling image at both side portals.
 cached(c,'mughal:closed-frame:v5',border);
}
export default function renderAt(c,t,scene={}){renderGallery(c,t,scene);}
