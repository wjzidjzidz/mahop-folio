# MAH★P — Complete Technical Reference Bundle V2

This consolidated file contains the master blueprint, all technical specifications, asset register, official library references and project Skills. The Custom Instructions and Master Prompt are intentionally separate files.


---

<!-- BEGIN 01_MAHOP_MASTER_BLUEPRINT_V2.md -->

# MAH★P — Master Blueprint V2

**Version:** 2.0 · **Status:** Approved creative direction and implementation specification · **Date:** 20 November 2026

## 1. Project definition

MAH★P is an image-led portfolio and immersive digital exhibition for fashion and textile creation. It presents original fashion photography, garment silhouettes, textile samples, illustrations and collages through distinct visual worlds.

The core experience is not a conventional portfolio grid. It is a continuous, scroll-led journey in which each project establishes its own atmosphere and then lets the artist's authentic imagery take over.

**Central statement:** *A stage, not a catalogue.*  
**Motion principle:** *Reveal, settle, drift.*  
**Experience principle:** *The more the visitor explores, the more of the work is revealed.*  
**Visual priority:** original creations first; interface and effects second.

## 2. Approved non-negotiable creative decisions

| Area | Approved decision |
|---|---|
| Brand | `MAH★P` / visible wordmark `MAHOP` where the original wordmark uses that spelling; keep the star mark consistent with the existing brand component |
| Main environment | Nocturnal textile theatre; black as the primary stage |
| Homepage | Large MAHOP wordmark; low-opacity original project images drifting in layered directions |
| L'ETOILE MAHO | Four chapters: Mercury, Uranus, Pluto, Mars; each has an original Three.js planet environment |
| Planet scroll behaviour | Planet and scene remain visually anchored behind content; their opacity reduces as the image story takes over, then restores on reverse scroll |
| MAH★P project | Preserve the white collage act; follow it with the green/natural “Editorial Studio Photography” act |
| Editorial Studio Photography | Three.js natural environment with grass/vegetation motion; original source-page-22 photographs stay dominant |
| AURORA DE LIAGE X AURO DA'PUNK | Three.js urban/punk/street-art world; original collage and fashion photographs remain authentic foreground artwork |
| Project backgrounds | Three.js-generated environments; do not use generic raster/stock backgrounds for the project worlds |
| Materials | Exactly 24 current mapped sample images in one visual table; clickable details; progressive and reversible disappearance during scroll |
| About | Appears after the 24-sample Materials sequence; heading above; existing authentic illustration centred; factual text beside it |
| Companion star | A recognisable star follows the visitor through the full page and arrives at the centre of the white footer |
| Footer | White, calm, minimal; retain current contact information |
| Final phrase | `THE JOURNEY ENDS HERE. THE CREATION CONTINUES.` |
| Experience | Native, user-controlled scroll; no scroll-jacking or forced autoplay |
| Audio | None; no ambient soundtrack or autoplay sound |
| Language | Visitor-facing content in English, except original project names/credits; project coordination in French |
| Existing URLs | Preserve all current principal routes and direct-load behaviour |

## 3. Experience architecture

### 3.1 Primary journey on `/`

The homepage is the main continuous exhibition. The visitor should be able to move naturally from the opening stage through the key projects, Materials, About and Contact/footer.

Recommended sequence:

1. **The Gateway — Home:** oversized wordmark and low-opacity drifting original images.
2. **L'ETOILE MAHO:** short project introduction followed by four immersive chapters in source order: Mercury → Uranus → Pluto → Mars.
3. **MAH★P — White Interlude:** original white collage compositions from pages 20–21, preserved as white, flat, intact artworks.
4. **MAH★P — Editorial Studio Photography:** green natural environment, generated in Three.js, behind the two original photographs from page 22.
5. **AURORA DE LIAGE X AURO DA'PUNK:** punk/urban Three.js environment with original page-3 collage and page-4 photography sequence.
6. **The Material Table:** all 24 mapped textile images appear together. Scrolling progressively removes selected samples; reverse scrolling restores them.
7. **About — The Creator Revealed:** full About section only after the material sequence reaches its final state.
8. **The Final Destination:** white footer; companion star settles centrally; existing contact links remain visible.

The sequence may be refined to improve pacing, but the named project order and user-approved sections must remain present. Do not remove the White Interlude because it is an important original MAH★P composition.

### 3.2 Existing routes to preserve

```text
/
├── /work
│   ├── /work/letoile-maho
│   ├── /work/mah-star-p
│   └── /work/aurora-de-liage-x-auro-dapunk
├── /material
└── /about
```

All seven routes must remain valid on direct navigation and refresh. Use the current router; do not migrate the framework or change slug spelling. The home route is the continuous overview. Project detail routes provide the full project-specific experience, not a generic template. `/material` opens the complete Material Table followed by About; `/about` is a direct entry to the About destination.

### 3.3 Navigation

Retain a restrained global navigation with the MAH★P brand mark and links `WORK`, `MATERIAL`, `ABOUT`. It should be legible but should not cover faces, garments, material samples, the centre illustration or other essential artwork. The navigation must work with pointer, keyboard and touch.

The star companion is not a replacement for navigation. It is a decorative narrative device with no navigation responsibility unless a deliberate accessible action is added.

## 4. Project experience specifications

### 4.1 L'ETOILE MAHO — four planetary chapters

The project is one collection with four named chapters, not four separate portfolio projects. Each chapter gets its own Three.js scene and restrained accent palette.

| Chapter | Accent reference | Scene character | Source-supported content |
|---|---|---|---|
| Mercury | Grey `#7B7373` | Rocky grey planet, cratered/mineral surface, restrained warm rim light, sparse fine dust | Source pages 8–9; grey knit samples and model/illustration assets |
| Uranus | Pale cyan `#95BFBC` | Icy cyan planet, pale atmosphere, thin subtle ring, drifting cold haze | Source pages 10–11; pale-blue/white textile samples and model assets |
| Pluto | Charcoal `#454644` | Dark frozen dwarf planet, icy/rocky surface, muted halo, sparse stars | Source pages 12–13; grey/blue textile samples and model assets |
| Mars | Terracotta orange `#E87F3E` | Rust-red/orange planet, dust motes, rocky relief, warm atmospheric rim | Source pages 14–15; orange/brown textile samples and model assets |

The project introduction uses the current collage and model/illustration assets. The source page 7 photographic sequence remains part of the project. Each chapter should transition from a visible planetary scene into an image-led editorial sequence.

**Scroll behaviour:** the planet and scene remain in a sticky visual layer as the visitor scrolls through the chapter. The scene does not disappear immediately. Its opacity progressively reduces while the photos, silhouettes, illustrations and textile details move into the foreground. The chapter title remains part of the composition. On reverse scroll, the photo sequence withdraws and the same planet scene becomes more visible again. Each chapter transition must be reversible and deterministic.

### 4.2 MAH★P — two acts

**Act I — White Interlude (source pages 20–21)**
- Preserve the source compositions as the original white collage interruption.
- Use the flattened compositions intact and in their original colours.
- Do not apply a black overlay, recolour the white band, reconstruct torn edges inaccurately or replace the composition with generated art.
- This act is the intentional pause between the darker project worlds.

**Act II — Editorial Studio Photography (source page 22)**
- Use a natural, green environment with grass and vegetation, built as a Three.js scene.
- The environment should feel like an editorial outdoor set, not a game level or synthetic stock-photo background.
- Preserve the two original source photographs as the main visual subject.
- The grass can move subtly as if under a light breeze; use layered depth, gentle parallax and realistic restrained lighting.
- The photographs may appear at large scale with alternating left/right placement, subtle zoom and mask reveals.
- Keep the source credits: Photographer Avi Bellaiche; Model BAAN.

### 4.3 AURORA DE LIAGE X AURO DA'PUNK

- Create a Three.js punk/urban/street-art environment using dark concrete, layered wall planes, torn-poster relief, restrained paint marks and low-key urban lighting.
- It must feel like a designed installation, not a generic graffiti wallpaper or a random collage generator.
- The original source-page-3 collage is a leading composition. Keep its torn paper, black crochet and gold-fabric details intact.
- Then reveal the source-page-4 fashion photography as the foreground editorial sequence.
- The background can contain 3D planes, restrained depth and subtle environmental movement; it must never obscure the original model, garment or collage.
- Keep the verified credits: Photographer Raphaël Kassouri; Stylist `@Playarabian`; Model Brazy; Dress by Aurelia Mahop Di Toro.

## 5. Image-first visual hierarchy

The work is the hero. The implementation should feel approximately 80% image/visual experience and 20% supporting copy at the level of visual emphasis; this is a creative guideline, not a rigid measurement.

- Use large photographs, varied aspect ratios and asymmetric editorial compositions.
- Use full-bleed images where the source crop allows it.
- Use close-up material details where original assets support them.
- Mix still images with only a few carefully choreographed zooms, horizontal drifts, clip reveals and parallax movements.
- Keep text short: project title, chapter, verified credit, and occasional concise caption.
- Avoid repeated identical cards and long explanatory paragraphs.
- Do not distort photographs to fit a layout. Preserve the source ratio and choose `contain` or a source-approved crop.
- Keep every original illustration, collage and textile texture recognisable.

