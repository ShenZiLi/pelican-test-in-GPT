import http from 'node:http';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {stat,realpath} from 'node:fs/promises';
import {ROOT,isMain,parseArgs,runCLI} from './common.mjs';

const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4','.ico':'image/x-icon'};

export async function startServer({port=0}={}) {
  port=Number(port);
  if(!Number.isInteger(port)||port<0||port>65535)throw new Error('Invalid server port');
  const root=await realpath(ROOT);
  const server=http.createServer(async(req,res)=>{
    try {
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
      const pathname=decodeURIComponent((req.url||'/').split('?')[0]);
      const parts=pathname.replaceAll('\\','/').split('/');
      if(parts.some(part=>part==='..'||part.startsWith('.'))||pathname.includes('\0')){res.writeHead(403);res.end('Forbidden');return;}
      let file=path.resolve(root,`.${pathname==='/'?'/index.html':pathname}`);
      if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
      file=await realpath(file);
      if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
      const info=await stat(file);
      if(!info.isFile()){res.writeHead(404);res.end('Not found');return;}
      const headers={'Content-Type':TYPES[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
      let start=0,end=info.size-1,status=200;
      if(req.headers.range) {
        const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if(range&&(range[1]||range[2])) {
          start=range[1]?Number(range[1]):Math.max(0,info.size-Number(range[2]));
          end=range[1]?(range[2]?Math.min(Number(range[2]),info.size-1):info.size-1):info.size-1;
        }else start=-1;
        if(start<0||start>=info.size||end<start){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
        status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;headers['Content-Length']=end-start+1;
      }
      res.writeHead(status,headers);
      if(req.method==='HEAD'||info.size===0)res.end();
      else createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
    }catch(error){res.writeHead(error.code==='ENOENT'||error.code==='ENOTDIR'?404:400);res.end('Not found');}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  return {server,url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeIdleConnections();})};
}

if(isMain(import.meta.url))runCLI(async()=>{
  const options=parseArgs();
  const site=await startServer({port:options.port??4173});
  console.log(`Film preview: ${site.url}`);
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{site.close().then(()=>process.exit(0));});
});
