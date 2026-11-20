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