## 6. Material Table and About reveal

Materials is a single composed table containing all 24 currently mapped textile-swatch images. It is not an e-commerce catalogue and not a conventional searchable dashboard.

- Show all 24 samples together at the entrance to the section.
- Use a clear table/grid rhythm with deliberate spacing; desktop should read as one complete archive board.
- Each sample is clickable/tappable and opens an enlarged detail view with the real image, neutral identifier and only source-backed notes.
- As the visitor scrolls forward, individual samples or small groups fade/translate away in a deliberate stagger. Do not make the entire board vanish at once.
- On reverse scroll, selected samples reappear. The sequence is scrubbed/reversible, not a one-time exit animation.
- The final sample sequence completes before About becomes fully visible.
- The About heading appears above the existing, authentic illustration. The illustration is centred and visually dominant; the verified About text sits beside it.
- Do not fabricate biography, awards, education, dates, employers, clients, exhibitions or technical textile properties.

Full interaction details are in `07_MATERIAL_TABLE_ABOUT_CONTACT_SPEC.md`.

## 7. The companion star and final footer

A small but recognisable MAH★P star companion accompanies the visitor throughout the primary journey.

- It should feel like a floating guiding star, not a mouse cursor replacement.
- Its position is choreographed with scroll progress, without blocking links or artwork.
- It remains recognisable across the planetary, natural and punk worlds. It may change only subtle lighting/tint, not its silhouette or identity.
- It should be understated during image-heavy sequences.
- At the end, it moves to the exact centre of the white footer, settles and holds.
- The footer reveals: `THE JOURNEY ENDS HERE.` and `THE CREATION CONTINUES.`
- Retain the verified email, phone and social handles/links currently present. Do not add a contact form.

## 8. Art direction system

- Primary stage: black `#000000`.
- Warm white: `#F5F3EF`; final footer may use pure white `#FFFFFF` as explicitly requested.
- Secondary grey: `#B8B5B1`.
- Display type: preserve the current established display font (existing documentation reports Anton; verify in repository).
- Body/UI type: preserve the current established body font (existing documentation reports Space Grotesk; verify in repository).
- Use project-specific colour accents only where they support the project identity.
- Preserve the deliberate white MAH★P composition.
- Use negative space, scale, fine rules, discreet labels, asymmetry and typography as an editorial system.
- Avoid generic SaaS design patterns, e-commerce styling, heavy glassmorphism, unnecessary gradients and dashboard UI.

## 9. Technical boundaries

- Preserve the existing React 19, TypeScript, Vite, Tailwind CSS 4, router and Netlify configuration if verified in the actual repository.
- Introduce Three.js via React Three Fiber v9 only after verifying actual React version; the official R3F documentation pairs Fiber v9 with React 19 and Fiber v8 with React 18.
- Use GSAP + ScrollTrigger as the one primary scroll-timeline system if installed/compatible. Use `@gsap/react` and scoped cleanup patterns. CSS may handle simple micro-interactions.
- Do not add Lenis, Motion/Framer Motion, React Spring or a second overlapping scroll animation system unless a concrete need is proven.
- No backend, database, authentication, API keys, external API, tracking, analytics, payment, billing or paid service.
- No audio or autoplay video.
- All MAH★P artwork remains local and original. Never replace it with stock or AI-generated fashion imagery.
- Do not publish, deploy, push or change the live Netlify site automatically.

## 10. Completion definition

The project is complete only when all sections and routes are implemented, responsive and navigable; all scroll animations reverse correctly; all three project identities and six Three.js scene variations are present; all 24 real samples and the About illustration are preserved; accessible fallbacks exist; existing build/test commands pass where available; and the final report distinguishes verified tests from unverified items.


<!-- END 01_MAHOP_MASTER_BLUEPRINT_V2.md -->


---

<!-- BEGIN 02_ART_DIRECTION_AND_DESIGN_SYSTEM.md -->

# MAH★P — Art Direction & Design System

## 1. Creative proposition

**Nocturnal Textile Theatre — a stage, not a catalogue.**

The design language combines editorial fashion photography, textile material studies, art-school collage, spatial installation and subtle cinematic motion. The site must feel composed by an art director, not assembled from a generic portfolio template.

The visual order is always:

1. Authentic fashion work.
2. The current project's atmosphere.
3. A concise title/credit/caption.
4. Navigation and decorative interface.

## 2. Global palette

| Token | Value | Use |
|---|---|---|
| `--mahop-black` | `#000000` | Main nocturnal stage |
| `--mahop-warm-white` | `#F5F3EF` | Editorial contrast and light surfaces |
| `--mahop-white` | `#FFFFFF` | Final footer and authentic white collage context |
| `--mahop-grey` | `#B8B5B1` | Secondary text/rules |
| `--mercury-grey` | `#7B7373` | Mercury accents only |
| `--uranus-cyan` | `#95BFBC` | Uranus accents only |
| `--pluto-charcoal` | `#454644` | Pluto accents only |
| `--mars-terracotta` | `#E87F3E` | Mars accents only |
| `--aurora-purple` | `#7C11B8` | Aurora accent reference; use sparingly |
| `--editorial-green` | `#345727` / `#485E39` / `#618F65` | Natural photography environment accent references from the prior archive |

These are starting visual references, not permission to tint original photographs. Do not use low-contrast accent values for essential text before contrast checks. Keep the main type high-contrast.

## 3. Typography

Inspect the actual repository before changing type. Existing MAH★P documentation identifies Anton for display and Space Grotesk for body/UI. Preserve those if currently loaded and licensed in the project. Do not add a new font simply for novelty.

- **Display:** large, confident uppercase wordmarks and project/chapter names; compressed/strong but readable.
- **Body:** neutral modern sans, comfortable line length and generous line height.
- **Metadata:** small uppercase labels, discreet editorial numbering and source references.
- Avoid all-caps paragraphs, very small credits and decorative type behind detailed photographs.

## 4. Composition rules

- Use deliberately varied image scales rather than repeated card dimensions.
- Establish a focal point per viewport.
- Protect silhouettes, faces, garments, embroidery and fabric texture from overlapping UI.
- Preserve negative space around important cut-outs and original collage edges.
- Use intentional asymmetry with a clear visual balance; do not create randomness for its own sake.
- Keep captions near the relevant image but away from the main visual subject.
- Use horizontal and vertical compositions according to source image aspect ratio.
- Maintain a clear visual rhythm: spectacular reveal → quiet viewing moment → detail → transition.

## 5. Project identity treatments

### L'ETOILE MAHO
Four visual chapters share one collection identity, but not one generic colour wash. Each planet has a distinct Three.js surface, lighting, atmosphere and accent colour. Keep all chapter colour local to the chapter.

### MAH★P — White Interlude
The original pages 20–21 are a purposeful white interruption. Preserve the white field, green-lit torn strips and MAH★P wordmark. It is not a blank white page to redesign or recolour.

### MAH★P — Editorial Studio Photography
Natural green/olive environment with grass, organic depth, soft daylight and the original page-22 photographs. The greenery is a Three.js background environment; photographs remain foreground originals.

### AURORA DE LIAGE X AURO DA'PUNK
Underground fashion, street art and punk collage. Use concrete, layered paper/poster geometry, painted surface texture, restrained red/purple accents and controlled urban light. Do not turn it into a generic graffiti stock wall.

## 6. Home hero

- Oversized MAHOP wordmark as the dominant anchor.
- Original images from all three projects drift around it at low opacity.
- Use several independent motion paths: horizontal, vertical and gentle diagonal movement.
- Create depth using scale, blur only where it does not degrade the source art, layering and opacity—not aggressive 3D rotation of photographs.
- Keep the first viewport calm enough to read the logo instantly.
- On scroll, the hero composition should recede naturally into the first exhibition movement.
- The hero does not need a new Three.js scene; keep it editorial and lightweight. Project-specific backgrounds are the designated Three.js environments.

## 7. Star companion visual identity

Use the existing MAH★P star mark if a reusable SVG/component is present. If not, create a clean local inline SVG based on the star mark already used by the brand, not a generic emoji.

- Fixed or absolutely positioned within a controlled journey container, with pointer events disabled.
- Small luminous core and restrained soft halo; no large particle trail.
- Remains recognisable in black, green, purple and white scenes.
- At the footer, the star becomes the focal point at centre, with motion settling rather than looping noisily.

## 8. Do not use

- Generic rounded portfolio cards for every project.
- Product prices, shopping carts or e-commerce UI for textile samples.
- Fake 3D mockups of actual garments.
- AI-generated replacement models, garments, collages or textiles.
- Random gradients, glass panels, floating UI cards or HUD labels with no meaning.
- Unrestrained blur, bloom, glitch or screen shake.
- Perpetual motion on every image.
- Decorative elements that compete with the artist's work.


<!-- END 02_ART_DIRECTION_AND_DESIGN_SYSTEM.md -->


---

<!-- BEGIN 03_INFORMATION_ARCHITECTURE_AND_CONTENT.md -->

# MAH★P — Information Architecture & Content Specification

## 1. Routes (preserve exactly)

