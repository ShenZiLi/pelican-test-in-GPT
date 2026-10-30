import { DURATION, SCENES, locate } from '../beat/timeline.js';
import { makePaper, smooth } from '../kit/materials.js';
import { bindBrush } from '../kit/brush.js';
import { drawIntro } from './intro.js';
import { drawWorld } from './road.js';
import { bakeThumbnails, drawOutro } from './outro.js';
import { prepareScenes } from '../scenes/registry.js';
import { configureBrushAtlas } from '../kit/art.js';

export async function createFilm({width = 1920, height = 1080,audio=false} = {}) {
  const words = SCENES.map(s => s.titleZh + s.era).join('') + Array.from({length:0x9fff-0x4e00+1},(_,i)=>String.fromCharCode(0x4e00+i)).join('');
  await Promise.all([document.fonts.load('400 36px "Noto Serif SC"', words), document.fonts.load('700 47px "Noto Serif SC"', words)]);
  await document.fonts.ready;
  const brushAtlas = new Image(); brushAtlas.src='/public/generated/brush-atlas.png'; await brushAtlas.decode();
  configureBrushAtlas(brushAtlas);
  const paper = makePaper(), assets=prepareScenes({paper,brushAtlas}), thumbnails = bakeThumbnails(paper,assets);
  let p, layer, brushAdapter;
  await new Promise((resolve, reject) => {
    try {
      new window.p5(sketch => {
        p = sketch; brushAdapter = bindBrush(p);
        p.setup = () => {
          try {
            p.pixelDensity(1); const canvas = p.createCanvas(width, height, p.WEBGL); canvas.id('film-canvas');
            p.noLoop();
            // Fix the 2D raster backend before p5 wraps the surface. GPU 2D
            // antialiasing can otherwise vary by one intensity level on seeks.
            const surface = document.createElement('canvas'); surface.width = width; surface.height = height;
            surface.getContext('2d', {willReadFrequently:true});
            layer = p.createGraphics(width, height, surface); layer.pixelDensity(1);
            brushAdapter.probe();
            p.draw = () => { p.clear(); p.image(layer, -width / 2, -height / 2, width, height); };
            resolve();
          } catch (error) { reject(error); }
        };
      }, document.getElementById('film-stage'));
    } catch (error) { reject(error); }
  });
  const metadata = Object.freeze({duration: DURATION, width, height, silent: !audio, seed: 721032, p5Version: '2.3.4', brushVersion: brushAdapter.version, cpuRaster:layer.drawingContext.getContextAttributes().willReadFrequently, scenes: SCENES, stage:'production',fps:60});
  let serial = Promise.resolve();
  function renderAt(requestedTime) {
    const position = locate(requestedTime);
    const work = serial.then(async () => {
      const {time, kind, scene} = position;
      const c = layer.drawingContext;
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, width, height);
      c.save(); c.scale(width / 1920, height / 1080);
      if (kind === 'intro') {
        drawIntro(c, time, paper);
        if (time > 4.65) {
          c.save(); c.globalAlpha = smooth((time - 4.65) / .35);
          drawWorld(c, time, paper, {titles:false,assets}); c.restore();
        }
      } else if (kind === 'scene') drawWorld(c, time, paper,{assets});
      else drawOutro(c, time, paper, thumbnails);
      c.restore();
      await p.redraw();
      p._renderer.GL.finish();
      return {time, kind, sceneId:scene?.id ?? kind, sceneName:scene?.titleZh ?? (kind === 'intro' ? '序言' : '新闻发布会')};
    });
    serial = work.catch(() => {});
    return work;
  }
  return {metadata, renderAt};
}
