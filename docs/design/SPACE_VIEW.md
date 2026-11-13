# Space view design

Status: prototype on branch `feat/space-view`. Desktop browsers with WebGL 2 open it by default; phones and narrow windows keep the 2D network view.

## Goals

1. Draw every event as a planet in a black 3D space, with less on screen at once than the 2D network view.
2. Keep time on the X axis, left to right, so a viewer can always tell which year they are looking at.
3. Place linked events near each other, so a cause-and-effect chain forms a visible cluster.
4. Let the viewer move freely (orbit, pan, zoom, fly with the keyboard) and fly the camera to any event they select.
5. Turn the curated chains into guided tours with Back and Next buttons.
6. Hold 60 fps on a laptop GPU with 5,000 or more events.
7. Reuse the existing event panel (sources, perspectives, connected events), search, permalinks and data.

Out of scope for the prototype: editing, the API-backed (non-demo) build, and a phone version of the 3D view.

## Layout

Positions are computed once at data-build time by `scripts/compute_space_layout.py` and stored in `frontend/public/demo/space-layout.json` (about 75 KB for 2,500 events). Browsers do no layout work. The file lists positions in the snapshot's event order and carries a hash of the event ids instead of the ids themselves; the frontend recomputes the hash and refuses a layout built from a different event list.

### X: time

```
x = -UNITS · ln(1 + (REF_YEAR − year) / TAU)
REF_YEAR = 2100, TAU = 60 years, UNITS = 1000 scene units
```

Later years sit further right. The spacing per year grows toward the present: one year near 1914 is about 4 scene units wide, one year near 3000 BCE is about 0.2. Without this, 5,000 years of prehistory and antiquity would take most of the axis while most events fall in the last 500 years. The constants are written into the layout file, and the frontend reads them from there (`src/space/timeScale.ts`), so the axis ticks and the planets use the same scale. A CI step regenerates the file and fails if the committed copy differs.

Events with the same `year_approx` share an X value. Using `date_earliest` for sub-year placement is an open question below.

### Y and Z: force layout around the time axis

X stays fixed. Y and Z start from a deterministic hash of the event id, spread in a disc of radius 160 around the axis, and then run 240 iterations of:

- **Link springs:** each link pulls its two events together in Y/Z toward a rest distance of 14 units. Curated links with a confidence rating pull harder than imported Wikidata "part of" links.
- **Repulsion:** events within 60 units of each other (in 3D) push apart in Y/Z. A spatial hash keeps this to nearby pairs.
- **Axis gravity:** a weak pull toward Y = Z = 0 keeps unlinked events from drifting away.
- **Cooling:** the largest step per iteration falls from 18 to 0.4 units.

The script uses only the Python standard library and FNV hashing, so the output is identical on every run. On the demo snapshot (2,500 events, 1,519 links) it runs in about 4 seconds. Linked events end up with a median Y/Z distance of about 24 units, against about 139 for random pairs.

Planet radius is `1.2 + 0.8·√(link count)`, capped at 5. The file also stores each event's best link confidence (0 unrated, 1 speculative, 2 debated, 3 established).

## Rendering

All rendering lives in `src/space/scene/SpaceEngine.ts`, a plain class that owns the three.js objects. React (`SpaceView.tsx`, `SpaceRig.tsx`) calls `setFocus()` when the selection, hover or tour changes and `frame()` once per frame.

| Layer | Draw calls | Contents |
|---|---|---|
| Glow points | 1 | Every planet as an additive point sprite. Size follows planet radius and distance; color and strength follow the best link confidence. |
| Spheres | 2 | The 500 planets nearest the camera, as instanced icosahedra: the closest 64 at 1,280 triangles, the rest at 320. Body color by category, soft procedural bands, a rim light in the confidence color. |
| Links | 1 | `LineSegments` with only the links near the focus point or touching the selection. |
| Axis | 3 | The time axis, year ticks, and a ring around the axis at the focus year. |

Choices that keep the frame cheap:

- **No textures.** Colors come from per-instance attributes and small shaders.
- **Far planets are points.** A planet farther than 480 units from the camera is drawn only as a glow sprite. The sphere set is rebuilt every 6 frames from a distance pass over all planets.
- **Links on demand.** Ambient links are limited to a radius that scales with zoom (60 to 420 units) and are rebuilt only when the focus moves or the selection changes.
- **No post-processing.** The glow sprites sit behind each sphere and act as a halo, so a bloom pass is not needed.
- **Near fade.** Planets between the camera and the focus fade out with a screen-door dither, which keeps them opaque (no sorting) while they leave the line of sight.
- **Lazy loading.** three.js and the space view load only when the 3D view opens (`React.lazy`, separate `three` chunk, about 190 KB gzipped plus 80 KB for the view). The 2D view and phones never download them.

Link color follows confidence, and the cause end of each line is dimmer than the effect end, so direction reads without arrowheads.

## Selection and focus

- Clicking a planet selects it. Selection opens the existing `EventDetailPanel`, and the camera flies to the planet.
- The selected planet and its linked events stay lit. Other planets dim to dark gray, and links that do not touch the selection drop to a faint trace.
- While the panel is open, the projection centre shifts 240 px left (`camera.setViewOffset`), so the selected planet sits in the middle of the uncovered area.
- Search results, links inside the panel, "On this day" and permalinks all set the same store field (`selectedEventSlug`), so each of them triggers the same flight.

## Camera and navigation

Controls come from `camera-controls` through drei's `<CameraControls>`:

- left drag orbits around the focus point, right drag pans, the wheel zooms toward the cursor;
- W A S D or the arrow keys fly, Q and E move down and up, Shift triples the speed, and speed scales with zoom;
- `H` or "All of history" flies out to the overview.