| Route | Purpose | Required behaviour |
|---|---|---|
| `/` | Main continuous journey | Home → featured project experiences → Materials → About → Contact/footer |
| `/work` | Curated project archive | Three distinct project entries; not a repeated card grid |
| `/work/letoile-maho` | L'ETOILE MAHO | Four planetary chapters and its original image sequence |
| `/work/mah-star-p` | MAH★P | White Interlude followed by Editorial Studio Photography |
| `/work/aurora-de-liage-x-auro-dapunk` | Aurora | Punk collage → fashion photography |
| `/material` | Material Table | 24 samples, detail interaction, then About reveal |
| `/about` | Direct About destination | Directly reveal the same verified About content and illustration |

No route may be renamed. All must load directly and survive refresh under the current router/Netlify configuration.

## 2. Main journey `/`

### Movement 01 — The Gateway
- Large MAHOP wordmark.
- Supporting identity line currently used by the site, e.g. `NOCTURNAL TEXTILE THEATRE` / `A STAGE, NOT A CATALOGUE`.
- Low-opacity original images from L'Étoile, MAH★P and Aurora drift in layered directions.
- Short scroll cue; no blocking intro or long mandatory preloader.

### Movement 02 — L'ETOILE MAHO
- Intro title and source-backed short description.
- Four chapters in exact order: Mercury, Uranus, Pluto, Mars.
- Each chapter shows its planet scene, then image-led sequences.
- Route CTA to the detail page.

### Movement 03 — MAH★P
- White Interlude using the two original flattened source compositions.
- Editorial Studio Photography as a second act with the grass/nature Three.js environment and two original photos.
- Preserve current photographer/model credit.

### Movement 04 — AURORA DE LIAGE X AURO DA'PUNK
- Dark punk/urban environment.
- Original collage appears first.
- Photography sequence follows.
- Route CTA to the detail page.

### Movement 05 — Materials → About → Contact
- One full 24-image table.
- Scroll-linked, staggered and reversible image exit sequence.
- About only fully appears after the material sequence completes.
- Existing illustration central, verified text beside it.
- White footer with the travelling star and existing contact details.

## 3. Work archive `/work`

Display exactly the three currently published projects:

1. `L'ETOILE MAHO` — four planetary chapters; page/source range 6–15.
2. `MAH★P` — white collage and Editorial Studio Photography; page/source range 20–22.
3. `AURORA DE LIAGE X AURO DA'PUNK` — collage and photography; page/source range 3–4.

Use variable editorial compositions and one strong authentic image per project. Each entire project item must be keyboard-accessible and link to the existing detail route. Do not invent a fourth project or split Editorial Studio Photography into a standalone route; it is a sequence inside the MAH★P project.

## 4. Source-backed project content and credits

### L'ETOILE MAHO
Four chapters: Mercury, Uranus, Pluto, Mars.

Project-level credits verified in the existing Work archive:
- Models: Julien, Kyma & Chaïna
- Photographer: Sirine
- Clothing made by: Aurelia Mahop Di Toro

Keep credits at project level unless the source asset mapping proves a chapter-specific credit. Do not extend credits to other projects.

### MAH★P
White Interlude: source pages 20–21.
Editorial Studio Photography: source page 22.
- Photographer: Avi Bellaiche
- Model: BAAN
- Garment maker is not credited in this source; do not add one.

### AURORA DE LIAGE X AURO DA'PUNK
Source pages 3–4.
- Photographer: Raphaël Kassouri
- Stylist: `@Playarabian`
- Model: Brazy
- Dress by: Aurelia Mahop Di Toro

Do not interpret the `X` in the title, invent a project story or alter spelling/punctuation.

## 5. About content

- Preserve the existing About page content and illustration(s).
- The About layout is newly approved: heading above; illustration centred; concise verified text alongside.
- Use the existing factual description of the work: fashion, textile architecture, photography, collage, illustration and visual art.
- Do not invent career history, biography, age, education, exhibitions, awards, client names, dates or personal narrative.
- Where there is no supported biography, use a short artistic statement based only on the work already presented.

## 6. Contact details (preserve exactly)

- Email: `theycallmemaho@gmail.com` → `mailto:theycallmemaho@gmail.com`
- Phone: `+39 375 1295019` → `tel:+393751295019`
- Instagram handle: `@callmemahop`
- TikTok handle: `@callmemahop`

Use the exact existing Instagram/TikTok URLs already stored in the current project. If an actual destination cannot be verified from source, keep the existing handle as text rather than inventing a URL. Do not introduce a third-party contact form.

## 7. Visitor-facing copy direction

Use short editorial copy, not generic marketing claims. Suitable UI phrases include:

- `A STAGE, NOT A CATALOGUE`
- `NOCTURNAL TEXTILE THEATRE`
- `ENTER THE CHAPTER`
- `MATERIAL TABLE`
- `THE CREATOR BEHIND MAH★P`
- `THE JOURNEY ENDS HERE.`
- `THE CREATION CONTINUES.`

These are proposed interface labels, not factual claims. Preserve the original title and credit wording where supplied by the source.

## 8. Editorial integrity

Never invent:
- Textile fibre/composition, weave, technique, provenance or manufacturing specifications.
- Garment names, collection dates or commercial availability.
- Model/photographer/stylist credits.
- Project descriptions that imply unsupported intentions or outcomes.
- External clients, brand partnerships or professional achievements.

Use neutral material IDs (`MATERIAL 01` … `MATERIAL 24`) where source descriptions do not provide a real name. Keep visitor-facing UI in English, except original names/credits.


<!-- END 03_INFORMATION_ARCHITECTURE_AND_CONTENT.md -->


---

<!-- BEGIN 04_THREEJS_ENVIRONMENT_SPEC.md -->

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


<!-- END 04_THREEJS_ENVIRONMENT_SPEC.md -->


---

<!-- BEGIN 05_SCROLL_AND_MOTION_DESIGN_SPEC.md -->

# MAH★P — Scroll & Motion Design Specification

## 1. Motion philosophy

**Reveal, settle, drift.** The visitor discovers the work through movement, but the movement should never take control away from them.

The experience uses native vertical scrolling. GSAP + ScrollTrigger is the preferred scroll-linked timeline system if the repository audit confirms compatibility and the dependency is not already present. `@gsap/react` should be used for scoped React animation lifecycle where appropriate. CSS handles simple hover/focus/micro-interactions only.

Do not mix GSAP with another full animation framework. Do not install Lenis initially. Do not hijack wheel/touch scrolling.

## 2. Home hero image drift

- Large MAHOP logo remains the main anchor.
- Several original project images float around it at low opacity.
- Use independent slow paths: left-to-right, right-to-left, top-to-bottom, bottom-to-top and restrained diagonal movement.
- Use a small number of images per viewport, layered by z-index and scale.
- Movement should be slow enough to read the wordmark immediately.
- The images are authentic assets, not stock or generated replacements.
- On scroll, the hero collage naturally recedes/clears to reveal the first project experience.
- On reduced motion, show a static art-directed collage.

## 3. Reusable project scroll sequence

Each chapter/project uses a reusable **sticky scene + flowing editorial content** pattern.

```text
ProjectStorySection (long vertical track)
├── StickyStage (top: 0; height: 100svh)
│   ├── ThreeCanvas (planet / grass / punk scene)
│   ├── chapter/project title (persists)
│   └── scene opacity / visual intensity tied to scroll progress
└── EditorialSequence (normal document flow)
    ├── original hero image
    ├── full-width image(s)
    ├── detail crops / collages
    └── concise captions / credits
```

Important behaviour:
- The scene and planet remain stationary in the sticky stage while the user scrolls through the image sequence.
- At the beginning, the scene is prominent and the chapter title is clear.
- As content enters, the scene's opacity and contrast gradually decrease. It should remain faintly visible rather than disappearing abruptly.
- The original images move into the foreground and become the dominant visual layer.
- Keep the chapter title visible/anchored for the appropriate portion of the sequence.
- At the end, the scene may settle into a low-opacity state before the next world begins.
- Reverse scrolling naturally scrubs the timeline backward: photos withdraw, scene opacity rises, and the title returns to its introductory relationship with the planet.
- Never implement this as one-way `onEnter` / `onLeave` class toggles that fail when scrolling upward.

Use `scrub` or an equivalent scroll-progress mapping for this scene. Choose sticky/limited pinning so it remains compatible with touch scrolling, browser scroll restoration and reduced-motion behaviour. If ScrollTrigger pins a section, use one well-defined trigger per chapter with cleanup and refresh handling.

## 4. Chapter-specific choreography

### Planet chapters

1. Chapter label/title appears.
2. Planet becomes visible with the chapter palette and quiet ambient movement.
3. First original collage/illustration or photograph enters.
4. Additional large image compositions arrive with varied direction and scale.
5. Planet layer reduces opacity while foreground images dominate.
6. Last image exits or settles; next chapter's visual world prepares.
7. Scrolling upward reverses every phase.

Do not repeat the exact same image animation four times. Keep the shared interaction logic but vary composition and timing for each planet.

### MAH★P White Interlude

Use an elegant white-field transition. Preserve original pages 20–21 without a darkening filter. The original collage itself supplies its texture and visual detail; do not add a competing synthetic scene.

