import {spawn} from 'node:child_process';import{access,rename,mkdir}from'node:fs/promises';import path from'node:path';import{parseArgs,writeJSON}from'./common.mjs';
const options=parseArgs();if(!options.video||!options.audio||!options.out)throw new Error('Use --video silent.mp4 --audio score.wav --out final.mp4');
function run(command,args){return new Promise((resolve,reject)=>{let s='';const p=spawn(command,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});p.stdout.on('data',x=>s+=x);p.stderr.on('data',x=>s+=x);p.on('error',reject);p.on('exit',n=>n?reject(new Error(s)):resolve(s));});}
const out=path.resolve(options.out),temp=out+'.partial.mp4';await mkdir(path.dirname(out),{recursive:true});
try{await access(out);if(!options.overwrite)throw new Error('Output exists. Use --overwrite for this explicit target.');}catch(error){if(error.code!=='ENOENT')throw error;}
await run(process.env.FFMPEG_PATH||'ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.resolve(options.video),'-i',path.resolve(options.audio),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2','-t','137','-movflags','+faststart',temp]);
const probe=JSON.parse(await run(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-show_streams','-show_format','-of','json',temp]));
const v=probe.streams.find(x=>x.codec_type==='video'),a=probe.streams.find(x=>x.codec_type==='audio');
if(!v||!a||v.width!==1920||v.height!==1080||v.r_frame_rate!=='60/1'||Number(v.nb_frames)!==8220||a.sample_rate!=='48000'||a.channels!==2||Math.abs(Number(probe.format.duration)-137)>1/60)throw new Error('Final AV stream validation failed');
await rename(temp,out);await writeJSON(out+'.json',{probe,video:options.video,audio:options.audio});console.log('Verified137s1080p60 H264/AAC:',out);
