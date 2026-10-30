import * as kit from '../kit/index.js';
import {rig} from '../rig/index.js';
import {PLATE_WIDTH,PLATE_HEIGHT,PLATE_SCALE,SOURCE_LEFT,ANCHOR,TOP,plateLeft,visiblePlates} from './travel.js';
import {catalog} from '../scenes/catalog.js';
import {locate,clamp,smooth} from '../beat/index.js';
const {W,H,text,ellipse,path,paper,grain,roundRect}=kit;
const scenes=await Promise.all(catalog.map(async m=>{try{return await import(`../scenes/${String(m.id).padStart(2,'0')}.js`)}catch(e){console.warn(`Scene ${m.id} unavailable`,e.message);return null}}));
const thumbs=[];
export function renderScene(c,i,u,t,labels=true,travelX=null){const m=catalog[i];c.save();c.fillStyle=m.bg;c.fillRect(0,0,W,H);if(scenes[i]?.draw)scenes[i].draw(c,u,{t,W,H,riderX:travelX===null?850:(travelX-c.getTransform().e)/c.getTransform().a,travelX:travelX===null?null:(travelX-c.getTransform().e)/c.getTransform().a,roadY:780,rig:travelX===null?rig:(target,x,y,size,clock,style)=>{if(target===c){const m=target.getTransform();x=(travelX-m.c*y-m.e)/m.a;}rig(target,x,y,size,clock,style)},kit});else{kit.road(c,u,{color:m.fg,fill:m.bg});rig(c,850,780,1,t,{ink:m.fg,body:m.bg,paper:m.bg});text(c,'风格研究 / '+String(i+1).padStart(2,'0'),W-90,890,23,m.fg,'right')}
 if([2,3,4,5,8].includes(i))kit.inkSurface(c,i+1);
 if(labels)title(c,m,u);c.restore();}
function title(c,m,u){c.save();c.globalAlpha=smooth(u/.5)*smooth((6-u)/.3);let x=78,y=65;if(m.id===19){x=655;y=65}const dark=[3,10,11,12,13,14,15,16,18,19,20].includes(m.id);const fg=[10,11,13,14].includes(m.id)?'#f5e8c8':dark?m.fg:'#263932';if(m.id>=15){roundRect(c,x-10,y-12,m.id===19?470:620,145,2,dark?'#09171ced':'#e5e9e9ed');}else{const shade=c.createLinearGradient(x-20,0,x+600,0);shade.addColorStop(0,dark?'#102021e0':'#eee4cebf');shade.addColorStop(1,dark?'#10202100':'#eee4ce00');c.fillStyle=shade;c.fillRect(x-20,y-22,640,174);c.shadowColor=dark?'#071619':'#f0e5c9';c.shadowBlur=3;}text(c,m.name,x,y+42,42,fg);text(c,m.en,x,y+82,m.id===19?17:21,fg,'left',m.id===16?'sans':'serif');text(c,m.era,x,y+115,22,fg);c.shadowBlur=0;path(c,[[x,y+133],[x+(m.id===19?390:460),y+133]],fg,1);if([2,7,8].includes(m.id)){c.strokeStyle=fg;c.lineWidth=1;c.strokeRect(x-16,y-15,550,163);}c.restore()}
function intro(c,t){paper(c,7,'#e8dfcb',.16);c.strokeStyle='#847b5c';c.lineWidth=1;c.strokeRect(52,52,W-104,H-104);text(c,'THE PELICAN PAPERS',90,110,19,'#7e785b','left','sans');text(c,'VOL. I     /     AN IMPROBABLE HISTORY',W-90,110,16,'#7e785b','right','sans');
 c.save();const q=smooth((t-4)/.58);c.translate(1260-410*q,580+200*q);c.rotate(-.04*(1-q));c.globalAlpha=.6+.4*q;rig(c,0,0,.82+.18*q,t<4?0:t,{mode:'line',ink:'#4c5145',bike:'#4c5145',lineWidth:2});c.restore();text(c,'图一  鹈鹕骑行图（摹本）',1290,660,24,'#696c59','center');
 c.save();c.globalAlpha=smooth((t-.35)/.7);text(c,'人类自古以来就痴迷于',115,370,52,'#293d34');text(c,'画鹈鹕骑自行车。',115,448,64,'#293d34');c.restore();c.save();c.globalAlpha=smooth((t-3)/.18);text(c,'——早在自行车被发明之前。',115,560,37,'#8f533a');c.restore();text(c,'——《鹈鹕骑行艺术通史》，卷一（虚构书名）',115,810,24,'#78775f');text(c,'一项不必要、但十分严肃的研究',115,862,20,'#8a876f');
 if(t>4){c.save();c.globalAlpha=smooth(t-4);path(c,[[0,780],[W,780]],'#6f785d',2);c.restore()}}
