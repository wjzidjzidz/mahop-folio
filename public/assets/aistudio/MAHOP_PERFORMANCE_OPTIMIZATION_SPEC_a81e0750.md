# MAH★P — Performance & Optimization Engineering Specification

**Version:** 1.0  
**Date:** 22 November 2026  
**Purpose:** Technical reference and non-regression contract for the complete one-pass optimization of the existing MAH★P portfolio.  
**Audience:** Google AI Studio / implementation agent working directly in the existing MAH★P codebase.

---

## 0. Executive direction

The objective is to make the existing MAH★P experience load faster, navigate more smoothly, and remain responsive across desktop, laptop, tablet, and phone **without reducing its approved visual quality or changing its artistic identity**.

This is a **single coordinated optimization pass**, not a multi-phase project requiring separate approvals. The implementation agent must inspect the relevant code as part of the work, make the optimizations in one continuous intervention, validate the result, correct regressions, and provide one final report. It must not stop after an audit or ask the user to approve each category.

### The user's confirmed decisions

| Area | Decision |
|---|---|
| Visual quality | **Maximum** — preserve the approved visual result; optimize implementation and resource delivery first. |
| Loading strategy | **Balanced / progressive** — show the Hero promptly; prepare subsequent content just in time. |
| Device coverage | **All** — desktop, laptop, tablet, phone. |
| Low-powered computers | **Adaptive + 2D fallback** — preserve Three.js where capable; intelligently reduce costly rendering parameters; use a visual 2D fallback only when needed. |
| Image and texture assets | **Modern formats** — use WebP/AVIF and suitable texture formats when supported, while preserving originals and visual fidelity. |
| Architecture changes | **Minimal** — focused refactoring only; no broad rewrite or unnecessary restructuring. |
| Dependencies | **Free dependencies allowed when genuinely necessary**; no paid API, paid service, subscription, or billing. Prefer existing dependencies. |
| Browser support | Current and previous two major versions of Chrome, Safari, Edge, and Firefox, including Safari on iOS and Chrome on Android, where technically feasible. |
| Frame-rate objective | **60 FPS target on capable devices**, with graceful adaptation on weaker hardware rather than unstable rendering. |
| Network strategy | Progressive loading; prioritize the Hero and prepare upcoming sections near the point of use. |
| User-accessible test devices | Mac/desktop, Windows PC, iPhone, Android phone, and tablet. Actual physical testing must be distinguished from emulation. |
| Additional constraints | None beyond the requirements in this specification and the existing approved project. |

### Core principle

> **Optimize how the experience is delivered, not what the visitor sees.**

Do not begin by removing effects, reducing artistic detail, changing compositions, simplifying photography, or replacing complex visual sections. First optimize lifecycle, loading order, resource size, reuse, rendering frequency, memory ownership, and animation scheduling. Only apply adaptive visual-quality changes when the device demonstrably needs them.

---

## 1. Non-negotiable project preservation rules

### 1.1 Preserve the approved experience

The current MAH★P website is an approved artistic experience. Optimization must not become a redesign.

Preserve:

- The MAH★P identity, wordmark, typography, colour language, editorial composition, and overall atmosphere.
- The loading sequence and its clean, legible visual treatment. Do not reintroduce the removed Three.js star-field animation behind the loading logo.
- The loading-to-Hero handoff and the continuous star identity.
- The black Hero composition and the large logo star.
- The single star companion that detaches from the Hero wordmark, accompanies the visitor, and completes the MAH★P wordmark in Contact.
- The EXPLORE menu design and navigation. The menu must not expose the unwanted Three.js star-field background.
- The Hero-to-L'Étoile Maho planetary transition, including the continuous shared visual environment with no brief disappearance or restart.
- The four planetary identities and order: Mercury, Uranus, Pluto, Mars.
- The distinct planetary universes, photography, chapter content, titles, and reverse-scroll transitions.
- The clean planetary chapter titles; do not reintroduce unwanted black overlays behind titles.
- White Collage Interlude: retain the approved 2D visual direction; do not add Three.js.
- Botanical Ground / Editorial Studio Photography: retain its approved black and fluorescent-green 2D motion-design direction; do not add Three.js.
- Aurora de Liage × Auro Da'Punk: retain its approved 2D punk/underground direction; do not add Three.js.
- The Materials experience and its 24 existing samples, interactions, and Materials-to-About reveal.
- The About content and authentic original fashion illustration.
- The Contact composition, Contact information, social links, and final static MAH★P wordmark.
- All existing source photographs, illustrations, collages, textile samples, credits, and other project assets.

