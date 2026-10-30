import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {serve,root} from './serve.mjs';
import {openFilm} from './browser.mjs';

// Runtime evidence for the gallery's independently composited backgrounds and
// subjects. Pixel checks test transparent layer contracts; contact sheets allow
// visual review of the stronger artistic claim that each background is empty.
const output=path.join(root,'exports','gallery-verification');
await fs.mkdir(output,{recursive:true});
const server=await serve();
let browser;
try {
  const opened=await openFilm(server.url);
  browser=opened.browser;
  const {page,errors}=opened;
  const evidence=await page.evaluate(async()=>{
    const {SCENES}=await import('/src/beat/timeline.js');
    const {renderScene,renderSubject}=await import('/src/scenes/registry.js');
    const {drawFilm}=await import('/src/main/film.js');
    const canvas=document.createElement('canvas');
    canvas.width=1778;canvas.height=1000;
    const c=canvas.getContext('2d',{willReadFrequently:true});
    const layers=[];
    const backgrounds=[];
    const reset=()=>{c.resetTransform();c.clearRect(0,0,1778,1000);c.translate(389,0);};
    for(const scene of SCENES){
      reset();
      renderSubject(c,scene.id,2.5,scene.start+2.5,{gallery:true});
      const pixels=c.getImageData(0,0,1778,1000).data;
      let occupied=0,minX=1778,minY=1000,maxX=-1,maxY=-1;
      for(let y=0;y<1000;y++)for(let x=0;x<1778;x++){
        if(pixels[(y*1778+x)*4+3]){
          occupied++;minX=Math.min(minX,x);minY=Math.min(minY,y);
          maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
        }
      }
      const alpha=(x,y)=>pixels[(y*1778+x)*4+3];
      layers.push({id:scene.id,key:scene.key,occupied,
        coverage:occupied/(1778*1000),bbox:[minX-389,minY,maxX-389,maxY],
        cornersTransparent:[[0,0],[1777,0],[0,999],[1777,999]].every(([x,y])=>alpha(x,y)===0)});
      const bg=document.createElement('canvas');bg.width=1000;bg.height=1000;
      const g=bg.getContext('2d');
      renderScene(g,scene.id,2.5,{gallery:true,subject:false});
      backgrounds.push({id:scene.id,png:bg.toDataURL('image/png')});
    }
    const skeleton=document.createElement('canvas');skeleton.width=1000;skeleton.height=1000;
    renderScene(skeleton.getContext('2d'),1,2.5,{skeleton:true,gallery:true,subject:false});
    backgrounds.push({id:'skeleton',png:skeleton.toDataURL('image/png')});
    const frame=document.createElement('canvas');frame.width=1920;frame.height=1080;
    const ctx=frame.getContext('2d',{willReadFrequently:true});
    const diagnostic=[];
    async function hashAt(t){
      drawFilm(ctx,t);
      if(t===8)diagnostic.push(frame.toDataURL('image/png'));
      const data=ctx.getImageData(0,0,1920,1080).data;
      const digest=await crypto.subtle.digest('SHA-256',data);
      return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
    }
    const times=[8,14,32,86.9,89,91.25,110,116,122.5,128,134,136.6];
    const sequential=[];
    for(const t of times)sequential.push({t,hash:await hashAt(t)});
    const order=[9,2,11,0,8,3,10,1,7,4,6,5];
    const shuffled=[];
    for(const i of order)shuffled.push({t:times[i],hash:await hashAt(times[i])});
    const boundaries=[];
    for(const t of [11-1/60,11,11+1/60,17-1/60,17,17+1/60,89-1/60,89,89+1/60]){
      boundaries.push({t,hash:await hashAt(t)});
    }
    return {layers,backgrounds,sequential,shuffled,boundaries,diagnostic};
  });
  for(const layer of evidence.layers){
    assert.ok(layer.occupied>100,`Scene ${layer.id}: missing subject pixels`);
    assert.ok(layer.coverage<.30,`Scene ${layer.id}: subject layer includes an opaque background`);
    assert.ok(layer.cornersTransparent,`Scene ${layer.id}: opaque full-plane subject corners`);
  }
  for(let i=0;i<evidence.diagnostic.length;i++)await fs.writeFile(path.join(output,`diagnostic-${i}.png`),Buffer.from(evidence.diagnostic[i].split(',')[1],'base64'));
  const expected=new Map(evidence.sequential.map(x=>[x.t,x.hash]));
  for(const item of evidence.shuffled)assert.equal(item.hash,expected.get(item.t),`History-dependent drawFilm at ${item.t}`);
  assert.equal(errors.length,0,errors.join('\n'));
  const tiles=[];
  for(let i=0;i<evidence.backgrounds.length;i++){
    const item=evidence.backgrounds[i],file=path.join(output,`background-${String(item.id).padStart(2,'0')}.png`);
    const bytes=Buffer.from(item.png.split(',')[1],'base64');
    await fs.writeFile(file,bytes);
    const input=await sharp(bytes).resize(300,300).toBuffer();
    tiles.push({input,left:(i%5)*300,top:Math.floor(i/5)*300});
  }
  await sharp({create:{width:1500,height:Math.ceil(tiles.length/5)*300,channels:3,background:'#eeece3'}})
    .composite(tiles).png().toFile(path.join(output,'backgrounds-contact-sheet.png'));
  const report={status:'passed',browser:await browser.version(),
    subjects:evidence.layers,determinism:{frames:evidence.sequential.length,shuffledOrder:evidence.shuffled.map(x=>x.t),hashes:evidence.sequential},
    boundaries:evidence.boundaries,errors,
    visualReview:'Background contact sheet requires visual review; pixel contracts do not certify artistic correctness.'};
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,subjects:report.subjects.length,deterministicFrames:report.determinism.frames,boundaryFrames:report.boundaries.length,errors,report:path.join(output,'report.json')},null,2));
} finally {
  if(browser)await browser.close();
  await new Promise(resolve=>server.server.close(resolve));
}
