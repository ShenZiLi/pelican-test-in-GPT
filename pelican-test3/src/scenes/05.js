// Original procedural ink landscape; no external artwork or frame assets.
export const metadata = { title: '宋代山水', english: 'MONUMENTAL LANDSCAPE', year: '约 1000' };
let plate;
const rnd = n => { const v=Math.sin(n*127.1+73.7)*43758.5453; return v-Math.floor(v); };
function path(c,points,fill,stroke,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function pine(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#343b34';c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-5,-27,10,-51,1,-91);c.stroke();for(let j=0;j<7;j++){let yy=-18-j*10;let w=28-j*2;c.beginPath();c.moveTo(1,yy);c.lineTo(-w,yy-10);c.moveTo(1,yy);c.lineTo(w,yy-16);c.stroke();for(let k=0;k<8;k++){c.lineWidth=.8;c.beginPath();c.moveTo(-w+k*7,yy-9);c.lineTo(-w+k*7-6,yy-18-rnd(k+j)*8);c.stroke();}}c.restore();}
function mountain(c,x,y,w,h,seed,alpha){c.save();c.globalAlpha=alpha;const pts=[[x-w*.62,y]];for(let i=0;i<=20;i++){const f=i/20;pts.push([x-w*.5+w*f,y-h*(.45+.55*Math.sin(f*Math.PI))+(rnd(seed+i)-.5)*h*.14]);}pts.push([x+w*.65,y]);path(c,pts,'#929789','#454e43',1.5);c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.clip();for(let i=0;i<850;i++){let px=x-w*.62+rnd(i+seed*90)*w*1.3,py=y-h+rnd(i*3+seed)*h;let len=12+rnd(i+6)*65;c.strokeStyle=`rgba(31,43,34,${.05+rnd(i+9)*.18})`;c.lineWidth=.6+rnd(i+8)*2;c.beginPath();c.moveTo(px,py);c.bezierCurveTo(px+13,py+len*.2,px-12,py+len*.8,px-7,py+len);c.stroke();}for(let k=0;k<20;k++){c.fillStyle='rgba(225,226,202,.12)';c.beginPath();c.ellipse(x+(rnd(k+seed)-.5)*w,y-h*rnd(k*5+seed),30+rnd(k)*80,70+rnd(k+7)*180,-.1,0,7);c.fill();}c.restore();c.restore();}
function background(){const a=document.createElement('canvas');a.width=1778;a.height=1000;const c=a.getContext('2d');c.fillStyle='#e5e0c9';c.fillRect(0,0,1778,1000);for(let i=0;i<17000;i++){c.fillStyle=`rgba(71,65,42,${rnd(i+8)*.06})`;c.fillRect(rnd(i)*1778,rnd(i+70000)*1000,1+rnd(i+6)*2,1);}
 mountain(c,250,660,630,420,8,.18);mountain(c,1470,650,700,480,71,.24);mountain(c,1040,730,640,590,25,.83);mountain(c,680,725,300,370,44,.65);
 // Narrow falls, suspended in the middle of the ink cliffs.
 c.strokeStyle='rgba(239,237,216,.9)';c.lineWidth=8;c.beginPath();c.moveTo(1190,348);c.bezierCurveTo(1170,405,1212,510,1180,619);c.stroke();c.lineWidth=2;c.strokeStyle='#939887';c.stroke();
 for(let i=0;i<5;i++){const g=c.createLinearGradient(0,610+i*22,0,690+i*22);g.addColorStop(0,'rgba(229,224,201,0)');g.addColorStop(.5,'rgba(229,224,201,.72)');g.addColorStop(1,'rgba(229,224,201,0)');c.fillStyle=g;c.fillRect(0,610+i*22,1778,85);}
 path(c,[[0,843],[190,772],[390,825],[680,780],[1100,794],[1450,741],[1778,800],[1778,1000],[0,1000]],'#b0b09a','#6e7666',2);
 c.strokeStyle='#797d69';c.lineWidth=2;c.beginPath();c.moveTo(0,790);c.bezierCurveTo(350,750,630,810,900,780);c.bezierCurveTo(1200,744,1490,802,1778,780);c.stroke();
 for(let i=0;i<38;i++)pine(c,60+i*46+rnd(i)*20,920-rnd(i+10)*110,.4+rnd(i+20)*.7);
 for(let i=0;i<300;i++){let x=rnd(i+77)*1778,y=830+rnd(i+66)*170;c.strokeStyle='rgba(54,63,46,.15)';c.beginPath();c.moveTo(x,y);c.lineTo(x+12,y-6);c.stroke();}
 // Small pavilion, intentionally peripheral to the enormous mountains.
 path(c,[[1310,749],[1370,720],[1430,749]],'#3f493b');c.strokeStyle='#4b5343';c.lineWidth=3;for(const x of [1323,1416]){c.beginPath();c.moveTo(x,749);c.lineTo(x,790);c.stroke();}c.strokeRect(1318,782,104,7);
 c.fillStyle='#9a392d';c.fillRect(1570,320,32,42);c.fillStyle='#ddd4b7';c.font='16px serif';c.fillText('行',1577,338);c.fillText('旅',1577,356);return a;
}
export function draw(c,u,env){plate??=background();const focus=Math.sin(Math.PI*Math.max(0,Math.min(1,(u-1)/4)))**2;const z=1+1.55*focus;c.save();c.translate(889,690);c.scale(z,z);c.translate(-889,-690);c.drawImage(plate,0,0);env.rig(c,env.riderX,780,.15,env.t,{ink:'#30392f',body:'#d9d6bd',beak:'#82785b',bike:'#343b31',lineWidth:2.8,mode:'line'});c.restore();if(u>2&&u<4){c.fillStyle='#454b3a';c.font='22px serif';c.fillText('山高千仞，车行一寸。',1150,910);} }
