# 共用绘制规格 · frozen interface v1

项目路径 C:/Project/Code/minimax/projects/pelican-test。正式需求见 docs/production-plan.md。

每段文件 src/scenes/NN-name.js，默认导出 function renderAt(c,t,scene)。c 是 CanvasRenderingContext2D；t 是场景局部秒，正常 0–6，但转场可能传入 -.65…6.65。scene 为只读元数据。每个场景独立绘制整个视野：x=-389…1389，y=0…1000。1000×1000 核心区是 x=0…1000；两侧为横屏延展。主调度将其映射至 1920×1080。

背景必须填满整个范围；不能清空到透明。不可调用随机 Math.random、Date、上一帧积累或自有 requestAnimationFrame。所有噪声用 kit 的 rng(seed)，静态重工作通过 cached(c,uniqueKey,draw) 烘焙，防止每帧计算万次。

公共 API（请读实际文件确认）：

- src/kit/draw.js：path(c,svgPath,fill,stroke,width)、line(c,pointPairs,color,width)、ellipse(c,x,y,rx,ry,fill,stroke,width)、rect、text、paper、cached、rng、human、tree、ornamentalBorder、title、road。
- src/kit/brush.js：brushTexture(c,{alpha}) 为项目由 p5.brush 实际烘焙的墨迹底层。
- src/rig/pelican.js：pelican(c,absoluteTime,{x=500,y=805,scale=1,style,ink,body,accent,eye,feathers})。style 可用 classic,rock,carved,shadow,glow,ink,line,gilded,oil,digital；eye:'roll'；可自行重绘/延伸本段轮廓来体现画风，不能修改共用 rig。返回 pose。x=500 为主角基准中心；y 为地面接点。车体总宽约430（含喙），高330。
- src/rig/pose.js：poseAt(t) 提供绝对时间关节、踏板、车轮角；需要特别画法时用同一姿态自行绘图。
- src/beat/timeline.js：smooth、clamp、lerp、SCENES。场景起点 scene.start，绝对时间=scene.start+t。

节拍：0–2 进场，2–4 梗点，4–6 出场。所有段都有同一条道路，通常轮胎地面 y=805；场景可以设置景深/坡度但转场前须回到基准姿态。画框由主调度处理，不自行切换。须考虑边界clip逐部位风格切换。

标题中文约42逻辑像素，英文/年代26，黑暗场景保证浅色高对比。各时代有自己的标题呈现，禁止统一博物馆卡片。所有界面和媒体品牌必须虚构。

每个时代应体现具体构图、材质与笔法，不能只是给公共鹈鹕换底色。前、中、后景及角色互动需要明确；使用原创场景，不拷贝参考仓库或当代作品。

每个文件只在分配范围内编辑，不改 app.js/registry.js/公共kit/rig/timeline，也不提交 Git。父代理整合注册。仅用于浏览器、原生 ESM、相对导入，无打包工具。

质量检查：用实际 PNG 与接触表判断画面；不能以代码行数或程序无错代替画面验收。单段性能目标：缓存后2d绘制低于16ms（无截图开销）；复杂自然笔触应放在静态缓存中。