Do not generate replacement artwork, use stock assets, invent missing content, or rewrite credit information.

### 1.2 Desktop visual and interaction non-regression

The desktop experience is approved. Internal performance improvements are allowed, but the rendered result, visual quality, layout, animation choreography, interaction semantics, and navigation behaviour must remain visually and functionally equivalent to the approved desktop version.

Do not replace the desktop planetary Three.js experience with 2D as a general optimization. Do not alter its camera choreography, planetary identities, atmospheric art direction, or section timing unless a narrowly scoped technical correction is essential to preserve the same visible result.

### 1.3 Device-specific planetary rendering policy

| Device / capability | Required planetary experience |
|---|---|
| Phone | Existing art-directed **2D** planetary journey. Do not activate the 3D planetary camera-entry experience on phones. |
| Tablet | Retain Three.js only when the device can run it smoothly and reliably. Otherwise use the existing/adapted 2D planetary implementation. Decide before the visitor enters the sequence; do not visibly switch rendering modes mid-transition. |
| Capable desktop/laptop | Preserve the existing Three.js planetary experience. |
| Low-powered desktop/laptop | Start with conservative technical adaptation of Three.js. If performance remains inadequate, use a deliberate 2D fallback for the relevant planetary experience. |

The 2D mobile experience must remain a deliberately art-directed implementation, not a low-quality screenshot or static substitute.

### 1.4 Known mobile scroll requirement

The mobile planetary 2D experience must let the visitor experience the animation progressively. Fast swipes must not make all key animation stages race past instantly.

Preserve or improve the current mobile scroll solution using:

- A sufficiently long, carefully tuned scroll runway for the planetary entry sequence.
- A smoothed animation-progress value that follows native scroll progress without abrupt jumps.
- Appropriate sticky/pinned visual stages when they improve the story.
- Immediate reversibility when the visitor scrolls upward.
- Native browser scrolling and touch momentum; do not globally block touch events, hijack scrolling, or trap the visitor.
- Natural scrolling outside the planetary experience.

Do not add an excessive lag between finger movement and visual response. The animation should feel attached to the visitor's scroll, not like an independently playing video.

---

## 2. One-pass execution contract

### 2.1 Required execution model

Perform one complete optimization pass over the existing project:

1. Inspect the current implementation and measurements as part of the work.
2. Protect the current state with an appropriate checkpoint.
3. Apply all high-value, low-risk optimizations across the project in one coordinated intervention.
4. Run available automated, browser, responsive, and performance checks.
5. Correct problems introduced by the changes.
6. Deliver one final report.

**Do not deliver a standalone audit and stop. Do not split the work into phases that require new user approvals. Do not pause after identifying issues.**

The implementation agent may internally order changes to reduce risk, but the user should receive one completed optimization pass.

### 2.2 Inspection is still required

No separate audit phase does not mean blind editing. Inspect relevant code, package manifests, build scripts, asset references, rendering architecture, and animation lifecycles before modifying them. This inspection must be integrated directly into implementation.

Do not guess the framework, bundler, versions, scene ownership, or current libraries. Read the actual project.

### 2.3 Minimal-change architecture policy

The user's chosen architecture policy is **minimal**:

- Keep the existing framework, routing, and rendering architecture wherever practical.
- Prefer local improvements over sweeping rewrites.
- Reuse installed libraries and existing abstractions.
- Do not replace native Three.js with React Three Fiber, or vice versa, merely for convenience.
- Do not introduce a new animation framework if the existing one can be optimized.
- Do not duplicate rendering systems or create parallel scroll controllers.
- Avoid broad component renaming, file moves, or unrelated refactoring.
- Only reorganize code when there is a clear performance, lifecycle, or reliability benefit.

### 2.4 Checkpoint and recovery

Before making substantial changes:

- Create a Git checkpoint/branch/commit if the project is under Git and the current state is safe to checkpoint; otherwise create a dated backup copy of the files that will be changed.
- Preserve the existing lockfile and package manager choice.
- Keep a clear record of modified files.
- Do not delete original assets.
- Do not automatically deploy, publish, push to a remote repository, or trigger paid services.

If a proposed change risks breaking a core scene or transition, use a smaller reversible implementation rather than a broad rewrite.

---

## 3. Performance goals and measurement standards

### 3.1 User-perceived experience

