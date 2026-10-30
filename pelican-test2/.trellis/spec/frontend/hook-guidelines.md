# Lifecycle without framework hooks

No framework hooks are used. createFilm() resolves after fonts,brush atlas,scene assets and thumbnails are ready. window.film.ready is the external readiness contract. renderAt(t) returns a promise and serializes draws. Player cancellation uses generation tokens; a stale pending play cannot restart after a scrub. See src/main/player.js and audio/engine.js.
