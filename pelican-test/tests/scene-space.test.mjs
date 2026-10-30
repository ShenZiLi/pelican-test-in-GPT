import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneSpace,subjectBounds,containsPoint} from '../src/main/scene-space.js';

test('Egypt holds the whole rider in world space for its mural pose',()=>{
 const a=sceneSpace(2,2),b=sceneSpace(2,3.75);
 assert.equal(a.x,b.x);assert.equal(a.y,b.y);assert.equal(a.poseTime,b.poseTime);
 assert.ok(sceneSpace(2,4.5).x>a.x);
});
test('every scene path connects to the common gallery entry and exit',()=>{
 for(let id=1;id<=20;id++){
  const a=sceneSpace(id,0),b=sceneSpace(id,6);
  assert.equal(a.x,0,`entry ${id}`);assert.equal(b.x,1070,`exit ${id}`);
  assert.equal(a.y,805);assert.equal(b.y,805);
 }
});
test('electronic subjects stay within their medium during the central four seconds',()=>{
 for(const id of [15,17,19,20])for(let t=1;t<=5;t+=.125){
  const s=sceneSpace(id,t),b=subjectBounds(s);
  for(const [x,y]of [[b.left,b.top],[b.right,b.top],[b.left,b.bottom],[b.right,b.bottom]])
   assert.ok(containsPoint(s.mask,x,y),`${id} ${t} ${x},${y}`);
 }
});
