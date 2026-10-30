import test from 'node:test';import assert from 'node:assert/strict';
import {pixelTravel,pixelWheelAngle} from '../src/scenes/16-pixel.js';
import {poseAt} from '../src/rig/pose.js';
test('pixel ground distance matches rolling wheels and joins the common boundary phase',()=>{const r=62*320/1778;for(let t=0;t<5.9;t+=.1){const d=pixelTravel(t+.1)-pixelTravel(t);assert.ok(Math.abs((pixelWheelAngle(t+.1)-pixelWheelAngle(t))*r-d)<1e-8);}assert.ok(Math.abs(pixelWheelAngle(0)-poseAt(95).wheelAngle)<1e-8);assert.ok(Math.abs(pixelWheelAngle(6)-poseAt(101).wheelAngle-2*Math.PI)<1e-8);const speed=(pixelTravel(.001)-pixelTravel(0))/.001;assert.ok(Math.abs(speed-105*320/1778)<1e-8);assert.ok(pixelTravel(3.1)-pixelTravel(1.9)>58);});
