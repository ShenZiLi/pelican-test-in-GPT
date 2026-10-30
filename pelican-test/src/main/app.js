import {drawFilm,H} from './film.js';
import {locate,DURATION,clamp,SCENES} from '../beat/timeline.js';
import {initBrush} from '../kit/brush.js';
import {register} from '../scenes/registry.js';
import {Soundtrack} from '../player/sound.js';
import * as sahara from '../scenes/01-sahara.js';
import * as egypt from '../scenes/02-egypt.js';
import * as han from '../scenes/03-han.js';
import * as tang from '../scenes/04-tang.js';
import * as song from '../scenes/05-song.js';
import * as riverside from '../scenes/06-riverside.js';
import * as maya from '../scenes/07-maya.js';
import * as mughal from '../scenes/08-mughal.js';
import * as bada from '../scenes/09-bada.js';
import * as wayang from '../scenes/10-wayang.js';
import * as ukiyo from '../scenes/11-ukiyo.js';
import * as starry from '../scenes/12-starry.js';
import * as scream from '../scenes/13-scream.js';
import * as shadow from '../scenes/14-shadow.js';
import * as scope from '../scenes/15-scope.js';
import * as pixel from '../scenes/16-pixel.js';
import * as chat from '../scenes/17-chat.js';
import * as vapor from '../scenes/18-vapor.js';
import * as short from '../scenes/19-short.js';
import * as code from '../scenes/20-code.js';
[sahara,egypt,han,tang,song,riverside,maya,mughal,bada,wayang,ukiyo,starry,scream,shadow,scope,pixel,chat,vapor,short,code].forEach((fn,i)=>register(i+1,fn.default,fn.renderSubject,fn));
const params=new URLSearchParams(location.search),render=params.has('render'),skeleton=params.get('stage')==='skeleton';
if(params.has('solo')){const id=Number(params.get('solo')),scene=SCENES[id-1];const mod=await import(`../scenes/${String(id).padStart(2,'0')}-${scene.key}.js`);register(id,mod.default,mod.renderSubject,mod);}
if(render)document.body.classList.add('render');
let current=0,playing=false,startTime=0,offset=0,p,layer,busy=false;
const screen=document.querySelector('#screen');
function previewWidth(){const box=screen.getBoundingClientRect();return render?1920:Math.max(1,Math.round(box.width/Math.max(1,box.height)*H));}
let viewportWidth=previewWidth();
let exportCanvas;
function exportAt(t){if(!exportCanvas){exportCanvas=document.createElement('canvas');exportCanvas.width=1920;exportCanvas.height=H;}drawFilm(exportCanvas.getContext('2d',{willReadFrequently:true}),t,{skeleton});return exportCanvas.toDataURL('image/jpeg',.95);}
const sound=new Soundtrack();
const play=document.querySelector('#play'),seek=document.querySelector('#seek'),name=document.querySelector('#scene-name'),time=document.querySelector('#time'),soundButton=document.querySelector('#sound');
if(skeleton)soundButton.disabled=true;
function label(t){const loc=locate(t);return loc.kind==='intro'?'序 · 一本正经地胡说':loc.kind==='outro'?'终 · 新闻发布会':`${String(loc.scene.id).padStart(2,'0')} · ${loc.scene.zh}`;}
function update(){seek.value=String(current);time.textContent=`${Math.floor(current/60)}:${String(Math.floor(current%60)).padStart(2,'0')} / 2:17`;name.textContent=label(current);}
async function drawAt(t){current=clamp(t,0,DURATION);await p.redraw();update();return {time:current,scene:label(current)};}
async function seekTo(t){offset=clamp(t,0,DURATION);startTime=performance.now();if(playing&&sound.enabled)sound.start(offset);await drawAt(offset);}
new window.p5(sk=>{
  p=sk;window.brush.instance(sk);
  sk.setup=async()=>{
    sk.pixelDensity(1);sk.createCanvas(viewportWidth,H,sk.WEBGL).parent('screen');sk.noLoop();
    if(!skeleton)await initBrush(sk);
    layer=sk.createGraphics(viewportWidth,H,sk.P2D);
    // drawFilm resets the raw Canvas transform, so its backing store must use
    // one pixel per logical unit regardless of p5.brush or display density.
    layer.pixelDensity(1);
    const glyphs=await fetch('/public/glyphs.txt').then(r=>r.ok?r.text():'鹈鹕测试人类自古以来骑行');
    await document.fonts.load('40px "Noto Serif SC"',glyphs);await document.fonts.ready;
    window.film={renderAt:drawAt,seekTo,exportAt,frameJPEG:()=>layer.canvas.toDataURL('image/jpeg',.95),get time(){return current;},get ready(){return true;},get playing(){return playing;},audioStats:()=>sound.stats(),label,stage:skeleton?'skeleton':'art',brush:!!window.brush,brushBaked:!!window.brushTexture};
    document.querySelector('#loading').remove();await drawAt(Number(params.get('t')||0));
    if(!render)new ResizeObserver(()=>sk.windowResized()).observe(screen);
  };
  sk.windowResized=()=>{if(render||!layer)return;const width=previewWidth();if(width===viewportWidth)return;viewportWidth=width;sk.resizeCanvas(viewportWidth,H);layer.resizeCanvas(viewportWidth,H);sk.redraw();};
  sk.draw=()=>{if(!layer)return;drawFilm(layer.drawingContext,current,{skeleton,viewportWidth});sk.clear();sk.image(layer,-viewportWidth/2,-H/2,viewportWidth,H);};
});
play.addEventListener('click',async()=>{
  if(playing){playing=false;sound.stop();play.textContent='播放';return;}
  if(current>=DURATION)await seekTo(0);
  playing=true;offset=current;startTime=performance.now();
  if(sound.enabled){await sound.context.resume();if(playing)sound.start(offset);}
  play.textContent=playing?'暂停':'播放';
});
soundButton.addEventListener('click',async()=>{
  if(sound.enabled){sound.enabled=false;sound.stop();offset=current;startTime=performance.now();soundButton.textContent='声音关';return;}
  soundButton.disabled=true;soundButton.textContent='配乐加载中…';
  try{await sound.load();sound.enabled=true;if(playing)sound.start(current);soundButton.textContent='声音开';}
  catch(error){soundButton.textContent=error.message;}
  finally{soundButton.disabled=false;}
});
seek.addEventListener('input',()=>seekTo(Number(seek.value)));
document.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement)return;if(e.code==='Space'){e.preventDefault();play.click();}if(e.code==='ArrowRight')seekTo(current+1);if(e.code==='ArrowLeft')seekTo(current-1);});
async function tick(){if(playing&&!busy){busy=true;try{let t=sound.enabled&&sound.source?sound.time:offset+(performance.now()-startTime)/1000;if(t>=DURATION){t=DURATION;playing=false;sound.stop();play.textContent='播放';}await drawAt(t);}finally{busy=false;}}requestAnimationFrame(tick);}
if(!render)requestAnimationFrame(tick);
