import {cached,rect,line,ellipse,path,text,rng,TAU} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {poseAt} from '../rig/pose.js';
import {faultAmount,smooth,clamp} from '../beat/timeline.js';

// All phosphor history is resampled from the clock. No previous canvas is read.
const GREEN='#87ffad';
function screw(c,x,y){
  const g=c.createRadialGradient(x-3,y-4,1,x,y,10);g.addColorStop(0,'#b0b9aa');g.addColorStop(.6,'#536257');g.addColorStop(1,'#1c2822');
  ellipse(c,x,y,10,10,g,'#152019',1.5);line(c,[[x-5,y+4],[x+5,y-4]],'#15221c',2.7);
}
function label(c,s,x,y,n=17,col='#d7dccc',align='center'){text(c,s,x,y,n,col,{mono:true,align});}
function knob(c,x,y,r,angle){
  ellipse(c,x+3,y+7,r+8,r+8,'#0d1714');
  const g=c.createRadialGradient(x-r*.3,y-r*.4,3,x,y,r);g.addColorStop(0,'#5b665b');g.addColorStop(.7,'#29372f');g.addColorStop(1,'#101d18');
  ellipse(c,x,y,r,r,g,'#8a9683',2);
  for(let i=0;i<30;i++){let a=i*TAU/30;line(c,[[x+Math.cos(a)*(r-3),y+Math.sin(a)*(r-3)],[x+Math.cos(a)*(r-9),y+Math.sin(a)*(r-9)]],'#798575',1.2);}
  ellipse(c,x,y,r-13,r-13,'#202e25','#596956',1);
  line(c,[[x+Math.sin(angle)*9,y-Math.cos(angle)*9],[x+Math.sin(angle)*(r-15),y-Math.cos(angle)*(r-15)]],'#e3e5c7',3.6);
  ellipse(c,x,y,4,4,'#61705d');
}
function dialScale(c,x,y,r){
  for(let i=0;i<=20;i++){const a=(-.8+i/20*1.6)*Math.PI;line(c,[[x+Math.sin(a)*(r+7),y-Math.cos(a)*(r+7)],[x+Math.sin(a)*(r+(i%5?12:19)),y-Math.cos(a)*(r+(i%5?12:19))]],'#a7b09a',i%5?1:2);}
}
function panel(c){
  const noise=rng(8695);
  const bg=c.createLinearGradient(0,0,0,1000);bg.addColorStop(0,'#07120f');bg.addColorStop(.5,'#23372a');bg.addColorStop(1,'#080f0c');rect(c,-389,0,1778,1000,bg);
  // The complete field is an original, rack-mounted laboratory instrument.
  const metal=c.createLinearGradient(-330,0,1300,900);metal.addColorStop(0,'#75806e');metal.addColorStop(.22,'#45584a');metal.addColorStop(.48,'#647361');metal.addColorStop(.7,'#3d4d41');metal.addColorStop(1,'#26392d');
  rect(c,-342,30,1684,940,'#0d1913','#82917b',3);rect(c,-329,43,1658,913,metal,'#18281f',3);
  for(let i=0;i<2000;i++){const y=45+noise()*908;line(c,[[-326+noise()*1650,y],[-326+noise()*1650,y]],'#f0edd206',.7);}
  for(let y=92;y<940;y+=64){rect(c,-374,y,20,35,'#050c08','#465341',2);rect(c,1355,y,20,35,'#050c08','#465341',2);}
  for(const x of [-305,1305])for(const y of [68,925])screw(c,x,y);
  line(c,[[-282,218],[-48,218]],'#c6ccb050',1);line(c,[[1010,218],[1280,218]],'#c6ccb050',1);
  label(c,'鹈鹕实验仪器厂',-165,90,19,'#e0e2ca');
  text(c,'示波器',-285,150,43,'#eef0d9',{weight:700});
  label(c,'Oscilloscope',-165,190,25,'#d3dac7');
  text(c,'1950年代',-165,255,26,'#e1e6cf',{align:'center'});
  label(c,'双轴 · 电子示踪',-165,295,18,'#c4ccb7');
  label(c,'XY / MODEL 57',1150,93,22,'#edf0dc');
  label(c,'双通道荧光显示',1150,130,20,'#d4dbc5');
  label(c,'LABORATORY',1150,168,19,'#bccab2');
  // Heavy machined bezel, bolts, rubber gasket and concave glass.
  const rim=c.createLinearGradient(60,40,940,960);rim.addColorStop(0,'#ccd1b8');rim.addColorStop(.13,'#758772');rim.addColorStop(.33,'#162a21');rim.addColorStop(.57,'#849078');rim.addColorStop(.8,'#263f2c');rim.addColorStop(1,'#b4bfa3');
  ellipse(c,500,507,454,454,'#101c15');ellipse(c,500,500,450,450,rim,'#b3bda2',2);
  ellipse(c,500,500,429,429,'#09180f','#0a110d',8);ellipse(c,500,500,418,418,'#1b3524','#9ba98d',1);
  const glass=c.createRadialGradient(450,410,20,500,500,417);glass.addColorStop(0,'#123e2a');glass.addColorStop(.65,'#0b2e20');glass.addColorStop(1,'#03140d');ellipse(c,500,500,414,414,glass,'#050d08',3);
  for(let i=0;i<12;i++){const a=(i+.5)*TAU/12;screw(c,500+Math.cos(a)*440,500+Math.sin(a)*440);}
  c.save();ellipse(c,500,500,411,411);c.clip();
  for(let i=0;i<13;i++){const p=140+i*60;line(c,[[p,85],[p,915]],'#8afaaf19',1);line(c,[[85,p],[915,p]],'#8afaaf19',1);}
  line(c,[[90,500],[910,500]],'#8affa83f',1.2);line(c,[[500,90],[500,910]],'#8affa83f',1.2);
  for(let p=100;p<910;p+=12){line(c,[[p,496],[p,504]],'#9cf4a745',1);line(c,[[496,p],[504,p]],'#9cf4a745',1);}
  label(c,'X–Y',500,191,19,'#91d7a657');label(c,'PHOSPHOR / P-31',500,223,15,'#91d7a63d');
  // A faint curved reflection remains above the action, like real glass.
  path(c,'M 209 260 C 290 113 555 97 708 176 C 518 129 337 177 209 300 Z','#c5ffdf08');
  c.restore();
  for(const [x,y,s] of [[-165,427,'聚焦 / FOCUS'],[-165,665,'亮度 / INTENSITY'],[1150,343,'时基 / TIME BASE'],[1150,620,'X / Y 增益']]){label(c,s,x,y-86,19);dialScale(c,x,y,46);knob(c,x,y,46,.23);}
  label(c,'勿动 · CALIBRATED',1150,711,18,'#ebcb9c');
  label(c,'OFF',-216,870,17);label(c,'ON',-112,870,17);line(c,[[-165,858],[-139,832]],'#c6ccb3',7);ellipse(c,-165,858,11,11,'#17231b','#b7bfa2',2);
  ellipse(c,-164,785,8,8,'#9af388','#162b1d',3);label(c,'电源',-165,828,18);
  rect(c,1016,784,266,111,'#273a2c','#92a283',1);label(c,'INPUT A       INPUT B',1149,811,15);
  for(const x of [1073,1224]){ellipse(c,x,850,19,19,'#101c13','#97a080',3);ellipse(c,x,850,7,7,'#020705','#5a6e52',2);}
  path(c,'M 1073 867 C 1073 962 1200 960 1335 987',null,'#102319',11);path(c,'M 1073 867 C 1073 962 1200 960 1335 987',null,'#7c8768',2);
  label(c,'TRACE REGISTRATION  •  015',500,974,16,'#c0c8af');
}