### Editorial Studio Photography

The green Three.js environment appears behind the two actual photos. Use gentle organic parallax and image reveals. The environment can become more visible between images and recede behind each large photo as it enters.

### Aurora

A controlled transition from torn-paper collage into direct photography. The background remains punk/urban; original collage and photos are revealed in a deliberate sequence. A subtle poster-peel/mask transition is allowed, but must not damage or counterfeit the source composition.

## 5. Image animation grammar

Use a curated combination of:
- slow scale from approximately 1.02–1.06 to 1.0 (never a distracting constant zoom);
- x-axis translation of a small percentage of the container width;
- masked reveal/clip-path or a simple overlay wipe;
- staggered entrances for a related image group;
- subtle depth shift/parallax on selected images;
- one or two horizontal editorial sequences where content benefits from it.

Do not:
- animate every image simultaneously;
- use large bouncy springs;
- rotate original photographs aggressively;
- use scroll snapping as a forced navigation system;
- use horizontal scroll as the only way to access content;
- cause content to disappear permanently after one-way triggers;
- hide text or photos until an animation completes.

## 6. Material Table motion sequence

- Start with all 24 mapped items visible.
- A scroll-progress timeline distributes exit moments across the section.
- Items disappear in small staggered groups or an authored sequence, not all at the same time.
- Some samples may remain visible longer to make the table feel like it is being gradually dismantled.
- Exit can combine opacity with small translation/scale; keep the sample texture readable until it fades.
- As the sequence nears completion, the remaining samples drift/fade away to expose the About composition below/behind.
- At completion, About is fully revealed.
- Reverse scroll restores samples according to the same timeline in reverse; do not generate new random arrangements on each scroll.

## 7. Companion star choreography

- Use one persistent star element, not separate unrelated stars per section.
- Its position changes with page/section progress and may drift gently in small, authored paths.
- It should not sit on top of faces, garments, captions, buttons or sample images.
- It may be a light DOM/SVG overlay for performance and precision; it does not need its own WebGL renderer.
- Keep pointer events disabled unless an explicit usable interaction is added.
- The star must never be the only way to navigate or understand progress.
- Near the final section, its path curves toward the footer centre; it slows, settles and holds.
- Footer final phrase appears with the settling motion, not as a sudden pop.

## 8. About reveal and footer

- About stays concealed/secondary while the 24-sample table is being explored.
- When the last samples clear, reveal the full About block: title above, original central illustration, text beside.
- The final white footer emerges after About; the star arrives centre.
- Contact links appear in a calm static layout and remain readable without motion.

## 9. Lifecycle and implementation discipline

- Prefer `useGSAP`/`gsap.context` with component scoping and cleanup.
- Kill/revert ScrollTriggers and timelines when route components unmount.
- Recalculate trigger positions after fonts/images/layout changes with the documented refresh lifecycle.
- Avoid direct style mutations outside the timeline owner where possible.
- Do not animate the same property simultaneously from GSAP and CSS.
- Do not use unscoped global selectors on repeated project components.
- Keep React state out of frame-by-frame animation updates; use refs/GSAP for transient visual updates.

## 10. Reduced motion

For `prefers-reduced-motion: reduce`:
- show the hero collage in a static balanced arrangement;
- show project environment as a static scene or simplified fallback;
- remove scroll-scrubbed fading and pinned sequences;
- make all image content immediately accessible in normal document flow;
- show the full 24-sample table and About together without requiring the visitor to scroll through a long animation;
- place the star statically or use a short fade to the footer;
- keep all interactions usable.

The reduced-motion experience must still look intentional, not like a broken animation state.


<!-- END 05_SCROLL_AND_MOTION_DESIGN_SPEC.md -->


---

<!-- BEGIN 06_IMAGE_STORYTELLING_AND_ASSET_RULES.md -->

# MAH★P — Image Storytelling & Asset Rules

## 1. Image-first principle

The work is the content. Photographs, garments, collages, fashion illustrations and textile details must occupy more visual attention than explanatory copy or navigation. Treat the site like an editorial exhibition, not a text-led case-study template.

## 2. Allowed original asset sources

Use existing local assets in the current repository, especially the current source of truth under:

- `public/portfolio-assets/`
- `src/data/portfolioAssets.ts`
- `src/data/content.ts`
- `src/data/prototype-assets.md`

These paths are based on the previous project handoff; verify actual repository paths before coding. Do not assume every path exists merely because it is listed here. Use the current asset manifest if it differs.

## 3. Non-negotiable asset preservation

- Do not delete, overwrite, compress-lossily or rename source originals during implementation.
- Do not replace the original fashion imagery with stock or AI-generated content.
- Do not use external image hotlinks.
- Preserve alpha/transparency in cut-out figures and illustrations.
- Preserve each original aspect ratio and important crop.
- Use explicit image dimensions/aspect-ratio wrappers to prevent layout shifts.
- Use `object-fit: contain` for transparent cut-outs and swatches unless a verified composition requires another mode.
- Use `object-fit: cover` only when the intended photographic crop is visually verified and does not cut out a garment/face detail.
- Keep image alt text informative and factual; purely decorative duplicate layers can use empty alt.
- Keep credits with the assets/sequence they actually describe.

## 4. Composition patterns

Use a varied editorial rhythm:

- **Monumental portrait:** one tall fashion photo occupying a large viewport region.
- **Full-width landscape:** a horizontal composition spanning the story width.
- **Asymmetric pair:** one dominant image and one smaller supporting frame.
- **Collage plate:** original flattened collage as a complete work, not rebuilt as arbitrary HTML layers unless the source provides separable assets.
- **Garment detail:** close-up of knit, construction, drape or texture from original photography/material assets.
- **Cut-out stage:** transparent model/illustration placed over a simple stage with original proportions.
- **Editorial sequence:** multiple source photos presented as a flowing lookbook, with varied pacing.

Do not use identical 2-column grids for every project. Composition should respond to the actual source material.

## 5. Image motion

- Zoom: subtle and limited; do not zoom through a full photo to a point where it becomes pixelated.
- Horizontal motion: small, intentional lateral drift; preserve the viewer's ability to inspect the garment.
- Mask reveal: use a clean edge/clip that complements the current project (paper edge for Aurora, softer organic reveal for nature, simple editorial mask for planet scenes).
- Parallax: apply only to a few background/secondary layers; avoid motion on faces and text.
- Reverse scroll: every scroll-linked image effect must reverse predictably.
- Mobile: reduce or remove parallax; never require horizontal scrolling to see all images.

## 6. Source-resolution caveat

Some existing source photographs were previously noted as modest-resolution files. Inspect actual pixel dimensions before enlarging to full viewport. Avoid artificial upscaling that creates blur. Choose an editorial layout appropriate to actual resolution; use a higher-quality original file only if it already exists in the repository or owner-approved source archive.

## 7. Home image collage

Use photographs/images from the three existing projects. Keep opacity low enough for the MAHOP logo to remain instantly legible. Do not overpack the screen. The user requested images to drift left/right and top/bottom, so use a few independent paths with slow timing and low opacity. The home hero itself does not need heavy Three.js.

## 8. Project image sequences

### L'ETOILE MAHO
Use the actual source images under the existing `l-etoile-maho` asset area and the cover illustrations. Preserve Mercury/Uranus/Pluto/Mars grouping. Do not move a swatch to a chapter merely because its colour seems to fit; use the established source mapping.

### MAH★P
- White collage: original page-20 and page-21 composites remain intact.
- Editorial Studio Photography: use exactly the two source-page-22 photographs already in the current project.
- Do not invent a larger outdoor photo set.

### Aurora
- Lead with the source-page-3 torn-paper collage and original cut-outs/illustrations.
- Continue with the page-4 photography sequence.
- Keep the existing image order where it reflects the source sequence.

## 9. Captions and credits

Use minimal captions. All source page references and contributor credits must be verified in the current content data. Do not automatically duplicate a project-level credit on every chapter if it could imply the same photographer/model participated in an unverified part of the sequence.

## 10. Placeholder policy

If a source image is missing:
- do not use a stock photo or generated image as if it were authentic MAH★P work;
- do not invent a filename;
- keep a clearly labelled, neutral empty slot only during development if necessary;
- record the missing source path in a private asset issue list;
- never claim the portfolio is complete while a key authentic image is missing.


<!-- END 06_IMAGE_STORYTELLING_AND_ASSET_RULES.md -->


---

<!-- BEGIN 07_MATERIAL_TABLE_ABOUT_CONTACT_SPEC.md -->

# MAH★P — Material Table, About & Contact Specification

## 1. Material Table: approved experience

The Materials section is a single visual archive board containing the **24 current mapped textile-swatch images**. It should feel like a curated research table, not an ecommerce product grid.

### Entry state
- Show all 24 actual samples together at the beginning of the section.
- Desktop target: a coherent 6 × 4 or 4 × 6 table-like grid, selected for the real screen width and actual image ratios.
- Tablet: a balanced 3–4 column arrangement.
- Mobile: 2 columns or a carefully designed stacked board, with every sample reachable without horizontal document overflow.
- Use clear negative space, quiet numbering and a dark/neutral stage so texture and colour remain visible.
- Every sample uses a stable `MATERIAL 01` through `MATERIAL 24` identifier.
- Avoid invented textile names/specifications.

