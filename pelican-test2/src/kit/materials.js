// Seeded, spatial paper grain: it is baked once and never advances with frames.
export function makePaper() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1000;
  const c = canvas.getContext('2d', {willReadFrequently:true});
  let seed = 721032;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 19000; i++) {
    c.fillStyle = `rgba(57,44,21,${0.025 + random() * 0.055})`;
    c.fillRect(random() * 1000, random() * 1000, 0.4 + random() * 1.3, 0.4 + random());
  }
  return canvas;
}
export function paperBackground(c, texture, color = '#eee8db', w = 1920, h = 1080) {
  c.fillStyle = color; c.fillRect(0, 0, w, h);
  c.drawImage(texture, 0, 0, w, h);
}
export function line(c, x1, y1, x2, y2, color, width = 1) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
export function text(c, value, x, y, size, color = '#29352d', {align = 'left', bold = false, family = '"Noto Serif SC"'} = {}) {
  c.fillStyle = color; c.font = `${bold ? 700 : 400} ${size}px ${family}`;
  c.textAlign = align; c.textBaseline = 'alphabetic'; c.fillText(value, x, y);
}
export const smooth = v => { const a = Math.min(1, Math.max(0, v)); return a * a * (3 - 2 * a); };
export const mix = (a, b, t) => a + (b - a) * t;
