// Original Tassili-inspired pastoral frieze, entirely procedural.
let wall;
const rnd=(n)=>{const x=Math.sin(n*127.1+31.7)*43758.5453;return x-Math.floor(x);};
function path(c,pts,close=false){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();c.stroke();}
function texture(){
 const b=document.createElement('canvas');b.width=1778;b.height=1000;const c=b.getContext('2d');c.fillStyle='#c6a17a';c.fillRect(0,0,1778,1000);
 for(let i=0;i<95;i++){const x=rnd(i)*1778,y=rnd(i+100)*1000,r=40+rnd(i+200)*250;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?'#94654630':'#f1d3a12e');g.addColorStop(1,'#b88a6300');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
 for(let i=0;i<17000;i++){c.fillStyle=i%3?'#6c422b13':'#fff1d326';c.fillRect(rnd(i+40)*1778,rnd(i+18000)*1000,1+rnd(i+38000)*3,rnd(i+1000)*2+1);}
 c.strokeStyle='#573d2928';c.lineWidth=1.2;
 for(let i=0;i<12;i++){let x=rnd(i+300)*1778,y=rnd(i+320)*300;const a=[[x,y]];for(let j=0;j<12;j++){x+=rnd(i*30+j+8)*48-24;y+=32+rnd(i*30+j+50)*24;a.push([x,y]);}path(c,a);}
 return b;
}
function cow(c,x,y,s,look){c.save();c.translate(x,y);c.scale(s,s);c.lineWidth=3;c.strokeStyle='#743e2c';c.fillStyle='#8f49313b';c.beginPath();c.ellipse(0,0,68,31,-.06,0,Math.PI*2);c.fill();c.stroke();path(c,[[-50,13],[-53,73],[-45,75],[-40,23]]);path(c,[[28,22],[35,74],[43,74],[44,15]]);path(c,[[-65,-5],[-85,-29],[-93,-6]]);c.save();c.translate(63,-17);c.rotate(look);c.beginPath();c.ellipse(5,0,29,15,.3,0,Math.PI*2);c.fill();c.stroke();path(c,[[1,-11],[-4,-37],[8,-29]]);path(c,[[19,-10],[25,-36],[31,-26]]);c.fillStyle='#673522';c.beginPath();c.arc(20,-3,2.6,0,7);c.fill();c.restore();for(let i=0;i<6;i++)path(c,[[-46+i*16,-21],[-37+i*16,18]]);c.restore();}
function human(c,x,y,s,turn){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#793f2b';c.fillStyle='#7e442e';c.lineWidth=5;c.lineCap='round';c.beginPath();c.ellipse(0,-83,11,18,turn,0,7);c.fill();path(c,[[0,-66],[-5,-15],[-27,30]]);path(c,[[-5,-15],[19,29]]);path(c,[[0,-56],[-35,-30],[-52,-44]]);path(c,[[0,-56],[30,-42],[34,-86]]);c.lineWidth=2;path(c,[[35,-110],[35,40]]);c.restore();}
export function draw(c,u,e){
 wall??=texture();c.drawImage(wall,0,0,e.W,e.H);c.save();
 const shift=-u*12;c.translate(shift,0);c.globalAlpha=.66;cow(c,270,395,.65,-.08);cow(c,500,415,.48,.08);human(c,1280,420,.75,-.2);human(c,1390,435,.6,.1);
 c.globalAlpha=.94;cow(c,280,660,1.05,-.16*Math.sin(Math.min(u,3)));cow(c,1470,660,1.15,.15*Math.sin(Math.min(u,3)));cow(c,1665,635,.66,.1);human(c,510,708,1.1,-.1);human(c,1260,715,.97,.15);
 c.strokeStyle='#884a3055';c.lineWidth=2;for(let i=0;i<55;i++){let x=i*37;path(c,[[x,802+rnd(i)*12],[x+17,798+rnd(i+5)*14],[x+27,804]]);}
 // Tiny hoof-print tally beneath the astonished herder.
 c.fillStyle='#7c432d';for(let i=0;i<6;i++){c.beginPath();c.ellipse(510+i*12,844,2,5,-.3,0,7);c.fill();}c.restore();
 e.rig(c,e.riderX,e.roadY,1,e.t,{ink:'#713c28',body:'#aa6948',paper:'#c8a078',beak:'#925035',bike:'#713c28',lineWidth:4,mode:'line'});
 c.save();c.globalAlpha=.2;c.fillStyle='#edd0a0';for(let i=0;i<500;i++)c.fillRect(rnd(i+550)*1778,rnd(i+890)*1000,1,1);c.restore();
}
