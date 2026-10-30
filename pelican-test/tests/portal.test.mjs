import test from 'node:test';import assert from 'node:assert/strict';
import {portalSeam} from '../src/main/portal.js';
test('all twenty scene endpoints share one world position at the next downbeat',()=>{
 for(let i=0;i<20;i++){const s=portalSeam(i);assert.equal(s.outgoing,s.incoming);assert.equal(s.time,11+i*6);}
});
