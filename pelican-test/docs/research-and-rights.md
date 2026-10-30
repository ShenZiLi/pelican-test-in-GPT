# 参考资料与许可核对

核对日期：2026-10-24。所有链接作为研究来源，不能据此推定素材获准使用。

## 指定仓库：五份文件已完整读取

通过 GitHub 只读接口读取；未 clone、未 fork、未复制场景代码、简报或任何媒体资产。

| 文件 | 核对结论 | 读取时 blob SHA |
|---|---|---|
| [README.md](https://github.com/Tunai-0511/meme67-art-history/blob/main/README.md) | 82 秒、15 个艺术段落；同拍点动机、共享工具、逐帧渲染与分场景组织可作工程方法参考 | 44075b27a28795e6e34eada33414ebd6d9eadca0 |
| [README_SHARE.md](https://github.com/Tunai-0511/meme67-art-history/blob/main/README_SHARE.md) | 已阅读制作说明与全部附带示例提示；本项目不使用其提示正文、美术简报、场景构图和具体笑点 | e7df0de1e286941ed756d7b8fddafeb362447e31 |
| [LICENSE](https://github.com/Tunai-0511/meme67-art-history/blob/main/LICENSE) | MIT，版权人为 Copyright (c) 2026 Tunai-0511；若后续实际复用其代码，必须保存版权与完整许可并记录位置 | 2e96429997c065a8cd21691948230ebe18d06255 |
| [LICENSE-MEDIA.md](https://github.com/Tunai-0511/meme67-art-history/blob/main/LICENSE-MEDIA.md) | 成片、封面、渲染帧、混音及语音样本保留所有权利；不进入本项目资产或派生作品 | b658b7443229c29c4cc8dc9d676fc6293e8d1b23 |
| [NOTICE.md](https://github.com/Tunai-0511/meme67-art-history/blob/main/NOTICE.md) | 列有 p5.js、p5.brush、Puppeteer、ffmpeg、Kokoro 与系统字体；本项目逐个自行核验所用依赖，不继承其媒介授权结论 | 42b8806e83e6b6aefddb650bc9d034f4ea0c61e9 |

工程借鉴：分场景纯时间渲染、共用笔触工具、统一节拍、先规格后并行、接触表与逐帧验收。全部实现独立编写。

呈现差异：参考说明使用独立场景、年份计数和标签展示；本项目用同一骑手、连续道路、前后景互动和跨画框的逐部位变风格建立叙事。片尾为有第 21 格笑点的新闻发布会，不复刻参考仓库的结尾动作或排列。

## Superman in Flight 寻源

- 候选原始发布：[Chetaslua 的 X 帖子](https://x.com/chetaslua/status/2105757136219504862)。网页读取返回 403，未据此假称读到了正文。
- [在线作品](https://claude.ai/artifact/7F2XhpmgiuyxHKgQ9Vgr9Q)：已用 Tabbit 成功打开；实际页面标题为 **Superman in Flight**；作品替代文字描述一名角色飞过 20 个画幅并在边界改变风格；可见播放/暂停、声音开关、时间拖动和当前段名称。
- 实际查看了一张浏览器截图：奶油色底、衬线大标题，右侧 5列×4行的 20 格艺术作品总览。该总览与用户所述穿越画幅的主题吻合。截图只用于研究，未复制进本项目或作为创作素材。页面可见绘制主体为 canvas；因此不采信索引中“纯 CSS/SVG、无 canvas”的实现断言。
- [索引与内容描述](https://postcutoff.com/v/chetaslua-fable-5-5-superman-art-styles-x/)：将该原帖描述为角色连续穿越 20 种艺术风格后拉远到总览。该页明确说明其内容分析由 AI 撰写，属于发现线索，不能替代逐帧亲眼验证。

与本项目有关的研究方向：主体轨迹连续比“每段都换场景”更能建立穿越感；材质改变时轮廓、姿态与运动接点仍须可追踪；全景回收为结尾提供视觉回忆。本项目不使用超人角色、服饰、标识、原作代码或任何原作媒体。

本轮观察了页面、实时段名变化与总览截图，未完成原作逐段播放或听觉分析；不对其完整时长、全部源码实现或音轨作已验证的断言。实际可观察证据与第三方描述分别记录。

## 依赖核对

| 依赖 | 一手来源 | 已核对 / 实施时动作 |
|---|---|---|
| p5.brush | [LICENSE.md](https://github.com/acamposuribe/p5.brush/blob/main/LICENSE.md) | MIT；Copyright (c) 2023-2026 Alejandro Campos Uribe；blob 3869ae9fa70b70e3a62f0c619e88a63feb681cc3 |
| p5.brush | [package.json](https://github.com/acamposuribe/p5.brush/blob/main/package.json) | 读取版本 2.2.4，peer p5 ^2.2，依赖 simplex-noise ^4.0.3；blob a6ecd9637ec8126836e79b0af852601f36e7fe57；安装时再锁版本 |
| p5.brush | [README](https://github.com/acamposuribe/p5.brush) | p5 构建需 WEBGL；randomSeed/noiseSeed 与库联动；可使用离屏图层。确定性与性能须由本机样片实际验证 |
| p5.js | [license.txt](https://github.com/processing/p5.js/blob/main/license.txt) | 已核对许可证开头为 LGPL 2.1；实施时保存实际所用版本的完整许可、源码定位与替换方式，不把项目全部依赖误标为 MIT |
| Puppeteer | [截图官方说明](https://pptr.dev/guides/screenshots) | Page.screenshot 可用于逐帧捕获；包及传递依赖按安装版本记录许可 |
| Web Audio | [OfflineAudioContext 文档](https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext) | 同一调度器用于实时和离线；后续用实际 WAV 验证时长与节拍 |
| ffmpeg | 本机 ffmpeg -version | 已找到 9.0.1 essentials build；调用本机工具，不随源码包分发二进制；记录所用构建与配置 |
| 字体 | 实施时选定的上游字体仓库与许可文件 | 优先可分发的开源中文字体；逐项保存字体许可，不复制 Windows 或 macOS 内置字体 |

## 历史作品研究边界

只研究并重新绘制历史作品的造型与技法，不把馆藏照片、扫描、现代修复、电影修复版或音乐录音当成可随意使用的素材。

- [MoMA：《The Starry Night》](https://www.moma.org/collection/works/79802)：用于核对作品信息和技法研究，画面由本项目独立生成。
- [MUNCH：《The Scream》](https://www.munch.no/en/The-Scream/)：存在多个年份和版本；本项目按用户指定的 1893 版本研究，不混用其他版本。
- 第 14 段采取原创德国表现主义默片阴影构图，不复刻《诺斯费拉图》的具体电影帧、布景、人物、字幕设计或修复版本素材。
- 每份正式美术简报记录可访问的馆藏/研究链接、参考目的和不取用的素材。其余 17 段研究随批次展开，不以当前概念表冒充已经完成的馆藏考证。

## 本机预检

- Node v24.15.0、npm 11.12.1、Git、GitHub CLI 与 ffmpeg 已存在。
- 常见系统/用户 Google Chrome 路径和 App Paths 未找到 Chrome；这不证明全盘没有自定义安装。阶段 1 先做配置路径检测，必要时安装项目专用 Chrome for Testing。
- Tabbit CLI 可运行，已成功打开参考作品。
- 现有 minimax 目录不是 Git 仓库；项目单独置于 projects/pelican-test，不修改其它项目。

## 实际复用登记

截至本轮：未复用参考仓库代码或媒体，未安装项目依赖。THIRD_PARTY_NOTICES.md 在安装与实现时按实际依赖生成；不得把“已查到许可证”写成“已完成分发合规”。
