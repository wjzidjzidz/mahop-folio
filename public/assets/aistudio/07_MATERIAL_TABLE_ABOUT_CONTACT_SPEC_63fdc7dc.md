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
