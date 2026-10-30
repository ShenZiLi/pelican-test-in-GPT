import {poseAt} from '../rig/pose.js';
import {text} from '../kit/materials.js';
import {stroke,ellipse} from '../kit/art.js';
const C={bg:'#111b24',panel:'#192936',line:'#304554',text:'#cbd8d3',cyan:'#7ddcc8',white:'#f3eee0',gold:'#dba568',lavender:'#b3a3d4',shadow:'#81999d'};
export const fontText='代码美学年代大模型时代矢量预览路径节点全局相位有效矢量已完成';
const number=n=>Number(n.toFixed(2));
const point=p=>`${number(p.x)} ${number(p.y)}`;
function circlePath(x,y,r){return`M ${x-r} ${y} A ${r} ${r} 0 1 0 ${x+r} ${y} A ${r} ${r} 0 1 0 ${x-r} ${y} Z`;}
export function svgShapes(t){
 const p=poseAt(t),out=[];
 const add=(id,d,fill='none',color=C.shadow,width=1.2)=>out.push({id,d:d.replace(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi,v=>String(number(Number(v)))),fill,stroke:color,width});
 for(const[wi,x]of[0,180].entries()){
  add(`tire-${wi}`,circlePath(x,0,44),'#14222d','#a2b7b5',3.8);
  add(`rim-${wi}`,circlePath(x,0,39),'none',C.white,1.2);
  add(`rim-inner-${wi}`,circlePath(x,0,36),'none','#486d77',.65);
  for(let i=0;i<12;i++){const a=p.wheelAngle+i*Math.PI/6;add(`spoke-${wi}-${i}`,`M ${x} 0 L ${number(x+Math.cos(a)*36)} ${number(Math.sin(a)*36)}`,'none','#718f98',.6);}
  add(`hub-${wi}`,circlePath(x,0,5.8),C.cyan,'#243d4a',1.2);
 }
 // Every support and foot remains coupled to the same kinematic pose.
 add('leg-far',`M ${point(p.hip)} Q ${p.hip.x+6} ${p.hip.y+28} ${point(p.kneeRight)} L ${point(p.ankleRight)}`,'none','#9a8e78',4.2);
 add('frame-main','M 0 0 L 54 -73 L 80 -22 Z M 54 -73 L 128 -73 L 80 -22 M 80 -22 L 180 0 L 128 -73','none','#4e8b9c',6);
 add('frame-sheen','M 1 -2 L 54 -75 L 128 -75 M 81 -24 L 177 -2','none',C.cyan,1);
 add('fork','M 180 0 L 130 -80 Q 129 -91 142 -101 L 157 -102','none','#a8bfc2',4.2);
 add('grip','M 146 -103 L 163 -103','none','#736a5a',4);
 add('seatpost','M 54 -73 L 58 -99','none','#a8bfc2',3.7);
 add('saddle','M 38 -103 Q 47 -108 61 -106 L 77 -104 Q 74 -99 55 -99 L 40 -99 Z','#314b55','#95b4b6',.9);
 add('chain','M 0 1 Q -6 -9 7 -10 L 79 -35 Q 98 -37 96 -20 Q 94 -7 81 -9 L 7 8 Z','none','#b1c0b9',1.15);
 add('chainring',circlePath(80,-22,11.2),'#273f48','#8aabae',1.2);
 add('crank',`M 80 -22 L ${point(p.ankleLeft)}`,'none',C.white,2.8);
 // Swept tail feathers, a keel-shaped body, and a naturally curved long neck.
 add('tail-far','M 29 -144 Q 8 -156 -13 -154 Q -4 -137 25 -127 Z','#c3cebe','#6b898e',.9);
 add('tail-front','M 27 -140 Q 6 -145 -8 -139 Q 3 -126 30 -121 Z',C.white,'#6b898e',1);
 add('body','M 26 -148 C 42 -170 78 -173 96 -153 C 112 -136 100 -113 80 -105 C 54 -96 29 -108 24 -127 Q 20 -138 26 -148 Z',C.white,'#6b898e',1.15);
 add('body-keel','M 25 -127 Q 45 -110 81 -111 Q 64 -98 44 -105 Q 29 -111 25 -127 Z','#b4c1b6','none',0);
 add('neck','M 74 -146 C 66 -169 78 -192 91 -212 C 99 -228 115 -229 122 -217 C 130 -203 112 -189 107 -176 L 106 -140 Z',C.white,'#6b898e',1.15);
 add('neck-plane','M 87 -148 C 78 -169 91 -198 104 -214 L 111 -219 Q 99 -194 97 -180 L 98 -147 Z','#d0d7c6','none',0);
 add('crown','M 94 -219 Q 96 -231 108 -232 Q 117 -232 122 -222','none',C.white,2);
 add('bill-upper','M 121 -215 Q 172 -212 222 -207 Q 178 -200 123 -200 Z','#e7c58b','#927f65',.9);
 add('bill-ridge','M 127 -210 Q 168 -208 211 -207','none','#fff0c5',1);
 add('pouch','M 124 -201 Q 131 -177 151 -183 Q 172 -190 207 -204 Q 161 -196 124 -201 Z','#d9b18a','#987f6b',.8);
 add('bill-line','M 126 -204 Q 166 -202 215 -207','none','#927f65',.7);
 add('eye-socket',circlePath(110,-215,5),'#c3cebe','none',0);
 add('eye',circlePath(111,-216,2.4),'#13272f','none',0);
 add('eye-glint',circlePath(111.8,-216.8,.8),C.white,'none',0);
 // Separated overlapping cubic feathers, each with a fine shaft, not a flat wing ellipse.
 const feathers=[['M 30 -145 C 43 -161 60 -158 76 -146 Q 88 -134 92 -119 C 65 -120 46 -124 30 -145 Z','#e6e5d3'],['M 35 -140 Q 50 -145 72 -137 Q 85 -129 93 -119 Q 59 -117 35 -140 Z','#d0d8c8'],['M 41 -136 Q 60 -138 80 -128 L 92 -118 Q 62 -115 41 -136 Z','#b9c9bf']];
 for(let i=0;i<feathers.length;i++)add(`wing-layer-${i}`,feathers[i][0],feathers[i][1],'#7b9795',.75);
 for(let i=0;i<6;i++){const x=39+i*6;add(`feather-${i}`,`M ${x} ${-143+i*1.5} Q ${x+10} ${-139+i*1.4} ${x+20} -121`,'none',i%2?'#f3eee0':'#8ca59d',.65);}
 add('wing-arm','M 75 -150 Q 89 -149 99 -141 L 145 -112 Q 152 -110 153 -105 Q 146 -103 140 -107 L 91 -128 Z','#e7e8d6','#6b898e',.9);
 add('arm-light','M 88 -144 Q 105 -132 144 -109','none',C.white,1.5);
 add('leg-near',`M ${point(p.hip)} Q ${p.hip.x+7} ${p.hip.y+28} ${point(p.kneeLeft)} L ${point(p.ankleLeft)}`,'none','#d7bb82',4.2);
 for(const[side,a]of[['far',p.ankleRight],['near',p.ankleLeft]]){add(`web-foot-${side}`,`M ${a.x-5} ${a.y-3} L ${a.x+9} ${a.y-2} L ${a.x+16} ${a.y+3} Q ${a.x+4} ${a.y+7} ${a.x-5} ${a.y+3} Z`,'#cfaa76','#8c7e63',.8);add(`pedal-${side}`,`M ${a.x-9} ${a.y+5} L ${a.x+13} ${a.y+5}`,'none','#b1c5c2',1.8);}
 return out;
}
export function buildSVG(t){const s=svgShapes(t);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -260 340 340" fill="none" stroke-linecap="round" stroke-linejoin="round">\n${s.map(a=>`  <path id="${a.id}" d="${a.d}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.width}"/>`).join('\n')}\n</svg>`;}
export function createAssets(){return Object.freeze({});}
export const frameColor=C.cyan;
export function drawBackground(c){c.fillStyle=C.bg;c.fillRect(0,0,1000,1000);c.fillStyle=C.panel;c.fillRect(20,270,960,430);for(let x=40;x<980;x+=26)for(let y=300;y<700;y+=26){c.fillStyle='#2c4851';c.fillRect(x,y,1,1);}text(c,'pelican.svg',45,302,17,C.cyan);}
export function drawRoad(c){c.fillStyle='#14232e';c.fillRect(0,700,1000,300);stroke(c,[[0,700],[1000,700]],C.cyan,1);}
function sourceLines(shapes){const lines=['<svg xmlns="http://www.w3.org/2000/svg"','     viewBox="-60 -260 340 340"','     stroke-linecap="round"','     stroke-linejoin="round">'];for(const a of shapes){lines.push(`  <path id="${a.id}"`);const chunks=a.d.match(/.{1,60}(?:\s|$)/g)||[a.d];lines.push(`    d="${chunks[0].trim()}`);for(let i=1;i<chunks.length;i++)lines.push('       '+chunks[i].trim());lines[lines.length-1]+='"';lines.push(`    fill="${a.fill}" stroke="${a.stroke}"`);lines.push(`    stroke-width="${a.width}"/>`);}lines.push('</svg>');return lines;}
function drawShape(c,a,progress=1){const p=new Path2D(a.d);c.save();c.lineJoin='round';c.lineCap='round';if(a.fill!=='none'&&progress===1){c.fillStyle=a.fill;c.fill(p);}if(a.stroke!=='none'){c.strokeStyle=a.stroke;c.lineWidth=a.width;if(progress<1)c.setLineDash([Math.max(.1,progress*600),600]);c.stroke(p);}c.restore();}
export function drawRider(c,t){for(const a of svgShapes(t))drawShape(c,a);}
function txt(c,s,x,y,size,col=C.text,bold=false){text(c,s,x,y,size,col,{bold});}
export function drawViewport(c,{t,localTime}){
 const shapes=svgShapes(t),progress=Math.min(1,Math.max(0,localTime/4)),visible=progress*shapes.length,count=Math.floor(visible),lines=sourceLines(shapes.slice(0,count));
 c.save();c.fillStyle=C.bg;c.fillRect(0,0,1920,1080);drawTitle(c,{});
 c.fillStyle=C.panel;c.fillRect(60,220,1800,808);stroke(c,[[60,274],[1860,274]],C.line,1);stroke(c,[[790,274],[790,970]],C.line,1);
 c.fillStyle='#223846';c.fillRect(60,220,730,54);txt(c,'pelican.svg',91,254,22,C.white);txt(c,'SVG',697,253,17,C.cyan);txt(c,'矢量预览',822,254,22,C.text);txt(c,'REED / VECTOR STUDIO',1440,254,18,C.shadow);
 c.save();c.beginPath();c.rect(66,294,715,658);c.clip();
 // These visible rows are extracted from the very SVG paths being rendered, without fake code.
 const rowCount=28,first=Math.max(0,lines.length-rowCount);c.font='17px Consolas,monospace';c.textBaseline='alphabetic';c.textAlign='left';
 for(let i=first;i<lines.length;i++){const y=319+(i-first)*23;c.fillStyle='#526d79';c.fillText(String(i+1).padStart(3,' '),79,y);c.fillStyle=lines[i].includes('<path')?C.cyan:lines[i].includes('d="')?C.gold:lines[i].includes('stroke')?C.lavender:C.text;c.fillText(lines[i],123,y);}
 if(progress<1&&lines.length){const y=319+(lines.length-1-first)*23;c.fillStyle=C.cyan;c.fillRect(126+Math.min(59,lines.at(-1).length)*10.2,y-16,8,19);}
 c.restore();
 c.save();c.beginPath();c.rect(805,283,1040,674);c.clip();
 c.fillStyle='#14232e';c.fillRect(805,283,1040,674);for(let x=828;x<1845;x+=26)for(let y=305;y<953;y+=26){c.fillStyle='rgba(125,220,200,.11)';c.fillRect(x,y,1,1);}
 // Native rear axle1120; scale2.1 preserves the same true circular wheels and924px ground.
 stroke(c,[[825,924],[1824,924]],'#35535f',1);c.setLineDash([3,8]);stroke(c,[[1120,312],[1120,936]],'#294652',1);c.setLineDash([]);
 c.translate(1120,924-44*2.1);c.scale(2.1,2.1);
 for(let i=0;i<count;i++)drawShape(c,shapes[i]);if(count<shapes.length)drawShape(c,shapes[count],visible-count);c.restore();
 stroke(c,[[60,970],[1860,970]],C.line,1);c.fillStyle='#0c161e';c.fillRect(60,971,1800,57);
 ellipse(c,87,999,4,4,progress===1?C.cyan:C.gold);txt(c,progress===1?'SVG READY':'WRITING SVG',106,1007,19,progress===1?C.cyan:C.gold);
 txt(c,`${count} / ${shapes.length} PATHS`,344,1007,18,C.text);txt(c,'viewBox  -60 -260 340 340',647,1007,18,C.shadow);txt(c,'GLOBAL PHASE  '+((t%1)*360).toFixed(1)+'°',1421,1007,18,C.shadow);
 c.restore();
}
export function drawTitle(c){c.save();txt(c,'代码美学',74,126,48,C.white,true);txt(c,'Code Aesthetics',77,174,30,C.cyan);text(c,'2020年代 · 大模型时代',1804,165,27,C.shadow,{align:'right'});c.restore();}
