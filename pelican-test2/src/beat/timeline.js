import { clamp } from '../kit/geometry.js';
import { finiteTime } from './clock.js';

export const DURATION = 137;

// Original project metadata, mirrored from docs/planning/timeline.json and checked in tests.
export const SCENES = [
  {
    "number": 1,
    "id": "01-sahara",
    "titleZh": "撒哈拉岩画",
    "titleEn": "Saharan Rock Art",
    "era": "约前4000年",
    "start": 5,
    "end": 11,
    "highlightCandidate": 8,
    "internalUpdateHz": null
  },
  {
    "number": 2,
    "id": "02-egypt",
    "titleZh": "埃及壁画",
    "titleEn": "Egyptian Wall Painting",
    "era": "约前1300年",
    "start": 11,
    "end": 17,
    "highlightCandidate": 14,
    "internalUpdateHz": null
  },
  {
    "number": 3,
    "id": "03-han-rubbing",
    "titleZh": "汉画像石拓片",
    "titleEn": "Han Stone Rubbing",
    "era": "约100年",
    "start": 17,
    "end": 23,
    "highlightCandidate": 20,
    "internalUpdateHz": null
  },
  {
    "number": 4,
    "id": "04-tang-line",
    "titleZh": "唐代白描",
    "titleEn": "Tang Line Drawing",
    "era": "约750年",
    "start": 23,
    "end": 29,
    "highlightCandidate": 26,
    "internalUpdateHz": null
  },
  {
    "number": 5,
    "id": "05-song-landscape",
    "titleZh": "宋代山水",
    "titleEn": "Song Landscape",
    "era": "约1000年",
    "start": 29,
    "end": 35,
    "highlightCandidate": 32,
    "internalUpdateHz": null
  },
  {
    "number": 6,
    "id": "06-qingming",
    "titleZh": "清明上河图",
    "titleEn": "Along the River",
    "era": "约1100年",
    "start": 35,
    "end": 41,
    "highlightCandidate": 38,
    "internalUpdateHz": null
  },
  {
    "number": 7,
    "id": "07-maya",
    "titleZh": "玛雅抄本",
    "titleEn": "Maya Codex",
    "era": "约1200年",
    "start": 41,
    "end": 47,
    "highlightCandidate": 44,
    "internalUpdateHz": null
  },
  {
    "number": 8,
    "id": "08-mughal",
    "titleZh": "莫卧儿细密画",
    "titleEn": "Mughal Miniature",
    "era": "约1600年",
    "start": 47,
    "end": 53,
    "highlightCandidate": 50,
    "internalUpdateHz": null
  },
  {
    "number": 9,
    "id": "09-bada",
    "titleZh": "八大山人写意",
    "titleEn": "Bada Shanren Ink",
    "era": "约1690年",
    "start": 53,
    "end": 59,
    "highlightCandidate": 56,
    "internalUpdateHz": null
  },
  {
    "number": 10,
    "id": "10-wayang",
    "titleZh": "爪哇皮影戏",
    "titleEn": "Wayang Kulit",
    "era": "约1800年",
    "start": 59,
    "end": 65,
    "highlightCandidate": 62,
    "internalUpdateHz": 10
  },
  {
    "number": 11,
    "id": "11-ukiyoe",
    "titleZh": "浮世绘",
    "titleEn": "Ukiyo-e: Tokaido",
    "era": "1830年代",
    "start": 65,
    "end": 71,
    "highlightCandidate": 68,
    "internalUpdateHz": null
  },
  {
    "number": 12,
    "id": "12-starry-night",
    "titleZh": "星月夜",
    "titleEn": "The Starry Night",
    "era": "1889年",
    "start": 71,
    "end": 77,
    "highlightCandidate": 74,
    "internalUpdateHz": null
  },
  {
    "number": 13,
    "id": "13-scream",
    "titleZh": "呐喊",
    "titleEn": "The Scream",
    "era": "1893年",
    "start": 77,
    "end": 83,
    "highlightCandidate": 80,
    "internalUpdateHz": null
  },
  {
    "number": 14,
    "id": "14-nosferatu",
    "titleZh": "诺斯费拉图",
    "titleEn": "Nosferatu: Shadow",
    "era": "1922年",
    "start": 83,
    "end": 89,
    "highlightCandidate": 86,
    "internalUpdateHz": null
  },
  {
    "number": 15,
    "id": "15-oscilloscope",
    "titleZh": "示波器矢量图",
    "titleEn": "Oscilloscope Vector",
    "era": "1950年代",
    "start": 89,
    "end": 95,
    "highlightCandidate": 92,
    "internalUpdateHz": null
  },
  {
    "number": 16,
    "id": "16-pixel",
    "titleZh": "8-bit 像素游戏",
    "titleEn": "8-bit Side-scroller",
    "era": "1980年代",
    "start": 95,
    "end": 101,
    "highlightCandidate": 98,
    "internalUpdateHz": 12
  },
  {
    "number": 17,
    "id": "17-chat",
    "titleZh": "早期聊天窗口",
    "titleEn": "Early Chat Window",
    "era": "2000年代",
    "start": 101,
    "end": 107,
    "highlightCandidate": 104,
    "internalUpdateHz": 8
  },
  {
    "number": 18,
    "id": "18-vaporwave",
    "titleZh": "蒸汽波",
    "titleEn": "Vaporwave",
    "era": "2010年代",
    "start": 107,
    "end": 113,
    "highlightCandidate": 110,
    "internalUpdateHz": null
  },
  {
    "number": 19,
    "id": "19-vertical",
    "titleZh": "竖屏短视频",
    "titleEn": "Vertical Short Video",
    "era": "2020年代",
    "start": 113,
    "end": 119,
    "highlightCandidate": 116,
    "internalUpdateHz": null
  },
  {
    "number": 20,
    "id": "20-code",
    "titleZh": "代码美学",
    "titleEn": "Code Aesthetics",
    "era": "2020年代·大模型时代",
    "start": 119,
    "end": 125,
    "highlightCandidate": 122,
    "internalUpdateHz": null
  }
];

for (const scene of SCENES) Object.freeze(scene);
Object.freeze(SCENES);

export function locate(t) {
  const time = clamp(finiteTime(t), 0, DURATION);
  if (time < 5) return { kind: 'intro', time, localTime: time, scene: null, index: -1 };
  if (time >= 125) return { kind: 'outro', time, localTime: time - 125, scene: null, index: 20 };
  const index = Math.floor((time - 5) / 6);
  const scene = SCENES[index];
  return { kind: 'scene', time, localTime: time - scene.start, scene, index };
}

export function sampleTimes(fps, from = 0, to = DURATION) {
  if (typeof fps !== 'number' || !Number.isFinite(fps) || fps <= 0) throw new RangeError('FPS must be finite and positive');
  finiteTime(from);
  finiteTime(to);
  if (from < 0 || to > DURATION || to < from) throw new RangeError('Sampling range must lie within the film');
  // Compare canonical frame times rather than relying on multiplication landing
  // on an integer: for example, 0.14 * 100 is 14.000000000000002 in JS.
  const startFloor = Math.floor(from * fps);
  const endFloor = Math.floor(to * fps);
  const first = startFloor / fps < from ? startFloor + 1 : startFloor;
  const end = endFloor / fps < to ? endFloor + 1 : endFloor;
  return Array.from({ length: end - first }, (_, index) => (first + index) / fps);
}
