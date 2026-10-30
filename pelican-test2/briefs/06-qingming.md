# 06-qingming: original art brief

Time 35–41s at120BPM. Main creative requirements remain PLAN.md.

Art direction and joke: Independent timberrainbowbridge, boatbelow, detailedstalls and townspeople withink/lightcolorarchitecturalstructure. Crowdturnssequentially37s. Bridgeroadmustactuallycarryrider, entry/exitbaseline700; ownfinelinewatercolorbird.

Implementation composition: original bridge at x200–800, deck rises from y700 to618 and returns to700 on a smooth sine-squared arch. Interlaced timber arch ribs, radial crossbeams, deck planks and a back railing are individually drawn; the bicycle follows this exact contact curve and slope through exported roadAt. Water and a low cargo boat occupy y720–775 below the deck; town stalls stand at x35–210 and x810–990, with a receding pale warehouse belt at y420–545. Crowd silhouettes are small fine-line people in muted robes; their heads turn in sequence starting37s. Palette: paper #e7dcc0, line #5c5b43, diluted green #929d77, pale blue #9aa99a, ochre #b49b69, vermilion #aa7059. Rider is a pale watercolor pelican with a small cap, contour feathering and delicate amber bill; colored washes stay within the fine outlines. No copied bridge perspective, figures or boats.

Exact integration: roadAt(u) returns {y:deckY(x), angle:atan2(deckY(x+180)-deckY(x),180)}, x=u×1000/6. deckY(x)=700 outside200..800; inside it is700−82sin²(π(x−200)/600). Main translates the rear axle to y−44 and rotates the whole rider by angle; 0s/6s have y700 and angle0. Exported deckY is the same function used to paint all planks and beams.

Author independent composition, palette of5–8 colors, foreground/midground/background and physically coherent original pelican/bike interpretation. Write implementation-specific refinements and actualpalette into this brief before coding. No borrowedbriefs/compositions/source/media.

Timing: local0–2s establish,2–4s highlight,4–6s approachframe. Pedalglobalperiod1s; era titles includeChinese/English/year, readable1080p andperiodappropriate. Logical1000-square visiblecrop y218.75..781.25. Preserveentrance/exitroadcontact700 and commonpose; ownbrush/materialalgorithmrequired, notrecoloringneutralrig.

API: docs/production-contract.md. Allrandomseeded; bakecomplexstaticbackgrounds once, noanimationhistory. Inspect actualenter/highlight/exitPNGplusmaterial/ridercloseup, thenmotionandneighborportals. Reportrevisions/limitations. Mainownscommits.

## Implemented revision and visual inspection

Native1080 review:36/37/38/40s. Inspected ascending and descending bicycle contact against the same sine-squared timber deck; both wheels remain visually supported through the bridge crest. Rear rail stays behind rider. Crowd heads turn sequentially from37s, low boat stays below open arch. Endpoint roadAt(0/6) returns baseline700 and angle0. Title crossing the moving framepost at37s reported for central integration polish.

Evidence: `out/qa/ink-final/` (13 native frames); final Bada correction `out/qa/ink-final-bada/` (54/56/58s). Scene modules load cleanly through full-film capture; all randomness remains seeded and assets are baked once.
