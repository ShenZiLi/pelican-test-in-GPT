import {paper,cached,rng,path,line,ellipse,rect,text,title} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {poseAt} from '../rig/pose.js';

// Original pale-colour river town. Geometry is local to this square, including
// the bicycle's two contact points and the near-side railing occlusion.
const INK='#514d3d',FAINT='#79765c',SILK='#e6d9b8';
const arch=x=>{const q=Math.max(0,Math.min(1,(x-80)/860));return 805-184*Math.sin(Math.PI*q)**2;};
const curve=(offset=0,from=80,to=940,n=74)=>Array.from({length:n+1},(_,i)=>{const x=from+(to-from)*i/n;return [x,arch(x)+offset];});
function polygon(c,pts,fill,stroke=INK,w=1){path(c,`M${pts.map(p=>p.join(' ')).join('L')}Z`,fill,stroke,w);}
function timber(c,a,b,width=9,fill='#a89168'){
 const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),nx=-dy/d*width/2,ny=dx/d*width/2;
 polygon(c,[[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],fill,'#65573f',.85);
 line(c,[[a[0]+nx*.4,a[1]+ny*.4],[b[0]+nx*.4,b[1]+ny*.4]],'#e4cda1',.8);
 for(const p of [a,b])ellipse(c,p[0],p[1],1.4,1.4,'#4f4836');
}
function roof(c,x,y,w,h,depth=35,tone='#89917b'){
 // An oblique ridge, shallow eaves and exposed rafter ends, not a pagoda cap.
 path(c,`M${x-12} ${y-7} Q${x+w*.18} ${y-h*.32} ${x+w*.34} ${y-h} L${x+w*.8} ${y-h+depth*.35} Q${x+w*.9} ${y+depth*.5} ${x+w+20} ${y+depth*.6-8} L${x+w+20} ${y+depth*.6} L${x+w*.68} ${y+depth} L${x-12} ${y}Z`,tone,INK,1.25);
 line(c,[[x+w*.34,y-h],[x+w*.8,y-h+depth*.35],[x+w+20,y+depth*.6]],'#454c3e',1.8);
 line(c,[[x-16,y-3],[x+w*.68,y+depth-3],[x+w+25,y+depth*.6-4]],'#454c3e',1.5);
 for(let i=0;i<=Math.round(w/8);i++){
  const q=i/Math.round(w/8),a=[x+w*.34+q*w*.46,y-h+q*depth*.35],b=[x-10+q*w*.69,y+q*depth];
  line(c,[a,b],'#56614f',.55);line(c,[[b[0],b[1]-1],[b[0]+2,b[1]+3]],INK,.7);
 }
 for(let j=1;j<5;j++)line(c,[[x-10+(w*.34+10)*j/5,y-h*j/5],[x+w*.68+(w*.12)*j/5,y+depth-(h+depth*.65)*j/5]],'#b7b79a',.5);
}
function building(c,{x,y,w,h,roofH=50,depth=35,tone='#ded0a8',open=false,storeys=1}){
 polygon(c,[[x,y-h],[x+w*.68,y-h+depth],[x+w*.68,y+depth],[x,y]],tone,INK,1);
 polygon(c,[[x+w*.68,y-h+depth],[x+w,y-h+depth*.6],[x+w,y+depth*.6],[x+w*.68,y+depth]],'#c3bd9e',INK,.9);
 for(let k=1;k<storeys;k++)line(c,[[x,y-h*k/storeys],[x+w*.68,y+depth-h*k/storeys],[x+w,y+depth*.6-h*k/storeys]],INK,1.3);
 for(let i=0;i<Math.max(2,Math.round(w/40));i++){
  const xx=x+8+i*31,yy=y+(xx-x)/w*depth/.68;
  if(xx>x+w*.68-19)break;
  for(let floor=0;floor<storeys;floor++){
   const top=yy-(floor+1)*h/storeys+12,bottom=yy-floor*h/storeys-9;
   polygon(c,[[xx,top],[xx+21,top+5],[xx+21,bottom+5],[xx,bottom]],open?'#777d65':'#b8b495',INK,.65);
   if(!open){
    line(c,[[xx+10,top+3],[xx+10,bottom+2]],FAINT,.6);
    for(let j=top+8;j<bottom;j+=9)line(c,[[xx+2,j],[xx+19,j+4]],FAINT,.55);
    path(c,`M${xx+3} ${top+6} l5 6 -4 5 m12 -8 l-4 6 4 7`,null,'#d6cfad',.6);
   }
  }
  line(c,[[xx-5,yy-h+5],[xx-5,yy+1]],'#676249',1.5);
 }
 line(c,[[x-3,y+2],[x+w*.68,y+depth+3],[x+w+3,y+depth*.6+2]],'#77715a',2);
 // Narrow string courses, exposed joinery and irregular plaster losses keep
 // the architecture from becoming a stack of unmodulated colour rectangles.
 line(c,[[x+2,y-h+8],[x+w*.68-2,y-h+depth+8]],'#8a8163',.65);
 for(let i=0;i<6;i++){
  const xx=x+10+i*w*.1,yy=y+(xx-x)*depth/(w*.68);
  path(c,`M${xx} ${yy-6} l7 1 m-4 -3 l10 2`,null,'#817e6155',.55);
 }
 if(storeys>1){
  line(c,[[x+2,y-h*.46],[x+w*.68,y+depth-h*.46],[x+w,y+depth*.6-h*.46]],'#65654c',1.3);
  for(let xx=x+5;xx<x+w*.68;xx+=12){const yy=y+(xx-x)*depth/(w*.68)-h*.46;line(c,[[xx,yy],[xx,yy-10]],'#77765b',.65);}
 }
 roof(c,x,y-h,w,roofH,depth);
}
function vessel(c,x,y,s=1,kind='cargo'){
 c.save();c.translate(x,y);c.scale(s,s);
 for(let i=0;i<4;i++)path(c,`M${-111-i*10} ${14+i*6} q110 23 ${232+i*18} -3`,null,'#6b85713c',.7);
 path(c,'M-105 -12 Q-25 7 108 -20 L88 2 Q-18 37 -91 8Z','#9d8155',INK,1.2);
 path(c,'M-105 -12 Q-8 6 108 -20 L92 -29 Q-8 -10 -105 -12Z','#d0b487',INK,.9);
 for(let i=0;i<8;i++)path(c,`M${-85+i*23} -7 q-4 9 5 24`,null,'#665a43',.65);
 if(kind==='cargo'){
  path(c,'M-53 -12 L-53 -56 Q-22 -89 22 -59 L42 -20Z','#c8bd96',INK,1);
  for(let i=0;i<6;i++)path(c,`M${-49+i*13} -13 Q${-46+i*12} -57 ${-40+i*12} ${-65+Math.abs(i-2)*4}`,null,'#79745a',.7);
  rect(c,43,-33,25,14,'#a9a48a',INK,.6);ellipse(c,61,-38,15,8,'#beae82',INK,.7);
  person(c,-76,-12,.59,{robe:'#9aab93',facing:1});
  line(c,[[-77,-60],[-41,45]],INK,1.5);
 }else{
  line(c,[[-16,-12],[-16,-126]],INK,1.7);
  path(c,'M-12 -119 Q27 -97 67 -105 L53 -31 Q17 -29 -12 -42Z','#dbcfab',INK,.85);
  for(let i=0;i<5;i++)line(c,[[-10,-106+i*14],[62-i*2,-94+i*13]],'#8d8969',.55);
  line(c,[[-16,-125],[-92,-10]],'#7c7154',.65);
  person(c,69,-20,.5,{robe:'#ab7961',facing:-1});
 }
 c.restore();
}
function willow(c,x,y,s=1){
 c.save();c.translate(x,y);c.scale(s,s);
 path(c,'M-7 0 Q8 -54 3 -115 Q-7 -159 18 -205 M4 -95 Q-24 -133 -52 -146 M5 -119 Q34 -150 73 -153 M9 -157 Q-5 -186 -27 -190',null,'#646b50',6);
 const r=rng(678);for(let i=0;i<37;i++){
  const a=-75+r()*160,b=-155-r()*55;path(c,`M8 -161 Q${a*.5} ${b-29} ${a} ${b} Q${a-10} ${b+60} ${a-3} ${b+112}`,null,'#77876b',.7+r()*.6);
  for(let j=0;j<7;j++)ellipse(c,a+Math.sin(j*.9+i)*5,b+20+j*12,2.5,6,'#83937266');
 }c.restore();
}
function market(c,x,y,s=1,tone='#a88364',label='茶'){
 c.save();c.translate(x,y);c.scale(s,s);
 polygon(c,[[-48,-42],[40,-41],[59,-10],[-58,-11]],tone,INK,1);
 for(let i=-40;i<48;i+=13)line(c,[[i,-40],[i*1.2,-11]],'#e1cda3',.75);
 for(const xx of [-46,46])line(c,[[xx,-12],[xx,42]],'#6d6048',2);
 polygon(c,[[-52,11],[48,12],[45,27],[-51,25]],'#c4ad7c',INK,.8);
 for(let i=0;i<5;i++){ellipse(c,-37+i*18,9,7,4,'#927c53',INK,.6);path(c,`M${-43+i*18} 5 q5 -15 11 0`,null,INK,.65);}
 line(c,[[-41,25],[-43,41]],INK,1.5);line(c,[[39,27],[40,43]],INK,1.5);
 rect(c,28,-70,19,29,'#e1cca0',INK,.75);text(c,label,37,-48,15,INK,{align:'center'});
 c.restore();
}
function person(c,x,y,s=1,{robe='#a9ad92',facing=1,turn=0,role='walk',seed=1}={}){
 c.save();c.translate(x,y);c.scale(s,s);
 const dir=facing*(1-turn)+turn,head=dir*3.2;
 // The shoulder and sleeve turn first, then the nose and eye point at the bird.
 path(c,`M-5 -47 Q${dir*5} -50 8 -44 L12 -24 L18 -4 Q3 2 -15 -3 L-9 -27Z`,robe,INK,1.1);
 path(c,'M-5 -44 Q-2 -31 -9 -5 M6 -42 Q4 -24 12 -5',null,'#736e55',.65);
 line(c,[[-7,-2],[-10,4],[-16,4]],INK,1.5);line(c,[[8,-2],[11,3],[15,3]],INK,1.5);
 ellipse(c,head,-55,6,8,'#d7b58c',INK,.85);
 path(c,`M${head-6} -58 q5 -9 12 0 L${head+6} -61 Q${head} -68 ${head-6} -61Z`,'#676a53',INK,.65);
 const noseX=head+dir*7;line(c,[[head+dir*5,-57],[noseX,-54],[head+dir*5,-52]],INK,.75);
 ellipse(c,head+dir*3.8,-57,.75,.75,INK);
 if(role==='porter'){
  line(c,[[-3,-36],[19,-39],[25,-51]],INK,2);
  line(c,[[-38,-48],[44,-53]],'#6b6348',2.4);
  for(const xx of [-32,36]){line(c,[[xx,-49],[xx,-12]],INK,.8);path(c,`M${xx-11} -17 L${xx+11} -17 L${xx+8} -1 L${xx-8} -1Z`,'#bb9d66',INK,.7);for(let j=-5;j<7;j+=4)line(c,[[xx+j,-15],[xx+j,-2]],FAINT,.55);}
 }else if(role==='merchant'){
  line(c,[[-5,-35],[16,-31],[22,-35]],INK,2);
  // Deliberately still, despite his head following the moving cyclist.
  line(c,[[17,-37],[58,-37]],INK,1.3);line(c,[[37,-37],[37,-24]],INK,.65);
  for(const xx of [22,54]){line(c,[[xx,-37],[xx-4,-22],[xx+4,-22],[xx,-37]],INK,.6);ellipse(c,xx,-21,7,2,'#b79e70',INK,.65);}
 }else{line(c,[[-6,-35],[-15,-20],[-4+dir*9,-23]],INK,1.8);line(c,[[7,-35],[17,-24],[13,-12]],INK,1.8);}
 c.restore();
}
function bank(c){
 paper(c,{base:SILK,seed:7678});
 cached(c,'riverside-v2-town',g=>{
  // Broken distant bank and river leave the upper paper airy.
  path(g,'M-389 317 Q-80 305 95 286 Q278 237 423 292 Q615 337 821 237 Q984 232 1389 307 L1389 1000 L-389 1000Z','#a8b3a017');
  path(g,'M-389 406 Q-45 431 205 342 L355 373 Q373 469 295 530 Q249 598 119 657 L-389 771Z','#c9c5a1',null);
  path(g,'M1389 270 L849 301 Q731 377 728 463 Q756 522 829 549 L1389 690Z','#c6bea0');
  path(g,'M-389 421 Q-44 444 205 349 L348 378 Q357 464 287 526 Q221 587 117 641 M1389 290 L851 312 Q738 380 741 461 Q771 520 835 536 L1389 680',null,'#85856a',1.2);
  // Distant hamlet: intentionally unequal roof spans, courtyards and gaps.
  const distant=[{x:35,y:246,w:90,h:39,roofH:24,depth:14},{x:136,y:225,w:118,h:55,roofH:21,depth:20},{x:272,y:267,w:71,h:46,roofH:19,depth:16},{x:799,y:222,w:111,h:41,roofH:25,depth:17},{x:927,y:250,w:96,h:57,roofH:20,depth:18}];
  g.save();g.globalAlpha=.35;distant.forEach(o=>building(g,o));g.restore();
  for(let i=0;i<31;i++){const x=25+i*31;line(g,[[x,295+Math.sin(i)*10],[x+8,279+Math.sin(i)*10]],'#7c876252',.8);}
  building(g,{x:-92,y:433,w:273,h:112,roofH:47,depth:48,storeys:2});
  building(g,{x:143,y:369,w:164,h:82,roofH:37,depth:28,tone:'#d4c39e'});
  building(g,{x:5,y:543,w:177,h:98,roofH:36,depth:31,open:true});
  building(g,{x:784,y:393,w:242,h:125,roofH:52,depth:43,storeys:2,tone:'#d7c7a1'});
  building(g,{x:862,y:533,w:157,h:91,roofH:34,depth:29,open:true});
  building(g,{x:726,y:312,w:105,h:64,roofH:29,depth:20,tone:'#d3c8a6'});
  // Pier stairs, palings and stone courses establish the working bank.
  polygon(g,[[180,470],[279,480],[268,546],[159,558]],'#c4b792',INK,.8);
  for(let i=0;i<7;i++)line(g,[[178-i*3,480+i*10],[277-i*3,488+i*10]],'#8d8469',.8);
  for(let x=163;x<285;x+=19)line(g,[[x,554],[x+10,590]],'#7b7557',2.1);
  for(let j=0;j<3;j++)line(g,[[764,478+j*13],[836+j*9,512+j*10]],'#847960',.65);
  market(g,231,531,.8,'#b7956c','米');market(g,92,612,.95,'#9baca0','茶');market(g,867,577,.9,'#a78068','布');
  willow(g,36,445,.85);willow(g,985,338,.65);
  // Timber, tied baskets, bolts of cloth, and individual workers.
  for(let i=0;i<5;i++){ellipse(g,307+i*7,485-i*3,8,4,'#b5a575',INK,.7);line(g,[[302+i*7,486-i*3],[313+i*7,486-i*3]],FAINT,.5);}
  for(const [x,y,s,r]of [[159,434,.65,'#a56f54'],[243,420,.6,'#9aa48a'],[62,551,.67,'#b59c76'],[263,572,.65,'#a9ab91'],[773,416,.6,'#b8a07a'],[829,492,.67,'#a7755b'],[956,570,.73,'#94a18a']])person(g,x,y,s,{robe:r,facing:x<500?1:-1});
  line(g,[[177,578],[227,556]],INK,1);person(g,206,568,.62,{robe:'#99896a',role:'porter'});
  vessel(g,508,405,.56,'sail');vessel(g,608,532,.6,'cargo');
  const r=rng(5806);for(let i=0;i<150;i++){
   const x=-100+r()*1200,y=352+r()*645;if((x<280&&y<615)||(x>755&&y<560))continue;
   path(g,`M${x} ${y} q${8+r()*9} -${1+r()*2} ${22+r()*30} -1`,null,i%3?'#607e7035':'#55726560',.55+r()*.35);
  }
  // Island of earth at the two springings, small vegetation, cobbles.
  path(g,'M-389 768 Q11 733 147 785 L174 865 Q1 907 -389 964Z','#c3bc94',INK,1.2);
  path(g,'M859 784 Q1007 735 1389 760 L1389 984 Q1077 919 842 868Z','#c3ba92',INK,1.2);
  for(let i=0;i<60;i++){const side=i%2,x=side?898+r()*330:r()*128-40,y=793+r()*82;path(g,`M${x} ${y} l6 -3 7 2`,null,'#7e7b5e',.6);}
  for(let i=0;i<25;i++){const x=i<12?80+r()*65:870+r()*110,y=859+r()*50;path(g,`M${x} ${y} q-7 -20 -8 -29 M${x} ${y} q-1 -21 3 -33 M${x} ${y} q5 -15 11 -25`,null,'#6c8060',.75);}
 });
}
function bridgeBack(c){
 cached(c,'riverside-v2-bridge',g=>{
  // The lower rib and crossed long timbers are a legible wooden arch.
  const low=curve(105),high=curve(31);
  polygon(g,[...high,...low.reverse()],'#a4946f','#716346',1.35);
  for(let i=0;i<14;i++){
   const a=89+i*60,b=Math.min(936,a+112);
   timber(g,[a,arch(a)+38],[b,arch(b)+101],9,i%2?'#ac946a':'#b79e73');
   timber(g,[a,arch(a)+101],[b,arch(b)+38],9,i%2?'#c3ab7d':'#a58d63');
  }
  for(const off of [30,105])line(g,curve(off),'#655b42',3.1);
  for(const off of [35,100])line(g,curve(off),'#c6b084',1.1);
  // Far railing is behind all travellers.
  for(let x=90;x<943;x+=35){const y=arch(x);timber(g,[x,y-18],[x,y-68],3.7,'#a8976f');}
  line(g,curve(-65),'#665d43',2.5);line(g,curve(-44),'#8e7b56',1.8);
  polygon(g,[...curve(-15),...curve(25).reverse()],'#c8b58a',INK,1.1);
  for(let x=82;x<=940;x+=13)line(g,[[x,arch(x)-14],[x,arch(x)+24]],'#837458',.7);
  line(g,curve(-13),'#ecdbb1',2.3);line(g,curve(24),'#6e6248',2.2);
  // Woodgrain follows the structural members instead of random screen hatching.
  for(let i=0;i<24;i++){let x=96+i*34;line(g,[[x,arch(x)+43],[x+18,arch(x+18)+54]],'#72624866',.65);}
 });
}
function bridgeFront(c){
 // Foreground rail is intentionally drawn AFTER the rider and people.
 for(let x=91;x<944;x+=35){const y=arch(x);timber(c,[x,y+26],[x,y-24],4.3,'#9d875f');ellipse(c,x,y-25,3.6,2,'#a18b63',INK,.6);}
 line(c,curve(-24),'#61573f',3);line(c,curve(-21),'#c7b182',1);
 line(c,curve(-5),'#8b7752',2.1);line(c,curve(27),'#706044',2.7);
}

