import {cached,rng,path,line,ellipse,rect,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
const K='#342f26',R='#a3432e',P='#e1cfa5';
// These are original pictorial compounds, not transcriptions or translations.
function glyph(c,x,y,n,s=1){c.save();c.translate(x,y);c.scale(s,s);const v=n%5;
 path(c,'M-32-22 Q-38-35-22-39 L16-39 Q36-37 34-19 L34 18 Q30 34 10 33 L-21 31 Q-36 29-34 11Z',P,K,2.6);
 if(v===0){path(c,'M-23-14 Q-9-30 9-18 L22-4 L7 3 L20 18 L-13 20 L-23 9Z',R,K,2);ellipse(c,2,-11,6,6,P,K,2);path(c,'M-18 4 h17 l-4 10 h-12 M15-24 l10-2',null,K,2);}
 if(v===1){path(c,'M-23-22 L20-23 L25-8 L13-1 L22 16 L-19 20 L-22 6 L-8-3Z',null,K,3);for(let j=0;j<3;j++)ellipse(c,-12+j*12,-14,3,4,R);line(c,[[-13,9],[9,9]],K,4);}
 if(v===2){ellipse(c,-5,-6,18,21,R,K,2.5);ellipse(c,-7,-10,7,7,P,K,2);path(c,'M9-4 L27 3 L10 12 M-21 21 h43 M-18 27 h35',null,K,3);}
 if(v===3){for(let j=0;j<3;j++)path(c,`M-24 ${-22+j*16} q12-13 24 0 t23 0`,null,j===1?R:K,4);ellipse(c,22,-25,3,3,K);}
 if(v===4){path(c,'M-24 19 V-16 L-8-27 L15-23 L24-5 L11 1 L17 18Z',R,K,2);ellipse(c,3,-11,4,4,P);path(c,'M-17-6 h11 v15 h-11 M-17 24 h37 M-17 29 h37',null,K,2);}
 c.restore();}
function number(c,n,x,y){const bars=Math.floor(n/5),dots=n%5;for(let j=0;j<bars;j++)path(c,`M${x-46} ${y-j*18} q45-5 92 0 l-2 12 q-43 3-89 0Z`,K);for(let j=0;j<dots;j++)ellipse(c,x+(j-(dots-1)/2)*25,y-bars*18-17,8,8,K);if(n===0){path(c,`M${x-38} ${y-9} Q${x-36} ${y-36} ${x} ${y-37} Q${x+38} ${y-35} ${x+39} ${y-11} Q${x} ${y+9} ${x-38} ${y-9}Z`,null,K,3.5);for(let j=-2;j<=2;j++)path(c,`M${x+j*12} ${y-8} q${-j*2} -17 ${-j*6} -25`,null,K,2);}}
function rider(c,t){const p=poseAt(t);c.save();c.translate(500,805);const ink='#423d2b',red='#a2482e',cream='#dfc893';for(const x of [-106,111]){ellipse(c,x,-62,63,63,red,ink,3);ellipse(c,x,-62,47,47,cream,ink,2);for(let j=0;j<8;j++){let a=p.wheelAngle+j*TAU/8;line(c,[[x,-62],[x+Math.cos(a)*44,-62+Math.sin(a)*44]],ink,3);}}
line(c,[[-106,-62],[-51,-150],[65,-150],[111,-62],[-8,-71],[-106,-62]],red,8);line(c,[[-51,-150],[-8,-71],[65,-150],[65,-183],[92,-190]],ink,3);line(c,[[-72,-174],[-38,-174]],ink,7);
p.feet.forEach((f,i)=>{const k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],ink,6);line(c,[[f.x-10,f.y],[f.x+12,f.y]],red,7);line(c,[[-8,-71],[f.x,f.y]],ink,3);});
path(c,'M-136 -226 L-93 -250 Q-38 -276 14 -238 L16 -293 Q13 -333 55 -337 L81 -320 L75 -303 L62 -291 L61 -226 L30 -195 L-45 -184 L-93 -202Z',cream,ink,5);path(c,'M72 -319 L227 -306 L193 -285 L80 -296Z',red,ink,4);path(c,'M82 -296 Q135 -252 193 -285',cream,ink,3);path(c,'M-91 -239 Q-41 -256 5 -218 L-37 -205Z',red,ink,3);for(let j=0;j<5;j++)path(c,`M${-79+j*17} ${-233+j*2} l14 17 l-18 2`,null,ink,2);ellipse(c,57,-318,8,8,ink);ellipse(c,59,-320,2.7,2.7,cream);line(c,[[7,-217],[34,-186],[91,-190]],ink,6);c.restore();}
function page(c){
 const r=rng(7791);rect(c,-389,0,1778,1000,'#a89872');
 // The visible front leaf, two receding leaves and dark paper laminations.
 path(c,'M-40 67 L144 31 L157 963 L-28 933Z','#c2ad81',K,2);path(c,'M145 31 L851 48 L850 971 L157 963Z',P,K,2);path(c,'M851 48 L1039 13 L1025 934 L850 971Z','#cdb991',K,2);
 path(c,'M-28 933 L157 963 L850 971 L1025 934 L1025 944 L851 984 L155 977 L-28 946Z','#766044',K,2);
 for(const x of [145,851]){const g=c.createLinearGradient(x-12,0,x+19,0);g.addColorStop(0,'#fff8db00');g.addColorStop(.4,'#54432640');g.addColorStop(.58,'#fff5cd50');g.addColorStop(1,'#fff5cd00');rect(c,x-12,39,31,920,g);}
 for(let i=0;i<18000;i++){c.globalAlpha=.03+r()*.08;rect(c,r()*1100-40,r()*1000,.5+r()*3,.3+r()*1.4,i%3?'#674f30':'#fff9e2');}c.globalAlpha=1;
 // Irregular red rules, dense upper compounds and breathing space for the rider.
 for(const y of [87,310,858,935]){path(c,`M-15 ${y+8} L145 ${y} L849 ${y+6} L1008 ${y-13}`,null,R,5);path(c,`M-15 ${y+15} L145 ${y+8} L849 ${y+14} L1008 ${y-5}`,null,K,1.5);}
 for(let i=0;i<7;i++){glyph(c,205+i*94,151,i,.89);glyph(c,205+i*94,243,i+3,.81);}
 for(const [x,y,n,s] of [[58,143,4,.8],[64,241,2,.74],[66,365,1,.72],[920,133,3,.85],[930,237,1,.86],[930,358,4,.65]])glyph(c,x,y,n,s);
 // Lower earth band: alternating knotted forms and black teeth, not caption boxes.
 for(let i=0;i<12;i++){const x=180+i*56;path(c,`M${x-23} 887 q19-27 42 0 q-19 25-42 0Z`,i%3?P:R,K,2.5);path(c,`M${x-16} 886 q12-13 27 0 q-12 12-27 0`,null,K,2);path(c,`M${x-22} 942 l16 19 l14-18 l14 18 l15-17Z`,K);}
 // Ritual sky scroll, hooflike red corner ornaments, and three old red flecks.
 path(c,'M258 353 Q281 325 312 352 Q333 378 307 396 Q285 410 278 390 Q275 371 296 373 M269 374 L224 398 L255 407 L220 427 M304 398 L314 437 L331 420 L341 449',null,R,5);
 path(c,'M799 690 Q818 656 837 672 L825 699 L838 710 L820 735 L835 752 L814 780 L833 800',null,R,6);
 for(let j=0;j<80;j++){const x=r()*1000,y=r()*1000;c.globalAlpha=.15;path(c,`M${x} ${y} l${3+r()*10} 2 l-3 6 l-6-1Z`,'#bda77f');}c.globalAlpha=1;
}
function scribe(c,t){
 c.save();c.translate(436,506);c.scale(.92,.92);
 // Kneeling painter: stepped nose, eye scroll, ear spool, bead collar, folded legs.
 path(c,'M-46-99 L-19-124 L13-115 L26-89 L49-76 L27-66 L24-42 L-6-32 L-31-52Z',P,K,4);
 path(c,'M-45-105 L-61-145 L-34-151 L-34-183 L-10-150 L12-174 L23-137 L37-141 L27-108Z',R,K,3.5);
 for(let j=0;j<5;j++)line(c,[[-52+j*17,-145],[-35+j*12,-114]],K,2.5);
 ellipse(c,8,-87,8,6,K);ellipse(c,10,-89,3,2,P);ellipse(c,-28,-65,12,12,R,K,3);ellipse(c,-28,-65,5,5,P,K,2);
 path(c,'M-24-37 L15-38 L33 22 L4 47 L-49 29 L-59-6Z',R,K,4);path(c,'M-31-35 L24-27 L19-12 L-39-19Z',P,K,3);
 for(let j=0;j<6;j++)ellipse(c,-27+j*8,-24,3,4,K);
 path(c,'M-42 23 L-77 53 L-53 69 L4 58 L46 70 L63 57 L20 37Z',P,K,4);path(c,'M-55 37 L-36 48 L2 42 M-48 59 L-18 54',null,K,3);
 const flick=Math.max(0,1-(t%1)/.18)*8;
 line(c,[[12,-14],[64,-6],[105,-47-flick]],K,11);line(c,[[105,-47-flick],[145,-88]],K,3);path(c,'M-54 3 L-83 19 L-101-8',null,K,9);ellipse(c,-103,-13,18,9,R,K,3);
 c.restore();
}
export const mayaCount=t=>Math.max(0,Math.min(6,Math.floor(t+1e-9)));
export function renderSubject(c,t,scene){rider(c,scene.start+t);}
export function galleryPose(t){const q=Math.max(0,Math.min(6,t)),u=Math.min(1,Math.min(q,6-q)/.65),edge=u*u*(3-2*u);return {x:1070*q/6,y:805,scale:1-.2*edge,angle:0,poseTime:41+t};}
export function renderGallery(c,t,scene){
 cached(c,'maya-accordion-v3',page);scribe(c,t);number(c,mayaCount(t),701,430);
 if(scene.subject!==false){const p=galleryPose(t);c.save();c.translate(p.x,p.y);c.scale(p.scale,p.scale);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();}
 // Fine bark losses cover all pigment. They are fixed, not temporal noise.
 cached(c,'maya-bark-loss-v3',g=>{const r=rng(7792);for(let i=0;i<4500;i++){g.globalAlpha=.12+r()*.2;const x=r()*1000,y=r()*1000;line(g,[[x,y],[x+1+r()*5,y-.5]],P,.5+r());}g.globalAlpha=1;});
}
export default function renderAt(c,t,scene){renderGallery(c,t,scene);}
