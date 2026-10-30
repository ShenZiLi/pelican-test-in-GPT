import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Dynamic loading lets a missing implementation fail an explicit assertion in RED.
const load = async (path) => import(path).catch((error) => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});
const timeline = await load('../src/beat/timeline.js');
const clock = await load('../src/beat/clock.js');
const rig = await load('../src/rig/pose.js');
const geometry = await load('../src/kit/geometry.js');
const random = await load('../src/kit/random.js');
const drawing = await load('../src/rig/draw.js');
const near = (actual, expected, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} differs from ${expected}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('timeline carries exactly the authored 20 scene records', async () => {
  assert.equal(typeof timeline.locate, 'function', 'timeline implementation must exist');
  const source = JSON.parse(await readFile(new URL('../docs/planning/timeline.json', import.meta.url)));
  assert.equal(timeline.DURATION, 137);
  assert.deepEqual(timeline.SCENES, source.scenes);
  assert.equal(timeline.SCENES.length, 20);
});

test('scene intervals are contiguous and switch on their exact start, then reach outro', () => {
  assert.equal(typeof timeline.locate, 'function');
  assert.deepEqual(timeline.locate(0), { kind: 'intro', time: 0, localTime: 0, scene: null, index: -1 });
  for (let index = 0; index < 20; index += 1) {
    const start = 5 + 6 * index;
    const current = timeline.locate(start);
    assert.equal(current.kind, 'scene');
    assert.equal(current.index, index);
    assert.equal(current.scene, timeline.SCENES[index]);
    assert.equal(current.localTime, 0);
    assert.equal(timeline.locate(start - 1e-6).index, index - 1);
    assert.equal(timeline.locate(start + 5.999999).index, index);
  }
  assert.deepEqual(timeline.locate(125), { kind: 'outro', time: 125, localTime: 0, scene: null, index: 20 });
  assert.equal(timeline.locate(137).localTime, 12);
  assert.equal(timeline.locate(-100).time, 0);
  assert.equal(timeline.locate(1000).time, 137);
});

test('137 second half-open samples have exact integer frame counts and canonical times', () => {
  assert.equal(typeof timeline.sampleTimes, 'function');
  for (const fps of [30, 60]) {
    const times = timeline.sampleTimes(fps);
    assert.equal(times.length, 137 * fps);
    assert.equal(times[0], 0);
    assert.equal(times.at(-1), (137 * fps - 1) / fps);
    assert.equal(timeline.sampleTimes(fps, 8, 14).length, 6 * fps);
    assert.deepEqual(timeline.sampleTimes(fps, 8, 14), times.slice(8 * fps, 14 * fps));
  }
  assert.deepEqual(timeline.sampleTimes(30, 0.01, 0.1), [1 / 30, 2 / 30]);
  assert.deepEqual(timeline.sampleTimes(100, 0.14, 0.17), [0.14, 0.15, 0.16]);
  assert.deepEqual(timeline.sampleTimes(100, 0.1, 0.14), [0.1, 0.11, 0.12, 0.13]);
  assert.deepEqual(timeline.sampleTimes(30, 137, 137), []);
});

test('time functions reject nonfinite input and sampling rejects invalid ranges', () => {
  assert.equal(typeof clock.pedalPhase, 'function');
  for (const invalid of [NaN, Infinity, -Infinity, undefined, '5']) {
    for (const fn of [timeline.locate, clock.pedalPhase, clock.beatAt, clock.strongBeat, clock.roadDistance, rig.poseAt]) {
      assert.throws(() => fn(invalid), TypeError);
    }
  }
  for (const args of [[0], [-30], [NaN], [30, -1, 2], [30, 10, 5], [30, 0, 138], [30, 0, Infinity]]) {
    assert.throws(() => timeline.sampleTimes(...args));
  }
});

test('absolute beat grid starts on bar one at second five', () => {
  assert.equal(typeof clock.beatAt, 'function');
  assert.equal(clock.beatAt(5), 0);
  assert.equal(clock.beatAt(3), -4);
  assert.equal(clock.beatAt(5.5), 1);
  assert.equal(clock.strongBeat(3), true);
  assert.equal(clock.strongBeat(5), true);
  assert.equal(clock.strongBeat(5.5), false);
  assert.equal(clock.strongBeat(5.0001), false);
  for (let n = 0; n <= 20; n += 1) assert.equal(clock.strongBeat(5 + 6 * n), true);
});

