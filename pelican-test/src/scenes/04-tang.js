import {path,line,ellipse,paper,cached,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';

const INK='#22221f',PAPER='#f0eadc';
const stroke=(c,d,w=1)=>path(c,d,null,INK,w);
// A drawn line swells in its middle and dries at either end. All movement is analytic.
function silk(c,points,width=2,alpha=1){
  c.save();c.globalAlpha*=alpha;c.strokeStyle=INK;c.lineCap='round';
  for(let i=1;i<points.length;i++){
    const u=i/(points.length-1);c.lineWidth=width*(.23+.77*Math.sin(Math.PI*u)**.7);
    c.beginPath();c.moveTo(...points[i-1]);c.lineTo(...points[i]);c.stroke();
  }c.restore();
}
function wave(c,x,y,length,amplitude,phase,width=13,angle=0){
  c.save();c.translate(x,y);c.rotate(angle);const a=[],b=[],crease=[];
  for(let i=0;i<=70;i++){
    const q=i/70,xx=-q*length,yy=Math.sin(q*TAU*1.4+phase)*amplitude*q+Math.sin(q*9-phase)*amplitude*.22*q;
    const w=width*Math.sin(Math.PI*(q*.83+.05))*(.95-.7*q);
    a.push([xx,yy-w]);b.push([xx,yy+w]);crease.push([xx,yy-w*.35]);
  }
  // Paper-colored reserve gives every overlapping fold its own readable edge.
  c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));b.slice().reverse().forEach(p=>c.lineTo(...p));c.closePath();c.fillStyle=PAPER;c.fill();
  silk(c,a,3.4);silk(c,b,2.1);silk(c,crease,.85);c.restore();
}
function attendant(c,x,y,s,phase=0){
  c.save();c.translate(x,y);c.scale(s,s);c.lineCap='round';c.lineJoin='round';
  path(c,'M-14-166 Q-21-185-7-193 Q4-199 12-185 L11-168 Q2-156-14-166 Z',PAPER,INK,1.4);
  stroke(c,'M-13-188 Q-27-203-8-209 Q10-210 11-194 M-14-191 Q1-187 12-190',1.15);
  stroke(c,'M8-180 l-5 1 M10-173 l-4 1',.6);
  path(c,'M-12-161 Q-36-145-40-108 Q-54-69-50-35 Q-42-14-57-2 Q-15 12 33-4 Q6-37 16-64 Q28-101 12-132 L3-159',PAPER,INK,1.6);
  stroke(c,'M-11-160 Q-8-147 4-138 Q-16-115-20-81 Q-28-44-15-4 M-30-117 Q-23-82-38-40 M-6-115 Q3-80-1-60 M-15-4 Q9 1 27-5',1.1);
  path(c,'M-26-147 Q-49-151-60-135 Q-54-113-30-107 L-7-128 Q-3-134 4-131 L25-119 L28-124 L1-143 Q-7-150-13-140',PAPER,INK,1.3);
  stroke(c,'M-52-137 Q-49-121-32-117 M-44-143 Q-36-140-26-128 M-27-123 Q-22-113-15-115',.7);
  stroke(c,'M-23 5 L-32 13 Q-12 17-9 8 M8 6 L16 12 Q32 13 33 8',1.2);
  wave(c,-16,-156,134,17,phase,8,-.18);
  // The traveller carries a long, folded parasol: a fine diagonal against the robes.
  stroke(c,'M27-122 L66-250 M51-240 Q73-275 92-271 L67-229 Z',1.2);
  stroke(c,'M66-250 L92-271 M66-250 L74-268 M66-250 L55-243',.7);
  c.restore();
}
function backdrop(c){
  // The untouched sheet is an intentional reserve, never a gray underpainting.
  c.save();c.lineCap='round';
  stroke(c,'M731 245 Q848 198 943 118 M827 224 Q854 183 866 140',2.5);
  stroke(c,'M785 226 Q850 198 910 158 M855 204 Q877 186 894 163',.9);
  for(let i=0;i<10;i++){
    const x=800+i*15,y=220-i*6;
    stroke(c,`M${x} ${y} q-24 43-30 92`,1.35);
    for(let j=0;j<4;j++)stroke(c,`M${x-7-j*6} ${y+21+j*16} q-13 0-15 15 q12-3 15-15`,.8);
  }
  stroke(c,'M65 845 Q153 838 249 842 M736 842 Q824 834 912 838',1.2);
  stroke(c,'M80 837 Q89 812 78 796 M84 825 L103 810 M891 828 Q903 801 896 783',1.6);
  c.restore();
}
function rider(c,absolute,t){
  const p=poseAt(absolute);c.save();c.translate(500,805);c.lineCap='round';c.lineJoin='round';
  for(const wx of [-106,111]){
    ellipse(c,wx,-62,62,62,null,INK,2.8);ellipse(c,wx,-62,58,58,null,INK,.65);
    for(let i=0;i<16;i++){
      const a=p.wheelAngle+i*TAU/16;line(c,[[wx,-62],[wx+Math.cos(a)*58,-62+Math.sin(a)*58]],INK,.55);
    }ellipse(c,wx,-62,4,4,PAPER,INK,1);
  }
  stroke(c,'M-106-62 L-51-150 L-8-71 Z M-51-150 L65-150 L111-62 L-8-71 L65-150 M65-150 L64-180 L89-191 L99-188 M-51-150 L-54-173 M-77-173 L-39-173',2.1);
  stroke(c,'M-102-64 L-10-76 M-104-57 L-9-66',.65);ellipse(c,-8,-71,18,18,null,INK,1.1);
  const leg=(i,opacity)=>{const k=p.knees[i],f=p.feet[i];c.save();c.globalAlpha=opacity;
    const pts=[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]];
    line(c,pts,INK,2.4);line(c,[[f.x-10,f.y],[f.x+13,f.y]],INK,2.6);line(c,[[-8,-71],[f.x,f.y]],INK,1.4);c.restore();};
  leg(1,.6);
  c.save();c.translate(0,p.bob);
  // A continuous swan-like neck contour, with separate dry internal feather strokes.
  path(c,'M-104-200 Q-142-216-122-244 Q-106-264-71-266 Q-25-273 11-239 Q0-268 7-296 Q10-322 32-329 Q61-340 77-319 Q88-305 71-292 Q53-285 55-268 L58-235 Q62-207 33-194 Q7-179-32-182 Q-73-178-104-200 Z',PAPER,INK,1.9);
  // Selected contour passes swell and taper like a lifted brush, not an even wire.
  silk(c,[[-130,-224],[-128,-236],[-117,-249],[-99,-259],[-78,-264],[-58,-265],[-39,-260]],3.8);
  silk(c,[[12,-240],[6,-260],[6,-279],[10,-301],[20,-318],[32,-327],[49,-331]],3.2);
  silk(c,[[58,-235],[57,-220],[49,-207],[33,-196],[13,-187],[-11,-182],[-32,-182]],3.5);
  stroke(c,'M-121-236 Q-98-255-75-255 M-127-219 Q-120-204-106-202 M12-238 Q22-216 47-217 M18-300 Q13-281 21-268',.85);
  path(c,'M71-317 Q148-317 232-303 Q167-289 78-295 L69-300',PAPER,INK,1.45);
  path(c,'M79-295 Q142-256 192-296',PAPER,INK,1.1);
  stroke(c,'M84-300 Q156-297 213-302 M90-291 Q143-267 178-292',.65);
  path(c,'M-112-207 Q-139-214-153-235 Q-136-226-127-226 Q-142-236-140-247 Q-126-231-112-226',PAPER,INK,1.2);
  path(c,'M-92-244 Q-58-264-23-241 Q-3-227 5-212 Q-34-189-72-206 Q-90-213-92-244 Z',PAPER,INK,1.25);
  for(let i=0;i<9;i++){
    const x=-85+i*7.7,y=-240+i*2.4;
    stroke(c,`M${x} ${y} Q${x+10} ${y+23} ${x+39} ${-211+i*.7} Q${x+20} ${-202+i*.6} ${x+8} ${y+16}`,i%3===0?.95:.55);
  }
  // Wind-lifted neck feathers and an economical Tang travelling collar.
  for(let i=0;i<4;i++)stroke(c,`M${29+i*5} ${-325-i*.5} Q${8+i*7} ${-346-i*3} ${-9+i*8} ${-338-i*5}`,1-i*.15);
  path(c,'M12-247 Q31-231 58-241 L58-232 Q33-219 12-237 Z',PAPER,INK,1.2);
  // Both ribbons are tied to the lower collar. Their q=0 end never moves.
  const wind=Math.sin(Math.PI*Math.max(0,Math.min(1,(t-1.2)/3.8)));
  wave(c,16,-239,205+155*wind,25+64*wind,absolute*2.1,15,-.12);
  wave(c,20,-235,172+100*wind,21+44*wind,absolute*1.8+1.5,11,-.32);
  path(c,'M11-241 q10-9 17 3 q-11 8-17-3 M17-238 l-7 11 M18-238 l11 9',PAPER,INK,1.9);
  // Keep the hand on the common handlebar at every frame.
  path(c,'M-3-222 Q15-211 37-190 L86-191',null,INK,2);
  stroke(c,'M3-227 Q20-223 27-209 M11-219 Q17-204 35-196 M39-189 L48-186',.7);
  ellipse(c,60,-316,5.3,5.1,PAPER,INK,.9);ellipse(c,62,-315,1.8,2.3,INK);stroke(c,'M54-323 Q61-326 67-321',.8);
  c.restore();leg(0,1);c.restore();
}
function floatingFeather(c,x,y,angle,s=1){c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);path(c,'M-34 0 Q-14-15 18-5 Q38 0 44 0 Q20 6-3 10 Q-23 14-34 0Z',PAPER,INK,1);stroke(c,'M-42 2 Q-10-2 43 0',.9);for(let i=0;i<8;i++){let xx=-25+i*7;stroke(c,`M${xx} 0 q4 -4 11 -7 M${xx} 1 q1 5 7 7`,.45);}c.restore();}
export function renderSubject(c,t,scene){
  const absolute=(scene.start??23)+t;
  rider(c,absolute,t);
  const lift=Math.sin(Math.PI*Math.max(0,Math.min(1,(t-1.1)/4.4)));
  // Feathers peel away behind the body; no free-floating ribbon crosses the head.
  for(let i=0;i<3;i++){
    floatingFeather(c,382-i*52-lift*43,548-i*31-lift*(62+i*13),-.2-i*.3+Math.sin(t*2+i)*.4,.45+i*.09);
  }
}
export function galleryPose(t){return {x:1070*Math.max(0,Math.min(6,t))/6,y:805,scale:.88};}
export function renderGallery(c,t,scene={}){
  paper(c,{base:PAPER,seed:7452});cached(c,'tang:clean-contour:v5',backdrop);
  attendant(c,820,633,.92,t*2.2);
  if(scene.subject!==false){const p=galleryPose(t);c.save();c.translate(p.x,p.y);c.scale(p.scale,p.scale);c.translate(-500,-805);renderSubject(c,t,scene);c.restore();}
}
export default function renderAt(c,t,scene={}){
  if(scene.gallery){renderGallery(c,t,scene);return;}
  paper(c,{base:PAPER,seed:7452});cached(c,'tang:clean-contour:v5',backdrop);attendant(c,820,633,.92,t*2.2);
  if(scene.subject!==false)renderSubject(c,t,scene);
}
