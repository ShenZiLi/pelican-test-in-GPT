export class Soundtrack {
  context=null;buffer=null;source=null;analyser=null;origin=0;offset=0;enabled=false;
  async load(){if(this.buffer)return;if(!this.context)this.context=new AudioContext({sampleRate:48000});await this.context.resume();const response=await fetch('/exports/audio/pelican-score.wav');if(!response.ok)throw Error('配乐尚未就绪');this.buffer=await this.context.decodeAudioData(await response.arrayBuffer());this.analyser=this.context.createAnalyser();this.analyser.fftSize=2048;this.analyser.connect(this.context.destination);}
  start(offset){this.stop();if(!this.enabled||!this.buffer||offset>=137)return;this.offset=offset;this.origin=this.context.currentTime;const source=this.context.createBufferSource();source.buffer=this.buffer;source.connect(this.analyser);source.start(this.origin,offset);this.source=source;}
  stop(){if(this.source){this.offset=this.time;this.source.stop();this.source.disconnect();this.source=null;}}
  get time(){return this.source?this.offset+this.context.currentTime-this.origin:this.offset;}
  stats(){if(!this.analyser)return {loaded:false,enabled:this.enabled,rms:0};const data=new Float32Array(this.analyser.fftSize);this.analyser.getFloatTimeDomainData(data);let sum=0;for(const x of data)sum+=x*x;return {loaded:!!this.buffer,enabled:this.enabled,running:!!this.source,contextState:this.context.state,time:this.time,duration:this.buffer?.duration,rms:Math.sqrt(sum/data.length)};}
}
