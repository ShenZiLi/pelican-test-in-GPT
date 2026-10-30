import {makeSurface,rng,poly,stroke,ellipse,path,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
export const frameColor='#b2b69e';
const BG='#172321',WHITE='#dddcca';
function carved(c,pts,w=1.2){stroke(c,pts,WHITE,w);dryStroke(c,pts,'#87917e',w*.7,Math.round(pts[0][0]*3+pts[0][1]));}
function horse(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);
  path(c,p=>{p.moveTo(-56,-41);p.bezierCurveTo(-30,-50,12,-43,28,-51);p.lineTo(38,-80);p.lineTo(53,-90);p.lineTo(52,-107);p.lineTo(60,-95);p.lineTo(69,-97);p.lineTo(73,-83);p.lineTo(87,-77);p.lineTo(85,-68);p.lineTo(63,-63);p.lineTo(53,-32);p.bezierCurveTo(37,-12,-1,-17,-28,-23);p.lineTo(-53,-15);p.closePath();},null,WHITE,1.7);
  for(const pts of[[[-43,-19],[-49,4],[-67,28],[-82,29]],[[-21,-20],[-10,4],[-22,30],[-7,31]],[[29,-23],[31,0],[54,17],[68,16]],[[45,-27],[58,-7],[65,13],[78,13]]])carved(c,pts,2.1);
  path(c,p=>{p.moveTo(-55,-39);p.bezierCurveTo(-76,-49,-72,-13,-89,-11);},null,WHITE,1.3);
  carved(c,[[40,-81],[57,-68],[81,-72]],1);for(let i=0;i<7;i++)carved(c,[[40+i*2,-73-i*3],[46+i*2,-65-i*3]],.7);
  for(let i=0;i<13;i++)carved(c,[[-43+i*6,-38],[-34+i*6,-27]],.6);ellipse(c,68,-84,1.8,1.5,WHITE);carved(c,[[55,-91],[49,-80],[45,-68]],.8);c.restore();}
function courtier(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-9,-74],[12,-74],[22,-26],[35,0],[-29,0],[-17,-30]],null,WHITE,1.4);for(let i=0;i<7;i++)carved(c,[[-12+i*4,-63],[-20+i*8,-3]],.7);ellipse(c,2,-88,8,11,null,WHITE,1.3);poly(c,[[-8,-99],[15,-99],[20,-104],[-11,-104]],null,WHITE,1);carved(c,[[0,-75],[27,-58],[40,-60]],1.5);carved(c,[[41,-111],[41,2]],1);c.restore();}
function cart(c,x,y){c.save();c.translate(x,y);for(const xx of[-31,35]){ellipse(c,xx,0,27,27,null,WHITE,2);for(let i=0;i<12;i++){const a=i*Math.PI/6;carved(c,[[xx,0],[xx+25*Math.cos(a),25*Math.sin(a)]],.7);}}
  poly(c,[[-52,-20],[57,-20],[53,-60],[-47,-60]],null,WHITE,1.7);for(let xx=-43;xx<55;xx+=10)carved(c,[[xx,-22],[xx,-58]],.7);
  carved(c,[[-63,-120],[64,-120]],2.2);path(c,p=>{p.moveTo(-69,-119);p.bezierCurveTo(-45,-139,35,-146,70,-119);},null,WHITE,1.5);carved(c,[[-58,-118],[-58,-23]],1.6);carved(c,[[57,-118],[57,-24]],1.6);
  for(let i=0;i<11;i++)carved(c,[[-60+i*12,-120],[-57+i*11,-130]],.6);courtier(c,0,-53,.62);c.restore();}
