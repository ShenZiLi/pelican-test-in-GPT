import path from 'node:path';
import os from 'node:os';
import {access,readdir} from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import {dimensions} from './common.mjs';
import {startServer} from './serve.mjs';

export async function chromePath() {
  if(process.env.CHROME_PATH) {await access(process.env.CHROME_PATH);return process.env.CHROME_PATH;}
  const cache=path.join(os.homedir(),'.cache','puppeteer','chrome');
  let entries=[];
  try {entries=await readdir(cache,{withFileTypes:true});}catch(error){if(error.code!=='ENOENT')throw error;}
  for(const entry of entries.filter(e=>e.isDirectory()).sort((a,b)=>b.name.localeCompare(a.name,undefined,{numeric:true}))) {
    for(const suffix of ['chrome-win64/chrome.exe','chrome-linux64/chrome','chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing','chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing']) {
      const candidate=path.join(cache,entry.name,suffix);
      try {await access(candidate);return candidate;}catch{}
    }
  }
  throw new Error('No cached Chrome found. Set CHROME_PATH to a local Chrome executable.');
}

export async function launchChrome(options={}) {
  return puppeteer.launch({executablePath:await chromePath(),headless:options.headless??true,timeout:60000,args:['--allow-file-access-from-files','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--autoplay-policy=no-user-gesture-required','--enable-webgl','--enable-unsafe-swiftshader'],...options});
}

export async function openFilm(options={}) {
  const {width,height}=dimensions(options);
  const site=options.url?null:await startServer();
  let browser;
  const errors=[];
  try {
    browser=await launchChrome({headless:options.headless??true});
    const page=await browser.newPage();
    await page.setViewport({width,height,deviceScaleFactor:1});
    page.on('pageerror',error=>errors.push(`Page: ${error.message}`));
    page.on('console',message=>{if(message.type()==='error'&&!message.location().url?.endsWith('/favicon.ico'))errors.push(`Console: ${message.text()}`);});
    page.on('requestfailed',request=>errors.push(`Asset: ${request.url()} ${request.failure()?.errorText}`));
    page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))errors.push(`HTTP ${response.status()}: ${response.url()}`);});
    const url=new URL(options.url||site.url);
    if(options.capture!==false){url.searchParams.set('capture','1');url.searchParams.set('width',width);url.searchParams.set('height',height);}
    const response=await page.goto(url.href,{waitUntil:'networkidle0',timeout:60000});
    if(!response?.ok())throw new Error(`Film page returned HTTP ${response?.status()}`);
    if(errors.length)throw new Error(errors.join('\n'));
    await page.waitForFunction(()=>Boolean(window.film?.ready),{timeout:60000});
    await page.evaluate(async()=>{
      await Promise.race([window.film.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Film readiness timed out')),60000))]);
      window.film.pause();await document.fonts.ready;
    });
    if(options.capture!==false) {
      const geometry=await page.evaluate(()=>{
        const canvas=document.querySelector('#film-canvas'),stage=document.querySelector('#film-stage')?.getBoundingClientRect();
        return {width:canvas?.width,height:canvas?.height,stageWidth:stage?.width,stageHeight:stage?.height,x:stage?.x,y:stage?.y};
      });
      if(geometry.width!==width||geometry.height!==height||geometry.stageWidth!==width||geometry.stageHeight!==height||geometry.x!==0||geometry.y!==0)throw new Error(`Capture stage does not match requested viewport: ${JSON.stringify(geometry)}`);
    }
    const assertClean=()=>{if(errors.length)throw new Error(errors.join('\n'));};
    assertClean();
    return {browser,page,url:url.href,errors,assertClean,close:async()=>{try{await browser.close();}finally{if(site)await site.close();}}};
  }catch(error){
    if(errors.length&&!errors.every(message=>error.message.includes(message)))error.message+=`\n${errors.join('\n')}`;
    if(browser)await browser.close();if(site)await site.close();throw error;
  }
}
