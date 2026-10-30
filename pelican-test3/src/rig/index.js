import {ellipse,path,TAU} from '../kit/index.js';
export function pose(t){const a=TAU*t;return {a,feet:[{x:-12+39*Math.cos(a),y:-94+39*Math.sin(a)},{x:-12-39*Math.cos(a),y:-94-39*Math.sin(a)}],bob:Math.sin(a*2)*2};}
export function rig(c,x,y,scale=1,t=0,style={}){
 const s={ink:'#273634',body:'#f3ead6',beak:'#d69a4b',bike:'#466d67',paper:'#eadfc7',lineWidth:3,mode:'normal',...style};
 const mono=s.mode==='silhouette',line=s.mode==='line'||s.mode==='neon',p=pose(t),ink=s.ink;
 c.save();c.translate(x,y);c.scale(scale,scale);c.lineCap='round';c.lineJoin='round';c.lineWidth=s.lineWidth;
 if(s.mode==='neon'){c.shadowColor=ink;c.shadowBlur=15}
 const body=mono?ink:line?null:s.body,bike=mono?ink:s.bike;
 for(const wx of [-116,116]){ellipse(c,wx,-78,77,77,mono?null:line?null:s.paper,ink,s.lineWidth+1);ellipse(c,wx,-78,68,68,null,ink,1.5);for(let i=0;i<12;i++){let a=p.a*.55+i*TAU/12;path(c,[[wx,-78],[wx+68*Math.cos(a),-78+68*Math.sin(a)]],ink,.9)}ellipse(c,wx,-78,5,5,ink)}
 path(c,[[-116,-78],[-62,-184],[-12,-94],[-116,-78],[59,-184],[-62,-184]],bike,6);
 path(c,[[-12,-94],[59,-184],[116,-78],[72,-217],[100,-226]],bike,6);
 path(c,[[-65,-184],[-67,-207]],ink,6);path(c,[[-91,-211],[-40,-211]],ink,8);
 path(c,[[-28,-242],[-65,-181],[p.feet[1].x,p.feet[1].y]],mono||line?ink:'#b88446',10);
 const bird=new Path2D();bird.moveTo(-97,-237);bird.bezierCurveTo(-175,-256,-193,-288,-198,-311);bird.bezierCurveTo(-165,-300,-142,-302,-133,-320);bird.bezierCurveTo(-109,-368,-33,-377,8,-333);bird.bezierCurveTo(25,-319,31,-329,27,-358);bird.bezierCurveTo(8,-399,21,-446,60,-450);bird.bezierCurveTo(96,-453,109,-431,100,-409);bird.bezierCurveTo(89,-390,74,-386,74,-355);bird.bezierCurveTo(80,-299,40,-233,-36,-228);bird.bezierCurveTo(-60,-224,-81,-229,-97,-237);bird.closePath();
 c.strokeStyle=ink;c.lineWidth=s.lineWidth;if(body){c.fillStyle=body;c.fill(bird)}c.stroke(bird);
 const wing=new Path2D();wing.moveTo(-127,-312);wing.bezierCurveTo(-79,-347,-29,-322,-4,-286);wing.bezierCurveTo(-44,-270,-84,-270,-127,-312);c.stroke(wing);
 for(let n=0;n<7;n++)path(c,[[-113+n*13,-311+n*2],[-88+n*13,-291+n*.8]],ink,1.2);
 path(c,[[91,-425],[233,-400],[92,-399]],ink,s.lineWidth,mono?ink:line?null:s.beak,true);
 const pouch=new Path2D();pouch.moveTo(93,-399);pouch.quadraticCurveTo(145,-336,211,-397);pouch.lineTo(93,-399);if(!line){c.fillStyle=mono?ink:'#cfad75';c.fill(pouch)}c.stroke(pouch);
 ellipse(c,77,-427,5.5,6,mono?ink:'#faf7ec',ink,1.2);ellipse(c,78,-428-(s.eyeRoll?3:0),2.2,2.5,ink);
 path(c,[[1,-270],[42,-253],[92,-224]],ink,5);path(c,[[-33,-238],[-52,-172],[p.feet[0].x,p.feet[0].y]],mono||line?ink:'#b88446',11);
 path(c,[[p.feet[0].x-9,p.feet[0].y],[p.feet[0].x+17,p.feet[0].y]],ink,5);
 path(c,[[p.feet[1].x,p.feet[1].y],[-12,-94],[p.feet[0].x,p.feet[0].y]],bike,4);ellipse(c,-12,-94,10,10,null,ink,3);
 c.restore();
}
