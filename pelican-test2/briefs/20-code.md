# 20-code: original art brief

Time 119–125s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Originalclean darkeditor and actualSVGmarkup typing withlinenumbers, rightpreviewwide andquietgrid. Ownrefinedfeather/beak/cyclecubicgeometryderivedfrompose, strokesrevealprogressivelyandfullycompletebylastbar.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## 实施细化 / 2026-10-27

原创编辑器「REED / vector studio」，深蓝黑#111b24、面板#192936、次线#304554、文字#cbd8d3、青绿#7ddcc8、暖白#f3eee0、铜金#dba568、薰衣草#b3a3d4。左40%为实际可解析SVG源码与行号，右60%是安静的构图预览，底边终端仅显示实际生成的有效路径信息；不加入虚假运行日志或无关代码。

将共用poseAt的节点转成真正的SVG字符串：精细Bezier喉囊、羽片、折叠翼、长喙、眼睛，金属车架、辐条、踩踏腿都逐项构成。源码和右预览由同一个shape数组生成，画面绘制使用Path2D同一d属性，不假造代码；最终字符串可独立导出为SVG。119–123秒按shape顺序建立线条，最后一小节123–125秒完整显示全部造型与代码。全幅预览内缩放1.5，轮胎接地924px，过框时脚相位仍全局连续。

## 最终自检 · 2026-10-28

最终预览缩放为2.1（早期1.5方案已调整），轮胎接地仍为924px。已查看119.3、123.3、124.8秒原生PNG：先写出轮组，123秒完整建立精细羽毛/喉囊/辐条/踩踏腿，最后两秒保持完整。实际buildSVG(119/123/124.999)交由浏览器DOMParser解析均无错误，各72个path，无NaN或Infinity；路径与画面使用同一数组。新增深色格点连续世界背板和路面，防止相邻画框露出占位背景。
