import {cached,rect,line,ellipse,path,text,rng,TAU} from '../kit/draw.js';
import {poseAt} from '../rig/pose.js';
import {sceneSpace,transformSubject} from '../main/scene-space.js';

// An invented messenger, including its reed insignia and all toolbar glyphs.
const C={desk:'#a0b9c4',ink:'#35546c',old:'#e2e1d1',edge:'#738e9b',white:'#f3f1df',blue:'#7995a7',green:'#7c9a85'};
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const sprites=new Map();
function label(c,s,x,y,size=22,color=C.ink,weight=400){text(c,s,x,y,size,color,{weight,mono:!/[\u3400-\u9fff]/.test(s)});}
function bevel(c,x,y,w,h,fill=C.old,down=false){rect(c,x,y,w,h,fill,C.edge,2);const a=down?C.edge:'#fffbe9',b=down?'#fffbe9':C.edge;line(c,[[x+2,y+h-2],[x+2,y+2],[x+w-2,y+2]],a,2);line(c,[[x+w-2,y+2],[x+w-2,y+h-2],[x+2,y+h-2]],b,2);}
function reed(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,0,21,21,'#c1cabb',C.ink,1.5);line(c,[[-6,13],[-3,-12],[3,13],[9,-9]],C.ink,2);ellipse(c,-3,-9,3,7,C.green);ellipse(c,9,-8,3,7,C.green);line(c,[[-4,4],[-14,-3],[8,4],[16,-2]],C.ink,2);c.restore();}
function avatar(c,x,y){bevel(c,x,y,61,61,'#afbeb6',true);ellipse(c,x+30,y+21,11,11,C.white,C.ink,2);path(c,`M${x+12} ${y+52}q4-21 18-17q16-4 20 17Z`,C.blue,C.ink,2);path(c,`M${x+16} ${y+18}q16-22 30 0q-13-5-30 0`,C.ink);ellipse(c,x+26,y+21,1.5,1.5,C.ink);ellipse(c,x+35,y+21,1.5,1.5,C.ink);line(c,[[x+27,y+29],[x+34,y+29]],C.ink,1);}
function glyph(c,x,y,id){c.save();c.translate(x,y);if(id===0){rect(c,-11,-8,22,17,'#eee8bb',C.ink,2);line(c,[[-11,-8],[0,1],[11,-8]],C.ink,2);}else if(id===1){ellipse(c,0,0,10,10,'#dcba77',C.ink,2);ellipse(c,-4,-3,1,2,C.ink);ellipse(c,4,-3,1,2,C.ink);path(c,'M-5 3Q0 9 5 3',null,C.ink,1.5);}else if(id===2){rect(c,-10,-10,20,20,'#b3c3b1',C.ink,2);path(c,'M-8 7L-1-3L4 2L9-3L9 7Z',C.green);ellipse(c,5,-5,2,2,C.white);}else{line(c,[[-7,-10],[7,-10],[7,9],[-7,9],[-7,-10]],C.ink,2);line(c,[[-3,-5],[3,-5],[-3,0],[3,0]],C.blue,2);}c.restore();}

function wallpaper(c){rect(c,-389,0,1778,1000,C.desk);const r=rng(8921); // Cached, palette-limited stipple, rather than live random noise.
 for(let y=0;y<1000;y+=4)for(let x=-389;x<1389;x+=4){const d=BAYER[((y>>2)&3)*4+((x+389>>2)&3)];if(d<4+(y/1000)*4){c.fillStyle=r()>.15?'#92aab6':'#b6c7c6';c.fillRect(x,y,2,2);}}
 // Reed wallpaper motif, all original geometric drawing.
 for(let i=-2;i<10;i++){const x=-320+i*220;line(c,[[x,970],[x+36,732],[x+47,899],[x+80,793]],'#718f9a44',3);ellipse(c,x+38,740,5,22,'#718f9a55');}
 rect(c,-389,954,1778,46,C.old,C.edge,2);bevel(c,-370,961,143,31);reed(c,-352,976,.48);label(c,'芦苇聊',-332,983,20);bevel(c,-216,961,311,31,'#becbd0',true);label(c,'对方正在输入…',-204,983,19);label(c,'LAN / 8 Hz',1190,984,18);
 // Title belongs to a desktop sticky note / open folder caption.
 label(c,'早期聊天',-255,99,43,C.ink,600);label(c,'Early Chat  /  2000年代',-253,140,26);line(c,[[-255,161],[188,161]],C.edge,1);
 reed(c,1277,92,1.35);label(c,'REED / LOCAL',1277,148,19,C.ink);}

