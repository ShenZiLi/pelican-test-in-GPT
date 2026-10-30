import { SCENES } from '../beat/timeline.js';
import { roadDistance } from '../beat/clock.js';
import { drawCyclist } from '../rig/draw.js';
import { drawPlaceholder } from '../scenes/placeholder.js';
import { line, text } from '../kit/materials.js';
import { rendererFor } from '../scenes/registry.js';
export function sceneTime(t, scene) {
  const hz = scene.internalUpdateHz;
  return hz ? scene.start + Math.floor((t - scene.start) * hz + 1e-8) / hz : t;
}
export function drawWorld(c, t, texture, {titles = true,assets={}} = {}) {
  const distance = roadDistance(t), camera = distance - 420;
  const active=t<5?SCENES[0]:(SCENES.find(s=>t>=s.start&&t<s.end)??SCENES.at(-1));
  const activeRenderer=rendererFor(active.number);
  const view=activeRenderer?.cameraAt?.(t-active.start)??{zoom:1,riderScale:1};
  const riderScale=view.riderScale??1;
  const road=activeRenderer?.roadAt?.(t-active.start)??{y:700,angle:0};
  const nearest = 5 + 6 * Math.round((t - 5) / 6);
  const pulse = .012 * Math.exp(-(((t - nearest) / .16) ** 2));
  c.save(); c.scale(1.92, 1.92); c.translate(0, -218.75);
  c.translate(420, 570); c.scale(1 + pulse, 1 + pulse); c.translate(-420, -570);
  c.translate(420,700);c.scale(view.zoom??1,view.zoom??1);c.translate(-420,-700);
  c.fillStyle = '#eee8db'; c.fillRect(0, 0, 1000, 1000);
  c.fillStyle = '#d0c5ac'; c.fillRect(0, 700, 1000, 300);
  line(c, 0, 700, 1000, 700, '#475441', 2.3);
  for (const scene of SCENES) {
    const left = (scene.number - 1) * 1000 - camera;
    if (left > 1000 || left + 1000 < 0) continue;
    c.save(); c.beginPath(); c.rect(left, 0, 1000, 1000); c.clip(); c.translate(left, 0);
    const renderer=rendererFor(scene.number),env={scene,t,localTime:t-scene.start,texture,assets:assets[scene.number]};
    if(renderer?.drawBackground)renderer.drawBackground(c,env);else drawPlaceholder(c, scene, texture);
    if(renderer?.drawRoad)renderer.drawRoad(c,env);else{
    c.fillStyle = '#d0c5ac'; c.fillRect(0, 700, 1000, 300);
    line(c, 0, 700, 1000, 700, '#475441', 2.3);
    line(c, 0, 758, 1000, 758, '#969f86', .8);
    for (let x = 0; x < 1000; x += 90) line(c, x + 14, 737, x + 55, 737, '#899177', 1.4);
    }
    // A real four-sided frame crossing the road, not a full-screen dissolve.
    c.strokeStyle = renderer?.frameColor??'#48543f'; c.lineWidth = 5; c.strokeRect(2, 247, 996, 508);
    c.strokeStyle = '#eee4c5'; c.lineWidth = 1; c.strokeRect(8, 253, 984, 496);
    text(c, String(scene.number).padStart(2, '0'), 18, 274, 9, '#eee4c5', {family: 'Arial'});
    c.restore();
  }
  // The road extends through the prelude, including before panel 01.
  if (camera < 0) {
    const end = Math.min(1000, -camera);
    c.fillStyle = '#d0c5ac'; c.fillRect(0, 700, end, 300);
    line(c, 0, 700, end, 700, '#475441', 2.3);
  }
  const drawT = sceneTime(t, active);
  if(!activeRenderer?.drawRider){c.fillStyle = '#34413020'; c.beginPath(); c.ellipse(420+88*riderScale, 701, 126*riderScale, 7*riderScale, 0, 0, Math.PI * 2); c.fill();}
  function rider(renderer,data){c.save();c.translate(420,(road.y??700)-44*riderScale);c.rotate(road.angle??0);c.scale(riderScale,riderScale);if(renderer?.drawRider)renderer.drawRider(c,drawT,data);else drawCyclist(c,drawT);c.restore();}
  for(const scene of SCENES){const left=(scene.number-1)*1000-camera;if(left>1000||left+1000<0)continue;c.save();c.beginPath();c.rect(left,0,1000,1000);c.clip();rider(rendererFor(scene.number),assets[scene.number]);c.restore();}
  if(camera<0){c.save();c.beginPath();c.rect(0,0,-camera,1000);c.clip();rider(null,null);c.restore();}
  if(camera+1000>20000){c.save();c.beginPath();c.rect(20000-camera,0,1000,1000);c.clip();rider(rendererFor(20),assets[20]);c.restore();}
  // Front posts pass in front of the cyclist; the surrounding frame remains behind.
  for (let i = 0; i <= 20; i++) {
    const x = i * 1000 - camera;
    if (x < -5 || x > 1005) continue;
    line(c, x + 2, 247, x + 2, 755, rendererFor(i+1)?.frameColor??'#48543f', 5);
    line(c, x + 8, 253, x + 8, 749, '#eee4c5', 1);
  }
  c.restore();
  if(activeRenderer?.drawViewport&&t>=active.start&&t<active.end)activeRenderer.drawViewport(c,{scene:active,t,localTime:t-active.start,texture,assets:assets[active.number]});
  else{
    if(titles){
      // Keep native title lettering legible while a differently colored
      // neighboring panel or its front post passes behind the title area.
      const titleGround={3:'#17201a',4:'#eee9d8',5:'#e9e4d3',6:'#e9dfc3'}[active.number];
      if(titleGround){c.save();const g=c.createLinearGradient(0,0,740,0);g.addColorStop(0,titleGround);g.addColorStop(.63,titleGround+'ed');g.addColorStop(1,titleGround+'00');c.fillStyle=g;c.fillRect(0,70,740,active.number===5?300:220);c.restore();}
      if(activeRenderer?.drawTitle)activeRenderer.drawTitle(c,{scene:active,t});else drawTitle(c,active,t);
    }
    if(active.number===19&&t<119)drawVerticalMatte(c,active,t);
  }
}
export function drawTitle(c, scene, t) {
  const vertical = scene.number === 19;
  const x = vertical ? 704 : 100, y = vertical ? 128 : 124;
  const scale = vertical ? .72 : 1;
  c.save(); c.translate(x, y); c.scale(scale, scale);
  text(c, `${String(scene.number).padStart(2, '0')}  /  20`, 0, 0, 20, '#344137', {family: 'Arial'});
  text(c, scene.titleZh, 0, 67, 47, '#29392e', {bold: true});
  text(c, scene.titleEn, 2, 112, 29, '#485744', {family: 'Georgia'});
  text(c, scene.era, 2, 155, 26, '#485744'); c.restore();
  if (!vertical) text(c, '第一阶段 / 构图占位', 1815, 1025, 22, '#536149', {align:'right'});
}
function drawVerticalMatte(c, scene, t) {
  const width = 1080 * 9 / 16, x = (1920 - width) / 2;
  c.fillStyle = '#111710'; c.fillRect(0, 0, x, 1080); c.fillRect(x + width, 0, x, 1080);
  // Render the title again after the matte; it belongs to the inset viewport.
  drawTitle(c, scene, t);
  line(c, x + 45, 988, x + width - 45, 988, '#f4efd688', 3);
  line(c, x + 45, 988, x + 45 + (width - 90) * Math.min(1, (t - 113) / 6), 988, '#fbf2d8', 4);
  text(c, '9:16 · 竖屏取景占位', x + 45, 1040, 21, '#e7e6d8');
}
