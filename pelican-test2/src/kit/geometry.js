export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, amount) => a + (b - a) * amount;
export function smoothstep(min, max, value) {
  const u = clamp((value - min) / (max - min));
  return u * u * (3 - 2 * u);
}