function press(c,t){c.fillStyle='#1e3538';c.fillRect(0,0,W,H);for(let i=0;i<9;i++){c.fillStyle=i%2?'#233e40':'#274344';c.fillRect(i*210,0,208,H)}text(c,'鹈鹕骑行艺术史',W/2,215,62,'#d7c691','center');text(c,'P R E S S   C O N F E R E N C E',W/2,275,25,'#a1b6a9','center','sans');ellipse(c,W/2,660,205,38,'#162526');roundRect(c,W/2-130,385,260,250,40,'#152329','#68716c',5);path(c,[[W/2-100,600],[W/2-120,785]],'#16272a',13);path(c,[[W/2+100,600],[W/2+120,785]],'#16272a',13);
 if(t>=11.5&&t<11.85){const q=(t-11.5)/.35;rig(c,-300+q*(W+700),710,.68,125+t,{body:'#e8dfc2',bike:'#bca46b'})}
 c.fillStyle='#b7a078';c.fillRect(155,640,W-310,40);c.fillStyle='#33484a';c.fillRect(172,680,W-344,230);for(let i=0;i<7;i++){const x=490+i*132;path(c,[[x,645],[x+16,570-i%2*18],[x+40,553-i%2*18]],'#151f22',6);ellipse(c,x+45,550-i%2*18,18,9,'#171f23');ellipse(c,x,647,32,6,'#172326')}
 roundRect(c,W/2-155,689,310,75,2,'#e9ddbb');text(c,'鹈鹕（本人）',W/2,739,37,'#334340','center');
 if(t>5&&t<8.2){let d=Math.min(...[5,5.5,6.5,7.5].map(a=>Math.abs(t-a)));if(d<.09){c.fillStyle=`rgba(255,255,240,${(1-d/.09)*.72})`;c.fillRect(0,0,W,H)}}}
function getThumb(i){if(!thumbs[i]){let b=document.createElement('canvas');b.width=480;b.height=270;let c=b.getContext('2d');c.scale(480/W,270/H);renderScene(c,i,i===19?5.1:3,(i===19?10.1:8)+i*6,false);thumbs[i]=b}return thumbs[i]}
function outro(c,u){paper(c,13,'#e7e1d0',.1);const left=W*.05,tw=221,th=125,gap=11,top=192;const tx=left+6*(tw+gap),ty=top+2*(th+gap);let q=smooth((u-4)/4),z=1+q*(W/(tw+20)-1),targetX=tx+tw/2,targetY=ty+th/2;
 c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-(W/2+(targetX-W/2)*q),-(H/2+(targetY-H/2)*q));
 for(let i=0;i<21;i++){let x=left+(i%7)*(tw+gap),y=top+Math.floor(i/7)*(th+gap);c.fillStyle='#8c7d5e';c.fillRect(x-5,y-5,tw+10,th+10);c.fillStyle='#fff3d9';c.fillRect(x-2,y-2,tw+4,th+4);c.save();c.beginPath();c.rect(x,y,tw,th);c.clip();c.translate(x,y);c.scale(tw/W,th/H);if(i<20)c.drawImage(getThumb(i),0,0,W,H);else press(c,u);c.restore()}
 c.restore();
 if(u<4.2){text(c,'二十个时代，同一个问题。',W/2,108,40,'#36463b','center');text(c,'截至目前，人类共提交了 20 份答卷。',W/2,790,40,'#36463b','center');text(c,'THE COMPLETE COLLECTION  /  20 + 1',W/2,854,18,'#83816a','center','sans')}
 if(u>=8){c.save();c.globalAlpha=smooth((u-8)/.5);roundRect(c,390,854,1000,85,2,'#12282bea');text(c,'鹈鹕本人对此尚未发表评论。',W/2,910,40,'#eee4c5','center');c.restore()}}
function travellingWall(c,t){
 paper(c,71,'#eeece5',.035);
 const root=c.getTransform(),screenAnchor=root.a*ANCHOR+root.e;
 const roadY=TOP+780*PLATE_SCALE;
 path(c,[[0,roadY],[W,roadY]],'#7e7867',2);
 // The gap has a neutral pencil rider. Adjacent plates paint over it, so a
 // single continuous pose takes on each plate's material exactly at its edge.
 rig(c,ANCHOR,roadY,PLATE_SCALE,t,{mode:'line',ink:'#777568',bike:'#777568',lineWidth:2});
 for(const i of visiblePlates(t)){
  const left=plateLeft(i,t),u=clamp(t-5-i*6,0,5.999);
  c.save();c.shadowColor='#25252245';c.shadowBlur=28;c.shadowOffsetY=18;c.fillStyle='#e4dfd2';c.fillRect(left,TOP,PLATE_WIDTH,PLATE_HEIGHT);c.restore();
  c.save();c.beginPath();c.rect(left,TOP,PLATE_WIDTH,PLATE_HEIGHT);c.clip();c.translate(left-SOURCE_LEFT*PLATE_SCALE,TOP);c.scale(PLATE_SCALE,PLATE_SCALE);
  renderScene(c,i,u,t,false,screenAnchor);c.restore();
  c.strokeStyle='#d8d2c3';c.lineWidth=1;c.strokeRect(left,TOP,PLATE_WIDTH,PLATE_HEIGHT);
  galleryCaption(c,catalog[i],left);
 }
}
function galleryCaption(c,m,left){
 c.save();c.beginPath();c.rect(left,TOP+PLATE_HEIGHT+12,PLATE_WIDTH,135);c.clip();
 const y=TOP+PLATE_HEIGHT;
 c.font='italic 52px Georgia, serif';c.fillStyle='#a33f37';c.textAlign='left';c.fillText(String(m.id).padStart(2,'0'),left,y+61);
 text(c,m.name,left+82,y+49,29,'#29333a');
 text(c,m.en,left+82,y+81,18,'#424b51','left','sans');
 text(c,m.era,left+82,y+111,21,'#827e72');c.restore();
}
export function drawFilm(c,t){
 t=clamp(t,0,137);c.save();c.clearRect(0,0,W,H);
 if(t<4.5)intro(c,t);
 else if(t<5){intro(c,t);c.save();c.globalAlpha=smooth((t-4.5)/.5);travellingWall(c,t);c.restore();}
 else if(t<125)travellingWall(c,t);
 else {outro(c,t-125);if(t<125.45){c.save();c.globalAlpha=1-smooth((t-125)/.45);travellingWall(c,t);c.restore();}}
 c.restore();
}
export {catalog,locate,scenes};
