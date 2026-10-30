import {makeSurface,rng,stroke,ellipse,path,poly} from '../kit/art.js';
import {poseAt} from '../rig/pose.js';
import {text,smooth} from '../kit/materials.js';
export const frameColor='#6e705e';
const INK='#3d4035',PAPER='#f0eadb';
// A sampled cubic uses a pressure envelope, so the line actually widens under
// the brush and tapers at its release instead of receiving a uniform filter.
function curve(c,a,b,d,e,width=1,color=INK){let prev=a;for(let i=1;i<=42;i++){const u=i/42,v=1-u,p=[v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*d[0]+u*u*u*e[0],v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*d[1]+u*u*u*e[1]];stroke(c,[prev,p],color,width*(.18+.82*Math.sin(Math.PI*u)**.8));prev=p;}}
function petal(c,x,y,a,s){const xx=x+Math.cos(a)*s,yy=y+Math.sin(a)*s;curve(c,[x,y],[xx-Math.sin(a)*9,yy+Math.cos(a)*9],[xx+Math.sin(a)*5,yy-Math.cos(a)*5],[x,y],.75);}
function peony(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);curve(c,[0,48],[16,18],[-8,-7],[0,-23],1.2);for(let ring=0;ring<3;ring++)for(let i=0;i<8+ring*3;i++)petal(c,Math.cos(i)*3,Math.sin(i*2)*3,i*Math.PI*2/(8+ring*3)+ring*.31,11+ring*10);for(const [xx,yy,side]of[[7,26,1],[-2,12,-1]]){curve(c,[xx,yy],[xx+side*22,yy-18],[xx+side*30,yy-8],[xx+side*40,yy-13],1);curve(c,[xx+side*40,yy-13],[xx+side*28,yy+8],[xx+side*16,yy+5],[xx,yy],.65);curve(c,[xx,yy],[xx+side*13,yy-3],[xx+side*25,yy-9],[xx+side*39,yy-13],.6);}c.restore();}
export function createAssets({paper}={}){const{canvas,ctx:c}=makeSurface(1500,1500);c.scale(1.5,1.5);c.fillStyle=PAPER;c.fillRect(0,0,1000,1000);if(paper){c.globalAlpha=.32;c.drawImage(paper,0,0);c.globalAlpha=1;}
  // An airy garden: contours only, without the wet mountain washes of05.
  const rocks=[[[0,675],[18,628],[44,617],[67,568],[95,582],[111,624],[151,641],[165,678]],[[190,684],[195,655],[212,641],[230,649],[244,630],[267,655],[279,684]]];
  for(const pts of rocks){for(let i=0;i<pts.length-1;i++)curve(c,pts[i],pts[i],[pts[i+1][0]-4,pts[i+1][1]+3],pts[i+1],1.25);for(let i=1;i<pts.length-2;i++)curve(c,pts[i],[pts[i][0]+7,pts[i][1]+14],[pts[i][0]-6,pts[i][1]+24],[pts[i][0]+10,676],.55);}
  peony(c,157,595,.85);peony(c,214,614,.58);peony(c,89,581,.53);
  // Slender outlined pavilion, secluded behind the willow rather than centered.
  for(const pts of[[[641,562],[727,550],[805,562]],[[648,566],[727,557],[799,567]],[[660,567],[660,620]],[[789,568],[789,621]],[[671,618],[780,618]],[[671,622],[780,622]],[[681,575],[681,612]],[[771,575],[771,612]]])stroke(c,pts,'#989d87',.75);
  curve(c,[633,562],[659,563],[670,547],[690,545],.8,'#929982');curve(c,[806,562],[787,563],[777,550],[764,547],.8,'#929982');
  // Willow branches bow with many discrete long leaves; their white interiors
  // keep the entire scene in the fine-line tradition.
  curve(c,[1000,330],[869,355],[890,468],[819,541],2);curve(c,[1000,335],[952,420],[928,452],[957,576],1.3);curve(c,[952,369],[852,394],[842,425],[790,453],1.1);
  const r=rng(411);for(let k=0;k<13;k++){const x=795+r()*205,y=381+r()*134,endY=y+65+r()*87;curve(c,[x,y],[x-14,y+28],[x+13,endY-25],[x-10,endY],.72);for(let n=0;n<8;n++){const yy=y+n*(endY-y)/8,xx=x+Math.sin(n*.8)*4;curve(c,[xx,yy],[xx-9,yy+8],[xx-13,yy+21],[xx-16,yy+28],.65);curve(c,[xx,yy],[xx+5,yy+9],[xx+8,yy+17],[xx+8,yy+22],.5);}}
  curve(c,[350,649],[411,631],[458,640],[514,622],.6,'#a6aa94');curve(c,[416,657],[470,638],[555,659],[623,643],.55,'#a6aa94');return Object.freeze({scroll:canvas});}