### Sample display
- Keep the image's actual aspect ratio inside a visually consistent cell.
- Do not crop material edges/details just to create uniform thumbnails.
- Use `contain` where that preserves the textile object best.
- A subtle frame/border is acceptable; no heavy card background or product UI.

## 2. Click/tap detail interaction

Each sample must be interactive.

On activation:
- Open an accessible detail view/lightbox/dialog.
- Show the real image at a larger size without distorting its ratio.
- Display the neutral material number and any verified source-page/chapter metadata already stored in the data.
- Do not invent composition, fibre content, knitting technique, dimensions, price, product availability or provenance.
- Provide an obvious close control.
- Support Escape to close, focus trap or equivalent dialog focus handling, and focus restoration to the activating sample.
- Touch users must be able to open/close without hover.
- Preserve the visitor's scroll position and current table animation progress after closing.
- Keep the dialog's outer dimensions stable while changing from a portrait to landscape sample.

## 3. Progressive disappearance sequence

The core interaction is scroll-driven.

1. Start with all 24 samples visible.
2. As scrolling progresses, selected samples begin to disappear in staggered small groups.
3. Some samples remain visible longer to create a composed dismantling/reveal rhythm.
4. Use opacity + small directional translation or scale. Do not use abrupt `display:none` during the animation.
5. Near the end, the final samples clear to reveal the About composition.
6. The complete About section is visible only once the material sequence reaches its end.
7. When the user scrolls upward, a subset of the samples reappears progressively, and the full table is restored at the entry point.

The sequence must be deterministic and reversible. Do not use random reordering on each scroll. Do not trigger one-way exit animations that fail when the user scrolls backward.

## 4. About reveal

### Layout

- `ABOUT` heading at the top of the composition.
- Existing authentic illustration is centred and becomes the main visual focal point.
- Verified About text is placed alongside the illustration, with comfortable width and hierarchy.
- The illustration must remain in its original proportions and use the exact existing source asset from the current About page/data map.
- If the current About page has more than one illustration, inspect the live current composition and the repository mapping. Choose/compose the same authentic illustration(s); do not substitute generated fashion art.

### Reveal choreography

- The About section can exist structurally below/behind the material sequence, but it remains visually secondary until the 24-sample transition completes.
- The title appears first, followed by the centred illustration and side text.
- No large text wall. Keep the source-backed artistic identity concise.
- In reduced-motion mode, show About immediately after the Materials table without requiring animated scrolling.

## 5. White footer / final destination

The final footer uses a white background as an intentional tonal reset after the dark and coloured worlds.

- The companion star moves to the exact visual centre of the footer.
- Its movement decelerates and settles; no perpetual bouncing.
- Show the two-line message:

  **THE JOURNEY ENDS HERE.**  
  **THE CREATION CONTINUES.**

- Preserve current contact details exactly:
  - `theycallmemaho@gmail.com` (`mailto:`)
  - `+39 375 1295019` (`tel:+393751295019`)
  - Instagram `@callmemahop`
  - TikTok `@callmemahop`
- Use the exact existing social URLs from the repository. Do not guess or fabricate social profile destinations.
- Keep clear focus, contrast and link affordances. A contact form is not requested.

## 6. Direct routes

`/material` must show the complete Material Table experience followed by the full About reveal and white footer. `/about` must work as a direct route to About without requiring the visitor to first scroll through all 24 samples. It may use an abbreviated visual transition, but content must be immediately accessible.


<!-- END 07_MATERIAL_TABLE_ABOUT_CONTACT_SPEC.md -->


---

<!-- BEGIN 08_TECHNICAL_ARCHITECTURE_AND_LIBRARIES.md -->

# MAH★P — Technical Architecture & Libraries

## 1. Preserve the existing application

The current project handoff identifies the existing application as:
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Current custom router
- Netlify deployment configuration

These are **reported project characteristics**, not permission to assume the current repository has not changed. Google AI Studio must inspect `package.json`, the lockfile, entry points, router, CSS and build configuration before making dependency changes. Preserve the actual current versions and architecture wherever possible.

Do not migrate to Next.js, Astro, a new router or a backend. Do not restructure the app purely for stylistic preference.

## 2. Recommended stack additions

### Core 3D

| Package | Role | Decision |
|---|---|---|
| `three` | WebGL scene engine | Required for approved project background worlds |
| `@react-three/fiber` | React renderer for Three.js | Preferred; choose version compatible with actual React major |
| `@react-three/drei` | Small focused helpers | Optional; add only the helpers actually used |

Compatibility: official React Three Fiber installation documentation states that Fiber v9 pairs with React 19 and Fiber v8 pairs with React 18. Use stable v9 for the expected React 19 setup. Do not use Fiber v10 alpha in this production portfolio. See https://r3f.docs.pmnd.rs/getting-started/installation.

### Scroll/motion

| Package | Role | Decision |
|---|---|---|
| `gsap` | Scroll-linked timelines and authored choreography | Preferred primary animation system |
| `@gsap/react` | React integration and scoped lifecycle | Preferred when using GSAP in React |
| `ScrollTrigger` | Scroll progress, scrub and limited pinning | Use for the project/Materials story sequences |

Use only one full JavaScript animation system. Do not add Framer Motion/Motion, React Spring or Lenis alongside GSAP unless an actual gap is demonstrated and the reason documented. CSS handles simple hover/focus transitions.

### Optional 3D helpers/effects

- `@react-three/postprocessing` / `postprocessing`: optional, only if small controlled bloom or atmospheric effects cannot be handled adequately with lightweight materials/sprites. Do not install by default.
- `AdaptiveDpr` / `PerformanceMonitor` from Drei: useful optional adaptive-quality tools; do not create unnecessary complexity.

## 3. Dependency management rules

- Inspect what is already installed first.
- Reuse installed packages if compatible.
- Choose stable versions compatible with the current React/Three.js/Vite versions.
- Do not use `latest` blindly for alpha/prerelease dependencies.
- Do not force peer dependency resolutions to silence a mismatch.
- Pin dependency versions through the existing package manager/lockfile.
- Do not update unrelated libraries.
- Report every added/changed dependency and its reason.
- If a required package cannot be installed, do not silently substitute a heavy unrelated stack; implement a simpler compatible path and state the limitation.

## 4. Component architecture (implementation guide, not fixed filenames)

Build around focused reusable components. Adapt names to the existing project conventions.

```text
App / existing Router
├── GlobalNavigation
├── HomeExperience
│   ├── HomeGateway
│   ├── JourneyProgress (if useful)
│   ├── JourneyStarCompanion
│   ├── LetoileStory
│   │   ├── ProjectEnvironmentHost
│   │   ├── PlanetChapter (Mercury/Uranus/Pluto/Mars)
│   │   └── EditorialImageSequence
│   ├── MahStarPStory
│   │   ├── WhiteInterlude
│   │   └── EditorialStudioPhotography
│   │       ├── NatureThreeScene
│   │       └── OriginalPhotoSequence
│   ├── AuroraStory
│   │   ├── PunkThreeScene
│   │   └── OriginalCollageAndPhotography
│   ├── MaterialTableStory
│   ├── AboutReveal
│   └── WhiteContactFooter
├── WorkArchivePage
├── LetoileDetailPage
├── MahStarPDetailPage
├── AuroraDetailPage
├── MaterialPage
├── AboutPage
└── NotFoundPage
```

Avoid duplicate copies of content data across Home and detail routes. Use the existing content/asset source of truth and reusable section components.

## 5. Scene state/data model

A single `ProjectEnvironmentConfig` or equivalent data model should describe each environment:
- scene ID (`mercury`, `uranus`, `pluto`, `mars`, `editorial-nature`, `aurora-punk`)
- accent palette
- scene title/label
- camera preset
- particle/grass density profile
- motion enabled/reduced-motion mode
- quality tier
- scene opacity/progress value

Use stable IDs for sections and sample images. Avoid relying on array order alone for React keys or scroll-state restoration.

## 6. Scroll integration

- ScrollTrigger owns scroll progress/timelines.
- Project chapter state is derived from scroll progress or controlled active section state, not repeated setState calls on every frame.
- Use refs for high-frequency Three.js material/scene updates.
- Reuse a small number of ScrollTriggers and clean them up when routes change.
- Do not let multiple components animate the same canvas opacity/camera property.
- Refresh trigger measurements after image/layout/font loading when needed.
- Native browser scroll remains the source of truth.

## 7. Asset loading

- Read local assets from the repository's existing paths.
- Use lazy loading for below-the-fold HTML photographs and eager/preloaded loading only for the true first-view hero/LCP asset.
- Keep image metadata (dimensions, alt, chapter, source page, credit, review state) alongside the content/asset manifest.
- Use small local procedural Three.js materials where possible rather than large background textures.
- Avoid importing all photo assets into the initial JavaScript bundle if the existing bundler permits route/section lazy loading.

## 8. WebGL failure handling

- Detect WebGL availability/context failure.
- If WebGL is unavailable, show an elegant static background treatment and keep all original photos, titles, content and navigation visible.
- A 3D effect must never be required to access content.
- Handle context loss/restoration and route unmount safely.

