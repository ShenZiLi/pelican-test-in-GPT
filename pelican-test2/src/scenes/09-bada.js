import {makeSurface,rng,stroke,ellipse,path,poly,wash,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text,smooth} from '../kit/materials.js';
export const frameColor='#435247';
const PAPER='#eee9d8',INK='#172b24';
function wet(c,draw,alpha=1){c.save();c.globalAlpha=alpha;c.shadowColor='#273c2850';c.shadowBlur=1.7;path(c,draw,INK);c.restore();}
export function createAssets({paper}={}){const{canvas,ctx:c}=makeSurface(1500,1500);c.scale(1.5,1.5);c.fillStyle=PAPER;c.fillRect(0,0,1000,1000);if(paper){c.globalAlpha=.4;c.drawImage(paper,0,0);c.globalAlpha=1;}
  // One heavy, blunt rock and its diluted ghost. All other paper remains empty.
  wash(c,[[22,688],[37,619],[63,605],[95,560],[124,577],[160,617],[177,683]],'#66725b',.24,902);
  wet(c,p=>{p.moveTo(40,688);p.bezierCurveTo(43,647,50,616,71,616);p.bezierCurveTo(87,612,84,581,100,586);p.bezierCurveTo(124,593,124,624,137,633);p.bezierCurveTo(164,653,152,671,175,688);p.closePath();});
  dryStroke(c,[[60,671],[63,640],[80,632],[90,608]],'#d0d2b6',6,908);dryStroke(c,[[108,612],[112,640],[137,661]],'#bac2a5',3,909);
  // A branch is a few deliberate strokes, not a filled illustration of a tree.
  c.save();c.translate(0,100);wet(c,p=>{p.moveTo(1000,321);p.lineTo(938,348);p.lineTo(924,370);p.lineTo(868,381);p.lineTo(834,410);p.lineTo(868,377);p.lineTo(923,365);p.lineTo(935,344);p.lineTo(1000,311);p.closePath();},.88);
  dryStroke(c,[[938,345],[923,329],[903,328]],INK,2.6,913);dryStroke(c,[[891,376],[890,355],[873,345]],INK,2,914);dryStroke(c,[[865,384],[838,379],[818,387]],INK,1.3,915);
  wet(c,p=>{p.moveTo(897,352);p.bezierCurveTo(887,328,898,316,902,338);p.bezierCurveTo(904,346,902,351,897,352);},.8);wet(c,p=>{p.moveTo(914,329);p.bezierCurveTo(906,306,918,296,920,317);p.closePath();},.8);
  c.restore();for(const pts of[[[196,700],[201,671],[214,651]],[[201,684],[185,667]],[[211,659],[225,652]]])dryStroke(c,pts,INK,1.4,924);
  return Object.freeze({paper:canvas});}
export function drawBackground(c,{assets}){c.drawImage(assets.paper,0,0,1000,1000);}
export function drawRoad(c){dryStroke(c,[[0,700],[122,700],[251,700],[410,700],[550,700],[728,700],[1000,700]],'#9da48b',.8,930);}
export function drawRider(c,t){const p=poseAt(t),roll=smooth((t-55)/.23)*(1-smooth((t-57.4)/.5));c.save();
  // Two broken, dry wheel arcs; their untouched paper gaps matter as much as ink.
  for(const x of[0,180]){for(const [a,b]of[[.08,2.68],[2.94,5.95]]){const pts=[];for(let j=0;j<=28;j++){const q=a+(b-a)*j/28;pts.push([x+Math.cos(q)*(44+Math.sin(j)*.6),Math.sin(q)*44]);}dryStroke(c,pts,INK,2.7,x+946);}for(let i=0;i<4;i++){const a=p.wheelAngle+i*Math.PI/2;stroke(c,[[x,0],[x+42*Math.cos(a),42*Math.sin(a)]],INK,.9,.8);}}
  const leg=s=>{const k=p['knee'+s],a=p['ankle'+s];dryStroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],INK,s==='Left'?4:2,951);stroke(c,[[a.x-7,a.y],[a.x+13,a.y+1]],INK,2.5);};leg('Right');
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[147,-76],[80,-22]],[[147,-76],[180,0]],[[62,-79],[58,-115]],[[147,-76],[152,-96],[175,-94],[172,-84]]])dryStroke(c,pts,INK,3,955);stroke(c,[[42,-115],[74,-115]],INK,4);stroke(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],INK,2);leg('Left');
  // Three wet masses form a squatting, severe bird. The large eye remains a
  // paper-white cutout and the pupil is the only conspicuous facial animation.
  wet(c,q=>{q.moveTo(10,-145);q.bezierCurveTo(22,-179,64,-179,82,-155);q.bezierCurveTo(105,-136,91,-114,63,-117);q.bezierCurveTo(37,-113,15,-124,10,-145);});
  wet(c,q=>{q.moveTo(69,-153);q.bezierCurveTo(57,-177,73,-219,91,-226);q.bezierCurveTo(106,-237,128,-232,127,-214);q.bezierCurveTo(126,-203,113,-201,105,-206);q.bezierCurveTo(91,-183,99,-173,95,-152);q.closePath();});
  poly(c,[[24,-140],[-9,-151],[12,-151],[31,-147]],INK);
  path(c,q=>{q.moveTo(122,-216);q.lineTo(222,-207);q.lineTo(215,-201);q.lineTo(171,-199);q.bezierCurveTo(152,-176,129,-185,121,-201);q.closePath();},'#c2c8ac',INK,1.5);stroke(c,[[127,-209],[215,-207]],INK,1);
  wet(c,q=>{q.moveTo(24,-159);q.bezierCurveTo(56,-172,75,-153,91,-135);q.bezierCurveTo(71,-139,51,-132,24,-159);});dryStroke(c,[[32,-156],[57,-145],[77,-141]],'#c3cbb1',2.2,961);
  wet(c,q=>{q.moveTo(78,-153);q.bezierCurveTo(105,-129,104,-111,131,-100);q.lineTo(170,-86);q.lineTo(166,-81);q.bezierCurveTo(122,-90,95,-101,81,-127);q.closePath();});
  ellipse(c,114,-217,9.8,7.7,PAPER,INK,.85);ellipse(c,116+roll*1.8,-217-roll*5.1,2.1,2.4,INK);stroke(c,[[103,-225],[123,-222]],INK,2.4);dryStroke(c,[[80,-206],[75,-192],[81,-178]],'#a3b095',2.5,964);c.restore();}
export function drawTitle(c,{t=53}={}){c.save();const right=Math.min(1813,((59-t)*1000/6+420)*1.92-90);c.translate(right-1813,0);text(c,'八大山人写意',1813,144,48,'#344a3c',{align:'right',bold:true});text(c,'BADA SHANREN · INK',1810,194,27,'#63715b',{align:'right',family:'Georgia'});text(c,'约1690年',1810,238,26,'#344a3c',{align:'right'});c.fillStyle='#9a4f3e';c.fillRect(1755,260,44,43);text(c,'意',1777,292,29,PAPER,{align:'center'});c.restore();}
