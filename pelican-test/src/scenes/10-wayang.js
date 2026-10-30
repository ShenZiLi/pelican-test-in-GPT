import {cached, rng, path, line, ellipse, rect, TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';

// Original leather patterns. A separate transparent plate makes every punched
// hole transmit the screen beneath it, including the moving lamp illumination.
let leather,softShadow;
const dark='#302b21', edge='#956638';
function rosette(c,x,y,r,n=12){
  for(let i=0;i<n;i++){const a=i*TAU/n;ellipse(c,x+Math.cos(a)*r,y+Math.sin(a)*r,2.5,2.5,'#000');}
  ellipse(c,x,y,3.2,3.2,'#000');
}
function bodyPlate(){
  if(leather)return leather;
  leather=document.createElement('canvas');leather.width=440;leather.height=420;
  const g=leather.getContext('2d');g.translate(170,410);g.lineJoin='round';
  // Serpentine neck, long hooked bill, curled tail and a serrated leather crown.
  const body='M-97-198 C-131-206-139-233-119-251 Q-93-280-62-263 C-33-275-2-246 16-241 C2-278 12-305 34-326 C49-342 70-331 78-315 Q87-300 63-287 C48-274 59-243 57-227 C47-195 11-178-35-182 Q-71-180-97-198Z';
  path(g,body,dark,edge,2.3);
  path(g,'M-112-224 Q-149-223-154-247 Q-132-227-126-243 Q-153-250-143-270 Q-128-241-111-254',dark,edge,1.6);
  path(g,'M25-322 Q-12-336 1-362 Q14-343 24-354 L19-378 42-362 53-389 63-359 84-375 80-345 100-344 77-321Z',dark,edge,1.6);
  path(g,'M68-316 Q150-326 232-303 Q207-293 80-295 L66-299Z',dark,edge,2);
  path(g,'M79-294 Q134-259 193-298 Q150-281 80-285Z','#6d4930',edge,1.3);
  path(g,'M-91-244 Q-45-271 7-214 Q-40-191-89-218Z','#63452d',edge,2);
  path(g,'M-81-238 Q-43-250-6-219 Q-40-207-76-225Z',dark,edge,1);
  // Carved edge bands retain a reddish translucent quality around the holes.
  g.strokeStyle='#a27440';g.lineWidth=1;
  path(g,'M-104-246 Q-65-277-21-243 M-109-210 Q-56-178 15-203 M34-315 Q21-281 37-244',null,'#9d703b',1);
  g.save();g.globalCompositeOperation='destination-out';
  for(let i=0;i<14;i++){const a=i*.27;ellipse(g,-66+Math.cos(a)*43,-232+Math.sin(a)*29,2.7,3.2,'#000');}
  rosette(g,-61,-230,13);rosette(g,-27,-225,10,10);rosette(g,-91,-237,8,9);
  for(let i=0;i<17;i++){const x=-99+i*8;ellipse(g,x,-204+Math.sin((x+104)/110*Math.PI)*12,2.5,3.1,'#000');}
  for(let i=0;i<10;i++)ellipse(g,26+Math.sin(i*.43)*5,-307+i*7,2.5,3.2,'#000');
  for(let i=0;i<19;i++)ellipse(g,86+i*7,-306+(i/19)*5,2.5,2.5,'#000');
  for(const [x,y] of [[9,-352],[27,-360],[52,-367],[74,-350]])rosette(g,x,y,4,6);
  // Long almond eye, small eyelid perforations, bill's scalloped pouch.
  path(g,'M48-316 Q57-324 67-316 Q58-308 48-316Z','#000');
  for(let i=0;i<10;i++)ellipse(g,95+i*8,-291+Math.sin(i/10*Math.PI)*10,2.2,2.5,'#000');
  g.restore();ellipse(g,59,-316,2,2,dark);
  return leather;
}
function shadowPlate(){
  if(!softShadow){softShadow=document.createElement('canvas');softShadow.width=460;softShadow.height=440;const g=softShadow.getContext('2d');g.filter='blur(3px)';g.drawImage(bodyPlate(),10,10);}
  return softShadow;
}
function background(c){
  cached(c,'wayang:8130:screen-v2',g=>{
    rect(g,-389,0,1778,1000,'#9a6b36');
    const glow=g.createRadialGradient(490,435,35,500,475,1040);
    glow.addColorStop(0,'#f4d998');glow.addColorStop(.44,'#d6b873');glow.addColorStop(1,'#9b713e');
    rect(g,-389,36,1778,866,glow);
    const r=rng(8130);
    for(let i=0;i<19500;i++){g.globalAlpha=.025+r()*.065;rect(g,r()*1778-389,45+r()*845,.4+r()*1.8,.4+r()*1.4,r()>.5?'#fff3ce':'#6b4e2e');}
    g.globalAlpha=.035;
    for(let x=-389;x<1390;x+=3.6)line(g,[[x,40],[x+1,900]],'#4e3a26',.45);
    for(let y=43;y<900;y+=4.2)line(g,[[-389,y],[1389,y+.5]],'#fff1c1',.5);
    g.globalAlpha=1;
    // Low wooden proscenium and traditional repeated leaf carving.
    rect(g,-389,0,1778,42,'#3c3020');rect(g,-389,42,1778,7,'#986c34');
    for(let x=-375;x<1390;x+=42){path(g,`M${x} 10 q12 30 24 0 q-12 10-24 0`,null,'#a27d42',1.1);}
    line(g,[[-389,67],[1389,67]],'#604726',1);
    for(const x of [22,978]){rect(g,x-18,42,36,900,'#443321');for(let y=70;y<900;y+=45)path(g,`M${x} ${y} q-18 18 0 34 q18-16 0-34Z`,null,'#9e793f',1);}
    // Pinned ornamental gunungan silhouettes flank the playing area.
    for(const [x,s] of [[111,.68],[889,-.68]]){
      g.save();g.translate(x,790);g.scale(s,Math.abs(s));
      path(g,'M0 0 Q-113-23-89-126 Q-69-228 0-367 Q68-232 91-124 Q111-24 0 0Z','#492423','#99713a',2);
      path(g,'M0-14 L0-318 M0-194 Q-57-169-64-99 M0-224 Q52-199 60-138 M0-116 Q-38-86-43-39',null,'#b28b4d',2);
      for(let row=0;row<10;row++){const y=-40-row*27,w=78*(1-row/12);for(let j=-2;j<=2;j++){const xx=j*w/3;ellipse(g,xx,y+Math.abs(j)*4,2.2,3.1,'#d1a963');}}
      for(let i=0;i<13;i++){const yy=-30-i*24,xx=82*(1-i/15);for(const s2 of [-1,1])path(g,`M${s2*xx} ${yy} q${s2*14}-12 0-24 q${-s2*18}12 0 24`,null,'#a98245',1);}
      g.restore();
    }
    line(g,[[-389,805],[1389,805]],'#72562f',1.3);
    rect(g,-389,905,1778,95,'#352b20');rect(g,-389,902,1778,4,'#a4773b');

  });
}
function musician(c,x,y,s,at){
  c.save();c.translate(x,y);c.scale(s,s);
  // Seated performers and bronze kettle rack, kept beneath the main road.
  path(c,'M-25-50 Q-38-26-32-8 L-57 7 Q-38 18-8 7 Q14 15 27 6 L8-9 3-49Z',dark);
  ellipse(c,-9,-69,12,16,dark);path(c,'M-24-78 Q-19-97-7-91 L8-77Z',dark);
  line(c,[[-24,-45],[-43,-22],[-65,-30+Math.sin(at*4)*3]],dark,5);
  line(c,[[2,-44],[29,-26],[53,-32+Math.cos(at*4)*3]],dark,5);
  line(c,[[-65,-30+Math.sin(at*4)*3],[-79,-45+Math.sin(at*4)*3]],'#483322',2);
  line(c,[[53,-32+Math.cos(at*4)*3],[66,-46+Math.cos(at*4)*3]],'#483322',2);
  rect(c,-88,-19,164,7,dark);line(c,[[-78,-15],[-84,15],[66,15],[63,-15]],dark,4);
  for(let i=0;i<6;i++){ellipse(c,-73+i*26,-23,11,5,dark);ellipse(c,-73+i*26,-28,3,3,dark);}
  c.restore();
}
function perforatedBar(c,a,b,width=7){
  line(c,[a,b],dark,width+2);line(c,[a,b],edge,width-1);
  const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor(d/13);
  for(let i=1;i<n;i++){const f=i/n;ellipse(c,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,1.1,1.1,'#e0bc79');}
}
function wheel(c,x,p){
  c.save();c.translate(x,-62);c.rotate(p.wheelAngle);
  ellipse(c,0,0,62,62,null,dark,5);ellipse(c,0,0,56,56,null,edge,1.7);
  ellipse(c,0,0,49,49,null,dark,1.2);
  for(let i=0;i<16;i++){const a=i*TAU/16,ca=Math.cos(a),sa=Math.sin(a);
    line(c,[[ca*8,sa*8],[ca*55,sa*55]],dark,1.8);
    ellipse(c,ca*52,sa*52,1.6,1.6,'#e8c681');
    c.save();c.rotate(a);path(c,'M17 0 Q30-10 43 0 Q30 10 17 0Z',null,dark,.85);c.restore();
  }
  ellipse(c,0,0,7,7,dark,edge,1);ellipse(c,0,0,2,2,'#edce8e');c.restore();
}
export function renderSubject(c,t,scene){
  const at=scene.start+t,qt=Math.floor((at+1e-8)*10)/10,p=poseAt(qt);
  c.save();c.translate(500,805);
  // Three slender control rods visibly terminate in riveted attachment points.
  line(c,[[7,-222+p.bob],[-13+Math.sin(qt*3)*13,198]],'#463b28',3.3);
  line(c,[[86,-191+p.bob],[178+Math.sin(qt*4)*17,199]],'#56402a',3);
  line(c,[[65,-150],[265+Math.sin(qt*2.7)*12,200]],'#423725',3);
  wheel(c,-106,p);wheel(c,111,p);
  for(const [a,b] of [[[-106,-62],[-51,-150]],[[-51,-150],[-8,-71]],[[-8,-71],[-106,-62]],[[-51,-150],[65,-150]],[[65,-150],[111,-62]],[[111,-62],[-8,-71]],[[-8,-71],[65,-150]]])perforatedBar(c,a,b,7);
  line(c,[[-51,-150],[-54,-173],[-77,-173],[-39,-173]],dark,6);
  line(c,[[65,-150],[64,-180],[89,-191],[99,-188]],dark,6);
  ellipse(c,-8,-71,20,20,dark,edge,1.8);
  for(let i=0;i<12;i++){const a=p.angle+i*TAU/12;ellipse(c,-8+Math.cos(a)*14,-71+Math.sin(a)*14,1.8,1.8,'#dbb777');}
  const leg=i=>{const f=p.feet[i],k=p.knees[i];perforatedBar(c,[p.hip.x,p.hip.y],[k.x,k.y],9);perforatedBar(c,[k.x,k.y],[f.x,f.y],7);line(c,[[-8,-71],[f.x,f.y]],dark,3);line(c,[[f.x-10,f.y],[f.x+13,f.y]],dark,5);ellipse(c,k.x,k.y,4,4,'#9f783f',dark,1);};
  c.save();c.globalAlpha=.66;leg(1);c.restore();
  c.save();c.globalAlpha=.20;c.drawImage(shadowPlate(),-174,-415+p.bob);c.restore();
  c.drawImage(bodyPlate(),-170,-410+p.bob);
  perforatedBar(c,[4,-222+p.bob],[37,-188+p.bob],8);
  perforatedBar(c,[37,-188+p.bob],[86,-191+p.bob],7);
  for(const [x,y] of [[4,-222],[37,-188],[86,-191]]){ellipse(c,x,y+p.bob,4.5,4.5,'#a47d43',dark,1);ellipse(c,x,y+p.bob,1.2,1.2,'#ebcd8e');}
  leg(0);ellipse(c,65,-150,3.5,3.5,'#b18a49',dark,1);
  c.restore();
}
function stage(c,t,scene){
  const at=scene.start+t;
  background(c);
  // Lamplight and the screen folds breathe continuously, independently of rig.
  c.save();c.globalAlpha=.06+.015*Math.sin(at*2.07);
  const lamp=c.createRadialGradient(500+Math.sin(at*.55)*35,500,30,500,500,620);
  lamp.addColorStop(0,'#fff6bc');lamp.addColorStop(1,'#fff6bc00');rect(c,-389,50,1778,848,lamp);c.restore();
  for(let i=0;i<5;i++){const x=-280+i*390+Math.sin(at*.37+i)*2;c.save();c.globalAlpha=.055;line(c,[[x,51],[x+12,900]],'#fff5c7',3);c.restore();}
  // Travelling ground stitches are continuous world motion, not puppet ticks.
  c.save();c.globalAlpha=.25;for(let i=-8;i<25;i++){let x=i*80-((at*105)%80);line(c,[[x,817],[x+26,817]],'#795a30',1);}c.restore();
  musician(c,110,897,.72,at);musician(c,890,897,.72,at+.7);
}
export function renderForeground(c,t,scene){
  // Front rail masks the puppeteers' lower rod ends but leaves their span clear.
  cached(c,'wayang:8130:front-v2',g=>{
    rect(g,-389,924,1778,76,'#2b261d');rect(g,-389,924,1778,5,'#96703a');
    for(let x=-380;x<1390;x+=33)path(g,`M${x} 961 q8-15 16 0 q-8 17-16 0Z`,null,'#795a32',1);
    line(g,[[-389,986],[1389,986]],'#9b773e',1);
  });
}

export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:1,poseTime:Math.floor((59+t+1e-8)*10)/10};}
export function renderGallery(c,t,scene={start:59}){
  stage(c,t,scene);
  if(scene.subject!==false){const p=galleryPose(t);c.save();c.translate(p.x-500,0);renderSubject(c,t,scene);c.restore();}
  renderForeground(c,t,scene);
}
export default function renderAt(c,t,scene){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  stage(c,t,scene);if(scene.subject!==false)renderSubject(c,t,scene);renderForeground(c,t,scene);
}