## 9. No backend / no external services

No backend, database, authentication, contact-form provider, Gemini API call, image API, analytics, tracking, paid service, API key or billing configuration is required. The current portfolio is a static frontend experience.


<!-- END 08_TECHNICAL_ARCHITECTURE_AND_LIBRARIES.md -->


---

<!-- BEGIN 09_RESPONSIVE_ACCESSIBILITY_PERFORMANCE.md -->

# MAH★P — Responsive, Accessibility & Performance Requirements

## 1. Responsive strategy

Mobile is a composed adaptation, not a reduced desktop clone.

| Viewport | Art direction |
|---|---|
| Large desktop | Large image compositions, 6×4/4×6 material table, sticky scene + flowing story, nuanced depth and limited pinned moments |
| Laptop | Same immersive structure with reduced offsets, simpler layering and readable image framing |
| Tablet | Fewer overlaps, simplified Three.js scenes, balanced 3-column material table, accessible project navigation |
| Mobile | Single-column image sequence, simplified scene/near-static 2.5D background, 2-column material table, no heavy pinned timeline, large touch targets |

Suggested responsive checkpoints may be adapted to the current CSS system. Do not hard-code breakpoints without checking existing design tokens.

## 2. Mobile requirements

- No horizontal document overflow.
- No hover-only information or controls.
- No tiny text/captions that require pinch zoom.
- Material table remains accessible; 24 images must be discoverable and detail views must fit the screen.
- Project photos stack vertically with authentic ratios.
- Remove complex pinned scenes or use short, low-cost sticky segments.
- Simplify Three.js particle, grass and geometry count; reduce DPR and post-processing.
- Ensure the star companion never covers touch targets.
- Keep the mobile navigation functional with keyboard and touch.
- Respect mobile safe areas and viewport height changes.

## 3. Accessibility

- Semantic landmarks and logical heading order.
- Skip-to-content link.
- Every link/button has a visible focus indicator.
- Navigation menu is keyboard operable, has an accessible name and state, and closes appropriately.
- Dialog/lightbox supports Escape, focus management and focus return.
- Sample cells have meaningful labels such as `Open Material 01 details`.
- Decorative Three.js canvas and companion star are hidden from assistive technology (`aria-hidden=true`) unless a genuine semantic interaction is implemented.
- All meaningful images have concise alt text; purely decorative repeats use empty alt text.
- Text contrast meets WCAG AA for essential text, including project accents and white footer.
- Never communicate state by colour alone.
- Content remains readable and reachable when JavaScript animation fails.
- `prefers-reduced-motion` must expose all content without long scroll-driven animation.

## 4. Performance targets and implementation rules

Performance objectives are budgets to measure, not claims of achieved scores.

- Keep initial page content usable before Three.js finishes loading.
- Lazy-load noncritical Three.js scene code and photos below the fold.
- Do not load six environments simultaneously.
- Use a single active scene/canvas for the current story region wherever feasible.
- Cap device pixel ratio (with a lower mobile cap); adapt quality after observing real performance.
- Use instanced geometry for stars, dust and grass.
- Reduce/disable shadows on mobile unless a measurable visual need justifies them.
- Keep post-processing minimal or disabled on low-power devices.
- Prefer transform and opacity animations.
- Avoid layout thrashing and React state updates on every scroll/frame.
- Use explicit image dimensions or aspect ratios to prevent cumulative layout shift.
- Preload only the first key image/hero assets; lazy-load the remainder.
- Dispose unused Three.js resources and clean event listeners/ScrollTriggers.
- Pause scenes when outside the viewport or tab is hidden.

## 5. Suggested quality goals (verify; do not promise)

- No broken asset paths.
- No uncaught console/runtime errors during main journeys.
- No unbounded WebGL memory growth while navigating between project routes.
- Stable scroll and reverse-scroll on current desktop and mobile browsers.
- Lighthouse/Web Vitals can be measured after implementation; do not claim numerical scores unless tested.

## 6. Reduced-motion mode

Reduced motion must:
- disable scroll-scrubbed reveal/fade sequences;
- remove parallax, continuous rotation and drifting hero images;
- show each project's static Three.js pose or a clean non-WebGL still backdrop;
- place all project images in ordinary document flow;
- make all 24 materials and About fully visible without a staged disappearance;
- show the star statically or with one very short transition;
- retain every interaction and content item.

The reduced-motion state must be deliberately designed and not merely stop the animations at arbitrary opacity values.

## 7. WebGL fallback

When WebGL is unsupported, blocked, or fails:
- keep a stable black/green/urban background using simple CSS colour and typography (not a replacement stock image);
- display chapter titles and real photos normally;
- remove sticky dependencies on the canvas;
- allow native scroll through all content;
- show a small graceful fallback only if necessary, not a prominent error message.


<!-- END 09_RESPONSIVE_ACCESSIBILITY_PERFORMANCE.md -->


---

<!-- BEGIN 10_QA_ACCEPTANCE_AND_RELEASE.md -->

# MAH★P — QA, Acceptance & Release Plan

## 1. Acceptance status language

Use only evidence-based states:
- **PASS** — requirement is implemented and the stated check actually passed.
- **PARTIAL** — implemented but incomplete or not fully validated.
- **FAIL** — a requirement is demonstrably broken or absent.
- **NOT VERIFIED** — available tools/evidence could not establish the result.
- **NOT APPLICABLE** — explain why.

Do not call a visual preference a defect unless it violates a documented requirement. Do not claim browser/device/performance testing unless it was actually performed.

## 2. Required feature acceptance criteria

### Home
- MAHOP logo is large and legible on first view.
- Low-opacity images come from authentic current project assets.
- Horizontal/vertical drift is restrained and does not block the wordmark.
- Main scroll reveals the first project experience naturally.

### L'ETOILE MAHO
- Mercury, Uranus, Pluto and Mars are present and in this exact order.
- Each chapter has a distinct Three.js environment and correct accent.
- The planet remains behind the photo sequence while scroll advances.
- Scene prominence decreases gradually as images take over.
- The chapter title remains visible during the relevant transition.
- Upward scroll restores the planet and reverses image exits.
- Original images, chapter mapping and verified project credits are preserved.

### MAH★P
- Original white collage pages 20–21 remain intact and white.
- Editorial Studio Photography is clearly a second act within the MAH★P project.
- Grass/nature backdrop is a Three.js scene.
- Both existing source-page-22 photographs are used.
- Photographer Avi Bellaiche and Model BAAN are preserved; no garment-maker credit is invented.

### Aurora
- Three.js punk/urban environment is present.
- Original page-3 collage appears before the page-4 photo sequence.
- Original torn-paper artwork remains intact.
- Verified credits remain exact.

### Materials
- Exactly 24 current mapped images appear; none are substituted with generated/stock imagery.
- Full table is visible at entry.
- Every sample can be opened in an accessible detail view.
- Forward scroll makes selected images disappear in a staggered sequence.
- Reverse scroll restores samples deterministically.
- The About reveal completes only after the sample transition.

### About and footer
- Existing authentic illustration appears in the centre.
- About heading is above; verified text is alongside.
- No invented biography/credentials.
- Footer is white.
- Star reaches and settles at the centre.
- Closing phrase and all existing contact details are present.

## 3. Technical checks

Run the project's actual available commands; inspect `package.json` first. Likely commands include:
- install only if dependencies are missing and project setup requires it;
- existing lint command;
- TypeScript check;
- production build;
- existing unit/component tests, if any.

Do not invent scripts. If a command does not exist, report `NOT AVAILABLE` rather than silently creating a new testing stack solely to claim coverage.

Inspect dependency compatibility and build output. Do not force peer dependencies.

## 4. Route test matrix

Directly open and refresh:
- `/`
- `/work`
- `/work/letoile-maho`
- `/work/mah-star-p`
- `/work/aurora-de-liage-x-auro-dapunk`
- `/material`
- `/about`

Verify that internal navigation and browser back/forward preserve correct route and scroll behaviour.

## 5. Interaction test matrix

- Global navigation open/close (if mobile menu exists).
- Work project entries and project route links.
- Planet chapter navigation, if visible.
- Upward and downward scroll through every sticky scene.
- Materials grid and all 24 detail triggers.
- Detail dialog close button, Escape key, focus return and stable modal size.
- Star companion never blocks links or images.
- Footer email, phone and social destinations.
- Reduced-motion experience.
- WebGL-disabled/failed fallback.

## 6. Viewport matrix

At minimum, inspect:
- Desktop wide (e.g. 1440px)
- Laptop (e.g. 1280px)
- Tablet (e.g. 768px)
- Mobile narrow (e.g. 390px)

Use available preview/browser tooling. Record actual viewport sizes. If an exact device is unavailable, report it.

## 7. Performance inspection

- Confirm there is not more than one unnecessary active WebGL scene for a single story state.
- Navigate away from and back to project routes; inspect cleanup and memory/console warnings.
- Check for image layout shifts and broken image paths.
- Observe scene behaviour on mobile/low-power setting.
- Verify no animation loop runs needlessly when the scene is hidden.
- Run Lighthouse or equivalent only if the tool is available; report the measured result, not an estimate.

