import {makeSurface,rng,poly,stroke,ellipse,path,grain} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
export const frameColor='#6c563a';
const LINE='#493b2a',RED='#a7543a',BLUE='#397f85',GOLD='#c49a47',PAPER='#dac393';
function lotus(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);stroke(c,[[0,0],[0,42]],'#71816b',2);for(let j=-2;j<=2;j++)poly(c,[[0,0],[j*9-8,-17-Math.abs(j)*2],[j*9,-34+Math.abs(j)*6],[j*9+8,-17-Math.abs(j)*2]],j%2?BLUE:'#83a19a',LINE,.65);stroke(c,[[-23,-2],[23,-2]],GOLD,4);c.restore();}
function scribe(c,x,y,flip=1){c.save();c.translate(x,y);c.scale(flip,1);
  poly(c,[[-20,-20],[-23,-52],[-11,-68],[5,-63],[12,-30],[32,-18],[31,-5],[-20,-5]],'#ede0b4',LINE,1.1);
  poly(c,[[-20,-48],[-4,-56],[7,-36],[1,-22],[-15,-24]],RED,LINE,.8);
  stroke(c,[[-3,-51],[18,-38],[41,-39]],'#a97851',5);stroke(c,[[-4,-45],[17,-33],[40,-35]],LINE,.8);
  path(c,p=>{p.moveTo(-12,-66);p.lineTo(-13,-83);p.bezierCurveTo(-15,-98,3,-104,11,-93);p.lineTo(13,-85);p.lineTo(19,-82);p.lineTo(12,-79);p.lineTo(11,-66);p.closePath();},'#b47e52',LINE,.8);
  path(c,p=>{p.moveTo(-15,-81);p.bezierCurveTo(-21,-105,11,-110,13,-91);p.lineTo(1,-94);p.lineTo(-2,-72);p.lineTo(-15,-72);p.closePath();},LINE);stroke(c,[[4,-88],[10,-87]],LINE,.9);
  stroke(c,[[-23,-5],[36,-5]],LINE,2);stroke(c,[[-21,-3],[-21,8],[42,8]],GOLD,3);poly(c,[[33,-41],[61,-43],[63,-32],[35,-31]],'#e9d5a3',LINE,.7);c.restore();}
export function createAssets(){const{canvas,ctx:c}=makeSurface(1500,1500);c.scale(1.5,1.5);c.fillStyle=PAPER;c.fillRect(0,0,1000,1000);const r=rng(211);
  for(let i=0;i<80;i++){const x=r()*1000,y=r()*1000,w=30+r()*180,h=15+r()*110;const g=c.createRadialGradient(x,y,0,x,y,w);g.addColorStop(0,i%3?'#fff0bc25':'#81614316');g.addColorStop(1,'#d6bd8b00');c.fillStyle=g;c.fillRect(x-w,y-w,w*2,w*2);}
  // Faint squared-up painter's draft, subordinate to mineral pigment.
  for(let x=0;x<1000;x+=25)stroke(c,[[x,295],[x,692]],'#9c795921',.4);for(let y=295;y<700;y+=25)stroke(c,[[0,y],[1000,y]],'#9c795921',.4);
  for(const y of[360,415,657,686]){stroke(c,[[0,y],[1000,y]],LINE,1.8);stroke(c,[[0,y+5],[1000,y+5]],RED,3);stroke(c,[[0,y+10],[1000,y+10]],BLUE,2);}
  for(let x=45;x<1000;x+=91){lotus(c,x,401,.49);ellipse(c,x+45,388,8,8,GOLD,RED,.8);stroke(c,[[x+38,399],[x+45,407],[x+52,399]],BLUE,2);}
  // Wall-register figures are original, spaced like a painted court narrative.
  for(const [x,y,f]of[[91,612,1],[269,612,-1],[748,612,1],[920,612,-1]])scribe(c,x,y,f);
  for(const x of[180,837]){poly(c,[[x-20,585],[x+20,585],[x+15,590],[x-15,590]],GOLD,LINE,1);stroke(c,[[x,590],[x,619]],LINE,2);stroke(c,[[x-12,620],[x+12,620]],LINE,1);ellipse(c,x,579,15,7,'#e9dbac',RED,1);for(let i=0;i<4;i++)ellipse(c,x-10+i*7,572-Math.sin(i)*5,4,6,i%2?RED:'#71816b',LINE,.6);}
  for(let k=0;k<8;k++){const x=r()*1000,y=270+r()*430;stroke(c,[[x,y],[x+9,y+7],[x+3,y+24],[x+14,y+33]],'#826c4b39',.65);}
  grain(c,219,24000,LINE);return Object.freeze({wall:canvas});}
