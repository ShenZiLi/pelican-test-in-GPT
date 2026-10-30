import { drawCyclist } from '../rig/draw.js';
import { drawWorld } from './road.js';
import { SCENES } from '../beat/timeline.js';
import { paperBackground, text, line, smooth, mix } from '../kit/materials.js';
const GAP = 16, CELL_W = (1728 - 6 * GAP) / 7, CELL_H = CELL_W * 9 / 16;
const cell = i => ({x: 96 + (i % 7) * (CELL_W + GAP), y: 270 + Math.floor(i / 7) * (CELL_H + GAP), w: CELL_W, h: CELL_H});
export function bakeThumbnails(texture,assets={}) {
  return SCENES.map(scene => {
    const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 450;
    const c = canvas.getContext('2d', {willReadFrequently:true}); c.scale(800 / 1920, 450 / 1080);
    // Begin the pullback from the final composition, without rewinding the road.
    drawWorld(c, scene.number === 20 ? scene.end - 1e-6 : scene.number===5?30.2:scene.highlightCandidate, texture,{assets}); return canvas;
  });
}
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
export function drawPress(c, t, texture) {
  paperBackground(c, texture, '#cad0bd');
  line(c, 0, 210, 1920, 210, '#98a58b', 2);
  text(c, '新闻发布会', 960, 177, 49, '#4c604a', {align:'center'});
  text(c, 'PRESS CONFERENCE', 960, 245, 25, '#65725d', {align:'center',family:'Georgia'});
  // The rider passes behind both the empty chair and the table.
  if (t >= 136.5 && t < 136.79) {
    c.save(); c.translate(-450 + (t - 136.5) / .29 * 2900, 620); c.scale(1.9, 1.9);
    drawCyclist(c, t); c.restore();
  }
  c.fillStyle = '#53624d'; roundRect(c, 798, 353, 324, 329, 31); c.fill();
  c.fillStyle = '#79866b'; roundRect(c, 815, 372, 290, 278, 23); c.fill();
  c.fillStyle = '#4b5b45'; roundRect(c, 776, 652, 368, 54, 10); c.fill();
  line(c, 810, 700, 792, 850, '#4b5b45', 14); line(c, 1110, 700, 1128, 850, '#4b5b45', 14);
  c.fillStyle = '#a79370'; c.fillRect(268, 661, 1384, 220);
  c.fillStyle = '#c1b18c'; c.fillRect(250, 633, 1420, 34);
  for (let i = 0; i < 6; i++) {
    const x = 560 + i * 161, side = i % 2 ? 1 : -1;
    c.fillStyle = '#414e3e'; c.beginPath(); c.ellipse(x, 635, 37, 10, 0, 0, Math.PI * 2); c.fill();
    line(c, x, 631, x + side * 26, 548, '#414e3e', 7);
    c.save(); c.translate(x + side * 26, 544); c.rotate(side * .2);
    c.fillStyle = '#344332'; roundRect(c, -12, -35, 24, 57, 10); c.fill();
    for (let yy = -25; yy < 8; yy += 7) line(c, -8, yy, 8, yy, '#8b967c', 1);
    c.restore();
  }
  c.fillStyle = '#ece6d3'; roundRect(c, 754, 706, 412, 114, 3); c.fill();
  text(c, '鹈鹕（本人）', 960, 780, 43, '#34462f', {align:'center'});
  const flash = [129, 131, 133].reduce((value, beat) => Math.max(value, Math.max(0, 1 - Math.abs(t - beat) / .075)), 0);
  if (flash) { c.fillStyle = `rgba(255,255,242,${flash * .48})`; c.fillRect(0, 0, 1920, 1080); }
}
export function drawOutro(c, t, texture, thumbnails) {
  paperBackground(c, texture, '#e9e4d5');
  const source = cell(19), target = cell(20);
  const zoomOut = smooth((t - 125) / 4), zoomIn = smooth((t - 129) / 4);
  let scale, tx, ty;
  if (t < 129) {
    scale = mix(1920 / source.w, 1, zoomOut);
    tx = mix(960 - (source.x + source.w / 2) * (1920 / source.w), 0, zoomOut);
    ty = mix(540 - (source.y + source.h / 2) * (1920 / source.w), 0, zoomOut);
  } else {
    scale = mix(1, 1920 / target.w, zoomIn);
    tx = mix(0, 960 - (target.x + target.w / 2) * (1920 / target.w), zoomIn);
    ty = mix(0, 540 - (target.y + target.h / 2) * (1920 / target.w), zoomIn);
  }
  c.save(); c.translate(tx, ty); c.scale(scale, scale);
  text(c, '二十份答卷，一席空位。', 96, 184, 29, '#526148');
  for (let i = 0; i < 21; i++) {
    const r = cell(i);
    c.fillStyle = '#4e5a45'; c.fillRect(r.x - 4, r.y - 4, r.w + 8, r.h + 8);
    c.save(); c.beginPath(); c.rect(r.x, r.y, r.w, r.h); c.clip();
    if (i < 20) c.drawImage(thumbnails[i], r.x, r.y, r.w, r.h);
    else { c.translate(r.x, r.y); c.scale(r.w / 1920, r.h / 1080); drawPress(c, t, texture); }
    c.restore();
  }
  c.restore();
  if (t >= 127.4 && t < 130) {
    c.save(); c.globalAlpha = smooth((t - 127.4) / .5) * (1 - smooth((t - 129) / 1));
    text(c, '截至目前，人类共提交了 20 份答卷。', 960, 942, 45, '#32432f', {align:'center'}); c.restore();
  }
  if (t >= 133) {
    text(c, '鹈鹕本人对此尚未发表评论。', 960, 1012, 45, '#30432e', {align:'center'});
  }
}
