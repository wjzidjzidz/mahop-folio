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
