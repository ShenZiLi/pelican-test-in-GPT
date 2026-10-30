import {makeSurface,rng,poly,stroke,ellipse,path} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
const P={lamp:'#f5d9a0',linen:'#cfac72',leather:'#2d261d',soot:'#171d1c',red:'#8f3c27',gold:'#c28d43'};
export const frameColor=P.leather;
function rosette(c,x,y,r,cut=false){c.save();c.translate(x,y);if(cut)c.globalCompositeOperation='destination-out';for(let i=0;i<8;i++){const a=i*Math.PI/4;c.save();c.rotate(a);ellipse(c,0,-r*.67,r*.13,r*.25,cut?'#000':P.lamp);c.restore();}ellipse(c,0,0,r*.13,r*.13,cut?'#000':P.lamp);c.restore();}
function leaf(c,x,y,ang,s){c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);path(c,p=>{p.moveTo(0,0);p.bezierCurveTo(-20,-20,-8,-44,0,-55);p.bezierCurveTo(20,-39,20,-14,0,0);},P.leather,P.gold,.8);stroke(c,[[0,-5],[0,-45]],P.gold,.6);for(let j=0;j<4;j++){stroke(c,[[0,-11-j*8],[-7,-18-j*8]],P.gold,.5);stroke(c,[[0,-11-j*8],[8,-20-j*8]],P.gold,.5);}c.restore();}
function wing(c,x,flip){c.save();c.translate(x,656);c.scale(flip,1);path(c,p=>{p.moveTo(-60,80);p.lineTo(-60,-354);p.bezierCurveTo(-30,-414,15,-433,35,-460);p.bezierCurveTo(55,-402,83,-364,108,-319);p.bezierCurveTo(146,-248,139,-174,86,-92);p.lineTo(68,80);p.closePath();},P.leather,P.gold,2);
  path(c,p=>{p.moveTo(-15,40);p.bezierCurveTo(-9,-28,21,-107,14,-168);p.bezierCurveTo(5,-230,36,-284,33,-377);p.moveTo(15,-154);p.bezierCurveTo(64,-176,85,-222,71,-274);p.moveTo(13,-113);p.bezierCurveTo(-34,-147,-44,-201,-31,-244);},null,P.gold,3);
  for(let i=0;i<23;i++){const y=-62-i*13,x0=14+Math.sin(i*.4)*9;leaf(c,x0,y,i%2?-.85:.85,.58+(i%4)*.05);}
  for(let i=0;i<13;i++)rosette(c,73+Math.sin(i*.4)*26,-75-i*22,8.5);
  for(let i=0;i<7;i++){const y=-110-i*35;path(c,p=>{p.moveTo(-43,y);p.quadraticCurveTo(-12,y-15,-33,y-29);p.quadraticCurveTo(-48,y-22,-43,y);},null,P.gold,1.1);}
  poly(c,[[-41,49],[-26,17],[-10,49],[6,18],[23,49],[42,18],[58,49]],P.red,P.gold,1);stroke(c,[[-48,57],[64,57]],P.gold,2);c.restore();}
function body(c){
  // This component is a pierced leather cutout, not an opaque silhouette with
  // cream paint pretending to be holes. The linen shows through every opening.
  path(c,p=>{p.moveTo(19,-133);p.lineTo(-14,-152);p.lineTo(7,-153);p.lineTo(-17,-171);p.lineTo(15,-162);p.lineTo(6,-183);p.lineTo(33,-168);p.bezierCurveTo(48,-186,67,-180,80,-161);p.bezierCurveTo(74,-190,78,-211,95,-226);p.bezierCurveTo(113,-241,130,-227,130,-215);p.lineTo(123,-198);p.lineTo(107,-198);p.bezierCurveTo(111,-176,115,-152,99,-134);p.bezierCurveTo(78,-112,44,-112,19,-133);p.closePath();},P.leather,P.gold,1.8);
  path(c,p=>{p.moveTo(126,-219);p.lineTo(222,-207);p.lineTo(215,-201);p.lineTo(176,-198);p.bezierCurveTo(156,-172,134,-186,123,-198);p.closePath();},P.red,P.gold,1.5);stroke(c,[[129,-210],[213,-207]],P.gold,1);stroke(c,[[136,-195],[151,-189],[164,-193]],P.gold,.8);
  path(c,p=>{p.moveTo(87,-227);p.bezierCurveTo(72,-247,97,-269,112,-255);p.bezierCurveTo(129,-241,104,-233,105,-247);p.bezierCurveTo(98,-251,95,-242,101,-239);},null,P.gold,3.5);
  path(c,p=>{p.moveTo(24,-153);p.bezierCurveTo(42,-178,72,-168,94,-137);p.bezierCurveTo(66,-134,54,-144,48,-137);p.lineTo(40,-149);p.lineTo(32,-141);p.closePath();},P.red,P.gold,1);
  rosette(c,56,-151,18,true);rosette(c,96,-207,8,true);for(let i=0;i<8;i++){ellipse(c,31+i*8,-128+Math.sin(i*.45)*3,1.3,1.3,P.gold);}for(let i=0;i<5;i++){c.save();c.globalCompositeOperation='destination-out';ellipse(c,35+i*10,-166+Math.sin(i*.65)*4,1.8,1.8,'#000');c.restore();}
  ellipse(c,117,-218,2.9,2.9,P.lamp);ellipse(c,117,-218,1.3,1.3,P.soot);path(c,p=>{p.moveTo(105,-222);p.quadraticCurveTo(114,-233,123,-226);},null,P.gold,.7);
}
export function createAssets(){const{canvas,ctx:c}=makeSurface(1800,1800);c.scale(1.8,1.8);const g=c.createRadialGradient(501,469,10,501,469,670);g.addColorStop(0,P.lamp);g.addColorStop(.6,'#e4c48a');g.addColorStop(1,'#a17b49');c.fillStyle=g;c.fillRect(0,0,1000,1000);
  const r=rng(1010);for(let y=0;y<1000;y+=1.3){stroke(c,[[0,y],[1000,y+.25]],y%3?'#6f542918':'#fff3c82a',.35);}for(let x=0;x<1000;x+=1.7)stroke(c,[[x,0],[x+.3,1000]],'#815b2912',.4);for(let i=0;i<24000;i++){c.fillStyle=i%2?'#fff5c918':'#76592d0c';c.fillRect(r()*1000,r()*1000,.5+r()*1,.25+r()*.5);}
  wing(c,32,1);wing(c,966,-1);c.fillStyle=P.soot;c.fillRect(0,218,1000,24);stroke(c,[[0,243],[1000,243]],P.red,5);for(let x=0;x<1000;x+=30)poly(c,[[x,246],[x+15,264],[x+30,246]],P.leather,P.gold,.8);
  const b=makeSurface(560,640);b.ctx.scale(2,2);b.ctx.translate(25,285);body(b.ctx);return Object.freeze({stage:canvas,puppet:b.canvas});}
