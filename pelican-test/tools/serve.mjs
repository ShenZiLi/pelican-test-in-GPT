import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.wav':'audio/wav','.mp4':'video/mp4'};
export async function serve(port=0){
 const server=http.createServer((req,res)=>{
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  if(name==='/')name='/index.html';const file=path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
   const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
   let start=0,end=stat.size-1,status=200;
   if(req.headers.range){
    const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
    if(m[1]){start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;}
    else start=Math.max(0,stat.size-Number(m[2]));
    if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
   }
   headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
   if(req.method==='HEAD'||!stat.size){res.end();return;}
   const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  });
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});return {server,url:`http://127.0.0.1:${server.address().port}`};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const s=await serve(Number(process.env.PORT||4173));console.log(s.url);}
