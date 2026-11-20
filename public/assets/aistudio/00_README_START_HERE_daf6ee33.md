# MAH★P — Immersive Experience V2

**Complete implementation handoff for Google AI Studio**  
**Version:** 2.0  
**Date:** 20 November 2026  
**Project:** `mahop-folio`  
**Live reference:** https://mahop-prototype.netlify.app/  
**Primary implementation target:** existing Google AI Studio project and its connected repository

---

## 1. What this package is

This is the approved, complete design and technical handoff for transforming the existing MAH★P portfolio into an immersive, image-led fashion and textile experience.

It follows the documentation discipline of `NK_FOR_REAL_MASTER_BLUEPRINT.md`: one source-of-truth blueprint, focused technical specifications, explicit architecture/library choices, project-specific Skills, acceptance criteria, content/asset integrity rules, and a self-contained implementation prompt.

**Important execution requirement:** Google AI Studio is expected to implement the entire approved transformation in one run. It must not return a plan, roadmap, partial mock-up, staged proposal, or request approval between sections. It must inspect the project internally, then implement the complete scope, self-correct, run available checks, and return one factual completion report.

## 2. Files in this package

| File | Purpose |
|---|---|
| `01_MAHOP_MASTER_BLUEPRINT_V2.md` | Single source of truth for the approved experience |
| `02_ART_DIRECTION_AND_DESIGN_SYSTEM.md` | Visual language, typography, colour and composition rules |
| `03_INFORMATION_ARCHITECTURE_AND_CONTENT.md` | Routes, sections, project content, copy and navigation |
| `04_THREEJS_ENVIRONMENT_SPEC.md` | Six Three.js environments and scene behaviour |
| `05_SCROLL_AND_MOTION_DESIGN_SPEC.md` | Scroll choreography, pinned/sticky scenes, reversibility and star companion |
| `06_IMAGE_STORYTELLING_AND_ASSET_RULES.md` | Editorial photography, asset use, cropping and image motion |
| `07_MATERIAL_TABLE_ABOUT_CONTACT_SPEC.md` | 24-sample table, detail interaction, About reveal and white footer |
| `08_TECHNICAL_ARCHITECTURE_AND_LIBRARIES.md` | Existing stack preservation, dependency guidance and component architecture |
| `09_RESPONSIVE_ACCESSIBILITY_PERFORMANCE.md` | Desktop/tablet/mobile, accessibility, WebGL fallback and performance |
| `10_QA_ACCEPTANCE_AND_RELEASE.md` | Required checks, test matrix and truthful delivery report |
| `11_CONTENT_ASSET_PROVENANCE_REGISTER.md` | Confirmed URLs, image inventory, credits and unresolved checks |
| `12_GOOGLE_AI_STUDIO_PROJECT_INSTRUCTIONS.md` | Replacement instructions for the project's system/custom instructions |
| `13_GOOGLE_AI_STUDIO_MASTER_PROMPT.md` | The one complete build prompt to send in the project chat |
| `14_LIBRARY_AND_DOCUMENTATION_REFERENCES.md` | Official documentation links and compatibility notes |
| `15_MAHOP_COMPLETE_REFERENCE_BUNDLE.md` | One consolidated attachment containing the full technical reference and Skills |
| `skills/` | Five focused project Skills for art direction, Three.js, motion, assets and QA |

## 3. Exact handoff method

1. Open the existing Google AI Studio project **`mahop-folio`**. Do not create a separate portfolio project.
2. Before making changes, create a recoverable checkpoint/branch if the connected environment supports it. Do not publish, deploy, push or overwrite the production site automatically.
3. Replace the old MAH★P Custom/System Instructions completely with the contents of `12_GOOGLE_AI_STUDIO_PROJECT_INSTRUCTIONS.md`. Do not append them to older contradictory instructions. Preserve a copy of previous instructions outside the active instruction field if needed.
4. Attach `15_MAHOP_COMPLETE_REFERENCE_BUNDLE.md` to the project as the single consolidated technical reference. Also attach `12_GOOGLE_AI_STUDIO_PROJECT_INSTRUCTIONS.md` and `13_GOOGLE_AI_STUDIO_MASTER_PROMPT.md` separately. The individual files and `skills/` folder remain available for traceability.
5. Send **only** the contents of `13_GOOGLE_AI_STUDIO_MASTER_PROMPT.md` as the implementation request.
6. Let Google AI Studio implement the full experience in one run. It may perform internal audit/build/test/correction steps, but it must not stop to present a plan or ask for routine approval.
7. Review its final report, preview, changed files and actual test evidence before publishing.

## 4. The approved experience in one glance

- **Home:** oversized MAHOP wordmark; low-opacity original project photographs drifting in layered directions; controlled invitation to scroll.
- **L'ETOILE MAHO:** four chapter-specific scenes — Mercury, Uranus, Pluto and Mars — each with a Three.js planet environment that stays behind the photographic story as scroll advances.
- **MAH★P:** first an intact white collage interlude from original source pages 20–21; then **Editorial Studio Photography**, with a Three.js natural/grass environment behind the two original photographs from source page 22.
- **AURORA DE LIAGE X AURO DA'PUNK:** Three.js punk/urban street-art environment; original collage followed by the original fashion photography.
- **Materials:** exactly the 24 currently mapped sample images, arranged together as one deliberate table. Each opens in a detail view. As the visitor scrolls, selected samples disappear in a staggered, reversible sequence.
- **About:** fully revealed only after the Materials sequence has completed; heading above, current authentic illustration centred, verified text alongside.
- **Star companion:** one recognisable MAH★P star accompanies the visitor through the whole journey and settles at the centre of the white footer.
- **Footer:** white, calm, with existing email, phone, Instagram and TikTok details. Closing phrase: “THE JOURNEY ENDS HERE. THE CREATION CONTINUES.”

## 5. Source-of-truth hierarchy

When documents disagree, use this order:

1. The user's latest approved directions in this package (especially the new immersive experience, the 24-item table, and single-run build requirement).
2. The actual existing repository, its current content/data/asset manifests and current route implementation.
3. The current live MAH★P reference pages and their source assets.
4. The specifications in this package.
5. Older MAH★P plans, prompts and prototypes.

The prior brief's instruction **not** to use Three.js is superseded by the user's explicit approval in this V2 package. The prior project's React/TypeScript/Vite/Tailwind/router/Netlify stack is not superseded; it must be inspected and preserved unless the repository proves otherwise and a small compatibility adjustment is essential.

## 6. Honesty and release rule

This package is a specification, not evidence that code has already been changed, tests have passed, legal rights have been cleared or a deployment has occurred. Google AI Studio must report only actions and checks it actually completed.