Prioritize:

- Fast first meaningful display of the Hero.
- No blank or stalled loading state while non-critical assets load.
- No sudden resource-loading pause when entering a section.
- Smooth interactions and navigation.
- Stable scroll-linked animation progress.
- No visible scene teardown/recreation during shared transitions.
- No repeated downloads or shader compilation stalls on every revisit when resources can be reused safely.
- No progressive memory growth after repeatedly entering and leaving scenes.

### 3.2 Core Web Vitals

Use the current official Core Web Vitals definitions and thresholds. The established “good” targets are:

| Metric | Good target | What it represents |
|---|---:|---|
| LCP | ≤ 2.5 s | Loading of the main visible content. |
| INP | ≤ 200 ms | Responsiveness to user interactions. |
| CLS | ≤ 0.1 | Unexpected visual layout movement. |

Evaluate these metrics at the 75th percentile where field data is available. Do not claim field Core Web Vitals from a single Lighthouse run or a local lab test. A lab run is useful for diagnosis, but it is not equivalent to real-user field data.

Reference: https://web.dev/articles/vitals

### 3.3 Frame rate and frame pacing

- Aim for 60 FPS on devices with sufficient capability (approximately 16.7 ms per frame).
- Prioritize stable frame pacing over a fluctuating headline average.
- On less capable devices, make restrained, invisible technical adjustments first.
- Do not promise 60 FPS on every device or browser.
- If sustained performance remains poor after safe adaptation, use the approved 2D fallback on low-capability devices rather than leaving the visitor with a heavily stuttering 3D scene.
- Avoid frequent quality-mode oscillation. Use thresholds, hysteresis, and a minimum observation window; decide rendering mode before an immersive chapter starts where possible.

Suggested adaptive policy (tune from actual measurements, not blindly):

1. Start with a device-aware but visually conservative quality profile.
2. Observe frame pacing over a short stable window after scene warm-up.
3. If performance is persistently below the intended target, reduce expensive technical costs in a controlled order (for example internal render resolution, shadow map cost, selected post-processing passes, particle count only where it is not composition-critical).
4. Re-evaluate.
5. If a low-capability device still cannot sustain an acceptable experience, use the approved 2D fallback for the planetary environment.
6. Do not switch modes mid-shot or during a visible scroll transition.

Do not use a one-frame dip, a single low benchmark, browser user-agent alone, or a single device hint to classify a device as low-powered.

### 3.4 Before/after evidence

Capture a baseline during the integrated implementation work before changing the relevant area. Then compare the final version under equivalent conditions:

- Same device or emulated profile.
- Same browser and browser version.
- Same viewport and device-pixel-ratio where possible.
- Same route and scroll/interaction sequence.
- Same network-throttling profile when measuring load behaviour.

Record actual numbers when available. If a metric cannot be measured, mark it “not measured” rather than inventing an estimate.

### 3.5 Do not optimize for a score alone

Lighthouse is one diagnostic tool, not the definition of success. A high score that accompanies reduced visual fidelity, broken transitions, missing content, or stuttering WebGL scenes is not an acceptable result.

---

## 4. Loading strategy and resource scheduling

### 4.1 Critical path

Prioritize the resources required to render the initial loading/Hero experience. Do not block the Hero on the download or initialization of all later planetary environments, material samples, or below-the-fold photography.

Critical resources may include:

- The exact Hero wordmark/typography and essential layout styles.
- The star/branding assets required for the loading-to-Hero transition.
- The actual above-the-fold illustration or image assets required by the current Hero.
- Only the code needed to render and operate the initial experience.

Do not preload every large image, every planetary texture, all 24 material samples, or every future scene at startup.

### 4.2 Progressive loading and just-in-time preparation

Use an intentional loading schedule:

- **Initial:** load the critical Hero resources and minimum application code.
- **Near viewport:** begin loading assets for the next relevant section before the visitor reaches it.
- **On approach to a 3D world:** load its required textures/resources and prepare the scene before the entry transition, without blocking the current section.
- **After entry / idle:** prepare subsequent scenes or non-critical assets when the browser is idle and network conditions allow.
- **Already visited:** reuse cached resources and persistent scene state where safe and beneficial.

Use `IntersectionObserver`, dynamic imports, the existing router's prefetching mechanisms, or other compatible techniques where suitable. Avoid unnecessary custom schedulers.

### 4.3 Avoid both under-loading and over-preloading

