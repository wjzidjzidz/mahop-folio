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