test('pedals cycle every second with no reset across scene boundaries', () => {
  assert.equal(typeof clock.pedalPhase, 'function');
  for (let i = 0; i < 200; i += 1) {
    const t = i / 73;
    near(Math.cos(clock.pedalPhase(t + 1)), Math.cos(clock.pedalPhase(t)));
    near(Math.sin(clock.pedalPhase(t + 1)), Math.sin(clock.pedalPhase(t)));
  }
  near(clock.pedalPhase(5), 10 * Math.PI);
  near(clock.roadDistance(5), 0);
  near(clock.roadDistance(11), 1000);
});

test('both ankles stay on opposite pedals while leg segment lengths remain invariant', () => {
  assert.equal(typeof rig.poseAt, 'function');
  const first = rig.poseAt(0);
  const upperLength = distance(first.hip, first.kneeLeft);
  const lowerLength = distance(first.kneeLeft, first.ankleLeft);
  for (let i = 0; i <= 1000; i += 1) {
    const p = rig.poseAt(i / 997);
    assert.deepEqual(p.rear, { x: 0, y: 0 });
    assert.deepEqual(p.front, { x: 180, y: 0 });
    assert.deepEqual(p.crank, { x: 80, y: -22 });
    for (const side of ['Left', 'Right']) {
      near(distance(p.hip, p[`knee${side}`]), upperLength);
      near(distance(p[`knee${side}`], p[`ankle${side}`]), lowerLength);
      near(distance(p.crank, p[`ankle${side}`]), 25);
    }
    near(p.ankleLeft.x + p.ankleRight.x, 160);
    near(p.ankleLeft.y + p.ankleRight.y, -44);
    assert.ok(p.beakTip.x - p.head.x > 65, 'pelican has a long forward bill');
  }
});

test('pose is continuous through crank wrap and every scene boundary', () => {
  assert.equal(typeof rig.poseAt, 'function');
  for (const t of [0, 1, 5, 11, 59, 89, 95, 101, 119, 125]) {
    const before = rig.poseAt(t - 1e-7);
    const after = rig.poseAt(t + 1e-7);
    for (const name of ['hip', 'ankleLeft', 'ankleRight', 'kneeLeft', 'kneeRight', 'head', 'beakTip']) {
      assert.ok(distance(before[name], after[name]) < 0.001, `${name} continuous at ${t}`);
    }
  }
});

test('wheel travel is no-slip against the shared road distance', () => {
  assert.equal(typeof rig.poseAt, 'function');
  for (const [a, b] of [[5, 11], [8, 8.5], [88.9, 89.1], [125, 137]]) {
    const rotation = rig.poseAt(b).wheelAngle - rig.poseAt(a).wheelAngle;
    near(rotation * 44, clock.roadDistance(b) - clock.roadDistance(a));
  }
});

test('small geometry helpers give clamped easing endpoints', () => {
  assert.equal(typeof geometry.clamp, 'function');
  assert.equal(geometry.clamp(-2, 0, 1), 0);
  assert.equal(geometry.clamp(2, 0, 1), 1);
  assert.equal(geometry.lerp(2, 10, 0.25), 4);
  assert.equal(geometry.smoothstep(0, 1, -1), 0);
  assert.equal(geometry.smoothstep(0, 1, 1), 1);
  assert.equal(geometry.smoothstep(0, 1, 0.5), 0.5);
});

test('indexed randomness is stable under reordering and separates indices/seeds', () => {
  assert.equal(typeof random.randomAt, 'function');
  const expected = Array.from({ length: 100 }, (_, i) => random.randomAt(20261027, i));
  for (let i = 99; i >= 0; i -= 1) {
    assert.equal(random.randomAt(20261027, i), expected[i]);
    assert.ok(expected[i] >= 0 && expected[i] < 1);
  }
  assert.equal(new Set(expected).size, 100);
  assert.notEqual(random.randomAt(1, 0), random.randomAt(2, 0));
});

test('cyclist drawing is available as a pure absolute-time Canvas2D entry point', () => {
  assert.equal(typeof drawing.drawCyclist, 'function');
});
