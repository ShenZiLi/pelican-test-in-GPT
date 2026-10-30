import { text, line } from '../kit/materials.js';
export const PALETTES = ['#d8b591','#e3cd9d','#a5aba1','#d9d4bf','#b9c8b9','#cfccb0','#cfac8b','#c7c0a0','#e8e1ce','#c6ae85','#b6c6bd','#b7bbce','#c5aaa2','#c2beb0','#b0c8b4','#b9c5b2','#c2c9cb','#cdb6cb','#c6c4bd','#acb7b1'];
export function drawPlaceholder(c, scene, texture) {
  const i = scene.number - 1;
  c.fillStyle = PALETTES[i]; c.fillRect(0, 0, 1000, 1000);
  c.drawImage(texture, 0, 0);
  c.save(); c.globalAlpha = 0.065;
  text(c, String(scene.number).padStart(2, '0'), 930, 625, 265, '#24342c', {align: 'right', family: 'Georgia'});
  c.restore();
  // Registration lines intentionally advertise this as a layout study.
  c.save(); c.setLineDash([2, 7]);
  line(c, 58, 520, 942, 520, '#34413728');
  line(c, 500, 292, 500, 670, '#34413728'); c.restore();
}
