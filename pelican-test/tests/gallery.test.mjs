import test from 'node:test';import assert from 'node:assert/strict';
import {galleryState,frameRect,GALLERY} from '../src/main/gallery-layout.js';
test('gallery displays neighbouring complete frames rather than a full-screen wipe',()=>{
  for(const t of [8,32,62,92,116]){const s=galleryState(t),boxes=Array.from({length:20},(_,i)=>frameRect(i,s.camera));assert.ok(boxes.filter(b=>b.x>=0&&b.x+b.w<=1920).length>=2);assert.equal(GALLERY.gap,42);}
});
test('the rider moves through every frame on its scheduled downbeat and camera is continuous',()=>{
  for(let t=5;t<=125;t+=.02){const s=galleryState(t);assert.ok(s.rider>=s.index*GALLERY.step&&s.rider<=(s.index+1)*GALLERY.step);}
  for(let i=1;i<20;i++){const t=5+i*6;assert.equal(galleryState(t).rider,i*GALLERY.step);assert.ok(Math.abs(galleryState(t-.00001).camera-galleryState(t+.00001).camera)<.001);}
});