### Flights

`src/space/FlightController.ts` moves the camera along a quadratic Bézier curve from the current position to a point 16 planet radii (at least 70 units) from the target, approached from slightly above and in front of the axis. The control point bows outward from the cloud by up to 35% of the trip length, so long trips pull back, cross over and come in again. Duration grows with the log of the distance, from 0.9 s to 2.6 s, with cubic ease-in-out. The look-at point moves slightly ahead of the camera, so the destination enters the frame early. Any drag, wheel or movement key cancels a flight.

## Timeline HUD

- A glowing axis runs along X at Y = Z = 0, through the middle of the planet cloud.
- Year ticks are spaced evenly on screen. Each tick rounds to a step that fits the local years per tick, so a zoomed-out axis reads 5000 BCE, 2000 BCE, 0, 1000, 1500, 1800, 1900, 2000 rather than crowding the recent end (`axisTicks` in `timeScale.ts`).
- A ring around the axis marks the focus year in the scene.
- A screen-space readout at the bottom centre displays the year at the focus point and the span of years in view, under a faint vertical hairline through the screen centre. The frame loop writes the text directly to the DOM when it changes, without a React render.

## Guided tours

Chains with `chain_type` of `scholarly` or `popular_internet` become tours: road-to-world-war-i, july-crisis-1914, alliances-before-world-war-i and september-11-to-fifty-shades-of-grey in the current data. Generated chains are left out because nobody has reviewed them.

A tour lights its stops and the links between consecutive stops, and dims the rest. Back and Next (or `[` and `]`) fly to the previous or next stop and open its panel. Stop numbers appear in the labels. Esc ends the tour.

## Mobile and fallback

`src/space/viewMode.ts` picks the view:

1. No WebGL 2, or a non-demo build: 2D.
2. Otherwise `?view=3d` or `?view=2d` in the URL, then the saved choice from the toggle.
3. Otherwise 3D when the window is at least 900 px wide and has a fine pointer, and 2D on phones and narrow windows.

The 2D view has a "3D view" button (top right), and the 3D view has a "2D view" button. A plain list or page view for phones is an open question below.

## Accessibility

- All 3D controls have keyboard equivalents. Buttons are real `<button>` elements with visible focus rings.
- `,` and `.` step to the previous or next linked event of the selection, so a keyboard user can follow a chain without pointing at planets.
- A polite live region announces the selected event and the tour stop.
- `prefers-reduced-motion: reduce` replaces flights with an instant cut and turns off the selected planet's pulse and the HUD transitions.
- The 2D view remains available for screen-reader users, since a WebGL canvas exposes no structure to assistive technology.

## Performance measurements

The box running the prototype has no GPU, so the measurements below use Chrome's SwiftShader software renderer and set a floor rather than a laptop figure. `?fps=1` displays a frame-rate readout, and `?stress=6000` pads the scene to 6,000 planets with synthetic copies (same years, an outer shell, not selectable).

| Scene (1440×900, SwiftShader) | 2,500 events | 6,000 planets |
|---|---|---|
| Overview, glow points only | 34–45 fps | 38 fps |
| Close to a planet, 500 spheres | 14 fps | 17 fps |
| WWI cluster, 240–500 spheres | 21 fps | 19 fps |

At 480×300 the 6,000-planet overview reaches 60 fps, and the sphere views reach about 30 fps. In software rendering the cost is mostly per-vertex work on the 500 spheres. A laptop GPU handles about 160,000 triangles per frame with room to spare, but the 60 fps target still needs a measurement on real hardware.

## Code map

| File | Role |
|---|---|
| `scripts/compute_space_layout.py` | Precompute positions, radius and confidence. |
| `scripts/test_space_layout.py` | Time scale, layout and committed-file tests. |
| `frontend/public/demo/space-layout.json` | Generated layout. |
| `frontend/src/space/timeScale.ts` | Year ↔ X and axis ticks. |
| `frontend/src/space/spaceData.ts` | Snapshot + layout → typed arrays, link adjacency, tours. |
| `frontend/src/space/viewMode.ts` | 2D/3D choice. |
| `frontend/src/space/FlightController.ts` | Camera flight path and timing. |
| `frontend/src/space/scene/SpaceEngine.ts` | three.js objects and per-frame upkeep. |
| `frontend/src/space/SpaceRig.tsx` | Controls, picking, labels, HUD updates. |
| `frontend/src/space/SpaceView.tsx` | Data loading, selection, tours, HUD markup. |

Libraries added: `three` (MIT), `@react-three/fiber` (MIT), `@react-three/drei` (MIT, brings `camera-controls`, MIT). The OSS tool library at `/workspace/oss-library` had no 3D graph entry, so nothing there replaced them.

## Open questions

1. **Sub-year placement.** The July Crisis events all share X = 1914. Using `date_earliest` would spread them by about 0.4 units, which is too small to see at the current scale. A local stretch for dense periods would need a non-monotonic scale or a second axis.
2. **Data beyond the demo.** The view reads the static snapshot. The API build needs an endpoint that serves the layout, or a layout column like `network_y`.
3. **Clusters at overview scale.** At full zoom-out the planets form one long band. Labels for periods or regions could help orientation, and region could also drive Y or Z.
4. **Phones.** The 2D network view stays on phones for now. A list or page view of events and chains may suit small screens better.
5. **Sphere count on low-end GPUs.** The sphere tiers could adapt to the measured frame time, and a 2-triangle impostor shader could replace the meshes.
6. **Very long trips.** A flight from 3000 BCE to 2001 covers the whole axis in 2.6 s. A pull-out-and-dive path might read better than one curve.
