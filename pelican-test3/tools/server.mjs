import http from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function serve(port=4173){
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.wav':'audio/wav','.woff2':'font/woff2'};
 const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost'),relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  const info=await stat(file);if(!info.isFile())throw Error('file');
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
  let start=0,end=info.size-1,status=200;
  if(req.headers.range){
   const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}
   start=m[1]?Number(m[1]):Math.max(0,info.size-Number(m[2]));
   end=m[1]&&m[2]?Math.min(Number(m[2]),info.size-1):info.size-1;
   if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return}
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
  if(req.method==='HEAD'||!info.size){res.end();return}
  const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 }catch{if(!res.headersSent)res.writeHead(404);res.end('Not found')}});
 await new Promise((resolve,reject)=>{server.on('error',reject);server.listen(port,'127.0.0.1',resolve)});return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){await serve(Number(process.env.PORT)||4173);console.log('Preview: http://127.0.0.1:4173');}
