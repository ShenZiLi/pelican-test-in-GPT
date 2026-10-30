import {makeSurface,poly,stroke,ellipse,path} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
const P={paper:'#e8e4d7',ink:'#243d4a',sage:'#708e86',light:'#a6b9ab',white:'#faf6e8',rose:'#bd7465',mint:'#ced7bd'};
export const fontText='早期聊天窗口年代芦苇信箱文件交谈工具帮助在线联系人芦苇岸边自行车爱好者对方正在输入它真的会骑发送消息表情附件原创动图每秒帧色已送达朋友沿着路走今日无新通知';
function txt(c,s,x,y,n,col=P.ink,bold=false,align='left'){text(c,s,x,y,n,col,{bold,align});}
function box(c,x,y,w,h,fill,border=P.ink){c.fillStyle=fill;c.fillRect(x,y,w,h);if(border){c.strokeStyle=border;c.lineWidth=1.5;c.strokeRect(x+.5,y+.5,w-1,h-1);}}
function reed(c,x,y,s,col=P.sage){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-11,17],[-8,-12],[0,-21],[4,-12],[0,4]],col);poly(c,[[-7,17],[5,-9],[14,-14],[16,-2],[6,10]],col);stroke(c,[[-9,20],[3,-6]],col,2);c.restore();}
function avatar(c,x,y,index=0){box(c,x,y,47,47,index%2?P.mint:P.white,P.light);reed(c,x+24,y+24,.7,index%2?P.rose:P.sage);}
function gifRider(c,t){
 const p=poseAt(t),ink=P.ink;
 const seg=(pts,col,w)=>stroke(c,pts,col,w);
 // Flattened pixel-gif hardware and the bicycle's deep diagonal beam.
 for(const x of [0,180]){ellipse(c,x,0,44,44,P.white,ink,7);ellipse(c,x,0,35,35,null,P.sage,1.5);for(let i=0;i<8;i++){const a=p.wheelAngle+i*Math.PI/4;seg([[x,0],[x+Math.cos(a)*35,Math.sin(a)*35]],P.sage,1);}}
 seg([[p.hip.x,p.hip.y],[p.kneeRight.x,p.kneeRight.y],[p.ankleRight.x,p.ankleRight.y]],P.rose,5);
 seg([[0,0],[58,-77],[80,-22],[0,0],[80,-22],[132,-75],[58,-77],[80,-22],[180,0],[132,-75],[140,-104],[158,-104]],ink,7);
 seg([[0,-1],[58,-76],[130,-74]],P.sage,3);seg([[81,-22],[178,-1]],P.sage,3);seg([[58,-77],[58,-100]],ink,5);seg([[40,-103],[75,-103]],ink,6);
 ellipse(c,80,-22,11,11,P.paper,ink,2);seg([[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],ink,3);
 // An original stout, angular 256-color GIF bird with cap and dither shadows.
 poly(c,[[31,-153],[14,-147],[-12,-157],[-4,-136],[17,-128],[29,-109],[67,-102],[94,-117],[102,-143],[90,-160],[55,-168]],P.white,ink,2.4);
 poly(c,[[31,-127],[46,-115],[73,-113],[86,-127],[74,-116],[58,-108],[37,-112]],P.light);
 path(c,q=>{q.moveTo(76,-144);q.lineTo(73,-175);q.lineTo(88,-211);q.quadraticCurveTo(95,-231,111,-225);q.quadraticCurveTo(125,-225,123,-209);q.lineTo(112,-195);q.lineTo(103,-170);q.lineTo(102,-137);q.closePath();},P.white,ink,2.4);
 poly(c,[[83,-163],[83,-181],[98,-210],[105,-212],[99,-187],[93,-162]],P.light);
 path(c,q=>{q.moveTo(120,-215);q.lineTo(222,-207);q.lineTo(194,-199);q.lineTo(125,-200);q.quadraticCurveTo(150,-174,184,-197);},'#ddb27b',ink,2);
 seg([[124,-207],[211,-207]],'#a67e5c',1.2);ellipse(c,110,-215,3.7,3.7,ink);
 poly(c,[[85,-227],[89,-236],[109,-239],[121,-230],[139,-227],[107,-224]],P.sage,ink,1.6);
 path(c,q=>{q.moveTo(30,-145);q.quadraticCurveTo(57,-165,78,-149);q.lineTo(144,-111);q.lineTo(154,-108);q.lineTo(148,-102);q.lineTo(89,-126);q.quadraticCurveTo(53,-104,30,-126);q.closePath();},P.sage,ink,2);
 for(let i=0;i<3;i++)seg([[39+i*10,-140],[55+i*10,-124]],P.mint,1.5);
 seg([[p.hip.x,p.hip.y],[p.kneeLeft.x,p.kneeLeft.y],[p.ankleLeft.x,p.ankleLeft.y]],'#d0a072',5);
 for(const a of [p.ankleLeft,p.ankleRight])poly(c,[[a.x-5,a.y-2],[a.x+10,a.y-2],[a.x+17,a.y+3],[a.x-5,a.y+4]],P.rose,ink,1);
}
export function createAssets(){return Object.freeze({});}
// The side of this framed world is visible while the cyclist approaches/leaves
// the full chat window. It therefore has its own authored scene, never a marker.
export const frameColor=P.sage;
export function drawBackground(c){
 c.fillStyle=P.paper;c.fillRect(0,0,1000,1000);box(c,16,264,968,442,P.white,P.sage);box(c,16,264,968,37,P.sage,null);
 reed(c,38,282,.45,P.white);txt(c,'芦苇信箱',58,289,17,P.white,true);txt(c,'rider-loop.gif',48,333,16,P.ink);
 box(c,36,350,928,350,P.mint,P.light);for(let x=680;x<950;x+=31){stroke(c,[[x,700],[x+9,501-(x%70)]],P.sage,1);poly(c,[[x+7,553],[x-8,536],[x-5,558]],P.sage);}
}
export function drawRoad(c){c.fillStyle=P.mint;c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],P.sage,2);for(let x=0;x<1000;x+=75)stroke(c,[[x,743],[x+28,743]],P.light,2);}
export function drawRider(c,t){gifRider(c,101+Math.floor((t-101)*8+1e-6)/8);}
export function drawViewport(c,{t,localTime}){
 const qt=101+Math.floor(localTime*8+1e-6)/8;
 c.save();c.fillStyle=P.paper;c.fillRect(0,0,1920,1080);
 // Fixed paper-check texture is intentionally unlike modern glass UI.
 c.fillStyle='rgba(36,61,74,.025)';for(let y=0;y<1080;y+=8)for(let x=(y%16);x<1920;x+=16)c.fillRect(x,y,1,1);
 drawTitle(c,{});
 const a=t-103,shake=a>=0&&a<.65?Math.sin(a*76)*13*Math.exp(-a*6):0;
 c.translate(shake,Math.sin(a*89)*shake*.32);
 box(c,75,227,1770,812,P.ink,null);box(c,67,219,1770,812,P.white,P.ink);
 box(c,67,219,1770,54,P.sage,null);reed(c,99,247,.62,P.white);txt(c,'芦苇信箱 / 与「芦苇岸边」交谈',126,254,24,P.white,true);
 for(let i=0;i<3;i++){box(c,1694+i*42,232,28,26,P.white,P.ink);if(i===0)stroke(c,[[1702,250],[1714,250]],P.ink,2);if(i===1)box(c,1742,239,12,11,null,P.ink);if(i===2){stroke(c,[[1787,239],[1799,251]],P.ink,1.5);stroke(c,[[1799,239],[1787,251]],P.ink,1.5);}}
 box(c,68,273,1768,48,P.paper,null);txt(c,'文件    交谈    工具    帮助',91,305,21);txt(c,'在线',1761,305,18,P.sage,false,'right');ellipse(c,1775,298,5,5,P.sage);
 box(c,89,341,286,600,P.paper,P.light);txt(c,'联系人',109,377,25,P.ink,true);stroke(c,[[108,396],[353,396]],P.light,1);
 const names=['芦苇岸边','自行车爱好者','沿着路走'];for(let i=0;i<3;i++){const y=420+i*97;if(i===0)box(c,98,y-12,267,82,P.mint,null);avatar(c,110,y,i);txt(c,names[i],171,y+21,22,P.ink,i===0);txt(c,i===0?'在线':'朋友',171,y+47,16,P.sage);}
 txt(c,'今日无新通知',112,875,18,P.sage);reed(c,317,870,.9,P.light);
 const gx=399,gy=341,gw=1415,gh=603;
 box(c,gx,gy,gw,gh,P.mint,P.light);txt(c,'rider-loop.gif',422,374,21,P.ink,true);txt(c,'原创动图 · 8帧/秒 · 256色',1788,374,17,P.sage,false,'right');
 c.save();c.beginPath();c.rect(gx+2,389,gw-4,553);c.clip();
 const{canvas,ctx:g}=makeSurface(472,185);g.fillStyle=P.mint;g.fillRect(0,0,472,185);
 g.fillStyle='#b6c9b3';for(let i=0;i<6;i++){g.fillRect(i*103-((qt-101)*12)%103,135,64,2);g.fillRect(i*97-((qt-101)*20)%97,171,39,1);}
 // Low color, explicitly ordered dithered image area, sampled only 8 times per second.
 for(let i=0;i<6;i++){const x=355+i*17;stroke(g,[[x,178],[x+3,90-i*7]],P.sage,.7);poly(g,[[x+3,110-i*4],[x-8,97-i*4],[x-6,108-i*4]],P.sage);}
 g.save();g.translate(126,(924-389)/3-44*.6);g.scale(.6,.6);gifRider(g,qt);g.restore();
 const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];const pixels=g.getImageData(0,0,472,185);for(let y=0;y<185;y++)for(let x=0;x<472;x++){const i=(y*472+x)*4,shift=(bayer[y%4][x%4]-7.5)*.85;for(let j=0;j<3;j++){const levels=j===2?3:7;pixels.data[i+j]=Math.round(Math.max(0,Math.min(255,pixels.data[i+j]+shift))/255*levels)*255/levels;}}g.putImageData(pixels,0,0);
 c.imageSmoothingEnabled=false;c.drawImage(canvas,gx+2,389,1416,555);c.imageSmoothingEnabled=true;
 if(t<104){box(c,1320,445,427,47,P.white,P.light);txt(c,'对方正在输入'+'.'.repeat(1+Math.floor((qt-101)*2)%3),1341,477,24,P.sage);}else{avatar(c,1320,440,1);box(c,1384,440,361,87,P.white,P.light);txt(c,'芦苇岸边',1404,469,16,P.sage);txt(c,'它真的会骑。',1404,505,28,P.ink,true);txt(c,'已送达',1740,554,16,P.sage,false,'right');}
 c.restore();
 box(c,89,960,1511,46,P.white,P.light);txt(c,'发送消息…',110,992,20,P.sage);box(c,1620,960,194,46,P.sage,P.ink);txt(c,'发送',1660,992,23,P.white,true);poly(c,[[1751,973],[1778,983],[1751,994],[1757,983]],P.white);
 c.restore();
}
export function drawTitle(c){c.save();txt(c,'早期聊天窗口',74,125,47,P.ink,true);txt(c,'Early Chat Window',77,171,29,P.sage);txt(c,'2000年代',1770,171,27,P.rose,false,'right');reed(c,1774,110,1.2);c.restore();}
