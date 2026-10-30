export const DURATION = 137;
export const BPM = 120;
const entries = [
  ['sahara','撒哈拉岩画','Saharan Rock Art','约前4000','#c69b69'],
  ['egypt','埃及壁画','Egyptian Wall Painting','约前1300','#d6bd83'],
  ['han','汉画像石拓片','Han Stone Rubbing','约100','#343630'],
  ['tang','唐代白描','Tang Line Drawing','约750','#e5dfcb'],
  ['song','宋代山水','Song Landscape','约1000','#d6d5c4'],
  ['riverside','清明上河图','Riverside Bridge','约1100','#d8ccac'],
  ['maya','玛雅抄本','Maya Codex','约1200','#d7be8f'],
  ['mughal','莫卧儿细密画','Mughal Miniature','约1600','#9ba382'],
  ['bada','八大山人写意','Bada Shanren Ink','约1690','#e8e4d6'],
  ['wayang','爪哇皮影戏','Wayang Kulit','约1800','#ba8c47'],
  ['ukiyo','东海道浮世绘','Tōkaidō Ukiyo-e','1830年代','#b8c8c8'],
  ['starry','星月夜','Starry Night','1889','#18385e'],
  ['scream','呐喊','The Scream','1893','#b56747'],
  ['shadow','默片阴影','Silent-film Shadow','1922','#76766c'],
  ['scope','示波器','Oscilloscope','1950年代','#0a251c'],
  ['pixel','八位游戏','8-bit Game','1980年代','#192a52'],
  ['chat','早期聊天','Early Chat','2000年代','#9bb4c3'],
  ['vapor','蒸汽波','Vaporwave','2010年代','#b17fa8'],
  ['short','竖屏短视频','Vertical Short','2020年代','#1c222c'],
  ['code','代码美学','Code Aesthetics','2020年代','#16232b'],
];
export const SCENES = entries.map(([key,zh,en,era,color],i)=>Object.freeze({id:i+1,key,zh,en,era,color,start:5+6*i,end:11+6*i}));
export const clamp = (n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth = n=>{n=clamp(n);return n*n*(3-2*n);};
export const lerp = (a,b,t)=>a+(b-a)*t;
export function locate(t) {
  t=clamp(t,0,DURATION);
  if(t<5)return {kind:'intro',local:t};
  if(t>=125)return {kind:'outro',local:t-125};
  const scene=SCENES[Math.min(19,Math.floor((t-5)/6))];
  return {kind:'scene',scene,local:t-scene.start};
}
export const downbeat=t=>Math.abs(((t-1)*2)%4)<1e-8;
export const pedalAngle=t=>t*Math.PI*2;
export const frameTimes=(from,to,fps)=>Array.from({length:Math.round((to-from)*fps)},(_,i)=>from+i/fps);
export const faultAmount=t=>{const q=t-2;return q>=0&&q<0.5?Math.sin(Math.PI*q/0.5):0;};
