// Original impasto night panorama, with brush-direction fields and wheel-driven heavens.
let plate;const R=n=>{let x=Math.sin(n*93.71+4)*47731.17;return x-Math.floor(x);};
function stroke(c,x,y,len,a,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a+.2)*len*.5,y+Math.sin(a+.2)*len*.5,x+Math.cos(a)*len,y+Math.sin(a)*len);c.stroke();}
function bg(){const a=document.createElement('canvas');a.width=1778;a.height=1000;const c=a.getContext('2d');c.fillStyle='#11294b';c.fillRect(0,0,1778,1000);const cols=['#294e75','#345d83','#466c8b','#183c68','#66898d','#1c355a'];
 for(let i=0;i<15000;i++){let x=R(i)*1778,y=R(i+20000)*740;let angle=Math.sin(x/150)*.25+Math.cos(y/120)*.2;stroke(c,x,y,10+R(i+5)*24,angle,cols[i%cols.length],1+R(i+7)*3);}
 c.fillStyle='#142f3b';c.beginPath();c.moveTo(0,690);for(let x=0;x<1800;x+=20)c.lineTo(x,640+Math.sin(x/170)*48+Math.cos(x/47)*13);c.lineTo(1778,1000);c.lineTo(0,1000);c.fill();
 for(let i=0;i<4500;i++){let x=R(i+40000)*1778,y=660+R(i+50000)*340;stroke(c,x,y,12+R(i+6)*27,Math.sin(x/180)*.2,['#345846','#244b48','#547160','#162e42','#315662'][i%5],2+R(i+13)*3);}
 // A ribbon of hillside cottages; intentionally no church/cypress arrangement.
 for(let i=0;i<13;i++){let x=60+i*134,y=610+Math.sin(i*.7)*35,w=54+R(i+300)*35,h=50+R(i+401)*45;c.fillStyle=i%2?'#476265':'#687b6b';c.fillRect(x,y,w,h);c.fillStyle='#243f52';c.beginPath();c.moveTo(x-9,y);c.lineTo(x+w*.5,y-35);c.lineTo(x+w+9,y);c.fill();for(let j=0;j<3;j++){c.fillStyle=j%2?'#b6aa67':'#e1bc57';c.fillRect(x+9+j*20,y+15,9,14);}for(let j=0;j<12;j++)stroke(c,x+R(j+i*17)*w,y+R(j+i*23)*h,9,.2,'rgba(180,177,118,.3)',2);}
 for(let i=0;i<700;i++){let x=R(i+70000)*1778,y=770+R(i+71000)*67;stroke(c,x,y,15+R(i+12)*30,.05,['#a29355','#6f754e','#c0ab63','#4c6550'][i%4],2.5);}return a;}
export function draw(c,u,e){plate??=bg();c.drawImage(plate,0,0);c.save();
 // Each small stroke travels along its own spiral; no history buffer or stochastic flicker.
 for(const [cx,cy,r,dir] of [[380,330,170,1],[1070,380,205,-1],[1540,290,105,1]]){for(let ring=0;ring<21;ring++){const rad=12+ring*r/21;const count=18+ring*3;for(let j=0;j<count;j++){let a=j/count*Math.PI*2+ring*.18+e.t*.19*dir;let x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad*.57;stroke(c,x,y,9+ring*.35,a+Math.PI/2,['#91a58e','#5b8497','#d3c874','#769ca2','#385d85'][ring%5],2.5);}}}
 for(let i=0;i<10;i++){let x=100+i*172+Math.sin(i*8)*35,y=232+R(i+800)*300;for(let ring=4;ring>0;ring--){c.beginPath();c.arc(x,y,ring*7,0,7);c.strokeStyle=['','#eee0a2','#e2c978','#b5b477','#5d8592'][ring];c.lineWidth=4;c.stroke();}c.fillStyle='#f5dfa0';c.beginPath();c.arc(x,y,5,0,7);c.fill();}
 e.rig(c,e.riderX,780,1,e.t,{ink:'#192e48',body:'#d7cd99',beak:'#e7b54d',bike:'#759998',lineWidth:6});
 // Short gold impasto dashes articulate the turning rims.
 for(const wx of [e.riderX-116,e.riderX+116])for(let j=0;j<18;j++){let a=j/18*Math.PI*2+e.t*2*Math.PI;stroke(c,wx+Math.cos(a)*77,702+Math.sin(a)*77,10,a+Math.PI/2,j%2?'#d8bc66':'#67928d',3);}c.restore();}

