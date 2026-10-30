const R=n=>{const x=Math.sin(n*73.41)*42731;return x-Math.floor(x);};
function staircase(c){c.fillStyle='#30322e';c.beginPath();c.moveTo(0,1000);for(let i=0;i<12;i++){let x=i*155,y=950-i*26;c.lineTo(x,y);c.lineTo(x+155,y);}c.lineTo(1778,1000);c.closePath();c.fill();c.strokeStyle='#6b6c5c';c.lineWidth=2;for(let i=0;i<12;i++){let x=i*155,y=950-i*26;c.beginPath();c.moveTo(x,y);c.lineTo(x+155,y);c.stroke();}}
export function draw(c,u,e){c.fillStyle='#252723';c.fillRect(0,0,e.W,1000);const g=c.createRadialGradient(970,480,60,970,480,900);g.addColorStop(0,'#d2cfad');g.addColorStop(.6,'#92927a');g.addColorStop(1,'#393d35');c.fillStyle=g;c.fillRect(0,0,e.W,1000);
 // An original slant of light and architectural planes, not a film still.
 c.fillStyle='#4e534749';c.beginPath();c.moveTo(1250,0);c.lineTo(1778,0);c.lineTo(1778,1000);c.lineTo(1450,1000);c.fill();c.strokeStyle='#777d6838';c.lineWidth=2;for(let i=0;i<8;i++){c.beginPath();c.moveTo(0,250+i*90);c.lineTo(1778,220+i*90);c.stroke();}staircase(c);
 c.strokeStyle='#21251f';c.lineWidth=19;c.beginPath();c.moveTo(-50,806);c.lineTo(1820,493);c.stroke();c.lineWidth=10;for(let i=0;i<12;i++){const x=i*165;c.beginPath();c.moveTo(x,810-x*.167);c.lineTo(x,975-x*.167);c.stroke();}
 // Reach exactly the common transition silhouette by the end of the shot.
 const climb=Math.max(0,1-u/5.4);const y=e.roadY+climb*76;c.save();c.shadowColor='#10130f';c.shadowBlur=8;e.rig(c,e.riderX,y,1,e.t,{ink:'#171c17',mode:'silhouette',lineWidth:5});c.restore();
 if(u>5.55){const a=(u-5.55)/.45;c.save();c.globalAlpha=Math.min(.8,a);e.rig(c,e.riderX,e.roadY,1,e.t,{ink:'#90e8a0',bike:'#90e8a0',mode:'neon',lineWidth:2});c.restore();}
 c.save();c.globalAlpha=.07;for(let i=0;i<2200;i++){c.fillStyle=i%2?'#fffbe0':'#151d14';c.fillRect(R(i)*1778,R(i+2300)*1000,2,1);}c.restore();
}
