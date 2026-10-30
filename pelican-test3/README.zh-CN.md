# 鹈鹕测试3 — 一部骑行艺术史

137秒的原创程序动画：一只鹈鹕骑自行车穿过20种历史与数字艺术风格，沿画框之间的道路进入最后的空席新闻发布会。

## 观看

- 成片：`out/pelican-test3.mp4`，1920×1080，H.264 / AAC。
- 配乐：`out/soundtrack.wav`，48kHz 双声道。
- 全片接触表：`out/contact-sheet.png`；转场接触表：`out/transitions.jpg`。
- 30/60fps 对照：`out/compare-30.mp4`、`out/compare-60.mp4`。

```powershell
npm ci
npm run dev
```

打开 http://127.0.0.1:4173 。点击播放优先读取已导出的配乐，约半秒启动；若WAV缺失则自动离线合成，可能等待数分钟。底部可暂停、拖动、跳章及开关声音；空格播放/暂停，左右键跳5秒。声音由 Web Audio 播放，以音频时钟驱动画面，实时与离线导出共享同一个合成缓冲。

## 重建

环境：Node20+、Chrome、ffmpeg。自动查找 Puppeteer Chrome 缓存；也可设置 `CHROME_PATH`。无需网络素材。

```powershell
npm test
npm run check
npm run audio
node tools/render.mjs --fps 60 --width 1920 --workers 3 --name picture
ffmpeg -y -i out/picture.mp4 -i out/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -t 137 -movflags +faststart out/pelican-test3.mp4
npm run sheet
```

`render.mjs` 在 Puppeteer 中逐帧调用纯函数，再把帧送入 ffmpeg。三个分段使用绝对帧号，合并时不重复边界。`sheet.mjs` 使用浏览器截图产出1080p静帧。

## 结构

- `src/kit`：种子纹理、墨色、晕染、文字和几何工具。
- `src/beat`：统一节拍和137秒时间轴。
- `src/rig`：车架、车轮、脚踏和鹈鹕关节。
- `src/scenes/01.js`–`20.js`：各幕独立笔法与笑点。
- `src/main`：p5画布、摄像机、穿框、首尾和控制条。
- `audio`：原创乐器合成与磁带处理。
- `briefs`：20份原创美术简报。
- `tools`、`tests`：导出、截图、接触表及验证。

艺术风格是程序化的原创诠释，传统乐器是合成近似，并非历史录音或民族乐器实录。许可与参考边界见 THIRD_PARTY_NOTICES.md，音频链见 docs/AUDIO.md。
