# Local tooling layout

There is no remote application backend. tools/serve.mjs serves local files; browser.mjs owns temporary Chrome; render/shot/sheet capture media; encode/mux produce MP4; audio.mjs exports original WAV. Use tools/common.mjs for CLI parsing,atomic JSON and provenance. No database or network account is required.
