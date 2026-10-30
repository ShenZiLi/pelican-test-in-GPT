import {poseAt} from '../rig/pose.js';
import {rect,line,ellipse} from '../kit/draw.js';

// The source pane, exported SVG and canvas all consume these eight real groups.
// The source pane shows the <use> lines; their full path definitions are folded.
const C={bg:'#101c23',panel:'#14232b',edge:'#30444a',ivory:'#eeeee1',cyan:'#a8d6c7',gold:'#d8bb80',muted:'#789398'};
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const GROUPS=[
  ['wheels',.24,.79],['bicycle',.79,1.22],['legs',1.22,1.48],
  ['contour',1.48,2.05],['bill',2.05,2.42],['wing',2.42,2.82],
  ['feathers',2.82,3.23],['gaze',3.23,3.55],
];
const COMPLETE=3.55,DEPART=4.55;
const lengths=new Map(),paths=new Map();

function sceneGraph(at){
  const p=poseAt(at),groups=GROUPS.map(([id,start,end])=>({id,start,end,items:[]}));
  let group;
  const path=(d,fill,stroke,width=1)=>group.items.push({d,fill:fill||'none',stroke:stroke||'none',width});
  const circle=(x,y,r,fill,stroke,width=1)=>path(`M ${x+r} ${y} A ${r} ${r} 0 1 0 ${x-r} ${y} A ${r} ${r} 0 1 0 ${x+r} ${y}`,fill,stroke,width);
  const poly=(pts,color,width)=>path(pts.map(([x,y],i)=>`${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' '),null,color,width);
  group=groups[0];
  // Fine steel wheels, individually laced spokes and concentric machined hubs.
  for(const x of [-106,111]){
    circle(x,-62,62,'#13262c',C.ivory,2.25);
    circle(x,-62,58.2,null,'#789f9f',.7);
    circle(x,-62,55.8,null,'#36575d',.55);
    for(let j=0;j<24;j++){
      const a=p.wheelAngle+j*Math.PI/12,h=a+(j%2?.39:-.39);
      poly([[x+Math.cos(h)*5,-62+Math.sin(h)*5],[x+Math.cos(a)*55.6,-62+Math.sin(a)*55.6]],j%2?'#5a8083':'#8aaba8',.55);
    }
    circle(x,-62,6.2,C.gold,C.ivory,.65);
    circle(x,-62,2.1,C.bg,null);
    path(`M ${x-38} -110 Q ${x-4} -128 ${x+26} -115`,null,'#e7eedc',.8);
  }
  group=groups[1];
  path('M -106 -62 L -51 -150 L -8 -71 Z M -51 -150 L 65 -150 L -8 -71 M 65 -150 L 111 -62 L -8 -71',null,C.cyan,3.3);
  path('M -103 -63 L -51 -146 L -10 -72 M -48 -148 L 64 -148',null,'#eff2e2',.7);
  path('M 111 -62 L 66 -160 L 64 -181 Q 78 -195 93 -190 L 99 -185',null,C.ivory,3.2);
  path('M 88 -191 Q 100 -190 100 -183',null,C.gold,4.3);
  path('M 69 -181 Q 47 -166 78 -114 Q 95 -85 106 -66',null,'#7faaa7',.65);
  path('M -51 -150 L -55 -172',null,C.ivory,3);
  path('M -79 -174 Q -57 -182 -35 -174 L -39 -169 L -75 -169 Z',C.gold,C.ivory,.9);
  circle(-8,-71,18,null,C.gold,1.5);circle(-8,-71,13,null,'#728b7b',.6);
  path('M -106 -68 L -8 -89 M -106 -57 L -8 -53',null,'#789994',.9);
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;poly([[-8+Math.cos(a)*6,-71+Math.sin(a)*6],[-8+Math.cos(a)*15,-71+Math.sin(a)*15]],'#7d9e91',.7);}
  group=groups[2];
  for(const i of [1,0]){
    const f=p.feet[i],k=p.knees[i];
    poly([[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],i?'#7c9e95':C.gold,i?3:3.8);
    circle(k.x,k.y,2.3,C.ivory,null);
    poly([[-8,-71],[f.x,f.y]],C.gold,2);
    poly([[f.x-10,f.y],[f.x+12,f.y]],C.ivory,3.1);
    poly([[f.x-7,f.y+3],[f.x+9,f.y+3]],'#598584',.7);
  }
  circle(-8,-71,3.8,C.ivory,C.bg,.8);
  group=groups[3];
  // A long S-neck, low breast, tapering tail: a bespoke contour for the finale.
  path('M -110 -208 L -152 -218 L -127 -223 L -145 -236 L -115 -229 L -127 -248 L -93 -232 Z','#d4dfce',C.cyan,1.15);
  path('M -111 -210 C -137 -230 -116 -260 -87 -269 C -54 -280 -23 -266 -6 -249 C -17 -280 -13 -318 7 -344 C 21 -365 49 -374 69 -360 C 89 -347 91 -324 72 -311 C 55 -299 48 -279 54 -255 C 64 -230 50 -207 21 -194 C -23 -177 -77 -189 -111 -210 Z',C.ivory,C.cyan,1.65);
  path('M -4 -251 C -11 -282 -5 -318 15 -342 C 28 -358 48 -365 64 -354',null,'#a1b7a8',1);
  path('M 42 -298 C 28 -277 35 -250 36 -234 C 37 -220 31 -208 22 -204',null,'#9bb5a5',1.2);
  path('M 46 -287 C 40 -268 46 -250 46 -239',null,'#d0d9c1',2.8);
  path('M -98 -209 Q -51 -185 -12 -193 M -85 -205 Q -51 -191 -27 -196',null,'#9ab6a7',.8);
  path('M -111 -213 L -136 -220 M -110 -220 L -129 -230 M -104 -225 L -117 -238',null,'#7d9c91',.7);
  group=groups[4];
  // The pouch is a genuine hanging membrane, distinct from the straight upper bill.
  path('M 72 -331 Q 119 -296 160 -290 Q 194 -288 218 -324 L 87 -335 Z','#aabda5',C.cyan,1.15);
  path('M 86 -329 Q 125 -304 163 -299 Q 190 -296 209 -322',null,'#e4e5c9',.8);
  path('M 98 -324 Q 127 -309 155 -305 M 119 -320 Q 145 -307 174 -308 M 139 -317 Q 167 -307 190 -315',null,'#718e7a',.65);
  path('M 74 -350 L 250 -333 Q 234 -326 216 -325 L 77 -329 L 66 -338 Z',C.gold,'#f1dbac',1.15);
  path('M 79 -341 L 238 -333 M 86 -331 L 213 -328',null,'#736f53',.7);
  path('M 221 -330 Q 238 -328 249 -333',null,'#ede8c5',.8);
  group=groups[5];
  path('M -100 -246 C -70 -265 -25 -254 3 -222 C -14 -207 -53 -198 -89 -214 C -105 -221 -111 -235 -100 -246 Z','#d6e1d2','#8db0a0',1.15);
  // Long primaries overlap in the direction of the folded wing, with dark tips.
  for(let j=0;j<10;j++){
    const x=-95+j*7.8,y=-242+j*.95,tx=-112+j*11.6,ty=-211+j*.35;
    path(`M ${x} ${y} C ${x+17} ${y+5} ${x+27} ${y+18} ${tx+13} ${ty-1} Q ${tx+4} ${ty+5} ${tx} ${ty} C ${x+7} ${y+15} ${x-2} ${y+5} ${x} ${y} Z`,j%2?'#c0d0bd':'#e4e8d5','#829d8c',.65);
    path(`M ${x+2} ${y+4} Q ${x+12} ${y+16} ${tx+3} ${ty-1}`,null,'#f2efdb',.45);
  }
  group=groups[6];
  path('M -98 -246 C -73 -266 -31 -253 -10 -233 C -31 -236 -44 -230 -58 -234 C -76 -230 -92 -233 -98 -246 Z','#eef0de','#a2b9a5',.85);
  for(let row=0;row<3;row++)for(let j=0;j<7-row;j++){
    const x=-88+j*10+row*7,y=-246+row*6+Math.sin(j*.6)*2;
    path(`M ${x} ${y} q 4 7 10 6 q -1 -4 -3 -5`,null,row===2?'#839f8e':'#a5bca5',.65);
  }
  path('M -78 -260 Q -57 -264 -39 -256 M -82 -256 Q -63 -259 -48 -254 M -5 -244 Q 12 -230 28 -211',null,'#8ba895',.7);
  path('M 1 -225 Q 22 -214 36 -190 L 86 -191',null,C.ivory,3.4);
  path('M 3 -225 Q 21 -214 36 -190',null,'#8fac9f',.8);
  circle(36,-190,2.6,C.gold,null);
  group=groups[7];
  circle(65,-347,6.3,'#f5f1db','#698f83',1);
  circle(67,-347,3,C.bg,null);circle(67.8,-348.3,.9,'#fff',null);
  path('M 53 -356 Q 61 -361 70 -356 M 77 -347 L 91 -344',null,'#75998c',.85);
  path('M 26 -349 Q 34 -357 42 -358 M 21 -344 Q 28 -352 34 -352',null,'#9bb39c',.65);
  // Body bob affects the bird and wing, while the wheels stay on the ground.
  for(const g of groups.slice(3))for(const o of g.items)o.bob=p.bob;
  return groups;
}
const esc=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function elementSource(o){
  return `<path d="${esc(o.d)}" fill="${o.fill}" stroke="${o.stroke}" stroke-width="${o.width}"${o.bob===undefined?'':` transform="translate(0 ${o.bob.toFixed(3)})"`}/>`;
}
const useSource=id=>`<use href="#${id}"/>`;
export function pelicanSVG(at=119.1){
  const groups=sceneGraph(at);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-170 -385 450 395" fill="none" stroke-linecap="round" stroke-linejoin="round">\n<defs>\n${groups.map(g=>`<g id="${g.id}">\n${g.items.map(elementSource).join('\n')}\n</g>`).join('\n')}\n</defs>\n${groups.map(g=>useSource(g.id)).join('\n')}\n</svg>`;
}
function drawElement(c,o,q=1){
  if(q<=0)return;
  if(!paths.has(o.d))paths.set(o.d,new Path2D(o.d));
  const path=paths.get(o.d);c.save();const alpha=c.globalAlpha;c.translate(0,o.bob||0);
  if(o.fill!=='none'&&q>.55){c.globalAlpha*=smooth((q-.55)/.45);c.fillStyle=o.fill;c.fill(path);}
  c.globalAlpha=alpha;
  if(o.stroke!=='none'){
    c.strokeStyle=o.stroke;c.lineWidth=o.width;
    if(q<1){
      if(!lengths.has(o.d)){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',o.d);lengths.set(o.d,p.getTotalLength());}
      const len=lengths.get(o.d);c.setLineDash([Math.max(.001,len*q),len+1]);
    }
    c.stroke(path);
  }
  c.restore();
}
function drawGroups(c,groups,t,complete=false){
  c.lineCap='round';c.lineJoin='round';
  for(const g of groups){
    const u=complete?1:clamp((t-g.start)/(g.end-g.start));
    g.items.forEach((o,i)=>{
      // Items begin in source order; the selected source line remains lit throughout.
      const q=complete?1:clamp((u-.48*i/Math.max(1,g.items.length-1))/.52);
      drawElement(c,o,q);
    });
  }
}
function ui(c,s,x,y,size,color=C.ivory,weight=400,align='left',mono=false){
  c.save();c.font=`${weight} ${size}px ${mono?'"Cascadia Code", Consolas, monospace':'"Noto Serif SC", serif'}`;c.fillStyle=color;c.textAlign=align;c.fillText(s,x,y);c.restore();
}
function codeLine(c,id,x,y){
  const bits=[['<use ',C.cyan],['href',C.ivory],['=',C.muted],[`"#${id}"`,C.gold],['/>',C.cyan]];
  c.save();c.font='20px "Cascadia Code", Consolas, monospace';
  for(const [s,color]of bits){c.fillStyle=color;c.fillText(s,x,y);x+=c.measureText(s).width;}c.restore();
}
function motionState(t,scene){
  const u=clamp((t-DEPART)/(6-DEPART)),s=smooth(u);
  return {x:686+(1070-686)*s,y:805,scale:1.1-.1*s,at:(scene.start||119)+.1+Math.max(0,t-DEPART)};
}
function editor(c,t){
  rect(c,0,0,1000,1000,C.bg);
  ui(c,'</>',42,128,56,C.cyan,400,'left',true);
  ui(c,'VECTOR / MOTION',166,110,28,C.ivory,500,'left',true);
  ui(c,'An executable drawing.',168,151,24,C.muted);
  ui(c,'20',957,110,30,C.gold,400,'right',true);
  rect(c,30,223,940,621,C.panel,C.edge,1);
  rect(c,30,223,940,48,'#1b2b32');
  for(let i=0;i<3;i++)ellipse(c,52+i*17,247,3.2,3.2,['#a3b9a8',C.gold,'#6e9295'][i]);
  ui(c,'pelican.svg',119,254,20,C.ivory,400,'left',true);
  ui(c,'LIVE',940,254,16,C.cyan,500,'right',true);ellipse(c,881,247,3,3,C.cyan);
  line(c,[[30,271],[970,271]],C.edge,1);
  rect(c,449,272,520,571,'#112027');
  line(c,[[449,271],[449,843]],C.edge,1);
  ui(c,'SOURCE',52,312,16,C.muted,500,'left',true);
  ui(c,'8 definitions folded',421,312,14,C.muted,400,'right',true);
  let active=GROUPS.findIndex(([,a,b])=>t>=a&&t<b);
  if(t>=COMPLETE)active=-1;
  for(let i=0;i<GROUPS.length;i++){
    const [id,a,b]=GROUPS[i],y=370+i*47;
    if(i===active){rect(c,31,y-29,417,43,'#264046');rect(c,31,y-29,3,43,C.gold);}
    ui(c,String(i+1).padStart(2,'0'),53,y,17,i===active?C.gold:'#69858b',400,'left',true);
    c.save();if(t<a)c.globalAlpha=.45;codeLine(c,id,95,y);c.restore();
    if(t>=b)ui(c,'·',424,y,18,C.cyan,400,'right',true);
  }
  line(c,[[51,763],[427,763]],C.edge,1);
  ui(c,t<COMPLETE?'SVG → PATH':'SVG VALID',52,802,17,t<COMPLETE?C.gold:C.cyan,500,'left',true);
  ui(c,t<COMPLETE?'DRAWING':'0 ERRORS',426,802,16,C.muted,400,'right',true);
  ui(c,'VIEWBOX  −170 −385 450 395',471,310,14,C.muted,400,'left',true);
  // Drafting ticks frame the work; the bird itself remains the brightest object.
  c.save();c.globalAlpha=.17;
  for(let x=475;x<970;x+=40)line(c,[[x,332],[x,805]],'#45636b',.65);
  for(let y=365;y<=805;y+=40)line(c,[[450,y],[968,y]],'#45636b',.65);
  c.restore();
  line(c,[[471,805],[966,805]],'#4e7378',1);
  for(let x=475;x<970;x+=40)line(c,[[x,805],[x,811]],'#6a8c8d',1);
  // The preview border becomes a deliberate exit only after the finished hold.
  const door=smooth((t-4.42)/.25);
  if(door>0){
    c.save();c.globalAlpha=door;
    rect(c,966,397,5,431,'#112027');
    line(c,[[966,397],[966,374],[997,374]],C.cyan,1.6);
    line(c,[[966,827],[966,844],[997,844]],C.cyan,1.6);
    line(c,[[967,805],[1000,805]],C.cyan,1.2);
    c.restore();
  }
  ui(c,t<COMPLETE?'GEOMETRY / IN PROGRESS':t<DEPART?'COMPLETE / HOLD':'PORTAL / OPEN',471,870,15,t<COMPLETE?C.muted:C.cyan,400,'left',true);
  line(c,[[43,901],[957,901]],C.edge,1);
  ui(c,'从一行代码，到一次远行。',500,950,29,C.ivory,400,'center');
  ui(c,'ORIGINAL SVG',43,983,13,C.muted,400,'left',true);
  ui(c,'20 / 20',957,983,14,C.gold,400,'right',true);
}

// Full square composition. The gallery must not draw an independent hero over it.
export function renderGallery(c,t,scene={start:119}){
  editor(c,t);
  if(scene.subject===false)return;
  // Capture the incoming trace into the source; no full bird crosses the code pane.
  if(t>=0&&t<.38){
    c.save();c.globalAlpha=1-clamp(t/.38);
    line(c,[[0,805],[19,805],[31,792],[31,730]],C.cyan,1.8);
    ellipse(c,31,730,3,3,C.gold);c.restore();
  }
  const m=motionState(t,scene);
  c.save();c.beginPath();
  // Normal drawing is clipped inside the preview, including every feather/bill.
  // Ride-out opens only its right edge and never exposes anything over the source.
  c.rect(450,322,t<DEPART?516:900,506);c.clip();
  c.save();c.translate(m.x,m.y);c.scale(m.scale,m.scale);
  drawGroups(c,sceneGraph(m.at),Math.max(0,t));c.restore();c.restore();
}

export function galleryPose(t,scene={start:119}){
  return t<=0?{x:0,y:805,scale:1,captured:true}:motionState(t,scene);
}

// Legacy isolated scene and thumbnail APIs retain their normal subject semantics.
export default function renderAt(c,t,scene={start:119}){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  rect(c,-389,0,1778,1000,C.bg);
  if(scene.subject===false)editor(c,t);else renderGallery(c,t,scene);
}
export function renderSubject(c,t,scene={start:119}){
  const at=(scene.start||119)+t;
  c.save();c.translate(500,805);drawGroups(c,sceneGraph(at),Math.max(0,t));c.restore();
}
