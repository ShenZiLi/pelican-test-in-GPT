import {makeSurface,rng,poly,stroke,ellipse,path,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text,smooth} from '../kit/materials.js';

export const frameColor='#734b34';
const INK='#88432e', DARK='#623b2b', PALE='#d9b580';
const CATTLE=[{x:170,y:535,s:.84,seed:19,delay:2},{x:660,y:493,s:.96,seed:30,delay:2.5},{x:878,y:580,s:.57,seed:43,delay:2.85}];

// Every fleck belongs to a painted silhouette; the sandstone has a separate,
// directional geology, rather than the same noise pasted over both materials.
function pigment(c,draw,color,seed,bounds,holes=95){
  c.save();c.beginPath();draw(c);c.fillStyle=color;c.fill();c.clip();
  const r=rng(seed);for(let i=0;i<holes;i++){
    c.globalAlpha=.12+r()*.4;c.fillStyle=i%3?PALE:'#b37e50';
    const x=bounds[0]+r()*bounds[2],y=bounds[1]+r()*bounds[3];
    c.fillRect(x,y,.4+r()*2.7,.5+r()*1.7);
  }c.restore();
}
function rock(c){
  const r=rng(9401),g=c.createLinearGradient(0,200,1000,780);
  g.addColorStop(0,'#dfbd87');g.addColorStop(.36,'#d0a06a');g.addColorStop(.6,'#e1bb82');g.addColorStop(1,'#c19365');c.fillStyle=g;c.fillRect(0,0,1000,1000);
  // Broad wind-polished planes and mineral stains, each following a rock face.
  for(let k=0;k<44;k++){
    const x=r()*1200-100,y=r()*950,w=95+r()*420,h=20+r()*115;
    const q=c.createRadialGradient(x,y,1,x,y,w);q.addColorStop(0,k%3?'#f4dab849':'#6e62442e');q.addColorStop(1,'#d5af7a00');
    c.save();c.translate(x,y);c.scale(1,h/w);c.fillStyle=q;c.fillRect(-w,-w,w*2,w*2);c.restore();
  }
  for(let k=0;k<75;k++){
    const y=160+k*8+r()*8,pts=[];
    for(let x=-20;x<=1020;x+=28)pts.push([x,y+Math.sin(x*.009+k*.7)*(5+r()*10)+Math.sin(x*.027+k)*2]);
    stroke(c,pts,k%4?'#b4865950':'#f7dab065',.45+r()*1.4);
    if(k%3===0)stroke(c,pts.map(([x,y])=>[x,y+2]),'#8a674633',.5);
  }
  // Major fissures change direction with each stratum; fine hairline branches
  // terminate independently and never turn into an all-over polygon mesh.
  for(let k=0;k<17;k++){
    let x=r()*1050-25,y=170+r()*560;const pts=[[x,y]];
    for(let j=0;j<4+r()*7;j++){x+=(r()-.51)*45;y+=6+r()*17;pts.push([x,y]);}
    stroke(c,pts,'#805c3c5c',.65+r()*.6);stroke(c,pts.map(([x,y])=>[x+1.4,y]),'#f4d3a070',.6);
    if(k%2===0){const p=pts[2];stroke(c,[p,[p[0]+16,p[1]+9],[p[0]+34,p[1]+7]],'#805c3c44',.55);}
  }
  for(let i=0;i<30000;i++){
    const x=r()*1000,y=r()*1000,v=r();c.globalAlpha=.025+r()*.12;c.fillStyle=v>.3?'#6c4d30':'#ffe0ab';
    c.fillRect(x,y,.3+r()*1.25,.25+r()*.8);
  }c.globalAlpha=1;
  for(let i=0;i<1500;i++){
    const x=r()*1000,y=r()*1000,z=.2+r()*1.7;
    ellipse(c,x,y,z,z*.55,'#68533a15');stroke(c,[[x-z,y+z*.5],[x+z,y+z*.5]],'#f9dda629',.4);
  }
}
function cattleBody(c,a){
  c.save();c.translate(a.x,a.y);c.scale(a.s,a.s);
  pigment(c,p=>{p.moveTo(-86,-32);p.bezierCurveTo(-66,-51,-23,-47,7,-37);p.bezierCurveTo(31,-42,54,-40,63,-25);p.lineTo(65,-1);p.bezierCurveTo(36,11,-10,12,-51,0);p.lineTo(-75,-6);p.closePath();},INK,a.seed,[-90,-50,165,65],420);
  // Deliberately tapering legs and knees, not four equal rectangular pegs.
  for(const [x,slant]of[[-62,-8],[-34,4],[33,-6],[54,9]]){
    poly(c,[[x,-8],[x+6,-8],[x+slant+3,43],[x+slant+9,53],[x+slant+2,55],[x+slant-2,44]],INK);
  }
  path(c,p=>{p.moveTo(-81,-31);p.bezierCurveTo(-100,-30,-101,-14,-104,1);p.bezierCurveTo(-105,7,-109,11,-108,14);},null,INK,2.2);
  poly(c,[[-111,10],[-106,12],[-108,22],[-112,17]],DARK);
  // Repeated pale marks recall paint rubbed thin over a convex rock surface.
  for(let i=0;i<8;i++)dryStroke(c,[[-66+i*14,-33],[-59+i*14,-22],[-55+i*14,-6]],'#d9b480',1.1,a.seed+i);
  c.restore();
}
function cattleHead(c,a,turn){
  c.save();c.translate(a.x,a.y);c.scale(a.s,a.s);c.translate(62,-31);c.rotate(-.12-turn*.24);
  pigment(c,p=>{p.moveTo(-5,-5);p.lineTo(14,-29);p.lineTo(24,-24);p.lineTo(27,-6);p.lineTo(42,0);p.lineTo(42,9);p.lineTo(25,13);p.lineTo(10,5);p.lineTo(4,21);p.lineTo(-5,19);p.closePath();},INK,a.seed+80,[-7,-33,52,58],55);
  // Long open arcs are the governing silhouette of this small herd.
  path(c,p=>{p.moveTo(14,-24);p.bezierCurveTo(-9,-29,-25,-57,-17,-73);p.bezierCurveTo(-21,-49,-1,-35,18,-34);},null,DARK,2.8);
  path(c,p=>{p.moveTo(22,-25);p.bezierCurveTo(46,-38,46,-64,36,-78);p.bezierCurveTo(56,-64,60,-34,25,-22);},null,DARK,2.5);
  poly(c,[[7,-21],[-9,-24],[-1,-12],[13,-13]],INK);
  ellipse(c,27-turn*7,-10,1.4,1.5,DARK);
  if(turn>.15)stroke(c,[[28,-10],[31,-9]],'#d8b47f',.9);
  c.restore();
}
function herderBody(c,x,y,s,seed){
  c.save();c.translate(x,y);c.scale(s,s);
  pigment(c,p=>{p.moveTo(-9,-75);p.bezierCurveTo(-20,-54,-11,-25,-9,-12);p.lineTo(9,-13);p.bezierCurveTo(10,-35,12,-57,3,-76);p.closePath();},INK,seed,[-20,-80,40,70],90);
  stroke(c,[[-7,-17],[-14,23],[-22,58]],INK,4.3);stroke(c,[[6,-15],[12,23],[23,55]],INK,4);
  stroke(c,[[-13,-65],[-34,-39],[-45,-39]],INK,3.2);stroke(c,[[8,-64],[28,-45],[34,-64]],INK,3);
  stroke(c,[[34,-93],[35,65]],DARK,1.5);stroke(c,[[-23,59],[-12,59]],DARK,2);stroke(c,[[18,55],[29,56]],DARK,2);
  c.restore();
}
function herderHead(c,x,y,s,turn){
  c.save();c.translate(x,y);c.scale(s,s);c.translate(-1,-87);c.rotate(turn*.3);
  ellipse(c,0,0,7.2,10,INK);poly(c,[[5,-1],[10,2],[5,4]],INK);stroke(c,[[-1,9],[0,16]],INK,3.1);c.restore();
}
export function createAssets(){
  const {canvas,ctx:c}=makeSurface();rock(c);CATTLE.forEach(a=>cattleBody(c,a));herderBody(c,390,542,.81,100);herderBody(c,808,483,.65,108);
  // A faint, unrelated running gazelle balances the high left negative space.
  c.save();c.translate(108,398);c.scale(.55,.55);ellipse(c,0,0,38,11,'#9b5a3a9c');stroke(c,[[-28,1],[-52,21],[-71,24]],'#965337b0',3);stroke(c,[[20,3],[39,23],[61,21]],'#965337b0',3);stroke(c,[[27,-2],[40,-27],[49,-30]],'#965337b0',4);stroke(c,[[44,-28],[37,-49]],'#74462eaa',1.4);c.restore();
  return Object.freeze({rock:canvas});
}
export function drawBackground(c,{localTime,assets}){
  c.drawImage(assets.rock,0,0);
  CATTLE.forEach(a=>cattleHead(c,a,smooth((localTime-a.delay)/.5)));
  herderHead(c,390,542,.81,smooth((localTime-2.05)/.35));herderHead(c,808,483,.65,smooth((localTime-2.65)/.35));
}
export function drawRoad(c){
  // The same rock face continues beneath the wheels; only a thin scratched
  // route distinguishes the continuous contact line from the painted world.
  stroke(c,[[0,700],[142,699.6],[291,700.5],[451,700],[623,700.3],[817,699.6],[1000,700]],'#9b704761',1.4);
  stroke(c,[[0,702],[282,702],[511,702.2],[753,702],[1000,702]],'#f1d19b99',.7);
}
function roughWheel(c,x,angle){
  const pts=[];for(let i=0;i<=52;i++){const a=i*Math.PI*2/52;const r=44+Math.sin(i*1.7+x)*.65;pts.push([x+Math.cos(a)*r,Math.sin(a)*r]);}
  stroke(c,pts,INK,2.8);stroke(c,pts.map(([xx,y])=>[xx*.998+.3,y*.96]),'#653d2c',.65,.6);
  for(let i=0;i<8;i++){const a=angle+i*Math.PI/4;stroke(c,[[x,0],[x+Math.cos(a)*41,Math.sin(a)*41]],INK,1.1,.84);}
  ellipse(c,x,0,3,2.5,INK);
}
export function drawRider(c,t){
  const p=poseAt(t);c.save();c.lineCap='round';c.lineJoin='round';roughWheel(c,0,p.wheelAngle);roughWheel(c,180,p.wheelAngle);
  const leg=(side,col)=>{const k=p['knee'+side],a=p['ankle'+side];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],col,4);poly(c,[[a.x-6,a.y-2],[a.x+13,a.y],[a.x+15,a.y+3],[a.x-8,a.y+3]],col);};
  leg('Right','#a25d39');
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[145,-75],[80,-22]],[[145,-75],[180,0]],[[62,-79],[58,-115]],[[145,-75],[152,-99],[172,-98],[176,-87]]]){
    stroke(c,pts,DARK,2.7);dryStroke(c,pts,'#bc8051',1.2,99);
  }
  stroke(c,[[41,-114],[74,-114]],DARK,4);stroke(c,[[0,-5],[80,-33],[92,-24],[83,-11],[0,5]],INK,1);
  ellipse(c,80,-22,11,11,null,INK,1.3);stroke(c,[[80,-22],[p.ankleRight.x,p.ankleRight.y]],INK,2);stroke(c,[[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],INK,2);
  leg('Left',DARK);
  // A purposeful flat-paint bird: sawtooth tail, long narrow neck and a single
  // ochre wing mass have entirely different edges from the neutral roadster.
  pigment(c,q=>{q.moveTo(9,-143);q.lineTo(-11,-155);q.lineTo(24,-151);q.bezierCurveTo(40,-174,66,-176,79,-153);q.bezierCurveTo(69,-181,75,-206,91,-225);q.bezierCurveTo(103,-237,123,-229,126,-218);q.bezierCurveTo(130,-202,113,-197,100,-202);q.bezierCurveTo(98,-180,109,-167,103,-147);q.bezierCurveTo(95,-121,52,-112,27,-124);q.lineTo(5,-135);q.lineTo(22,-133);q.closePath();},INK,991,[-12,-238,143,125],170);
  pigment(c,q=>{q.moveTo(121,-217);q.lineTo(222,-207);q.lineTo(216,-201);q.lineTo(174,-199);q.bezierCurveTo(157,-174,133,-181,121,-200);q.closePath();},'#a45a35',990,[120,-220,105,44],65);
  stroke(c,[[124,-209],[215,-207]],DARK,1.1);stroke(c,[[126,-201],[142,-191],[160,-193],[172,-198]],DARK,.8);
  poly(c,[[29,-155],[46,-163],[71,-151],[87,-133],[63,-134],[48,-141],[30,-141],[41,-148]],DARK);
  for(let i=0;i<4;i++)stroke(c,[[42+i*7,-153],[51+i*6,-140]],'#bc8050',.8);
  path(c,q=>{q.moveTo(78,-151);q.bezierCurveTo(98,-132,103,-111,124,-102);q.lineTo(169,-85);q.lineTo(166,-81);q.bezierCurveTo(128,-88,98,-95,84,-124);q.closePath();},INK);
  ellipse(c,114,-218,2.6,2.6,DARK);stroke(c,[[80,-220],[74,-224]],INK,1.3);c.restore();
}
export function drawTitle(c){
  c.save();text(c,'撒哈拉岩画',102,157,51,DARK,{bold:true});
  text(c,'SAHARAN ROCK ART',104,204,27,INK,{family:'Georgia'});text(c,'约前4000年',105,248,26,DARK);
  // A short broken pigment rule, rather than a museum placard.
  dryStroke(c,[[104,267],[230,268],[294,266]],INK,2.5,111);c.restore();
}
