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
