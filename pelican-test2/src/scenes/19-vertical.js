import { poseAt } from '../rig/pose.js';
import { makeSurface, ellipse, poly, stroke, path, rng } from '../kit/art.js';
import { text } from '../kit/materials.js';

// All coordinates in this module's viewport are native 1080p coordinates.
const X=656.25, W=607.5, H=1080, GROUND=924;
const INK='#132e44', BLUE='#235ac4', WHITE='#faf4e8', ORANGE='#e39857';
const clamp=v=>Math.max(0,Math.min(1,v));
const sans='"Noto Serif SC"';
export const fontText='苇刻关注发现河岸晴分享苇岸骑行者朝前骑别急着解释鹈鹕测试沿着路走原创声音自行车与河风这条路没有尽头骑得很认真这只鸟会打转向灯吗竖屏短视频年代六秒也是一段路';
function label(c,s,x,y,size,color=WHITE,align='left',bold=false){text(c,s,x,y,size,color,{align,bold,family:sans});}
function roundRect(c,x,y,w,h,r,fill,outline=null,width=1){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(outline){c.strokeStyle=outline;c.lineWidth=width;c.stroke();}}

function building(c,x,y,w,h,fill,columns=4){
  c.fillStyle=fill;c.fillRect(x,y,w,h);
  poly(c,[[x+w,y],[x+w+18,y-12],[x+w+18,y+h-12],[x+w,y+h]],'#b9b4a0');
  c.fillStyle='#516e70';
  for(let j=0;j<Math.floor(h/38)-1;j++)for(let i=0;i<columns;i++){
    const xx=x+13+i*(w-20)/columns, yy=y+18+j*38;
    c.globalAlpha=.55+(i%2)*.15;c.fillRect(xx,yy,Math.max(8,(w-30)/columns-8),18);
    c.fillStyle='#deceac';c.fillRect(xx+2,yy+2,3,15);c.fillStyle='#516e70';
  }
  c.globalAlpha=1;stroke(c,[[x,y],[x+w,y]],'#f8efd8',3);
}
function tree(c,x,y,scale=1){
 c.save();c.translate(x,y);c.scale(scale,scale);
 stroke(c,[[0,0],[3,-170],[10,-258]],'#36544a',7);
 stroke(c,[[2,-125],[-38,-179],[-55,-205]],'#36544a',4);
 stroke(c,[[4,-183],[44,-217]],'#36544a',4);
 for(const [xx,yy,rx,ry,col] of [[-35,-222,52,61,'#688570'],[20,-259,50,62,'#80967c'],[51,-229,44,48,'#718d76'],[-11,-270,35,48,'#9fae88']])ellipse(c,xx,yy,rx,ry,col);
 stroke(c,[[-47,-205],[-24,-236],[-10,-249]],'#d1caa1',1.5,.7);
 c.restore();
}
export function createAssets(){
 const {canvas,ctx:c}=makeSurface(608,1080);
 const sky=c.createLinearGradient(0,0,0,650);sky.addColorStop(0,'#e5dbbf');sky.addColorStop(.65,'#f6ecd6');sky.addColorStop(1,'#e6d7bd');c.fillStyle=sky;c.fillRect(0,0,608,1080);
 ellipse(c,454,229,81,81,'#df9d6e');ellipse(c,454,229,67,67,'#e7ad7c');
 for(const [x,y,w] of [[30,143,157],[222,326,143],[70,276,116]]){
  stroke(c,[[x,y],[x+w*.38,y-6],[x+w,y]],'#faf1dc',5,.7);
 }
 // Dense, independently composed riverfront architecture rather than a backdrop filter.
 poly(c,[[0,535],[0,408],[49,408],[49,373],[105,373],[105,450],[149,450],[149,393],[192,393],[192,432],[239,432],[239,385],[286,385],[286,510],[360,510],[360,442],[417,442],[417,407],[450,407],[450,506],[608,506],[608,626],[0,626]],'#afb9aa');
 building(c,-24,441,105,193,'#c8bfa3',3);building(c,74,490,92,151,'#dfc9a4',3);
 building(c,177,386,126,265,'#c78b6e',5);building(c,324,468,98,190,'#d1c4a6',3);building(c,470,416,121,235,'#d7b491',4);
 c.fillStyle='#e9dcc1';c.fillRect(170,647,438,16);c.fillStyle='#a4ac99';c.fillRect(0,657,608,31);
 for(let x=-10;x<620;x+=31){stroke(c,[[x,651],[x,687]],'#899783',2);}
 stroke(c,[[0,649],[608,649]],'#576f68',3);stroke(c,[[0,686],[608,686]],'#d6d9bc',3);
 const water=c.createLinearGradient(0,687,0,855);water.addColorStop(0,'#7b9f98');water.addColorStop(.65,'#a5b8a3');water.addColorStop(1,'#b6bca2');c.fillStyle=water;c.fillRect(0,688,608,174);
 for(let i=0;i<42;i++){const y=695+i*3.85,x=(i*73)%570;stroke(c,[[x,y],[x+25+(i%5)*17,y]],i%3?'#dae0c1':'#6b928b',i%4?1:2,.55);}
 // Terrace and warm concrete bicycle path.
 poly(c,[[0,842],[608,817],[608,890],[0,890]],'#c0b899');
 for(let i=0;i<4;i++)stroke(c,[[0,852+i*9],[608,827+i*11]],i%2?'#b5aa8b':'#e8d7b4',2);
 c.fillStyle='#e3c79d';c.fillRect(0,890,608,190);stroke(c,[[0,GROUND],[608,GROUND]],'#b8a382',2);
 stroke(c,[[0,955],[608,955]],'#f9e0b7',3);stroke(c,[[0,1010],[608,1010]],'#c2a888',1);
 // Trees frame the rider without crossing its readable face.
 tree(c,28,853,.88);tree(c,588,845,1.18);
 poly(c,[[0,924],[59,920],[240,1040],[153,1068]],'#6d806b');
 c.globalAlpha=.13;poly(c,[[600,923],[530,916],[245,1080],[402,1080]],INK);c.globalAlpha=1;
 const random=rng(19113);
 for(let i=0;i<16000;i++){c.globalAlpha=.025+random()*.025;c.fillStyle=i%3?'#8f7860':'#fff4d6';c.fillRect(random()*608,random()*1080,.5+random()*1.1,.3+random()*.8);}c.globalAlpha=1;
 return Object.freeze({riverfront:canvas});
}

