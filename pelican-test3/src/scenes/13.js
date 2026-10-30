const R=n=>{const x=Math.sin(n*87.31)*48134.3;return x-Math.floor(x);};
function curve(c,y,color,phase,width){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(-40,y);for(let j=0;j<9;j++){let x=j*235;c.bezierCurveTo(x+40,y-40+Math.sin(phase+j)*38,x+110,y+50+Math.cos(j+phase)*28,x+235,y+Math.sin(j+phase)*26);}c.stroke();}
function scream(c,x,y,s,shock){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#282e35';c.beginPath();c.moveTo(-35,0);c.bezierCurveTo(-54,-79,-18,-135,-17,-191);c.lineTo(22,-191);c.bezierCurveTo(21,-120,43,-66,41,0);c.fill();c.fillStyle='#d8b68b';c.strokeStyle='#302c2a';c.lineWidth=4;c.beginPath();c.ellipse(3,-222,32,46,.09,0,7);c.fill();c.stroke();c.fillStyle='#42362d';for(let xx of [-8,16]){c.beginPath();c.ellipse(xx,-235,5,8,0,0,7);c.fill();}c.beginPath();c.ellipse(4,-210,shock?10:4,shock?18:5,0,0,7);c.fill();c.strokeStyle='#cf9a76';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(-24,-128);c.quadraticCurveTo(-62,-182,shock?-29:-52,shock?-233:-160);c.stroke();c.beginPath();c.moveTo(25,-130);c.quadraticCurveTo(65,-184,shock?32:54,shock?-229:-154);c.stroke();c.restore();}
export function draw(c,u,e){c.fillStyle='#c18c54';c.fillRect(0,0,e.W,1000);
 for(let i=0;i<23;i++){curve(c,25+i*18,['#d9783d','#e8b660','#a83d35','#cf5434'][i%4],i*.4+u*.12,19);}
 c.fillStyle='#273d4c';c.beginPath();c.moveTo(0,530);c.bezierCurveTo(200,400,420,580,740,465);c.bezierCurveTo(1100,340,1440,490,1778,422);c.lineTo(1778,1000);c.lineTo(0,1000);c.fill();
 for(let i=0;i<17;i++)curve(c,460+i*25,['#547078','#1b3747','#8b8b6c'][i%3],i*.25,8);
 // Original diagonal bridge, broad enough for a bicycle lane.
 c.fillStyle='#77543f';c.beginPath();c.moveTo(0,693);c.lineTo(1778,825);c.lineTo(1778,1000);c.lineTo(0,1000);c.fill();
 c.strokeStyle='#c99b69';c.lineWidth=5;for(let i=0;i<20;i++){let x=i*112-(u*32)%112;c.beginPath();c.moveTo(x,700+x*.07);c.lineTo(x-170,1000);c.stroke();}
 c.strokeStyle='#2d3330';c.lineWidth=19;c.beginPath();c.moveTo(-40,584);c.lineTo(1810,756);c.stroke();c.lineWidth=10;c.beginPath();c.moveTo(-40,677);c.lineTo(1810,848);c.stroke();for(let i=0;i<12;i++){let x=i*170-u*12;c.beginPath();c.moveTo(x,584+x*.093);c.lineTo(x-15,856+x*.06);c.stroke();}
 scream(c,1375-u*7,826,1.2,u>1.8);scream(c,240-u*7,737,.48,false);scream(c,310-u*7,743,.44,false);
 e.rig(c,e.riderX,e.roadY,1,e.t,{ink:'#27312c',body:'#d9bc7b',beak:'#d48a43',bike:'#355461',lineWidth:5});
 c.save();c.globalAlpha=.06;c.strokeStyle='#f8da93';c.lineWidth=1;for(let i=0;i<1300;i++){let x=R(i)*1778,y=R(i+1400)*1000;c.beginPath();c.moveTo(x,y);c.lineTo(x+8,y+11);c.stroke();}c.restore();
}
