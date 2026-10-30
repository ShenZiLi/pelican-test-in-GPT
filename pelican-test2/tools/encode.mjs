import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {access,mkdir,rename,stat} from 'node:fs/promises';
import {parseArgs,readJSON,writeJSON,frameName,isMain,runCLI} from './common.mjs';

async function run(command,args,{capture=false}={}) {
  return new Promise((resolve,reject)=>{
    let output='';
    const child=spawn(command,args,{windowsHide:true,stdio:capture?['ignore','pipe','pipe']:['ignore','inherit','inherit']});
    if(capture){child.stdout.on('data',data=>output+=data);child.stderr.on('data',data=>output+=data);}
    child.on('error',reject);
    child.on('exit',code=>code===0?resolve(output):reject(new Error(`${command} exited ${code}${capture?`: ${output}`:''}`)));
  });
}

export async function encode(options={}) {
  if(!options.input||!options.out)throw new Error('Usage: node tools/encode.mjs --input out/frames --out out/film.mp4 [--overwrite]');
  const input=path.resolve(options.input),out=path.resolve(options.out);
  if(path.extname(out).toLowerCase()!=='.mp4')throw new Error('Output must end in .mp4');
  const manifest=await readJSON(path.join(input,'manifest.json'));
  const {count,fps,width,height}=manifest.config;
  if(manifest.status!=='complete'||manifest.completedCount!==count||!Number.isInteger(count)||count<1||!Number.isFinite(fps)||fps<=0)throw new Error('Input render manifest is not complete');
  if(width%2||height%2)throw new Error('H264 yuv420p requires even dimensions');
  for(let index=0;index<count;index++)if(!(await stat(path.join(input,frameName(index)))).size)throw new Error(`Empty frame ${index}`);
  try{await access(out);if(!options.overwrite)throw new Error('Output exists. Pass --overwrite for this explicit target.');}catch(error){if(error.code!=='ENOENT')throw error;}
  await mkdir(path.dirname(out),{recursive:true});
  // Encode beside the final path, so a failed encode never replaces a usable MP4.
  const temporary=path.join(path.dirname(out),`.${path.basename(out,'.mp4')}.partial-${randomUUID()}.mp4`);
  await run(process.env.FFMPEG_PATH||'ffmpeg',['-hide_banner','-loglevel','warning','-n','-framerate',String(fps),'-start_number','0','-i',path.join(input,'frame-%06d.png'),'-frames:v',String(count),'-c:v','libx264','-preset',String(options.preset||'fast'),'-crf',String(options.crf??18),'-pix_fmt','yuv420p','-an','-movflags','+faststart',temporary]);
  const raw=await run(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-show_streams','-show_format','-of','json',temporary],{capture:true});
  const probe=JSON.parse(raw),video=probe.streams.find(stream=>stream.codec_type==='video');
  if(probe.streams.some(stream=>stream.codec_type==='audio')||video?.codec_name!=='h264'||video?.pix_fmt!=='yuv420p'||Number(video.width)!==width||Number(video.height)!==height||Number(video.nb_frames)!==count)throw new Error(`Encoded output failed stream/frame/silence verification; preserved ${temporary}`);
  await rename(temporary,out);
  await writeJSON(`${out}.json`,{input,out,silent:true,frameCount:count,fps,expectedDuration:count/fps,renderSource:manifest.source,probe});
  console.log(`Verified silent H264: ${out} (${count} frames, ${(count/fps).toFixed(3)}s)`);
  return probe;
}

if(isMain(import.meta.url))runCLI(()=>encode(parseArgs()));
