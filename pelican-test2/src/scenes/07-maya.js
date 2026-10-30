import {makeSurface,rng,poly,stroke,ellipse,path,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
const P={paper:'#e9d9ac',ink:'#292c27',red:'#a53d2d',jade:'#4e7b69',ochre:'#c79848',age:'#bfaa79'};
export const frameColor=P.red;
function band(c,y){
  stroke(c,[[0,y],[1000,y]],P.red,4);stroke(c,[[0,y+7],[1000,y+7]],P.ink,1.3);
  for(let x=-30;x<1030;x+=44){poly(c,[[x,y+13],[x+32,y+13],[x+32,y+23],[x+11,y+23],[x+11,y+34],[x+22,y+34]],null,P.ink,2);}
}
function maize(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);stroke(c,[[0,34],[0,-23]],P.ink,3);for(let i=0;i<3;i++){const z=i*13;path(c,p=>{p.moveTo(0,15-z);p.quadraticCurveTo(-28,4-z,-24,-12-z);p.quadraticCurveTo(-5,-12-z,0,15-z);},P.jade,P.ink,1.3);path(c,p=>{p.moveTo(0,22-z);p.quadraticCurveTo(27,12-z,29,-4-z);p.quadraticCurveTo(8,-7-z,0,22-z);},P.jade,P.ink,1.3);}ellipse(c,0,-33,8,18,P.ochre,P.ink,1.8);for(let j=-1;j<2;j++)for(let k=0;k<5;k++)ellipse(c,j*4,-46+k*6,1,1,P.ink);c.restore();}
function emblem(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-28,-31],[12,-31],[12,-23],[28,-23],[28,4],[17,4],[17,22],[-20,22],[-20,13],[-31,13]],P.jade,P.ink,2.7);path(c,p=>{p.moveTo(-13,-19);p.bezierCurveTo(-2,-32,21,-12,12,-3);p.lineTo(26,3);p.lineTo(19,10);p.lineTo(-6,6);p.lineTo(-6,-1);p.lineTo(-21,-1);},P.paper,P.ink,2);ellipse(c,6,-13,3,3,P.ink);ellipse(c,-18,12,8,8,P.red,P.ink,1.5);ellipse(c,-18,12,3,3,P.paper);for(let i=0;i<3;i++)stroke(c,[[-22+i*11,30],[-22+i*11,40]],P.ink,3);c.restore();}
function scribe(c,x,y,flip=1){c.save();c.translate(x,y);c.scale(flip,1);poly(c,[[-33,15],[-15,-21],[7,-26],[23,11],[48,22],[45,33],[-40,33]],P.red,P.ink,2.3);poly(c,[[-16,-19],[4,-23],[3,-72],[-12,-78],[-27,-64],[-23,-42]],P.paper,P.ink,2.3);poly(c,[[-24,-74],[-31,-82],[-25,-104],[-13,-106],[-10,-93],[4,-87],[12,-76],[-1,-64]],P.jade,P.ink,2);poly(c,[[5,-69],[19,-62],[10,-57],[11,-45],[-2,-42],[-11,-52]],P.ochre,P.ink,2);ellipse(c,3,-63,2.3,2.3,P.ink);ellipse(c,-16,-50,7,7,P.red,P.ink,1.6);stroke(c,[[-9,-13],[19,-5],[37,-29]],P.ink,6);stroke(c,[[-9,-13],[19,-5],[37,-29]],P.paper,3.7);stroke(c,[[32,-46],[45,3]],P.ink,1.5);for(let i=0;i<5;i++)poly(c,[[-35+i*14,14],[-31+i*14,6],[-24+i*14,18]],null,P.ochre,1.3);c.restore();}
export function createAssets(){
  const {canvas,ctx:c}=makeSurface(1800,1800);c.scale(1.8,1.8);c.fillStyle=P.paper;c.fillRect(0,0,1000,1000);
  const r=rng(707);for(let i=0;i<36000;i++){c.fillStyle=i%3?'#776e4920':'#fff6d12a';c.fillRect(r()*1000,r()*1000,.3+r()*1.3,.3+r()*1.7);}
  for(const x of[0,333,666,1000]){const g=c.createLinearGradient(x-10,0,x+13,0);g.addColorStop(0,'#6d573900');g.addColorStop(.4,'#76603a30');g.addColorStop(.55,'#fff6db55');g.addColorStop(1,'#826b3900');c.fillStyle=g;c.fillRect(x-12,0,28,1000);dryStroke(c,[[x+2,220],[x,470],[x+2,710]],'#806f4844',1.5,7);}
  band(c,238);band(c,650);stroke(c,[[16,293],[984,293]],P.red,2);stroke(c,[[16,625],[984,625]],P.red,2);
  for(const x of[20,321,349,654,682,980])stroke(c,[[x,296],[x,623]],P.red,1.5);
  // A shallow architectural register, built from asymmetrical hand-drawn steps.
  poly(c,[[365,610],[365,585],[395,585],[395,563],[424,563],[424,540],[451,540],[451,516],[551,516],[551,540],[579,540],[579,563],[608,563],[608,585],[638,585],[638,610]],P.ochre,P.ink,2.6);
  poly(c,[[457,515],[457,468],[545,468],[545,515]],P.red,P.ink,2);poly(c,[[445,468],[450,455],[552,455],[558,468]],P.jade,P.ink,2);
  poly(c,[[484,516],[484,480],[516,480],[516,516]],P.ink);for(let y=549;y<610;y+=22)stroke(c,[[501-(y-520)*1.4,y],[501+(y-520)*1.4,y]],P.ink,1.2);
  for(const x of[80,253,748,920])maize(c,x,456,x===80||x===920?.8:1.05);
  emblem(c,107,348,.7);emblem(c,895,348,.7);emblem(c,385,348,.67);emblem(c,621,348,.67);
  scribe(c,178,582,1);scribe(c,817,582,-1);
  for(let x=48;x<1000;x+=83){ellipse(c,x,721,22,7,P.jade,P.ink,1.4);poly(c,[[x-11,741],[x-11,760],[x+10,760],[x+10,747],[x+21,747]],null,P.red,3);}
  // Mineral paint chips are irregular patches, with paper left visibly exposed.
  for(let i=0;i<1500;i++){const x=r()*1000,y=290+r()*360;c.fillStyle='#e9d9ac77';c.fillRect(x,y,.5+r()*2,.5+r()*1.2);}
  return Object.freeze({codex:canvas});
}
export function drawBackground(c,{assets,localTime}){c.drawImage(assets.codex,0,0,1000,1000);const count=Math.max(0,Math.min(6,Math.floor(localTime+1e-7)));c.save();c.translate(501,363);const dots=count%5;if(count>=5){poly(c,[[-33,19],[32,19],[32,29],[-33,29]],P.red,P.ink,1.8);}for(let i=0;i<dots;i++)ellipse(c,(i-(dots-1)/2)*18,count>=5?3:19,5.5,5.5,P.red,P.ink,1.4);if(!count)ellipse(c,0,19,20,8,null,P.ink,1.5);c.restore();}
export function drawRoad(c){stroke(c,[[0,700],[1000,700]],P.ink,2.6);stroke(c,[[0,704],[1000,704]],P.red,2);}
function wheel(c,x,a){ellipse(c,x,0,44,44,P.paper,P.ink,3);ellipse(c,x,0,35,35,null,P.red,5);for(let i=0;i<8;i++){const z=a+i*Math.PI/4;stroke(c,[[x+Math.cos(z)*8,Math.sin(z)*8],[x+Math.cos(z)*34,Math.sin(z)*34]],P.ink,2);}ellipse(c,x,0,8,8,P.jade,P.ink,2);}
export function drawRider(c,t){const p=poseAt(t);c.save();c.lineJoin='round';wheel(c,0,p.wheelAngle);wheel(c,180,p.wheelAngle);const leg=(s,color)=>{const k=p['knee'+s],a=p['ankle'+s];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],P.ink,8);stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],color,5);poly(c,[[a.x-7,a.y],[a.x+12,a.y],[a.x+16,a.y+5],[a.x-8,a.y+5]],P.ink);};leg('Right',P.red);
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[145,-75],[80,-22]],[[145,-75],[180,0]],[[62,-79],[58,-115]],[[145,-75],[152,-99],[172,-98]]]){stroke(c,pts,P.ink,6);stroke(c,pts,P.jade,3);}stroke(c,[[40,-114],[77,-114]],P.ink,5);ellipse(c,80,-22,12,12,P.ochre,P.ink,2);for(const a of[p.ankleLeft,p.ankleRight])stroke(c,[[80,-22],[a.x,a.y]],P.ink,2);leg('Left',P.ochre);
  poly(c,[[17,-131],[-8,-151],[16,-148],[8,-164],[32,-157],[38,-178],[65,-182],[80,-164],[78,-191],[86,-214],[82,-229],[103,-238],[125,-228],[130,-210],[122,-195],[109,-195],[109,-168],[116,-149],[99,-126],[58,-117]],P.paper,P.ink,3.5);
  poly(c,[[125,-219],[222,-207],[213,-200],[177,-199],[163,-178],[145,-179],[124,-197]],P.red,P.ink,2.6);stroke(c,[[128,-208],[213,-206]],P.ink,1.5);poly(c,[[31,-160],[51,-171],[72,-162],[93,-139],[74,-137],[74,-145],[61,-145],[61,-152],[48,-152],[48,-141],[32,-146]],P.jade,P.ink,2);
  for(let i=0;i<4;i++)poly(c,[[36+i*9,-153],[41+i*9,-153],[43+i*9,-143]],P.ochre);poly(c,[[86,-226],[85,-242],[92,-242],[92,-254],[101,-249],[103,-236],[111,-246],[116,-234]],P.jade,P.ink,2);ellipse(c,116,-220,3,3,P.ink);ellipse(c,97,-203,10,10,P.jade,P.ink,2);ellipse(c,97,-203,4,4,P.paper,P.ink,1.1);
  stroke(c,[[89,-151],[111,-118],[169,-88]],P.ink,9);stroke(c,[[89,-151],[111,-118],[169,-88]],P.ochre,5);for(let i=0;i<4;i++)stroke(c,[[115+i*9,-117+i*4.7],[116+i*9,-111+i*4.7]],P.red,2);c.restore();}
export function drawTitle(c){text(c,'玛雅抄本',101,157,51,P.ink,{bold:true});text(c,'MAYA CODEX',103,204,28,P.red,{family:'Georgia'});text(c,'约 1200 年',104,246,25,P.ink);dryStroke(c,[[104,263],[261,263]],P.red,3,77);}
