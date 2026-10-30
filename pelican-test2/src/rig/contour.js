import {poseAt} from './pose.js';
export function rigContours(t){
 const p=poseAt(t),parts=[];
 const line=(points,role='line')=>{const d=new Path2D();points.forEach(([x,y],i)=>d[i?'lineTo':'moveTo'](x,y));parts.push({d,role});};
 for(const x of[0,180]){const d=new Path2D();d.arc(x,0,44,0,Math.PI*2);parts.push({d,role:'wheel'});for(let i=0;i<12;i++){const a=p.wheelAngle+i*Math.PI/6;line([[x,0],[x+42*Math.cos(a),42*Math.sin(a)]],'spoke');}}
 line([[0,0],[62,-79],[80,-22],[0,0]]);line([[62,-79],[147,-76],[80,-22]]);line([[147,-76],[180,0]]);line([[62,-79],[58,-115],[44,-115],[74,-115]]);line([[147,-76],[155,-99],[175,-95],[174,-83]]);
 for(const side of['Right','Left']){const k=p['knee'+side],a=p['ankle'+side];line([[58,-126],[k.x,k.y],[a.x,a.y]],'leg');line([[a.x-8,a.y],[a.x+12,a.y]],'leg');line([[80,-22],[a.x,a.y]]);}
 const body=new Path2D('M -5 -143 L 24 -147 C 40 -170 65 -169 81 -153 C 67 -182 73 -210 92 -225 C 104 -235 124 -231 128 -218 C 134 -202 114 -197 101 -203 C 98 -181 118 -166 107 -144 C 95 -118 53 -110 25 -128 Z');
 const bill=new Path2D('M 123 -216 L 222 -207 L 216 -201 L 170 -199 C 153 -177 129 -183 123 -201 Z');
 const wing=new Path2D('M 26 -153 C 48 -176 77 -153 87 -135 C 63 -139 39 -133 26 -153 Z');
 const arm=new Path2D('M 79 -151 C 97 -130 108 -107 133 -97 L 170 -85 L 167 -81 C 127 -88 99 -96 84 -126 Z');
 parts.push({d:body,role:'body'},{d:bill,role:'bill'},{d:wing,role:'wing'},{d:arm,role:'body'});
 const eye=new Path2D();eye.arc(116,-217,2.6,0,Math.PI*2);parts.push({d:eye,role:'eye'});return parts;
}
export function drawContour(c,t,{ink='#17271e',fill=false,width=2,alpha=1}={}){c.save();c.globalAlpha*=alpha;c.lineCap='round';c.lineJoin='round';for(const{d,role}of rigContours(t)){c.strokeStyle=ink;c.lineWidth=role==='spoke'?width*.45:width;if(fill&&['body','bill','wing','eye'].includes(role)){c.fillStyle=ink;c.fill(d);}c.stroke(d);}c.restore();}
