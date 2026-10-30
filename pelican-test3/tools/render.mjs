import {mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import {serve,root} from './server.mjs';
import {browser,pageAt} from './browser.mjs';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all)=>v.startsWith('--')?[...a,[v.slice(2),all[i+1]]]:a,[]));
const fps=Number(args.fps)||30,width=Number(args.width)||1920,start=Number(args.from)||0,end=Number(args.to)||137,workers=Number(args.workers)||3,name=args.name||'picture',port=Number(args.port)||4180;
const dir=path.join(root,'out',name);await mkdir(dir,{recursive:true});const server=await serve(port),b=await browser();
const total=Math.round((end-start)*fps),chunk=Math.ceil(total/workers);let done=0;
try{await Promise.all(Array.from({length:workers},async(_,j)=>{const first=j*chunk,last=Math.min(total,first+chunk);if(first>=last)return;const p=await pageAt(b,port,width);const file=path.join(dir,`part-${j}.mp4`);const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','2',file],{windowsHide:true,stdio:['pipe','ignore','pipe']});let errors='';ff.stderr.on('data',d=>errors+=d);const closed=once(ff,'close');ff.stdin.on('error',()=>{});
for(let i=first;i<last;i++){const jpg=await p.evaluate(t=>{window.film.renderAt(t);return window.film.canvas().toDataURL('image/jpeg',.94).split(',')[1]},start+i/fps);if(!ff.stdin.write(Buffer.from(jpg,'base64')))await once(ff.stdin,'drain');done++;if(done%150===0)console.log(`${name}: ${done}/${total} frames`)}ff.stdin.end();const [code]=await closed;if(code!==0)throw Error(errors);await p.close();}));
const list=Array.from({length:Math.min(workers,Math.ceil(total/chunk))},(_,i)=>`file 'part-${i}.mp4'`).join('\n');await writeFile(path.join(dir,'concat.txt'),list);const out=path.join(root,'out',`${name}.mp4`);const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',path.join(dir,'concat.txt'),'-c','copy','-movflags','+faststart',out],{windowsHide:true,stdio:'inherit'});const [code]=await once(ff,'close');if(code!==0)throw Error('Concat failed');console.log(out);
}finally{await b.close();server.close()}
