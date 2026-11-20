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
