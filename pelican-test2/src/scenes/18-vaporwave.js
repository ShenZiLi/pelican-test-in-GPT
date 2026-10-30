import {makeSurface,poly,stroke,ellipse,path,rng} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
const C={dark:'#282346',purple:'#635a9b',pink:'#d398c7',rose:'#f0b6cd',cyan:'#80d8d1',stone:'#faf1e6',blue:'#5584a8',shadow:'#be719e'};
export const frameColor=C.cyan;
export const fontText='蒸汽波年代';
export function visualTime(t){return t>=109&&t<110?109+((t-109)%.25):t;}
function neon(c,pts,color,width=1){c.save();c.shadowColor=color;c.shadowBlur=9;stroke(c,pts,color,width,.7);c.shadowBlur=0;stroke(c,pts,C.stone,width*.27,.9);c.restore();}
function palm(c,x,y,s,t){
 c.save();c.translate(x,y);c.scale(s,s);const bend=Math.sin(t*2.6+x)*8;
 poly(c,[[-9,0],[11,0],[3+bend,-189],[-8+bend,-193]],'#ab8aa5');poly(c,[[2,0],[11,0],[3+bend,-189],[-2+bend,-192]],C.dark);
 for(let i=0;i<10;i++)stroke(c,[[-8+i*.9,-i*18],[8+i*.1,-i*18-5]],C.rose,1,.6);
 const root=[bend,-193];
 for(let i=0;i<8;i++){const a=-Math.PI+.37+i*.35,xx=Math.cos(a)*110,yy=Math.sin(a)*75;poly(c,[root,[bend+xx*.68,-193+yy-10],[bend+xx,-193+yy+26],[bend+xx*.65,-193+yy+10]],i%2?C.cyan:C.blue);poly(c,[root,[bend+xx,-193+yy+26],[bend+xx*.7,-193+yy+17]],i%2?'#b5d0c6':'#737aab');}
 c.restore();
}
function bust(c,x,y,s){
 c.save();c.translate(x,y);c.scale(s,s);
 poly(c,[[-61,80],[70,80],[57,11],[-48,11]],'#cdc1cc');poly(c,[[40,80],[70,80],[57,11],[36,11]],'#a695b7');stroke(c,[[-61,80],[70,80]],C.stone,4);
 poly(c,[[-80,4],[-72,-23],[-34,-43],[-17,-77],[29,-77],[41,-43],[75,-22],[85,4]],C.stone);
 poly(c,[[0,4],[85,4],[75,-22],[41,-43],[27,-70],[12,-53]],'#b9a7bf');
 poly(c,[[-31,-69],[-33,-105],[25,-109],[31,-59],[5,-38]],'#dfd6d6');
 poly(c,[[-42,-166],[-30,-199],[-7,-214],[23,-209],[45,-185],[46,-145],[30,-111],[4,-98],[-24,-110],[-39,-136]],C.stone,C.shadow,1);
 poly(c,[[15,-197],[45,-185],[46,-145],[30,-111],[4,-98],[9,-128],[25,-151]],'#c6bad0');
 poly(c,[[-42,-166],[-30,-199],[-7,-214],[23,-209],[36,-196],[-1,-192],[-25,-170]],'#d7ccd5');
 poly(c,[[-31,-168],[-17,-180],[-6,-168],[-20,-161]],'#b4a7be');poly(c,[[12,-170],[29,-181],[36,-168],[22,-161]],'#a99cb5');
 stroke(c,[[-27,-166],[-13,-167]],'#7f7a94',1.4);stroke(c,[[17,-165],[31,-167]],'#7f7a94',1.4);
 poly(c,[[4,-170],[-3,-140],[13,-137]],'#d0b9c7');stroke(c,[[-10,-123],[7,-126],[22,-125]],'#ac91ac',1.8);stroke(c,[[-3,-120],[13,-121]],'#fff9ec',2);
 // Authored stepped hair, with marble veins rather than a sampled sculpture texture.
 for(let i=0;i<5;i++)stroke(c,[[-34+i*11,-187-i%2*7],[-20+i*10,-199],[4+i*7,-197]],i%2?'#eee3e1':'#b9adbf',2.4);
 for(const pts of [[[-36,-144],[-26,-136],[-30,-129],[-16,-116]],[[33,-190],[27,-180],[34,-174]],[[15,-60],[30,-36],[24,-24],[46,-2]],[[-44,-21],[-23,-10],[-28,2]]])stroke(c,pts,'#b89db7',.9,.7);
 c.restore();
}
export function createAssets(){
 const{canvas,ctx:c}=makeSurface();const bg=c.createLinearGradient(0,215,0,705);bg.addColorStop(0,C.dark);bg.addColorStop(.48,'#7d659f');bg.addColorStop(1,C.pink);c.fillStyle=bg;c.fillRect(0,0,1000,1000);
 // Rectangular sunset, each band deliberately cut to a different lateral extent.
 for(let i=0;i<13;i++){const yy=321+i*12;c.fillStyle=i%2?'#efaebc':'#efc0c8';c.fillRect(385+(i>7?(i-7)*3:0),yy,222-(i>7?(i-7)*6:0),i<6?13:8);}
 poly(c,[[0,588],[190,588],[190,576],[277,576],[277,601],[366,601],[366,589],[467,589],[467,614],[620,614],[620,580],[753,580],[753,596],[890,596],[890,571],[1000,571],[1000,700],[0,700]],'#595980');
 c.fillStyle='#8e90b0';c.fillRect(0,625,1000,75);stroke(c,[[0,625],[1000,625]],C.cyan,2);
 const random=rng(18107);for(let i=0;i<180;i++){const x=random()*1000,y=635+random()*50;stroke(c,[[x,y],[x+8+random()*28,y]],i%2?C.rose:C.cyan,.6,.35);}
 // Chrome colonnade and checkered plinth set an original garden composition.
 for(const x of [263,844]){poly(c,[[x-12,700],[x+14,700],[x+9,485],[x-7,485]],'#a8a7bd');poly(c,[[x+5,700],[x+14,700],[x+9,485],[x+2,485]],'#7d7399');stroke(c,[[x-6,496],[x-8,684]],C.cyan,2);c.fillStyle=C.rose;c.fillRect(x-19,478,39,10);}
 bust(c,725,617,1.05);
 return Object.freeze({garden:canvas});
}
export function drawBackground(c,{t,assets}){
 c.drawImage(assets.garden,0,0);const vt=visualTime(t);palm(c,115,695,1.25,vt);palm(c,936,700,1.38,vt);palm(c,320,656,.56,vt);
 // This travelling light repeats109–110 while the road and cyclist keep world time.
 const yy=519+Math.sin(vt*5)*8;neon(c,[[0,yy],[190,yy+6],[278,yy-5]],C.cyan,1.2);neon(c,[[827,yy-16],[1000,yy-14]],C.rose,1.4);
}
export function drawRoad(c,{t}){
 c.fillStyle='#373355';c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],C.cyan,2);
 for(let i=0;i<13;i++){const x=-300+i*140;stroke(c,[[500+(x-500)*.13,700],[x,1000]],C.pink,.8,.7);}
 // Draw forward-only roadway by absolute t, independently from the repeat clock.
 for(let i=0;i<9;i++){const k=(i+((t-107)*.5)%1)/9,y=700+k*k*310;stroke(c,[[0,y],[1000,y]],C.cyan,.7,.55);}
}
export function drawRider(c,t){
 const p=poseAt(t);c.lineCap='round';c.lineJoin='round';
 for(const x of [0,180]){ellipse(c,x,0,44,44,'rgba(99,90,155,.42)',C.dark,8);ellipse(c,x,0,41,41,null,C.cyan,2);ellipse(c,x,0,36,36,null,C.pink,1.5);for(let i=0;i<10;i++){const a=p.wheelAngle+i*Math.PI/5;stroke(c,[[x,0],[x+Math.cos(a)*35,Math.sin(a)*35]],i%2?C.rose:C.cyan,.8,.8);}ellipse(c,x,0,5,5,C.stone,C.dark,1.5);}
 const chrome=(pts,w=5)=>{stroke(c,pts,C.dark,w+3);stroke(c,pts,C.blue,w);stroke(c,pts,C.cyan,1.4);};
 chrome([[p.hip.x,p.hip.y],[p.kneeRight.x,p.kneeRight.y],[p.ankleRight.x,p.ankleRight.y]],3);
 chrome([[0,0],[54,-73],[80,-22],[0,0],[80,-22],[128,-73],[54,-73],[80,-22],[180,0],[128,-73],[141,-103],[159,-103]],5);
 chrome([[54,-73],[58,-99]],4);stroke(c,[[37,-103],[76,-103]],C.dark,7);stroke(c,[[38,-105],[74,-105]],C.rose,2);
 ellipse(c,80,-22,12,12,C.pink,C.dark,1.5);chrome([[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],3);
 poly(c,[[28,-143],[-12,-156],[3,-130],[35,-116]],C.pink,C.dark,1.3);
 path(c,q=>{q.moveTo(24,-147);q.bezierCurveTo(43,-169,78,-165,95,-148);q.quadraticCurveTo(112,-126,88,-108);q.quadraticCurveTo(49,-89,26,-117);q.closePath();},C.stone,C.dark,1.4);
 poly(c,[[26,-132],[54,-113],[85,-112],[62,-103],[37,-109]],C.shadow);
 poly(c,[[71,-144],[70,-171],[90,-211],[105,-226],[119,-218],[121,-203],[106,-185],[105,-143]],C.stone,C.dark,1.5);
 poly(c,[[80,-144],[83,-181],[101,-215],[109,-217],[97,-179],[98,-146]],C.cyan);
 poly(c,[[120,-214],[222,-207],[174,-197],[122,-200]],C.rose,C.dark,1.3);poly(c,[[121,-201],[172,-197],[146,-180],[129,-187]],C.pink,C.dark,.9);stroke(c,[[128,-208],[210,-207]],C.stone,1.1);
 ellipse(c,110,-215,3.2,3.2,C.dark);ellipse(c,111,-216,1,1,C.stone);
 const featherCols=[C.rose,'#e2d1e0',C.cyan,'#a0becb'];for(let i=0;i<5;i++){poly(c,[[36+i*8,-147],[56+i*9,-145],[94+i*5,-122],[79+i*3,-113]],featherCols[i%4],C.dark,.8);}
 poly(c,[[76,-148],[92,-144],[146,-110],[155,-107],[148,-102],[90,-128]],'#adb7d4',C.dark,1);stroke(c,[[91,-140],[147,-107]],C.cyan,1.8);
 chrome([[p.hip.x,p.hip.y],[p.kneeLeft.x,p.kneeLeft.y],[p.ankleLeft.x,p.ankleLeft.y]],3);
 for(const a of [p.ankleLeft,p.ankleRight])poly(c,[[a.x-5,a.y-3],[a.x+12,a.y-2],[a.x+17,a.y+3],[a.x-4,a.y+4]],C.rose,C.dark,1);
}
export function drawTitle(c,{scene}){
 c.save();const field=c.createLinearGradient(0,0,730,0);field.addColorStop(0,'rgba(40,35,70,.97)');field.addColorStop(.65,'rgba(40,35,70,.92)');field.addColorStop(1,'rgba(40,35,70,0)');c.fillStyle=field;c.fillRect(0,58,730,158);const eraField=c.createLinearGradient(1480,0,1920,0);eraField.addColorStop(0,'rgba(40,35,70,0)');eraField.addColorStop(.55,'rgba(40,35,70,.9)');eraField.addColorStop(1,'rgba(40,35,70,.97)');c.fillStyle=eraField;c.fillRect(1480,67,440,91);text(c,'蒸汽波',94,124,48,C.rose,{bold:true});text(c,'V A P O R W A V E',96,168,29,C.cyan,{family:'Georgia'});text(c,scene?.era||'2010年代',1809,124,27,C.rose,{align:'right'});stroke(c,[[98,188],[378,188]],C.rose,1.2);c.restore();
}
