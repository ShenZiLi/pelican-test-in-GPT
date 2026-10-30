import {poseAt} from './pose.js';
import {path,line,ellipse,TAU} from '../kit/draw.js';
let glowCanvas;
export function pelican(c,t,{x=500,y=805,scale=1,style='classic',eye='normal',alpha=1,body,ink,accent,feathers=true,glowPass=false}={}){
  if(style==='glow'&&!glowPass){
    if(!glowCanvas){glowCanvas=document.createElement('canvas');glowCanvas.width=512;glowCanvas.height=400;}
    const g=glowCanvas.getContext('2d');g.clearRect(0,0,512,400);
    const pose=pelican(g,t,{x:190,y:360,style,eye,body,ink,accent,feathers,glowPass:true});
    c.save();c.translate(x,y);c.scale(scale,scale);c.shadowBlur=0;c.globalAlpha*=alpha;
    c.save();c.globalAlpha*=.55;c.filter='blur(5px)';c.drawImage(glowCanvas,-190,-360);c.restore();
    c.drawImage(glowCanvas,-190,-360);c.restore();return pose;
  }
  const p=poseAt(t),flat=['rock','carved','shadow','glow','ink','line'].includes(style);
  const stroke=ink||({rock:'#873f26',carved:'#e7e1cb',shadow:'#111318',glow:'#86ffad',ink:'#242b26',line:'#3e3d32',gilded:'#65442d',oil:'#172d4a',digital:'#b7d5d6'}[style]||'#263e43');
  const fill=body||(style==='shadow'?stroke:style==='rock'?'#914c30':style==='carved'?null:style==='glow'?null:style==='ink'?'#eee9d7':'#f0ecda');
  const bill=accent||(style==='shadow'?stroke:style==='glow'?null:style==='rock'?stroke:style==='carved'?null:'#d39a50');
  const lw=style==='rock'?4:style==='line'?1.8:style==='glow'?2.4:3;
  c.save();c.globalAlpha*=alpha;c.translate(x,y);c.scale(scale,scale);c.lineJoin='round';c.lineCap='round';
  if(style==='glow'&&!glowPass){c.shadowColor='#59ff8d';c.shadowBlur=12;}
  if(!flat){ellipse(c,4,5,159,10,'#192b2b18');}
  for(const wx of [-106,111]){
    ellipse(c,wx,-62,62,62,null,stroke,lw+1);
    if(!flat)ellipse(c,wx,-62,56,56,null,'#9caa9a',1);
    for(let i=0;i<12;i++){let a=p.wheelAngle+i*TAU/12;line(c,[[wx,-62],[wx+Math.cos(a)*59,-62+Math.sin(a)*59]],stroke,style==='rock'?1.6:.9);}
    ellipse(c,wx,-62,5,5,stroke);
  }
  const crank=[p.crank.x,p.crank.y];
  line(c,[[-106,-62],[-51,-150],crank,[-106,-62]],stroke,lw+1);
  line(c,[[-51,-150],[65,-150],[111,-62],crank,[65,-150]],stroke,lw+1);
  line(c,[[65,-150],[64,-180],[89,-191],[99,-188]],stroke,lw+1);
  line(c,[[-51,-150],[-54,-173],[-77,-173],[-39,-173]],stroke,lw+2);
  ellipse(c,crank[0],crank[1],19,19,null,stroke,lw);
  line(c,[[-106,-62],crank],stroke,.8);
  const leg=i=>{const f=p.feet[i],k=p.knees[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],stroke,lw+1);line(c,[[f.x-10,f.y],[f.x+13,f.y]],stroke,lw+2);line(c,[crank,[f.x,f.y]],stroke,lw);};
  c.save();c.globalAlpha*=.52;leg(1);c.restore();
  c.save();c.translate(0,p.bob);
  path(c,'M -100 -199 C -141 -227 -114 -264 -67 -266 C -27 -270 -8 -248 12 -240 C 5 -274 6 -307 30 -324 C 45 -334 67 -329 78 -316 C 86 -305 79 -289 64 -286 C 45 -275 53 -249 56 -227 C 50 -199 17 -179 -32 -182 C -56 -179 -73 -189 -100 -199 Z',fill,stroke,lw);
  path(c,'M 69 -315 L 232 -303 Q 205 -291 79 -295 L 67 -299 Z',bill,stroke,lw*.7);
  path(c,'M 78 -295 Q 155 -258 193 -297',style==='shadow'?stroke:style==='rock'?stroke:style==='glow'?null:'#c6b992',stroke,lw*.65);
  path(c,'M -115 -205 L -149 -222 L -125 -218 L -143 -234 L -107 -219 Z',fill,stroke,lw*.6);
  path(c,'M -85 -244 C -40 -261 -6 -232 8 -213 C -21 -196 -64 -196 -89 -223',style==='shadow'?stroke:style==='rock'?stroke:style==='carved'?null:style==='glow'?null:'#d9d6c4',stroke,lw*.7);
  if(feathers&&style!=='shadow'){for(let i=0;i<7;i++){let a=i*8;path(c,`M ${-85+a} ${-236+i*2} q 20 18 40 20`,null,stroke,.7);}}
  line(c,[[4,-222],[37,-188],[86,-191]],stroke,lw+1);
  if(style!=='shadow'){
    ellipse(c,60,-315,5.5,5.5,style==='rock'?'#dbb07c':'#f7f1db',stroke,.8);
    ellipse(c,eye==='roll'?59:62,eye==='roll'?-318:-315,2.2,2.6,stroke);
  }
  c.restore();leg(0);
  if(style==='gilded'){for(let i=0;i<14;i++)ellipse(c,-90+i*7,-223+Math.sin(i*.6)*8,1.7,1.7,'#caa34b');}
  if(style==='line'||style==='ink'){for(let i=0;i<5;i++)path(c,`M ${-82+i*12} -245 q 26 -${5+i} 47 20`,null,stroke,.5);}
  c.restore();
  return p;
}