export function drawBackground(c,{assets}){c.drawImage(assets.stage,0,0,1000,1000);}
export function drawRoad(c){c.fillStyle=P.leather;c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],P.gold,2);for(let x=0;x<1000;x+=41){poly(c,[[x,712],[x+20,731],[x+40,712]],null,P.red,1.4);rosette(c,x+20,749,7);}}
function wheel(c,x,a){ellipse(c,x,0,44,44,null,P.leather,5);ellipse(c,x,0,40,40,null,P.gold,1);ellipse(c,x,0,34,34,null,P.red,2);for(let i=0;i<10;i++){const z=a+i*Math.PI/5;c.save();c.translate(x,0);c.rotate(z);path(c,p=>{p.moveTo(4,-3);p.quadraticCurveTo(20,-9,34,-3);p.quadraticCurveTo(22,4,4,3);p.closePath();},P.leather,P.gold,.6);c.restore();}ellipse(c,x,0,6,6,P.gold,P.leather,1);}
export function drawRider(c,t,assets){const p=poseAt(Math.floor(t*10+1e-7)/10);c.save();
  // Stage control rods visibly terminate at articulated puppet joints.
  stroke(c,[[57,-153],[40,126]],P.soot,2.2);stroke(c,[[111,-117],[121,129]],P.soot,1.3);stroke(c,[[169,-87],[202,129]],P.soot,1.4);
  const leg=(s,col)=>{const k=p['knee'+s],a=p['ankle'+s];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],P.leather,8);stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],col,2.4);ellipse(c,k.x,k.y,3.2,3.2,P.gold,P.leather,1);poly(c,[[a.x-7,a.y-2],[a.x+12,a.y],[a.x+16,a.y+5],[a.x-8,a.y+5]],P.leather,P.gold,.8);};leg('Right',P.red);wheel(c,0,p.wheelAngle);wheel(c,180,p.wheelAngle);
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[145,-75],[80,-22]],[[145,-75],[180,0]],[[62,-79],[58,-115]],[[145,-75],[152,-99],[173,-98],[176,-87]]]){stroke(c,pts,P.leather,5);stroke(c,pts,P.gold,1.1);}stroke(c,[[40,-114],[77,-114]],P.leather,5);ellipse(c,80,-22,12,12,P.leather,P.gold,1);rosette(c,80,-22,9);for(const a of[p.ankleRight,p.ankleLeft])stroke(c,[[80,-22],[a.x,a.y]],P.leather,2);leg('Left',P.gold);
  c.save();c.globalAlpha=.22;c.drawImage(assets.puppet,-22,-282,280,320);c.restore();c.drawImage(assets.puppet,-25,-285,280,320);
  stroke(c,[[84,-153],[111,-117],[169,-87]],P.leather,9);stroke(c,[[84,-153],[111,-117],[169,-87]],P.gold,1.3);for(const[x,y]of[[84,-153],[111,-117],[169,-87]]){ellipse(c,x,y,4.5,4.5,P.gold,P.leather,1);ellipse(c,x,y,1.2,1.2,P.soot);}for(let i=0;i<7;i++)ellipse(c,118+i*6,-112+i*3.2,1,1,P.lamp);c.restore();}
export function drawTitle(c){c.save();c.lineJoin='round';const caption=(v,x,y,size,color,opt={})=>{text(c,v,x,y,size,color,opt);c.strokeStyle=P.lamp;c.lineWidth=3.2;c.strokeText(v,x,y);text(c,v,x,y,size,color,opt);};caption('哇扬皮影',101,157,51,P.leather,{bold:true});caption('WAYANG KULIT',103,204,28,P.leather,{family:'Georgia'});caption('约 1800 年',104,246,25,P.red);stroke(c,[[105,263],[287,263]],P.gold,2);c.restore();}
