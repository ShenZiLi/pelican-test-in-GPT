// Independent Tokaido roadside print: diagonal rain, tea houses, pine and travellers.
let plate;const R=n=>{let a=Math.sin(n*76.19+2)*47131.13;return a-Math.floor(a);};
function poly(c,p,fill,stroke='#263c43',w=2){c.beginPath();c.moveTo(...p[0]);p.slice(1).forEach(x=>c.lineTo(...x));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}
function bg(){const a=document.createElement('canvas');a.width=1778;a.height=1000;const c=a.getContext('2d');const sky=c.createLinearGradient(0,0,0,800);sky.addColorStop(0,'#354f61');sky.addColorStop(.45,'#91b2b2');sky.addColorStop(1,'#cfceb3');c.fillStyle=sky;c.fillRect(0,0,1778,1000);
 poly(c,[[0,570],[180,410],[280,462],[495,285],[620,420],[775,340],[950,555],[1130,425],[1300,531],[1570,366],[1778,490],[1778,800],[0,800]],'#839c9d','#708a90',1);
 poly(c,[[0,610],[160,540],[370,601],[620,500],[860,590],[1100,520],[1400,616],[1778,550],[1778,880],[0,880]],'#566f6d','#385251',2);
 for(let i=0;i<90;i++){let x=i*22,y=570+Math.sin(i*.31)*45;c.beginPath();c.moveTo(x,y);c.lineTo(x-10,y+65);c.lineTo(x+13,y+65);c.fillStyle='#324d48';c.fill();}
 poly(c,[[0,740],[550,710],[970,748],[1778,708],[1778,900],[1090,820],[520,850],[0,850]],'#c8b485','#4c5d4c',3);
 // Roofed stalls recede toward a distant village.
 for(let i=0;i<5;i++){let x=1130+i*119,y=553+i*8,s=1-i*.08; c.save();c.translate(x,y);c.scale(s,s);poly(c,[[0,32],[115,32],[115,139],[0,139]],'#bba77d');poly(c,[[-17,32],[45,-22],[137,28],[113,45],[28,15]],'#3d4b48');for(let j=0;j<7;j++){c.strokeStyle='#777c68';c.beginPath();c.moveTo(j*15,39);c.lineTo(j*15,139);c.stroke();}c.fillStyle='#4a5c50';c.fillRect(30,70,38,69);c.fillStyle='#b66042';c.fillRect(7,42,105,27);c.restore();}
 // Cropped pine: branching asymmetry rather than the famous wave composition.
 c.strokeStyle='#313d37';c.lineCap='round';c.lineWidth=22;c.beginPath();c.moveTo(190,1000);c.bezierCurveTo(240,800,183,565,308,342);c.stroke();c.lineWidth=11;c.beginPath();c.moveTo(248,569);c.bezierCurveTo(140,490,170,402,90,371);c.stroke();
 for(let i=0;i<28;i++){let x=70+R(i)*310,y=290+R(i+60)*220;c.fillStyle='#2e4a43';c.beginPath();c.ellipse(x,y,42+R(i+80)*40,15+R(i+9)*10,-.1,0,7);c.fill();for(let j=0;j<7;j++){c.strokeStyle='#68776a';c.lineWidth=.8;c.beginPath();c.moveTo(x-25+j*8,y);c.lineTo(x-32+j*8,y-11);c.stroke();}}
 c.fillStyle='#5a725c';c.fillRect(0,890,1778,110);for(let i=0;i<250;i++){let x=R(i+500)*1778,y=850+R(i+600)*150;c.strokeStyle='#354f43';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+9,y-19);c.stroke();}
 for(let i=0;i<10000;i++){c.fillStyle=`rgba(237,222,184,${R(i)*.07})`;c.fillRect(R(i+2)*1778,R(i+3)*1000,2,1);}return a;}
export function draw(c,u,e){plate??=bg();c.drawImage(plate,0,0);e.rig(c,e.riderX,780,.94,e.t,{ink:'#273d40',body:'#d9d3b8',paper:'#d9d3b8',beak:'#bf9160',bike:'#48666a',lineWidth:3});
 // Two travellers politely hold their parasols while watching the improbable vehicle.
 for(const [x,y,s] of [[530,735,.8],[1250,755,.9]]){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#ad6048';c.beginPath();c.moveTo(-20,0);c.lineTo(-28,-95);c.lineTo(13,-95);c.lineTo(28,0);c.fill();c.fillStyle='#c9b98e';c.beginPath();c.arc(0,-112,13,0,7);c.fill();c.strokeStyle='#344648';c.lineWidth=3;c.beginPath();c.moveTo(16,-60);c.lineTo(16,-170);c.stroke();c.fillStyle='#c3ac77';c.beginPath();c.moveTo(-53,-151);c.quadraticCurveTo(12,-219,81,-151);c.closePath();c.fill();c.stroke();for(let j=0;j<7;j++){c.beginPath();c.moveTo(15,-185);c.lineTo(-50+j*21,-151);c.stroke();}c.restore();}
 c.save();c.strokeStyle='rgba(218,225,209,.32)';c.lineWidth=1;for(let i=0;i<165;i++){let x=(R(i+700)*1900-e.t*75)%1900,y=(R(i+800)*1200+e.t*310)%1200-100;c.beginPath();c.moveTo(x,y);c.lineTo(x-23,y+69);c.stroke();}c.restore();}