export function createAssets(){const{canvas,ctx:c}=makeSurface(1500,1500);c.scale(1.5,1.5);c.fillStyle=BG;c.fillRect(0,0,1000,1000);const r=rng(323);
  // Stamped, rubbed ink has clustered transfer failure, not photographic noise.
  for(let i=0;i<280;i++){const x=r()*1000,y=r()*1000,w=5+r()*100,h=2+r()*25;c.globalAlpha=.015+r()*.055;poly(c,[[x,y],[x+w*.7,y-2],[x+w,y+h*.5],[x+w*.4,y+h],[x-2,y+h*.3]],'#d8d9bd');}c.globalAlpha=1;
  for(let i=0;i<45000;i++){c.globalAlpha=.03+r()*.16;c.fillStyle=i%5?'#a5ac98':'#f1ecd3';c.fillRect(r()*1000,r()*1000,.2+r()*1.5,.2+r()*.8);}c.globalAlpha=1;
  for(const yy of[365,419,655,681]){carved(c,[[0,yy],[1000,yy]],1.2);carved(c,[[0,yy+4],[1000,yy+4]],.6);}
  // Repeating invented cloud beasts form a shallow carved upper register.
  c.save();c.translate(0,36);for(let x=30;x<1000;x+=135){path(c,p=>{p.moveTo(x,365);p.bezierCurveTo(x+17,337,x+37,381,x+56,352);p.bezierCurveTo(x+64,339,x+88,342,x+90,357);p.bezierCurveTo(x+94,368,x+77,371,x+76,360);p.bezierCurveTo(x+78,354,x+86,358,x+83,362);},null,WHITE,1);carved(c,[[x+15,357],[x+6,373],[x+28,371]],1);carved(c,[[x+53,355],[x+64,373],[x+75,370]],1);carved(c,[[x+87,348],[x+94,339],[x+91,351]],.8);}
  c.restore();horse(c,167,593,.92);horse(c,329,607,.84);cart(c,65,632);carved(c,[[100,608],[230,571],[383,573]],1.1);courtier(c,718,636,.88);courtier(c,821,639,.95);cart(c,953,636);
  for(let i=0;i<7;i++){const x=60+i*148;carved(c,[[x,668],[x+10,660],[x+20,668],[x+30,660],[x+40,668]],.7);}
  return Object.freeze({rubbing:canvas});}
export function drawBackground(c,{assets}){c.drawImage(assets.rubbing,0,0,1000,1000);}
export function drawRoad(c){c.fillStyle=BG;c.fillRect(0,700,1000,300);carved(c,[[0,700],[1000,700]],1.5);for(let x=0;x<1000;x+=41)path(c,p=>{p.moveTo(x,717);p.bezierCurveTo(x+9,704,x+22,727,x+32,714);},null,WHITE,.65);}
export function drawRider(c,t){const p=poseAt(t);c.save();
  for(const x of[0,180]){ellipse(c,x,0,44,44,null,WHITE,2.7);ellipse(c,x,0,40,40,null,WHITE,.6);for(let i=0;i<12;i++){const a=p.wheelAngle+i*Math.PI/6;carved(c,[[x,0],[x+39*Math.cos(a),39*Math.sin(a)]],.8);}}
  const leg=(s,w)=>{const k=p['knee'+s],a=p['ankle'+s];carved(c,[[58,-126],[k.x,k.y],[a.x,a.y]],w);carved(c,[[a.x-7,a.y],[a.x+14,a.y+2]],w);};leg('Right',2);
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[147,-76],[80,-22]],[[147,-76],[180,0]],[[62,-79],[58,-115]],[[147,-76],[154,-98],[176,-95],[174,-85]],[[42,-115],[73,-115]]])carved(c,pts,2.7);
  ellipse(c,80,-22,11,11,null,WHITE,1);carved(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],1.8);leg('Left',3);
  poly(c,[[4,-144],[-7,-155],[28,-150],[47,-174],[74,-170],[88,-153],[81,-177],[80,-204],[91,-226],[110,-232],[125,-220],[126,-205],[103,-202],[102,-180],[111,-160],[105,-142],[82,-125],[53,-120],[25,-130]],null,WHITE,2);
  poly(c,[[122,-217],[222,-207],[216,-200],[174,-199],[158,-184],[137,-185],[122,-202]],null,WHITE,1.6);carved(c,[[126,-209],[215,-207]],.9);
  for(let i=0;i<7;i++)carved(c,[[28+i*6,-151],[37+i*6,-142],[31+i*6,-134]],1.7);carved(c,[[84,-213],[88,-190],[95,-176]],1.1);carved(c,[[102,-226],[117,-224]],.8);ellipse(c,115,-217,3,2,WHITE);
  for(let i=0;i<4;i++)carved(c,[[32+i*8,-126],[45+i*7,-123]],.7);carved(c,[[78,-153],[104,-117],[132,-98],[169,-85]],3);carved(c,[[79,-146],[101,-108],[130,-92],[167,-81]],.8);c.restore();}
export function drawTitle(c){c.save();text(c,'汉画像石拓片',102,150,49,WHITE,{bold:true});text(c,'HAN STONE RUBBING',104,199,27,'#b9c0ac',{family:'Georgia'});text(c,'约100年',105,244,26,WHITE);carved(c,[[105,265],[409,265]],.8);c.restore();}
