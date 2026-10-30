import{makeSurface,rng,stroke,poly,grain}from'../kit/art.js';import{drawContour}from'../rig/contour.js';import{text,smooth}from'../kit/materials.js';
export const frameColor='#45483c',fontText='诺斯费拉图影子登楼';
export function createAssets(){const{canvas,ctx:c}=makeSurface(1600,1600);c.scale(1.6,1.6);const g=c.createLinearGradient(0,200,1000,760);g.addColorStop(0,'#d3ccb4');g.addColorStop(.4,'#a5a991');g.addColorStop(1,'#cdc6ad');c.fillStyle=g;c.fillRect(0,0,1000,1000);const r=rng(141922);
 for(let i=0;i<80;i++){const x=r()*1000,y=180+r()*650;stroke(c,[[x,y],[x+30,y-8],[x+60,y-6]],i%2?'#777f6b':'#ebe1c4',.6,.3);}poly(c,[[730,230],[850,230],[850,600],[630,660]],'#454c40');
 poly(c,[[0,800],[0,740],[140,740],[140,705],[265,705],[265,670],[390,670],[390,635],[515,635],[515,600],[640,600],[640,565],[765,565],[765,530],[890,530],[890,495],[1000,495],[1000,1000],[0,1000]],'#676e5c');
 for(let i=0;i<8;i++){const x=15+i*125,y=738-i*35;stroke(c,[[x,y],[x+116,y]],'#dad3b7',2.2);stroke(c,[[x+116,y],[x+116,y-34]],'#353e33',2.3);stroke(c,[[x+118,y],[x+118,y+90]],'#343e32',.8,.4);}
 stroke(c,[[0,620],[1000,340]],'#525b4b',8);stroke(c,[[0,605],[1000,325]],'#e3d9b9',1.3);
 for(let x=35;x<1000;x+=115)stroke(c,[[x,610-x*.28],[x+7,700-x*.2]],'#515b4b',5);grain(c,141922,6000);return{wall:canvas};}
export function roadAt(u){return{y:700-40*smooth(u/6),angle:0};}
export function drawBackground(c,{assets}){c.drawImage(assets.wall,0,0,1000,1000);}
export function drawRoad(){}
export function drawRider(c,t){c.save();c.shadowColor='#18221c';c.shadowBlur=6;drawContour(c,t,{ink:'#1d2821',fill:true,width:3.3});c.restore();}
export function drawTitle(c){c.save();const g=c.createLinearGradient(0,0,720,0);g.addColorStop(0,'#d3ccb4');g.addColorStop(.55,'#d3ccb4ec');g.addColorStop(1,'#d3ccb400');c.fillStyle=g;c.fillRect(0,70,720,220);c.restore();text(c,'诺斯费拉图',105,150,47,'#263a2b',{bold:true});text(c,'NOSFERATU · SHADOW',107,200,27,'#3e4b3c',{family:'Georgia'});text(c,'1922',108,244,26,'#53604b');}
