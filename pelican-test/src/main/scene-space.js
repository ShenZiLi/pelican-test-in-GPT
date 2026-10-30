import {clamp,smooth,lerp} from '../beat/timeline.js';

const shapes={15:{type:'circle',x:500,y:520,r:378},17:{type:'rect',x:130,y:409,w:740,h:419},19:{type:'rect',x:218.75,y:170,w:562.5,h:781},20:{type:'rect',x:450,y:322,w:516,h:506}};
function mediumX(t,id){
 const middle=id===20?720:500;
 if(t<.7)return lerp(0,middle,smooth(t/.7));
 if(t>5.4)return lerp(middle,1070,smooth((t-5.4)/.6));
 return middle+(id===20?0:Math.sin((t-.7)/4.7*Math.PI*2)*22);
}
export function sceneSpace(id,time){
 const t=clamp(time,0,6),start=5+(id-1)*6;
 let x=t/6*1070,y=805,scale=1,poseTime=start+t,angle=0;
 if(id===2){x=t<2?215*t:t<=4?430:lerp(430,1070,smooth((t-4)/2));poseTime=start+(t<2?t:t<=4?2:2+(t-4)*2);}
 if(id===1)scale=.86;
 if(id===3)scale=.82;
 if(id===4)scale=.88;
 if(id===8)scale=.65;
 if(id===11)scale=.84;
 if(id===15){x=mediumX(t,id);scale=.68;y=785;}
 if(id===17){x=mediumX(t,id);scale=.82;y=805;}
 if(id===19){x=mediumX(t,id);scale=.78;y=835;}
 if(id===20){x=mediumX(t,id);scale=.72;y=805;}
 const edge=1-smooth(Math.min(t,6-t)/.65);
 // Every local medium joins the same external road at its two portals.
 if(shapes[id])y=lerp(y,805,edge);
 if(t===0||t===6){x=t===0?0:1070;y=805;}
 return {id,localTime:t,artBounds:{x:0,y:0,w:1000,h:1000},x,y,scale,angle,poseTime,mask:shapes[id]||null,portal:t<.7?'entry':t>5.4?'exit':null,events:{highlight:t>=2&&t<4}};
}
export function subjectBounds(s){return {left:s.x-168*s.scale,right:s.x+233*s.scale,top:s.y-336*s.scale,bottom:s.y+3*s.scale};}
export function containsPoint(mask,x,y){if(!mask)return true;return mask.type==='circle'?Math.hypot(x-mask.x,y-mask.y)<=mask.r+1e-6:x>=mask.x&&x<=mask.x+mask.w&&y>=mask.y&&y<=mask.y+mask.h;}
export function clipSubject(c,s){
 if(!s.mask)return;c.beginPath();const m=s.mask;
 if(m.type==='circle')c.arc(m.x,m.y,m.r,0,Math.PI*2);else c.rect(m.x,m.y,m.w,m.h);
 c.clip();
}
export function transformSubject(c,s){c.translate(s.x,s.y);c.rotate(s.angle);c.scale(s.scale,s.scale);c.translate(-500,-805);}
