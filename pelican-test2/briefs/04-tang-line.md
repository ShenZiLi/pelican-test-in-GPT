# 04-tang-line: original art brief

Time 23–29s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Finepressure-varying pureink whitepaper composition with distantrocks and windblown foliage. Feathers/scarf unfurlinsecondbar, elegantarchedneck andflowingline bicycle.

Implementation composition: warm white scroll, delicately outlined garden stones at lower left, a long willow descending from upper right, a distant two-roof pavilion, and a peony branch at x150/y560. No broad ink washes or filled landscape silhouettes. Palette is restricted to paper #f0eadb, fine ink #3d4035, pale draft #a9aa96, dark pressure accents #252d27. Curves are sampled cubic strokes whose width rises and falls along their length; feathers are many separate tapered shafts. The bird has an airy S neck, layered long wing feathers, delicately hooked bill and an unfilled throat pouch. Two long silk ribbons stream behind at local2–4s, formed by parallel flowing contours and folds, while legs continue global pose. The bicycle is a thin arched roadster with leaflike filigree at the chain guard. Native title uses open horizontal calligraphy with a thin ruled English/date line.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## Implemented revision and visual inspection

Native1080 review:24/26/28s. Pressure-envelope cubic contour drawing, nested open feathers, outlined peonies and discrete willow leaves remain unfilled. Paired silk ribbons lengthen during25–27s, flutter from absolute time, and taper to fine tips. No water washes applied to this line-drawing scene. Early-title contrast across previous dark panel is reported to main.

Evidence: `out/qa/ink-final/` (13 native frames); final Bada correction `out/qa/ink-final-bada/` (54/56/58s). Scene modules load cleanly through full-film capture; all randomness remains seeded and assets are baked once.