- Do not wait until the visitor is already inside a section to begin loading essential assets if that causes a blank reveal.
- Do not download the entire website at startup.
- Do not open unlimited simultaneous image/texture requests.
- Respect `navigator.connection` hints only when available and treat them as hints, not reliable facts.
- On constrained networks, reduce speculative preload activity.
- Avoid duplicate fetches caused by different components requesting the same asset independently.

### 4.4 Shader and scene preparation

For Three.js scenes:

- Prepare the upcoming scene near the transition, not necessarily at first page paint.
- If the installed Three.js version supports an appropriate asynchronous shader compilation/warm-up API, verify its availability and use it carefully before the scene becomes visible.
- Do not compile every planet and every shader during the initial Hero load.
- Avoid a visible first-use shader compilation stall.
- Do not recreate the entire scene merely to warm it up.
- Reuse programs, materials, textures, geometries, and render targets when ownership and lifecycle allow.

### 4.5 Fonts

- Inspect the actual font files and usage.
- Prefer WOFF2 where appropriate and legally supplied in the project.
- Preload only the genuinely critical font files and weights needed above the fold.
- Avoid loading unused weights/styles.
- Use appropriate `font-display` behaviour without causing visible typography jumps that damage the wordmark or editorial composition.
- Preserve the approved typography; do not substitute fonts to gain a marginal performance improvement.

---

## 5. Images, photography, illustrations, and textures

### 5.1 Preserve originals

Never destructively overwrite the original files. Generate optimized derivatives and update references only after visual verification. Keep a reversible mapping between original and derivative asset paths.

### 5.2 Responsive web images

Where supported by the current build system:

- Generate WebP and/or AVIF derivatives for photographs and raster illustrations.
- Keep suitable fallback formats for browsers that need them.
- Use responsive `srcset` and `sizes` so phones do not download desktop-sized photographs unnecessarily.
- Serve image dimensions appropriate to their displayed size and device pixel ratio.
- Set intrinsic width/height or aspect ratio to reduce layout shift.
- Use high priority for the actual Largest Contentful Paint image when appropriate.
- Lazy-load below-the-fold images; do not lazy-load the initial critical Hero/LCP image.
- Decode non-critical images asynchronously where supported and appropriate.

Do not blindly convert every image. Respect transparency, texture detail, grain, fine typography, and collage edges. Compare output visually at actual display sizes.

### 5.3 Compression quality

The user's chosen policy is modern formats with high perceptual fidelity:

- Use visually appropriate AVIF/WebP quality settings rather than maximum compression.
- Verify dark gradients, black levels, fluorescent-green edges, fabric detail, skin tones, fine collage paper edges, and illustration line work.
- Preserve lossless sources for assets where compression artifacts are visible or unacceptable.
- Do not recompress files that are already well optimized without evidence of a benefit.

### 5.4 Three.js texture memory

File size is not the same as GPU memory size. Texture dimensions, colour format, mipmaps, and simultaneous residency matter.

- Inspect texture dimensions and actual usage.
- Avoid uploading enormous source photographs as GPU textures when a smaller derivative is visually indistinguishable at the rendered size.
- Reuse shared textures where appropriate.
- Select colour spaces and texture settings correctly for the installed Three.js version.
- Use mipmaps and filtering appropriately; do not turn them off indiscriminately.
- Use anisotropy only where visibly useful and cap it to supported hardware limits.
- Consider KTX2/Basis compressed GPU textures only if the current asset pipeline and installed Three.js support it and the visual result is verified. Do not introduce a complex texture pipeline without a measurable need.
- Keep normal, roughness, displacement, and other data textures at appropriate resolutions.

Official references:

- https://threejs.org/manual/pages/textures.html
- https://threejs.org/docs/pages/Texture.html

---

## 6. Three.js / WebGL optimization

This is a major optimization area, but it must preserve the current visual result on capable desktop hardware.

### 6.1 Inspect the real renderer architecture

Before changes, determine:

- Whether the project uses native Three.js, React Three Fiber, or a mixture.
- The installed Three.js and renderer-related versions.
- How many WebGL contexts/renderers/Canvases exist.
- Which scenes are persistent, conditional, shared, or recreated.
- How cameras, materials, geometries, textures, render targets, and post-processing passes are owned.
- Which requestAnimationFrame loops are active and when they stop.
- Whether separate sections accidentally run duplicate loops.
- Whether inactive scenes continue rendering.

Do not migrate the rendering architecture to another framework.

