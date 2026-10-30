import {makeSurface,poly} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
const C=['#14253f','#62618e','#bce2c3','#4d9188','#8ebdb1','#f3ebcc','#e8ad5e','#b76b58'];
export const frameColor=C[0];
export const fontText='像素游戏年代芦苇冲刺';
const glyph={R:['11110','10001','10001','11110','10100','10010','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],D:['11110','10001','10001','10001','10001','10001','11110'],U:['10001','10001','10001','10001','10001','10001','01110'],N:['10001','11001','11001','10101','10011','10011','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],'0':['01110','10011','10101','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00110','01000','10000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['10010','10010','10010','11111','00010','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110']};
function limitPalette(c,w,h){const colors=C.map(s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16))),im=c.getImageData(0,0,w,h);for(let i=0;i<im.data.length;i+=4){if(im.data[i+3]<128){im.data[i+3]=0;continue;}let best=colors[0],dist=Infinity;for(const rgb of colors){const d=(rgb[0]-im.data[i])**2+(rgb[1]-im.data[i+1])**2+(rgb[2]-im.data[i+2])**2;if(d<dist){dist=d;best=rgb;}}im.data[i]=best[0];im.data[i+1]=best[1];im.data[i+2]=best[2];im.data[i+3]=255;}c.putImageData(im,0,0);}
function bitmap(c,s,x,y,size,col){c.fillStyle=col;for(const ch of s){const g=glyph[ch];if(g)for(let j=0;j<7;j++)for(let i=0;i<5;i++)if(g[j][i]==='1')c.fillRect(x+i*size,y+j*size,size,size);x+=6*size;}}
export function createAssets(){
 const{canvas,ctx:c}=makeSurface(250,250);c.fillStyle=C[0];c.fillRect(0,0,250,250);
 c.fillStyle=C[1];c.fillRect(0,55,250,92);
 for(let i=0;i<4;i++){c.fillStyle=C[4];const x=16+i*71,y=78+(i%2)*13;c.fillRect(x,y,30,4);c.fillRect(x+7,y-5,13,5);c.fillRect(x-4,y+4,42,4);}
 const mountains=[[0,143],[0,119],[18,119],[18,110],[31,110],[31,96],[47,96],[47,111],[63,111],[63,103],[78,103],[78,91],[91,91],[91,100],[111,100],[111,122],[130,122],[130,116],[149,116],[149,102],[161,102],[161,119],[181,119],[181,108],[201,108],[201,124],[230,124],[230,119],[250,119],[250,170],[0,170]];poly(c,mountains,C[3]);
 poly(c,[[0,158],[15,158],[15,149],[33,149],[33,138],[48,138],[48,144],[75,144],[75,155],[97,155],[97,148],[119,148],[119,134],[132,134],[132,143],[149,143],[149,150],[170,150],[170,141],[197,141],[197,154],[225,154],[225,146],[250,146],[250,184],[0,184]],C[4]);
 for(let i=0;i<18;i++){c.fillStyle=i%2?C[2]:C[3];c.fillRect((i*43)%250,160+(i%4)*4,13+(i%3)*5,1);}
 for(const x of [15,58,184,230]){c.fillStyle=C[0];c.fillRect(x,137,2,31);c.fillRect(x-5,142,5,3);c.fillRect(x+2,135,4,3);c.fillStyle=C[6];c.fillRect(x-2,132,6,6);}
 limitPalette(c,250,250);return Object.freeze({background:canvas});
}
function coin(c,x,y,t){c.fillStyle=C[6];const w=4+Math.round(Math.abs(Math.cos(t*Math.PI*2))*7);c.fillRect(x-w,y-14,w*2,28);c.fillRect(x-w+3,y-18,w*2-6,36);c.fillStyle=C[5];c.fillRect(x-w+3,y-10,3,17);c.fillStyle=C[7];c.fillRect(x+w-4,y-10,3,20);}
export function drawBackground(c,{t,assets}){t=95+Math.floor((t-95)*12+1e-7)/12;c.save();c.imageSmoothingEnabled=false;c.drawImage(assets.background,0,0,1000,1000);if(t<97)coin(c,510,420,t);else if(t<97.5){const a=(t-97)*70;c.fillStyle=C[6];for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])c.fillRect(510+dx*(10+a),420+dy*(10+a),8,8);}c.restore();}
export function drawRoad(c){c.fillStyle=C[0];c.fillRect(0,700,1000,300);for(let x=0;x<1000;x+=20){if(x>=280&&x<420)continue;c.fillStyle=C[2];c.fillRect(x,700,20,8);c.fillStyle=C[3];c.fillRect(x,708,20,8);c.fillStyle=C[7];c.fillRect(x,716,20,90);c.fillStyle=C[6];c.fillRect(x+4,723,8,4);c.fillStyle=C[1];c.fillRect(x+12,741,8,6);c.fillRect(x,773,12,5);}for(let x=296;x<420;x+=24){c.fillStyle=C[1];c.fillRect(x,776,12,6);}}
function rasterLine(c,points,color,width=1){c.fillStyle=color;for(let i=1;i<points.length;i++){let[x,y]=points[i-1].map(Math.round);const[x1,y1]=points[i].map(Math.round),dx=Math.abs(x1-x),dy=-Math.abs(y1-y),sx=x<x1?1:-1,sy=y<y1?1:-1;let err=dx+dy;for(let n=0;n<200;n++){c.fillRect(x,y,width,width);if(x===x1&&y===y1)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}}}
function pixelCircle(c,x,y,r,col,width=1){c.fillStyle=col;for(let yy=-r;yy<r;yy++)for(let xx=-r;xx<r;xx++){const d=Math.hypot(xx+.5,yy+.5);if(d<=r&&d>=r-width)c.fillRect(x+xx,y+yy,1,1);}}
export function drawRider(c,t){
 t=95+Math.floor((t-95)*12+1e-7)/12;const p=poseAt(t),s=makeSurface(80,80),q=s.ctx;q.translate(12,63);
 const P=v=>[Math.round(v.x/4),Math.round(v.y/4)],L=(pts,col,w=1)=>rasterLine(q,pts,col,w);
 for(const x of [0,45]){pixelCircle(q,x,0,11,C[0],2);pixelCircle(q,x,0,8,C[5]);for(let i=0;i<6;i++){const a=p.wheelAngle+i*Math.PI/3;L([[x,0],[x+Math.cos(a)*8,Math.sin(a)*8]],C[4]);}}
 L([P(p.hip),P(p.kneeRight),P(p.ankleRight)],C[7],2);
 L([[0,0],[14,-18],[20,-6],[0,0],[20,-6],[32,-18],[14,-18],[20,-6],[45,0],[32,-18],[34,-23],[39,-26]],C[0],3);
 L([[0,0],[14,-18],[20,-6],[32,-18],[14,-18]],C[6],1);L([[45,0],[32,-18],[34,-23],[39,-26]],C[2],1);
 L([[14,-18],[15,-25]],C[0],2);L([[10,-26],[20,-26]],C[0],2);
 poly(q,[[6,-35],[-2,-38],[0,-31],[8,-29],[9,-23],[20,-23],[25,-29],[25,-36],[20,-41],[11,-42]],C[5]);
 poly(q,[[19,-34],[17,-43],[20,-48],[23,-55],[26,-58],[30,-57],[31,-52],[28,-48],[26,-42],[26,-34]],C[5]);
 poly(q,[[30,-55],[55,-52],[54,-50],[32,-49]],C[6]);poly(q,[[32,-50],[45,-49],[35,-46],[31,-48]],C[7]);
 q.fillStyle=C[0];q.fillRect(27,-55,2,2);q.fillStyle=C[2];q.fillRect(9,-35,11,7);q.fillStyle=C[4];q.fillRect(9,-28,10,2);
 L([[18,-35],[24,-35],[35,-27],[40,-27]],C[3],3);L([[20,-34],[36,-27]],C[2],1);
 L([P(p.hip),P(p.kneeLeft),P(p.ankleLeft)],C[6],2);for(const ankle of [p.ankleLeft,p.ankleRight]){const[x,y]=P(ankle);L([[x-1,y],[x+4,y]],C[0],1);}
 limitPalette(q,80,80);const jump=t>=96.5&&t<=97.5?Math.sin((t-96.5)*Math.PI)*88:0;
 c.save();c.imageSmoothingEnabled=false;c.translate(-48,-252-jump);c.drawImage(s.canvas,0,0,320,320);c.restore();
}
export function drawTitle(c,{t}){
 c.save();c.fillStyle=C[0];c.fillRect(72,72,1060,145);c.fillStyle=C[6];c.fillRect(72,72,8,145);
 text(c,'像素游戏',101,136,45,C[5],{bold:true});text(c,'8-bit Side-scroller · 1980年代',104,184,27,C[2],{family:'"Noto Serif SC"'});
 bitmap(c,'REED RUN',1320,90,4,C[5]);bitmap(c,'SCORE '+(t<97?'01230':'01330'),1320,140,3,C[6]);
 if(t>=98){c.globalAlpha=1;bitmap(c,'1UP',970,300-(Math.min(t-98,1)*14),9,C[6]);}
 c.restore();
}
