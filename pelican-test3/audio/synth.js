/** Original score for Pelican Test 3. No recordings, samples, or borrowed melodies. */
export const DURATION = 137;
export const SAMPLE_RATE = 48000;
export const BPM = 120;
export const TAPE_RATE = 0.7937;
export const TAPE_SOURCE_BPM = BPM / TAPE_RATE;
const TAU = Math.PI * 2;
// Twelve half-second beats: an original little question, then a dry descending answer.
export const MELODY = [62, 69, 65, 64, 62, 57, 60, 65, 67, 64, 62, 57];
const midi = n => 440 * 2 ** ((n - 69) / 12);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
let renderPromise, playbackPromise, liveContext, liveSource, liveStart = 0, parked = 0;

function noiseBuffer(ctx, seconds, seed = 7391) {
  const buffer = ctx.createBuffer(1, Math.ceil(seconds * ctx.sampleRate), ctx.sampleRate);
  const data = buffer.getChannelData(0); let s = seed >>> 0;
  for (let i = 0; i < data.length; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    data[i] = (s / 4294967296) * 2 - 1;
  }
  return buffer;
}
function gain(ctx, value, to) { const g = ctx.createGain(); g.gain.value = value; g.connect(to); return g; }
function env(ctx, at, length, volume, to, attack = .008, sustain = .25) {
  const g = gain(ctx, 0, to), end = at + length;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(volume, at + Math.min(attack, length * .2));
  g.gain.exponentialRampToValueAtTime(Math.max(.00001, volume * sustain), at + length * .72);
  g.gain.exponentialRampToValueAtTime(.00001, end);
  g.gain.setValueAtTime(0, end + .003);
  return g;
}
function osc(ctx, type, hz, at, length, to, detune = 0) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = hz; o.detune.value = detune;
  o.connect(to); o.start(at); o.stop(at + length + .006); return o;
}
function tone(ctx, to, at, note, length, volume, type = 'sine', attack = .008) {
  const g = env(ctx, at, length, volume, to, attack); osc(ctx, type, midi(note), at, length, g); return g;
}
function pluck(ctx, to, at, note, length, volume, bright = 1) {
  const f = midi(note), g = env(ctx, at, length, volume, to, .002, .06);
  for (let i = 1; i <= 5; i++) {
    const part = gain(ctx, Math.exp(-i * .45) * bright ** (i / 6), g);
    osc(ctx, 'sine', f * i * (1 + i * i * .00006), at, length, part);
  }
}
function metal(ctx, to, at, note, length, volume, ratios = [1, 2.76, 5.4]) {
  const f = midi(note);
  ratios.forEach((r, i) => {
    const g = env(ctx, at, length / (1 + i * .22), volume / (1 + i * 2), to, .002, .08);
    osc(ctx, 'sine', f * r, at, length, g);
  });
}
function fm(ctx, to, at, note, length, volume, ratio = 2, index = 1.5, type = 'sine') {
  const f = midi(note), carrier = ctx.createOscillator(), mod = ctx.createOscillator();
  carrier.type = type; carrier.frequency.value = f; mod.frequency.value = f * ratio;
  const amount = ctx.createGain(); amount.gain.setValueAtTime(f * index, at); amount.gain.exponentialRampToValueAtTime(f * .08, at + length);
  mod.connect(amount).connect(carrier.frequency); carrier.connect(env(ctx, at, length, volume, to, .006, .15));
  carrier.start(at); mod.start(at); carrier.stop(at + length); mod.stop(at + length);
}
function strings(ctx, to, at, note, length, volume, bend = 0) {
  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1600; filter.Q.value = .5;
  filter.connect(env(ctx, at, length, volume, to, .09, .65));
  for (const d of [-7, 7]) {
    const o = osc(ctx, 'sawtooth', midi(note), at, length, gain(ctx, .32, filter), d);
    if (bend) { o.frequency.setValueAtTime(midi(note), at); o.frequency.exponentialRampToValueAtTime(midi(note + bend), at + length * .7); }
  }
}
function flute(ctx, to, at, note, length, volume, air) {
  const g = env(ctx, at, length, volume, to, .04, .5), f = midi(note);
  osc(ctx, 'sine', f, at, length, g);
  osc(ctx, 'sine', f * 2, at, length, gain(ctx, .12, g));
  const mod = ctx.createOscillator(), depth = ctx.createGain(); mod.frequency.value = 5.1; depth.gain.value = f * .003;
  const voice = osc(ctx, 'sine', f * 1.002, at, length, gain(ctx, .16, g)); mod.connect(depth).connect(voice.frequency); mod.start(at); mod.stop(at + length);
  if (air) hiss(ctx, g, at, length, air, 2300);
}
function hiss(ctx, to, at, length, volume, frequency = 3500, type = 'highpass', source) {
  const s = ctx.createBufferSource(); s.buffer = source || noiseBuffer(ctx, Math.max(.1, length), 784 + Math.floor(at * 1000)); s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = frequency;
  s.connect(f).connect(env(ctx, at, length, volume, to, .002, .02)); s.start(at); s.stop(at + length); return s;
}
function drum(ctx, to, at, volume, pitch = 110, length = .2) {
  const o = osc(ctx, 'sine', pitch, at, length, env(ctx, at, length, volume, to, .001, .02));
  o.frequency.setValueAtTime(pitch * 1.65, at); o.frequency.exponentialRampToValueAtTime(pitch * .6, at + length);
}
function choir(ctx, to, at, note, length, volume) {
  const g = env(ctx, at, length, volume, to, .16, .6);
  for (const [f, q, level] of [[720, 7, .5], [1170, 10, .3], [2400, 12, .13]]) {
    const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = f; filter.Q.value = q;
    filter.connect(gain(ctx, level, g)); osc(ctx, 'sawtooth', midi(note), at, length, filter);
  }
}
function bell(ctx, to, at, volume = .16, length = .43) {
  // An original two-part bicycle bell with two inharmonic bright overtones.
  for (const [offset, base] of [[0, 1568], [.055, 2093]]) for (const [r, amp] of [[1, 1], [2.71, .24], [4.13, .08]]) {
    const duration = length - offset;
    osc(ctx, 'sine', base * r, at + offset, duration, env(ctx, at + offset, duration, volume * amp, to, .001, .025));
  }
}
function message(ctx, to, at, volume) { tone(ctx, to, at, 81, .09, volume); tone(ctx, to, at + .1, 86, .13, volume * .7); }
function coin(ctx, to, at) { tone(ctx, to, at, 83, .08, .035, 'square'); tone(ctx, to, at + .075, 90, .16, .024, 'square'); }