export function drawBackground(c,{assets}){c.drawImage(assets.scroll,0,0,1000,1000);}
export function drawRoad(c){curve(c,[0,700],[270,700],[730,700],[1000,700],1.2,'#787e68');curve(c,[0,706],[270,706],[730,706],[1000,706],.4,'#b0b39d');}
export function drawRider(c,t){const p=poseAt(t),u=t-23,unfurl=smooth((u-1.8)/.7)*(1-.3*smooth((u-4.7)/.9));c.save();
  // Paired silk contours lengthen at the middle bar. Their folds breathe with
  // absolute time, while the bicycle and leg joints retain the common phase.
  for(let k=0;k<2;k++){const y=-168+k*13,L=60+94*unfurl,flutter=Math.sin(t*5+k)*7;curve(c,[83,y],[35,y-16],[-L*.3,y+flutter],[-L,y-18+k*13],1.3-k*.35);curve(c,[80,y+6],[31,y-10],[-L*.3,y+flutter+7],[-L+3,y-11+k*13],.6);curve(c,[-L,y-18+k*13],[-L-8,y-12],[-L+12,y-7],[-L+3,y-11+k*13],.8);}
  for(const x of[0,180]){ellipse(c,x,0,44,44,null,INK,1.9);ellipse(c,x,0,41.2,41.2,null,INK,.5);for(let i=0;i<16;i++){const a=p.wheelAngle+i*Math.PI/8;stroke(c,[[x,0],[x+41*Math.cos(a),41*Math.sin(a)]],INK,.55);}}
  const leg=(s,w)=>{const k=p['knee'+s],a=p['ankle'+s];curve(c,[58,-126],[k.x-4,k.y-9],[k.x,k.y],[a.x,a.y],w);curve(c,[a.x-8,a.y],[a.x,a.y-2],[a.x+11,a.y],[a.x+16,a.y+2],1.1);};leg('Right',1.1);
  for(const pts of[[[0,0],[62,-79],[80,-22],[0,0]],[[62,-79],[147,-76],[80,-22]],[[147,-76],[180,0]],[[62,-79],[58,-115]]])stroke(c,pts,INK,1.5);
  curve(c,[147,-76],[150,-104],[177,-106],[175,-85],1.7);curve(c,[41,-115],[52,-118],[65,-118],[74,-115],1.8);ellipse(c,80,-22,11,11,null,INK,.9);stroke(c,[[p.ankleRight.x,p.ankleRight.y],[80,-22],[p.ankleLeft.x,p.ankleLeft.y]],INK,1.4);leg('Left',1.65);
  // Delicate open neck and overlapping flight feathers; no filled cartoon mass.
  curve(c,[27,-134],[1,-137],[-5,-151],[13,-148],1.2);curve(c,[13,-148],[29,-180],[64,-178],[81,-154],1.7);curve(c,[81,-154],[68,-184],[75,-218],[97,-228],1.5);curve(c,[97,-228],[110,-235],[124,-229],[126,-216],1.7);curve(c,[126,-216],[128,-202],[113,-198],[102,-204],1.1);curve(c,[102,-204],[99,-184],[113,-167],[106,-146],1.5);curve(c,[106,-146],[92,-117],[51,-112],[27,-134],1.8);
  curve(c,[121,-217],[149,-220],[198,-211],[222,-207],1.4);curve(c,[222,-207],[213,-201],[188,-205],[173,-198],.8);curve(c,[173,-198],[154,-179],[131,-181],[121,-201],1.3);curve(c,[126,-209],[164,-208],[196,-207],[216,-207],.65);
  for(let i=0;i<9;i++){const x=25+i*5,y=-157+Math.sin(i*.8)*3;curve(c,[x,y],[x+13,y-12],[x+32,-133],[x+26,-133+i*.6],.75+i*.035);}
  for(let i=0;i<4;i++)curve(c,[31+i*11,-128],[40+i*9,-124],[47+i*8,-123],[55+i*8,-122],.7);
  curve(c,[77,-153],[103,-132],[103,-110],[133,-99],1.6);curve(c,[133,-99],[145,-94],[156,-86],[169,-85],1.1);curve(c,[78,-146],[97,-119],[104,-104],[132,-94],.7);curve(c,[132,-94],[146,-89],[157,-82],[168,-81],.8);
  ellipse(c,115,-218,3.8,3.2,null,INK,.7);ellipse(c,116,-218,1.1,1.3,INK);curve(c,[104,-225],[109,-227],[116,-226],[120,-225],.7);curve(c,[84,-219],[76,-224],[75,-228],[71,-228],.6);c.restore();}
export function drawTitle(c){c.save();text(c,'唐代白描',103,150,50,INK,{bold:true});text(c,'TANG LINE DRAWING',105,199,27,'#69705e',{family:'Georgia'});text(c,'约750年',105,244,26,INK);curve(c,[105,266],[197,263],[319,269],[436,266],.9);c.restore();}
