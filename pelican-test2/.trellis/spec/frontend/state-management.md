# Time and state

Film pixels depend only on absolute time and immutable assets. No previous-frame paint state, wall clock,unseeded randomness or frameCount in scenes. Player has currentTime/running/preparing and a cancellation generation; AudioContext time drives live playback. Retain the same timeline after seeks. Retro internal clocks are quantized; camera translation remains continuous.
