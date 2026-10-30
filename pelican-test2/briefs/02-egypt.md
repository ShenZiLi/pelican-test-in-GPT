# 02-egypt: original art brief

Time 11–17s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Mineral ochre/cyan/red flat wall registers, faint grid underdrawing and own cartouche 鹈鹕测试. Profilebird/frontchest geometricpigment body, almond eye and rigidstandardpose freeze13–14s.

Implementation composition: original two-register painted limestone wall. Upper frieze at y360 contains alternating lotus fans, reed bundles and sun discs; lower register y500–660 has seated scribes and offering tables, with the bicycle becoming another formal procession figure. Pale ruled underdrawing remains visible only in unpainted stone. Palette: limestone #dac393, chalk #f1dfb0, carbon #433727, mineral red #a7543a, blue #397f85, gold #c49a47, malachite #668876. The pelican uses a broad front-facing blue collar and triangular feather apron, profile almond eye/long ochre bill, and ruler-straight limbs. Bicycle wheel rims repeat the frieze's ring motif. Legs hold poseAt(13) throughout13–14s and rejoin the one-second global phase at14s; wheel phase continues. Native title is a low horizontal inscription with an original outlined cartouche reading 鹈鹕测试, not fabricated hieroglyphs.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## Implemented revision and visual inspection

Native1080 review:12/13.5/16s. Upper frieze was lowered to y360–425 and lotus scale reduced to.49, leaving the date at native237px clear. Square underdrawing, four seated scribes and offering tables remain subordinate. Pose freezes13–14s; wheel phase stays global. No fake hieroglyph text: original cartouche contains readable Chinese 鹈鹕测试.

Evidence: `out/qa/ink-final/` (13 native frames); final Bada correction `out/qa/ink-final-bada/` (54/56/58s). Scene modules load cleanly through full-film capture; all randomness remains seeded and assets are baked once.
