import { paperBackground, text, line, smooth, mix } from '../kit/materials.js';
import { drawCyclist } from '../rig/draw.js';
export function drawIntro(c, t, texture) {
  paperBackground(c, texture);
  text(c, 'THE PELICAN TEST II', 145, 132, 23, '#687261', {family: 'Georgia'});
  line(c, 145, 178, 1775, 178, '#8d957d', 1);
  c.save(); c.globalAlpha = smooth((t - 0.25) / .55) * (1 - smooth((t - 4.4) / .6));
  text(c, '人类自古以来就痴迷于画鹈鹕骑自行车。', 145, 345, 57, '#28392e'); c.restore();
  c.save(); c.globalAlpha = smooth((t - 3) / .22) * (1 - smooth((t - 4.4) / .6));
  text(c, '——早在自行车被发明之前。', 145, 455, 59, '#28392e', {bold: true}); c.restore();
  c.save(); c.globalAlpha = smooth((t - .6) / .5) * (1 - smooth((t - 4.25) / .75));
  text(c, '——《鹈鹕骑行艺术通史》，卷一（虚构书名）', 148, 537, 25, '#66705f'); c.restore();
  const depart = smooth((t - 4) / 1);
  c.save(); c.translate(mix(1320, 806.4, depart), mix(840, 839.52, depart));
  c.scale(mix(1.55, 1.92, depart), mix(1.55, 1.92, depart));
  drawCyclist(c, t < 4 ? 4 : t, {ink: '#4b5142', body: '#ede7d8', accent: '#9a8967'}); c.restore();
  c.save(); c.globalAlpha = 1 - depart;
  line(c, 1305, 916, 1700, 916, '#8d957d');
  text(c, '图一 鹈鹕骑行图（摹本）', 1305, 962, 25, '#66705f'); c.restore();
  text(c, '鹈鹕测试2', 145, 969, 25, '#4b5948');
}