function staticWindow(c){
 rect(c,-153,190,1340,726,'#35546c28');bevel(c,-170,175,1340,726,C.old);
 rect(c,-164,181,1328,51,C.blue);reed(c,-135,207,.7);label(c,'芦苇聊  /  对方正在输入…',-102,216,28,C.white,600);
 for(let k=0;k<3;k++){bevel(c,1031+k*42,189,33,32);if(k===0)line(c,[[1040,213],[1054,213]],C.ink,2);if(k===1)rect(c,1081,198,14,13,null,C.ink,2);if(k===2){line(c,[[1123,198],[1137,213]],C.ink,2);line(c,[[1137,198],[1123,213]],C.ink,2);}}
 label(c,'会话',-143,264,22);label(c,'消息',-62,264,22);label(c,'档案',21,264,22);label(c,'帮助',104,264,22);line(c,[[-161,279],[1159,279]],C.edge,1);
 // A compact buddy list contrasts with the expansive received animation.
 bevel(c,-151,291,286,576,'#c4d0cf',true);label(c,'苇岸通讯录',-130,325,25,C.ink,600);label(c,'在线  01 / 03',-128,357,18);line(c,[[-136,371],[118,371]],C.edge,1);
 rect(c,-141,384,266,81,'#a7bec7');avatar(c,-131,394);label(c,'苇岸来客',-56,418,24);label(c,'正在打字',-56,445,18);ellipse(c,107,407,5,5,C.green);
 for(let i=0;i<2;i++){ellipse(c,-107,504+i*73,13,13,'#b3bdb5',C.edge,2);label(c,i?'纸船':'山口风',-78,512+i*73,22,C.edge);label(c,'离线',60,512+i*73,17,C.edge);}
 line(c,[[-135,638],[116,638]],C.edge,1);reed(c,-105,690,1.15);label(c,'慢一点，也能到。',-133,748,20);label(c,'连接于 2003',-129,787,18);label(c,'LOCAL NETWORK',-129,828,17);
 bevel(c,149,291,1002,576,'#f1f0e0',true);
 label(c,'苇岸来客  21:08',173,326,21,'#638776');label(c,'送你一只，永远骑不完的鸟。',173,364,29,C.ink);
 // This received GIF is the world plane of the cyclist, not a floating overlay.
 bevel(c,194,390,634,438,'#f5f1d9',true);rect(c,201,397,620,422,'#d8decb');
 // Dithered reed-bank image inside the received media.
 for(let yy=399;yy<813;yy+=5)for(let xx=203;xx<818;xx+=5){const n=BAYER[((yy/5|0)&3)*4+((xx/5|0)&3)];c.fillStyle=n<5?'#ccccaa':n>13?'#dbdbaa':'#dadaaa';if(n<6||n>13)c.fillRect(xx,yy,3,3);}
 rect(c,201,775,620,44,'#b6c3a2');line(c,[[202,805],[820,805]],'#6d826d',2);
 for(let i=0;i<7;i++){let x=213+i*88;line(c,[[x,756],[x+8,698],[x+13,747],[x+25,718]],'#9ba986',2);ellipse(c,x+9,700,3,9,'#9ba986');}
 label(c,'已接收',853,421,23,'#638776',600);label(c,'循环动图',853,456,22);label(c,'reedride.gif',853,491,20);line(c,[[853,511],[1115,511]],'#bdc9bf',1);label(c,'256 色',853,550,24);label(c,'8 帧 / 秒',853,588,23);label(c,'无限循环',853,626,23);label(c,'48 KB',853,666,20);glyph(c,871,714,2);label(c,'另存为…',897,721,21);
 label(c,'GIF  /  reedride.gif',216,849,17);label(c,'已收取  ✓',698,849,17,'#638776');
 // Original four tool glyphs and a shallow message composer.
 for(let i=0;i<4;i++){bevel(c,163+i*49,874,39,28);glyph(c,182+i*49,888,i);}bevel(c,377,874,610,28,'#f1f0e0',true);label(c,'这次真能骑到明天。',390,896,20);bevel(c,1002,874,140,28);label(c,'发送',1050,896,20);
}

