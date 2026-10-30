import fs from 'node:fs/promises';import path from 'node:path';import sharp from 'sharp';
import {SCENES,smooth} from '../src/beat/timeline.js';
const out='exports/revision-v2';await fs.mkdir(path.join(out,'comparisons'),{recursive:true});
const old=JSON.parse(await fs.readFile('exports/creative-audit/evidence.json','utf8')),current=JSON.parse(await fs.readFile(path.join(out,'final-audit/evidence.json'),'utf8'));
const notes=[
 '不规则岩壁、赭石磨损，牧人和牛群明确停下围观。',
 '整只骑者在第二小节定格；保留字框、正面眼与打格底稿。',
 '完整车舆与马队入画，队列随鸟同行，拓印缺墨覆盖主体。',
 '纯墨线与提按，固定于鸟身的长带和羽毛顺风翻起。',
 '巨峰之下先见极小旅者，山石、树木、道路和鸟共用真实推近镜头。',
 '重新绘制木构虹桥，两轮沿拱面骑行，看客追视，栏杆正确遮挡。',
 '折页纸脊与图符节奏，使用壳、点、横记录踏板，离场后保留第六圈。',
 '完整金色花框、宫廷细节、多角度宾客；自行车沿石径经过水池。',
 '保留大留白和少笔墨形，白眼在高光时抬起并清楚停留。',
 '放大镂空透光孔，保留三根操纵杆，台前遮挡与10Hz顿挫。',
 '斜向东海道旅路，木版色块和墨线，骑者随坡，旅人和树木分前后。',
 '双大旋涡实际旋转并与车轮同相位，鸟与背景共用短笔触。',
 '路人依次侧目、张口、捧脸；始终位于前景，车不再透明穿人。',
 '灯源投影后沿楼梯缓慢爬升，只见黑影，出口轮廓逐渐通电。',
 '荧光鸟留在圆屏内；手误触后扭成李萨如，下一拍恢复。',
 '简化像素轮辐，清晰HUD；保留跳坑、吃金币和强拍1UP。',
 '动图留在消息图像内，8Hz与256色抖色；抖窗时窗口和内容一起动。',
 '完整低多边形棕榈、古典胸像与透视网格；四次跳针有真实路径重复。',
 '入场收窄成9:16，常态黑边干净，评论避让主体，结尾打开出口。',
 '八行SVG引用对应真实路径，逐笔完成精细鸟体，静止展示一秒后骑出。'
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const scene of SCENES){
 for(const [label,source,top]of [['before',old,55],['after',current,50]]){
  const event=source.events.find(e=>e.id===scene.id&&e.local===2.75);if(!event)throw Error(scene.key);
  const left=Math.round(660-smooth((event.local-3.5)/2.5)*642);
  await sharp(event.file).extract({left,top,width:600,height:600}).png().toFile(path.join(out,'comparisons',`${scene.id}-${label}.png`));
 }
}
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>鹈鹕测试 V2 · 新的二十份答卷</title><style>
:root{color-scheme:light;--paper:#eeece3;--ink:#273d36;--muted:#6d7568;--red:#934d3a}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Microsoft YaHei",system-ui,sans-serif;line-height:1.9}main{max-width:1320px;margin:auto;padding:45px 30px 80px}h1,h2{font-family:"Noto Serif SC",SimSun,serif;font-weight:400;line-height:1.3}h1{font-size:clamp(34px,5vw,62px);margin:15px 0}h2{font-size:27px}p{max-width:85ch}.eyebrow{letter-spacing:.15em;font-size:13px;color:var(--muted)}.lead{font-size:20px}.links,nav{display:flex;gap:12px 24px;flex-wrap:wrap}a{color:var(--red);text-underline-offset:4px}video{width:100%;aspect-ratio:16/7;background:#17271e;display:block;border:1px solid #c1c5b7;margin:30px 0 18px}.meta{font-size:14px;color:var(--muted)}.samples{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:30px 0}.sample{background:#e0ddcf;padding:18px;border-top:2px solid #8a9a83}.sample a{font-size:18px}.sample p{font-size:14px}nav{padding:25px 0;border-block:1px solid #c4c7ba;margin:35px 0}article{padding:28px 0 44px;border-bottom:1px solid #c4c7ba;scroll-margin-top:20px}article h2{margin-bottom:4px}.details{font-size:14px;color:var(--muted)}.pair{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:20px 0}.pair figure{margin:0}.pair img{width:100%;height:auto;display:block}.pair figcaption{font-size:13px;color:var(--muted);margin:5px 0}.note{font-size:16px}footer{font-size:13px;color:var(--muted);padding-top:35px}.sequence img{max-width:100%;height:auto}summary{cursor:pointer;color:var(--red)}@media(max-width:650px){main{padding:25px 16px}.samples{grid-template-columns:1fr}.pair{gap:8px}.lead{font-size:17px}}
</style><main><div class="eyebrow">THE PELICAN TEST / REVISION 02</div><h1>同一条路，重新画过的二十个世界。</h1><p class="lead">V2保留多画幅同屏与连续穿框，重做各段构图、动作和媒介语言。下面的对照均从旧版与新版实际MP4解码，采用同一时间点，方便直接判断。</p>
<video controls preload="metadata" poster="final-audit/frames/${path.basename(current.events.find(e=>e.id===12&&e.local===2.75).file)}" src="../delivery/The_Pelican_Test_Gallery_v2_1920x840.mp4"></video>
<p class="meta">137秒 · 1920×840 · 60fps · 原创合成配乐 · 浏览器控件不在成片中</p><div class="links"><a href="../delivery/The_Pelican_Test_Gallery_v2_1920x840.mp4" download>下载新版MP4</a><a href="../delivery/The_Pelican_Test_Source_v2.zip" download>源码与验收记录</a><a href="../../docs/revision-v2-review.md">完整修改记录</a><a href="final-audit/overview.png">20段新版总览</a></div>
<div class="samples"><div class="sample"><a href="song/song-v2-600px-60fps.mp4">宋代山水 · 质量样片</a><p>整个世界共同推近，找到山脚下的小旅者。</p></div><div class="sample"><a href="riverside/riverside-6s-with-score.mp4">虹桥 · 质量样片</a><p>拱桥路径、同尺度人物、回头和前景遮挡。</p></div><div class="sample"><a href="code/code-600-with-score.mp4">代码美学 · 质量样片</a><p>SVG逐笔形成细致作品，停留后开始远行。</p></div></div>
<nav>${SCENES.map(s=>`<a href="#scene-${s.id}">${String(s.id).padStart(2,'0')} ${s.zh}</a>`).join('')}</nav>
${SCENES.map(s=>`<article id="scene-${s.id}"><h2>${String(s.id).padStart(2,'0')} ${s.zh}</h2><div class="details">${esc(s.en)} · ${esc(s.era)} · ${(s.start+2.75).toFixed(2)}秒同帧对照</div><p class="note">${notes[s.id-1]}</p><div class="pair"><figure><img loading="lazy" src="comparisons/${s.id}-before.png" alt="${s.zh}旧版"><figcaption>旧版</figcaption></figure><figure><img loading="lazy" src="comparisons/${s.id}-after.png" alt="${s.zh}V2"><figcaption>V2</figcaption></figure></div><details class="sequence"><summary>展开新版动作序列</summary><a href="final-audit/${String(s.id).padStart(2,'0')}-${s.key}.png"><img loading="lazy" src="final-audit/${String(s.id).padStart(2,'0')}-${s.key}.png" alt="${s.zh}新版八帧动作序列"></a></details></article>`).join('')}
<footer>证据：新版174个不同时间点的MP4解码画面、20张八帧序列图、原生画幅与音轨检查。详细结果与实际连续播放记录见源码包和修改记录。旧成片保留，现有B站稿件未替换。画面为程序绘制；传统乐器为合成音色近似，音色主观听感不能由自动测试代替。</footer></main></html>`;
await fs.writeFile(path.join(out,'report.html'),html);
const featured=[1,4,5,6,8,12,18,20],layers=[];
for(let i=0;i<featured.length;i++){const id=featured[i],x=i%2*620,y=Math.floor(i/2)*335;for(const [j,label]of ['before','after'].entries())layers.push({input:await sharp(path.join(out,'comparisons',`${id}-${label}.png`)).resize(300,300).toBuffer(),left:x+j*300,top:y});const stamp=Buffer.from(`<svg width="600" height="30"><rect width="600" height="30" fill="#273d36"/><text x="12" y="21" font-family="Arial" font-size="17" fill="#f4e7cb">${String(id).padStart(2,'0')} / BEFORE</text><text x="312" y="21" font-family="Arial" font-size="17" fill="#f4e7cb">REVISION 02</text></svg>`);layers.push({input:stamp,left:x,top:y+300});}
await sharp({create:{width:1220,height:1340,channels:3,background:'#eeece3'}}).composite(layers).png().toFile(path.join(out,'before-after-featured.png'));
console.log('Built V2 delivery page, 20 MP4-derived comparisons and featured contact sheet.');