### 6.2 Render only when needed

- Pause or reduce rendering for scenes that are off-screen and have no visible animation that must continue.
- Pause rendering when the document is hidden, while respecting the correct lifecycle and resume state.
- Use visibility observation or section state where appropriate.
- Avoid a permanent full-speed render loop for a static or hidden scene.
- If a scene is scroll-driven, render when the scene state changes or at the necessary animation cadence; do not break continuous effects that must remain visible.
- Ensure shared Hero-to-planetary transitions remain visually continuous. Do not destroy the scene during a shared handoff.
- Avoid multiple independent loops controlling the same renderer or camera.

### 6.3 Renderer resolution and device pixel ratio

High device-pixel-ratio screens can multiply fragment workload substantially.

- Inspect current `renderer.setPixelRatio` behaviour and canvas dimensions.
- Use a quality profile appropriate to actual device capability and the visual importance of the scene.
- Keep high-resolution rendering on capable devices where it is visually beneficial.
- Apply restrained render-resolution caps or dynamic resolution on weaker devices only when needed.
- Do not apply a single aggressive low pixel-ratio cap to every desktop.
- Avoid repeatedly resizing the renderer on every small scroll or pointer event.
- Ensure resizing is debounced/requestAnimationFrame-coalesced and updates camera projection correctly.

### 6.4 Geometry and draw calls

- Reuse geometries and materials where possible.
- Avoid creating objects, vectors, arrays, materials, and geometries inside per-frame loops when they can be reused.
- Avoid unnecessary draw calls and excessive material variants.
- Consider instancing only when there are many repeated objects and the existing visual result can be retained.
- Do not merge or simplify objects blindly if it changes animation, lighting, or artistic detail.
- Keep shadow-casting and receiving limited to objects that visually need it.
- Use suitable shadow map sizes and update policies; avoid continuously recalculating static shadows.

### 6.5 Shaders and post-processing

- Inspect shader complexity, overdraw, transparent layers, and post-processing passes.
- Preserve the approved cinematic effects on capable desktop devices.
- Remove redundant passes or duplicate full-screen passes only when the visual comparison confirms equivalence.
- Avoid stacking bloom, blur, depth-of-field, chromatic aberration, or grain effects without a clear artistic purpose.
- Reuse materials/programs and avoid per-frame shader recompilation caused by changing material defines or object structure.
- Keep shader warm-up near the scene's approach, not as a blocking initial-load task.

### 6.6 Memory ownership and disposal

Three.js GPU resources are not all released just because an object is removed from the scene. Explicit disposal and shared ownership must be handled correctly.

- Dispose geometries, materials, textures, render targets, skeletons, controls, and post-processing resources only when they are no longer needed.
- Dispose textures separately from materials when appropriate.
- Never dispose shared resources while another scene/object still uses them.
- Track resources created by a scene or feature and clean up its own resources on final teardown.
- Do not destroy shared resources during a transition or temporary hide.
- Avoid creating a new renderer/context whenever a visitor re-enters a section unless unavoidable.
- Confirm no progressive memory growth after repeatedly entering/leaving planetary sections and navigating between routes.
- Use `renderer.info` and browser tooling as diagnostic aids; interpret retained internal caches correctly rather than treating every non-zero count as a leak.

Official references:

- https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- https://threejs.org/manual/pages/cleanup.html

### 6.7 Low-powered device adaptation

Use several signals where available, but never rely on a single unsupported device heuristic:

- WebGL availability and renderer initialization success.
- Device pixel ratio and viewport.
- `navigator.deviceMemory` and `navigator.hardwareConcurrency` when supported (these are hints, may be missing, and must not be treated as exact measurements).
- Frame pacing observed after warm-up.
- Context loss or repeated rendering failures.
- User's reduced-motion preference.

Adapt in a visually conservative order. Candidate adjustments include render resolution, shadow cost, optional post-processing, non-essential particle density, and update frequency for non-critical background effects.

If the scene remains persistently unusable after safe adaptation, use the existing 2D planetary fallback. Do not force low-powered visitors through a visibly broken Three.js experience.

Use a stable selection policy with hysteresis. Do not switch between 2D and 3D repeatedly during a visit, and do not visibly change mode mid-transition.

### 6.8 WebGL context resilience

Handle context loss/recovery gracefully where feasible. Avoid creating many simultaneous WebGL contexts. If a context cannot be restored, provide a stable approved fallback instead of a blank section.

