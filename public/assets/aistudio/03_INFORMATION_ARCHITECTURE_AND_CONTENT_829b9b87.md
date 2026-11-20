# MAH★P — Information Architecture & Content Specification

## 1. Routes (preserve exactly)

| Route | Purpose | Required behaviour |
|---|---|---|
| `/` | Main continuous journey | Home → featured project experiences → Materials → About → Contact/footer |
| `/work` | Curated project archive | Three distinct project entries; not a repeated card grid |
| `/work/letoile-maho` | L'ETOILE MAHO | Four planetary chapters and its original image sequence |
| `/work/mah-star-p` | MAH★P | White Interlude followed by Editorial Studio Photography |
| `/work/aurora-de-liage-x-auro-dapunk` | Aurora | Punk collage → fashion photography |
| `/material` | Material Table | 24 samples, detail interaction, then About reveal |
| `/about` | Direct About destination | Directly reveal the same verified About content and illustration |

No route may be renamed. All must load directly and survive refresh under the current router/Netlify configuration.

## 2. Main journey `/`

### Movement 01 — The Gateway
- Large MAHOP wordmark.
- Supporting identity line currently used by the site, e.g. `NOCTURNAL TEXTILE THEATRE` / `A STAGE, NOT A CATALOGUE`.
- Low-opacity original images from L'Étoile, MAH★P and Aurora drift in layered directions.
- Short scroll cue; no blocking intro or long mandatory preloader.

### Movement 02 — L'ETOILE MAHO
- Intro title and source-backed short description.
- Four chapters in exact order: Mercury, Uranus, Pluto, Mars.
- Each chapter shows its planet scene, then image-led sequences.
- Route CTA to the detail page.

### Movement 03 — MAH★P
- White Interlude using the two original flattened source compositions.
- Editorial Studio Photography as a second act with the grass/nature Three.js environment and two original photos.
- Preserve current photographer/model credit.

### Movement 04 — AURORA DE LIAGE X AURO DA'PUNK
- Dark punk/urban environment.
- Original collage appears first.
- Photography sequence follows.
- Route CTA to the detail page.

### Movement 05 — Materials → About → Contact
- One full 24-image table.
- Scroll-linked, staggered and reversible image exit sequence.
- About only fully appears after the material sequence completes.
- Existing illustration central, verified text beside it.
- White footer with the travelling star and existing contact details.

## 3. Work archive `/work`

Display exactly the three currently published projects:

1. `L'ETOILE MAHO` — four planetary chapters; page/source range 6–15.
2. `MAH★P` — white collage and Editorial Studio Photography; page/source range 20–22.
3. `AURORA DE LIAGE X AURO DA'PUNK` — collage and photography; page/source range 3–4.

Use variable editorial compositions and one strong authentic image per project. Each entire project item must be keyboard-accessible and link to the existing detail route. Do not invent a fourth project or split Editorial Studio Photography into a standalone route; it is a sequence inside the MAH★P project.

## 4. Source-backed project content and credits

### L'ETOILE MAHO
Four chapters: Mercury, Uranus, Pluto, Mars.

Project-level credits verified in the existing Work archive:
- Models: Julien, Kyma & Chaïna
- Photographer: Sirine
- Clothing made by: Aurelia Mahop Di Toro

Keep credits at project level unless the source asset mapping proves a chapter-specific credit. Do not extend credits to other projects.

### MAH★P
White Interlude: source pages 20–21.
Editorial Studio Photography: source page 22.
- Photographer: Avi Bellaiche
- Model: BAAN
- Garment maker is not credited in this source; do not add one.

### AURORA DE LIAGE X AURO DA'PUNK
Source pages 3–4.
- Photographer: Raphaël Kassouri
- Stylist: `@Playarabian`
- Model: Brazy
- Dress by: Aurelia Mahop Di Toro

Do not interpret the `X` in the title, invent a project story or alter spelling/punctuation.

## 5. About content

- Preserve the existing About page content and illustration(s).
- The About layout is newly approved: heading above; illustration centred; concise verified text alongside.
- Use the existing factual description of the work: fashion, textile architecture, photography, collage, illustration and visual art.
- Do not invent career history, biography, age, education, exhibitions, awards, client names, dates or personal narrative.
- Where there is no supported biography, use a short artistic statement based only on the work already presented.

## 6. Contact details (preserve exactly)

- Email: `theycallmemaho@gmail.com` → `mailto:theycallmemaho@gmail.com`
- Phone: `+39 375 1295019` → `tel:+393751295019`
- Instagram handle: `@callmemahop`
- TikTok handle: `@callmemahop`

Use the exact existing Instagram/TikTok URLs already stored in the current project. If an actual destination cannot be verified from source, keep the existing handle as text rather than inventing a URL. Do not introduce a third-party contact form.

## 7. Visitor-facing copy direction

Use short editorial copy, not generic marketing claims. Suitable UI phrases include:

- `A STAGE, NOT A CATALOGUE`
- `NOCTURNAL TEXTILE THEATRE`
- `ENTER THE CHAPTER`
- `MATERIAL TABLE`
- `THE CREATOR BEHIND MAH★P`
- `THE JOURNEY ENDS HERE.`
- `THE CREATION CONTINUES.`

These are proposed interface labels, not factual claims. Preserve the original title and credit wording where supplied by the source.

## 8. Editorial integrity

Never invent:
- Textile fibre/composition, weave, technique, provenance or manufacturing specifications.
- Garment names, collection dates or commercial availability.
- Model/photographer/stylist credits.
- Project descriptions that imply unsupported intentions or outcomes.
- External clients, brand partnerships or professional achievements.

Use neutral material IDs (`MATERIAL 01` … `MATERIAL 24`) where source descriptions do not provide a real name. Keep visitor-facing UI in English, except original names/credits.
