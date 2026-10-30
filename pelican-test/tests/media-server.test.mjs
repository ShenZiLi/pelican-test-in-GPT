import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {serve} from '../tools/serve.mjs';
test('local playback serves correct byte ranges so MP4 seeking does not reset to zero',async()=>{
 const s=await serve();try{
  const bytes=await fs.readFile('package.json');
  const part=await fetch(s.url+'/package.json',{headers:{Range:'bytes=5-19'}});
  assert.equal(part.status,206);assert.equal(part.headers.get('content-range'),`bytes 5-19/${bytes.length}`);
  assert.deepEqual(Buffer.from(await part.arrayBuffer()),bytes.subarray(5,20));
  const suffix=await fetch(s.url+'/package.json',{headers:{Range:'bytes=-7'}});
  assert.deepEqual(Buffer.from(await suffix.arrayBuffer()),bytes.subarray(-7));
  const invalid=await fetch(s.url+'/package.json',{headers:{Range:'bytes=999999-'}});assert.equal(invalid.status,416);
 }finally{await new Promise(r=>s.server.close(r));}
});
