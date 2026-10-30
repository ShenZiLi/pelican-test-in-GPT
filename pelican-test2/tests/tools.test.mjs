import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { framePlan, dimensions, parseArgs } from '../tools/common.mjs';
import { startServer } from '../tools/serve.mjs';
import { completedRanges,assertResumeMatches } from '../tools/render.mjs';
import { sampleIndices } from '../tools/sheet.mjs';

test('frame ranges are half open, relative indexed and reject ambiguous inputs', () => {
  assert.deepEqual(framePlan({from:8,to:14,fps:30}), {from:8,to:14,fps:30,count:180});
  assert.equal(framePlan({from:0,to:137,fps:30}).count,4110);
  assert.equal(framePlan({from:8,to:14,fps:60}).count,360);
  assert.equal(framePlan({from:0.01,to:0.1,fps:30}).count,2);
  for(const options of [{from:-1,to:2,fps:30},{from:2,to:2,fps:30},{from:0,to:138,fps:30},{from:0,to:1,fps:0},{from:NaN,to:1,fps:30}]) {
    assert.throws(()=>framePlan(options));
  }
});

test('capture dimensions enforce exact 16:9 and usable positive integers', () => {
  assert.deepEqual(dimensions({width:960,height:540}), {width:960,height:540});
  for(const value of [{width:0,height:0},{width:1920,height:720},{width:Infinity,height:540}]) assert.throws(()=>dimensions(value));
  assert.deepEqual(parseArgs(['--from','8','--resume','--width=960']),{from:'8',resume:true,width:'960'});
  assert.throws(()=>parseArgs(['--from','8','unexpected']));
});

test('render recovery preserves sparse progress and refuses changed source/config/browser',()=>{
  assert.deepEqual(completedRanges(new Set([9,0,2,1,7,8])),[[0,3],[7,10]]);
  const current={config:{fps:30,width:960},source:{sourceCommit:'abc',dirtySourceHash:'xyz'},browser:'Chrome/156'};
  assert.doesNotThrow(()=>assertResumeMatches(structuredClone(current),current));
  for(const changed of [{...current,config:{fps:60,width:960}},{...current,source:{sourceCommit:'abc',dirtySourceHash:'changed'}},{...current,browser:'Chrome/157'}])assert.throws(()=>assertResumeMatches(current,changed),/Cannot resume/);
  assert.deepEqual(sampleIndices(4110,3),[0,2055,4109]);
  assert.deepEqual(sampleIndices(2,24),[0,1]);
});

test('static server serves modules, HEAD and rejects traversal and private paths', async () => {
  const site=await startServer();
  try {
    const response=await fetch(`${site.url}/package.json`);
    assert.equal(response.status,200);
    assert.equal((await response.json()).name,'pelican-test2');
    assert.equal((await fetch(`${site.url}/package.json`,{method:'HEAD'})).status,200);
    const partial=await fetch(`${site.url}/package.json`,{headers:{Range:'bytes=0-9'}});
    assert.equal(partial.status,206);
    assert.equal((await partial.text()).length,10);
    assert.equal((await fetch(`${site.url}/package.json`,{headers:{Range:'bytes=999999-'}})).status,416);
    assert.equal((await fetch(`${site.url}/.git/config`)).status,403);
    assert.equal((await fetch(`${site.url}/does-not-exist`)).status,404);
    const status=await new Promise((resolve,reject)=>{
      http.get(`${site.url}/%252e%252e/x`,r=>{r.resume();resolve(r.statusCode);}).on('error',reject);
    });
    assert.equal(status,404);
    const traversal=await new Promise((resolve,reject)=>{
      const {hostname,port}=new URL(site.url);
      http.get({hostname,port,path:'/%2e%2e/secret.txt'},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);
    });
    assert.equal(traversal,403);
  } finally {await site.close();}
});
