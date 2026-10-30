# Scene composition

No React component layer. Scene modules export createAssets,drawBackground,drawRoad,drawRider and native drawTitle, with optional drawViewport/cameraAt/roadAt. Follow docs/production-contract.md. Cache expensive static painting once; drawRider consumes the shared poseAt(t). Example:05-song-landscape.js separates a4000px painting from absolute-time ink rider. Never reuse another project scene.
