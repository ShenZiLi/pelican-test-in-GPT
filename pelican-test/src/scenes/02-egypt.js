import {cached, rng, path, line, ellipse, rect, text, road, TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';

// Original ornamental forms; the invented signs do not purport to translate the title.
const C={stone:'#d9c49a',pale:'#eee0b9',ink:'#37392e',blue:'#2f6a70',red:'#a35031',gold:'#cbb17d',green:'#687654'};
function lotus(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);line(c,[[0,0],[0,-48]],C.green,2);path(c,'M0 -47 Q-20 -62 -19 -78 Q-2 -74 0 -62 Q2 -76 18 -78 Q17 -59 0 -47Z',C.blue,C.ink,1);path(c,'M0 -49 Q-10 -70 0 -86 Q10 -70 0 -49Z',C.pale,C.ink,1);line(c,[[-15,-51],[15,-51]],C.red,3);c.restore();}
function sign(c,x,y,n,s=1){c.save();c.translate(x,y);c.scale(s,s);c.lineCap='butt';const k=n%7;
  if(k===0){path(c,'M-14 5 Q-7 -9 8 -8 L15 -17 L17 -2 L11 2 L4 12 L-12 12Z',C.blue,C.ink,1.2);line(c,[[-3,12],[-3,19],[7,19]],C.ink,1.5);ellipse(c,11,-6,1,1,C.pale);}
  if(k===1){path(c,'M-15 12 Q0 -20 15 12 M-17 12 L17 12 M-12 17 L12 17',null,C.red,2);ellipse(c,0,-9,4,4,null,C.ink,1.3);}
  if(k===2){ellipse(c,0,-2,10,10,null,C.blue,2);ellipse(c,0,-2,3,3,C.red);line(c,[[0,8],[0,21],[-10,21]],C.ink,2);}
  if(k===3){for(let j=0;j<3;j++)path(c,`M-17 ${j*9-10} l8 -4 l8 4 l8 -4 l8 4`,null,C.blue,1.6);}
  if(k===4){path(c,'M-17 12 L-9 -13 L2 12 L9 -5 L19 12Z',null,C.red,2);line(c,[[-20,18],[21,18]],C.ink,1.2);}
  if(k===5){path(c,'M-13 15 L-13 -11 L12 -11 L12 15 M-18 17 L18 17 M-7 -11 L-7 15 M5 -11 L5 15',null,C.blue,2);}
  if(k===6){lotus(c,0,21,.5);line(c,[[-17,20],[17,20]],C.ink,1);}
  c.restore();}
function border(c,y){line(c,[[-389,y],[1389,y]],C.ink,2);line(c,[[-389,y+24],[1389,y+24]],C.ink,2);for(let x=-389;x<1389;x+=28){rect(c,x+2,y+3,23,18,[C.blue,C.pale,C.red,C.pale][(Math.floor((x+389)/28))%4]);line(c,[[x,y],[x,y+24]],C.ink,1);} }
function attendant(c,x,y,flip=1,s=1,offering=false){c.save();c.translate(x,y);c.scale(s*flip,s);const skin=C.red;
  // Profile head, frontal shoulder, strictly flat feet and pleated linen.
  path(c,'M-10 -165 Q-18 -184 -6 -193 Q10 -198 17 -183 L25 -177 L16 -172 L13 -159 L2 -156 L0 -147 L-14 -147Z',skin,C.ink,1.5);
  path(c,'M-13 -193 Q8 -205 17 -187 L10 -184 L8 -168 L-11 -165 L-20 -172Z',C.ink);ellipse(c,11,-182,3,1.5,C.pale);ellipse(c,12,-182,1.1,1.1,C.ink);
  path(c,'M-11 -148 L15 -148 L22 -105 L-20 -103Z',skin,C.ink,1.5);path(c,'M-21 -106 L23 -106 L35 -48 L-24 -48Z',C.pale,C.ink,1.5);
  for(let i=0;i<7;i++)line(c,[[-15+i*5,-101],[-19+i*8,-51]],C.gold,1);
  path(c,'M-15 -47 L-13 -8 L-4 -5 L9 -3 L10 1 L-21 1 L-24 -47Z',skin,C.ink,1.5);path(c,'M19 -47 L25 -12 L43 -5 L46 0 L17 0 L8 -47Z',skin,C.ink,1.5);
  line(c,[[-11,-137],[-31,-108],[-43,-127]],skin,9);line(c,[[15,-139],[34,-121],[59,-126]],skin,9);line(c,[[52,-129],[66,-129]],C.ink,2);
  path(c,'M-15 -150 Q1 -132 18 -150 L17 -143 Q0 -124 -15 -143Z',C.blue,C.ink,1);line(c,[[-20,-105],[23,-105]],C.blue,5);
  if(offering){line(c,[[39,-135],[79,-135]],C.ink,2);ellipse(c,59,-140,15,5,C.gold,C.ink,1);lotus(c,59,-143,.4);}else{line(c,[[59,-128],[59,-210]],C.ink,2);lotus(c,59,-207,.6);}
  c.restore();}
