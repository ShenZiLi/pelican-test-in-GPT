import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {buildScore,TAPE_RATE} from '../audio/score.js';import {TAPE_SEGMENTS,TAPE_SOURCE_PREFIX,TAPE_PREROLL_START,integratedTapeRead,encodeWav24} from '../audio/render.js';import {SUPPORTED_VOICES} from '../audio/synth.js';

test('all scheduled instruments have a synthesis implementation, including every outro layer',()=>{
 const events=buildScore();for(const e of events)assert.ok(e.voice==='tape'||SUPPORTED_VOICES.includes(e.voice),e.voice);
 const outro=new Set(events.filter(e=>e.role==='orchestra').map(e=>e.voice));for(const v of ['chant','harp','bell','pipa','guqin','dizi','ocarina','sitar','xiao','gamelan','shamisen','strings','piano','organ','sine','hum','square1','square2','triangle','noise','midi','message','fm-epiano','fretlessbass','fm-sax','gateddrums','pop','popdrum','synth','handdrum','wooddrum','tabla','gong'])assert.ok(outro.has(v),v);
 assert.ok(events.filter(e=>e.role==='orchestra').every(e=>e.time+e.duration<=133));
});

test('tape reads four identical quarter-second cells and resets at the exact next beat',()=>{
 assert.equal(TAPE_SEGMENTS[0].time,TAPE_PREROLL_START);assert.equal(TAPE_SEGMENTS.at(-1).time+TAPE_SEGMENTS.at(-1).duration,113);
 for(let i=1;i<TAPE_SEGMENTS.length;i++)assert.equal(TAPE_SEGMENTS[i].time,TAPE_SEGMENTS[i-1].time+TAPE_SEGMENTS[i-1].duration);
 const cells=TAPE_SEGMENTS.filter(s=>s.loopCell!==undefined);assert.equal(cells.length,4);assert.deepEqual(cells.map(s=>s.time),[109,109.25,109.5,109.75]);assert.ok(cells.every(s=>s.offset===TAPE_SOURCE_PREFIX+2*TAPE_RATE&&s.duration===.25));assert.ok(TAPE_SEGMENTS.some(s=>s.time===110&&s.offset===TAPE_SOURCE_PREFIX+3*s.rate));
});

test('entry slowdown consumes its own rendered prefix and cannot rewind or retrigger at107.5',()=>{
 const entry=TAPE_SEGMENTS[0];assert.equal(entry.offset,0);assert.equal(entry.ramp.end,107);assert.ok(Math.abs(integratedTapeRead(entry,107)-TAPE_SOURCE_PREFIX)<1e-12);
 // This checks the actual BufferSource schedule, not just labels: one source
 // spans both sides of107.5, and no new source is started on that beat.
 assert.ok(entry.time<107&&entry.time+entry.duration>107.5);assert.ok(!TAPE_SEGMENTS.some(s=>s.time===107||s.time===107.5));
 const before=integratedTapeRead(entry,107.5-1e-6),after=integratedTapeRead(entry,107.5+1e-6);assert.ok(after>before);assert.ok(Math.abs(after-before-2e-6*TAPE_RATE)<1e-12);assert.ok(Math.abs(integratedTapeRead(entry,107.5)-(TAPE_SOURCE_PREFIX+.5*TAPE_RATE))<1e-12);
 assert.ok(Math.abs(entry.offset+integratedTapeRead(entry,109)-TAPE_SEGMENTS[1].offset)<1e-12);
});

test('24-bit encoder preserves signed stereo PCM samples and correct RIFF sizes',()=>{
 const channels=[new Float32Array([0,.5,-.5]),new Float32Array([1,-1,0])];const bytes=encodeWav24({length:3,numberOfChannels:2,sampleRate:48000,getChannelData:i=>channels[i]}),v=new DataView(bytes.buffer);assert.equal(bytes.length,62);assert.equal(v.getUint32(4,true),54);assert.equal(v.getUint32(40,true),18);assert.equal(v.getUint16(34,true),24);
 const signed24=at=>{let n=bytes[at]|bytes[at+1]<<8|bytes[at+2]<<16;return n&0x800000?n-0x1000000:n;};assert.equal(signed24(44),0);assert.equal(signed24(47),8388607);assert.equal(signed24(53),-8388607);assert.equal(signed24(56),-4194303);
});

const analysisFile=new URL('../exports/audio/analysis.json',import.meta.url);
const verificationFile=new URL('../exports/audio/wav-verification.json',import.meta.url);
test('saved rendered master keeps all twenty eras within the permitted level balance',{skip:!fs.existsSync(verificationFile)},()=>{
 const v=JSON.parse(fs.readFileSync(verificationFile,'utf8')),levels=v.scenes.map(s=>s.rms),ratio=Math.max(...levels)/Math.min(...levels);assert.ok(ratio<=2.2,`Era max/minRMS ${ratio} exceeds2.2`);assert.ok(v.peak>=.75&&v.peak<=.78);assert.equal(v.silence133to136_5Peak,0);const loudness=fs.readFileSync(new URL('../exports/audio/loudness.txt',import.meta.url),'utf8'),truePeak=loudness.match(/True peak:\s+Peak:\s+(-?[\d.]+)/);assert.ok(truePeak,'ffmpeg true-peak measurement is present');assert.ok(Number(truePeak[1])<=-1,`True peak ${truePeak[1]}dBFS exceeds-1`);
});
test('actual rendered master has the exact format, all eras, clean samples and deliberate pre-bell silence',{skip:!fs.existsSync(analysisFile)},()=>{
 const a=JSON.parse(fs.readFileSync(analysisFile,'utf8'));assert.equal(a.samplesPerChannel,6576000);assert.equal(a.duration,137);assert.equal(a.sampleRate,48000);assert.equal(a.channels,2);assert.equal(a.clippedSamples,0);assert.equal(a.nonFiniteSamples,0);assert.ok(a.peak>=.72&&a.peak<=.8);assert.equal(a.sceneRMS.length,20);assert.ok(a.sceneRMS.every(s=>s.rms>.005));assert.equal(a.silenceBeforeBell.peak,0);assert.ok(a.finalBell.peak>.1);assert.deepEqual(a.browserErrors,[]);assert.equal(a.tape.preroll.start,TAPE_PREROLL_START);assert.equal(a.tape.preroll.sourcePrefixSeconds,TAPE_SOURCE_PREFIX);assert.equal(a.tape.segments.length,6);assert.equal(a.tape.segments[0].time+a.tape.segments[0].duration,109);
});
