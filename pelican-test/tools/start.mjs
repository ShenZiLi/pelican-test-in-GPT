import {serve} from './serve.mjs';import {spawn} from 'node:child_process';
let service;
for(let port=4173;port<=4183;port++){try{service=await serve(port);break;}catch(error){if(error.code!=='EADDRINUSE')throw error;}}
if(!service)throw Error('Preview ports 4173–4183 are already in use.');
console.log(`鹈鹕测试 · 预览地址 ${service.url}\n关闭此窗口可停止预览。`);
const command=process.platform==='win32'?'rundll32.exe':process.platform==='darwin'?'open':'xdg-open';
const args=process.platform==='win32'?['url.dll,FileProtocolHandler',service.url]:[service.url];
const browser=spawn(command,args,{windowsHide:true,stdio:'ignore'});browser.on('error',()=>console.log(`请在浏览器中打开 ${service.url}`));
