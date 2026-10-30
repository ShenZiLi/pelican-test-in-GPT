export const metadata={title:'代码美学',english:'THE LAST ANSWER IS DRAWN',year:'2020s'};
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
// These SVG paths are the actual paths drawn on the right-hand canvas.
const strokes=[
 {at:.25,d:'M-39 -78 A77 77 0 1 1 -193 -78 A77 77 0 1 1 -39 -78',color:'#91bfb8',duration:.65},
 {at:.9,d:'M193 -78 A77 77 0 1 1 39 -78 A77 77 0 1 1 193 -78',color:'#91bfb8',duration:.65},
 {at:1.55,d:'M-116 -78 L-62 -184 L-12 -94 L-116 -78 L59 -184 L-62 -184 M-12 -94 L59 -184 L116 -78 L72 -217 L100 -226 M-65 -184 L-67 -207 M-91 -211 L-40 -211',color:'#74b3b2',duration:.6},
 {at:2.15,d:'M-97 -237 C-175 -256 -193 -288 -198 -311 C-165 -300 -142 -302 -133 -320 C-109 -368 -33 -377 8 -333 C25 -319 31 -329 27 -358 C8 -399 21 -446 60 -450 C96 -453 109 -431 100 -409 C89 -390 74 -386 74 -355 C80 -299 40 -233 -36 -228 C-60 -224 -81 -229 -97 -237 Z',color:'#d8e3d6',duration:.95},
 {at:3.1,d:'M-127 -312 C-79 -347 -29 -322 -4 -286 C-44 -270 -84 -270 -127 -312',color:'#d8e3d6',duration:.35},
 {at:3.45,d:'M91 -425 L233 -400 L92 -399 Z M93 -399 Q145 -336 211 -397 L93 -399',color:'#d8b174',duration:.4},
 {at:3.85,d:'M82 -427 A5 6 0 1 1 72 -427 A5 6 0 1 1 82 -427 M1 -270 L42 -253 L92 -224',color:'#d8e3d6',duration:.35}
];
let prepared;
function paths(){return prepared??=strokes.map(s=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',s.d);return {...s,path:new Path2D(s.d),length:p.getTotalLength()}})}
function codeRows(u){const rows=['<svg viewBox="-240 -480 520 520">'];for(const s of strokes){if(u<s.at)break;rows.push('  <path fill="none"');const tokens=s.d.split(' ');let line='    d="';for(const token of tokens){if(line.length+token.length>61){rows.push(line);line='      ';}line+=token+' ';}rows.push(line.trimEnd()+'" />');}if(u>=4.3)rows.push('</svg>');return rows;}
export function draw(c,u,env){
 c.fillStyle='#101d25';c.fillRect(0,0,1778,1000);c.fillStyle='#172832';c.fillRect(44,230,1688,710);c.strokeStyle='#2a4049';c.lineWidth=1;c.strokeRect(44,230,1688,710);c.fillStyle='#203540';c.fillRect(44,230,1688,51);c.fillStyle='#d0ddda';c.font='19px monospace';c.fillText('pelican.svg',85,262);c.fillStyle='#7eaaa3';c.fillText('●  rendered with care',1380,262);c.strokeStyle='#2c444c';c.beginPath();c.moveTo(850,281);c.lineTo(850,940);c.stroke();
 c.save();c.beginPath();c.rect(54,290,786,640);c.clip();const rows=codeRows(u),offset=Math.max(0,rows.length-21);for(let i=offset;i<rows.length;i++){const y=320+(i-offset)*28;c.font='17px monospace';c.fillStyle='#546d77';c.fillText(String(i+1).padStart(2,'0'),72,y);c.fillStyle=rows[i].includes('path')?'#c9b58d':rows[i].includes('svg')?'#a3cbbb':'#8cb3c5';c.fillText(rows[i],115,y);}if(u<4.3){c.fillStyle='#e6cf9e';c.fillRect(115+Math.min(60,rows.at(-1).length)*10.2,307+(rows.length-offset-1)*28,8,20);}c.restore();
 for(let x=890;x<1700;x+=35){c.strokeStyle='rgba(96,140,145,.1)';c.beginPath();c.moveTo(x,300);c.lineTo(x,900);c.stroke();}for(let y=300;y<910;y+=35){c.beginPath();c.moveTo(875,y);c.lineTo(1710,y);c.stroke();}
 const leave=smooth((u-5.5)/.5),x=env.travelX==null?1250-400*leave:env.travelX,y=804-24*leave,scale=1.13-.13*leave;
 c.save();c.translate(x,y);c.scale(scale,scale);c.lineCap='round';c.lineJoin='round';c.lineWidth=2.5;c.shadowColor='#6ebbb0';c.shadowBlur=4;
 const fill=smooth((u-4.2)/.5);c.globalAlpha=1-fill;
 for(const s of paths()){const q=clamp((u-s.at)/s.duration);if(!q)continue;c.strokeStyle=s.color;c.setLineDash(q<1?[s.length*q,s.length*2]:[]);c.stroke(s.path);}c.setLineDash([]);c.restore();
 if(fill>0){c.save();c.globalAlpha=fill;env.rig(c,x,y,scale,env.t,{ink:'#d8e3d6',body:'#ebe7d5',paper:'#172832',beak:'#d8b174',bike:'#74b3b2',lineWidth:2.5});c.restore();}
 c.strokeStyle='#6f9d98';c.lineWidth=1;c.beginPath();c.moveTo(880-400*leave,804-24*leave);c.lineTo(1715,804-24*leave);c.stroke();c.fillStyle='#8faaa9';c.font='16px monospace';c.fillText('120 BPM   /   1 REVOLUTION = 2 BEATS',951,864);c.fillStyle='#a7c5b8';c.font='20px sans-serif';c.fillText(u>4.7?'第二十份答卷，完成。':'每一笔，都有来处。',1070,906);
}
