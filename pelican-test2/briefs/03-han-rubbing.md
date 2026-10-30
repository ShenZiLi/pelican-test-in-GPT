# 03-han-rubbing: original art brief

Time 17–23s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Black ink/white incised rubbing, ceremonial chariot procession and original borderbeasts; bicycle mixes solemnly into parade. White carvedbird/horsebone lines withdryerosion, neverneutralcartoon.

Implementation composition: charcoal stone relief with broad stamped ink loss and tiny white paper transfer grains. Three formal horizontal registers: a running cloud-beast border at y330, a two-horse court chariot at x150/y580, and two robed attendants plus a second canopy cart at x700–920. Incised diagonal hatch marks articulate horse necks, robes and the canopy without grey paint. Palette: ink #172321, deep #0c1716, rubbing white #dddcca, worn grey #6b756b, paper fleck #a5ac98. Rider is a solemn angular white silhouette assembled from carved feather chevrons and a hooked beak, with opaque dark gaps as relief channels. The bicycle is engraved ring-and-spoke geometry with broken white contour; no colored fills. Tiny cloud curls become an unbroken ceremonial road border at y700.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## Implemented revision and visual inspection

Native1080 review:18/20/22s. Moved carved upper register down36 units (now365–419), so native title/date do not collide with cloud beasts. Kept clustered pale transfer failures and dense small ink flecks. Horse/cart/courtier procession is independently drawn. Early-title contrast across the previous pale panel is a shared integration concern reported to main.

Evidence: `out/qa/ink-final/` (13 native frames); final Bada correction `out/qa/ink-final-bada/` (54/56/58s). Scene modules load cleanly through full-film capture; all randomness remains seeded and assets are baked once.
