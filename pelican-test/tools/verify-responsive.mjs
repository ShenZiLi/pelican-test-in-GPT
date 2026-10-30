import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import puppeteer from 'puppeteer';
import {serve,root} from './serve.mjs';

const output=path.join(root,'exports','responsive-verification');
await fs.mkdir(output,{recursive:true});
const server=await serve();
const browser=await puppeteer.launch({headless:'shell',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-accelerated-2d-canvas']});
const report=[];
try{
  const page=await browser.newPage();
  await page.setViewport({width:1455,height:538,deviceScaleFactor:2.34375});
  await page.goto(`${server.url}/?t=13`,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.film?.ready,{timeout:120000});
  for(const [width,height]of [[1455,538],[1920,840],[900,700],[600,900]]){
    await page.setViewport({width,height,deviceScaleFactor:2.34375});
    await page.waitForFunction(()=>{
      const s=document.querySelector('#screen').getBoundingClientRect();
      const c=document.querySelector('#screen canvas').getBoundingClientRect();
      const layer=[...document.querySelectorAll('canvas')].find(c=>c.style.display==='none');
      return Math.abs(c.width-s.width)<1&&Math.abs(c.height-s.height)<1&&layer&&Math.abs(layer.width/840-s.width/s.height)<.002;
    });
    for(const time of [2,13,132]){
      const data=await page.evaluate(async t=>{
        await window.film.renderAt(t);
        return {jpeg:window.film.frameJPEG(),screen:document.querySelector('#screen').getBoundingClientRect().toJSON(),canvas:document.querySelector('#screen canvas').getBoundingClientRect().toJSON(),scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight]};
      },time);
      const bytes=Buffer.from(data.jpeg.split(',')[1],'base64');
      const {width:pixelWidth,height:pixelHeight}=await sharp(bytes).metadata();
      assert.equal(pixelHeight,840,'The raw 2D film must use logical pixels, even on a high-density display');
      assert.ok(Math.abs(pixelWidth/840-data.screen.width/data.screen.height)<.002,`Film aspect must follow the available stage: ${width}×${height}, film ${pixelWidth}×${pixelHeight}, stage ${data.screen.width}×${data.screen.height}`);
      assert.ok(data.scroll[0]<=width&&data.scroll[1]<=height,'Player must stay inside the window');
      const {data:pixels,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
      const corner=((info.height-5)*info.width+info.width-5)*info.channels;
      assert.ok(pixels[corner]>180&&pixels[corner+1]>180&&pixels[corner+2]>170,'Paper must reach the lower right, without an undrawn quadrant');
      const stageShot=await page.screenshot({clip:{x:0,y:0,width:data.screen.width,height:data.screen.height}});
      const {data:stagePixels,info:stageInfo}=await sharp(stageShot).removeAlpha().raw().toBuffer({resolveWithObject:true});
      const topLeft=(5*stageInfo.width+5)*stageInfo.channels;
      assert.ok(stagePixels[topLeft]>180&&stagePixels[topLeft+1]>180&&stagePixels[topLeft+2]>170,`The displayed canvas must preserve the film projection after resize (${width}×${height}, t=${time})`);
      report.push({width,height,time,pixelWidth,pixelHeight,screen:data.screen});
    }
    await page.screenshot({path:path.join(output,`${width}x${height}.png`)});
  }
  await page.goto(`${server.url}/?render=1&t=13`,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.film?.ready,{timeout:120000});
  const exported=await page.evaluate(()=>window.film.exportAt(13));
  const metadata=await sharp(Buffer.from(exported.split(',')[1],'base64')).metadata();
  assert.deepEqual([metadata.width,metadata.height],[1920,840],'Movie export must retain its fixed output format');
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify({passed:true,cases:report,export:[metadata.width,metadata.height]},null,2));
  console.log(`Responsive preview passed ${report.length} high-density, resize, intro, gallery and outro checks; export remains 1920×840.`);
}finally{await browser.close();server.server.close();}
