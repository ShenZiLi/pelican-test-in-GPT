# 18-vaporwave: original art brief

Time 107–113s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Originalpinkcyanperspectivegrid,lowpolypalms,inventedmarblebust,chromedetailsandrectangularsun; noalbumcover. Neonpastelbird/bike, visualhalfbeatloop109–110s withglobalroadcontinuous.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## 实施细化 / 2026-10-27

原创建筑化蒸汽波花园：上空为横向渐变的紫蓝天与带错位切片的矩形落日；中央水池接向透视网格，侧翼为分面棕榈与独立原创的大理石鹈鹕半身胸像（不是现成古典雕像）。调色：#282346、#635a9b、#d398c7、#f0b6cd、#80d8d1、#faf1e6、#5584a8、#be719e。石雕有结构性平面和克制固定种子灰纹，棕榈是可见硬边的多边形羽叶。

骑行者以冷白玻璃与粉青金属羽片、轮胎的双侧铬高光、分面长喙和蓝紫投影独立绘制。109–110秒背景副动作与流光按0.25秒片段连续重复四次，完成后回到真实全局位置；主要道路、脚与轮子的poseAt绝不回退，跳针只作用于棕榈副摆与彩带光。道路透视线接地y700水平切线，离开不留残影。

## 最终自检 · 2026-10-28

实际雕像为独立创作的人像大理石胸像，符合古典胸像围观的设定。已查看107.3、109.5、111.8秒原生PNG，和16/17/19/20段组成对照接触表。修复进场时浅色标题落在前一段浅底的低对比：在标题后加入紫色横向渐隐色域，年代也加入右侧渐隐色域，完整保留场景画面。离场19段河岸连续世界已补齐，无编号占位板。109–110秒四次0.25秒视觉重复仅作用于副动作，脚踏和相机使用绝对时间。
