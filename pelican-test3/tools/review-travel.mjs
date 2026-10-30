import {browser,pageAt} from './browser.mjs';
import {serve} from './server.mjs';
const server=await serve(4195),b=await browser();try{const p=await pageAt(b,4195,1920);for(const t of [9,10.9,11.1,14,116,123.9]){await p.evaluate(t=>film.renderAt(t),t);await p.screenshot({path:`out/review/travel-${t}.png`})}}finally{await b.close();server.close()}
