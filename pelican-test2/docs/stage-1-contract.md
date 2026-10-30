# Stage 1 integration contract

Scope: approved silent skeleton, not final era artwork. All original authored files. Node ESM. No agents commit Git; main owns commits.

## Numerical modules (numerical agent owns src/beat, src/rig, src/kit/geometry.js, src/kit/random.js and tests/core.test.mjs)

- src/beat/timeline.js exports DURATION=137, SCENES (20 objects from planning timeline fields), locate(t): {kind:'intro'|'scene'|'outro', time, localTime, scene:null|object, index:-1|0..19|20}. Reject nonfinite t; clamp finite t to [0,137]. Boundary scene selection must switch exactly at its start. Exports sampleTimes(fps,from=0,to=137) with half-open indexed sampling.
- src/beat/clock.js exports pedalPhase(t) radians (1 second/cycle), beatAt(t) position with origin5, strongBeat(t) boolean, roadDistance(t)=(t-5)*1000/6. All absolute time.
- src/rig/pose.js exports poseAt(t) with points {rear,front,crank,hip,ankleLeft,ankleRight,kneeLeft,kneeRight,head,beakTip}, pedalAngle and wheelAngle. Points {x,y}. Rear wheel center=(0,0); front=(180,0), radius44; crank=(80,-22), pedal radius25; hip around(58,-126), leg segment lengths chosen reachable at every angle. Wheel contact y44. Pose coordinates relative to rear axle. Long beak and throat pouch must be clear in drawing. Points continuous over phase boundaries.
- src/rig/draw.js exports drawCyclist(ctx,t,{ink='#29342c',body='#f8f1dd',accent='#bd733f',scale=1,shadow=false}={}). Canvas2D ctx, origin rear axle. Caller owns translation; function saves/restores state and draws rig; no motion loop. Draw elegant recognizable original pelican, complete bicycle/spokes/crank, both pedal-attached legs. shadow mode monochrome.
- src/kit/geometry.js exports clamp, lerp, smoothstep; src/kit/random.js exports deterministic indexed random/hash helpers as needed.
- Tests: exact scene endpoints and 20 coverage, 137s frames, pedal cycles, invariant leg lengths and foot/pedal contact across many phases, no-slip wheel angle against distance, nonfinite inputs. Test first and demonstrate initial expected failure.

## Film renderer (main owns all other src, index.html/styles.css)

- window.film.ready Promise. await window.film.renderAt(t) paints fully and returns {time,kind,sceneId,sceneName}. window.film.metadata includes duration,width,height,silent,seed and scene roster. window.film.pause(), play(), seek(t) available for browser review. User controls have #play-toggle, #seek, #time-display, #scene-name.
- Default film canvas 1920×1080, id film-canvas; wrapper #film-stage. Capture query ?capture=1&width=960&height=540 makes film-only viewport at exact requested size with no controls. width/height preserve16:9. All drawings are reconstructed at absolute t; no auto playback in capture mode. renderer readiness includes all local CJK fonts.
- Art logical space1000×1000. Output logical viewbox x0..1000,y218.75..781.25 (uniform scale). Shared road contact y700, rear axle y656. Camera worldX=roadDistance(t)-420. World panels each1000 units; frame boundary worldX=i*1000. Rider rear axle screenX420, so its rear axle crosses each frame at t=5+6i. Draw adjacent panels/clips so road is continuous. Native overlay titles need not use cropped art coordinates. Refine pulse/Intro/Outro composition in main.
- Retro internal drawing time quantized for scene10/16/17; world/camera remains continuous. Stage1 may use neutral rig across eras; stage2 replaces each era drawing with its own art.

## Tools (tools agent owns tools/* except verify.mjs)

- serve.mjs static server default127.0.0.1:4173, command --port. Serve local node_modules/fonts and ES modules; no directory traversal. Export startServer({port=0}) returning {server,url,close()} for tools auto-start. Running directly starts long-lived server. Tools should auto-start/close their own server when --url omitted.
- browser.mjs helper launch local Chrome via puppeteer-core. Discover CHROME_PATH or cache C:/Users/Admin/.cache/puppeteer/chrome/*/chrome-win64/chrome.exe with node os.homedir; no user profile. Exports openFilm(options) returning {browser,page,close,url}. Film viewport width,height, deviceScaleFactor1; await film.ready and capture query; collect page errors. Can include local server startup.
- shot.mjs --time N --out filename --width1920 --height1080; await renderAt, screenshot only film stage to PNG. Optional --times comma list for numbered screenshots if useful.
- render.mjs --from8 --to14 --fps30 --width1920 --height1080 --out directory [--workers N] [--resume]. Exact half-open frame times from source core, PNG files named frame-000000.png (relative indexing), manifest records source commit AND dirty source hash/config/browser version/count/completed range. Fail on page/asset errors. Resume only matching provenance. Batch browser evaluate+capture in chunks, don't depend on running real-time animation.
- encode.mjs --input directory --out file.mp4: read manifest fps/count, ffmpeg H264 yuv420p -an, check exit. Preserve output on failure; no accidental overwrite unless same explicit target. Must handle -- overwrite authorized generated outputs. ffprobe final JSON report optional.
- sheet.mjs --input directory --out filename [--columns 4] makes readable timestamp/caption contact sheet using sharp. Input may contain capture PNGs or manifest; sampling bounded on large frame dirs, avoid adding generated sheets into their own input. Native 1080p stills remain inspectable.
- package scripts already defined by main. Dependencies pinned; agent must not modify package.json/lockfile or root docs.

## Acceptance and review

No stage2 artwork, audio, remote pushing or sleep. Deliver silent full proxy, 30/60fps pair, contact sheet and actual playback review. All main source changes committed locally only after tests/checks. Update parent approved status while retaining later stages' user gates.
