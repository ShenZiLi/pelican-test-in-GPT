// Run from the repository root after npm ci in all three projects.
// Documentation images only; screenshots come from the published source.
import {serve as serve1} from '../pelican-test/tools/serve.mjs';
import {startServer as serve2} from '../pelican-test2/tools/serve.mjs';
import {serve as serve3} from '../pelican-test3/tools/server.mjs';
import {launchChrome} from '../pelican-test2/tools/browser.mjs';
import sharp from '../pelican-test/node_modules/sharp/lib/index.js';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('docs/images',{recursive:true});
const sites=[await serve1(),await serve2(),await serve3(4197)];
const browser=await launchChrome({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-accelerated-2d-canvas','--autoplay-policy=no-user-gesture-required']});
const manifest=[];
const samples=[['crossing',10.9],['landscape',32],['vaporwave',110]];
try{
 for(let i=0;i<3;i++){
  const height=i===0?840:1080;
  const page=await browser.newPage();await page.setViewport({width:1920,height,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=i===0?`${sites[0].url}/?render=1&stage=art`:i===1?`${sites[1].url}/?capture=1&width=1920&height=1080`:'http://127.0.0.1:4197/?export&width=1920';
  await page.goto(url,{waitUntil:'networkidle0',timeout:120000});
  await page.waitForFunction(()=>window.film?.ready,{timeout:120000});
  await page.evaluate(async()=>{await window.film.ready;await document.fonts.ready;});
  for(const [scene,time]of samples){
   await page.evaluate(async t=>{await window.film.renderAt(t)},time);
   const shot=i===1?await(await page.$('#film-stage')).screenshot():await page.screenshot();
   const file=`docs/images/${i+1}-${scene}.jpg`;
   // Letterbox instead of stretching: preserve the first project's wide output.
   await sharp(shot).resize(960,540,{fit:'contain',background:'#eeece5'}).jpeg({quality:86}).toFile(file);
   manifest.push({project:['pelican-test','pelican-test2','pelican-test3'][i],scene,time,file,nativeViewport:[1920,height]});
  }
  if(errors.length)throw Error(errors.join('\n'));await page.close();
 }
 await writeFile('docs/images/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 console.log('Captured nine source-based comparison screenshots without browser errors.');
}finally{await browser.close();for(const site of sites){if(site.close)await site.close();else (site.server||site).close();}}