export const INSTRUMENTS = ['Sahara drum / synthetic chant', 'Egyptian harp approximation', 'Han bronze bells', 'Tang pipa approximation', 'Song qin approximation', 'Flute and opera percussion', 'Maya ceramic flute and wood drum', 'Sitar and tabla approximation', 'Breathy xiao approximation', 'Gamelan metal bars', 'Shamisen approximation', 'Bowed strings', 'Detuned strings', 'Silent-film piano and organ', 'Oscillator and tube hum', 'Four-channel chip voice', 'MIDI bells and message percussion', 'Original slowed mall tape', 'Short-form pop beat', 'Piano and clean synthesizer'];

function instrument(ctx, to, id, at, note, length = .42, volume = .1, beat = 0) {
  switch (id) {
    case 1: choir(ctx, to, at, note - 12, length * 1.5, volume * .9); break;
    case 2: pluck(ctx, to, at, note + 12, length * 1.5, volume, .7); break;
    case 3: metal(ctx, to, at, note, length * 1.8, volume, [1, 2.01, 2.78, 5.12]); break;
    case 4: pluck(ctx, to, at, note, length, volume * 1.3, 1.9); if (beat % 3 === 0) pluck(ctx, to, at + .085, note + 12, length * .55, volume * .45, 1.6); break;
    case 5: pluck(ctx, to, at, note - 12, length * 2, volume * 1.35, .5); break;
    case 6: flute(ctx, to, at, note + 12, length, volume * .8, .02); break;
    case 7: flute(ctx, to, at, note + 12, length * .85, volume * .8, .004); break;
    case 8: fm(ctx, to, at, note, length * 1.4, volume * .55, 1, 3); pluck(ctx, to, at, note + 12, length * 1.5, volume * .45, 2); break;
    case 9: flute(ctx, to, at, note - 12, length * 1.3, volume, .1); break;
    case 10: metal(ctx, to, at, note, length * 1.6, volume * .9, [1, 2.78, 4.11, 5.43]); break;
    case 11: pluck(ctx, to, at, note, length * .8, volume * 1.2, 2.5); break;
    case 12: strings(ctx, to, at, note, length * 1.45, volume * 1.1); break;
    case 13: strings(ctx, to, at, note, length * 1.45, volume * 1.1); break;
    case 14: pluck(ctx, to, at, note, length, volume, .8); tone(ctx, to, at, note - 12, length * 1.2, volume * .15, 'triangle', .03); break;
    case 15: tone(ctx, to, at, note + 12, length * .65, volume * .75); break;
    case 16: tone(ctx, to, at, note + 12, Math.min(.24, length * .65), volume * .33, 'square'); break;
    case 17: fm(ctx, to, at, note + 12, length, volume * .7, 2, 1.3); break;
    case 18: fm(ctx, to, at, note, length, volume * .6, 2, 1.4); break;
    case 19: pluck(ctx, to, at, note + 12, length * .6, volume, 1.1); break;
    case 20: pluck(ctx, to, at, note, length * 1.6, volume, .7); tone(ctx, to, at, note + 12, length, volume * .16, 'sine', .06); break;
  }
}
function sceneRhythm(ctx, to, id, start) {
  for (let i = 0; i < 12; i++) {
    const t = start + i * .5;
    if ([1, 7, 8].includes(id)) {
      drum(ctx, to, t, i % 4 === 0 ? .11 : .045, id === 7 ? 240 : id === 8 ? 175 : 95, .18);
      if (id === 8) { drum(ctx, to, t + .25, .035, 290, .12); }
    }
    if (id === 6) {
      if (i % 4 === 0) metal(ctx, to, t, 47, .7, .055, [1, 1.44, 2.63, 3.6]);
      if (i % 2) hiss(ctx, to, t, .065, .045, 1200, 'bandpass');
    }
    if (id === 16) {
      // Two square voices, one triangle bass, one noise percussion voice.
      tone(ctx, to, t, 38 + (i % 4 === 2 ? 7 : 0), .29, .07, 'triangle');
      tone(ctx, to, t + .25, MELODY[i] + 7, .13, .012, 'square');
      hiss(ctx, to, t + .25, .045, .027, 3200);
    }
    if (id === 17 && i % 2) message(ctx, to, t, .025);
    if (id === 19) {
      drum(ctx, to, t, i % 2 === 0 ? .11 : .065, 58, .24);
      if (i % 2) hiss(ctx, to, t, .09, .055, 1800);
      hiss(ctx, to, t + .25, .04, .018, 6500);
    }
    // Chain rhythm is deliberately sparse, leaving ink scenes breathing room.
    if (![5, 9, 16, 18].includes(id) && i % 2 === 0) hiss(ctx, to, t + .25, .023, .008, 7200);
  }
  if (id === 13) { strings(ctx, to, start + 2, 84, .7, .13, 9); strings(ctx, to, start + 2.07, 85, .65, .08, -5); }
  if (id === 14) { for (const n of [38, 45, 50]) tone(ctx, to, start, n, 5.5, .014, 'triangle', .3); }
  if (id === 15) {
    tone(ctx, to, start, 35, 5.9, .014, 'sine', .2);
    const g = env(ctx, start + 2.5, .5, .075, to, .005, .5), o = osc(ctx, 'sine', 880, start + 2.5, .5, g);
    o.frequency.setValueAtTime(880, start + 2.5);o.frequency.exponentialRampToValueAtTime(131, start + 2.65);o.frequency.exponentialRampToValueAtTime(1460, start + 2.85);o.frequency.exponentialRampToValueAtTime(880, start + 3);
  }
  if (id === 16) coin(ctx, to, start + 2.5);
  if (id === 17) message(ctx, to, start + 2, .045);
}

