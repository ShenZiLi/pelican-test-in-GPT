import {makeSurface,rng,poly,stroke,ellipse,path,wash,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text,smooth} from '../kit/materials.js';
export const frameColor='#6f7258';
const INK='#5c5b43',PAPER='#e7dcc0',ROBE=['#929d77','#aa7059','#c6b58c','#a7ac96','#b49b69'];
export function deckY(x){return x<=200||x>=800?700:700-82*Math.sin(Math.PI*(x-200)/600)**2;}
// Main rotates the whole common rider about the rear axle. The wheels sit on
// this very same timber curve, including zero-height/slope entrance and exit.
export function roadAt(u){const x=u*1000/6;return{y:deckY(x),angle:Math.atan2(deckY(x+180)-deckY(x),180)};}
const PEOPLE=[{x:75,y:672,s:.78},{x:166,y:677,s:.82},{x:285,s:.83},{x:347,s:.86},{x:402,s:.9},{x:621,s:.83},{x:674,s:.91},{x:745,s:.78},{x:866,y:681,s:.9},{x:928,y:675,s:.78}].map((a,i)=>({...a,y:a.y??deckY(a.x)-4,delay:2+i*.115}));
function personBody(c,a,i){c.save();c.translate(a.x,a.y);c.scale(a.s,a.s);poly(c,[[-6,-38],[5,-38],[11,-7],[8,0],[-12,0],[-9,-13]],ROBE[i%ROBE.length],INK,.7);stroke(c,[[-4,-31],[-17,-17],[-13,-10]],INK,.8);stroke(c,[[4,-31],[14,-15],[9,-8]],INK,.8);stroke(c,[[-3,-4],[-5,3]],INK,1.3);stroke(c,[[5,-4],[10,3]],INK,1.3);for(let k=0;k<3;k++)stroke(c,[[-3+k*3,-26],[-5+k*5,-4]],INK,.35,.7);c.restore();}
function personHead(c,a,i,turn){c.save();c.translate(a.x,a.y);c.scale(a.s,a.s);c.translate(0,-43);ellipse(c,0,0,5.3,6.5,'#ccb58a',INK,.7);poly(c,[[-6,-4],[-4,-8],[4,-8],[7,-4]],i%2?INK:'#858a70',INK,.5);stroke(c,[[1+turn*2,-1],[4-turn*4,1]],INK,.8);if(turn>.5)ellipse(c,-2,0,.7,.7,INK);c.restore();}
function house(c,x,y,w,h,tone,seed){const r=rng(seed);c.save();c.globalAlpha=tone;poly(c,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],'#c8c5a7',INK,.65);poly(c,[[x-8,y],[x+w*.52,y-21],[x+w+12,y+2],[x+w+7,y+8],[x+w*.5,y-12],[x-6,y+5]],'#969c83',INK,.85);for(let z=0;z<11;z++){const xx=x-3+z*(w+9)/11;stroke(c,[[xx,y+1],[x+w*.5+(xx-x-w*.5)*.4,y-13]],INK,.35,.7);}for(let z=0;z<3;z++){const xx=x+8+z*(w-16)/3;stroke(c,[[xx,y+12],[xx,y+h]],INK,.75);}stroke(c,[[x,y+h*.65],[x+w,y+h*.65]],INK,.6);for(let z=0;z<3;z++)poly(c,[[x+10+z*(w-22)/3,y+12],[x+19+z*(w-22)/3,y+12],[x+19+z*(w-22)/3,y+24],[x+10+z*(w-22)/3,y+24]],'#626e5847',INK,.4);if(r()>.4)stroke(c,[[x+w*.8,y+3],[x+w*.8,y-28]],INK,.5);c.restore();}
function stall(c,x,y,w,seed){const r=rng(seed);poly(c,[[x,y-51],[x+w,y-51],[x+w+7,y-27],[x-7,y-27]],'#c2b38a',INK,.8);for(let i=0;i<7;i++)stroke(c,[[x+i*w/7,y-51],[x-6+i*(w+12)/7,y-27]],i%2?'#a37b5a':'#d1c09a',3.2,.6);stroke(c,[[x,y-27],[x,y]],INK,1.2);stroke(c,[[x+w,y-27],[x+w,y]],INK,1.2);poly(c,[[x-2,y-12],[x+w+2,y-12],[x+w+2,y-5],[x-2,y-5]],'#ab996c',INK,.6);for(let i=0;i<7;i++)ellipse(c,x+5+r()*(w-10),y-17-r()*4,2+r()*3,2+r()*3,i%3?'#b4a779':'#a97053',INK,.4);}
export function createAssets({paper}={}){const{canvas,ctx:c}=makeSurface(1500,1500);c.scale(1.5,1.5);c.fillStyle=PAPER;c.fillRect(0,0,1000,1000);if(paper){c.globalAlpha=.45;c.drawImage(paper,0,0);c.globalAlpha=1;}
  // A receding town belt, independently built rather than a copied scroll.
  for(let i=0;i<15;i++){const x=i*72-18,y=442+Math.sin(i*.9)*24;house(c,x,y,61+(i%3)*8,67+(i%4)*5,.28,600+i);}
  for(let i=0;i<8;i++){const x=i*133-27;house(c,x,518+Math.sin(i*2)*14,82,88,.43,630+i);}
  const water=c.createLinearGradient(0,580,0,790);water.addColorStop(0,'#c7ccb442');water.addColorStop(1,'#9aa99a99');c.fillStyle=water;c.fillRect(0,579,1000,421);
  for(let i=0;i<96;i++){const x=(i*83)%1000,y=603+(i*29)%180;stroke(c,[[x,y],[x+12+(i%4)*9,y-1],[x+28+(i%4)*9,y]],'#718575',.4,.3);}
  // Riverbanks hide the water under the street approaches.
  wash(c,[[0,586],[143,606],[224,680],[202,724],[0,741]],'#989d76',.4,651);wash(c,[[800,682],[872,603],[1000,589],[1000,748],[799,729]],'#989d76',.4,652);
  poly(c,[[0,674],[200,694],[212,714],[0,728]],'#c4ba91',INK,.6);poly(c,[[800,694],[1000,670],[1000,730],[788,717]],'#c4ba91',INK,.6);
  // Three mutually braced timber rib systems, a genuine arch under the path.
  for(const offset of[12,22,34]){const pts=[];for(let x=199;x<=801;x+=6)pts.push([x,deckY(x)+offset]);stroke(c,pts,'#9a835c',5);stroke(c,pts,INK,.8);}
  for(let x=205;x<800;x+=34){const y=deckY(x);stroke(c,[[x,y+9],[x+40,deckY(Math.min(800,x+40))+36]],'#8c7655',3);stroke(c,[[x,y+9],[x+40,deckY(Math.min(800,x+40))+36]],INK,.6);stroke(c,[[x,y+35],[x+41,deckY(Math.min(800,x+41))+11]],'#ad9870',3);stroke(c,[[x,y+35],[x+41,deckY(Math.min(800,x+41))+11]],INK,.6);}
  // Cargo boat lives under the open crown, with mast, cabin and rope-work.
  poly(c,[[403,748],[576,748],[558,773],[430,773],[411,760]],'#9b8c65',INK,1);stroke(c,[[411,753],[568,753]],'#d8cda6',2);poly(c,[[450,747],[450,725],[484,711],[532,721],[546,747]],'#b9ae87',INK,.8);for(let i=0;i<9;i++)path(c,p=>{p.moveTo(450+i*10,746);p.bezierCurveTo(449+i*9,719,478+i*5,712,484+i*7,722);},null,INK,.5);stroke(c,[[434,749],[434,690]],INK,1.3);stroke(c,[[434,693],[475,745]],INK,.55);stroke(c,[[549,747],[581,714]],INK,1.4);stroke(c,[[426,777],[562,777]],'#738879',.7,.7);
  stall(c,31,681,80,680);stall(c,130,687,64,681);stall(c,822,686,76,682);stall(c,915,680,71,683);
  PEOPLE.forEach((a,i)=>personBody(c,a,i));return Object.freeze({city:canvas});}
