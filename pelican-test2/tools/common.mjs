import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {readFile, readdir, mkdir, rename, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const isMain=url=>process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href===url;

export function parseArgs(argv=process.argv.slice(2)) {
  const result={};
  for(let i=0;i<argv.length;i++) {
    const match=/^--([a-z][\w-]*)(?:=(.*))?$/.exec(argv[i]);
    if(!match) throw new Error(`Expected --option, received ${argv[i]}`);
    const [,key,inline]=match;
    if(Object.hasOwn(result,key)) throw new Error(`Duplicate --${key}`);
    result[key]=inline??(argv[i+1]!==undefined&&!argv[i+1].startsWith('--')?argv[++i]:true);
  }
  return result;
}

export function dimensions({width=1920,height=1080}={}) {
  width=Number(width);height=Number(height);
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<=0||height<=0||width>7680||height>4320||width*9!==height*16) {
    throw new Error('Capture width and height must be positive integer 16:9 dimensions, at most 7680×4320');
  }
  return {width,height};
}

export function framePlan({from=0,to=137,fps=30}={}) {
  from=Number(from);to=Number(to);fps=Number(fps);
  if(![from,to,fps].every(Number.isFinite)||from<0||to>137||to<=from||fps<=0||fps>240) {
    throw new Error('Frame range requires 0 ≤ from < to ≤ 137 and 0 < fps ≤ 240');
  }
  const count=Math.ceil(to*fps-1e-9)-Math.ceil(from*fps-1e-9);
  return {from,to,fps,count};
}

export const frameName=index=>`frame-${String(index).padStart(6,'0')}.png`;

export async function writeJSON(file,data) {
  await mkdir(path.dirname(file),{recursive:true});
  const temporary=`${file}.tmp`;
  await writeFile(temporary,`${JSON.stringify(data,null,2)}\n`);
  await rename(temporary,file);
}

export async function readJSON(file) {return JSON.parse(await readFile(file,'utf8'));}

// Hash only renderer/tool inputs. Review notes and generated outputs do not alter pixels.
export async function provenance() {
  const files=[];
  async function walk(dir) {
    for(const entry of await readdir(path.join(ROOT,dir),{withFileTypes:true})) {
      const relative=path.posix.join(dir,entry.name);
      if(entry.isDirectory()) await walk(relative);
      else if(entry.isFile()) files.push(relative);
    }
  }
  for(const dir of ['src','tools','public','audio']) {try {await walk(dir);}catch(error){if(error.code!=='ENOENT')throw error;}}
  for(const file of ['index.html','styles.css','package.json','package-lock.json']) {
    try {await readFile(path.join(ROOT,file));files.push(file);}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  files.sort();
  const sourceHash=createHash('sha256');
  const dirtyHash=createHash('sha256');
  const git=args=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8',windowsHide:true}).trim();
  const sourceCommit=git(['rev-parse','HEAD']);
  const dirtyPaths=new Set([...git(['diff','--name-only','HEAD','--']).split('\n'),...git(['ls-files','--others','--exclude-standard']).split('\n')].map(v=>v.trim()));
  let dirty=false;
  for(const file of files) {
    const data=await readFile(path.join(ROOT,file));
    sourceHash.update(file).update('\0').update(data).update('\0');
    if(dirtyPaths.has(file)) {dirty=true;dirtyHash.update(file).update('\0').update(data).update('\0');}
  }
  for(const file of [...dirtyPaths].sort()) {
    if((['src/','tools/','public/','audio/'].some(dir=>file.startsWith(dir))||['index.html','styles.css','package.json','package-lock.json'].includes(file))&&!files.includes(file)) {
      dirty=true;dirtyHash.update(`deleted:${file}\0`);
    }
  }
  return {sourceCommit,sourceHash:sourceHash.digest('hex'),dirty,dirtySourceHash:dirty?dirtyHash.digest('hex'):null};
}

export function runCLI(fn) {
  fn().catch(error=>{console.error(error.stack||error.message);process.exitCode=1;});
}