---

## 7. React, JavaScript, and application architecture

### 7.1 Minimal and targeted changes

The architecture policy is minimal. Keep the existing framework, router, bundler, and folder structure unless a focused change is necessary.

### 7.2 Reduce unnecessary work

Inspect for:

- Components re-rendering on every animation frame.
- State updates used where refs or imperative animation values are more appropriate.
- Expensive calculations repeated on every render.
- Large components that unnecessarily re-render unrelated sections.
- Unstable callback/object props causing avoidable re-renders.
- Repeated event listeners or observers.
- Duplicate data or resource loading.
- Unnecessary synchronous work during initial render.

Memoize selectively, based on measured or clearly understood costs. Do not wrap every component in memo/useMemo/useCallback without reason.

### 7.3 Code splitting

- Split non-critical sections or heavy scene code where the current bundler/router supports it cleanly.
- Keep the initial Hero path small.
- Load a planetary scene's heavy code when it is approaching, not after it is already needed.
- Avoid splitting code so aggressively that navigation produces visible blank states or request waterfalls.
- Check actual production build chunks and network requests after changes.

### 7.4 Event listeners and lifecycle

- Register listeners once at the correct lifecycle boundary.
- Remove listeners and observers when the owning component/scene is destroyed.
- Use passive listeners for observational touch/scroll work where appropriate; do not use passive listeners where preventDefault is truly required (but avoid preventDefault for normal scrolling).
- Avoid reading layout and writing layout repeatedly in the same frame.
- Coalesce high-frequency pointer/resize/scroll work with requestAnimationFrame or an existing animation controller.
- Ensure browser Back/Forward, direct routes, and refresh continue working.

### 7.5 Avoid unnecessary dependencies

- Prefer existing packages and browser APIs.
- A new dependency is allowed only if free, compatible, maintained, and materially useful.
- Inspect current package versions and peer dependency requirements before adding it.
- Do not update the framework, router, Three.js, or major dependencies merely because newer versions exist.
- Avoid package churn and lockfile regeneration without cause.
- No paid APIs, paid CDN requirements, analytics subscriptions, or billing-enabled services.

---

## 8. Animation, scroll, and interaction performance

### 8.1 Preserve the choreography

The site is intentionally animation-rich. Keep the transitions and scroll storytelling. Improve scheduling, rendering, and progress mapping rather than flattening the experience.

### 8.2 Scroll-linked motion

- Keep a single source of truth for each scroll-driven timeline/progress value.
- Avoid multiple controllers competing for the same camera, section transform, or star position.
- Use frame-delta-based interpolation for independent animation updates.
- Use scroll smoothing only where it improves the experience; avoid excessive lag.
- Maintain exact reverse-scroll behaviour.
- Avoid forced page-wide scroll snapping.
- Do not globally intercept wheel or touch input.
- Respect browser-native touch scrolling and momentum.
- Do not make ordinary sections feel sluggish as a side-effect of smoothing the planetary experience.

### 8.3 Mobile planetary scroll

For phones, the planetary journey is 2D. Preserve the deliberate mobile scroll behaviour:

- Enough scroll runway for each key visual stage.
- Smoothed animation progress that follows the target without sudden jumps.
- Responsive reversal when the visitor scrolls upward.
- No forced waiting, artificial timeout, or scroll trap.
- No skipped key states on a fast swipe, while still allowing the visitor to move away naturally.

Use the already-installed animation library if present (for example, if the existing app uses GSAP/ScrollTrigger, tune its current mechanism). Do not install GSAP solely to obtain a scrub feature when the current implementation can do the job.

### 8.4 CSS animation performance

- Prefer `transform` and `opacity` for frequent animation where appropriate.
- Avoid animating layout-triggering properties such as width/height/top/left when a transform can preserve the same design.
- Use `will-change` sparingly and remove it when no longer needed.
- Avoid permanent large blurred layers or expensive filters on low-capability mobile devices unless necessary to the approved look.
- Do not replace a high-quality animation with a static image merely to improve a benchmark.

### 8.5 Reduced motion and accessibility

Respect `prefers-reduced-motion`. Provide an appropriate reduced-motion experience that preserves content, navigation, and meaning without forcing intensive motion. Maintain keyboard accessibility, focus visibility, semantic controls, and sufficient text contrast.

---

## 9. Responsive strategy and device tiers

### 9.1 Desktop / capable laptop

