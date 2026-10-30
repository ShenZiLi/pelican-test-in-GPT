import {readFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {ROOT,writeJSON} from './common.mjs';
const selected = {
  'p5': 'license.txt',
  'p5.brush': 'LICENSE.md',
  '@fontsource/noto-serif-sc': 'LICENSE',
  'sharp': 'LICENSE',
  'simplex-noise': 'LICENSE',
};
const lock = JSON.parse(await readFile(path.join(ROOT,'package-lock.json'),'utf8'));
const packages = [];
for (const [location,entry] of Object.entries(lock.packages)) {
  if (!location) continue;
  let installed;
  try {installed=JSON.parse(await readFile(path.join(ROOT,location,'package.json'),'utf8'));}
  catch(error){if(error.code!=='ENOENT')throw error;}
  packages.push({location,name:installed?.name ?? location.split('node_modules/').at(-1),version:entry.version,license:installed?.license??entry.license??'see package notices',installed:!!installed,resolved:entry.resolved});
}
await mkdir(path.join(ROOT,'licenses'),{recursive:true});
for (const [name,file] of Object.entries(selected)) await copyFile(path.join(ROOT,'node_modules',name,file),path.join(ROOT,'licenses',`${name.replaceAll('/','-').replace('@','')}.txt`));
await writeJSON(path.join(ROOT,'licenses/dependencies.json'),{note:'Versions and licenses from the lockfile and installed package manifests; optional platform packages may be uninstalled. node_modules and native binaries are not redistributed in source Git.',packages});
console.log(`Recorded ${packages.length} locked packages and ${Object.keys(selected).length} license texts.`);