export function riderState(t){
 const x=t*1070/6,s=.29,wheelR=62*s,halfbase=217*s/2;
 // Solve the two wheel contacts, not just a tangent at the bicycle centre.
 const left=arch(x-halfbase),right=arch(x+halfbase),angle=Math.atan2(right-left,halfbase*2);
 return {x,y:(left+right)/2,angle,scale:s,wheelRadius:wheelR};
}
export const galleryPose=riderState;
function inkRider(c,t){
 const p=poseAt(t),ink='#3f493a';
 const stroke=(points,w=3)=>line(c,points,ink,w);
 for(const wx of [-106,111]){
  ellipse(c,wx,-62,62,62,'#e4d9b21c',ink,3.6);
  for(let i=0;i<12;i++){const a=p.wheelAngle+i*Math.PI/6;stroke([[wx,-62],[wx+Math.cos(a)*59,-62+Math.sin(a)*59]],1.8);}
  ellipse(c,wx,-62,4,4,ink);
 }
 stroke([[-106,-62],[-51,-150],[-8,-71],[-106,-62]],3.7);
 stroke([[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150]],3.7);
 stroke([[65,-150],[64,-180],[87,-191],[99,-188]],4);
 stroke([[-51,-150],[-54,-173],[-77,-173],[-39,-173]],5);
 ellipse(c,-8,-71,18,18,null,ink,2.8);
 const leg=i=>{const f=p.feet[i],k=p.knees[i];stroke([[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],3.8);stroke([[-8,-71],[f.x,f.y]],2.7);stroke([[f.x-10,f.y],[f.x+12,f.y]],4.5);};
 c.save();c.globalAlpha=.6;leg(1);c.restore();
 c.save();c.translate(0,p.bob);
 path(c,'M-102 -201 C-133 -217 -123 -250 -85 -263 C-49 -277 -12 -252 10 -241 C5 -278 13 -312 34 -326 C52 -335 76 -327 79 -312 C82 -299 72 -288 62 -285 C45 -268 54 -243 54 -226 C44 -198 12 -180 -32 -183 C-65 -182 -83 -193 -102 -201Z','#e9e0c8',ink,3.8);
 path(c,'M69 -315 L232 -303 Q206 -293 80 -295 L69 -300Z','#c9ae76',ink,2.9);
 path(c,'M80 -295 Q145 -261 193 -297','#d3c6a2',ink,2.4);
 path(c,'M-110 -209 L-146 -226 L-126 -220 L-141 -235 L-103 -219Z','#dcd8c0',ink,2.2);
 path(c,'M-88 -243 C-61 -264 -14 -248 5 -216 Q-34 -192 -87 -219Z','#d0d2b9',ink,2.4);
 for(let i=0;i<7;i++)path(c,`M${-86+i*8} ${-238+i*2} q19 18 38 20`,null,ink,1.7);
 stroke([[4,-222],[37,-188],[86,-191]],3.5);
 ellipse(c,60,-315,6,6,'#f3ead3',ink,2);ellipse(c,62,-315,2.8,3,ink);
 c.restore();leg(0);
}
function cyclist(c,t,scene){
 const p=riderState(t);c.save();c.translate(p.x,p.y);c.rotate(p.angle);
 c.scale(p.scale,p.scale);inkRider(c,(scene.start??35)+t);
 c.restore();
}
const WATCHERS=[
 {x:336,robe:'#a9765b',role:'walk',facing:-1,delay:2},
 {x:565,robe:'#879b8b',role:'porter',facing:1,delay:2.18},
 {x:692,robe:'#b29b70',role:'merchant',facing:1,delay:2.36},
 {x:784,robe:'#8e9780',role:'walk',facing:1,delay:2.55},
];
function walkers(c,t){
 const bird=riderState(t);
 for(const p of WATCHERS){
  const ease=Math.max(0,Math.min(1,(t-p.delay)/.4));
  const look=bird.x>p.x?1:-1;
  const initial=p.facing,dir=initial+(look-initial)*ease;
  // A small shoulder rotation and a substantial profile change remain visible
  // even at the 0.61 gallery projection. Feet and carried goods stay planted.
  person(c,p.x,arch(p.x)+12,1.04,{...p,facing:dir,turn:0});
 }
 person(c,196,arch(196)+12,.91,{robe:'#b5a78a',facing:1,role:'walk'});
 person(c,871,arch(871)+12,.94,{robe:'#a87e62',facing:-1,role:'walk'});
}
function foreground(c){
 cached(c,'riverside-v2-foreground',g=>{
  vessel(g,388,913,1.04,'cargo');
  // Mooring ropes, stern worker, floating reed, bank basket and an untrimmed tree.
  line(g,[[283,903],[138,873]],'#7e7151',.85);line(g,[[492,911],[853,864]],'#7e7151',.85);
  person(g,487,896,.65,{robe:'#a26e55',facing:-1});line(g,[[486,858],[541,939]],INK,1.6);
  vessel(g,822,968,.61,'sail');
  for(let i=0;i<6;i++){ellipse(g,55+i*13,909+i%2*10,13,8,'#b69d69',INK,.8);for(let j=-7;j<8;j+=4)line(g,[[55+i*13+j,904+i%2*10],[55+i*13+j,914+i%2*10]],'#817149',.6);}
  willow(g,-26,1009,1.22);
 });
}
function pigment(c){
 cached(c,'riverside-v2-pigment',g=>{
  const r=rng(7679);for(let i=0;i<5600;i++){
   const x=r()*1778-389,y=r()*1000;
   ellipse(g,x,y,.25+r()*.65,.18+r()*.3,i%4?'#6355370a':'#fff5d918');
  }
  for(let i=0;i<210;i++){const x=r()*1778-389,y=r()*1000;line(g,[[x,y],[x+10+r()*35,y+r()*1.5]],'#eee2c513',.6);}
 });
}

export function renderGallery(c,t,scene={}){
 bank(c);bridgeBack(c);
 if(scene.subject!==false)cyclist(c,t,scene);
 // Onlookers occupy the near pedestrian edge. Their opaque robes must also
 // occlude the bicycle; transparent spokes must never cut through a person.
 walkers(c,t);bridgeFront(c);foreground(c);pigment(c);
}
export default function renderAt(c,t,scene={}){
 renderGallery(c,t,scene);title(c,scene,{x:45,y:95,color:'#60674f'});
}
// Kept for the old full-width renderer and transition/thumbnail integrations.
// Gallery uses renderGallery so it never supplies an independent giant rider.
export function renderSubject(c,t,scene={}){pelican(c,(scene.start??35)+t,{x:500,y:805,scale:1,style:'line',body:'#e6dfc9',ink:'#3f4a3d',accent:'#c0a777'});}