export function drawBackground(c,{assets}){c.drawImage(assets.wall,0,0,1000,1000);}
export function drawRoad(c){c.fillStyle='#c5aa78';c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],LINE,1.7);stroke(c,[[0,707],[1000,707]],GOLD,4);for(let x=0;x<1000;x+=21)stroke(c,[[x,712],[x+8,720],[x+16,712]],RED,.9,.6);}
export function drawRider(c,t){const p=poseAt(t>=13&&t<14?13:t),wheel=poseAt(t).wheelAngle;const freeze=t>=13&&t<14;c.save();c.lineCap='butt';c.lineJoin='miter';
  for(const x of[0,180]){ellipse(c,x,0,44,44,null,LINE,3);ellipse(c,x,0,39,39,null,GOLD,2);for(let i=0;i<12;i++){const a=wheel+i*Math.PI/6;stroke(c,[[x,0],[x+Math.cos(a)*39,Math.sin(a)*39]],i%2?RED:LINE,1.2);}ellipse(c,x,0,4,4,GOLD,LINE,1);}
  const leg=(s,fill)=>{const k=p['knee'+s],a=p['ankle'+s];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],LINE,6);stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],fill,3.8);poly(c,[[a.x-8,a.y-2],[a.x+14,a.y-2],[a.x+16,a.y+3],[a.x-8,a.y+3]],fill,LINE,.8);};leg('Right',RED);
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[147,-76],[80,-22]],[[147,-76],[180,0]],[[62,-79],[58,-115]],[[147,-76],[153,-97],[176,-97],[176,-85]]]){stroke(c,pts,LINE,4);stroke(c,pts,GOLD,1.9);}
  stroke(c,[[42,-115],[73,-115]],LINE,5);ellipse(c,80,-22,12,12,GOLD,LINE,1.2);stroke(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],LINE,2.2);leg('Left',GOLD);
  // Frontal feather apron below a profile neck: a purposeful Egyptian
  // convention, rather than a recolored naturalistic side-view bird.
  poly(c,[[28,-162],[78,-166],[99,-145],[79,-119],[28,-122],[12,-137]],'#f0dfb3',LINE,1.5);
  poly(c,[[31,-156],[74,-158],[82,-128],[31,-128]],'#f1dfb0',LINE,.9);
  for(let i=0;i<6;i++)poly(c,[[33+i*7,-153],[39+i*7,-153],[38+i*7,-129],[34+i*7,-129]],i%2?GOLD:BLUE,LINE,.45);
  poly(c,[[17,-140],[-8,-149],[6,-131],[30,-125]],RED,LINE,1);
  path(c,q=>{q.moveTo(74,-163);q.lineTo(75,-202);q.bezierCurveTo(75,-224,99,-238,116,-228);q.lineTo(125,-217);q.lineTo(125,-203);q.lineTo(105,-202);q.lineTo(100,-176);q.lineTo(95,-152);q.closePath();},'#d2a758',LINE,1.5);
  path(c,q=>{q.moveTo(120,-217);q.lineTo(222,-207);q.lineTo(216,-201);q.lineTo(172,-198);q.bezierCurveTo(150,-178,129,-185,121,-201);q.closePath();},'#d9b56f',LINE,1.3);stroke(c,[[124,-209],[216,-207]],RED,1.2);
  poly(c,[[72,-168],[99,-169],[96,-152],[79,-145],[63,-151],[50,-163]],BLUE,LINE,1);for(let i=0;i<6;i++)stroke(c,[[55+i*7,-164],[68+i*5,-151]],GOLD,1.8);
  path(c,q=>{q.moveTo(106,-219);q.lineTo(121,-218);q.lineTo(113,-214);q.closePath();},'#f2e7bf',LINE,1);ellipse(c,115,-217,1.5,1.7,LINE);stroke(c,[[103,-223],[121,-222]],LINE,1.1);
  if(freeze){stroke(c,[[63,-154],[116,-154],[116,-106],[168,-85]],LINE,6);stroke(c,[[63,-154],[116,-154],[116,-106],[168,-85]],GOLD,3.5);}
  else{stroke(c,[[75,-151],[103,-119],[130,-99],[168,-85]],LINE,5);stroke(c,[[75,-151],[103,-119],[130,-99],[168,-85]],GOLD,3);}
  c.restore();}
export function drawTitle(c){c.save();text(c,'埃及壁画',102,146,50,LINE,{bold:true});text(c,'EGYPTIAN WALL PAINTING',104,194,27,RED,{family:'Georgia'});text(c,'约前1300年',105,237,26,LINE);
  c.strokeStyle=RED;c.lineWidth=2.4;c.beginPath();c.roundRect(1455,111,334,72,35);c.stroke();stroke(c,[[1793,109],[1793,185]],LINE,2);text(c,'鹈 鹕 测 试',1622,159,32,LINE,{align:'center'});c.restore();}
