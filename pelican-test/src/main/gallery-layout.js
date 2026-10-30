import {clamp,smooth} from '../beat/timeline.js';
import {sceneSpace} from './scene-space.js';
export const GALLERY=Object.freeze({width:600,gap:42,step:642,top:50,scale:.6,ground:533});
export function galleryState(t){
  const progress=clamp((t-5)/6,0,20),index=Math.min(19,Math.floor(progress)),local=(progress-index)*6;
  // The camera rests while the rider enters and delivers the gag, then catches up.
  const camera=(index+smooth((local-3.5)/2.5))*GALLERY.step+GALLERY.width/2;
  const rider=index*GALLERY.step+sceneSpace(index+1,local).x*GALLERY.scale;
  return {progress,index,local,rider,camera};
}
export function frameRect(index,camera,width=1920){return {x:width/2+index*GALLERY.step-camera,y:GALLERY.top,w:GALLERY.width,h:GALLERY.width};}
