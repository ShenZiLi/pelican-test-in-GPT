# 17-chat: original art brief

Time 101–107s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Fictional 芦苇信箱 earlychatwindow withauthoredabstractavatars/chrome; own256color ordered-dither cyclingGIFat8Hz. 对方正在输入… windowshakes103s,message104s; noMSN/realicons.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## 实施细化 / 2026-10-27

「芦苇信箱」使用原创暖灰桌面、墨蓝窗口边、鼠尾草绿联系人栏与石榴红消息提示，不复刻真实软件。色票：#e8e4d7、#243d4a、#708e86、#a6b9ab、#faf6e8、#bd7465、#ced7bd。原生全幅构图中左侧为联系人与信息栏，右侧主要区域为大幅8Hz骑行GIF，骑行GIF下缘接地924px；底边是聊天输入框与原创发送箭头。

GIF自行绘制为偏几何、粗像素边缘、4×4 Bayer固定抖动的奶白鹈鹕与斜梁自行车，浅绿色纸背景和独立芦苇小景。101–103秒显示「对方正在输入…」；103秒整拍窗口发生短促确定性衰减摇动；104秒出现「它真的会骑。」及发件人原创苇叶头像。UI文字不能和主角身体互遮。导出fontText供主流程加载。

## 最终自检 · 2026-10-28

已在原生1920×1080查看101.3、103.4、106.8秒PNG，文字不挡鹈鹕，消息位于右上。GIF像素采用3-3-2 RGB量化，理论最多256色，实际101.25/101.26/104.5秒图像数据分别28/28/29色；不是每通道16级导致的4096色。101.25与101.26秒全窗口像素哈希相同，证明8Hz GIF。外层摇窗为103秒确定性衰减运动。新增原创信箱侧面背景与本风格骑行绘制，用于100.8秒前一段过框及下一段进入时的连续世界，避免原先露出17编号占位板。
