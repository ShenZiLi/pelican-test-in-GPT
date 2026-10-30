import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, DURATION, locate, pedalAngle, frameTimes, downbeat } from '../src/beat/timeline.js';
import { solveLeg, poseAt } from '../src/rig/pose.js';

test('twenty six-second scenes occupy exactly 5–125 seconds', () => {
  assert.equal(SCENES.length, 20);
  SCENES.forEach((s, i) => {
    assert.equal(s.start, 5 + i * 6);
    assert.equal(s.end, 11 + i * 6);
    assert.equal(downbeat(s.start), true);
  });
  assert.equal(DURATION, 137);
  assert.equal(locate(4.99).kind, 'intro');
  assert.equal(locate(5).scene.id, 1);
  assert.equal(locate(125).kind, 'outro');
  assert.equal(locate(137).kind, 'outro');
});

test('absolute time has a one-second pedal cycle across scene boundaries', () => {
  for (const t of [5, 10.999, 29.2, 89, 120.3]) {
    assert.ok(Math.abs(pedalAngle(t + 1) - pedalAngle(t) - 2 * Math.PI) < 1e-9);
    const a = poseAt(t);
    const b = poseAt(t);
    assert.deepEqual(a, b);
    assert.ok(Math.abs(Math.hypot(a.feet[0].x - a.crank.x, a.feet[0].y - a.crank.y) - a.crankRadius) < 1e-8);
  }
});

test('two-link knees preserve segment length without detaching feet', () => {
  const hip = {x:0,y:0}, foot = {x:45,y:65};
  const knee = solveLeg(hip, foot, 53, 49);
  assert.ok(Math.abs(Math.hypot(knee.x, knee.y)-53)<1e-8);
  assert.ok(Math.abs(Math.hypot(knee.x-foot.x,knee.y-foot.y)-49)<1e-8);
});

test('the cycling rig reaches both pedals throughout a full turn',()=>{
  for(let i=0;i<60;i++){
    const p=poseAt(i/60);
    p.knees.forEach((k,j)=>{
      assert.ok(Math.abs(Math.hypot(k.x-p.hip.x,k.y-p.hip.y)-(p.legLengths||[59,57])[0])<1e-7);
      assert.ok(Math.abs(Math.hypot(k.x-p.feet[j].x,k.y-p.feet[j].y)-(p.legLengths||[59,57])[1])<1e-7);
    });
  }
});

test('fixed-rate export includes exactly one frame per interval', () => {
  for (const fps of [30,60]) {
    const times = frameTimes(0,137,fps);
    assert.equal(times.length,137*fps);
    assert.equal(times[0],0);
    assert.ok(Math.abs(times.at(-1)-(137-1/fps))<1e-9);
    assert.equal(frameTimes(7,15,fps).length,8*fps);
  }
});

