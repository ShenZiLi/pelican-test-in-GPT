# 09-bada: original art brief

Time 53–59s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Asymmetricfewwetinkmasses, onebranch/rock andvastpaperleaveblank. Deliberatelyfewcalligraphicstrokesbird rollswhiteeyeat55s. Drywheelarcs, expressivepose, noextraillustrationclutter.

Implementation composition: almost unpainted pale xuan paper. A large blunt black rock emerges at far left x55–180/y620, one crooked bare branch reaches across the upper-right negative space, and just three reed strokes touch the road. Palette: paper #eee9d8, wet ink #172b24, dilute ink #858d76, dry ink #354a3d, seal red #9a4f3e. Bird is deliberately unlike the fine-line riders: one broad wet belly, one slanted wing slash, one crooked neck stroke and one hard long beak. A large paper-white eye carries a tiny pupil that moves upward on55s and holds its disdain through57s. Wheel circles are incomplete dry arcs with only four spokes; pose joints remain exact. The understated native title is high right, balanced against the low-left rock; there is no background flock or decorative filler.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## Implemented revision and visual inspection

Native1080 review:54/56/58s. Lowered branch100 logical units to keep it clear of native title/date. Title follows the departing paper panel right edge after~55.6s, remaining entirely on pale paper at56/58s rather than crossing into dark Wayang border. No label card or opaque title backing. Large paper-white eye raises pupil during55–57.4s; wet ink masses, broken dry arcs and large negative space retained.

Evidence: `out/qa/ink-final/` (13 native frames); final Bada correction `out/qa/ink-final-bada/` (54/56/58s). Scene modules load cleanly through full-film capture; all randomness remains seeded and assets are baked once.
