import {cached,rng,path,line,ellipse,rect,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
const blues=['#173354','#244f7d','#356994','#527d9c','#8aaba5','#b8c6aa'];

// Broken, loaded brush marks are organized by the form beneath them.
function paint(c,seed,x,y,w,h,n,palette,field){
  const r=rng(seed);c.save();
  for(let i=0;i<n;i++){const px=x+r()*w,py=y+r()*h,a=field(px,py),len=5+r()*18;
    c.save();c.translate(px,py);c.rotate(a+(r()-.5)*.27);c.globalAlpha=.38+r()*.5;
    path(c,`M0 0 Q${len*.42} ${r()*5-2.5} ${len} 0`,null,palette[Math.floor(r()*palette.length)],2+r()*4);
    c.globalAlpha*=.55;line(c,[[1,-1],[len*.78,-1]],'#d7dfbf',.6);c.restore();
  }c.restore();
}
function ground(c){
  path(c,'M-389 684 Q-40 540 183 640 Q352 514 520 627 Q724 490 1000 630 Q1250 570 1389 697 L1389 1000 L-389 1000Z','#334f59');
  c.save();c.clip(new Path2D('M-389 684 Q-40 540 183 640 Q352 514 520 627 Q724 490 1000 630 Q1250 570 1389 697 L1389 1000 L-389 1000Z'));
  paint(c,180,-389,560,1778,330,3400,['#3e6265','#6c8173','#274c5b','#829482'],(x,y)=>-.18+Math.sin(x*.009)*.45);c.restore();
  // A compact, original village nests in the lower right, beside a curved lane.
  for(let i=0;i<12;i++){
    const x=245+(i%5)*140+(i>4?35:0),y=668+Math.floor(i/5)*83+Math.sin(i*1.7)*16,w=60+i%3*12,h=53+i%4*9;
    const wall=`M${x} ${y} L${x} ${y-h} L${x+w} ${y-h} L${x+w} ${y}Z`;
    path(c,wall,['#7b8c78','#a0a47d','#526b66'][i%3],'#1a3545',4);
    c.save();c.clip(new Path2D(wall));paint(c,i+88,x,y-h,w,h,30,['#abb392','#718678','#4f6761'],()=>1.5);c.restore();
    path(c,`M${x-9} ${y-h} L${x+w*.48} ${y-h-33} L${x+w+10} ${y-h}Z`,i%2?'#23445a':'#596d6a','#172e42',4);
    for(let k=0;k<2;k++){rect(c,x+12+k*25,y-29,12,18,'#e3cc74');line(c,[[x+16+k*25,y-28],[x+18+k*25,y-13]],'#f4d778',3);}
  }
  path(c,'M708 702 L737 556 L760 702 L757 817 L710 817Z','#6d8073','#203c4e',4);
  line(c,[[738,557],[738,537]],'#233d4d',4);line(c,[[725,547],[750,547]],'#233d4d',3);
  path(c,'M-389 931 Q99 773 461 816 Q711 868 1389 776 L1389 1000 L-389 1000Z','#667c6a');
  c.save();c.clip(new Path2D('M-389 931 Q99 773 461 816 Q711 868 1389 776 L1389 1000 L-389 1000Z'));
  paint(c,220,-389,790,1778,210,2200,['#7f9074','#9fae89','#4f7167','#c2bf8d'],(x,y)=>-.13+Math.sin(x*.008)*.1);c.restore();
  const tree='M52 1000 C37 883 126 789 91 665 C133 693 122 590 157 493 C188 554 172 622 204 665 C181 730 237 786 221 859 C245 913 250 968 244 1000Z';
  path(c,tree,'#122e36','#102934',5);c.save();c.clip(new Path2D(tree));paint(c,112,49,500,210,500,950,['#234b44','#355a4d','#102b35'],()=>-1.47);c.restore();
}
function sky(c){
  rect(c,-389,0,1778,1000,'#153555');
  paint(c,1889,-389,0,1778,690,5400,blues.slice(0,4),(x,y)=>{
    const dx=x-(x<520?307:750),dy=y-(x<520?240:385);return Math.atan2(dy,dx)+Math.PI/2;
  });
  // Small star clusters remain fixed. The two large brush whorls turn independently.
  for(const [x,y,r]of [[74,106,26],[574,86,29],[926,151,33],[539,491,17],[942,536,18]]){
    for(let k=0;k<13;k++){const a=k*TAU/13;line(c,[[x+Math.cos(a)*r,y+Math.sin(a)*r],[x+Math.cos(a+.2)*(r+7),y+Math.sin(a+.2)*(r+7)]],k%3?'#8caaad':'#d6ce83',4);}
    ellipse(c,x,y,7,9,'#e7d68c');line(c,[[x-3,y-6],[x+2,y+6]],'#f3e9ab',4);
  }
}
const spirals=new Map();
function spiralPlate(which){
  if(spirals.has(which))return spirals.get(which);
  const a=document.createElement('canvas');a.width=560;a.height=560;const g=a.getContext('2d');g.translate(280,280);
  const r=rng(8356+which),palette=['#244e79','#376d9a','#71999f','#b3c4a9','#e0cd81','#416e93'];
  // Unequal spiral arms: both silhouette and highlight landmarks rotate, not just dots.
  for(let arm=0;arm<3;arm++)for(let band=0;band<10;band++){
    const shift=arm*TAU/3+which*.7;
    for(let j=0;j<52;j++){
      const q=j/51,ang=shift+q*5.5,rr=18+q*205+(band-4.5)*3.1;
      const x=Math.cos(ang)*rr,y=Math.sin(ang)*rr;
      const aa=ang+1.24,len=9+r()*15;
      line(g,[[x,y],[x+Math.cos(aa)*len,y+Math.sin(aa)*len]],palette[(arm*2+band+Math.floor(j/7))%palette.length],3+r()*3);
    }
  }
  // Two asymmetric impasto crests make angular displacement readable at 600px.
  for(const [angle,radius,span]of [[.22,166,.65],[3.65,115,.42]])for(let k=0;k<17;k++){
    const aa=angle+k*span/17,rr=radius+Math.sin(k*.5)*5;
    line(g,[[Math.cos(aa)*rr,Math.sin(aa)*rr],[Math.cos(aa+.075)*rr,Math.sin(aa+.075)*rr]],k%4?'#d6d39a':'#f2dfa1',6+r()*3);
  }
  ellipse(g,0,0,12,10,'#a6bca6');spirals.set(which,a);return a;
}
function atmosphere(c,t,scene){
  cached(c,'starry:v2:sky:8356',sky);
  const a=poseAt(scene.start+t).wheelAngle;
  for(const [x,y,s,k]of [[305,243,1,0],[754,377,.78,1]]){
    c.save();c.translate(x,y);c.rotate(a+(k?1.8:0));c.scale(s,s*.76);c.drawImage(spiralPlate(k),-280,-280);c.restore();
  }
  cached(c,'starry:v2:ground:8356',ground);
}
const body='M-108-201 C-139-222-120-257-83-267 Q-42-280-8-246 L12-239 Q2-289 25-321 Q44-344 70-324 Q90-309 68-290 Q46-275 57-228 Q47-192-2-183 Q-59-174-108-201Z';
const wing='M-98-242 Q-47-267 6-214 Q-35-194-86-219Z';
function paintBodyPlate(c){
  path(c,body,'#bfc7a6','#244556',5);
  c.save();c.clip(new Path2D(body));paint(c,991,-140,-340,245,175,420,['#cfd3af','#e3dbad','#a5b69a','#7e9c8d'],(x,y)=>y< -260?-1.4:.25+Math.sin(x*.02)*.45);c.restore();
  path(c,wing,'#819c91','#35596a',4);c.save();c.clip(new Path2D(wing));paint(c,992,-110,-270,130,80,155,['#a3b6a0','#c5cbaa','#678c86'],()=>.55);c.restore();
  path(c,'M-108-211 L-145-231 L-120-228 L-136-245 L-97-223Z','#aebca2','#35596a',4);
  path(c,'M69-317 L231-304 Q193-289 80-294 L68-300Z','#d6ba65','#466b76',4);
  for(let i=0;i<14;i++){line(c,[[81+i*9,-310+i*.24],[87+i*9,-306+i*.23]],i%2?'#f0d790':'#acac6b',3);}
  path(c,'M80-293 Q143-254 194-297','#a6ae83','#456b75',4);
  for(let i=0;i<9;i++)line(c,[[91+i*10,-289+Math.sin(i*.35)*5],[99+i*10,-284+Math.sin(i*.35)*5]],i%2?'#d1c997':'#8ba38c',3);
  ellipse(c,59,-318,6,6,'#e8e2b3','#284858',2);ellipse(c,61,-318,2.9,3.5,'#1b3c51');
}
let paintedBody;
function bodyPaint(c){
  if(!paintedBody){paintedBody=document.createElement('canvas');paintedBody.width=440;paintedBody.height=400;const g=paintedBody.getContext('2d');g.translate(170,390);paintBodyPlate(g);}
  c.drawImage(paintedBody,-170,-390);
}
export function renderSubject(c,t,scene){
  const p=poseAt(scene.start+t);c.save();c.translate(500,805);c.lineCap='round';
  ellipse(c,0,9,161,13,'#132f3d66');
  for(const x of [-106,111]){
    ellipse(c,x,-62,63,63,null,'#17394e',10);ellipse(c,x,-62,62,62,null,'#d9d1a0',5);
    for(let i=0;i<8;i++){const a=p.wheelAngle+i*TAU/8;line(c,[[x,-62],[x+Math.cos(a)*58,-62+Math.sin(a)*58]],i===0?'#f1d580':'#93afa4',i===0?6:2.5);}
    const a=p.wheelAngle;line(c,[[x+Math.cos(a)*61,-62+Math.sin(a)*61],[x+Math.cos(a+.32)*61,-62+Math.sin(a+.32)*61]],'#f3d98d',7);
    ellipse(c,x,-62,6,6,'#e0cb8e');
  }
  const bars=[[[-106,-62],[-51,-150],[-8,-71],[-106,-62]],[[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150]],[[65,-150],[64,-180],[91,-191]], [[-54,-150],[-54,-173],[-77,-173],[-39,-173]]];
  for(const b of bars){line(c,b,'#234a5e',9);line(c,b,'#a8b99d',4);}
  const leg=i=>{const f=p.feet[i],k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#324f59',9);line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#c8b47b',4);line(c,[[-8,-71],[f.x,f.y]],'#e1c77e',3);};
  leg(1);c.save();c.translate(0,p.bob);bodyPaint(c);line(c,[[4,-222],[37,-188],[86,-191]],'#315667',8);line(c,[[4,-222],[37,-188],[86,-191]],'#b8c4a2',4);c.restore();leg(0);ellipse(c,-8,-71,18,18,null,'#d9c68d',4);c.restore();
}
export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:1};}
export function renderGallery(c,t,scene={start:71}){atmosphere(c,t,scene);if(scene.subject!==false){c.save();c.translate(galleryPose(t).x-500,0);renderSubject(c,t,scene);c.restore();}}
export default function renderAt(c,t,scene){if(scene.gallery){renderGallery(c,t,scene);return;}atmosphere(c,t,scene);if(scene.subject!==false)renderSubject(c,t,scene);}
