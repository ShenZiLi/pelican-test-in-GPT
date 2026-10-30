let paper;
const R=n=>{const x=Math.sin(n*111.13)*42758;return x-Math.floor(x);};
function p(c,a){c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function ground(){const b=document.createElement('canvas');b.width=1778;b.height=1000;const c=b.getContext('2d');c.fillStyle='#eee9d9';c.fillRect(0,0,1778,1000);for(let i=0;i<19000;i++){c.fillStyle=i%3?'#756d4c0b':'#fffdf741';c.fillRect(R(i)*1778,R(i+20000)*1000,R(i+40000)*6+1,1);}return b;}
function pine(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#373d36';c.lineWidth=3;c.beginPath();c.moveTo(-32,0);c.bezierCurveTo(5,-140,-36,-212,9,-360);c.bezierCurveTo(2,-210,34,-120,0,0);c.stroke();for(let j=0;j<6;j++){let yy=-80-j*43,xx=j%2?-70:80;p(c,[[0,yy+35],[xx,yy],[xx*1.5,yy-12]]);for(let k=0;k<23;k++){let a=k*.22;let bx=xx+(k%3)*24;let by=yy-12;c.lineWidth=.8;p(c,[[bx,by],[bx+Math.cos(a)*51,by-Math.sin(a)*29]]);}}c.restore();}
function ribbon(c,x,y,phase,len,width){c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-len*.25,y-80-Math.sin(phase)*25,x-len*.4,y+90,x-len*.66,y+Math.sin(phase)*35);c.bezierCurveTo(x-len*.85,y-55,x-len*.92,y+10,x-len,y-10);c.stroke();c.beginPath();c.moveTo(x,y+width);c.bezierCurveTo(x-len*.25,y-80-Math.sin(phase)*25+width,x-len*.4,y+90+width,x-len*.66,y+Math.sin(phase)*35+width*.5);c.bezierCurveTo(x-len*.85,y-55+width,x-len*.92,y+10,x-len,y-10);c.stroke();}
export function draw(c,u,e){paper??=ground();c.drawImage(paper,0,0,e.W,e.H);c.save();c.globalAlpha=.5;pine(c,1510-u*10,790,1.45);c.globalAlpha=.35;pine(c,180-u*7,771,.85);c.restore();
 c.strokeStyle='#636859';c.lineWidth=1;for(let k=0;k<6;k++){c.beginPath();c.moveTo(0,785+k*8);c.bezierCurveTo(430,762+k*9,1130,797+k*8,1778,779+k*9);c.stroke();}
 c.save();c.strokeStyle='#333a33';c.lineWidth=1.8;ribbon(c,e.riderX-30,470,e.t*2,480,17);ribbon(c,e.riderX+30,530,e.t*2+1.7,370,12);c.restore();
 e.rig(c,e.riderX,e.roadY,1,e.t,{ink:'#30382f',body:'#efecdf',beak:'#efecdf',bike:'#41493d',lineWidth:2,mode:'line'});
 // Fine trailing feather filaments: the wind has calligraphic weight.
 c.save();c.strokeStyle='#4c5547';for(let i=0;i<14;i++){c.lineWidth=.6+(i%3)*.3;const x=e.riderX-60,y=490+i*5;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-65,y-55,x-130,y+Math.sin(e.t*3+i*.2)*30,x-170-i*3,y-30+i*3);c.stroke();}c.restore();
 c.fillStyle='#9c4937';c.fillRect(1533,844,34,42);c.strokeStyle='#eee9d9';c.lineWidth=2;p(c,[[1540,852],[1560,852],[1560,861],[1540,861],[1540,876],[1560,876]]);
}