function wingedDisk(c,x,y){c.save();c.translate(x,y);for(const dir of [-1,1]){c.save();c.scale(dir,1);path(c,'M14 -8 Q90 -31 185 -5 Q119 19 24 15Z',C.blue,C.ink,1.8);for(let j=0;j<17;j++){const a=29+j*9;line(c,[[a,-9-Math.sin(j/17*Math.PI)*10],[a-13,13]],j%3===0?C.pale:C.gold,2);}path(c,'M12 8 Q57 28 117 19 Q61 45 15 21Z',C.red,C.ink,1);c.restore();}ellipse(c,0,0,27,27,C.red,C.ink,2);ellipse(c,0,0,19,19,null,C.gold,1.5);path(c,'M-14 27 Q-29 48 -18 54 M14 27 Q29 48 18 54',null,C.ink,2);c.restore();}
function wall(c,gallery=false){rect(c,-389,0,1778,1000,C.stone);const r=rng(7226);
  // Lime plaster, deliberately matte: no shadows, gradients, or camera depth.
  for(let i=0;i<12000;i++){c.globalAlpha=.035+r()*.09;rect(c,r()*1778-389,r()*1000,.4+r()*3,.5+r()*1.5,r()>.4?'#6c5e40':'#fff3d3');}c.globalAlpha=1;
  c.save();c.globalAlpha=.10;for(let x=-365;x<1389;x+=48)line(c,[[x,250],[x,807]],C.red,.8);for(let y=278;y<805;y+=48)line(c,[[-365,y],[1389,y]],C.red,.8);c.restore();
  border(c,27);border(c,199);border(c,832);border(c,963);
  if(!gallery){text(c,'埃及壁画',-277,125,45,C.ink,{weight:600});text(c,'Egyptian Wall Painting',-275,168,27,C.blue);text(c,'约前1300',1285,122,34,C.ink,{align:'right'});text(c,'矿物颜料 · 石灰壁面',1284,165,20,C.red,{align:'right'});}
  // The title has its own cartouche, rather than treating pseudo-glyphs as a translation.
  c.beginPath();c.roundRect(330,78,340,84,40);c.fillStyle=C.pale;c.fill();c.lineWidth=3;c.strokeStyle=C.ink;c.stroke();c.beginPath();c.roundRect(338,86,324,68,33);c.lineWidth=1;c.stroke();line(c,[[353,167],[647,167]],C.ink,4);text(c,'鹈鹕测试',500,137,40,C.ink,{align:'center',weight:600});
  for(let i=0;i<31;i++)sign(c,-350+i*57,267,i,.85);line(c,[[-389,314],[1389,314]],C.ink,2);line(c,[[-389,324],[1389,324]],C.red,4);
  wingedDisk(c,500,367);
  // Papyrus columns frame the broad main register; lateral art survives both crops.
  for(const x of gallery?[53,947]:[-265,1265]){rect(c,x-18,436,36,367,C.gold,C.ink,2);for(let j=-1;j<=1;j++)line(c,[[x+j*10,439],[x+j*10,801]],C.red,1);path(c,`M${x-28} 433 L${x-42} 393 Q${x} 409 ${x+42} 393 L${x+28} 433Z`,C.blue,C.ink,2);for(let j=-3;j<=3;j++)line(c,[[x+j*7,430],[x+j*11,397]],C.gold,1.4);rect(c,x-28,793,56,11,C.ink);}
  attendant(c,gallery?150:65,790,1,1.08,true);attendant(c,gallery?842:1010,790,-1,1.08,false);
  if(gallery){
    // Short vertical inscriptions counterweight the central winged disk. Signs
    // are original decoration; the cartouche alone contains readable text.
    for(const x of [220,780]){line(c,[[x-25,387],[x-25,501],[x+25,501]],C.red,1);for(let j=0;j<3;j++)sign(c,x,408+j*35,j+(x===220?1:4),.7);}
    for(const [x,n] of [[98,2],[188,5],[812,1],[902,4]])sign(c,x,120,n,1.1);
    // A quiet drafting fragment retains the red proportional grid and makes
    // its purpose legible without filling the principal figure's reserved bay.
    c.save();c.globalAlpha=.24;path(c,'M715 739 L715 658 L725 644 L737 648 L744 661 L735 666 L735 687 L749 713 L743 739 M717 683 L701 704 L706 723 M720 739 L716 780 M737 739 L750 780',null,C.red,1.2);c.restore();
  }
  // Small scale secondary procession: marsh birds, grain and attendants in a register.
  for(let j=0;j<12;j++){let x=-280+j*145;if(j%3===1){attendant(c,x,955,1,.42,j%2===0);}else if(j%3===2){for(let k=0;k<3;k++){path(c,`M${x+k*13-22} 949 Q${x+k*13-30} 927 ${x+k*13-15} 923 L${x+k*13-7} 949Z`,C.red,C.ink,1);}line(c,[[x-29,952],[x+28,952]],C.ink,1.5);}else{path(c,`M${x-23} 926 Q${x-8} 901 ${x+12} 926 Q${x+27} 917 ${x+30} 910 L${x+39} 912 L${x+30} 917 Q${x+31} 939 ${x-13} 939Z`,C.blue,C.ink,1);line(c,[[x-9,939],[x-9,953],[x+2,953]],C.ink,1);}}
  for(const x of [-140,-95,1110,1157])lotus(c,x,804,1.15);
  // Chips and hand ruled register edges are baked once, not regenerated each frame.
  for(let i=0;i<24;i++){const x=r()*1778-389,y=50+r()*900;c.globalAlpha=.19;path(c,`M${x} ${y} l${2+r()*7} ${r()*9} l${-8-r()*8} ${r()*11} l-5 -7Z`,'#eee2c4');}c.globalAlpha=.22;path(c,'M-180 54 l12 92 -8 31 18 25 M1137 327 l-5 43 10 22 -16 46 M-371 761 l71 -15 27 3',null,'#766744',1);c.globalAlpha=1;
}
function rider(c,at){const p=poseAt(at),k=C.ink;c.save();c.translate(500,805);c.lineJoin='round';c.lineCap='round';
  // Paired twelve-spoke wheels retain the shared rig contact points.
  for(const x of [-106,111]){ellipse(c,x,-62,62,62,C.stone,k,3);ellipse(c,x,-62,56,56,null,C.red,2);for(let j=0;j<12;j++){let a=p.wheelAngle+j*TAU/12;line(c,[[x,-62],[x+Math.cos(a)*55,-62+Math.sin(a)*55]],C.blue,1.6);}ellipse(c,x,-62,9,9,C.red,k,1.4);ellipse(c,x,-62,3,3,C.gold);}
  const q=[p.crank.x,p.crank.y];line(c,[[-106,-62],[-51,-150],q,[-106,-62]],k,6);line(c,[[-51,-150],[65,-150],[111,-62],q,[65,-150]],k,6);line(c,[[-106,-62],[-51,-150],q,[-106,-62]],C.blue,3);line(c,[[-51,-150],[65,-150],[111,-62],q,[65,-150]],C.red,3);line(c,[[65,-150],[64,-180],[89,-191],[99,-188]],k,4);line(c,[[-51,-150],[-54,-173],[-77,-173],[-39,-173]],k,5);ellipse(c,...q,19,19,C.gold,k,2);
  const leg=i=>{const f=p.feet[i],n=p.knees[i];line(c,[[p.hip.x,p.hip.y],[n.x,n.y],[f.x,f.y]],C.red,6);line(c,[[f.x-10,f.y],[f.x+13,f.y]],k,4);line(c,[q,[f.x,f.y]],k,2);};leg(1);
  c.save();c.translate(0,p.bob);
  path(c,'M-100 -199 C-141 -227 -114 -264 -67 -266 C-27 -270 -8 -248 12 -240 C5 -274 6 -307 30 -324 C45 -334 67 -329 78 -316 C86 -305 79 -289 64 -286 C45 -275 53 -249 56 -227 C50 -199 17 -179 -32 -182 C-56 -179 -73 -189 -100 -199Z',C.pale,k,2.8);
  path(c,'M-115 -205 L-149 -222 L-125 -218 L-143 -234 L-107 -219Z',C.blue,k,2);
  path(c,'M69 -315 L232 -303 Q205 -291 79 -295 L67 -299Z',C.gold,k,2);path(c,'M78 -295 Q155 -258 193 -297',C.red,k,1.8);line(c,[[84,-303],[213,-303]],C.red,1.2);
  // Broad blue flight feather field, bordered like a painted ceremonial mantle.
  path(c,'M-94 -241 Q-51 -269 3 -216 Q-39 -183 -97 -218Z',C.blue,k,2);
  for(let j=0;j<8;j++){let x=-88+j*11,y=-238+j*2.5;path(c,`M${x} ${y} q13 8 25 26 q-14 2 -19 -7Z`,j%2?C.gold:C.pale,k,.9);line(c,[[x+3,y+5],[x+19,y+21]],C.red,.8);}
  path(c,'M22 -284 Q40 -277 54 -286 L51 -268 Q34 -259 15 -268Z',C.blue,k,1.4);for(let j=0;j<6;j++)line(c,[[20+j*5,-279],[18+j*6,-270]],j%2?C.gold:C.red,2.5);
  // Frontal almond eye within a side profile: the scene's deliberate pictorial joke.
  path(c,'M49 -314 Q60 -325 72 -314 Q60 -304 49 -314Z',C.pale,k,1.8);ellipse(c,60,-314,3,5,k);line(c,[[70,-314],[82,-313]],k,1.8);path(c,'M51 -326 Q62 -331 73 -325',null,k,2);
  line(c,[[4,-222],[37,-188],[86,-191]],C.red,5);line(c,[[4,-222],[37,-188],[86,-191]],k,1.2);
  c.restore();leg(0);c.restore();}
// The road and every articulated part share this clock. Catch up by the exit,
// including normal outgoing velocity, so the following period inherits the rig.
function localClock(t){if(t<2)return t;if(t<=4)return 2;if(t>=6)return t;const u=(t-4)/2;return 2+10*u*u-6*u*u*u;}
export function renderSubject(c,t,scene){rider(c,scene.start+localClock(t));}
export default function renderAt(c,t,scene){cached(c,`egypt-wall-7226-v3:${scene.gallery?'gallery':'wide'}`,g=>wall(g,scene.gallery));const clock=scene.start+localClock(t);road(c,clock,{y:805,color:C.ink,width:2.5});if(scene.subject!==false)renderSubject(c,t,scene);}
