import test from 'node:test';
import assert from 'node:assert/strict';
import {plateLeft,PLATE_WIDTH,PLATE_HEIGHT,PLATE_SCALE,SOURCE_LEFT,TOP,GAP,STRIDE,ANCHOR,visiblePlates} from '../src/main/travel.js';
import {W,H} from '../src/kit/index.js';
test('square gallery windows preserve scale and leave space for captions',()=>{assert.equal(PLATE_WIDTH,PLATE_HEIGHT);assert.equal(PLATE_SCALE*H,PLATE_HEIGHT);assert.equal(SOURCE_LEFT,(W-H)/2);assert.equal(ANCHOR,W/2);assert.ok(TOP+PLATE_HEIGHT+125<H);assert.ok(2*PLATE_WIDTH+GAP<W)});
test('plate borders cross the tracked rider on the shared beat',()=>{for(let i=0;i<20;i++)assert.equal(plateLeft(i,5+6*i),ANCHOR)});
test('the entire wall moves continuously and adjacent plates preserve spacing',()=>{for(let t=5;t<125;t+=.137){let x=plateLeft(7,t);assert.ok(Math.abs(plateLeft(8,t)-x-PLATE_WIDTH-GAP)<1e-8);assert.ok(Math.abs(plateLeft(7,t+1/60)-x+STRIDE/360)<1e-8)}});
test('neighbouring artwork is visible at a crossing',()=>{const at=visiblePlates(11);assert.ok(at.includes(0));assert.ok(at.includes(1))});
