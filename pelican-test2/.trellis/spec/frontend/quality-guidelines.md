# Frontend verification

Run npm test and npm run test:browser for changed rendering/player/audio. Browser checks compare exact pixels after shuffled seeks,all21 boundaries and actual controls. Inspect real1920×1080 PNGs and encoded video; numerical passes do not prove artistic quality. Load CJK fonts before capture. Maintain bilingual titles >=24px secondary type. Native buttons,labels and keyboard controls remain usable. Commit each checked change locally; exclude out and node_modules.
