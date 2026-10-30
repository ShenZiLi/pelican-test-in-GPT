import { createFilm } from './film.js';
import { DURATION, SCENES, locate } from '../beat/timeline.js';
import { createAudioEngine } from '../../audio/engine.js';
const query = new URLSearchParams(location.search), capture = query.get('capture') === '1';
if (capture) document.documentElement.classList.add('capture');
const width = Number(query.get('width') ?? 1920), height = Number(query.get('height') ?? 1080);
if (!Number.isInteger(width) || !Number.isInteger(height) || width < 160 || height < 90 || width > 3840 || height > 2160 || Math.abs(width / height - 16 / 9) > .001) throw new Error('画面尺寸须为有效的 16:9');
const toggle = document.getElementById('play-toggle'), seek = document.getElementById('seek');
let currentTime = 0, running = false, preparing=false, anchor = 0, generation = 0, renderer;
const audioEngine=capture?null:createAudioEngine();
const format = value => `${String(Math.floor(value / 60)).padStart(2,'0')}:${String(Math.floor(value % 60)).padStart(2,'0')}`;
function updateControls() {
  const pos = locate(currentTime);
  seek.value = currentTime;
  document.getElementById('time-display').textContent = `${format(currentTime)} / 02:17`;
  document.getElementById('scene-name').textContent = pos.scene?.titleZh ?? (pos.kind === 'intro' ? '序言' : '新闻发布会');
  for (const button of document.querySelectorAll('#chapters button')) button.setAttribute('aria-current', String(button.dataset.scene === (pos.scene?.id ?? pos.kind)));
  toggle.textContent = running ? '暂停' : '播放';
}
function pause() { running = false; preparing=false; generation++; audioEngine?.pause(); updateControls(); }
async function renderAt(t) {
  const result = await renderer.renderAt(t); currentTime = result.time; updateControls(); return result;
}
async function setTime(t) {
  // Scrubbing pauses deliberately, so rapid seeks cannot restart an old playhead.
  pause(); return renderAt(t);
}
async function play() {
  if (running || preparing || !renderer) return;
  if (currentTime >= DURATION) currentTime = 0;
  const token=++generation;preparing=true;toggle.textContent='准备配乐…';
  try{if(audioEngine)await audioEngine.play(currentTime);}catch(error){pause();document.getElementById('error').hidden=false;document.getElementById('error').textContent=error.message;throw error;}
  if(token!==generation)return;
  preparing=false;running = true;anchor = performance.now() - currentTime * 1000; updateControls();
  async function frame(now) {
    if (!running || token !== generation) return;
    const t = Math.min(DURATION, audioEngine?audioEngine.time():(now - anchor) / 1000);
    await renderAt(t);
    if (token !== generation) return;
    if (t >= DURATION) pause(); else requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const ready = createFilm({width, height,audio:!capture}).then(async value => {
  renderer = value; film.metadata = renderer.metadata;
  await renderAt(0); toggle.disabled = seek.disabled = false;
  return renderer.metadata;
}).catch(error => {
  document.getElementById('error').hidden = false; document.getElementById('error').textContent = error.message;
  console.error(error); throw error;
});
const film = {ready, renderAt:async t => {await ready; pause(); return renderAt(t);}, pause, play, audio:audioEngine, seek:async t => {await ready; return setTime(t);}, get time(){return currentTime;}, get playing(){return running;}};
window.film = film;
toggle.addEventListener('click', () => running||preparing ? pause() : play().catch(console.error));
seek.addEventListener('input', () => { setTime(Number(seek.value)).catch(console.error); });
const chapters = [{id:'intro',number:'序',titleZh:'序言',start:0}, ...SCENES, {id:'outro',number:'终',titleZh:'新闻发布会',start:125}];
for (const scene of chapters) {
  const button = document.createElement('button'); button.textContent = String(scene.number).padStart(2,'0');
  button.dataset.scene = scene.id; button.title = `${scene.titleZh} · ${scene.start}s`; button.setAttribute('aria-label', `跳转 ${scene.titleZh}`);
  button.addEventListener('click', () => {setTime(scene.start).catch(console.error);}); document.getElementById('chapters').append(button);
}
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !['INPUT','BUTTON'].includes(document.activeElement.tagName)) {event.preventDefault(); running ? pause() : play();}
  if (event.code === 'ArrowRight' && document.activeElement.tagName !== 'INPUT') setTime(Math.min(DURATION,currentTime+5)).catch(console.error);
  if (event.code === 'ArrowLeft' && document.activeElement.tagName !== 'INPUT') setTime(Math.max(0,currentTime-5)).catch(console.error);
});
