import {cached,path,line,ellipse,rect,rng,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';

// One quarter-second source cell, four plays, precisely 109.000–110.000.
// Outside the tape intervention the common rig receives the real film clock.
export function vaporMotionTime(t){
  if(t>=2&&t<3)return 2+((t-2)%.25);
  if(t>0&&t<2)return t-.17*Math.sin(Math.PI*t/2)**2;
  if(t>4.5&&t<6)return t-.10*Math.sin(Math.PI*(t-4.5)/1.5)**2;
  return t;
}

function palm(c,x,y,s,flip=1){
  c.save();c.translate(x,y);c.scale(s*flip,s);
  path(c,'M-11 0 L5 -69 L11 -164 L0 -269 L15 -271 L28 -166 L21 -64 L7 0Z','#5a5087');
  path(c,'M0 -269 L11 -164 L5 -69 L-11 0 L-1 -111Z','#9a7ba8');
  for(let i=0;i<11;i++)line(c,[[-6+i*.8,-15-i*21],[16+i*.25,-20-i*21]],'#bf94b6',1.6);
  const leaves=[[-123,-262,-78,-310,-5,-271],[-155,-213,-112,-275,-5,-271],[-106,-177,-83,-241,-5,-271],[-45,-153,-58,-239,-5,-271],[45,-172,36,-244,-5,-271],[117,-207,86,-276,-5,-271],[142,-265,82,-316,-5,-271],[70,-336,27,-311,-5,-271],[-38,-335,-15,-305,-5,-271]];
  leaves.forEach((p,i)=>{path(c,`M-5 -271 L${p[0]} ${p[1]} L${p[2]} ${p[3]}Z`,i%2?'#73cbd0':'#aacacb','#496d8c',.8);line(c,[[-5,-271],[p[0],p[1]]],'#c2e3df',.9);});
  c.restore();
}
function column(c,x,y,h,w){
  const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#6a6c9b');g.addColorStop(.26,'#e1cbdc');g.addColorStop(.55,'#b6bad5');g.addColorStop(.8,'#f0d9e2');g.addColorStop(1,'#777ba6');
  rect(c,x,y-h,w,h,g);for(let i=1;i<7;i++)line(c,[[x+w*i/7,y-h+8],[x+w*i/7,y-5]],i%2?'#8f85aa':'#efe1e6',2);
  rect(c,x-12,y-h-12,w+24,12,'#ead2e0');rect(c,x-18,y-h-21,w+36,10,'#8b80ad');rect(c,x-12,y,w+24,12,'#d7c1d5');rect(c,x-21,y+12,w+42,10,'#8c85ac');
}
function bust(c){
  c.save();c.translate(170,468);
  // A new imaginary sitter: asymmetric coiled hair, broken shoulder and turned face.
  const marble=c.createLinearGradient(-85,-165,103,70);marble.addColorStop(0,'#fff0e9');marble.addColorStop(.38,'#d9d6e4');marble.addColorStop(.70,'#afadc8');marble.addColorStop(.88,'#e8e6ee');marble.addColorStop(1,'#7e7eaa');
  path(c,'M-40 -58 L-42 -4 Q-105 7 -117 58 L-101 89 L100 89 L116 51 L84 11 L35 -8 L29 -60Z',marble,'#8c8aa9',1.5);
  path(c,'M-40 -19 Q-11 25 34 -13 L66 7 L18 46 L-4 73 L-71 57 L-96 17Z','#e5dfeb');
  path(c,'M-42 -7 L-16 24 L-29 60 L-60 79 M34 -8 L19 28 L52 57 L86 80',null,'#a9a1be',3);
  path(c,'M-49 -125 Q-56 -174 -12 -188 Q30 -199 53 -165 L56 -130 L70 -99 L55 -95 L52 -70 Q34 -42 6 -48 L-18 -57 L-26 -90 L-42 -86Z',marble,'#9291ae',1.5);
  path(c,'M35 -171 Q52 -147 48 -128 L60 -102 L47 -100 L43 -75 L25 -61 L18 -85 L27 -111 L23 -147Z','#b5b0ca');
  path(c,'M-48 -120 Q-81 -141 -58 -174 Q-63 -201 -29 -205 Q-3 -225 19 -205 Q53 -204 57 -173 L41 -156 L17 -169 L-7 -154 L-26 -137 L-29 -115Z','#bcb9ce','#8985a6',2);
  for(let i=0;i<9;i++){let x=-47+i*11,y=-178-Math.sin(i*.48)*17;path(c,`M${x} ${y+15} q-17 -8 -4 -20 q15 -10 18 6 q-2 10 -12 6`,null,i%2?'#f1e5ed':'#9490ae',2.2);}
  path(c,'M-31 -110 Q-44 -127 -47 -109 Q-45 -91 -29 -92',null,'#9290ad',3);
  path(c,'M22 -125 Q37 -132 49 -123 M30 -118 Q39 -123 48 -119 M39 -98 L49 -96 M29 -80 Q41 -85 50 -80 M30 -75 L45 -75',null,'#7d799e',1.8);
  // Fine marble veins are deliberately sparse and follow the carved volume.
  path(c,'M-72 19 L-49 29 L-40 48 L-24 55 L-20 76 M-49 29 L-62 44 M64 25 L48 39 L55 60 L82 74 M-11 -183 L-18 -163 L-9 -147 L-15 -124 M-18 -163 L-34 -158 M33 -59 L26 -39 L33 -26',null,'#8e83aa66',.8);
  line(c,[[-95,90],[98,90]],'#fcdfec',3);
  c.restore();
}
function background(c){
  const sky=c.createLinearGradient(0,0,0,670);sky.addColorStop(0,'#6e5e94');sky.addColorStop(.40,'#b87fae');sky.addColorStop(.73,'#e5aac5');sky.addColorStop(1,'#86c4d0');rect(c,-389,0,1778,1000,sky);
  // Offset orbital disc with cut lines, never an existing cover composition.
  const disc=c.createLinearGradient(0,130,0,480);disc.addColorStop(0,'#ffe0c6');disc.addColorStop(.55,'#f5b5cf');disc.addColorStop(1,'#de92c1');
  c.save();c.beginPath();c.arc(619,325,163,0,TAU);c.clip();rect(c,452,160,334,340,disc);for(let y=306;y<500;y+=21)rect(c,450,y,340,2+(y-300)*.035,'#b78bb4');c.restore();
  // Remote geometry provides the horizon's depth and a quiet cyan fog line.
  path(c,'M-389 604 L-165 536 L-47 564 L128 527 L289 578 L438 559 L621 604 L834 545 L1001 578 L1211 521 L1389 584 L1389 710 L-389 710Z','#8a86b3');
  path(c,'M-389 632 L-70 591 L189 620 L450 605 L705 629 L1019 610 L1389 623 L1389 693 L-389 693Z','#9bb7cf');
  const floor=c.createLinearGradient(0,635,0,1000);floor.addColorStop(0,'#686991');floor.addColorStop(.2,'#4b537f');floor.addColorStop(1,'#252e52');rect(c,-389,651,1778,349,floor);
  for(let i=-14;i<20;i++)line(c,[[570+(i-2)*24,651],[570+(i-2)*225,1000]],'#92b7d762',1.1);
  for(let i=0;i<15;i++){let y=651+349*(i/14)**2.65;line(c,[[-389,y],[1389,y]],'#a4bdde66',1.1);}
  line(c,[[-389,651],[1389,651]],'#bbe5e5',2);
  // Fluted architectural fragments flank the action rather than conceal it.
  column(c,915,646,310,45);column(c,345,638,146,37);
  palm(c,793,665,1.16,-1);palm(c,392,643,.77,1);
  ellipse(c,172,659,158,20,'#44467544');
  rect(c,90,563,166,88,'#a39bb9');rect(c,79,553,188,15,'#e2cddd');rect(c,74,651,198,19,'#c9bdd3');rect(c,61,670,224,12,'#6c6b99');
  const slab=c.createLinearGradient(90,0,254,0);slab.addColorStop(0,'#b9b2ce');slab.addColorStop(.42,'#e7d6e2');slab.addColorStop(1,'#9c98b9');rect(c,99,574,148,68,slab);line(c,[[124,588],[223,588]],'#8880a4',.7);
  bust(c);
  // A floating cut-glass prism and an ellipse introduce distinct graphic planes.
  path(c,'M820 202 L883 247 L824 310 L768 260Z','#afd9de77','#deeff0',1.5);path(c,'M820 202 L824 310 L839 254Z','#f3c5e388');line(c,[[768,260],[839,254],[883,247]],'#d9f5ed',1);
  c.save();c.translate(347,186);c.rotate(-.47);ellipse(c,0,0,65,19,null,'#dbb7dc',9);ellipse(c,0,-3,65,19,null,'#f2d5e9',2);c.restore();
  const r=rng(9034);c.save();for(let i=0;i<2400;i++){c.fillStyle=i%2?'#fff5f00a':'#26345a08';c.fillRect(r()*1778-389,r()*1000,1,1);}for(let y=1;y<1000;y+=4)rect(c,-389,y,1778,.5,'#33345b09');c.restore();
}

function scenery(c,t,scene){
  cached(c,'18:vapor:v2:9034',background);
  const mt=vaporMotionTime(t),gaze=t>=2&&t<3?Math.sin((mt-2)*TAU*4)*2.2:Math.sin(mt*.8)*.8;
  ellipse(c,211+gaze,349,2.1,1.7,'#66608d');
}
function chromeRider(c,at){
  const p=poseAt(at),edge='#c7e3ec';
  const chrome=c.createLinearGradient(0,-337,0,-179);
  for(const [at,col]of [[0,'#fff2ed'],[.23,'#a4e1e6'],[.46,'#aaa1d2'],[.49,'#71659d'],[.54,'#fce2f1'],[.79,'#c4c6e0'],[1,'#84cbd4']])chrome.addColorStop(at,col);
  for(const x of [-106,111]){
    ellipse(c,x,-62,63,63,null,'#6b6298',9);ellipse(c,x,-62,62,62,null,edge,3);
    ellipse(c,x,-62,53,53,null,'#bbacd6',2);
    for(let i=0;i<8;i++){const a=p.wheelAngle+i*TAU/8;line(c,[[x,-62],[x+Math.cos(a)*60,-62+Math.sin(a)*60]],i%2?'#ecaed8':'#93d6df',2.5);}
    const a=p.wheelAngle;ellipse(c,x+Math.cos(a)*54,-62+Math.sin(a)*54,5,5,'#e5d2ec');
    ellipse(c,x,-62,7,7,'#def0ef','#8b80b2',2);
  }
  const bars=[[[-106,-62],[-51,-150],[-8,-71],[-106,-62]],[[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150]],[[65,-150],[64,-180],[91,-191]], [[-54,-150],[-54,-173],[-77,-173],[-39,-173]]];
  for(const b of bars){line(c,b,'#77719f',9);line(c,b,'#f0cde6',4);line(c,b,'#b1e8e8',1);}
  const leg=i=>{const f=p.feet[i],k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#71699b',9);line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#c2e3e8',4);line(c,[[-8,-71],[f.x,f.y]],'#e2b9d9',3);line(c,[[f.x-9,f.y],[f.x+13,f.y]],'#f1dceb',5);};
  leg(1);c.save();c.translate(0,p.bob);
  // Angular chromium sculpture: planes replace the shared smooth cartoon contour.
  path(c,'M-139-237 L-105-259 L-56-272 L-13-256 L14-235 L12-283 L28-323 L52-338 L76-327 L86-308 L66-285 L58-249 L66-225 L34-195 L-20-178 L-77-188 L-111-208 L-145-216 L-124-224Z',chrome,'#7c75a7',3);
  path(c,'M-105-259 L-56-272 L-18-250 L8-214 L-41-197 L-91-216Z','#dcdae9','#8f8db5',1.5);
  path(c,'M-105-259 L-67-237 L-41-197 L-91-216Z','#a6c9d7');
  path(c,'M-67-237 L-18-250 L8-214 L-41-197Z','#c2abd4');
  path(c,'M14-235 L28-276 L28-323 L52-338 L49-292 L58-249 L34-195Z','#c4e7e7');
  path(c,'M28-323 L52-338 L76-327 L54-316 L49-292Z','#eee5ef');
  path(c,'M49-292 L66-285 L58-249 L66-225 L34-195Z','#918fb9');
  path(c,'M76-319 L239-303 L192-291 L83-294 L69-300Z','#eed3e8','#837fab',2);
  path(c,'M83-294 L192-291 L141-269 L103-280Z','#9dcfdc','#8e88b2',2);
  path(c,'M84-310 L224-303 L191-297 L87-301Z','#b1e8e7');
  path(c,'M-111-208 L-145-216 L-124-224 L-139-237 L-102-222Z','#bb9dcc','#8879a9',2);
  line(c,[[4,-222],[37,-188],[86,-191]],'#8f83b3',9);line(c,[[4,-222],[37,-188],[86,-191]],'#d3f0e9',4);
  ellipse(c,65,-320,5,5,'#f6e7ee','#7a739b',1.5);ellipse(c,67,-320,2.3,3,'#695f8f');
  c.restore();leg(0);ellipse(c,-8,-71,20,20,null,'#f0cae3',4);
}
export function renderSubject(c,t,scene){
  const mt=vaporMotionTime(t),abs=scene.start+mt;
  c.save();c.translate(500,805);
  c.save();c.translate(0,18);c.scale(1,-.19);c.globalAlpha=.19;chromeRider(c,abs);c.restore();
  chromeRider(c,abs);c.restore();
}
// The source cell drives displacement as well as joints. Four audible replays
// therefore visibly return the entire rider to the same short piece of road.
export function galleryPose(t){
  const q=Math.max(0,Math.min(6,t)),mt=vaporMotionTime(q);
  let x=q<2?205*q:q<3?410+320*(mt-2):490+(q-3)*580/3;
  if(q===6)x=1070;
  return {x,y:805,scale:1,poseTime:107+mt};
}
export function renderGallery(c,t,scene={start:107}){
  scenery(c,t,scene);
  if(scene.subject!==false){c.save();c.translate(galleryPose(t).x-500,0);renderSubject(c,t,scene);c.restore();}
}
export default function renderAt(c,t,scene){if(scene.gallery){renderGallery(c,t,scene);return;}scenery(c,t,scene);if(scene.subject!==false)renderSubject(c,t,scene);}
