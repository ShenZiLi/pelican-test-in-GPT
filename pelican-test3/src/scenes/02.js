let plaster;
const R=n=>{const x=Math.sin(n*63.17+4)*43758.5;return x-Math.floor(x);};
function lines(c,a,close=false){c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();c.stroke();}
function glyph(c,x,y,n,s=1){c.save();c.translate(x,y);c.scale(s,s);c.lineWidth=2.5;c.strokeStyle='#3f5147';if(n%4===0){c.beginPath();c.ellipse(15,13,13,7,0,0,7);c.stroke();c.beginPath();c.arc(15,13,3,0,7);c.fill();lines(c,[[0,13],[11,26],[28,20]]);}else if(n%4===1){lines(c,[[0,24],[7,2],[14,24],[21,2],[28,24]]);}else if(n%4===2){lines(c,[[0,23],[7,9],[19,9],[25,1],[29,7],[20,15],[20,28]]);lines(c,[[9,14],[4,30],[15,29]]);}else {c.strokeRect(5,0,20,28);lines(c,[[5,9],[25,9]]);lines(c,[[5,18],[25,18]]);}c.restore();}
function bg(){const b=document.createElement('canvas');b.width=1778;b.height=1000;const c=b.getContext('2d');c.fillStyle='#dac79d';c.fillRect(0,0,1778,1000);for(let i=0;i<12000;i++){c.fillStyle=i%2?'#5e432113':'#fff5cb33';c.fillRect(R(i)*1778,R(i+13000)*1000,1+R(i+27000)*5,1+R(i+500)*2);}c.strokeStyle='#ae5c4d26';c.lineWidth=1;for(let x=0;x<1778;x+=58)lines(c,[[x,210],[x,780]]);for(let y=220;y<800;y+=58)lines(c,[[0,y],[1778,y]]);return b;}
function lotus(c,x,y){c.save();c.translate(x,y);c.strokeStyle='#426d64';c.lineWidth=5;lines(c,[[0,0],[0,-100]]);c.fillStyle='#527d76';c.beginPath();c.moveTo(-35,-85);c.quadraticCurveTo(-20,-108,0,-126);c.quadraticCurveTo(20,-108,35,-85);c.closePath();c.fill();c.stroke();c.fillStyle='#be9a50';c.fillRect(-39,-87,78,8);c.restore();}
function attendant(c,x,y,mirror){c.save();c.translate(x,y);c.scale(mirror,1);c.lineWidth=3;c.strokeStyle='#4a3e2a';c.fillStyle='#a85f3c';c.beginPath();c.ellipse(0,-220,22,34,0,0,7);c.fill();c.stroke();c.fillStyle='#2d4140';c.fillRect(-22,-252,27,54);c.fillStyle='#ad6944';c.beginPath();c.moveTo(-16,-189);c.lineTo(18,-187);c.lineTo(25,-96);c.lineTo(-26,-96);c.closePath();c.fill();c.stroke();lines(c,[[15,-173],[60,-130],[88,-165]]);lines(c,[[-13,-174],[-42,-131],[-61,-159]]);c.fillStyle='#f2dfb5';c.beginPath();c.moveTo(-27,-100);c.lineTo(26,-100);c.lineTo(43,-41);c.lineTo(-39,-41);c.closePath();c.fill();c.stroke();lines(c,[[-20,-41],[-20,0],[-46,0]]);lines(c,[[20,-41],[29,0],[53,0]]);c.fillStyle='#b98b38';c.fillRect(-20,-185,39,13);c.restore();}
export function draw(c,u,e){plaster??=bg();c.drawImage(plaster,0,0,e.W,e.H);
 c.fillStyle='#2e625c';c.fillRect(0,259,e.W,7);c.fillRect(0,837,e.W,7);c.fillStyle='#aa5d3d';c.fillRect(0,270,e.W,5);c.fillRect(0,823,e.W,7);
 for(let i=0;i<42;i++){glyph(c,18+i*43,297,i,.85);glyph(c,18+i*43,875,i+1,.85);}
 for(const x of [98,1680]){c.fillStyle='#c19c5c';c.fillRect(x-24,390,48,390);lotus(c,x,480);c.fillStyle='#426d64';c.fillRect(x-38,773,76,14);}
 attendant(c,356,778,1);attendant(c,1400,778,-1);lotus(c,520,780);lotus(c,1260,780);
 c.save();c.strokeStyle='#a1793d';c.lineWidth=5;c.beginPath();c.roundRect(1150,209,385,65,32);c.fillStyle='#dac79d';c.fill();c.stroke();c.fillStyle='#474532';c.textAlign='center';c.font='28px serif';c.fillText('鹈 鹕 测 试',1342,253);c.restore();
 // The drawing pose pauses on the middle bar, while the camera keeps moving.
 const pose=u>=2&&u<4?Math.floor(e.t-u)+2:e.t;e.rig(c,e.riderX,e.roadY,1,pose,{ink:'#3d493c',body:'#d3b984',beak:'#b96e3d',bike:'#41685e',lineWidth:4,mode:'normal'});
 c.strokeStyle='#60563d';c.lineWidth=3;lines(c,[[0,780],[e.W,780]]);
}

