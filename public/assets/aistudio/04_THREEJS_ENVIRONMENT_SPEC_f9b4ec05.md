# MAH★P — Three.js Environment Specification

## 1. Objective

Create six distinct Three.js scene configurations that act as the immersive backgrounds of the project stories:

1. Mercury
2. Uranus
3. Pluto
4. Mars
5. Editorial Studio Photography / nature
6. Aurora / punk street-art

These scenes must never replace, recreate or distort the artist's original photography, textile images, illustrations or collages. Three.js provides the spatial environment; authentic MAH★P assets remain the foreground content.

## 2. Rendering architecture

Preferred implementation, subject to the repository audit:
- `three` for WebGL rendering.
- `@react-three/fiber` v9 when actual React major is 19; Fiber v8 only if the existing project is React 18. Do not use the v10 alpha for this production implementation.
- `@react-three/drei` only for concrete helpers that are actually used (e.g. AdaptiveDpr, PerformanceMonitor, CameraControls, or texture helpers).
- A shared scene host with data-driven scene variants. Do not mount six permanent renderers simultaneously.

Architecture concept:

```text
ProjectEnvironmentHost
├── Canvas (one active WebGL context per visible experience)
├── SceneRouter
│   ├── MercuryScene
│   ├── UranusScene
│   ├── PlutoScene
│   ├── MarsScene
│   ├── EditorialNatureScene
│   └── AuroraPunkScene
└── Performance / reduced-motion settings

ProjectStory
├── StickyProjectStage (Three.js canvas + chapter title)
└── EditorialImageSequence (normal-flow HTML images and captions)
```

Prefer one Canvas per active project-detail experience; on the main journey, reuse one persistent project canvas and swap scene parameters as the active chapter changes. Avoid simultaneous full-resolution contexts or duplicated render loops. Unmount inactive route scenes cleanly.

## 3. Shared environment behaviour

- Background layers are rendered by Three.js, not CSS stock photography or remote background images.
- Keep the camera controlled. No free-fly controls or uncontrolled orbit.
- The camera may perform restrained, timed shifts when a new chapter enters, but must not induce nausea.
- The environment remains in a sticky visual layer while the image story flows in front.
- As the content takes over, reduce scene opacity/visual contrast; keep the planet/world present but subordinate.
- Reverse scrolling restores scene prominence. All scroll-linked transitions must be reversible.
- No background audio.
- No constant intense particles, aggressive camera shake or random glitches.

## 4. Planet scene construction

### 4.1 Mercury

Visual identity: grey mineral/metallic, quiet and cratered.

- Main object: detailed sphere or stylised realistic planet with rocky surface relief and visible craters.
- Palette: grey `#7B7373`, secondary warm mineral greys, restrained amber rim.
- Environment: deep black space with sparse stars and fine dust.
- Motion: slow axial rotation, subtle drifting dust; no fast orbit around the screen.
- Mood: close, tactile, metallic and austere.

### 4.2 Uranus

Visual identity: pale cyan, icy, airy.

- Main object: pale blue/cyan ice giant with soft atmospheric limb.
- Palette: cyan `#95BFBC`, pale aqua and cool white.
- Environment: subtle haze and sparse particles; a thin faint ring may be used if it supports the silhouette.
- Motion: very slow rotation and gentle atmospheric drift.
- Mood: cool, light, suspended and spacious.

### 4.3 Pluto

Visual identity: distant, frozen, quiet and mysterious.

- Main object: smaller dwarf planet with a rough ice/rock surface and differentiated terrain.
- Palette: charcoal `#454644`, muted icy greys and restrained desaturated highlights.
- Environment: deep dark space, sparse stars, very low-density dust.
- Motion: slow rotation; minimal camera movement.
- Mood: silence, depth, distance and texture.

### 4.4 Mars

Visual identity: warm, dusty, intense.

- Main object: red/orange rocky globe with surface relief and subtle crater detail.
- Palette: rust, terracotta and orange `#E87F3E`, darker red-brown shadows.
- Environment: fine dust motes and a soft warm atmospheric rim.
- Motion: slow rotation and very restrained dust drift.
- Mood: heat, erosion, raw energy.

## 5. Editorial Studio Photography — nature environment

This is the second act of the existing MAH★P project, not a fourth project.

- Environment: a controlled Three.js nature scene with a darkened or naturally lit green field, layered grass blades and understated organic depth.
- Grass geometry should be instanced/batched; do not create hundreds of independent high-poly objects.
- Motion: gentle wind sway with varied phase; no obvious synchronized oscillation.
- Lighting: soft natural daylight, controlled highlights and shadows; keep the photographs easy to read.
- Palette: deep botanical greens, moss, olive and natural warm light.
- Camera: static or very slowly drifting. Avoid a first-person walkthrough.
- Background movement must not distract from the two original photographs.
- The two page-22 photographs appear as large HTML image elements above the canvas, with aspect ratios and crops preserved.

## 6. Aurora — punk / urban street-art environment

- Environment: layered concrete/urban wall planes, subtle geometry relief, torn-paper poster planes, restrained paint/spray marks and low-key urban light.
- Colour: black, concrete grey, deep purple reference `#7C11B8`, selective muted reds and warm highlights only where they complement the original collage.
- Do not generate a random wall of graffiti or use third-party logos/legible brand marks.
- Do not simulate the actual collage using 3D geometry; show the authentic collage image as a real foreground artwork.
- Motion: subtle lighting shift, slight depth parallax on background layers, tiny atmospheric dust if performance allows.
- Camera: one controlled composition. No fast dolly or violent shake.
- Photography sequence follows the original collage, using the existing source-page-4 images.

## 7. Materials / About / Footer scenes

Do not add a new heavy 3D environment behind the Material table, About or footer unless the art direction genuinely needs it. Materials and About are primarily typographic/image compositions, with the travelling star companion linking them to the project journey. The user requested Three.js for project backgrounds, not indiscriminate 3D everywhere.

## 8. Performance and lifecycle

- Respect `prefers-reduced-motion`; provide static scene poses or substantially reduced animation.
- Support WebGL context loss and restoration gracefully.
- Render only when visible and needed; pause/idle scenes outside their active section where feasible.
- Reduce DPR, particles, shadows, grass density and post-processing on mobile.
- Use instancing for repeated particles/grass.
- Avoid expensive real-time shadows unless visually necessary.
- Use compressed local textures/models only if they exist and are licensed/owned.
- Do not hotlink texture maps.
- Dispose geometries, materials, textures, render targets and renderer-owned resources when the scene is no longer used. Shared cached resources must not be disposed while another scene still uses them.
- Do not create extra canvases or multiple RAF loops as the visitor scrolls.
- Use a CSS/HTML fallback when WebGL is unavailable; the entire project content must remain visible.

## 9. Quality target

The 3D environments should feel like art-directed installations, not game environments. Their job is to establish a mood, provide depth and support the scroll narrative. If a scene competes with the clothes, model or textile, reduce the scene before reducing the artwork.
