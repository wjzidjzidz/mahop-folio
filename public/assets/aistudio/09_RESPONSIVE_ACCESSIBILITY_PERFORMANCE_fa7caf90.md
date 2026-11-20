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
