import fs from 'node:fs/promises';import {spawnSync} from 'node:child_process';import {SCENES} from '../src/beat/timeline.js';
const a=JSON.parse(await fs.readFile('exports/delivery/acceptance.json','utf8'));
const g=JSON.parse(await fs.readFile('exports/gallery-verification/report.json','utf8'));
const v=JSON.parse(await fs.readFile('exports/audio/wav-verification.json','utf8'));
const runtime=JSON.parse(await fs.readFile('exports/delivery/runtime-playback.json','utf8'));
if(g.status!=='passed'||!runtime.movie.ended||runtime.movie.error||!runtime.preview.completed||a.fullDecodeErrors.length)throw Error('Playback/verification evidence is incomplete');
const ffmpeg=spawnSync('ffmpeg',['-version'],{encoding:'utf8'}).stdout;
await fs.writeFile('exports/delivery/ffmpeg-build.txt',ffmpeg);
const rows=SCENES.map(s=>`| ${String(s.id).padStart(2,'0')} | ${s.zh} | ${s.start}–${s.end}s | ${String(s.id).padStart(2,'0')}-${s.key}-sheet.png |`).join('\n');
const doc=`# 最终交付检查记录

2026-10-25，Asia/Shanghai。此记录为制作方的实际文件、画面和播放检查；艺术感受与最终审美由用户观看判断。

交付版本：多画幅展墙。通常同时看到三个画幅；浏览器宽屏展开更多相邻作品。一只骑手实际横向穿框，画框内改变笔法，空隙中保持连续骨骼；底部拖杆用于定位时间。旧满屏擦除版已由此版本替代。

## 成片与源码

- 成片：exports/delivery/The_Pelican_Test_1080p60.mp4
- 时长 ${a.duration}s；${a.resolution.join('×')}；${a.fps}fps；${a.frames}帧；H.264；AAC双声道。
- MP4 SHA256：${a.sha256}
- WAV SHA256：${v.sha256}
- 源码包：exports/delivery/Pelican_Test_Source.zip；含20场景、共用工具、骨骼、配乐、简报、许可、预生成WAV和Windows一键预览入口。不含依赖缓存、海量帧缓存或参考作品媒介。
- 固定1920×1080导出，浏览器按窗口宽高重新布局展墙。30/60fps平移对比样片均已实际播放；本片选择60fps以保持镜头追随和跨框轮廓平滑，复古段内部8–12Hz量化独立保留。

## 当前证据

- Node24与Node20各17项测试通过；20段各6秒、总时长137秒、120BPM、踏板1秒一圈、完整转动时腿长约束、画幅可见性及镜头连续性均有覆盖。
- Chrome实际验证20个局部透明角色层，背景接触表人工看图未见重复鹈鹕；骨架占位也可隐藏固定角色。
- ${g.determinism.frames}个时点顺序/乱序重绘逐像素一致；${g.boundaries.length}个边界帧无脚本错误。离线固定软件2D栅格化，避免Chrome读取画布时在GPU/CPU之间切换导致抗锯齿数值变化。
- 实际MP4全文件解码错误为0；ffprobe逐帧计数${a.frames}。实际解码提取${a.reviewFrames}张关键、边界和Outro帧，并复核接触表。
- 浏览器新版预览已从0连续播放至137秒。实际WebAudio加载137秒母带，播放时音频时钟驱动画面；中途读取有非零信号，结束后停止。
- 最终MP4用浏览器原生播放器从头连续播放至ended，媒体错误为空；实际播放尺寸${runtime.movie.width}×${runtime.movie.height}，时长${runtime.movie.duration}s。播放记录在runtime-playback.json。此项不冒称人耳试听评价。
- WAV逐样本：48kHz、24-bit双声道、每声道${v.frames}采样，削波${v.clippedFrames}帧，峰值${v.peak.toFixed(9)}；分段RMS最大/最小比${v.eraBalanceRatio.toFixed(6)}。AAC实测真峰值${a.encodedTruePeakDb}dBFS。
- 133–136.5秒母带峰值${v.silence133to136_5Peak}；最后半秒只留原创车铃，最终画面为空席。

## 结构与逐段画面

Intro为5秒，原文字幕与虚构出处保留；20个时代各6秒；Outro12秒，7×3墙前20幅各有该风格定格，第21格空席和虚构麦克风。129/131秒拍点闪光，133秒停镜字幕，136.5秒骑手经过并回到空席。

| 编号 | 时代 | 时间 | delivery逐段检查图 |
|---|---|---|---|
${rows}

关键点：埃及壁画定格、宋山水微小骑手与推近、玛雅计圈、八大白眼、皮影操纵杆、星轮旋涡、受惊路人、阴影通电、91–91.5秒示波器误触、97.5秒原创金币、聊天窗口抖动、109–110秒四次磁带跳针、竖屏界面、逐笔SVG均保留于多幅调度。

## 来源、工具与限制

参考阅读与许可核验见research-and-rights.md；五份参考仓库文档均已阅读。场景代码、美术简报、图形、纹理、旋律、界面和声音独立制作。参考视频仅用于理解多个画幅同时可见的呈现方式，未使用其角色、图像、源代码、音乐或具体笑点。

p5.js2.3.4、p5.brush2.2.3、Puppeteer24.43.1、NotoSerifSC5.3.1；独立许可见THIRD_PARTY_NOTICES.md和licenses。浏览器与ffmpeg为本地工具，不随源码包分发；实际ffmpeg构建记录在delivery/ffmpeg-build.txt。

地域乐器为原创程序合成近似，未使用外部录音或音频采样。最终审美与音乐感受由用户实际观看试听判断；本记录将客观文件/运行检查与主观评价分开。
`;
await fs.writeFile('docs/final-acceptance.md',doc);
await fs.writeFile('docs/progress.md',`# 制作状态\n\n用户已授权：显示阶段demo，连续推进到最终交付。\n\n五阶段均已完成。2026-10-25按用户反馈将满屏擦除重构为多画幅展墙，并重新导出整片。最终文件、实际播放、逐帧检查和限制见[final-acceptance.md](final-acceptance.md)。\n\n阶段demo保存在exports/skeleton-30、skeleton-60、sample-01、sample-05、sample-19、batch-A-review至batch-D-review；多幅穿框demo在exports/gallery-demo。最终交付以exports/delivery为准。原单幅final-picture为历史工作版本。\n\n最终MP4 SHA256：${a.sha256}\n\n当前没有待生成、待合成或待返工片段。\n`);
console.log('Saved current final acceptance and progress records.');
