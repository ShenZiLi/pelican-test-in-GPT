import {drawGallery,drawGalleryOutro,resetGallery} from './gallery.js';
import {smooth,lerp} from '../beat/timeline.js';
import {paper,text,rect,line,ellipse} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
export const W=1920,H=840;
export function invalidateThumbnails(){resetGallery();}
function intro(c,t){const q=smooth((t-4)/1);paper(c,{base:'#e9e1cf',seed:87});c.save();c.globalAlpha=1-q;text(c,'鹈鹕测试',-275,112,26,'#77745f');line(c,[[-275,140],[1275,140]],'#77745f55',1);text(c,'图一  鹈鹕骑行图（摹本）',1090,867,23,'#686b5e',{align:'center'});text(c,'——《鹈鹕骑行艺术通史》，卷一（虚构书名）',-245,940,24,'#76755f');c.save();c.globalAlpha*=smooth((t-.6)/.55);text(c,'人类自古以来就痴迷于画',-245,400,49,'#293c39');text(c,'鹈鹕骑自行车。',-245,475,49,'#293c39');c.restore();c.save();c.globalAlpha*=smooth((t-3)/.22);text(c,'——早在自行车被发明之前。',-245,590,37,'#695e47');c.restore();c.restore();c.save();c.globalAlpha=.73+.27*q;pelican(c,t<4?0:t,{x:1095-595*q,y:815-10*q,scale:.71+.29*q,style:'line',ink:'#535449'});c.restore();}
export function pressConference(c,t,{small=false}={}){paper(c,{base:'#d6d5c9',seed:21});rect(c,-389,0,1778,1000,'#384c49');for(let i=0;i<24;i++)rect(c,-389+i*78,0,38,1000,'#ffffff05');text(c,'鹈鹕测试',500,145,58,'#c7c9ac',{align:'center'});text(c,'新闻发布会  /  PRESS CONFERENCE',500,205,26,'#c7c9ac',{align:'center'});pathChair(c);if(t>=11.5&&t<11.76)pelican(c,136.5,{x:lerp(-530,1700,(t-11.5)/.26),y:650,scale:.6,style:'classic'});rect(c,-389,651,1778,350,'#9b8564');rect(c,-389,650,1778,18,'#d9c398');for(let i=0;i<7;i++){const x=160+i*112;line(c,[[x,650],[x+13,570],[x+30,548]],'#253530',6);ellipse(c,x+30,548,13,23,'#1a2524','#8d9a8e',2);ellipse(c,x,650,29,7,'#273d37');}rect(c,345,700,310,105,'#eee7d4','#a89c7a',2);text(c,'鹈鹕（本人）',500,768,39,'#35423b',{align:'center'});const flash=Math.max(0,1-Math.abs(t-4)/.11,1-Math.abs(t-6)/.11);if(flash>0)rect(c,-389,0,1778,1000,`rgba(255,255,235,${flash*.65})`);}
function pathChair(c){rect(c,380,340,240,325,'#1f302e','#8d9c88',5);ellipse(c,500,370,120,63,'#1f302e','#8d9c88',5);line(c,[[395,640],[375,805]],'#22332f',14);line(c,[[605,640],[625,805]],'#22332f',14);}
export function drawFilm(c,t,{skeleton=false,viewportWidth=W}={}){
  c.save();c.resetTransform();c.globalAlpha=1;c.globalCompositeOperation='source-over';c.filter='none';c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;c.lineCap='round';c.lineJoin='round';c.setLineDash([]);c.beginPath();c.clearRect(0,0,viewportWidth,H);
  const options={skeleton,pressConference,viewportWidth};
  const fit=Math.min(1,viewportWidth/W),fixedX=(viewportWidth-W*fit)/2,fixedY=(H-H*fit)/2;
  if(t<5){
    rect(c,0,0,viewportWidth,H,'#e9e1cf');c.save();c.translate(fixedX,fixedY);c.scale(fit,fit);c.beginPath();c.rect(0,0,W,H);c.clip();c.scale(1.08,.84);c.translate(389,0);intro(c,t);c.restore();
    if(t>4.2){c.save();c.globalAlpha=smooth((t-4.2)/.8);drawGallery(c,5,options);c.restore();}
  }else if(t<125){const beat=5+6*Math.round((t-5)/6),pulse=1+.012*Math.exp(-(((t-beat)/.14)**2));c.translate(viewportWidth/2,H/2);c.scale(pulse,pulse);c.translate(-viewportWidth/2,-H/2);drawGallery(c,t,options);}
  else{rect(c,0,0,viewportWidth,H,'#eeece3');c.translate(fixedX,fixedY);c.scale(fit,fit);c.beginPath();c.rect(0,0,W,H);c.clip();drawGalleryOutro(c,t-125,{...options,viewportWidth:W});}
  c.restore();
}
