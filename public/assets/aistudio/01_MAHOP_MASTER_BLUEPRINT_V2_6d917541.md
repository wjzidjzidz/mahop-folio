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