// Pixel silhouette made specifically for this scene; geometry shares the universal
// ground contact / hip / feet, while the pouch, stepped wing and webbed pedals
// are an original low-resolution drawing. A GIF frame contains at most 256 RGBs.
function gifSprite(at){const frame=Math.floor(at*8),key=frame;if(sprites.has(key))return sprites.get(key);const a=document.createElement('canvas');a.width=124;a.height=96;const c=a.getContext('2d');c.translate(60,92);c.scale(.2,.2);const p=poseAt(frame/8),ink='#35546c',body='#f4f0d3',bill='#cc9c59';c.lineCap='square';c.lineJoin='miter';
 for(const wx of [-106,111]){ellipse(c,wx,-62,62,62,null,ink,7);ellipse(c,wx,-62,54,54,null,'#72949b',3);for(let k=0;k<8;k++){const an=p.wheelAngle+k*TAU/8;line(c,[[wx,-62],[wx+Math.cos(an)*58,-62+Math.sin(an)*58]],'#718984',2);}rect(c,wx-4,-66,8,8,ink);}
 line(c,[[-106,-62],[-51,-150],[-8,-71],[-106,-62]],ink,6);line(c,[[-51,-150],[65,-150],[111,-62],[-8,-71],[65,-150],[64,-180],[91,-190]],ink,6);line(c,[[-76,-174],[-39,-174]],ink,8);
 const leg=i=>{const k=p.knees[i],f=p.feet[i];line(c,[[p.hip.x,p.hip.y],[k.x,k.y],[f.x,f.y]],'#a3784d',6);path(c,`M${f.x-12} ${f.y-3}l30 0l-3 9l-32-2Z`,bill,ink,2);line(c,[[-8,-71],[f.x,f.y]],ink,3);};leg(1);
 c.save();c.translate(0,p.bob);path(c,'M-128-222L-107-214Q-144-240-100-262Q-55-283-12-248L11-238Q4-289 18-312Q31-334 56-330Q80-329 81-309L70-290Q47-275 57-236Q59-205 16-188L-38-184L-86-197Z',body,ink,5);
 path(c,'M73-315L231-304L207-296L81-294L69-301Z',bill,ink,3);path(c,'M80-294Q132-245 192-296Q145-269 80-294Z','#d4c59b',ink,3);
 path(c,'M-98-241L-67-254L-32-244L0-216L-23-205L-66-208L-92-222Z','#c8cbb6',ink,3);for(let i=0;i<4;i++)line(c,[[-82+i*16,-238+i*2],[-55+i*17,-217+i]],'#819993',2);
 path(c,'M-107-215L-144-232L-128-213L-149-222L-124-200Z',body,ink,3);line(c,[[4,-222],[37,-188],[86,-191]],ink,6);rect(c,57,-319,8,7,ink);rect(c,58,-319,3,2,'#ffffff');c.restore();leg(0);
 // Exact 3-3-2 palette (8*8*4 = 256). Ordered dithering is applied only to
 // opaque pixels, so no halo is introduced around the sticker's silhouette.
 const im=c.getImageData(0,0,a.width,a.height),d=im.data;for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){const i=(y*a.width+x)*4;if(d[i+3]<64){d[i+3]=0;continue;}const v=(BAYER[(y&3)*4+(x&3)]/16-.5);for(let q=0;q<3;q++){const steps=q===2?3:7;d[i+q]=Math.max(0,Math.min(steps,Math.round(d[i+q]/255*steps+v*.8)))*255/steps;}d[i+3]=255;}c.putImageData(im,0,0);sprites.set(key,a);return a;}

