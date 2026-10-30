import {SCENES} from '../beat/timeline.js';
import {paper,road,title,text,line,rect,ellipse} from '../kit/draw.js';
import {pelican} from '../rig/pelican.js';
import {sceneSpace,clipSubject,transformSubject} from '../main/scene-space.js';
export const renderers=new Map();
const subjects=new Map();
const galleries=new Map(),foregrounds=new Map(),poses=new Map();
export function register(id,fn,subject,module={}){renderers.set(id,fn);if(subject)subjects.set(id,subject);if(module.renderGallery)galleries.set(id,module.renderGallery);if(module.renderForeground)foregrounds.set(id,module.renderForeground);if(module.galleryPose)poses.set(id,module.galleryPose);}
export function galleryPoseAt(id,t){const base=sceneSpace(id,t);return {...base,...poses.get(id)?.(t,{...SCENES[id-1],gallery:true})};}
export function placeholder(c,t,scene){const at=scene.start+t,dark=[3,12,15,16,19,20].includes(scene.id),color=dark?'#ece6d1':'#252d2c';paper(c,{base:scene.color,seed:scene.id});c.save();c.globalAlpha=.17;for(let i=0;i<12;i++)line(c,[[-389,240+i*43],[1389,240+i*43]],'#faf6de',1);c.restore();title(c,scene,{color});text(c,String(scene.id).padStart(2,'0'),1290,170,110,'#ffffff55',{align:'right'});for(let i=-4;i<14;i++){let x=i*140-(at*105%140);rect(c,x,710,2,90,'#69736055');}road(c,at,{color});if(scene.subject!==false)pelican(c,at,{ink:color});text(c,'画风制作中 · 骨架演示',500,940,24,color,{align:'center'});}
export function renderScene(c,id,t,{skeleton=false,subject=true,gallery=false,...extra}={}){const scene={...SCENES[id-1],subject,gallery,...extra};c.save();(skeleton?placeholder:gallery&&subject&&galleries.has(id)?galleries.get(id):renderers.get(id)||placeholder)(c,t,scene);c.restore();}
export function renderSubject(c,id,local,absolute,{skeleton=false,gallery=true}={}){c.save();const scene={...SCENES[id-1],start:absolute-local,gallery};if(skeleton)pelican(c,absolute,{style:'line'});else subjects.get(id)?.(c,local,scene);c.restore();}
export function renderArtwork(c,id,t,{skeleton=false,subject=true}={}){
 if(!skeleton&&galleries.has(id)){renderScene(c,id,t,{gallery:true,subject});return;}
 const state=sceneSpace(id,t),scene={...SCENES[id-1],gallery:true,rider:state};
 renderScene(c,id,t,{skeleton,subject:false,gallery:true,rider:state});
 if(!subject)return;
 c.save();clipSubject(c,state);transformSubject(c,state);
 renderSubject(c,id,t,scene.start+t,{skeleton});c.restore();
 foregrounds.get(id)?.(c,t,scene);
}
