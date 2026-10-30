# 16-pixel: original art brief

Time 95–101s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Authored8bitgame/pixeltiles/cloudlayers/limitedpalette, safeoriginalpit andcoin.12Hzsprite/actor,smoothcamera; jumpcoin97s and1UP98s. Independentlypixel-renderbird,noprotectedgameassets.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## 实施细化 / 2026-10-27

原创游戏名「REED RUN」，8色限色：深靛#14253f、靛紫#62618e、薄荷#bce2c3、青绿#4d9188、浅青#8ebdb1、乳白#f3ebcc、橙金#e8ad5e、陶红#b76b58。远景为层叠阶梯山、方块云和塔状芦苇，中景为折线水面，前景为有草边与截面的像素道路；避免任何现成平台游戏方块或角色。以低分辨率Canvas直接画原创sprite后最近邻放大，轮胎也以像素圆轮廓而不是矢量圆叠滤镜；腿部节点采样全局poseAt，内部角色严格12Hz。

96.5–97.5秒角色作一条连续完整的跳跃弧，97秒正好到顶并触发原创铜币四向闪光；98秒HUD出现1UP，退出前回接y700。坑位位于世界x约280–420，单段接触线仍700，两端平路。标题是独立游戏HUD的中文/英文/年代，像素化英文由自绘5×7字形构成。

## 最终自检 · 2026-10-28

已在原生1920×1080查看95.3、97.5、100.8秒进场/跳跃/离场PNG。修订铜币旋转与四向闪光为12Hz，与角色的12Hz一致；主调度世界相机仍按每帧真实时间移动。独立画布在96.25与96.26秒背景像素完全相同，验证复古内部采样。坑洞、轮胎、车架均属原创，未使用外部素材。素材调色经最近色投影严格限制到8色；标题HUD采用单独清晰文字层。离场邻接17段已是原创信箱画面，无占位色块。
