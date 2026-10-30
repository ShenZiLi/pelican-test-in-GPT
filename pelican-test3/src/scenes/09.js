// Original sparse ink composition: a bird that declines to explain itself.
let plate;
const rnd=(n)=>{const x=Math.sin(n*127.1+19.3)*43758.5453;return x-Math.floor(x);};
function path(c,pts,w,color){c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);c.lineWidth=w;c.strokeStyle=color;c.stroke();}
function background(){
 const c=document.createElement('canvas');c.width=1778;c.height=1000;const g=c.getContext('2d');g.fillStyle='#e9e4d3';g.fillRect(0,0,1778,1000);
 for(let i=0;i<14000;i++){g.fillStyle=`rgba(91,71,43,${.025+rnd(i)*.045})`;g.fillRect(rnd(i+2)*1778,rnd(i+3)*1000,.5+rnd(i+4)*2,.3+rnd(i+5));}
 // Quiet low pond, with a single weathered stalk leading out of the frame.
 for(let j=0;j<16;j++){g.beginPath();g.moveTo(90,887+j*4);g.bezierCurveTo(400,855+j*3,1180,886+j*2,1670,870+j*5);g.strokeStyle=`rgba(57,62,52,${.015+j*.001})`;g.lineWidth=1;g.stroke();}
 path(g,[[1250,1000],[1290,855],[1318,728],[1320,600],[1282,489]],7,'#393e35');
 path(g,[[1300,820],[1422,715],[1490,642]],3,'#575b4d');
 for(let j=0;j<10;j++){g.beginPath();g.moveTo(1320,600);g.bezierCurveTo(1180-j*4,580-j*2,1090+j*3,488,1150,460);g.bezierCurveTo(1190,410,1370,445,1400+j*3,550);g.bezierCurveTo(1380,580,1340,585,1320,600);g.fillStyle=`rgba(36,43,36,${.06+j*.004})`;g.fill();}
 for(let j=0;j<17;j++){const a=j/17*5.4;path(g,[[1315,579],[1300+Math.cos(a)*158,525+Math.sin(a)*70]],.8,'rgba(222,220,197,.22)');}
 g.beginPath();g.moveTo(1490,642);g.bezierCurveTo(1430,599,1448,557,1500,570);g.bezierCurveTo(1568,593,1570,648,1490,642);g.fillStyle='#52574a';g.fill();
 // Fly-white scumble around the rock.
 for(let j=0;j<70;j++){const x=190+rnd(j+80)*270,y=785+rnd(j+180)*130;path(g,[[x,y],[x+30+rnd(j)*50,y-rnd(j+2)*22]],1+rnd(j+3)*5,'rgba(37,43,37,.08)');}
 return c;
}
export function draw(c,u,e){
 plate??=background();c.drawImage(plate,0,0);c.save();c.lineCap='round';
 // A few discontinuous strokes are enough to carry the road across the scroll.
 path(c,[[0,780],[325,779]],1.2,'rgba(62,65,53,.24)');path(c,[[1060,780],[1778,780]],1.2,'rgba(62,65,53,.24)');
 const x=e.riderX; e.rig(c,x,780,.92,e.t,{ink:'#30362e',paper:'#e9e4d3',body:'#dedfcc',beak:'#c9c5ac',bike:'#343b30',lineWidth:3,mode:'line',eyeRoll:true});
 // A deliberately oversized upturned pupil becomes the tiny second-bar joke.
 const a=Math.max(0,Math.min(1,(u-2)*4));c.globalAlpha=a;c.fillStyle='#e9e4d3';c.beginPath();c.ellipse(x+71,387,10,8,-.14,0,Math.PI*2);c.fill();c.fillStyle='#252d26';c.beginPath();c.arc(x+74,381,3,0,Math.PI*2);c.fill();
 c.globalAlpha=1;c.fillStyle='#8e3c2d';c.fillRect(1542,748,51,52);c.strokeStyle='#e7d5b7';c.lineWidth=2;c.strokeRect(1549,755,37,38);c.font='20px serif';c.fillStyle='#e7d5b7';c.fillText('不',1557,777);c.fillText('语',1557,797);c.restore();
}

