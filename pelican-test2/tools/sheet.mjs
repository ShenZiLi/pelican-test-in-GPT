import path from 'node:path';
import {readdir,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
import {parseArgs,readJSON,frameName,isMain,runCLI} from './common.mjs';

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function sampleIndices(count,limit) {
  if(count<=limit)return Array.from({length:count},(_,i)=>i);
  return Array.from({length:limit},(_,i)=>Math.round(i*(count-1)/(limit-1)));
}

export async function contactSheet(options={}) {
  if(!options.input||!options.out)throw new Error('Usage: node tools/sheet.mjs --input out/stills --out out/sheet.jpg [--columns 4 --limit 24]');
  const input=path.resolve(options.input),out=path.resolve(options.out);
  const columns=Number(options.columns??4),limit=Number(options.limit??24);
  if(!Number.isInteger(columns)||columns<1||columns>10||!Number.isInteger(limit)||limit<2||limit>120)throw new Error('Use columns 1–10 and limit 2–120');
  let frames=[],manifest;
  try{manifest=await readJSON(path.join(input,'manifest.json'));}catch(error){if(error.code!=='ENOENT')throw error;}
  if(manifest) {
    const {count,fps,firstTime=manifest.config.from}=manifest.config;
    frames=sampleIndices(count,limit).map(index=>({file:frameName(index),time:firstTime+index/fps,caption:`Frame ${index}`}));
  }else{
    let shots;
    try{shots=await readJSON(path.join(input,'shots.json'));}catch(error){if(error.code!=='ENOENT')throw error;}
    if(shots)frames=shots.captures.map(frame=>({file:path.basename(frame.file),time:frame.time,caption:frame.sceneName||frame.kind||''}));
    else frames=(await readdir(input)).filter(name=>/\.(png|jpe?g|webp)$/i.test(name)&&path.resolve(input,name)!==out&&!/sheet|contact/i.test(name)).sort().map(file=>({file,time:Number(/-t([\d.]+)\.png$/.exec(file)?.[1]),caption:file}));
    frames=sampleIndices(frames.length,limit).map(index=>frames[index]);
  }
  if(!frames.length)throw new Error('No capture images found');
  const tileWidth=480,imageHeight=270,captionHeight=58,gap=16,header=66;
  const usedColumns=Math.min(columns,frames.length),rows=Math.ceil(frames.length/usedColumns);
  const width=usedColumns*tileWidth+(usedColumns+1)*gap,height=header+rows*(imageHeight+captionHeight+gap)+gap;
  const title=options.title||`Pelican · ${manifest?'indexed film samples':'capture review'} · ${frames.length} images`;
  const layers=[{input:Buffer.from(`<svg width="${width}" height="${header}"><text x="${gap}" y="40" font-family="Arial,sans-serif" font-size="25" fill="#f0ead9">${escape(title)}</text></svg>`),left:0,top:0}];
  for(let i=0;i<frames.length;i++) {
    const frame=frames[i],left=gap+(i%usedColumns)*(tileWidth+gap),top=header+Math.floor(i/usedColumns)*(imageHeight+captionHeight+gap);
    const thumb=await sharp(path.join(input,frame.file)).resize(tileWidth,imageHeight,{fit:'contain',background:'#ede8da'}).png().toBuffer();
    layers.push({input:thumb,left,top});
    const timestamp=Number.isFinite(frame.time)?`${frame.time.toFixed(3)} s`:'Capture';
    const caption=String(frame.caption).slice(0,64);
    const label=Buffer.from(`<svg width="${tileWidth}" height="${captionHeight}"><rect width="100%" height="100%" fill="#343a34"/><text x="12" y="23" font-family="Arial,sans-serif" font-size="19" fill="#fff6df">${escape(timestamp)}</text><text x="12" y="46" font-family="Arial,'Noto Serif SC',sans-serif" font-size="16" fill="#d1d3c8">${escape(caption)}</text></svg>`);
    layers.push({input:label,left,top:top+imageHeight});
  }
  await mkdir(path.dirname(out),{recursive:true});
  await sharp({create:{width,height,channels:3,background:'#202720'}}).composite(layers).toFile(out);
  console.log(`Contact sheet: ${out} (${width}×${height})`);
  return {out,width,height,count:frames.length};
}

if(isMain(import.meta.url))runCLI(()=>contactSheet(parseArgs()));
