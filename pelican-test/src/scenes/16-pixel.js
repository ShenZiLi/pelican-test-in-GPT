import {poseAt} from '../rig/pose.js';
import {TAU} from '../kit/draw.js';
import {smooth} from '../beat/timeline.js';
const PX=320/1778,RADIUS=62*PX;
export const pixelTravel=t=>105*PX*t+TAU*RADIUS*smooth((t-1)/3);
export const pixelWheelAngle=t=>poseAt(95+t).wheelAngle+TAU*smooth((t-1)/3);
const P={night:'#182b4b',blue:'#335c75',cyan:'#71b9b2',green:'#6d9461',cream:'#dfd7aa',ochre:'#be9857',gold:'#e2c15e',ink:'#263d47'};
let buffer,subjectBuffer;
function box(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function pixline(c,x0,y0,x1,y1,color){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,err=dx+dy;for(let n=0;n<1000;n++){box(c,x0,y0,1,1,color);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx;}if(e<=dx){err+=dx;y0+=sy;}}}
function ring(c,x,y,r,color){for(let i=0;i<96;i++)box(c,x+Math.cos(i*TAU/96)*r,y+Math.sin(i*TAU/96)*r,1,1,color);}
function sprite(c,t,jump){const p=poseAt(t),spin=pixelWheelAngle(t-95),x=160,y=145-jump,s=PX;for(const wx of [-106,111]){const xx=x+wx*s,yy=y-62*s;ring(c,xx,yy,RADIUS,P.cream);ring(c,xx,yy,RADIUS-1,P.ochre);for(let k=0;k<4;k++){const a=spin+k*TAU/4;pixline(c,xx,yy,xx+Math.cos(a)*(RADIUS-1),yy+Math.sin(a)*(RADIUS-1),P.ochre);}}
const l=pts=>{for(let k=0;k<pts.length-1;k++)pixline(c,x+pts[k][0]*s,y+pts[k][1]*s,x+pts[k+1][0]*s,y+pts[k+1][1]*s,P.cyan);};l([[-106,-62],[-51,-150],[-8,-71],[-106,-62]]);l([[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150],[65,-181],[91,-190]]);l([[-75,-174],[-39,-174]]);for(let i=0;i<2;i++){const k=p.knees[i],f=p.feet[i];l([[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]]);pixline(c,x+f.x*s-2,y+f.y*s,x+f.x*s+2,y+f.y*s,P.gold);}
// Original stepped sprite: a long-billed water bird, with visible throat pouch.
box(c,x-21,y-46,19,9,P.cream);box(c,x-24,y-44,5,5,P.cream);box(c,x-18,y-49,13,4,P.cream);box(c,x-5,y-48,11,8,P.cream);box(c,x+2,y-59,6,17,P.cream);box(c,x+5,y-61,10,8,P.cream);box(c,x+13,y-58,27,2,P.gold);box(c,x+15,y-56,22,2,P.ochre);box(c,x+15,y-54,14,3,P.ochre);box(c,x+16,y-51,10,2,P.cream);box(c,x+11,y-59,1,1,P.ink);box(c,x-20,y-43,10,3,P.ochre);box(c,x-15,y-40,12,1,P.ochre);box(c,x-27,y-43,5,2,P.cream);l([[2,-222],[37,-188],[86,-191]]);}
export default function renderAt(c,t,scene){if(!buffer){buffer=document.createElement('canvas');buffer.width=320;buffer.height=180;}const g=buffer.getContext('2d');const qt=Math.floor((scene.start+t)*12)/12,local=qt-scene.start;box(g,0,0,320,180,P.night);for(let i=0;i<35;i++)box(g,(i*73)%320,37+(i*17)%44,i%4===0?2:1,1,P.cream);for(let i=-1;i<7;i++){const xx=i*70-((t*6)%70);g.fillStyle=P.blue;g.beginPath();g.moveTo(xx,118);g.lineTo(xx+31,68+(i%2)*10);g.lineTo(xx+79,118);g.fill();}for(let i=-1;i<14;i++){const xx=i*28-((t*16)%28);box(g,xx,111,23,34,P.green);box(g,xx+3,106,17,6,P.green);box(g,xx+6,123,2,22,P.ink);}
box(g,0,145,320,35,P.ochre);for(let i=-4;i<25;i++){const xx=i*17-((scene.start*105*PX+pixelTravel(local))%17);box(g,xx,150,15,8,'#aa804a');box(g,xx+3,161,15,8,'#aa804a');box(g,xx,172,15,8,'#aa804a');}box(g,0,144,320,3,P.cream);
const coinX=scene.gallery?192:207,pit=(scene.gallery?150.25:160)+pixelTravel(2.5)-pixelTravel(local);box(g,pit-9,144,18,36,P.night);
if(local<2.5){const width=2+Math.abs(Math.cos(qt*8))*3;box(g,coinX-width,58,width*2,9,P.gold);box(g,coinX-width+1,59,width*2-2,7,P.ochre);}else if(local<4){g.fillStyle=P.cream;g.font='bold 8px monospace';g.textAlign='center';g.fillText('1UP',coinX-8,49-(local-2.5)*9);for(let k=0;k<8;k++){let a=k*TAU/8;box(g,coinX+Math.cos(a)*(local-2.5)*14,62+Math.sin(a)*(local-2.5)*14,1,1,P.gold);}}
g.fillStyle=P.cream;g.textAlign='left';g.font='8px "Noto Serif SC"';g.fillText('八位游戏',18,17);g.font='5px monospace';g.fillText('8-bit Game / 1980s',18,26);g.font='bold 7px monospace';g.fillText('PELIRIDE',87,17);g.fillText('SCORE '+String(500+(local>=2.5?100:0)).padStart(4,'0'),166,17);g.font='6px monospace';g.fillText('LIFE 03',87,28);c.save();c.imageSmoothingEnabled=false;c.drawImage(buffer,-389,0,1778,1000);c.restore();if(scene.subject!==false)renderSubject(c,t,scene);}

// Independent transparent low-resolution plane; never shares the opaque world buffer.
export function renderSubject(c,t,scene){
  if(!subjectBuffer){subjectBuffer=document.createElement('canvas');subjectBuffer.width=320;subjectBuffer.height=180;}
  const g=subjectBuffer.getContext('2d');g.clearRect(0,0,320,180);
  const qt=Math.floor((scene.start+t)*12)/12,local=qt-scene.start;
  const jump=local>=1.9&&local<3.1?Math.sin((local-1.9)/1.2*Math.PI)*30:0;
  sprite(g,qt,jump);
  c.save();c.imageSmoothingEnabled=false;c.drawImage(subjectBuffer,-389,0,1778,1000);c.restore();
}