function impulse(ctx, seconds = 4) {
  const b = ctx.createBuffer(2, Math.floor(seconds * ctx.sampleRate), ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    let seed = 6193 + ch * 917;
    const d = b.getChannelData(ch);
    for (let i = 0; i < d.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      d[i] = (seed / 2147483648 - 1) * Math.exp(-i / ctx.sampleRate * 1.8) * .32;
    }
  }
  return b;
}
async function renderMallTape() {
  const ctx = new OfflineAudioContext(2, 10 * SAMPLE_RATE, SAMPLE_RATE), out = gain(ctx, .7, ctx.destination);
  const beat = 60 / TAPE_SOURCE_BPM;
  const sourceShift = 4;
  // Dm9 / Bbmaj7 / Gm9 / A minor-major colour, transposed before recording.
  const chords = [[50, 57, 60, 64, 65], [46, 53, 57, 60, 65], [43, 50, 53, 57, 58], [45, 52, 55, 60, 64]];
  for (let i = 0; i < 24; i++) {
    const at = i * beat, chord = chords[Math.floor(i / 4) % chords.length];
    if (i % 2 === 0) for (const n of chord) fm(ctx, out, at, n + sourceShift, beat * 2.8, .035, 2, 1.1);
    // Fretless bass: smooth onset and a subtle upward approach into the fundamental.
    const bass = osc(ctx, 'triangle', midi(chord[0] + sourceShift - 12), at, beat * .85, env(ctx, at, beat * .85, .08, out, .025, .5));
    bass.frequency.setValueAtTime(midi(chord[0] + sourceShift - 12.2), at); bass.frequency.exponentialRampToValueAtTime(midi(chord[0] + sourceShift - 12), at + .08);
    if (i < 20) fm(ctx, out, at + beat * .05, MELODY[i % 12] + sourceShift, beat * .87, .052, 1, 1.7, 'triangle');
    if (i % 2 === 0) drum(ctx, out, at, .075, 65, .18);
    else {
      hiss(ctx, out, at, .115, .045, 1500, 'bandpass');
      // A short, gated cluster of original diffuse noise taps.
      for (let j = 1; j <= 5; j++) hiss(ctx, out, at + j * .021, .035, .012 * (1 - j / 7), 2100, 'bandpass');
    }
    hiss(ctx, out, at + beat * .5, .04, .012, 7000);
  }
  return ctx.startRendering();
}
function tapeInto(ctx, to, tape, start) {
  const tapeBus = gain(ctx, 0, to);
  tapeBus.gain.setValueAtTime(0, start);tapeBus.gain.linearRampToValueAtTime(.8, start + .05);
  tapeBus.gain.setValueAtTime(.8, start + 5.72);tapeBus.gain.linearRampToValueAtTime(0, start + 6);
  const low = ctx.createBiquadFilter();low.type = 'lowpass';low.frequency.value = 4000;low.Q.value = .35;
  low.connect(gain(ctx, .48, tapeBus));const verb = ctx.createConvolver();verb.buffer = impulse(ctx, 4.2);low.connect(verb);verb.connect(gain(ctx, .72, tapeBus));
  const wow = ctx.createOscillator(), wowDepth = ctx.createGain();wow.frequency.value = .5;wowDepth.gain.value = 5;wow.connect(wowDepth);wow.start(start);wow.stop(start + 6);
  function part(at, duration, offset, entrance = false, exit = false) {
    const source = ctx.createBufferSource(); source.buffer = tape;source.playbackRate.value = TAPE_RATE;
    if (entrance) { source.playbackRate.setValueAtTime(1, at);source.playbackRate.linearRampToValueAtTime(TAPE_RATE, at + .28); }
    if (exit) { source.playbackRate.setValueAtTime(TAPE_RATE, at + duration - .25);source.playbackRate.linearRampToValueAtTime(1, at + duration); }
    wowDepth.connect(source.detune);
    const fade = gain(ctx, 0, low);fade.gain.setValueAtTime(0, at);fade.gain.linearRampToValueAtTime(1, at + .006);fade.gain.setValueAtTime(1, at + duration - .009);fade.gain.linearRampToValueAtTime(0, at + duration);
    source.connect(fade);source.start(at, offset);source.stop(at + duration + .002);
  }
  part(start, 2, 0, true);
  // The same half-beat tape segment repeats four times in bar two.
  for (let i = 0; i < 4; i++) part(start + 2 + i * .25, .25, 2 * TAPE_RATE);
  part(start + 3, 3, 3 * TAPE_RATE, false, true);
  hiss(ctx, tapeBus, start, 6, .006, 2700, 'lowpass');
}

