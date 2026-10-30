# 鹈鹕测试 · The Pelican Test

一只鹈鹕骑自行车，在同时可见的多个独立画幅间骑行，沿连续道路穿过20个艺术时代。当前V2：137秒，1920×840，60fps，120BPM，原创程序绘图与合成配乐。原1920×1080版本及先前裁切版作为历史交付保留。

## 观看与预览

- V2成片：`exports/delivery/The_Pelican_Test_Gallery_v2_1920x840.mp4`。
- V2修改与验收记录：[revision-v2-review.md](docs/revision-v2-review.md)。
- 原创24-bit母带：`exports/audio/pelican-score.wav`。
- 全时代接触表与逐段六帧表：`exports/delivery/`。
- 可编辑的矢量骑手：`public/pelican.svg`。

Windows双击 **START_PREVIEW.cmd**。第一次会安装依赖，然后打开浏览器；关闭命令窗口会停止该次预览。也可运行 `npm ci` 后运行 `npm start`，打开显示的本机地址。请通过本机服务观看预览，不直接双击 index.html。

底部控制条提供播放/暂停、拖动、当前时代与声音开关。默认静音，点击“声音关”开启声音。空格控制播放，左右方向键前后移动1秒。实时画面以WebAudio时钟推进；拖动时从相同母带位置重放，保留原混响和尾音。

环境：Node20.3+、ffmpeg；本机用Node24制作，并用Node20运行测试与实际截图检查。导出工具固定Puppeteer24.43.1与官方ChromeHeadlessShell148，不依赖用户日常浏览器的登录资料；npm安装仅下载所需的headless版本。中文字体为可分发的NotoSerifSC。

## 重建

```text
npm ci
npm test
npm run audio
node tools/render.mjs --from 0 --to 137 --fps 60 --name gallery-v2-final --audio exports/audio/pelican-score.wav
node tools/finalize-v2.mjs
node tools/audit-creative.mjs --movie exports/delivery/The_Pelican_Test_Gallery_v2_1920x840.mp4 --out exports/revision-v2/final-audit
```

单帧与接触表：`node tools/capture.mjs --all`。任意时点：`node tools/capture.mjs --name shots --times 8,32,91.25,116,134`。代码骨架保留在 `/?stage=skeleton`。

逐帧导出在 frames/ 保存可核验缓存，在导出目录的manifest记录源代码指纹、设置、Chrome版本和每帧哈希；中断后以相同命令继续，只复用指纹和校验一致的帧。音频单独渲染成48kHz/24-bit双声道WAV，再由ffmpeg合成H.264/AAC成片。

## 组织

- src/kit：确定随机、图层、材质、水墨、文字。
- src/beat：时间轴与统一拍点；0–1秒弱起，5秒开始20个6秒版块，125秒进入Outro。
- src/rig：共享骨骼、脚踏约束、车轮运动与多风格绘制。
- src/scenes：20个原创时代文件；每帧直接由时间参数决定。
- src/main：连续道路、穿框裁切、镜头、Intro与21格发布会Outro。
- audio：原创事件表、合成器、离线渲染与磁带处理。
- briefs：20份美术简报及公共接口规格。
- tools：截图、接触表、渲染、配乐、检查及合成。

## 资料与边界

[制作方案](docs/production-plan.md) · [参考及许可研究](docs/research-and-rights.md) · [阶段证据](docs/progress.md) · [音频验收记录](docs/audio-acceptance.md)

所有影片画面、纹理、界面、角色、旋律和声音由本项目独立生成。没有使用参考仓库的影片、封面、音频、渲染帧、简报或场景代码；未fork参考仓库。历史作品只作技法研究，现代软件/游戏/短视频界面均为虚构。

程序合成乐器是音色近似，不宣称复原历史录音或古代音乐。客观检查与实际连续播放证据见验收记录；艺术取舍和试听感受可在可编辑源码中继续调整。

第三方组件的独立授权见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 与 licenses/。原创代码的再许可由项目所有者决定。

多画幅初版规格见 [gallery-revision.md](docs/gallery-revision.md)，V2规则见 [art-direction-v2.md](docs/art-direction-v2.md)。浏览器宽屏会展开更多相邻作品，V2原生输出1920×840；历史验收文档中的1080p格式不再代表当前导出。

[最终检查记录](docs/final-acceptance.md) · [多幅展墙检查](exports/gallery-verification/report.json)