## 8. Content / rights inspection

- Confirm every image path maps to an existing original asset.
- Confirm credits and project titles match the source data.
- Confirm the two MAH★P photography images and 24 swatches are mapped.
- Confirm About uses existing source illustration(s).
- Do not claim model/photographer/image rights are cleared unless the project contains explicit evidence.
- Preserve any existing publication-review or rights flags.

## 9. Release safeguards

- Create a recoverable checkpoint before substantial changes if available.
- Do not publish Netlify or any other production site automatically.
- Do not push to the main branch or merge unless explicitly authorised in the current task.
- Do not delete source assets or history.
- Do not commit generated build output, credentials or secrets.

## 10. Final report required from Google AI Studio

Return one concise but complete report containing:
1. Summary of the complete design/experience implemented.
2. Sections and routes completed.
3. New/changed files and major components.
4. Dependencies added/changed and compatibility reason.
5. Build/type/lint/test commands actually run and exact outcomes.
6. Browser routes/viewports/interactions actually inspected.
7. Known issues and unverified areas (especially image rights/consent and any unavailable source assets).
8. Confirmation that nothing was published/deployed/pushed automatically.

The final report must not claim a perfect/complete result if a critical requirement failed.


<!-- END 10_QA_ACCEPTANCE_AND_RELEASE.md -->


---

<!-- BEGIN 11_CONTENT_ASSET_PROVENANCE_REGISTER.md -->

# MAH★P — Content & Asset Provenance Register

**Purpose:** preserve known source-page relationships and prevent invented filenames, credits or image substitutions.

## 1. Verified website reference pages

- Home: https://mahop-prototype.netlify.app/
- Work archive: https://mahop-prototype.netlify.app/work
- L'ETOILE MAHO: https://mahop-prototype.netlify.app/work/letoile-maho
- MAH★P: https://mahop-prototype.netlify.app/work/mah-star-p
- Aurora: https://mahop-prototype.netlify.app/work/aurora-de-liage-x-auro-dapunk
- Materials: https://mahop-prototype.netlify.app/material
- About: https://mahop-prototype.netlify.app/about

These URLs were fetched for content verification during preparation. The local repository still remains authoritative for actual file paths and data structures.

## 2. Existing L'ETOILE MAHO asset groupings

The current source page shows these project groupings:

| Chapter | Source pages | Existing source folder pattern |
|---|---|---|
| Project introduction | 6–7 | `projects/l-etoile-maho/00-intro/` |
| Mercury | 8–9 | `projects/l-etoile-maho/mercury/` |
| Uranus | 10–11 | `projects/l-etoile-maho/uranus/` |
| Pluto | 12–13 | `projects/l-etoile-maho/pluto/` |
| Mars | 14–15 | `projects/l-etoile-maho/mars/` |

Existing folder pattern is documented, but Google AI Studio must verify every file against the actual repository's asset map.

## 3. MAH★P project assets

Source pages 20–21 (white collage):
- `projects/mah-star-p-avi-bellaiche/p20-page-composite-torn-paper-banner-wordmark.png`
- `projects/mah-star-p-avi-bellaiche/p21-page-composite-striped-trousers-figures-wordmark.png`

Brand image currently used by the project:
- `branding/p22-logo-mah-star-p-white-constellation.png`

Source page 22 — Editorial Studio Photography:
- `projects/mah-star-p-avi-bellaiche/p22-photo-striped-trousers-closeup.jpg`
- `projects/mah-star-p-avi-bellaiche/p22-photo-striped-trousers-seated-wide.jpg`

Credits: Photographer Avi Bellaiche; Model BAAN. No garment-maker credit is present in the source.

## 4. Aurora source assets

Source page 3 — collage and cut-outs:
- `projects/aurora-de-liage-x-auro-dapunk/p03-collage-punk-ephemera-torn-paper-collage.png`
- `projects/aurora-de-liage-x-auro-dapunk/p03-model-cutout-brazy-full-length-brown-coat.png`
- `projects/aurora-de-liage-x-auro-dapunk/p03-model-cutout-brazy-half-length-hand-raised.png`
- `projects/aurora-de-liage-x-auro-dapunk/p03-illustration-grey-waistcoat-spiky-hair-look.png`
- `projects/aurora-de-liage-x-auro-dapunk/p03-illustration-spiky-hair-doll-pink-skirt-look.png`

Source page 4 — photography:
- `projects/aurora-de-liage-x-auro-dapunk/p04-photo-brazy-full-length.jpg`
- `projects/aurora-de-liage-x-auro-dapunk/p04-photo-brazy-hand-on-hip.jpg`
- `projects/aurora-de-liage-x-auro-dapunk/p04-photo-brazy-hand-raised.jpg`
- `projects/aurora-de-liage-x-auro-dapunk/p04-photo-brazy-hand-lowered.jpg`

Credits: Photographer Raphaël Kassouri; Stylist `@Playarabian`; Model Brazy; Dress by Aurelia Mahop Di Toro.

## 5. Material Table — 24 displayed images

The currently published Materials page reports **24 mapped samples** and displays the following assets. These are the 24 samples to render in the approved table. Paths are relative to the existing `public/portfolio-assets/` folder (verify exact paths in the code before using).

| ID | Existing asset path relative to `portfolio-assets/` | Existing source label |
|---|---|---|
| 01 | `projects/l-etoile-maho/mercury/p09-swatch-grey-knotted-knit.png` | p.9 · Mercury samples |
| 02 | `projects/l-etoile-maho/mercury/p09-swatch-silver-bead-grey-knit.png` | p.9 · Mercury samples |
| 03 | `projects/l-etoile-maho/mercury/p09-swatch-grey-knit-blue-beaded-motif.png` | p.9 · Mercury samples |
| 04 | `projects/l-etoile-maho/uranus/p11-swatch-pale-blue-lace-knit.png` | p.11 · Uranus samples |
| 05 | `projects/l-etoile-maho/uranus/p11-swatch-white-blue-beaded-knit.png` | p.11 · Uranus samples |
| 06 | `projects/l-etoile-maho/uranus/p11-swatch-grey-circuit-motif-knit.png` | p.11 · Uranus samples |
| 07 | `projects/l-etoile-maho/pluto/p13-swatch-navy-grey-zebra-knit.png` | p.13 · Pluto samples |
| 08 | `projects/l-etoile-maho/pluto/p13-swatch-grey-textured-cable-knit.png` | p.13 · Pluto samples |
| 09 | `projects/l-etoile-maho/mars/p15-swatch-orange-chunky-knit-yellow-beads.png` | p.15 · Mars samples |
| 10 | `projects/l-etoile-maho/mars/p15-swatch-brown-orange-strata-knit.png` | p.15 · Mars samples |
| 11 | `projects/l-etoile-maho/mars/p15-swatch-orange-honeycomb-knit-brown-cord.png` | p.15 · Mars samples |
| 12 | `knit-samples/p02-swatch-pink-olive-jacquard-knit.png` | p.2 · Other samples |
| 13 | `knit-samples/p02-swatch-brown-rust-textured-knit.png` | p.2 · Other samples |
| 14 | `knit-samples/p02-swatch-dusty-pink-ribbed-knit.png` | p.2 · Other samples |
| 15 | `knit-samples/p02-swatch-red-cable-rib-knit.png` | p.2 · Other samples |
| 16 | `knit-samples/p05-swatch-green-raised-motif-knit.png` | p.5 · Other samples |
| 17 | `knit-samples/p05-swatch-leopard-intarsia-knit-gold-coin-trim.png` | p.5 · Other samples |
| 18 | `knit-samples/p05-swatch-red-looped-cord-knit.png` | p.5 · Other samples |
| 19 | `knit-samples/p05-swatch-red-cream-chevron-knit.png` | p.5 · Other samples |
| 20 | `knit-samples/p16-swatch-yellow-ochre-geometric-knit.png` | p.16 · Other samples |
| 21 | `knit-samples/p16-swatch-green-knit-neon-yellow-laces.png` | p.16 · Other samples |
| 22 | `knit-samples/p18-swatch-brown-knit-colour-zigzag.png` | p.18 · Other samples |
| 23 | `knit-samples/p18-swatch-cream-sculptural-knit.png` | p.18 · Other samples |
| 24 | `knit-samples/p18-swatch-brown-cream-patterned-knit.png` | p.18 · Other samples |

### Inventory note

Older source-analysis documents mention 27 provisional source records, while the current public Materials route exposes 24 mapped samples. For this approved V2 public experience, display exactly the 24 current mapped images above. Do not add three missing/unmatched records, invent images, or change the visible count. The remaining source reconciliation is an internal data-history note, not a reason to delay the approved build.

## 6. About illustration

The current About route includes authentic fashion illustrations from the portfolio's cover assets, including:
- `projects/cover/p01-illustration-gold-cape-orange-layered-skirt-look.png`
- `projects/cover/p01-illustration-teal-flared-trousers-red-sleeves-look.png`

Inspect the actual current About page and asset map to preserve the existing central illustration composition. Do not arbitrarily choose a different illustration if the current page has a clearly designated centre asset.

## 7. Contact details

