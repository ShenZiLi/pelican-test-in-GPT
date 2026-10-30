# 10-wayang: original art brief

Implementation composition: warmly illuminated woven linen screen, brightest behind the rider; asymmetrical carved gunungan/tree wings at either edge and narrow black-red upper stage valance. The central space remains readable as an actual shadow theatre. Palette: lamp cream #f5d9a0, linen #cfac72, leather #2d261d, soot #171d1c, red lacquer #8f3c27, gold #c28d43. A unique long-billed leather puppet has a curled crest, articulated arm, scalloped feather silhouette and real cut-through perforations in grouped rosettes; brass discs mark shoulder/elbow pivots. Main spine rod reaches beneath the body; two thin arm/control rods remain visibly connected to joints. Separate soft offset shadows plus fine leather incisions show material thickness. All puppet joint and wheel poses sample the common global clock at floor(t*10)/10; scenery/camera remain continuous. Static weave, wings and lamplight baked at 1800px.

Time 59–65s at120BPM. Title date: approximately 1800, matching the user brief and shared timeline. Main creative requirements remain PLAN.md.

Final QA: native 1920×1080 captures at 59.3, 62 and 64.7 seconds in `out/qa/manuscript-final/` inspected. The 62-second title crossed a dark carved wing, so lamp-colored keylines now protect all three title lines; the revised frame is `out/qa/manuscript-final-revised/shot-000-t62.000.png`. Actual browser pixel checks in `out/qa/manuscript-check.json` confirm rosette center and petal alpha are zero while surrounding leather alpha is 255. Rider rasters at 62.01 and 62.09 seconds are identical, and at 62.11 differ, verifying the intended 10Hz articulation independently of continuous scenery/camera motion. The three visible rods terminate at actual puppet joints.

Art direction and joke: Warmlinenbacklitpuppetstage, piercedleatherbird/cycle withintricategoldholes, visiblecontrolrods andoriginalmountain/treewings. Wheelsandpuppets10Hz, camera smooth.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.