- Preserve the approved Three.js planetary experience.
- Keep the same camera transitions, composition, and visual detail.
- Optimize behind the scenes: scene reuse, resource scheduling, memory management, render scheduling, shader preparation, image delivery, and JavaScript workload.

### 9.2 Phone

- Use the existing 2D planetary worlds; never activate the 3D planetary camera-entry sequence.
- Optimize 2D layers, masks, assets, and scroll progress.
- Avoid expensive filters, giant full-resolution textures, and unnecessary Canvas redraws.
- Keep the companion star and all other approved interactions functional.
- Do not change the visual design simply to reduce costs.

### 9.3 Tablet

- Use capability/performance-aware selection.
- Preserve Three.js where it runs smoothly.
- Otherwise use the art-directed 2D planetary experience.
- Decide mode before the visitor enters the experience; no visible mode switch mid-scene.
- Do not assume all tablets have equal GPUs or use user-agent detection alone.

### 9.4 Low-powered desktop/laptop

- Use an adaptive Three.js profile first.
- If the device remains unable to deliver a usable experience, use the planetary 2D fallback.
- Keep the transition coherent and do not change mode while visible.

### 9.5 Device-profile implementation cautions

Feature detection is imperfect. `deviceMemory`, `hardwareConcurrency`, connection hints, and user-agent strings may be unavailable, rounded, misleading, or privacy-reduced. Combine signals and runtime observations. Provide safe defaults if a signal is missing.

Do not persist a bad quality decision forever. Re-evaluate sensibly on a new session or explicit capability change, while avoiding repeated switching during one visit.

---

## 10. Browser, caching, and delivery

### 10.1 Browser support

Target current and previous two major versions of Chrome, Safari, Edge, and Firefox, including mobile Safari and Chrome Android, where the current stack permits.

- Use feature detection and progressive enhancement.
- Provide a stable fallback for unsupported WebGL features or image formats.
- Avoid browser-specific CSS/JS hacks unless necessary and documented.
- Test iOS Safari separately because scroll, viewport, memory, and WebGL behaviour can differ from desktop Safari.

### 10.2 Caching

Inspect the existing hosting/build setup before modifying caching configuration.

- Use immutable caching for content-hashed build assets where supported by the host.
- Use sensible caching for original/media assets and fonts, considering whether filenames are versioned.
- Avoid caching HTML entry documents indefinitely if doing so would prevent deployment updates.
- Do not add a service worker or custom offline cache unless there is a clear requirement and a safe invalidation strategy.
- Avoid duplicate caching layers that can serve stale assets.

### 10.3 Network requests

- Avoid unnecessary third-party resources.
- Avoid serial request waterfalls for assets needed together.
- Prioritize critical resources and schedule non-critical resources progressively.
- Reuse local assets and existing host delivery.
- Do not introduce paid image CDNs, paid analytics, or external API dependencies.

---

## 11. Validation, test matrix, and acceptance criteria

### 11.1 Required route and section coverage

Preserve and test the existing routes where present:

- `/`
- `/work`
- `/work/letoile-maho`
- `/work/mah-star-p`
- `/work/aurora-de-liage-x-auro-dapunk`
- `/material`
- `/about`

Also test all major in-page sequences and the Contact/footer. If the actual current project uses different routing for any section, inspect and preserve the real routes rather than forcing these paths.

### 11.2 Device matrix

| Target | Primary checks |
|---|---|
| Mac desktop/laptop | Full Hero, Three.js planetary scenes, transitions, menu, all sections, scroll forward/reverse, memory and FPS. |
| Windows PC | Chrome/Edge (and Firefox if available), WebGL stability, fonts/images, scroll, navigation, fallback behaviour. |
| iPhone | Safari, loading alignment, Hero, 2D planetary scenes, fast/slow/reverse touch scroll, star companion, menu, Materials and Contact. |
| Android phone | Chrome, same key mobile checks, image/texture loading, 2D animation smoothness, viewport behaviour. |
| Tablet | Safari or Chrome as available; verify Three.js only when smooth, otherwise 2D; orientation and resizing. |
| Low-performance profile | Throttled CPU/network and/or lower-capability device profile; adaptive rendering and 2D fallback. |

Use physical devices where available. Clearly label emulation, responsive mode, CPU throttling, and actual physical-device testing separately. Never claim a physical iPhone/Android/Windows test if only an emulator or browser device toolbar was used.

### 11.3 Functional regression checklist