- `theycallmemaho@gmail.com`
- `+39 375 1295019`
- Instagram `@callmemahop`
- TikTok `@callmemahop`

Use exact current profile URLs from the repository. Do not invent destinations.

## 8. Publication rights / consent

This register verifies the content/asset mapping visible on the current website; it does not certify copyright ownership, photographer licensing, model releases, location permissions or publication rights. Preserve existing rights/review flags and mark any unresolved issue in the final report. Never claim rights clearance without evidence.


<!-- END 11_CONTENT_ASSET_PROVENANCE_REGISTER.md -->


---

<!-- BEGIN 14_LIBRARY_AND_DOCUMENTATION_REFERENCES.md -->

# MAH★P — Libraries & Official Documentation References

This is a compatibility and learning reference for the implementation. Verify exact installed versions against the existing project before adding anything.

## 1. Three.js

- Three.js documentation: https://threejs.org/docs/
- WebGLRenderer: https://threejs.org/docs/pages/WebGLRenderer
- Cleanup guide: https://threejs.org/manual/en/cleanup.html
- Object disposal guide: https://threejs.org/manual/pages/how-to-dispose-of-objects.html

Use for custom project environments, procedural geometry/materials, scene lighting, particles, camera and rendering. Three.js resources (geometries, materials, textures, render targets) need deliberate disposal when no longer used.

## 2. React Three Fiber

- Installation: https://r3f.docs.pmnd.rs/getting-started/installation
- Introduction: https://r3f.docs.pmnd.rs/getting-started/introduction
- Vite guide: https://r3f.docs.pmnd.rs/getting-started/installation#vite

Current official compatibility guidance: R3F v9 pairs with React 19; R3F v8 pairs with React 18. R3F v10 is described as alpha in the current docs; do not select it for this production build.

## 3. Drei (optional helpers)

- Documentation: https://drei.docs.pmnd.rs/
- AdaptiveDpr: https://drei.docs.pmnd.rs/performances/adaptive-dpr
- PerformanceMonitor: https://drei.docs.pmnd.rs/performances/performance-monitor

Only add and use the helpers that provide real value. Prefer a simple custom implementation if a helper would create unnecessary dependencies.

## 4. GSAP + ScrollTrigger

- GSAP documentation: https://gsap.com/docs/v3/GSAP/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- `gsap.context()`: https://gsap.com/docs/v3/GSAP/gsap.context()
- `gsap.matchMedia()`: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
- React integration: https://gsap.com/resources/React/

Use ScrollTrigger for scrubbing/reversible scroll timelines and limited sticky/pinned story moments. Use context/useGSAP scoping so animations and triggers are reverted when components unmount. Use matchMedia or equivalent responsive setup to avoid inappropriate pinned scenes on mobile/reduced-motion settings.

## 5. Version discipline

- Inspect current `package.json` and lockfile first.
- Choose stable versions compatible with actual React, Three.js and Vite.
- No blind `latest` installation.
- No beta/alpha versions for production.
- No forced peer dependency overrides.
- No unrelated dependency upgrades.
- Record the final package versions in the Google AI Studio delivery report.

## 6. Sources checked for this handoff

Official docs queried on 20 November 2026. Compatibility and cleanup claims should be rechecked by the implementation environment when package versions are selected.


<!-- END 14_LIBRARY_AND_DOCUMENTATION_REFERENCES.md -->


---

<!-- BEGIN skills/SKILL_MAHOP_ACCESSIBILITY_PERFORMANCE_QA.md -->

# Skill — MAH★P Accessibility, Performance & QA

## Mission
Ensure the immersive experience remains usable, responsive and stable.

## Accessibility
- semantic headings/landmarks, skip link and visible focus;
- keyboard/touch navigation;
- accessible image detail dialog, Escape and focus restoration;
- useful alt text;
- reduced-motion path with all content visible;
- decorative canvas/star hidden from assistive tech;
- no information that is hover-only.

## Performance
- one active Three.js environment at a time where feasible;
- lazy-load noncritical scenes/photos;
- cap DPR and adapt quality;
- instance repeated particles/grass;
- pause offscreen scenes;
- dispose GPU resources and clean timelines/listeners;
- static fallback for unsupported WebGL.

## QA
- test all seven routes directly and after refresh;
- test forward and reverse scroll;
- test all 24 Materials details;
- test About reveal and direct About route;
- inspect 1440px, 1280px, 768px and 390px viewports (or report actual available sizes);
- run only the real package scripts;
- report PASS/PARTIAL/FAIL/NOT VERIFIED with evidence.


<!-- END skills/SKILL_MAHOP_ACCESSIBILITY_PERFORMANCE_QA.md -->


---

<!-- BEGIN skills/SKILL_MAHOP_ART_DIRECTION.md -->

# Skill — MAH★P Art Direction & Editorial Composition

## Mission
Protect the approved identity of MAH★P while art-directing a distinctive image-led fashion/textile exhibition.

## Core principles
- A stage, not a catalogue.
- Authentic fashion/textile work is always the focal subject.
- Each named project owns a specific visual environment.
- Black is the main stage; white collage is a purposeful exception; green and punk colours remain local to their project.
- Use scale, negative space, image rhythm and asymmetry rather than generic card patterns.

## Required behaviour
1. Identify the authentic content/assets before designing a composition.
2. Map each image to the correct project/chapter using the existing source data.
3. Choose a layout that suits the source ratio and resolution.
4. Keep captions concise and factual.
5. Ensure the first view of each chapter communicates its identity instantly.
6. Test the composition at desktop, tablet and mobile sizes.

## Forbidden
- Replacing original content with stock or AI fashion imagery.
- Inventing credits, material specs or biography.
- Recolouring the White Interlude to force a global palette.
- Building a repeated generic grid for every portfolio project.
- Letting 3D effects compete with the garment/model/image.


<!-- END skills/SKILL_MAHOP_ART_DIRECTION.md -->


---

<!-- BEGIN skills/SKILL_MAHOP_ASSET_AND_CONTENT_INTEGRITY.md -->

# Skill — MAH★P Asset & Content Integrity

## Mission
Keep the website faithful to the artist's actual portfolio and source archive.

## Rules
- Current repository content/asset manifests are authoritative.
- Use authentic local images only.
- Keep the 24 mapped Material assets exactly; do not add missing provisional records.
- Preserve alpha, ratio, source captions, credits, file mappings and publication-review flags.
- Do not invent filenames; verify every path.
- Do not invent credits, textile composition, fibre, technique, biography, client or project claim.
- Use only actual social URLs stored in the project.
- Keep project titles and punctuation exactly as supplied.
- Report missing paths and unresolved publication/consent checks honestly.


<!-- END skills/SKILL_MAHOP_ASSET_AND_CONTENT_INTEGRITY.md -->


---

<!-- BEGIN skills/SKILL_MAHOP_SCROLL_MOTION.md -->

# Skill — MAH★P Scroll Storytelling & Motion

## Mission
Choreograph the visitor's scroll as a reversible editorial journey.

## Required systems
- Home low-opacity image drift around the MAHOP wordmark.
- Sticky project scene behind flowing photo sequences.
- Progressive scene opacity reduction as images take over.
- Reverse scroll restores scenes and withdraws foreground content.
- 24-sample progressive disappearance, with selective reappearance when scrolling upward.
- About reveal after the full Materials sequence.
- Persistent star companion ending at the centre of the white footer.

## Implementation rules
- Native browser scroll remains in control.
- Use GSAP/ScrollTrigger as the single primary scroll-timeline system if compatible.
- Use scoped contexts/useGSAP and clean up all triggers on unmount.
- Prefer `scrub`/progress mapping for reversible behaviour.
- Keep the chapter title visible for the planned interval.
- Use limited pinning; mobile receives simplified timelines.
- Respect reduced motion by showing all content statically.
- Never make the only route to a photo depend on animation completing.


<!-- END skills/SKILL_MAHOP_SCROLL_MOTION.md -->


---

<!-- BEGIN skills/SKILL_MAHOP_THREEJS_ENVIRONMENTS.md -->

# Skill — MAH★P Three.js Environment Artist

## Mission
Build six lightweight, art-directed 3D environments that support the original project photography.

## Scene inventory
- Mercury — grey mineral/cratered planet.
- Uranus — pale cyan icy giant and soft atmospheric haze.
- Pluto — charcoal frozen dwarf planet.
- Mars — terracotta/red-orange rocky planet with subtle dust.
- Editorial Studio Photography — green field, grass and natural light.
- Aurora — dark urban concrete, layered torn-poster relief and punk atmosphere.

## Implementation rules
- Inspect existing React version before selecting R3F; v9 for React 19, v8 for React 18.
- Use one reusable scene host and load only the active scene.
- Use procedural/locally authored materials and geometry; no remote stock backgrounds.
- Keep camera movement restrained.
- Use instancing for repeated grass/particles.
- Reduce DPR, density, shadows and post-processing on mobile.
- Pause when hidden and dispose GPU resources when no longer used.
- Provide a static non-WebGL fallback.
- Original photos, collages, silhouettes and illustrations stay as HTML/image foreground content.


<!-- END skills/SKILL_MAHOP_THREEJS_ENVIRONMENTS.md -->
