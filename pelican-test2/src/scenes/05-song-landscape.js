import {makeSurface,rng,poly,stroke,ellipse,path,wash,dryStroke} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text,smooth} from '../kit/materials.js';

export const frameColor='#45554a';
const PAPER='#e9e4d3',INK='#263c32';
const PEAK=[[357,641],[354,578],[375,551],[377,506],[395,489],[398,447],[417,432],[423,397],[442,374],[445,336],[460,324],[466,293],[482,286],[490,253],[509,245],[526,256],[544,249],[553,278],[574,282],[582,315],[600,319],[611,352],[626,361],[641,404],[659,414],[677,459],[684,498],[711,525],[729,568],[739,646]];
const WEST=[[74,640],[80,587],[107,566],[113,527],[137,517],[141,480],[167,467],[179,420],[195,419],[205,397],[227,391],[249,421],[266,423],[282,467],[304,476],[309,516],[335,535],[346,589],[367,648]];

function paper(c){
  c.fillStyle=PAPER;c.fillRect(0,0,1000,1000);const r=rng(804);
  for(let i=0;i<19500;i++){
    const x=r()*1000,y=r()*1000;c.strokeStyle=i%4?'#5a5a3f0a':'#ffffff29';c.lineWidth=.3+r()*.35;
    c.beginPath();c.moveTo(x,y);c.lineTo(x+1+r()*4,y+(r()-.5)*.8);c.stroke();
  }
  // Quiet warm sizing in the paper keeps the empty sky material, not white UI.
  const g=c.createLinearGradient(0,220,0,810);g.addColorStop(0,'#c0b99412');g.addColorStop(.6,'#ffffff00');g.addColorStop(1,'#a7a67d12');c.fillStyle=g;c.fillRect(0,0,1000,1000);
}
function clipPoly(c,pts){c.beginPath();pts.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));c.closePath();c.clip();}
function mountain(c,pts,seed,{tone='#69776b',depth=.7,detail=1}={}){
  const target=c,surface=makeSurface(3000,3000);c=surface.ctx;c.scale(3,3);
  const r=rng(seed),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),w=maxX-minX,h=maxY-minY;
  const rim=[];for(let i=0;i<pts.length;i++){
    const a=pts[i],b=pts[(i+1)%pts.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(len/3);
    for(let j=0;j<n;j++){const u=j/n,off=(r()-.5)*2.4;rim.push([a[0]+(b[0]-a[0])*u+(b[1]-a[1])/len*off,a[1]+(b[1]-a[1])*u-(b[0]-a[0])/len*off]);}
  }
  c.save();clipPoly(c,rim);
  const g=c.createLinearGradient(minX,minY,maxX,maxY);g.addColorStop(0,tone);g.addColorStop(.4,'#7f8b7480');g.addColorStop(.72,'#6f806ba0');g.addColorStop(1,'#b4b9a17a');c.fillStyle=g;c.globalAlpha=.35+depth*.6;c.fillRect(minX,minY,w,h);c.globalAlpha=1;
  // Diluted edge bleeds and many unequal accumulating washes build a mass.
  for(let i=0;i<30*detail;i++){
    const x=minX+r()*w,y=minY+r()*h,ww=12+r()*w*.45,hh=12+r()*h*.28;
    const a=c.createRadialGradient(x,y,0,x,y,ww);a.addColorStop(0,`rgba(45,66,51,${(.05+r()*.13)*depth})`);a.addColorStop(1,'#344a3600');
    c.save();c.translate(x,y);c.scale(1,hh/ww);c.fillStyle=a;c.fillRect(-ww,-ww,ww*2,ww*2);c.restore();
  }
  // Irregular pools settle on the shaded faces. Their notched, translucent
  // edges accumulate in several passes like ink dried between applications.
  for(let i=0;i<95*detail;i++){
    const x=minX+r()*w,y=minY+r()*h*.82,ww=6+r()*29,hh=12+r()*64;
    const shape=[[x,y],[x+ww*.5,y+3],[x+ww*.7,y+hh*.21],[x+ww*.45,y+hh*.48],[x+ww*.6,y+hh*.72],[x+ww*.14,y+hh],[x-ww*.14,y+hh*.8],[x-ww*.1,y+hh*.5],[x-ww*.3,y+hh*.23]];
    wash(c,shape,'#243b2c',(.08+r()*.15)*depth,seed+i*11);
  }
  // Broken vertical geology follows long structural ridges. The pale side of
  // each fold is left unpainted, while its inward-facing face gathers ink.
  for(let j=0;j<Math.floor(w/16)*detail;j++){
    const x=minX+j*16/detail+(r()-.5)*12,y=minY+r()*h*.42,drift=(x-(minX+w*.48))*.14;
    let xx=x,yy=y;const points=[[xx,yy]];
    while(yy<maxY+10){xx+=drift*.12+(r()-.5)*12;yy+=10+r()*23;points.push([xx,yy]);}
    const edge=points.map(([x,y],i)=>[x+5+Math.sin(i)*9,y+4]);
    c.save();c.globalAlpha=(.045+r()*.13)*depth;poly(c,[...points,...edge.reverse()],'#283e2f');c.restore();
    // Broken fibers, with light gaps left at the turns, avoid the clean long
    // branching lines that would read as a vector map of a cliff.
    for(let z=0;z<points.length-1;z++)if(z%4!==2){
      const a=points[z],b=points[z+1];dryStroke(c,[a,[b[0],b[1]-3]],'#344335',.7+r()*1.6,seed+j*31+z);
      stroke(c,[[a[0]+1.5,a[1]+1],[b[0]+2.4,b[1]-4]],'#e5e4cf',.5,.32);
    }
    if(j%5===0&&points.length>3){const p=points[2];dryStroke(c,[p,[p[0]-9,p[1]+14],[p[0]-5,p[1]+32]],'#283e2e',1.4,seed+j+220);}
  }
  // Raindrop and short axe-cut texture: thousands of directional brush marks,
  // arranged on the rock rather than uncorrelated dots floating in the sky.
  for(let i=0;i<25000*detail;i++){
    const x=minX+r()*w,y=minY+r()*h,l=1+r()*5.8,dir=Math.sin(x*.019+y*.004)*.8;
    const face=.4+.6*Math.max(0,Math.sin(x*.07+y*.012));
    stroke(c,[[x,y],[x+dir*l*.45,y+l]],'#293d2f',.3+r()*.85,(.12+r()*.3)*depth*face);
    if(i%7===0)stroke(c,[[x+1.3,y],[x+2.4,y+l*.6]],'#f2ecd5',.4,.35);
  }
  // Crown darkens with clustered small trees growing on ledges.
  for(let i=0;i<430*detail;i++){
    const x=minX+r()*w,y=minY+12+r()*h*.8;
    if(r()>.25)ellipse(c,x,y,.6+r()*1.4,.5+r()*.8,'#29413235');
  }
  c.restore();
  // The contour stays dry and intermittent; no single even vector outline.
  for(let i=0;i<rim.length-1;i++)if(i%7<4)stroke(c,[rim[i],rim[i+1]],'#354c38',.35+depth*.55,.35);
  // The wet lower edge dissolves into unpainted mist instead of terminating
  // at the polygon's perfectly horizontal base.
  c.save();c.globalCompositeOperation='destination-out';
  const fade=c.createLinearGradient(0,maxY-90,0,maxY+1);fade.addColorStop(0,'#00000000');fade.addColorStop(.6,'#00000088');fade.addColorStop(1,'#000000ff');c.fillStyle=fade;c.fillRect(0,maxY-90,1000,100);c.restore();
  target.drawImage(surface.canvas,0,0,1000,1000);
}
function pine(c,x,y,scale,seed,lean=-1){
  const r=rng(seed);c.save();c.translate(x,y);c.scale(scale,scale);
  const trunk=[[0,0],[-7*lean,-27],[-3*lean,-58],[9*lean,-84],[14*lean,-116],[22*lean,-150]];
  path(c,p=>{p.moveTo(-10,2);p.bezierCurveTo(-2,-22,-14,-41,-7,-60);p.bezierCurveTo(1,-78,15*lean-10,-94,14*lean-5,-116);p.lineTo(22*lean-3,-151);p.lineTo(22*lean+3,-152);p.bezierCurveTo(12*lean+8,-106,8,-87,4,-62);p.bezierCurveTo(-3,-41,10,-21,7,0);p.closePath();},'#263b2f');
  dryStroke(c,trunk,'#b4b59a',3.5,seed+1);
  for(let i=0;i<7;i++){
    const yy=-35-i*17,xx=8*lean+i*2*lean,side=i%2?1:-1,reach=38+r()*31;
    const end=[xx+side*reach,yy-9-r()*16],middle=[xx+side*reach*.55,yy-3];
    stroke(c,[[xx,yy],middle,end],'#263b2f',2.1-i*.11);
    stroke(c,[middle,[middle[0]+side*13,middle[1]-18]],'#263b2f',1.1);
    for(let k=0;k<4;k++){
      const bx=end[0]-side*k*10,by=end[1]+Math.sin(k)*3;
      for(let z=0;z<5;z++)ellipse(c,bx+(r()-.5)*22,by-2+r()*5,2+r()*6,1+r()*2,'#2c403027');
      for(let n=0;n<15;n++){
        const a=-Math.PI*.85+r()*Math.PI*1.6,l=8+r()*14;
        stroke(c,[[bx,by],[bx+Math.cos(a)*l,by+Math.sin(a)*l]],'#263c30',.45+r()*.45,.6+r()*.3);
      }
    }
  }
  for(let i=0;i<5;i++)dryStroke(c,[[0,-3],[lean*12+i*6,9+i*2],[lean*24+i*9,11+i*3]],'#263b2f',2,seed+i+50);
  c.restore();
}
function boulder(c,x,y,w,h,seed){
  const pts=[[x-w*.5,y],[x-w*.58,y-h*.5],[x-w*.24,y-h],[x+w*.1,y-h*.93],[x+w*.51,y-h*.55],[x+w*.5,y]];
  wash(c,pts,'#3d5140',.15,seed);dryStroke(c,pts,'#334a37',1.7,seed+1);
  dryStroke(c,[[x-w*.24,y-h],[x-w*.1,y-h*.4],[x+w*.2,y]],'#334a37',1.5,seed+2);
  const r=rng(seed);for(let i=0;i<40;i++){const xx=x+(r()-.5)*w*.6,yy=y-r()*h*.68;stroke(c,[[xx,yy],[xx+4,yy+2]],'#42513b',.5,.35);}
}
export function createAssets({paper:paperTexture,brushAtlas}={}){
  const {canvas,ctx:c}=makeSurface(4000,4000);c.scale(4,4);paper(c);if(paperTexture){c.globalAlpha=.25;c.drawImage(paperTexture,0,0);c.globalAlpha=1;}
  // Original distant ridge rhythm, deliberately asymmetrical and modest in ink.
  mountain(c,[[0,622],[19,532],[48,523],[62,463],[93,448],[108,409],[130,416],[155,453],[181,468],[205,525],[249,563],[279,634]],201,{tone:'#b1b8a16b',depth:.28,detail:.4});
  mountain(c,[[611,633],[661,551],[699,537],[719,485],[749,466],[778,409],[795,403],[817,428],[833,424],[855,466],[891,484],[911,534],[948,562],[985,628]],202,{tone:'#a7b19a7d',depth:.33,detail:.45});
  mountain(c,WEST,303,{tone:'#7d8b738a',depth:.65,detail:1});
  mountain(c,PEAK.map(([x,y])=>[x,y+20*Math.max(0,1-(y-245)/200)]),503,{tone:'#506850bb',depth:1,detail:1.6});
  // An exposed pale gully and slender falls split the giant rock without a
  // decorative blue stream. Their edges are irregular broken dry brush.
  path(c,p=>{p.moveTo(474,344);p.lineTo(467,392);p.lineTo(477,437);p.lineTo(465,486);p.lineTo(469,531);p.lineTo(450,581);p.lineTo(454,616);p.lineTo(461,612);p.lineTo(456,582);p.lineTo(475,536);p.lineTo(472,486);p.lineTo(482,437);p.lineTo(473,392);p.lineTo(478,344);p.closePath();},'#e2e0cb');
  dryStroke(c,[[468,399],[472,440],[461,485],[465,529],[447,581]],'#4a6149',1.6,880);
  stroke(c,[[473,442],[469,486],[472,532]],'#f7f1da',1.3,.85);
  // Small tree heads at the abrupt upper ledges set the scale of the cliff.
  const r=rng(608);for(let i=0;i<72;i++){
    const x=385+r()*330,y=493+r()*108,rr=1+r()*3;
    stroke(c,[[x,y],[x+.5,y-rr*2]],'#334a37',.6,.7);ellipse(c,x,y-rr*2,rr*1.5,rr,'#31463070');
  }
  // Actual ink wash billows through the base of both mountains. Several soft
  // horizontal fog veils leave near-bank rocks crisp while the cliff dissolves.
  for(const [y,h,a]of[[603,45,.55],[634,35,.72],[657,27,.86]]){
    const g=c.createLinearGradient(0,y-h,0,y+h);g.addColorStop(0,'#e9e4d300');g.addColorStop(.5,`rgba(233,228,211,${a})`);g.addColorStop(1,'#e9e4d300');c.fillStyle=g;c.fillRect(0,y-h,1000,h*2);
  }
  // Middle shore, low temple roofs and a narrow switchback disappear into fog.
  wash(c,[[0,666],[92,651],[180,664],[243,655],[291,670],[423,666],[534,673],[667,655],[748,655],[837,649],[1000,665],[1000,696],[0,696]],'#7a866e',.13,510);
  for(let i=0;i<4;i++){
    const x=270+i*20,y=645+(i%2)*4;stroke(c,[[x,y],[x+8,y-5],[x+19,y]],'#60735b',1.2,.7);stroke(c,[[x+3,y],[x+3,y+7],[x+16,y+7],[x+16,y]],'#6d7e63',.6,.7);
  }
  dryStroke(c,[[196,677],[296,674],[349,679],[430,678],[482,684],[546,678],[589,681]],'#829075',1,509);
  for(let i=0;i<13;i++){const x=20+i*81,y=728+Math.sin(i*2.3)*6;boulder(c,x,y,16+r()*28,6+r()*13,700+i);}
  // Anchoring near-bank stones and the asymmetric foreground pines.
  boulder(c,124,743,149,65,908);boulder(c,192,736,75,38,909);boulder(c,942,745,129,54,910);
  pine(c,121,723,1.06,920,-1);pine(c,179,727,.74,921,1);pine(c,953,727,.84,923,-1);
  for(let i=0;i<24;i++){
    const x=r()*1000,y=730+r()*20;if(x>240&&x<840)continue;
    dryStroke(c,[[x,y],[x-3,y-10-r()*12],[x-8,y-14-r()*8]],'#52634a',.8,930+i);
  }
  if(brushAtlas){
    c.save();c.globalAlpha=.045;c.globalCompositeOperation='multiply';c.drawImage(brushAtlas,0,0,512,512,355,303,290,290);c.restore();
  }
  return Object.freeze({painting:canvas});
}
export function drawBackground(c,{assets}){c.drawImage(assets.painting,0,0,1000,1000);}
export function drawRoad(c){
  // Level wheel contact is hidden in the pale mountain path, with slight
  // parallel dry fibres below it instead of a modern ruled highway.
  dryStroke(c,[[0,700],[137,700],[292,700],[451,700],[605,700],[798,700],[1000,700]],'#778169',1.4,1006);
  dryStroke(c,[[0,703],[173,703],[350,703],[542,704],[728,703],[1000,703]],'#a6ad91',.7,1007);
}
export function cameraAt(u){
  const shrink=smooth((u-.8)/.65),returning=smooth((u-4.25)/1.55),reveal=smooth((u-1.8)/.95)*(1-returning);
  // The discovery push keeps the lower cliff and mist in the composition;
  // an extreme fivefold crop showed only blank fog above the small rider.
  return {zoom:1+1.6*reveal,riderScale:1-.935*shrink*(1-returning)+.045*reveal};
}
export function drawRider(c,t){
  const p=poseAt(t);c.save();c.lineCap='round';c.lineJoin='round';
  // Sparse, uneven ink circles are legible at the scale of a travelling ant.
  for(const x of[0,180]){
    const pts=[];for(let i=0;i<=40;i++){const a=i*Math.PI/20;pts.push([x+Math.cos(a)*(44+Math.sin(i*2.4)*.45),Math.sin(a)*44]);}
    stroke(c,pts,INK,2.4);for(let i=0;i<6;i++){const a=p.wheelAngle+i*Math.PI/3;stroke(c,[[x,0],[x+Math.cos(a)*42,Math.sin(a)*42]],INK,.8,.7);}
  }
  const leg=(side,color)=>{const k=p['knee'+side],a=p['ankle'+side];stroke(c,[[58,-126],[k.x,k.y],[a.x,a.y]],color,3.3);stroke(c,[[a.x-7,a.y],[a.x+14,a.y+2]],color,3.4);};leg('Right','#75806a');
  stroke(c,[[0,0],[62,-79],[80,-22],[0,0]],INK,2.7);stroke(c,[[62,-79],[147,-76],[80,-22]],INK,2.7);stroke(c,[[147,-76],[180,0]],INK,3);
  stroke(c,[[62,-79],[58,-115]],INK,2);stroke(c,[[42,-115],[74,-115]],INK,3.8);stroke(c,[[147,-76],[153,-98],[174,-96],[175,-85]],INK,2.5);
  stroke(c,[[0,-4],[81,-33],[91,-23],[82,-11],[0,4]],INK,.9);ellipse(c,80,-22,11,11,null,INK,1);stroke(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],INK,2.2);leg('Left',INK);
  // Dry breast and wing masses with a reed-like neck give this rider its own
  // brush grammar; its white throat is the paper showing between two strokes.
  path(c,q=>{q.moveTo(-5,-144);q.lineTo(24,-149);q.bezierCurveTo(39,-168,64,-171,80,-156);q.bezierCurveTo(66,-184,75,-217,96,-227);q.bezierCurveTo(107,-233,120,-229,125,-218);q.bezierCurveTo(130,-202,112,-200,101,-203);q.bezierCurveTo(98,-180,115,-166,106,-146);q.bezierCurveTo(94,-118,50,-111,23,-128);q.closePath();},'#465c44');
  path(c,q=>{q.moveTo(120,-216);q.lineTo(222,-207);q.lineTo(216,-202);q.lineTo(170,-199);q.bezierCurveTo(153,-178,129,-183,121,-201);q.closePath();},'#e0dfca',INK,1.5);
  stroke(c,[[125,-209],[216,-207]],INK,1.2);stroke(c,[[131,-199],[147,-191],[165,-198]],'#6b7960',1);
  path(c,q=>{q.moveTo(22,-150);q.bezierCurveTo(46,-177,73,-157,88,-135);q.bezierCurveTo(64,-141,41,-131,22,-150);q.closePath();},'#233b2d');
  dryStroke(c,[[30,-151],[52,-146],[73,-140]],'#c4cab0',2.4,5004);dryStroke(c,[[81,-210],[77,-193],[84,-171]],'#b7c0a6',2.5,5005);
  path(c,q=>{q.moveTo(79,-152);q.bezierCurveTo(97,-131,108,-107,133,-97);q.lineTo(170,-85);q.lineTo(168,-81);q.bezierCurveTo(128,-88,99,-97,84,-126);q.closePath();},'#4c6047',INK,1.1);
  ellipse(c,114,-218,2.4,2.1,'#172d22');dryStroke(c,[[1,-142],[29,-132],[54,-128]],'#d7dbc0',2.2,5006);c.restore();
}
export function drawTitle(c){
  c.save();
  // A vertical inscription sits in the empty sky; the bilingual line stays
  // readable while the landscape itself makes its enormous camera movement.
  for(const [i,ch]of[...'宋代山水'].entries())text(c,ch,109,129+i*51,44,'#354a38',{bold:true});
  text(c,'SONG LANDSCAPE',179,131,27,'#3e5440',{family:'Georgia'});text(c,'约1000年',180,174,26,'#4c6048');
  c.fillStyle='#9d4d3b';c.fillRect(111,307,31,32);text(c,'墨',126,331,22,'#e7dfc8',{align:'center'});c.restore();
}