export function drawBackground(c,{assets,localTime}){c.drawImage(assets.city,0,0,1000,1000);PEOPLE.forEach((a,i)=>personHead(c,a,i,smooth((localTime-a.delay)/.35)));}
export function drawRoad(c){
  // Deck planks replace the flat road, with the rear rail behind the rider.
  const top=[],bottom=[];for(let x=0;x<=1000;x+=5){top.push([x,deckY(x)]);bottom.push([x,deckY(x)+9]);}poly(c,[...top,...bottom.reverse()],'#c4ad7b',INK,.9);
  for(let x=202;x<800;x+=11)stroke(c,[[x,deckY(x)+1],[x+2,deckY(x)+8]],INK,.55,.8);
  const rail=[];for(let x=201;x<=799;x+=8)rail.push([x,deckY(x)-24]);stroke(c,rail,'#a58d62',2.2);stroke(c,rail,INK,.5);for(let x=208;x<800;x+=32)stroke(c,[[x,deckY(x)],[x,deckY(x)-25]],INK,1.1);
}
export function drawRider(c,t){const p=poseAt(t);c.save();
  for(const x of[0,180]){ellipse(c,x,0,44,44,null,INK,2.5);ellipse(c,x,0,40.5,40.5,null,'#8d9878',.7);for(let i=0;i<14;i++){const a=p.wheelAngle+i*Math.PI/7;stroke(c,[[x,0],[x+41*Math.cos(a),41*Math.sin(a)]],INK,.7);}}
  const leg=(s,col)=>{const k=p['knee'+s],a=p['ankle'+s];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],INK,4.4);stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],col,2.6);stroke(c,[[a.x-8,a.y],[a.x+14,a.y+1]],INK,3);};leg('Right','#ba9b68');
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[147,-76],[80,-22]],[[147,-76],[180,0]],[[62,-79],[58,-115]],[[147,-76],[152,-98],[175,-97],[175,-85]]]){stroke(c,pts,INK,3.1);stroke(c,pts,'#9a7b53',1.2);}
  stroke(c,[[42,-115],[74,-115]],INK,4);ellipse(c,80,-22,11,11,null,INK,1);stroke(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],INK,2);leg('Left','#ba9b68');
  path(c,q=>{q.moveTo(5,-143);q.lineTo(-6,-150);q.lineTo(24,-147);q.bezierCurveTo(42,-175,71,-174,83,-154);q.bezierCurveTo(69,-183,77,-217,96,-226);q.bezierCurveTo(112,-234,125,-226,126,-216);q.bezierCurveTo(129,-203,113,-198,102,-203);q.bezierCurveTo(100,-182,113,-165,106,-147);q.bezierCurveTo(97,-120,54,-111,29,-128);q.closePath();},'#e4ddbb',INK,1.35);
  path(c,q=>{q.moveTo(121,-217);q.lineTo(222,-207);q.lineTo(217,-201);q.lineTo(173,-198);q.bezierCurveTo(154,-177,131,-183,121,-201);q.closePath();},'#c5a36c',INK,1.2);stroke(c,[[126,-209],[216,-207]],'#9a7952',.8);
  path(c,q=>{q.moveTo(27,-154);q.bezierCurveTo(46,-169,68,-158,86,-136);q.bezierCurveTo(64,-139,43,-133,27,-154);q.closePath();},'#b4bea0',INK,.85);for(let i=0;i<7;i++)path(c,q=>{q.moveTo(30+i*5,-155);q.bezierCurveTo(45+i*4,-157,55+i*4,-144,64+i*3,-139);},null,INK,.55);
  path(c,q=>{q.moveTo(77,-152);q.bezierCurveTo(100,-133,104,-111,131,-99);q.lineTo(170,-85);q.lineTo(167,-81);q.bezierCurveTo(128,-89,99,-97,83,-127);q.closePath();},'#d6d8b8',INK,1);
  ellipse(c,114,-218,3.2,2.6,'#eee6c8',INK,.6);ellipse(c,115,-218,1.2,1.5,INK);poly(c,[[88,-229],[98,-240],[119,-237],[126,-228]],'#8c9875',INK,.8);stroke(c,[[84,-228],[132,-226]],INK,1.3);c.restore();}
export function drawTitle(c){c.save();text(c,'清明上河图',102,150,49,INK,{bold:true});text(c,'ALONG THE RIVER',104,199,27,'#72785e',{family:'Georgia'});text(c,'约1100年',105,244,26,INK);dryStroke(c,[[104,264],[410,264]],INK,1,6001);c.restore();}
