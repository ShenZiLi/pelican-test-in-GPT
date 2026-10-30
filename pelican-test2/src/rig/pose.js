import { finiteTime, pedalPhase, roadDistance } from '../beat/clock.js';

export const WHEEL_RADIUS = 44;
export const PEDAL_RADIUS = 25;
export const UPPER_LEG = 64;
export const LOWER_LEG = 76;

// The forward circle intersection is the knee. The crank's entire circle lies
// strictly inside the reachable annulus, so there is no branch flip or clamping.
function kneeAt(hip, ankle) {
  const dx = ankle.x - hip.x;
  const dy = ankle.y - hip.y;
  const distance = Math.hypot(dx, dy);
  const along = (UPPER_LEG ** 2 - LOWER_LEG ** 2 + distance ** 2) / (2 * distance);
  const bend = Math.sqrt(UPPER_LEG ** 2 - along ** 2);
  return {
    x: hip.x + (along * dx + bend * dy) / distance,
    y: hip.y + (along * dy - bend * dx) / distance,
  };
}

export function poseAt(t) {
  finiteTime(t);
  const pedalAngle = pedalPhase(t);
  const crank = { x: 80, y: -22 };
  const hip = { x: 58, y: -126 };
  const dx = Math.cos(pedalAngle) * PEDAL_RADIUS;
  const dy = Math.sin(pedalAngle) * PEDAL_RADIUS;
  const ankleLeft = { x: crank.x + dx, y: crank.y + dy };
  const ankleRight = { x: crank.x - dx, y: crank.y - dy };
  return {
    rear: { x: 0, y: 0 }, front: { x: 180, y: 0 }, crank, hip,
    ankleLeft, ankleRight,
    kneeLeft: kneeAt(hip, ankleLeft), kneeRight: kneeAt(hip, ankleRight),
    head: { x: 108, y: -213 }, beakTip: { x: 222, y: -207 },
    pedalAngle, wheelAngle: roadDistance(t) / WHEEL_RADIUS,
  };
}