- Loading screen starts correctly, logo star alignment is stable, and transition into Hero is continuous.
- Hero appears promptly and remains visually unchanged.
- The single global star remains continuous; no duplicates, jumps, or unexpected disappearance.
- EXPLORE contains no unwanted Three.js star field and all destinations still work.
- Hero-to-L'Étoile Maho handoff has no brief gap, reset, or scene flash.
- Four planets remain distinct; all four planetary worlds work.
- Desktop Three.js is preserved on capable computers.
- Phones use the 2D planetary implementation.
- Tablet and low-powered desktop capability selection behaves consistently.
- Mobile planetary scroll remains deliberate, progressive, reversible, and not trapped.
- Planetary chapter titles remain clean and readable.
- White Collage, Botanical Ground, and Aurora remain 2D and visually approved.
- Materials retains all 24 existing samples and inspection interactions.
- Materials-to-About reveal remains reversible and stable.
- About and Contact content, illustration, credits, and links remain unchanged.
- Contact star completes the MAH★P wordmark and stays static.
- Direct route entry, refresh, browser Back, and browser Forward work.
- No blank scenes, stuck scroll, missing images, duplicate canvases, or duplicated render loops.

### 11.4 Performance checks

Where available, record:

- Production build result and bundle/chunk sizes.
- Lighthouse lab results for desktop and mobile.
- LCP, INP, and CLS diagnostics.
- Network request count, transfer size, largest assets, and request waterfalls.
- FPS/frame-time observations during representative scenes.
- Three.js `renderer.info` diagnostics where relevant.
- Memory trend after repeated entry/exit of planetary scenes.
- Initial Hero readiness and time to first interactive navigation.

For WebGL, report real animation/frame behaviour; do not infer smoothness from Lighthouse alone.

### 11.5 Acceptance criteria

The optimization is acceptable when:

1. The Hero appears without waiting for every later section or planetary texture.
2. The site's approved visual design and content remain intact.
3. No high-impact regression is introduced in transitions, navigation, scroll, or responsive behaviour.
4. Capable desktop devices retain the approved Three.js experience.
5. Phones retain the approved 2D planetary experience and its deliberate scroll pacing.
6. Tablets and weak computers use the appropriate stable rendering mode.
7. Repeated navigation does not cause progressive memory growth, duplicate render loops, or repeated unnecessary downloads.
8. The implementation agent reports actual measurements and clearly identifies anything it could not test.

---

## 12. Final report requirements

At completion, provide a concise but evidence-based report with:

1. **Files changed:** important source files and assets generated/updated.
2. **Loading improvements:** what changed in the initial loading path and progressive resource scheduling.
3. **Three.js improvements:** scene lifecycle, rendering, textures, shaders, memory, adaptive settings, and any 2D fallback decisions.
4. **Asset improvements:** formats, dimensions, compression approach, and confirmation that originals were preserved.
5. **React/JavaScript improvements:** only meaningful changes, without claiming generic optimization.
6. **Mobile/tablet improvements:** the exact rendering and scroll behaviour preserved or adjusted.
7. **Before/after measurements:** actual values, test conditions, and unavailable metrics.
8. **Regression tests:** devices/browsers/routes genuinely tested, with physical vs emulated distinction.
9. **Remaining limitations:** anything unverified or unresolved.
10. **Rollback information:** checkpoint or backup location and how to revert.

Do not claim “60 FPS everywhere”, “all devices tested”, “no regressions”, or “Core Web Vitals passed” unless the evidence supports the statement.

---

## 13. Official technical references

Use these references to confirm API details for the exact versions installed in the project. Do not blindly copy examples for a different major version.

- Core Web Vitals: https://web.dev/articles/vitals
- Three.js resource disposal: https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- Three.js cleanup: https://threejs.org/manual/pages/cleanup.html
- Three.js texture guide: https://threejs.org/manual/pages/textures.html
- Three.js Texture API: https://threejs.org/docs/pages/Texture.html
- Chrome Lighthouse: https://developer.chrome.com/docs/lighthouse/overview/
- MDN Intersection Observer: https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion

---

## 14. Final governing rule

**MAH★P must become faster and more reliable without becoming visually simpler.**

The visitor should experience the same artistic universe, with less waiting, fewer dropped frames, faster navigation, better resource scheduling, and stable performance across devices.

Prefer invisible engineering improvements. Make visual adaptations only when device capability genuinely requires them, and use the approved 2D fallback rather than leaving a weak device with a broken 3D experience.
