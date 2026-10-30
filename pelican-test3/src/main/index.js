import {drawFilm,catalog,locate} from './film.js';
import {W,H} from '../kit/index.js';
const params=new URLSearchParams(location.search),exporting=params.has('export'),width=Number(params.get('width'))||1920,height=Math.round(width*9/16);
if(exporting)document.body.classList.add('export');
let p,c,display,time=0,playing=false,origin=0,muted=false,audio=null,request=0,raf=0,pending=false;
const $=id=>document.getElementById(id),clock=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function render(t){time=Math.max(0,Math.min(137,t));c.save();c.setTransform(width/W,0,0,height/H,0,0);drawFilm(c,time);c.restore();display.drawImage(c.canvas,0,0);if(!exporting){$('time').textContent=clock(time);$('seek').value=time;const at=locate(time);$('scene-name').textContent=at.kind==='scene'?catalog[at.index].name:at.kind==='intro'?'序 · 一项严肃的研究':'尾声 · 新闻发布会';document.querySelectorAll('#chapters button').forEach((b,i)=>b.classList.toggle('active',at.index===i));}return time;}
await new Promise(resolve=>{p=new p5(instance=>{instance.setup=()=>{instance.pixelDensity(1);instance.createCanvas(width,height).parent('canvas');instance.noLoop();display=instance.drawingContext;const surface=document.createElement('canvas');surface.width=width;surface.height=height;c=surface.getContext('2d',{willReadFrequently:true});resolve()}})});
await document.fonts.ready;
window.film={renderAt:render,duration:137,catalog,canvas:()=>c.canvas,ready:true};
render(Number(params.get('t'))||0);
async function play(){if(playing||pending){pause();return}if(time>=137)time=0;const id=++request;pending=true;$('play').textContent='…';if(!muted){try{audio??=await import('../../audio/synth.js');if(id!==request)return;await audio.playFrom(time)}catch(e){console.error(e);muted=true;$('sound').textContent='声音暂不可用'}}if(id!==request)return;pending=false;playing=true;origin=performance.now()/1000-time;$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','暂停');$('start-overlay').hidden=true;raf=requestAnimationFrame(tick)}
function pause(){++request;pending=false;playing=false;cancelAnimationFrame(raf);audio?.stop();$('play').textContent='▶';$('play').setAttribute('aria-label','播放')}
function tick(){if(!playing)return;const t=audio&&!muted?audio.playhead():performance.now()/1000-origin;render(t);if(t>=137){pause();return}raf=requestAnimationFrame(tick)}
$('play').onclick=play;$('start-overlay').onclick=play;$('seek').oninput=()=>{const was=playing;pause();render(Number($('seek').value));if(was)play()};$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'声音关闭':'声音开启';if(playing){pause();play()}};
$('fullscreen').onclick=()=>document.querySelector('.screen').requestFullscreen();catalog.forEach((m,i)=>{let b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')} ${m.name}`;b.onclick=()=>{let was=playing;pause();render(5+i*6+.6);if(was)play()};$('chapters').append(b)});
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.code==='Space'){e.preventDefault();play()}if(e.code==='ArrowRight'){pause();render(time+5)}if(e.code==='ArrowLeft'){pause();render(time-5)}});
