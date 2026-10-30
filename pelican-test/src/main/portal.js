import {GALLERY} from './gallery-layout.js';
export function portalWorld(index,localX){return index*GALLERY.step+localX*GALLERY.scale;}
export function portalSeam(index){return {time:11+index*6,outgoing:portalWorld(index,1070),incoming:portalWorld(index+1,0)};}
