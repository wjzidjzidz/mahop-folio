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
