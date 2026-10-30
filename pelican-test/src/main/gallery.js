import {SCENES,clamp,smooth} from '../beat/timeline.js';
import {renderArtwork,renderSubject,galleryPoseAt} from '../scenes/registry.js';
import {pelican} from '../rig/pelican.js';
import {text,line,rect} from '../kit/draw.js';
import {GALLERY,galleryState,frameRect} from './gallery-layout.js';

function label(c,index,x,y){
  const s=SCENES[index];
  if(index===-1){text(c,'序',x,y,34,'#8a4735');text(c,'一个庄重的假说',x+66,y-2,29,'#333c36');text(c,'A Solemn Hypothesis',x+66,y+30,19,'#62675d');return;}
  text(c,String(index+1).padStart(2,'0'),x,y,39,'#8a4735',{italic:true});
  text(c,s?s.zh:'新闻发布会',x+66,y-2,29,'#333c36');
  text(c,s?s.en:'Press Conference',x+66,y+30,19,'#62675d');
  text(c,s?s.era:'鹈鹕（本人）',x+66,y+59,20,'#827d6d');
}
function art(c,index,local,{skeleton,pressConference,subject=true}){
  if(index===-1){rect(c,0,0,1000,1000,'#e8dfc9');text(c,'鹈鹕骑行艺术通史',500,300,49,'#626653',{align:'center'});text(c,'卷 一',500,385,30,'#626653',{align:'center'});line(c,[[200,440],[800,440]],'#8e8b70',1);text(c,'一个未经本人证实的假说。',500,700,29,'#7c7d65',{align:'center'});return;}
  if(index===20){pressConference(c,0);return;}
  renderArtwork(c,index+1,local,{skeleton,subject});
}
function framed(c,index,box,local,options){
  c.save();c.shadowColor='#343a302b';c.shadowBlur=22;c.shadowOffsetY=15;
  rect(c,box.x-8,box.y-8,box.w+16,box.h+16,'#fffdf5');c.restore();
  c.save();c.beginPath();c.rect(box.x,box.y,box.w,box.h);c.clip();
  c.translate(box.x,box.y);c.scale(GALLERY.scale,GALLERY.scale);art(c,index,local,options);c.restore();
  rect(c,box.x-1,box.y-1,box.w+2,box.h+2,null,'#7d796b77',1);
  label(c,index,box.x,box.y+box.h+53);
}
export function drawGallery(c,t,options={}){
  const state=galleryState(t),{skeleton=false,viewportWidth:width=1920}=options;
  rect(c,0,0,width,840,'#eeece3');
  // The narrow unframed portions of this road are real traversable gallery space.
  line(c,[[0,GALLERY.ground],[width,GALLERY.ground]],'#6a756b55',1);
  const boxes=[];
  for(let i=-1;i<=20;i++){
    const box=frameRect(i,state.camera,width);if(box.x>width+30||box.x+box.w< -30)continue;
    const local=i>=0&&i<20?clamp(t-SCENES[i].start,0,6):0;
    const subject=i===state.index&&t<125;
    boxes.push({i,box,local});framed(c,i,box,local,{...options,subject});
  }
  if(t<125){
    const pose=galleryPoseAt(state.index+1,state.local);
    const x=width/2+state.index*GALLERY.step+pose.x*GALLERY.scale-state.camera;
    // A single continuous skeleton occupies gallery space. Frame clipping changes
    // only its drawing language, including different styles on either side of a border.
    c.save();c.beginPath();c.rect(0,0,width,840);
    for(const {box}of boxes)c.rect(box.x,box.y,box.w,box.h);
    c.clip('evenodd');const electric=t>88.62&&t<89.25;
    c.translate(x,GALLERY.top+pose.y*GALLERY.scale);c.rotate(pose.angle||0);
    pelican(c,pose.poseTime??t,{x:0,y:0,scale:GALLERY.scale*pose.scale,style:electric?'glow':'line',ink:electric?'#86ffad':'#4b554a'});c.restore();
    // The same skeleton can straddle two paintings before its centre crosses.
    // Draw just the neighbouring style fragment; never replay a second full bird.
    for(const neighbour of [state.index-1,state.index+1]){
      if(neighbour<0||neighbour>19||[15,17,19,20].includes(neighbour+1))continue;
      const edge=neighbour<state.index?6:0,other=galleryPoseAt(neighbour+1,edge),box=frameRect(neighbour,state.camera,width);
      const scale=other.scale,extentLeft=x-170*scale*.6,extentRight=x+235*scale*.6;
      if(extentRight<box.x||extentLeft>box.x+box.w)continue;
      c.save();c.beginPath();c.rect(box.x,box.y,box.w,box.h);c.clip();
      c.translate(x,GALLERY.top+other.y*.6);c.rotate(other.angle||0);
      // Song's legacy isolated subject already contains its tiny world scale.
      const rawScale=neighbour===4?.088:1;
      c.scale(.6*scale/rawScale,.6*scale/rawScale);c.translate(-500,-805);
      renderSubject(c,neighbour+1,edge,t,{skeleton});c.restore();
    }
  }
}

let wall=null;
function getWall(options){
  if(wall)return wall;
  wall=Array.from({length:21},(_,i)=>{const a=document.createElement('canvas');a.width=300;a.height=300;const c=a.getContext('2d');c.scale(.3,.3);if(i<20)renderArtwork(c,i+1,i===19?4.2:3,{skeleton:options.skeleton});else options.pressConference(c,0);return a;});
  return wall;
}
export function resetGallery(){wall=null;}
export function drawGalleryOutro(c,t,options){
  const thumbs=getWall(options),q=smooth((t-4)/4),zoom=1+q*(840/196-1);
  const w=196,gap=44,h=w,originX=142,originY=24;
  const targetX=originX+6*(w+gap)+w/2,targetY=originY+2*(h+51)+h/2;
  rect(c,0,0,1920,840,'#eeece3');
  c.save();c.translate(960,420);c.scale(zoom,zoom);c.translate(-960-(targetX-960)*q,-420-(targetY-420)*q);
  for(let i=0;i<21;i++){
    const x=originX+i%7*(w+gap),y=originY+Math.floor(i/7)*(h+51);
    rect(c,x-4,y-4,w+8,h+8,'#fffdf4');
    if(i===20&&t>4){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x,y);c.scale(w/1000,w/1000);options.pressConference(c,t);c.restore();}
    else c.drawImage(thumbs[i],x,y,w,h);
    if(zoom<3)text(c,i<20?`${String(i+1).padStart(2,'0')} ${SCENES[i].zh}`:'21 新闻发布会',x,y+h+29,17,'#465047');
  }c.restore();
  if(t<1.5){c.save();c.globalAlpha=1-smooth(t/1.5);drawGallery(c,125,options);c.restore();}
  if(t>7.4){c.save();c.globalAlpha=smooth((t-7.4)/.6);c.scale(1.08,.84);c.translate(389,0);options.pressConference(c,t);c.restore();}
  if(t>=2&&t<4)text(c,'截至目前，人类共提交了 20 份答卷。',960,809,35,'#344740',{align:'center'});
  if(t>=8&&t<11.5){rect(c,0,760,1920,80,'#263834e8');text(c,'鹈鹕本人对此尚未发表评论。',960,812,35,'#f3eddb',{align:'center'});}
}
