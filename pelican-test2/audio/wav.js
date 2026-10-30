export function wavHeader(frames,rate=48000,channels=2) {
  const bytes=new Uint8Array(44),view=new DataView(bytes.buffer),text=(offset,value)=>{for(let i=0;i<value.length;i++)bytes[offset+i]=value.charCodeAt(i);};
  text(0,'RIFF');view.setUint32(4,36+frames*channels*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,rate,true);view.setUint32(28,rate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,frames*channels*2,true);return bytes;
}
export function pcmChunk(buffer,from,to) {
  const bytes=new Uint8Array((to-from)*buffer.numberOfChannels*2),view=new DataView(bytes.buffer);
  const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
  for(let i=from,j=0;i<to;i++)for(let ch=0;ch<channels.length;ch++,j+=2){const x=Math.max(-1,Math.min(1,channels[ch][i]));view.setInt16(j,Math.round(x*(x<0?32768:32767)),true);}
  return bytes;
}
export function base64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);}
export async function streamWav(buffer,sink,from=0,to=buffer.duration) {
  const start=Math.round(from*buffer.sampleRate),end=Math.min(buffer.length,Math.round(to*buffer.sampleRate));
  await sink(base64(wavHeader(end-start,buffer.sampleRate,buffer.numberOfChannels)));
  for(let i=start;i<end;i+=16384)await sink(base64(pcmChunk(buffer,i,Math.min(end,i+16384))));
  return{sampleFrames:end-start,sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,bytes:44+(end-start)*buffer.numberOfChannels*2};
}