function galleryWindow(c){
 bevel(c,44,188,912,736,C.old);rect(c,50,194,900,52,C.blue);reed(c,80,220,.7);label(c,'芦苇聊 / 对方正在输入…',110,230,27,C.white,600);
 for(let k=0;k<3;k++){bevel(c,827+k*39,203,30,29);if(k===2){line(c,[[912,211],[927,224]],C.ink,2);line(c,[[927,211],[912,224]],C.ink,2);}}
 label(c,'会话',68,281,22);label(c,'消息',149,281,22);label(c,'档案',230,281,22);label(c,'帮助',311,281,22);line(c,[[55,294],[946,294]],C.edge,1);
 avatar(c,68,311);label(c,'苇岸来客  21:08',151,337,24,C.ink,600);label(c,'送你一只，永远骑不完的鸟。',151,374,26,C.ink);
 bevel(c,123,402,754,433,'#f5f1d9',true);rect(c,130,409,740,419,'#d8decb');
 for(let yy=411;yy<820;yy+=5)for(let xx=132;xx<869;xx+=5){const n=BAYER[((yy/5|0)&3)*4+((xx/5|0)&3)];c.fillStyle=n<5?'#ccccaa':n>13?'#dbdbaa':'#dadaaa';if(n<6||n>13)c.fillRect(xx,yy,3,3);}
 rect(c,130,775,740,52,'#b6c3a2');line(c,[[130,805],[870,805]],'#6d826d',2);for(let i=0;i<8;i++){let x=145+i*96;line(c,[[x,756],[x+8,698],[x+13,747],[x+25,718]],'#9ba986',2);ellipse(c,x+9,700,3,9,'#9ba986');}
 label(c,'reedride.gif · 256 色 · 8 帧/秒',136,861,20,'#638776');label(c,'无限循环',764,861,20,'#638776');
 for(let i=0;i<3;i++){bevel(c,66+i*45,880,36,28);glyph(c,84+i*45,894,i);}bevel(c,210,880,626,28,'#f1f0e0',true);label(c,'这次真能骑到明天。',222,902,20);bevel(c,851,880,85,28);label(c,'发送',872,902,20);
}
export function renderGallery(c,t,scene){
 const at=scene.start+t,q=t-2;cached(c,'chat:desktop:8921',wallpaper);rect(c,0,0,1000,180,C.desk);label(c,'早期聊天',55,91,43,C.ink,600);label(c,'Early Chat / 2000年代',57,134,26);reed(c,920,91,1.35);
 const shake=q>=0&&q<.72?Math.exp(-q*4.7)*(Math.cos(q*42)*31+Math.sin(q*72)*14):0,sy=q>=0&&q<.72?Math.exp(-q*4.7)*Math.sin(q*61+.8)*12:0;
 c.save();c.translate(shake,sy);cached(c,'chat:gallery-window:v1',galleryWindow);if(scene.subject!==false){
  c.save();c.beginPath();c.rect(130,409,740,419);c.clip();
  transformSubject(c,sceneSpace(17,t));renderSubject(c,t,{...scene,windowTranslated:true});c.restore();
 }
 c.save();c.beginPath();c.rect(130,804,740,14);c.clip();for(let i=-15;i<24;i++){const x=i*68-(at*105%68);line(c,[[x,813],[x+22,813]],'#6d826d',1);}c.restore();if(q>=0&&q<1.3)label(c,'收到一次「摇一摇」',640,946,22,C.ink,600);c.restore();
 rect(c,0,954,1000,46,C.old,C.edge,2);bevel(c,15,961,143,31);reed(c,33,976,.48);label(c,'芦苇聊',53,983,20);label(c,'对方正在输入'+'.'.repeat(Math.floor(at*2)%4),200,983,21);label(c,'LAN / 8 Hz',850,984,18);
}
export default function renderAt(c,t,scene){if(scene.gallery){renderGallery(c,t,scene);return;}const at=scene.start+t;cached(c,'chat:desktop:8921',wallpaper);const q=t-2;const shake=q>=0&&q<.72?Math.exp(-q*4.7)*(Math.cos(q*42)*31+Math.sin(q*72)*14):0;const sy=q>=0&&q<.72?Math.exp(-q*4.7)*Math.sin(q*61+.8)*12:0;
 c.save();c.translate(shake,sy);cached(c,'chat:window:8921',staticWindow);if(scene.subject!==false)renderSubject(c,t,{...scene,windowTranslated:true});
 // Road markings scroll at the same world speed, beneath quantized GIF legs.
 c.save();c.beginPath();c.rect(202,804,617,14);c.clip();for(let i=-15;i<24;i++){const x=i*68-(at*105%68);line(c,[[x,813],[x+22,813]],'#6d826d',1);}c.restore();
 const dots=Math.floor(at*2)%4;rect(c,839,776,291,50,'#e2e7da');label(c,'对方正在输入'+'.'.repeat(dots),850,807,22);if(q>=0&&q<1.3){label(c,'你收到了一次「摇一摇」',795,915,22,C.ink,600);}c.restore();}

export function renderSubject(c,t,scene){
 const at=scene.start+t,q=t-2;
 const shake=q>=0&&q<.72?Math.exp(-q*4.7)*(Math.cos(q*42)*31+Math.sin(q*72)*14):0;
 const sy=q>=0&&q<.72?Math.exp(-q*4.7)*Math.sin(q*61+.8)*12:0;
 c.save();if(!scene.windowTranslated)c.translate(shake,sy);c.imageSmoothingEnabled=false;c.drawImage(gifSprite(at),200,345,620,480);c.restore();
}
