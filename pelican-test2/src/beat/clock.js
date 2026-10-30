export function finiteTime(t) {
  if (typeof t !== 'number' || !Number.isFinite(t)) throw new TypeError('Time must be a finite number');
  return t;
}

export const pedalPhase = (t) => finiteTime(t) * 2 * Math.PI;
export const beatAt = (t) => (finiteTime(t) - 5) * 2;
export const roadDistance = (t) => (finiteTime(t) - 5) * 1000 / 6;

export function strongBeat(t) {
  const barPosition = beatAt(t) / 4;
  return Math.abs(barPosition - Math.round(barPosition)) < 1e-9;
}
