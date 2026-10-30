export const BPM=120, BEAT=.5, BAR=2, DURATION=137, INTRO=5, SCENE_DURATION=6;
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export function locate(t){t=clamp(t,0,DURATION);if(t<5)return{kind:'intro',index:-1,u:t};if(t>=125)return{kind:'outro',index:20,u:t-125};const index=Math.min(19,Math.floor((t-5)/6));return{kind:'scene',index,u:t-5-index*6};}
export const pedalPhase=t=>2*Math.PI*t;
export const isDownbeat=t=>Math.abs((t-1)/2-Math.round((t-1)/2))<1e-8;
export const sceneStart=i=>5+i*6;
export const quantize=(t,hz=10)=>Math.floor((t+1e-9)*hz)/hz;
