// Single binding: subsequent painted eras use this adapter, not global scene instances.
export function bindBrush(p) {
  if (!window.brush || typeof window.brush.instance !== 'function') throw new Error('p5.brush 未能加载');
  window.brush.instance(p);
  return {
    version: '2.2.3',
    reset(seed = 721032) {
      p.randomSeed(seed); p.noiseSeed(seed);
      window.brush.noFill(); window.brush.noHatch(); window.brush.noStroke(); window.brush.noField();
    },
    probe() {
      p.push(); p.randomSeed(19); p.noiseSeed(19);
      window.brush.set('HB', '#29352d', 1);
      window.brush.line(-10, 0, 10, 0);
      p.pop();
    },
  };
}
