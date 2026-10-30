# Film rendering conventions

## Pre-development checklist

Read PLAN.md, active task artifacts and docs/production-contract.md. The user authorizes autonomous completion of all stages; final target60fps. Historical stage1 review stops no longer apply.

## Current implementation

`src/main/film.js` constructs a p5 WEBGL output canvas with a p5.Graphics composition surface. The backing 2D canvas is initialized with `willReadFrequently:true` before p5 wraps it: accelerated 2D rasterization caused repeatable 1-LSB edge differences under shuffled seeks. Do not remove this without demonstrating exact pixel repeatability. `src/kit/brush.js` owns the single brush binding; twenty original painted/digital eras are now registered in src/scenes/registry.js.

`window.film.ready` includes CJK font readiness, baked textures and thumbnails. `await window.film.renderAt(t)` reconstructs the full composition. Avoid frameCount, unseeded randomness, playback-history trails and asynchronous assets in scene draws. Static texture lives in `src/kit/materials.js`; a single seed controls it. Same-runtime exact PNG comparisons are in `tools/verify.mjs`.

Logical scene units are 1000×1000, with a uniform 16:9 viewbox rather than distorted aspect scaling. Film titles are output-resolution overlays. Road position is `roadDistance(t)`, wheel spin is no-slip distance/radius and pedal phase is absolute time. `src/rig/pose.js` owns joint positions and leg constraints; artistic drawing does not modify these constraints.

Frames have back borders and a front-post layer to occlude the rider. Outro's final-era image samples the scene's terminal view so pullback does not rewind the road. Do not substitute an unrelated highlight at the full-screen handoff.

## Validation

Run `npm test` for numerical and tool contracts, and `npm run test:browser` for actual rendering/seek/controls. Inspect generated stills/contact sheets and play exported videos. `tools/encode.mjs` checks H264, yuv420p, frame count, resolution and no audio for the intermediate silent video. tools/mux.mjs then validates final H264/AAC audio/video. Correct metadata is not proof of visual craft.

Commit source and compact review records; exclude `node_modules/` and `out/`. Each render manifest hashes source/config/browser and refuses mismatched resume. Avoid changing source during a render. Main owns commits and shared interfaces; subagents modify only assigned files.
