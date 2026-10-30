import {W,H} from '../kit/index.js';
// A square window into the scene, with uniform scaling (never squeeze the art).
export const PLATE_WIDTH=820,PLATE_HEIGHT=820,PLATE_SCALE=PLATE_HEIGHT/H,
 SOURCE_LEFT=(W-H)/2,GAP=54,STRIDE=PLATE_WIDTH+GAP,ANCHOR=W/2,TOP=32;
export function travelAt(t){return (t-5)*STRIDE/6;}
export function plateLeft(index,t){return ANCHOR+(index*STRIDE-travelAt(t));}
export function visiblePlates(t){const k=Math.floor((t-5)/6);return Array.from({length:5},(_,j)=>k+j-2).filter(i=>i>=0&&i<20&&plateLeft(i,t)<W+20&&plateLeft(i,t)+PLATE_WIDTH>-20);}
