# Autonomous art and sound integration contract

User now authorizes autonomous completion of all stages, no review pauses. FPS60. All code/media original; no reference or sibling source/assets. Main owns integration/shared modules/commits. Never commit from child agents.

## Scene API

Each numbered file exports named functions as needed:
- createAssets({paper,brushAtlas}) -> immutable cached assets. Called once before ready; Canvas2D surfaces CPU contexts.
- drawBackground(ctx,{scene,t,localTime,texture,assets}) draws local1000×1000 art; visible crop y218.75..781.25. Complete composition at all t, no warm-up. ctx local panel origin. A panel is1000 units long; rider worldx=(t-scene.start)*1000/6; terrain contact y700. Avoid important text embedded in side-scrolling background.
- drawRoad(ctx,env) OPTIONAL covers bottom y700..1000 and period-specific path, preserving contact y700. Defaultroad only for placeholders.
- drawRider(ctx,t,assets): ctx origin rear wheel axle, same poseAt(t) geometry as shared rig. Draw your OWN period interpretation rather than recoloring drawCyclist. Rear=(0,0),front=(180,0),radius44,hip(58,-126),head(108,-213),billtip(222,-207). poseAt returnsankles/knees/crank and wheelAngle. Same global t, no phase reset. Caller controls transform and foot contact.
- drawTitle(ctx,{scene,t}) OPTIONAL at native1920×1080 (not localworld). Must legibly include Chinese+English+era, no museumlabel UI. Main provides default if omitted.
- cameraAt(localTime) OPTIONAL returns {zoom,riderScale}; defaults1. For05 begin/end exactly1, shrink rider to~.065 after establishment and enlarge view~2.6 at2–4s to discover it, return before exit. Main applies common transform to scenery/road/rider; all anchors staycontinuous.
- drawViewport(ctx,{scene,t,localTime,texture,assets}) OPTIONAL for19: full native1920×1080 overlay, actual9:16 inset centered (x656.25..1263.75), black outside. Own original UI, own rider treatment sharingpose; no realbrands. This overrides world visually only in active19.
- frameColor string OPTIONAL; native titleInk/background optional throughdrawTitle.

Main registry preparesassets and selects modules; main road painter calls backdrop,road, then per-panel clipped rider and frontframe occlusion. Assets may include actual p5.brush baked atlas supplied by main; use helpersfrom src/kit/art.js where helpful, no globals/random/time dependencies. All scene artwork must hold quality both full composition and close crop. Useview_image toinspectactualPNG; agents may use tools/serve+openFilm for local own tests once main registry integrated. Don't touch main/registry/shared files from scene tasks.

Available art helpers (main creates): makeSurface(w=1000,h=1000)->{canvas,ctx}; rng(seed)->function; poly(ctx,points,fill,stroke,width); stroke(ctx,points,color,width=1,alpha=1); wash(ctx,points,color,alpha=.1,seed=1); dryStroke(ctx,points,color,width=2,seed=1); grain(ctx,seed,count=3000,color='#342817'); ellipse(ctx,x,y,rx,ry,fill,stroke,width). Allsave/restore as needed. Native texthelper from kit/materials.js. Numerics randomAt andposeAt public.

## Anchor direction

01 Sahara: ochre paint on weathered sandstone, layered fissures and tonalrock (not randomnoise flatfill), original elegant herders/longhorn cattlepause/turn towatch secondbar. Oxen silhouettes and pellet/granular pigment. Rider is ochre stonepaint form, bicycle linesirregularincised. Title pigmentinscription with modernreadable English/date. No fake archaeological claims.
05 Song: original monumentalpeak arrangement, distinct distantfog/midrock/foregroundpine, Chinese xuanpaper/drybristle/inkwash/structuralwrinkles. Verysmall inkpelican discovered bycamera. Not traced FanKuan reproduction. Main handlescameraAt values, artist ownsbackground/rider/road/title.
19 Vertical: fictional 苇刻 app; trueportrait, fulloriginalUIicons, timeline finishat119s, likes/comments rise atbeats. Real scene behindUI must be fully artdirected, stylized contemporary pelican and bike distinct from neutral rig. No sampled photos/appassets.

## Audio API (audio agent owns audio/*,tools/audio.mjs,tests/audio.test.mjs only)

Export audio/engine.js createAudioEngine() synchronous returning {play:async(t)=>void,pause:()=>void,time:()=>number,ready:()=>Promise,renderOffline:()=>Promise<AudioBuffer>}. play lazily initializes original whole-film OfflineAudioContext buffer + AudioContext, startsAudioBufferSourceNode atoffsett; time returns offset+context elapsed, pause tearsdownsource. Stable fullscore source means liveand offline identical; main drivesframeclock from time. Duration137,48kHzstereo. Browser context needsuserclick, don't autoaudibleplay on ready.
Export score metadata/events and pure numericplans for testing exactbeats,cues,rates. Everythingproceduralsynthesis, no samples/TTS/remoteaudio. Instrumentmapping and nuancedvaporwave chain in PLAN.md mandatory. Chant is wordlessformants. FourchannelchiptunetwoSQ+triangle+noise. Bellchain,coin,message,flashes original. Outroall20timbresgraduallyfade, onlybell at136.5. Peaknormalize/limiter no clipping. 3baroriginal motif consistent, independently authored.
Vaporwave firstOfflineAudioContext FM EPmaj7/min9, fretlessbass,FM sax, gateddrum, at151.190525987 BPM and+4semitones. Then sourceplaybackRate=.793700525984, LP4k,longgeneratedreverb3–5s,wow0.5Hz,hiss,entry/exitratecurves; secondbarhalfbeatloop3–4times returnsnormalglobalposition. Don't substitutesimplepitchshiftorordinarypad.
Provide audio/render.html and tools/audio.mjs that auto localserver+Chrome, awaitrender, streamPCM16WAV chunks toNode (avoid one giantJSON response), saveout/final/score.wav+metadata for137s6576000stereosampleframes. Youmay addtools/audio.mjs only, don't touch encode/player/package/shared. Main addsfinalAACmux. Testpuremetadata/scoreeventalignment meaningful and runOffline actual exported WAV/peakanalysis.
