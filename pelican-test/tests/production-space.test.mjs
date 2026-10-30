import test from 'node:test';import assert from 'node:assert/strict';
import * as song from '../src/scenes/05-song.js';
import * as bridge from '../src/scenes/06-riverside.js';
import * as code from '../src/scenes/20-code.js';
import {register,galleryPoseAt} from '../src/scenes/registry.js';
import {SCENES} from '../src/beat/timeline.js';
for(const scene of SCENES){const m=await import(`../src/scenes/${String(scene.id).padStart(2,'0')}-${scene.key}.js`);register(scene.id,m.default,m.renderSubject,m);}
test('outer gallery resolves the actual scene projection instead of the generic fallback',()=>{
 for(const [id,m]of [[5,song],[6,bridge],[20,code]])for(const t of [0,.5,2.5,4.3,5.5,6]){
  const actual=galleryPoseAt(id,t),expected=m.galleryPose(t);
  for(const key of ['x','y','scale'])assert.equal(actual[key],expected[key],`${id} ${t} ${key}`);
 }
 assert.ok(galleryPoseAt(5,0).scale<.1);
 assert.ok(galleryPoseAt(6,2.5).scale<.4);
});
test('resolved production sample endpoints share the gallery portals',()=>{
 for(const {id}of SCENES){assert.equal(galleryPoseAt(id,0).x,0,`entryx ${id}`);assert.equal(galleryPoseAt(id,0).y,805,`entryy ${id}`);assert.equal(galleryPoseAt(id,6).x,1070,`exitx ${id}`);assert.equal(galleryPoseAt(id,6).y,805,`exity ${id}`);}
});
test('code completed pose remains still before riding out',()=>{
 const a=code.galleryPose(3.55),b=code.galleryPose(4.3);
 for(const k of ['x','y','scale','at'])assert.equal(a[k],b[k]);
 assert.ok(code.galleryPose(5).x>b.x);
});
