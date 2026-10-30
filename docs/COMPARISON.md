# Comparison method / 对比方法

## Scope

Publication date: **2026-10-30, Asia/Shanghai**. The owner identifies the configurations as GPT 6.1 sol High, GPT 6.1 sol High with Trellis, and GPT 6 Astra High. No provider telemetry is bundled to independently verify model routing. The baseline brief is shared; full session transcripts are not published.

These are final working-tree snapshots, including later user-directed revisions. They are not untouched first responses. In particular, the first and third projects contain multi-panel gallery revisions, while the second retains its full-frame scene presentation. Neither a numerical model ranking nor a causal improvement from Trellis can be established from this collection.

发布内容是三个项目当前工作目录的快照，包含后续返工。第一个项目在收录时有未提交修改，这些当前文件已收录；其来源 Git 哈希仅用于标记起点，不能替代工作目录快照。发布过程未修改或提交三个原仓库。

## Screenshots

`capture-comparison.mjs` starts each copied project's server and asks its own deterministic `window.film.renderAt(t)` to draw the frame. No existing movie, reference art or cover image is imported. Nine stills are stored as 960×540 JPEGs; the first project's 1920×840 viewport is fitted with borders, the others are 1920×1080. Aspect ratios are preserved. Fonts use the available runtime environment.

| Sample | Global time | Intent |
| --- | --- | --- |
| crossing | 10.9 s | Sahara/Egypt boundary; inspect the actual transition choices |
| landscape | 32 s | Song scene at local 3 s; compare scale, composition and ink treatment |
| vaporwave | 110 s | Vaporwave scene at local 3 s; compare palettes and digital environments |

Global timestamps are equal, but local staging can differ. A single still cannot evaluate frame pacing, sound quality or transition continuity. The pictures intentionally show each project's actual viewport, rather than forcing identical framing or cropping away differences.

图像仅用于说明与对比，完整视频、音频、帧序列没有进入仓库。九张图的项目、时间和路径见 `images/manifest.json`；各项目文件在 Git 中保存的内容（经 Git 换行转换后的 blob）的 SHA-256 见 `source-manifest.json`，不以本机检出时的 CRLF 转换结果为准。

## Validation

Fresh dependency installations and tests were run in the publication copies, not merely read from historical reports.

| Project | Checks passing | Explicitly skipped | Result |
| --- | ---: | ---: | --- |
| pelican-test | 23 | 2 rendered-master audio checks | No failing tests |
| pelican-test2 | 23 | 0 | No failing tests |
| pelican-test3 | 7 | 0 | No failing tests |

Some tests conditionally inspect exported audio only when it exists; passing source checks do not validate omitted audio files. All three previews loaded, and all nine comparison screenshots rendered without browser `pageerror` events. Full soundtrack export, subjective audio listening and complete movie decoding are outside this source-publication verification.

## Packaging

The repository starts fresh: no nested `.git`, history import or Git submodules. All projects remain independently installable. Their source, tests, tools, lockfiles, art briefs and notices are retained. Generated brush material is retained where the renderer needs it. Dependency license text inventories are kept as notices; dependency implementations are installed by npm.

Selected Trellis workflow/spec documents preserve evidence of the development setup. The framework's installed helper scripts, agent configurations, tasks, runtime state and developer journals are excluded. No new blanket license is inferred from a public repository.

`provenance.json` records source branch/commit and whether the source worktree was dirty at copying. Model attribution is owner-supplied. It does not claim that a source HEAD exactly describes uncommitted files. The publication snapshot and its own Git commit are the reproducible source reference.
