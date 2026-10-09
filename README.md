# MAH★P — Nocturnal Textile Theatre

Artistic portfolio website for **MAH★P**, presenting fashion, textile architecture, photography, collage, illustration, and visual-art work by Aurelia Mahop Di Toro.

Official Brand Identity: **`MAH★P`** (featuring the custom solid vector star icon)  
Opening Sequence: **Signature Theatrical Intro Loader** (star rotation → letter assembly → curtain split)  
Creative Direction: **“Nocturnal Textile Theatre — a stage, not a catalogue.”**  
Motion Principle: **“Reveal, settle, drift.”**  
Visual Phrase: **“Ink on black paper.”**

---

## 1. Architectural Foundation & Framework

- **Framework**: React 19 + TypeScript + Vite.
- **Brand Identity**: Reusable `<BrandLogo />` component pairing Anton display typography with precision `<BrandStar />` vector silhouette across headers, footers, homepage, and intro loader.
- **Custom Star Cursor**: Bespoke graphic signature cursor (`<StarCursor />`) inspired by the `MAH★P` star. Employs `mix-blend-mode: difference` for optical contrast over black and white surfaces, hardware-accelerated pointer tracking, subtle hover emphasis on interactive controls, and tactile click compression. Restricted to devices with fine pointers (`hover: hover` and `pointer: fine`). Automatically disabled when `prefers-reduced-motion` is active (native browser cursor retained).
- **Theatrical Intro Loader**: Multi-phase brand opening sequence (`<IntroLoader />`):
  1. Isolated star rotates 360° at viewport center (0–550ms).
  2. Letters `MAH` and `P` arrive from left and right (450–1000ms).
  3. Unified `MAH★P` logo settles (1000–1250ms).
  4. Theatrical curtain split reveals stage (1250–1750ms).
  - Triggers strictly on direct initial entry or genuine browser reload; stays inactive during internal client navigation.
  - Honors `prefers-reduced-motion` with instant dismissal.
- **Styling**: Tailwind CSS with CSS Custom Property Design Tokens (`--stage-black`, `--interface-white`, `--source-aurora-purple`, etc.).
- **Routing**: Client-side History API router with direct-route addressability, skip links, and client-side page transitions.
- **Deployment Configuration**: `netlify.toml` configured with SPA fallback redirects (`/*` -> `/index.html` 200). Note: live direct-route verification depends on the actual Netlify hosting environment.

---

## 2. Seven Principal Routes

All seven canonical routes specified in the Master Blueprint are defined and navigable:

1. `/` — Opening visual stage with monumental `MAH★P` wordmark, artistic cast silhouette slot, featured L'ETOILE MAHO, featured MAH★P white collage break, and Material Library preview.
2. `/work` — Curated archive sequence with contrasting visual weights (asymmetric layouts, no uniform cards).
3. `/work/letoile-maho` — Four planetary chapters: **Mercury, Uranus, Pluto, Mars** with sampled palette accents and verified credits from pages 6–7.
4. `/work/mah-star-p` — The striking white collage interlude (pages 20–21) preserved intact against black negative space; page 22 photography. Exact star title preserved: `MAH★P`.
5. `/work/aurora-de-liage-x-auro-dapunk` — Exact title and punctuation preserved. Transition from torn-edge collage to editorial studio photography.
6. `/material` — Material Library displays 24 mapped images in the existing `<dialog>` inspection modal. All 27 provisional records remain in source data: two duplicate candidates are held and one record remains unmatched.
7. `/about` — Factual portfolio description, direct email (`theycallmemaho@gmail.com`) and phone (`+39 375 1295019`) links, plus links to Instagram and TikTok at `@callmemahop`. No invented biography.

---

## 3. Portfolio Assets

- Mapped artwork from the supplied asset set is stored under `public/portfolio-assets/` and used on the Home, Work, L'Etoile MaHo, MAH★P, Aurora, About, and Material routes.
- Asset paths, intrinsic dimensions, alt text, placement slots, and publication-review flags are centralized in `src/data/portfolioAssets.ts`; rendering uses `src/components/PortfolioImage.tsx`.
- `src/data/prototype-assets.md` records the integration state, remaining inventory reconciliation, and publication caveats.
- Source mappings, rights, and model-consent statuses remain unverified for some assets. Confirm clearance before public deployment.

---

## 4. Scripts & Commands

- `npm run dev` — Run Vite development server on port 3000.
- `npm run build` — Validate TypeScript (`tsc --noEmit`) and generate production bundle in `dist/`.
- `npm run lint` — Run TypeScript type checking.
- `npm run clean` — Remove `dist/` build directory.

---

## 5. Technical Status & Handoff Checklist Before Final Release

- **Netlify Route Verification**: `netlify.toml` configures the SPA fallback. Live direct-route verification requires testing on the production Netlify deployment.
- **SEO & Per-Route Static HTML**: Document title and description metadata update dynamically in the client on route change. True per-route static HTML prerendering is not currently implemented and remains an outstanding improvement.
- **Asset Publication Clearance**: Confirm rights, model consent, and credit requirements for assets flagged for review before deploying publicly.
- **Swatch Reconciliation**: All 27 provisional records remain in source; review candidate source pages 2, 5, 9, 11, 13, 15, 16, 18 to resolve two held duplicate candidates and one unmatched record. Do not infer fibre content or physical material properties from images.
- **Social Profiles**: Instagram and TikTok link to `https://www.instagram.com/callmemahop/` and `https://www.tiktok.com/@callmemahop`.
- **Font Licensing**: Anton and supporting Space Grotesk/Inter fonts should have their local Open Font License files packaged for production deployment.