async function buildScore() {
  const tape = await renderMallTape();
  const ctx = new OfflineAudioContext(2, DURATION * SAMPLE_RATE, SAMPLE_RATE);
  const compressor = ctx.createDynamicsCompressor();compressor.threshold.value = -14;compressor.knee.value = 10;compressor.ratio.value = 3;compressor.attack.value = .008;compressor.release.value = .16;compressor.connect(ctx.destination);
  const master = gain(ctx, .83, compressor);
  // Restrained documentary opening; the second caption has a precise low-string accent.
  for (const n of [38, 45, 50]) strings(ctx, master, 0, n, 4.8, .045);
  metal(ctx, master, 3, 38, .65, .055, [1, 1.5, 2]);
  for (let id = 1; id <= 20; id++) {
    const start = 5 + (id - 1) * 6, scene = gain(ctx, 0, master);
    scene.gain.setValueAtTime(0, start);scene.gain.linearRampToValueAtTime(1, start + .012);scene.gain.setValueAtTime(1, start + 5.88);scene.gain.linearRampToValueAtTime(0, start + 6);
    if (id === 18) { tapeInto(ctx, scene, tape, start);continue; }
    for (let beat = 0; beat < 12; beat++) {
      if ([5, 9].includes(id) && beat % 2) continue;
      // The coin takes over square channel one instead of adding a fifth chip voice.
      if (!(id === 16 && beat === 5)) instrument(ctx, scene, id, start + beat * .5, MELODY[beat], [5,9].includes(id) ? .8 : .42, .105, beat);
      if ([2, 3, 4, 8, 10, 11, 12, 13, 14, 20].includes(id) && beat % 4 === 0)
        instrument(ctx, scene, id, start + beat * .5, 38 + (beat === 4 ? 3 : beat === 8 ? 5 : 0), 1.3, .035, beat);
    }
    sceneRhythm(ctx, scene, id, start);
  }
  // Shadow becomes an energized trace on the exact 89 s frame boundary.
  const zap = env(ctx, 89, .16, .07, master, .001, .06), zo = osc(ctx, 'sawtooth', 120, 89, .16, zap);
  zo.frequency.exponentialRampToValueAtTime(1800, 89.13);
  // Gallery: twenty timbral families return together, then yield to the empty chair.
  const finale = gain(ctx, 0, master);finale.gain.setValueAtTime(.65, 125);finale.gain.setValueAtTime(.65, 128.5);finale.gain.linearRampToValueAtTime(.16, 133);finale.gain.linearRampToValueAtTime(0, 135.6);
  for (let beat = 0; beat < 20; beat++) for (let id = 1; id <= 20; id++) {
    instrument(ctx, finale, id, 125 + beat * .5, MELODY[beat % 12] + (id % 3 === 0 ? -12 : 0), .6, .014, beat);
  }
  for (const t of [130, 130.5, 131.5, 132.5]) hiss(ctx, master, t, .045, .045, 2800, 'bandpass');
  bell(ctx, master, 136.5, .17, .45);
  const buffer = await ctx.startRendering();
  // Normalize once, preserving headroom; both playback and export use these exact samples.
  let peak = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const d = buffer.getChannelData(ch);for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
  const scale = peak > .86 ? .86 / peak : peak > 0 ? Math.min(1.8, .72 / peak) : 1;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const d = buffer.getChannelData(ch);for (let i = 0; i < d.length; i++) d[i] *= scale;
    // Ensure file boundary is silent even with compressor release.
    const tail = Math.round(.02 * SAMPLE_RATE);for (let i = 0; i < tail; i++) d[d.length - tail + i] *= 1 - i / (tail - 1);
  }
  return buffer;
}
export async function renderAudio() { renderPromise ||= buildScore().catch(err => {renderPromise = undefined;throw err;});return renderPromise; }
async function playbackBuffer() {
  playbackPromise ||= (async()=>{
    try {
      const response=await fetch('/out/soundtrack.wav');
      if(!response.ok)throw Error('Rendered score is not available');
      const buffer=await liveContext.decodeAudioData(await response.arrayBuffer());
      if(buffer.numberOfChannels!==2||Math.abs(buffer.duration-DURATION)>.001)throw Error('Rendered score does not match the film');
      return buffer;
    } catch {return renderAudio();}
  })().catch(error=>{playbackPromise=undefined;throw error});
  return playbackPromise;
}
export function playhead() { return liveSource ? clamp(liveContext.currentTime - liveStart, 0, DURATION) : parked; }
export function stop() {
  ++playGeneration;
  parked = playhead();
  if (liveSource) { const source = liveSource;liveSource = null;source.onended = null;try {source.stop();} catch {}source.disconnect(); }
}
let playGeneration = 0;
export async function playFrom(t = 0) {
  stop();const generation = ++playGeneration;parked = clamp(t, 0, DURATION);
  liveContext ||= new AudioContext({sampleRate: SAMPLE_RATE});await liveContext.resume();
  const buffer = await playbackBuffer();if (generation !== playGeneration || parked >= DURATION) return;
  liveSource = liveContext.createBufferSource();liveSource.buffer = buffer;liveSource.connect(liveContext.destination);
  liveStart = liveContext.currentTime - parked;liveSource.start(0, parked);
  const source = liveSource;source.onended = () => {if (liveSource === source) {liveSource = null;parked = DURATION;}};
}
export function cancelPlayback() { ++playGeneration;stop(); }
