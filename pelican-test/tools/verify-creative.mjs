import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import sharp from 'sharp';
import {serve} from './serve.mjs';import {openFilm} from './browser.mjs';
import {SCENES} from '../src/beat/timeline.js';import {galleryState,frameRect} from '../src/main/gallery-layout.js';
const output='exports/revision-v2/creative-verification';await fs.mkdir(output,{recursive:true});
const s=await serve(),opened=await openFilm(s.url);const {browser,page,errors}=opened;
const rows=[],overview=[],hashes=new Map();
try{
 for(const scene of SCENES){const tiles=[];
  for(const [j,local]of [.5,1.75,2.5,3.5,4.5,5.5].entries()){
   const t=scene.start+local;await page.evaluate(t=>window.film.renderAt(t),t);
   const data=await page.evaluate(()=>window.film.frameJPEG());const bytes=Buffer.from(data.split(',')[1],'base64');
   hashes.set(t,crypto.createHash('sha256').update(bytes).digest('hex'));
   const box=frameRect(scene.id-1,galleryState(t).camera),left=Math.round(box.x);
   const file=`${String(scene.id).padStart(2,'0')}-${scene.key}-${local}.png`;
   await sharp(bytes).extract({left,top:50,width:600,height:600}).png().toFile(path.join(output,file));
   const tile=await sharp(path.join(output,file)).resize(300,300).png().toBuffer();
   const stamp=Buffer.from(`<svg width="300" height="32"><rect width="300" height="32" fill="#243c35"/><text x="12" y="23" font-family="Arial" font-size="17" fill="#f1e9d1">${String(scene.id).padStart(2,'0')} / ${t.toFixed(2)}s / local ${local.toFixed(2)}s</text></svg>`);
   tiles.push({input:tile,left:j%3*300,top:Math.floor(j/3)*332},{input:stamp,left:j%3*300,top:Math.floor(j/3)*332+300});
   if(j===2)overview.push({input:tile,left:(scene.id-1)%5*300,top:Math.floor((scene.id-1)/5)*332},{input:stamp,left:(scene.id-1)%5*300,top:Math.floor((scene.id-1)/5)*332+300});
   rows.push({id:scene.id,t,local,file});
  }
  await sharp({create:{width:900,height:664,channels:3,background:'#eee8d9'}}).composite(tiles).png().toFile(path.join(output,`${String(scene.id).padStart(2,'0')}-${scene.key}-sheet.png`));
 }
 for(const t of [122.5,37.5,31.5,115.5,7.5,55.5,91.5,103.5]){
  await page.evaluate(t=>window.film.renderAt(t),t);const data=await page.evaluate(()=>window.film.frameJPEG());
  assert.equal(crypto.createHash('sha256').update(Buffer.from(data.split(',')[1],'base64')).digest('hex'),hashes.get(t),`history-dependent frame ${t}`);
 }
 const media=await page.evaluate(async()=>{
  const {renderArtwork}=await import('/src/scenes/registry.js');
  const results=[];
  for(const [id,times]of [[15,[1.25,2.25,2.5,4.5]],[17,[1.25,2.25,3.5,4.5]],[19,[1.25,2.5,4.5]],[20,[1,2.5,3.55,4.3]]])for(const t of times){
   const make=subject=>{const a=document.createElement('canvas');a.width=a.height=1000;const c=a.getContext('2d',{willReadFrequently:true});renderArtwork(c,id,t,{subject});return c.getImageData(0,0,1000,1000).data;};
   const a=make(true),b=make(false);let changed=0,outside=0,bbox=[1000,1000,0,0];
   let sx=0,sy=0;if(id===17){const q=t-2;if(q>=0&&q<.72){sx=Math.exp(-q*4.7)*(Math.cos(q*42)*31+Math.sin(q*72)*14);sy=Math.exp(-q*4.7)*Math.sin(q*61+.8)*12;}}
   const inside=(x,y)=>id===15?Math.hypot(x-500,y-520)<=380:id===17?x>=128+sx&&x<=872+sx&&y>=407+sy&&y<=830+sy:id===19?x>=216.75&&x<=783.25&&y>=0&&y<=1000:x>=448&&x<=968&&y>=320&&y<=830;
   for(let y=0;y<1000;y++)for(let x=0;x<1000;x++){const i=(y*1000+x)*4;if(Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]))<20)continue;
    changed++;bbox=[Math.min(bbox[0],x),Math.min(bbox[1],y),Math.max(bbox[2],x),Math.max(bbox[3],y)];if(!inside(x,y))outside++;
   }
   results.push({id,t,changed,outside,bbox});
  }
  return results;
 });
 await sharp({create:{width:1500,height:1328,channels:3,background:'#eee8d9'}}).composite(overview).png().toFile(path.join(output,'overview.png'));
 const report={rows,media,errors,determinism:true,browser:await browser.version()};
 await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
 assert.equal(errors.length,0,errors.join('\n'));
 for(const item of media){assert.ok(item.changed>30,`Missing subject ${item.id} at${item.t}`);assert.equal(item.outside,0,`Media spill ${item.id} at${item.t}: ${item.outside} pixels`);}
 console.log(`20 scene sequences / ${rows.length} actual gallery keyframes; ${media.length} rendered containment cases; determinism passed.`);
}finally{await browser.close();s.server.close();}