function wheel(c,x,angle){
 ellipse(c,x,0,44,44,'#eee8d3',INK,8);ellipse(c,x,0,37,37,null,'#95aeb2',1.5);
 for(let i=0;i<12;i++){const a=angle+i*Math.PI/6;stroke(c,[[x,0],[x+Math.cos(a)*36,Math.sin(a)*36]],'#7d9397',.8);}
 ellipse(c,x,0,6,6,'#eff1df',INK,2);
 // A small reflector rotates with the exact global wheel phase.
 ellipse(c,x+Math.cos(angle)*29,Math.sin(angle)*29,4,2,ORANGE);
}
function leg(c,p,side,back=false){
 const knee=p[side==='left'?'kneeLeft':'kneeRight'],ankle=p[side==='left'?'ankleLeft':'ankleRight'];
 stroke(c,[[p.hip.x,p.hip.y],[knee.x,knee.y],[ankle.x,ankle.y]],back?'#ac7a43':'#dba757',5.5);
 ellipse(c,knee.x,knee.y,3.5,3.5,back?'#b3844c':'#e2b56d');
 poly(c,[[ankle.x-5,ankle.y-3],[ankle.x+10,ankle.y-3],[ankle.x+18,ankle.y+2],[ankle.x+3,ankle.y+4],[ankle.x-6,ankle.y+1]],back?'#af7541':'#e5a354',INK,.8);
 stroke(c,[[ankle.x-9,ankle.y+4],[ankle.x+13,ankle.y+4]],INK,2.3);
}
function rider(c,t){
 const p=poseAt(t);
 c.lineCap='round';c.lineJoin='round';
 ellipse(c,87,44,137,6,'rgba(45,61,57,.16)');
 wheel(c,0,p.wheelAngle);wheel(c,180,p.wheelAngle);
 leg(c,p,'right',true);
 stroke(c,[[0,0],[54,-73],[80,-22],[0,0],[54,-73],[127,-73],[80,-22],[180,0],[127,-73]],BLUE,8);
 stroke(c,[[54,-73],[127,-73]],'#89b8d1',1.5);
 stroke(c,[[54,-73],[58,-97]],INK,5);roundRect(c,37,-102,40,8,4,INK);
 stroke(c,[[180,0],[135,-88],[147,-107],[160,-106]],INK,5);
 stroke(c,[[145,-106],[167,-104]],'#694b3d',5);
 ellipse(c,80,-22,13,13,'#c4c9ba',INK,2);stroke(c,[[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],'#e7e1ce',4);
 // Belt guard and basket are original bicycle details with controlled weight.
 path(c,q=>{q.moveTo(2,-6);q.lineTo(83,-35);q.quadraticCurveTo(104,-23,88,-9);q.lineTo(8,5);q.closePath();},null,'#163d72',3);
 for(let i=0;i<3;i++)stroke(c,[[128+i*10,-85],[133+i*9,-67]],'#b5a17e',1.2);
 stroke(c,[[125,-87],[165,-87],[159,-65],[135,-65],[125,-87]],'#755d48',2);
 leg(c,p,'left');
 // Plump angular editorial bird: warm shadow planes and a cobalt feather cape.
 poly(c,[[21,-141],[-12,-153],[7,-126],[29,-122]],WHITE,INK,1.4);
 path(c,q=>{q.moveTo(24,-144);q.bezierCurveTo(38,-175,84,-173,100,-144);q.bezierCurveTo(101,-119,86,-99,55,-103);q.bezierCurveTo(32,-108,19,-122,24,-144);},WHITE,INK,1.6);
 path(c,q=>{q.moveTo(39,-124);q.quadraticCurveTo(53,-108,79,-113);q.quadraticCurveTo(62,-92,39,-111);q.closePath();},'#d8d5bc');
 path(c,q=>{q.moveTo(69,-142);q.bezierCurveTo(61,-173,80,-188,91,-212);q.bezierCurveTo(99,-229,113,-230,121,-218);q.bezierCurveTo(124,-205,108,-191,105,-181);q.lineTo(105,-139);q.closePath();},WHITE,INK,1.6);
 path(c,q=>{q.moveTo(95,-205);q.bezierCurveTo(86,-186,83,-166,90,-146);q.lineTo(101,-141);q.lineTo(103,-174);q.closePath();},'#dedfc8');
 path(c,q=>{q.moveTo(119,-214);q.lineTo(222,-207);q.quadraticCurveTo(174,-196,123,-200);q.closePath();},'#f2b85c',INK,1.4);
 path(c,q=>{q.moveTo(124,-202);q.quadraticCurveTo(140,-172,173,-195);q.lineTo(216,-206);q.quadraticCurveTo(161,-197,124,-202);},'#e0a572',INK,1.1);
 stroke(c,[[126,-209],[213,-207]],'#a16f36',1);
 ellipse(c,110,-215,6,6,'#c8d3c4');ellipse(c,112,-216,2.6,2.8,INK);ellipse(c,112.8,-217,1,1,'#fff');
 stroke(c,[[101,-229],[109,-232],[113,-225]],WHITE,3.5);
 // Wing-cape is a distinct silhouette, articulated toward the actual handlebar.
 path(c,q=>{q.moveTo(36,-151);q.bezierCurveTo(52,-167,74,-157,85,-145);q.lineTo(151,-109);q.quadraticCurveTo(149,-103,143,-104);q.lineTo(90,-128);q.bezierCurveTo(69,-106,40,-112,32,-131);q.closePath();},BLUE,INK,1.5);
 path(c,q=>{q.moveTo(38,-143);q.quadraticCurveTo(61,-147,83,-134);q.lineTo(69,-123);q.quadraticCurveTo(46,-121,38,-143);},'#4273d1');
 for(let i=0;i<4;i++)stroke(c,[[44+i*7,-139],[55+i*7,-124]],'#83a3dc',1.2);
 stroke(c,[[96,-169],[106,-163]],'#e8a653',5);poly(c,[[101,-165],[70,-174],[73,-164],[53,-169],[75,-157]],'#e6a14e');
}

function reed(c,x,y,s=1,color=WHITE){
 c.save();c.translate(x,y);c.scale(s,s);
 path(c,q=>{q.moveTo(-9,10);q.quadraticCurveTo(-16,-9,0,-18);q.quadraticCurveTo(7,-2,-9,10);},color);
 path(c,q=>{q.moveTo(-3,15);q.quadraticCurveTo(1,-5,17,-9);q.quadraticCurveTo(22,9,-3,15);},color);
 stroke(c,[[-10,17],[5,-3]],color,2);c.restore();
}
function featherLike(c,x,y,size,color=WHITE){
 c.save();c.translate(x,y);c.scale(size/28,size/28);
 path(c,q=>{q.moveTo(-1,16);q.bezierCurveTo(-24,2,-15,-19,-2,-7);q.bezierCurveTo(9,-29,32,-6,-1,16);q.closePath();},color);
 stroke(c,[[-1,13],[6,-6]],'#e6af6c',1.5);c.restore();
}
function comment(c,x,y){roundRect(c,x-16,y-14,32,25,9,null,WHITE,2.7);stroke(c,[[x-4,y+11],[x-11,y+18],[x-10,y+8]],WHITE,2.7);stroke(c,[[x-8,y-4],[x+8,y-4]],WHITE,2);stroke(c,[[x-8,y+2],[x+3,y+2]],WHITE,2);}
function kite(c,x,y){poly(c,[[x-19,y-5],[x+19,y-17],[x+4,y+15],[x-2,y+1]],null,WHITE,2.7);stroke(c,[[x-2,y+1],[x+18,y-17]],WHITE,2);stroke(c,[[x+4,y+15],[x-4,y+20]],WHITE,2);}
function ui(c,localTime){
 const beat=Math.floor(Math.max(0,localTime)/.5),likes=1230+Math.min(beat,11)*79;
 const top=c.createLinearGradient(0,0,0,200);top.addColorStop(0,'rgba(10,28,34,.55)');top.addColorStop(1,'rgba(10,28,34,0)');c.fillStyle=top;c.fillRect(0,0,W,200);
 reed(c,30,43,.82);label(c,'苇刻',53,51,24,WHITE,'left',true);
 label(c,'关注',265,51,21,'#e1e7da');label(c,'发现',339,51,22,WHITE,'left',true);stroke(c,[[341,63],[377,63]],WHITE,2.5);
 ellipse(c,555,41,10,10,null,WHITE,2);stroke(c,[[562,49],[571,59]],WHITE,2);
 roundRect(c,25,87,123,29,14,'rgba(250,244,232,.22)');ellipse(c,42,101,3,3,'#e6a463');label(c,'河岸 · 晴',54,108,15);
 const bottom=c.createLinearGradient(0,894,0,1080);bottom.addColorStop(0,'rgba(7,26,31,0)');bottom.addColorStop(.52,'rgba(7,26,31,.6)');bottom.addColorStop(1,'rgba(7,26,31,.89)');c.fillStyle=bottom;c.fillRect(0,894,W,186);
 // Custom interface rail stays clear of the pelican's beak and wheels.
 ellipse(c,557,648,22,22,'#faf1d8',WHITE,2);reed(c,557,648,.8,BLUE);
 ellipse(c,557,670,9,9,ORANGE);stroke(c,[[552,670],[562,670]],INK,1.7);stroke(c,[[557,665],[557,675]],INK,1.7);
 featherLike(c,557,725,31,localTime>2?'#efa76a':WHITE);label(c,likes.toLocaleString('en-US'),557,767,17,WHITE,'center');
 comment(c,557,813);label(c,String(128+Math.min(beat,11)*3),557,853,17,WHITE,'center');
 kite(c,557,894);label(c,'分享',557,935,16,WHITE,'center');
 label(c,'@ 苇岸骑行者',27,965,24,WHITE,'left',true);
 label(c,'朝前骑，别急着解释。',27,1002,22);
 label(c,'# 鹈鹕测试  # 沿着路走',27,1033,17,'#dbe1d0');
 reed(c,33,1059,.33,'#dbe1d0');label(c,'原创声音 · 自行车与河风',49,1065,14,'#dbe1d0');
 // Beat-triggered comments and leaf likes are sampled from t, never accumulated.
 const phrases=['这条路没有尽头','骑得很认真','这只鸟会打转向灯吗'];
 for(let i=0;i<3;i++){
   const age=localTime-(2+i*.5);if(age<0||age>2)continue;
   c.save();c.globalAlpha=clamp(age/.15)*clamp((2-age)/.6);const y=431-age*57-i*12;
   roundRect(c,37+i*15,y-24,252,36,18,'rgba(19,46,68,.7)');ellipse(c,57+i*15,y-7,9,9,['#d89b6c','#d9dfbc','#b1c9c4'][i]);
   label(c,phrases[i],75+i*15,y,17);c.restore();
 }
 for(let i=0;i<5;i++){
  const age=localTime-(2+i*.5);if(age<0||age>1.8)continue;
  c.save();c.globalAlpha=clamp(age/.12)*clamp((1.8-age)/.6);featherLike(c,510+Math.sin(age*2+i)*16,700-age*103,15+age*4,i%2?'#efcba1':'#eda06b');c.restore();
 }
 c.fillStyle='rgba(250,244,232,.28)';c.fillRect(0,1076,W,4);c.fillStyle=WHITE;c.fillRect(0,1076,W*clamp(localTime/6),4);
}
export const frameColor=BLUE;
export function drawBackground(c,{assets}){
 // A same-scale riverfront panorama continues through the physical frame;
 // the active scene's portrait crop is applied only by drawViewport below.
 c.fillStyle='#e5dbbf';c.fillRect(0,0,1000,1000);
 for(let x=0;x<1000;x+=364.8)c.drawImage(assets.riverfront,x,145.6,364.8,648);
}
export function drawRoad(c){c.fillStyle='#e3c79d';c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],'#b8a382',2);stroke(c,[[0,745],[1000,745]],'#f9e0b7',2);}
export function drawRider(c,t){rider(c,t);}
export function drawViewport(c,{t,localTime,assets}){
 c.save();c.fillStyle='#000';c.fillRect(0,0,1920,1080);
 c.beginPath();c.rect(X,0,W,H);c.clip();c.translate(X,0);
 const drift=localTime*7;
 c.drawImage(assets.riverfront,-drift,0,W,H);c.drawImage(assets.riverfront,W-drift,0,W,H);
 // Water highlights and a passing cloud shadow move gently while road contact stays exact.
 for(let i=0;i<10;i++){const xx=((i*73-localTime*15)%650+650)%650-35,y=712+i*12;stroke(c,[[xx,y],[xx+34,y]],'#ecdfbd',1.1,.55);}
 // The next frame appears only at the edge at the close, synchronized to t119.
 const portal= W+65-(Math.max(0,localTime-4)/2)*75;
 stroke(c,[[portal,215],[portal,GROUND]],INK,9);stroke(c,[[portal-5,218],[portal-5,GROUND]],'#e1ba7c',2);
 const riderX=105+Math.sin(localTime*Math.PI/3)*4;
 c.save();c.translate(riderX,GROUND-44*1.55);c.scale(1.55,1.55);rider(c,t);c.restore();
 ui(c,localTime);c.restore();drawTitle(c,{});
}
export function drawTitle(c,{scene}){
 c.save();
 label(c,'19 / 20',76,137,23,'#a9ada7');
 stroke(c,[[76,169],[130,169]],'#db9d62',3);
 label(c,'竖屏',71,258,60,WHITE,'left',true);label(c,'短视频',71,333,60,WHITE,'left',true);
 label(c,'VERTICAL',76,399,29,'#b7c6c2');label(c,'SHORT VIDEO',76,437,29,'#b7c6c2');
 label(c,scene?.era||'2020年代',76,493,25,'#d39b6e');
 label(c,'9 : 16',76,939,23,'#b8c2b8');stroke(c,[[76,963],[558,963]],'#34413c',1);
 label(c,'六秒，也是一段路。',76,1006,22,'#c8d1c5');
 c.restore();
}
