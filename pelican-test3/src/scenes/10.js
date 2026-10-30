// Original cut-leather shadow theatre, deterministic 10 Hz puppet performance.
let plate;
const rand=n=>{let x=Math.sin(n*91.7+7.3)*43758.54;return x-Math.floor(x);};
function line(c,x,y,X,Y,w,col){c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.lineWidth=w;c.strokeStyle=col;c.stroke();}
function bg(){const a=document.createElement('canvas');a.width=1778;a.height=1000;const c=a.getContext('2d');const g=c.createRadialGradient(900,500,80,900,500,1000);g.addColorStop(0,'#e9bc6c');g.addColorStop(.7,'#b57838');g.addColorStop(1,'#51351f');c.fillStyle=g;c.fillRect(0,0,1778,1000);
 for(let i=0;i<10000;i++){c.fillStyle=`rgba(62,35,16,${rand(i)*.06})`;c.fillRect(rand(i+1)*1778,rand(i+2)*1000,1,1+rand(i+3)*3);}
 // Hanging velvet and pierced leather architectural borders.
 c.fillStyle='#34241d';c.fillRect(0,0,1778,48);c.fillRect(0,940,1778,60);
 for(let i=0;i<24;i++){const x=i*78;c.beginPath();c.moveTo(x,30);c.quadraticCurveTo(x+39,120,x+78,30);c.fill();for(let j=0;j<5;j++){c.beginPath();c.arc(x+17+j*11,51+Math.sin(j/4*Math.PI)*13,2.5,0,7);c.fillStyle='#b38342';c.fill();}c.fillStyle='#34241d';}
 for(const mirror of [false,true]){c.save();if(mirror){c.translate(1778,0);c.scale(-1,1);}c.fillStyle='#33231b';c.beginPath();c.moveTo(0,950);c.lineTo(0,180);c.bezierCurveTo(150,260,60,390,160,440);c.bezierCurveTo(260,530,130,650,215,720);c.lineTo(270,950);c.fill();
 for(let i=0;i<13;i++){let y=250+i*48;for(let j=0;j<3;j++){c.beginPath();c.ellipse(28+j*31,y+j*9,4,11,.5,0,7);c.fillStyle='#b88346';c.fill();}}c.restore();}
 line(c,0,780,1778,780,3,'#51361c');
 // Silent orchestra silhouettes under the screen.
 for(let i=0;i<8;i++){const x=300+i*170;c.fillStyle='#32231d';c.beginPath();c.ellipse(x,934,23,25,0,0,7);c.fill();c.fillRect(x-30,957,65,43);c.beginPath();c.ellipse(x+55,971,39,12,0,0,7);c.fill();}return a;}
export function draw(c,u,e){plate??=bg();c.drawImage(plate,0,0);const t=Math.floor(e.t*10)/10,x=e.riderX+Math.sin(t*2)*5;c.save();c.shadowColor='rgba(48,27,13,.35)';c.shadowBlur=8;e.rig(c,x,780,1,t,{mode:'silhouette',ink:'#35271f',body:'#35271f',beak:'#35271f',bike:'#35271f',lineWidth:7});c.shadowBlur=0;
 // Patterned cut-outs in the bird and wheel field, lit by the lamp.
 c.fillStyle='#ddb06a';for(let j=0;j<8;j++){c.beginPath();c.ellipse(x-55+j*12,548+Math.sin(j/7*Math.PI)*20,2.8,6.5,-.5,0,7);c.fill();}
 for(const wx of [x-116,x+116])for(let i=0;i<16;i++){const a=i*Math.PI/8+t*2*Math.PI;c.beginPath();c.arc(wx+Math.cos(a)*64,702+Math.sin(a)*64,2.5,0,7);c.fill();}
 line(c,x-25,580,x-62,1000,4,'#37271c');line(c,x+50,470,x+110+Math.sin(t*4)*15,1000,3,'#37271c');
 // Joint studs and ornamental crest make the silhouette distinctly leather.
 c.strokeStyle='#c59b52';c.lineWidth=2;for(let i=0;i<7;i++){c.beginPath();c.arc(x-48+i*10,515-i*3,4,0,7);c.stroke();}c.restore();}