// Polylines reproduce the public rig's geometry before being continuously
// remapped to a single family of Lissajous traces during the wrong-knob beat.
function vectorPaths(at){
  const p=poseAt(at),a=[];
  const add=(pts,w=2.4,alpha=1)=>a.push({pts,w,alpha});
  const circle=(x,y,r,w=2.4)=>add(Array.from({length:65},(_,i)=>[x+Math.cos(i*TAU/64)*r,y+Math.sin(i*TAU/64)*r]),w);
  const poly=(pts,w=2.4)=>add(pts,w);
  // Small path sampler supports the exact curve commands used by this rig.
  const curve=(s,w=2.4,bob=0)=>{
    const tok=s.match(/[MLCQZmlcqz]|-?\d*\.?\d+/g);let i=0,cmd='',x=0,y=0,sx=0,sy=0,pts=[];
    while(i<tok.length){if(/[A-Za-z]/.test(tok[i]))cmd=tok[i++];const rel=cmd===cmd.toLowerCase(),k=cmd.toUpperCase();if(k==='Z'){pts.push([sx,sy+bob]);cmd='';continue;}
      let n={M:2,L:2,C:6,Q:4}[k];if(!n)break;const v=tok.slice(i,i+n).map(Number);i+=n;
      for(let j=0;j<n;j+=2){v[j]+=rel?x:0;v[j+1]+=rel?y:0;}
      if(k==='M'||k==='L'){x=v[0];y=v[1];pts.push([x,y+bob]);if(k==='M'){sx=x;sy=y;cmd=rel?'l':'L';}}
      else{const ox=x,oy=y,N=16;for(let j=1;j<=N;j++){const u=j/N,z=1-u;if(k==='C')pts.push([z*z*z*ox+3*z*z*u*v[0]+3*z*u*u*v[2]+u*u*u*v[4],z*z*z*oy+3*z*z*u*v[1]+3*z*u*u*v[3]+u*u*u*v[5]+bob]);else pts.push([z*z*ox+2*z*u*v[0]+u*u*v[2],z*z*oy+2*z*u*v[1]+u*u*v[3]+bob]);}x=v[n-2];y=v[n-1];}
    }add(pts,w);
  };
  for(const wx of [-106,111]){circle(wx,-62,62,3.4);for(let i=0;i<12;i++){const a=p.wheelAngle+i*TAU/12;poly([[wx,-62],[wx+Math.cos(a)*59,-62+Math.sin(a)*59]],.9);}circle(wx,-62,5);}
  const crank=[-8,-71];poly([[-106,-62],[-51,-150],crank,[-106,-62]],3.4);poly([[-51,-150],[65,-150],[111,-62],crank,[65,-150]],3.4);poly([[65,-150],[64,-180],[89,-191],[99,-188]],3.4);poly([[-51,-150],[-54,-173],[-77,-173],[-39,-173]],4.4);circle(-8,-71,19);poly([[-106,-62],crank],.8);
  const leg=j=>{const f=p.feet[j],k=p.knees[j];poly([[-39,-181],[k.x,k.y],[f.x,f.y]],3.4);poly([[f.x-10,f.y],[f.x+13,f.y]],4.4);poly([crank,[f.x,f.y]],2.4);};leg(1);
  const b=p.bob;
  curve('M -100 -199 C -141 -227 -114 -264 -67 -266 C -27 -270 -8 -248 12 -240 C 5 -274 6 -307 30 -324 C 45 -334 67 -329 78 -316 C 86 -305 79 -289 64 -286 C 45 -275 53 -249 56 -227 C 50 -199 17 -179 -32 -182 C -56 -179 -73 -189 -100 -199 Z',2.4,b);
  curve('M 69 -315 L 232 -303 Q 205 -291 79 -295 L 67 -299 Z',1.68,b);curve('M 78 -295 Q 155 -258 193 -297',1.56,b);
  curve('M -115 -205 L -149 -222 L -125 -218 L -143 -234 L -107 -219 Z',1.44,b);
  curve('M -85 -244 C -40 -261 -6 -232 8 -213 C -21 -196 -64 -196 -89 -223',1.68,b);
  for(let i=0;i<7;i++)curve(`M ${-85+i*8} ${-236+i*2} q 20 18 40 20`,.7,b);
  poly([[4,-222+b],[37,-188+b],[86,-191+b]],3.4);circle(60,-315+b,5.5,.8);circle(62,-315+b,2.2,.9);leg(0);
  return a;
}
function trace(c,at,local,alpha=1){
  const f=faultAmount(local),settled=smooth(local/.2)*smooth((6-local)/.2),j=(Math.sin(at*113)+Math.sin(at*211))*.35*settled;
  c.save();c.globalAlpha*=alpha;c.translate(j,Math.sin(at*137)*.38*settled);c.shadowColor='#62ff99';c.shadowBlur=alpha>.6?11:5;
  if(f<.0001){pelican(c,at,{x:500,y:805,scale:1,style:'glow',ink:GREEN});c.restore();return;}
  const paths=vectorPaths(at);let index=0;
  // Smoothly losing both deflection channels genuinely replaces the drawing;
  // at the centre of the fault no intact pelican is rendered underneath.
  const m=smooth(clamp(f*1.2));
  c.strokeStyle=GREEN;c.lineJoin='round';c.lineCap='round';
  for(const s of paths){c.beginPath();let prev=null;const dense=[];
    for(const pt of s.pts){if(prev){const n=Math.max(1,Math.ceil(Math.hypot(pt[0]-prev[0],pt[1]-prev[1])/6));for(let k=1;k<=n;k++)dense.push([prev[0]+(pt[0]-prev[0])*k/n,prev[1]+(pt[1]-prev[1])*k/n]);}else dense.push(pt);prev=pt;}
    dense.forEach((pt,i)=>{const phase=index++*.032,tx=500+236*Math.sin(phase*3+at*.9),ty=611+160*Math.sin(phase*4+at*.7+.52);const x=(500+pt[0])*(1-m)+tx*m,y=(805+pt[1])*(1-m)+ty*m;i?c.lineTo(x,y):c.moveTo(x,y);});c.lineWidth=s.w*(1-m)+1.35*m;c.stroke();
  }c.restore();
}
function hand(c,t){
  // An original laboratory technician's hand reaches in and pinches the knob.
  const enter=smooth((t-1.55)/.38),leave=smooth((t-2.57)/.44),presence=enter*(1-leave);if(presence<.001)return;
  const angle=-.2+faultAmount(t)*1.1;
  c.save();c.translate((1-presence)*400,0);
  path(c,'M 1410 780 L 1300 746 L 1249 685 L 1218 649 Q 1205 635 1188 648 L 1174 667 L 1120 641 Q 1101 632 1107 617 Q 1113 603 1130 607 L 1170 613 L 1164 585 Q 1157 564 1173 560 Q 1188 554 1195 573 L 1204 599 L 1228 618 Q 1260 636 1271 663 L 1315 694 L 1410 716 Z','#b4aa84','#332f24',3);
  path(c,'M 1250 676 Q 1218 656 1210 629 M 1273 695 Q 1224 671 1212 650 M 1307 724 L 1336 706',null,'#766d50',2);
  // Rotating fingers sit on top of the dial; the wrist remains anchored.
  c.save();c.translate(1150,620);c.rotate(angle);
  path(c,'M 27 -34 Q 8 -55 -11 -49 Q -27 -43 -18 -29 Q -12 -23 2 -27 L 19 -18 Q 33 -6 35 12 L 54 27 L 64 4 Q 56 -18 27 -34 Z','#c9bd94','#4d4431',2.2);
  path(c,'M 2 24 Q -25 6 -38 17 Q -45 27 -29 39 L -3 53 Q 20 59 37 41 L 45 26 L 25 14 Q 14 31 2 24 Z','#c0b38a','#4d4431',2.2);
  path(c,'M -15 -40 Q -6 -43 0 -35 M -28 25 L -16 33',null,'#ece1b8',3);c.restore();
  path(c,'M 1342 700 L 1390 713 L 1410 786 L 1345 765 L 1308 724 Z','#8b9984','#283a2c',3);line(c,[[1323,724],[1360,748]],'#c9d1b7',3);ellipse(c,1361,744,4,4,'#3f5141');c.restore();
}
// Square gallery instrument: controls stay inside the visible artwork.
function galleryPanel(c){
  const metal=c.createLinearGradient(0,0,1000,1000);metal.addColorStop(0,'#75806e');metal.addColorStop(.45,'#45584a');metal.addColorStop(1,'#26392d');
  rect(c,0,0,1000,1000,'#0b1911');rect(c,18,18,964,964,metal,'#a1af94',3);
  for(const x of [42,958])for(const y of [42,958])screw(c,x,y);
  text(c,'示波器',62,91,43,'#eef0d9',{weight:700});label(c,'OSCILLOSCOPE  /  1950s',65,132,20,'#d3dac7','left');
  ellipse(c,500,520,399,399,'#102117','#a3b396',4);ellipse(c,500,520,385,385,'#07160d','#172e1e',10);
  const glass=c.createRadialGradient(455,425,20,500,520,380);glass.addColorStop(0,'#123e2a');glass.addColorStop(1,'#03140d');ellipse(c,500,520,380,380,glass,'#829579',1);
  c.save();ellipse(c,500,520,378,378);c.clip();for(let i=0;i<13;i++){const x=140+i*60;line(c,[[x,130],[x,915]],'#8afaaf19',1);line(c,[[115,x+20],[885,x+20]],'#8afaaf19',1);}line(c,[[120,520],[880,520]],'#8affa83f',1.2);line(c,[[500,140],[500,900]],'#8affa83f',1.2);path(c,'M 245 290 C 360 165 605 160 710 242 C 520 190 360 220 245 330 Z','#c5ffdf09');c.restore();
  rect(c,752,194,194,210,'#3a4d3d','#94a588',2);label(c,'X / Y 增益',849,225,20);dialScale(c,830,300,46);label(c,'勿动 · CALIBRATED',847,384,15,'#ebcb9c');
  ellipse(c,76,914,8,8,'#9af388','#162b1d',3);label(c,'电源',110,921,18,'#d7dccc','left');label(c,'双轴 · 电子示踪 / MODEL 57',500,962,19);label(c,'鹈鹕实验仪器厂',936,86,19,'#d7dccc','right');
}
export default function renderAt(c,t,scene){
  const at=scene.start+t,f=faultAmount(t);if(scene.gallery)cached(c,'scope:gallery:metal:v1',galleryPanel);else cached(c,'scope:metal:8695:v1',panel);
  // Status and the moving controls are above the static brushed metal.
  knob(c,scene.gallery?830:1150,scene.gallery?300:620,46,.23+f*1.1);
  c.save();ellipse(c,500,scene.gallery?520:500,scene.gallery?378:411,scene.gallery?378:411);c.clip();
  if(scene.subject!==false)renderSubject(c,t,scene);
  // World road stays at the common rig baseline; dots travel with the film.
  c.globalAlpha=.27;line(c,[[100,805],[900,805]],GREEN,1);
  for(let i=-5;i<20;i++){const x=i*68-(at*105%68);line(c,[[x,820],[x+22,820]],GREEN,.8);}c.globalAlpha=1;
  const scan=115+((at*119)%780);line(c,[[90,scan],[910,scan]],'#aaffc211',1);
  label(c,f>.15?'DEFLECTION UNLOCKED':'TRACE LOCKED',500,327,18,f>.15?'#ceff8e':'#8dce9e88');
  if(f>.15){label(c,'误触增益 · XY 失锁',500,368,23,'#c5ffb5');}
  c.restore();
  if(t>=2&&t<2.5){c.save();c.shadowColor='#f2c26d';c.shadowBlur=9;label(c,'↶',scene.gallery?910:1230,scene.gallery?246:566,42,'#f0d397');c.restore();}
  c.save();if(scene.gallery)c.translate(-320,-320);hand(c,t);c.restore();
}

export function renderSubject(c,t,scene){
  const at=scene.start+t;
  // Deterministic historical poses: older pedal positions retain dim phosphor.
  // At 2.5 the next beat clears the failed trace as the instrument relocks.
  for(const [lag,alpha] of [[.19,.035],[.12,.05],[.065,.10],[.027,.16]]){
    if(t>=2.5&&t-lag<2.5)continue;
    trace(c,at-lag,t-lag,alpha);
  }
  trace(c,at,t,1);
}
