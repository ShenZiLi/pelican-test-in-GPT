let buffer;
const R=n=>{let a=Math.sin(n*61.1)*43758;return a-Math.floor(a);};
function coin(c,x,y,t){c.fillStyle='#e4ac35';const w=2+Math.abs(Math.cos(t*7))*3;c.fillRect(x-w,y-7,w*2,14);c.fillStyle='#fff0a2';c.fillRect(x-w+1,y-5,2,9);}
export function draw(c,u,e){buffer??=document.createElement('canvas');buffer.width=356;buffer.height=200;const b=buffer.getContext('2d');b.imageSmoothingEnabled=false;const q=Math.floor(e.t*10)/10;b.fillStyle='#243d68';b.fillRect(0,0,356,200);
 b.fillStyle='#8fbcbd';for(let i=0;i<6;i++){const x=((i*90-u*7)%470)-40;b.fillRect(x,60+(i%2)*13,34,6);b.fillRect(x+7,55+(i%2)*13,18,12);}
 b.fillStyle='#416b70';for(let i=0;i<7;i++){let x=i*70-u*12;b.beginPath();b.moveTo(x-30,152);b.lineTo(x+10,93+(i%3)*8);b.lineTo(x+55,152);b.fill();}b.fillStyle='#315453';for(let i=0;i<12;i++){let x=i*38-u*17;b.fillRect(x,130,17,26);b.fillRect(x+4,117,9,19);}
 const pit=242-u*25;b.fillStyle='#bc8d50';b.fillRect(0,156,356,44);b.fillStyle='#79b261';b.fillRect(0,154,356,5);b.fillStyle='#493d44';b.fillRect(pit,156,42,44);b.fillStyle='#243d68';b.fillRect(pit+3,156,36,44);for(let i=0;i<50;i++){let x=(i*19-u*25)%370;if(x<pit-5||x>pit+42){b.fillStyle='#82583e';b.fillRect(x,165+(i%3)*11,9,3);}}
 const jump=u>1.5&&u<3.6?Math.sin((u-1.5)/2.1*Math.PI)*29:0;e.rig(b,e.travelX==null?170:e.travelX*356/e.W,156-Math.round(jump),.2,q,{ink:'#162d39',body:'#f4e6bb',beak:'#e7ae40',bike:'#d78153',paper:'#243d68',lineWidth:5,mode:'normal'});
 if(u<2.5)coin(b,200-u*11,110,q);if(u>=2.5&&u<4.2){b.fillStyle='#f7eeb8';b.font='bold 12px monospace';b.fillText('1UP',142,50-Math.floor((u-2.5)*8));for(let i=0;i<5;i++){let a=i*1.25;b.fillRect(172+Math.cos(a)*(u-2.5)*17,107+Math.sin(a)*(u-2.5)*14,2,2);}}
 b.font='8px monospace';b.fillStyle='#f4e6bb';b.fillText('FEATHER QUEST',229,15);b.fillText('COINS '+(u<2.5?'00':'01'),274,27);b.fillText('WORLD 20-16',231,40);
 // Crisp, unfiltered 356 × 200 logical pixel framebuffer.
 c.save();c.imageSmoothingEnabled=false;c.drawImage(buffer,0,0,e.W,1000);c.restore();
}

