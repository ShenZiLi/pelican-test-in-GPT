import {rect,ellipse,line,text,path,cached,rng} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {clamp,smooth,lerp} from '../beat/timeline.js';
export function portraitState(t){const q=smooth(t/.32),w=lerp(1000,562.5,q);return {x:(1000-w)/2,w,progress:clamp(t/6),exit:t>=5.8};}
function city(c){
 const grad=c.createLinearGradient(0,0,0,1000);grad.addColorStop(0,'#79bec9');grad.addColorStop(.52,'#cee0d3');grad.addColorStop(1,'#e8cfaa');rect(c,0,0,1000,1000,grad);
 const r=rng(1920);for(let layer=0;layer<3;layer++)for(let i=0;i<14;i++){
  const x=i*85-60+layer*19,h=95+r()*170,y=600-layer*18;
  rect(c,x,y-h,55+r()*28,h,['#a8bdb6','#8da79d','#6e9082'][layer]);
  for(let k=0;k<5;k++)rect(c,x+12,y-h+15+k*35,8,11,'#e4e4c2');
 }
 path(c,'M80 1000L425 584L575 584L920 1000Z','#b9ada0');
 path(c,'M82 1000L425 584 M918 1000L575 584',null,'#f1ddbd',5);
}
export function galleryPose(t){
 if(t<.55)return {x:lerp(0,490,smooth(t/.55)),y:805,scale:.76};
 if(t>=5.8)return {x:lerp(490,1070,smooth((t-5.8)/.2)),y:805,scale:.76};
 return {x:490+Math.sin(t*2)*7,y:805,scale:.76};
}
export function renderGallery(c,t,scene){
 const {x,w,progress,exit}=portraitState(t),p=galleryPose(t);
 rect(c,0,0,1000,1000,'#030708');
 c.save();c.beginPath();c.rect(x,0,w,1000);c.clip();cached(c,'short-city-v2',city);
 for(let i=0;i<8;i++){const yy=610+((i*87+t*124)%390);const s=(yy-570)/430;rect(c,496,yy,8+8*s,18+28*s,'#f8ecd5');}
 if(scene.subject!==false)pelican(c,scene.start+t,{...p,style:'classic',ink:'#22464b',body:'#f4eee0',accent:'#dfaf66'});
 rect(c,x,0,w,113,'#123b46bc');text(c,'鹭过',x+28,58,35,'#fff5df',{weight:600});
 text(c,'关注   推荐   同城',x+27,94,19,'#d8e6df');line(c,[[x+94,104],[x+132,104]],'#f6ebca',3);
 const comments=['推荐穿越了六千年','这位骑手有点眼熟','本人：请勿打扰'];
 for(let i=0;i<3;i++){const yy=948-((t*70+i*230)%650);if(yy>460&&yy<815)continue;
  rect(c,x+20,yy-27,300,39,'#123b478c');text(c,comments[i],x+30,yy,23,'#f5f2df');}
 const ux=x+w-44;
 for(let i=0;i<3;i++){const uy=575+i*100;ellipse(c,ux,uy,23,23,'#17373b80');
  if(i===0)path(c,`M${ux} ${uy+10} C${ux-35} ${uy-10} ${ux-10} ${uy-28} ${ux} ${uy-12} C${ux+10} ${uy-28} ${ux+35} ${uy-10} ${ux} ${uy+10}`,'#f4aa9d');
  else if(i===1){rect(c,ux-12,uy-9,24,17,null,'#f6efd9',2);line(c,[[ux-5,uy+8],[ux-9,uy+15],[ux+4,uy+8]],'#f6efd9',2);}
  else line(c,[[ux-11,uy+4],[ux+10,uy-8],[ux+8,uy+11]],'#f7e7cc',3);
  text(c,i===0?String(1200+Math.floor(t*73)):i===1?'20':'分享',ux,uy+46,18,'#fff3da',{align:'center'});
 }
 for(let i=0;i<4;i++){const age=(t+i*.61)%2.6;const hx=ux-28+Math.sin(age*3+i)*13,hy=530-age*110;
  c.save();c.translate(hx,hy);c.scale(7,7);c.globalAlpha=.65*(1-age/2.6);path(c,'M0 1C-3 -1 -1 -3 0 -1C1 -3 3 -1 0 1','#f4b9b4');c.restore();}
 rect(c,x,903,w,97,'#0c2b31df');text(c,'@鹈鹕骑行档案',x+23,941,25,'#f7ecd6');text(c,'穿过这一框，还有下一种世界',x+23,974,18,'#bad4cd');
 rect(c,x,894,w,5,'#f5edd547');rect(c,x,894,w*progress,5,'#f7e4b6');c.restore();
 if(exit&&scene.subject!==false){c.save();c.beginPath();c.rect(x+w,460,1000-x-w,400);c.clip();
  pelican(c,scene.start+t,{...p,style:'classic',ink:'#22464b',body:'#f4eee0',accent:'#dfaf66'});c.restore();
  line(c,[[x+w,720],[1000,720]],'#f3dfb4',1.5);}
}
export default renderGallery;
export function renderSubject(c,t,scene){const p=galleryPose(t);pelican(c,scene.start+t,{...p,style:'classic',ink:'#22464b'});}