# 鹈鹕测试2 · The Pelican Test II

137 秒原创代码动画。鹈鹕沿连续道路穿过20个艺术时代，以7×3展墙和空席新闻发布会收尾。画面逐帧绘制，音乐和音效完全程序合成；无外部音视频素材。

## 观看与运行

最终影片：out/final/pelican-test2.mp4（1920×1080、60fps、137秒、H264/AAC立体声）。可通过本地交付页观看，亦可直接用播放器打开。

需要 Node20.3+、Chrome、ffmpeg/ffprobe：

    npm ci
    npm start

打开 http://127.0.0.1:4173/review.html 看成片，或 http://127.0.0.1:4173/ 看实时画面。首次播放优先加载源码与WAV哈希均通过校验的原创配乐缓存；无缓存或源码改变时重新程序合成，需等待。底部支持播放/暂停、拖动与章节跳转；空格切换播放，左右键跳五秒。拖动会暂停，点击播放继续。音频时钟驱动画面，离线与实时使用同一原创乐谱，缓存只是离线合成结果，不引入外部素材。

## 可复现导出

    npm test
    npm run audio
    npm run test:browser
    npm run render -- --from 0 --to 137 --fps 60 --width 1920 --height 1080 --out out/final/frames --workers 3
    npm run encode -- --input out/final/frames --out out/final/silent.mp4
    npm run mux -- --video out/final/silent.mp4 --audio out/final/score.wav --out out/final/pelican-test2.mp4
    npm run sheet -- --input out/final/stills --out out/final/contact-sheet.jpg --columns 4
    npm run verify:final

工具自动启动临时本地服务并寻找Chrome缓存；可设置CHROME_PATH、FFMPEG_PATH、FFPROBE_PATH指定工具。渲染目录需为空；恢复时加--resume，要求源码、配置、Git来源和浏览器一致。不能在同一次渲染途中修改源码或提交新版本。无声中间片只用于合成，最终MP4含完整原创配乐。

截图示例：npm run capture -- --time 91.5 --out out/scope.png。浏览器检查生成关键帧、接触表输入、乱序重绘与播放器检查记录。原始帧、WAV、MP4与检查输出均在out/，可再生成，不进入Git。

## 结构

- src/kit：固定种子、宣纸纹理、干笔与真实p5.brush烘焙笔触图集。
- src/beat：137秒绝对时间轴；120BPM，第5秒为小节第一拍。
- src/rig：共用骨骼、踏板逆运动学、轮廓和周期动作。
- src/scenes：20个时代的独立绘法、构图、标题和笑点。
- src/main：连续路面、画框遮挡、镜头、Intro/Outro与播放器。
- audio：原创主题、20组程序音色、双阶段磁带处理、离线WAV与实时引擎。
- tools：截图、接触表、逐帧恢复导出、编码、音画合成、许可清单。
- briefs：20份独立美术简报及配乐说明；docs/reviews：历史与最终验收记录。

每帧是绝对时间的纯函数，不依赖上帧。CPU二维栅格化经p5 WEBGL呈现，随机纹理固定种子。皮影/像素/聊天内部10/12/8Hz，镜头保持连续。配乐音色是合成器对各时代乐器的原创抽象表达，不使用采样乐器或真实人声。

参考只借鉴工程组织方式。未导入参考仓库或相邻项目的源码、影片、封面、音频、场景构图或美术简报。版权和依赖见THIRD_PARTY_NOTICES.md及licenses/。项目规范要求每次改动检查后提交本地Git。
