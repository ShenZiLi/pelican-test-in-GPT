import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import {spawn} from 'node:child_process';
import {SCENES} from '../src/beat/timeline.js';
const out='exports/delivery',movie=path.join(out,'The_Pelican_Test_1080p60.mp4'),picture='exports/gallery-final/gallery-final.mp4',wav='exports/audio/pelican-score.wav';
await fs.mkdir(out,{recursive:true});
async function run(command,args){return new Promise((resolve,reject)=>{const cp=spawn(command,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';cp.stdout.on('data',d=>stdout+=d);cp.stderr.on('data',d=>stderr=(stderr+d).slice(-24000));cp.on('error',reject);cp.on('exit',code=>code===0?resolve({stdout,stderr}):reject(Error(`${command} ${code}: ${stderr}`)));});}
if(!process.argv.includes('--review-only'))await run('ffmpeg',['-y','-i',picture,'-i',wav,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-t','137','-movflags','+faststart',movie]);
const probe=JSON.parse((await run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',movie])).stdout);
const v=probe.streams.filter(s=>s.codec_type==='video'),a=probe.streams.filter(s=>s.codec_type==='audio');
if(v.length!==1||a.length!==1||probe.streams.length!==2||v[0].width!==1920||v[0].height!==1080||v[0].codec_name!=='h264'||v[0].avg_frame_rate!=='60/1'||Number(v[0].nb_read_frames)!==8220||a[0].channels!==2||Math.abs(Number(probe.format.duration)-137)>.017)throw Error('Final media format/frame count verification failed');
const decode=await run('ffmpeg',['-v','error','-i',movie,'-f','null','-']);if(decode.stderr.trim())throw Error('Decode errors: '+decode.stderr);
const loud=await run('ffmpeg',['-hide_banner','-i',movie,'-af','ebur128=peak=true','-f','null','-']);await fs.writeFile(path.join(out,'encoded-audio-loudness.txt'),loud.stderr);
const peakMatch=loud.stderr.match(/True peak:[\s\S]*?Peak:\s+(-?[\d.]+) dBFS/);if(!peakMatch||Number(peakMatch[1])>-1)throw Error('Encoded true peak is not safely below -1 dBFS');
const events=[];function add(time,tag,scene=0){events.push({time,frame:Math.min(8219,Math.round(time*60)),tag,scene});}
for(const t of [.5,1.5,3,3.5,4.5])add(t,'intro');
for(const s of SCENES)for(const t of [.5,1.5,2,3,4.5,5.5])add(s.start+t,'scene',s.id);
for(let i=0;i<=20;i++)for(const delta of [-.2,0,.2])add(5+i*6+delta,'portal',i);
for(const t of [125.5,127,128,129,131,133,134,136.5,136.55,136.7,136.9,137-1/60])add(t,'outro');
const frames=[...new Set(events.map(e=>e.frame))].sort((a,b)=>a-b),dir=path.join(out,'review-frames');await fs.mkdir(dir,{recursive:true});
// A balanced expression avoids libavutil's recursion limit for long sums.
function sum(parts){if(parts.length===1)return parts[0];const n=Math.floor(parts.length/2);return `(${sum(parts.slice(0,n))}+${sum(parts.slice(n))})`;}
const select='select='+sum(frames.map(i=>`eq(n\\,${i})`));
await run('ffmpeg',['-y','-v','error','-i',movie,'-vf',select,'-fps_mode','vfr','-frames:v',String(frames.length),'-start_number','0',path.join(dir,'%03d.png')]);
const sharp=(await import('sharp')).default;
const index=new Map(frames.map((f,i)=>[f,i]));const tile=async(frame,width=640)=>sharp(path.join(dir,String(index.get(frame)).padStart(3,'0')+'.png')).resize(width,Math.round(width*9/16)).toBuffer();
const overview=[];
for(const s of SCENES){const shots=events.filter(e=>e.tag==='scene'&&e.scene===s.id);const layers=[];for(let i=0;i<shots.length;i++)layers.push({input:await tile(shots[i].frame),left:i%3*640,top:Math.floor(i/3)*360});await sharp({create:{width:1920,height:720,channels:3,background:'#e6e0d2'}}).composite(layers).png().toFile(path.join(out,`${String(s.id).padStart(2,'0')}-${s.key}-sheet.png`));overview.push({input:await tile(shots[3].frame,480),left:(s.id-1)%4*480,top:Math.floor((s.id-1)/4)*270});}
await sharp({create:{width:1920,height:1350,channels:3,background:'#e6e0d2'}}).composite(overview).png().toFile(path.join(out,'Twenty_Eras_Contact_Sheet.png'));
for(const [tag,list]of [['portals',events.filter(e=>e.tag==='portal')],['outro',events.filter(e=>e.tag==='outro')]]){const layers=[];for(let i=0;i<list.length;i++)layers.push({input:await tile(list[i].frame,480),left:i%4*480,top:Math.floor(i/4)*270});await sharp({create:{width:1920,height:Math.ceil(list.length/4)*270,channels:3,background:'#e6e0d2'}}).composite(layers).png().toFile(path.join(out,tag+'-sheet.png'));}
const report={movie:path.resolve(movie),sha256:crypto.createHash('sha256').update(await fs.readFile(movie)).digest('hex'),wavSha256:crypto.createHash('sha256').update(await fs.readFile(wav)).digest('hex'),bytes:(await fs.stat(movie)).size,duration:Number(probe.format.duration),fps:60,frames:8220,resolution:[1920,1080],video:v[0].codec_name,audio:a[0].codec_name,audioChannels:a[0].channels,encodedTruePeakDb:Number(peakMatch[1]),fullDecodeErrors:[],reviewFrames:frames.length,events,probe};await fs.writeFile(path.join(out,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({movie,frames:report.frames,duration:report.duration,reviewFrames:report.reviewFrames,bytes:report.bytes,encodedTruePeakDb:report.encodedTruePeakDb},null,2));
