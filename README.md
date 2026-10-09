# MAH★P — Nocturnal Textile Theatre (Visual Prototype v1)

Visual and interaction prototype for **MAH★P**, an image-led artistic portfolio for fashion, textile, photography, collage, illustration, and visual-art work by Aurelia Mahop Di Toro.

Official Brand Identity: **`MAH★P`** (featuring the custom solid vector star icon)  
Opening Sequence: **Signature Theatrical Intro Loader** (star rotation → letter assembly → curtain split)  
Creative Direction: **“Nocturnal Textile Theatre — a stage, not a catalogue.”**  
Motion Principle: **“Reveal, settle, drift.”**  
Visual Phrase: **“Ink on black paper.”**

---

## 1. Architectural Foundation & Framework

- **Framework**: React 19 + TypeScript + Vite.
- **Brand Identity**: Reusable `<BrandLogo />` component pairing Anton display typography with precision `<BrandStar />` vector silhouette across headers, footers, homepage, and intro loader.
- **Custom Star Cursor**: Bespoke graphic signature cursor (`<StarCursor />`) inspired by the `MAH★P` star. Employs `mix-blend-mode: difference` for optical contrast over black and white surfaces, hardware-accelerated pointer tracking, subtle hover emphasis on interactive controls, and tactile click compression. Restricted to devices with fine pointers (`hover: hover` and `pointer: fine`) with full accessibility/fallback support.
- **Theatrical Intro Loader**: Multi-phase brand opening sequence (`<IntroLoader />`):
  1. Isolated star rotates 360° at viewport center (0–550ms).
  2. Letters `MAH` and `P` arrive from left and right (450–1000ms).
  3. Unified `MAH★P` logo settles (1000–1250ms).
  4. Theatrical curtain split reveals stage (1250–1750ms).
  - Triggers on direct entry / page reload; stays inactive during internal client navigation.
  - Honors `prefers-reduced-motion` with instant dismissal.
- **Styling**: Tailwind CSS with CSS Custom Property Design Tokens (`--stage-black`, `--interface-white`, `--source-aurora-purple`, etc.).
- **Routing**: Client-side lightweight History API router with complete direct-route addressability, deep link support, keyboard focus management, and skip links.
- **Target Deployment**: Suitable for static deployment on Netlify.

---

## 2. Seven Principal Routes

All seven canonical routes specified in the Master Blueprint are directly accessible and linked:

1. `/` — Opening visual stage with monumental `MAH★P` wordmark, artistic cast silhouette slot, featured L'ETOILE MAHO, featured MAH★P white collage break, and Material Library preview.
2. `/work` — Curated archive sequence with contrasting visual weights (asymmetric layouts, no uniform cards).
3. `/work/letoile-maho` — Four planetary chapters: **Mercury, Uranus, Pluto, Mars** with sampled palette accents and verified credits from pages 6–7.
4. `/work/mah-star-p` — The striking white collage interlude (pages 20–21) preserved intact against black negative space; page 22 photography. Exact star title preserved: `MAH★P`.
5. `/work/aurora-de-liage-x-auro-dapunk` — Exact title and punctuation preserved. Dynamic transition from torn-edge collage to editorial studio photography.
6. `/material` — Material Library displaying **all 27 provisional textile-swatch objects** with accessible native `<dialog>` inspection modal (Escape key, keyboard focus trap and restoration).
7. `/about` — Honest factual portfolio description, direct email (`theycallmemaho@gmail.com`) and phone (`+39 375 1295019`) links, and text handles `@callmemahop`. No invented biography.

---

## 3. Asset Conventions & Placeholder Manifest

- Placeholder tracking manifest: located at `src/data/prototype-assets.md`.
- Structural placeholders render architectural coordinates, exact aspect ratios, grid patterns, silhouette contours, and visible status labels (`PLACEHOLDER — REPLACE WITH VERIFIED MAHOP ASSET`).
- No authentic credits are attributed to stock imagery.
- All 27 provisional swatch records (`SWATCH-01` through `SWATCH-27`) are retained until direct visual source inspection confirms duplicate or distinct status.

---

## 4. Scripts & Commands

- `npm run dev` — Run Vite development server on port 3000.
- `npm run build` — Compile TypeScript and generate production assets in `dist/`.
- `npm run lint` — Validate TypeScript code without emitting.

---

## 5. Known Limitations & Handoff Checklist Before Final Release

- **Source Asset Extraction**: The source PDF (`Portfolio_3.pdf`) and extracted raster/vector files remain to be inspected directly in the workspace to replace the structural placeholders.
- **Swatch Classification**: Review the 27 provisional swatch objects against candidate source pages 2, 5, 9, 11, 13, 15, 16, 18 to finalize distinct counts.
- **Social Profile URLs**: Instagram and TikTok handles (`@callmemahop`) are confirmed, but exact URLs (`instagram.com/...` / `tiktok.com/...`) require direct confirmation before activating hyperlinks.
- **Font Licensing**: Anton and supporting Space Grotesk/Inter fonts should have their local Open Font License files packaged for production deployment.
