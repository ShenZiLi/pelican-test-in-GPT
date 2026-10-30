import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import puppeteer from 'puppeteer';import sharp from 'sharp';import {serve} from './serve.mjs';
const out='exports/revision-v2/playback';await fs.mkdir(out,{recursive:true});
await fs.writeFile(path.join(out,'player.html'),'<html lang="zh-CN"><meta charset="utf-8"><title>鹈鹕测试 V2 · 成片播放</title><body style="margin:0;background:#eeece3"><video id="movie" width="1920" height="840" preload="auto" controls src="../../delivery/The_Pelican_Test_Gallery_v2_1920x840.mp4" style="width:100vw;height:100vh;object-fit:contain"></video></body></html>');
const s=await serve();const browser=await puppeteer.launch({headless:'shell',args:['--autoplay-policy=no-user-gesture-required','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage();await page.setViewport({width:1920,height:840});
 await page.goto(`${s.url}/${out}/player.html`,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{timeout:30000});
 await page.evaluate(async()=>{
  const v=document.querySelector('video'),ctx=new AudioContext();await ctx.resume();const analyser=ctx.createAnalyser();analyser.fftSize=1024;
  ctx.createMediaElementSource(v).connect(analyser);analyser.connect(ctx.destination);
  const r=window.playback={started:performance.now(),events:[],audio:[],frames:0,shots:[],ended:false};
  for(const event of ['playing','waiting','stalled','error','ended'])v.addEventListener(event,()=>r.events.push({event,time:v.currentTime,error:v.error?.message}));
  const targets=[2,4,...Array.from({length:20},(_,i)=>7.5+i*6),88.8,89,91.25,91.5,97.5,127.5,134,136.6].sort((a,b)=>a-b);
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=840;const c=canvas.getContext('2d');let next=0;
  const frame=(_,metadata)=>{r.frames++;while(next<targets.length&&metadata.mediaTime>=targets[next]){c.drawImage(v,0,0);r.shots.push({target:targets[next],time:metadata.mediaTime,jpeg:canvas.toDataURL('image/jpeg',.9)});next++;}if(!v.ended)v.requestVideoFrameCallback(frame);};v.requestVideoFrameCallback(frame);
  const samples=new Float32Array(analyser.fftSize);const timer=setInterval(()=>{analyser.getFloatTimeDomainData(samples);let sum=0;for(const x of samples)sum+=x*x;r.audio.push({time:v.currentTime,rms:Math.sqrt(sum/samples.length)});},125);
  v.addEventListener('ended',()=>{clearInterval(timer);r.ended=true;r.elapsedSeconds=(performance.now()-r.started)/1000;r.quality=v.getVideoPlaybackQuality();r.duration=v.duration;r.currentTime=v.currentTime;ctx.close();});
  await v.play();
 });
 console.log('Started actual 1x playback of the complete 137-second V2 MP4.');
 await page.waitForFunction(()=>window.playback.ended,{timeout:180000,polling:500});
 const result=await page.evaluate(()=>window.playback),layers=[];
 for(let i=0;i<result.shots.length;i++){const shot=result.shots[i],bytes=Buffer.from(shot.jpeg.split(',')[1],'base64');await fs.writeFile(path.join(out,`frame-${shot.target}.jpg`),bytes);layers.push({input:await sharp(bytes).resize(480,210).toBuffer(),left:i%4*480,top:Math.floor(i/4)*210});delete shot.jpeg;}
 await sharp({create:{width:1920,height:Math.ceil(layers.length/4)*210,channels:3,background:'#eeece3'}}).composite(layers).png().toFile(path.join(out,'playback-contact.png'));
 await fs.writeFile(path.join(out,'report.json'),JSON.stringify(result,null,2));
 assert.equal(result.ended,true);assert.equal(result.currentTime,137);assert.ok(result.elapsedSeconds>=130&&result.elapsedSeconds<175);
 assert.ok(!result.events.some(e=>e.event==='error'));assert.ok(result.audio.some(e=>e.rms>.005),'No decoded audio signal');
 assert.equal(result.shots.length,30);console.log(JSON.stringify({ended:true,duration:result.duration,elapsedSeconds:result.elapsedSeconds,framesObserved:result.frames,quality:result.quality,snapshots:result.shots.length,audioSignal:true},null,2));
}finally{await browser.close();s.server.close();}
