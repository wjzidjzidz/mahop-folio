/**
 * MAHOP Master Data & Verified Content Records
 * Conforms strictly to MAHOP_MASTER_BLUEPRINT_v1.md
 * 
 * Non-negotiables:
 * - No invented biography, education, dates, client lists, or awards.
 * - No invented credits or garment maker for MAH★P.
 * - No fabricated social profile URLs (handles only).
 * - Exact titles and punctuation preserved.
 */

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface Chapter {
  id: string;
  name: string;
  assetId: string;
  accentColor: string;
  accentHex: string;
  descriptionSnippet?: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  sourcePages: string;
  shortDescription?: string;
  credits: ProjectCredit[];
  creditNote?: string;
  chapters?: Chapter[];
  leadAssetId: string;
  secondaryAssets?: string[];
}

export interface MaterialSwatch {
  id: string; // e.g. SWATCH-01
  label: string; // e.g. "Material 01"
  provisionalPage: string; // "Source page mapping pending verification"
  classification: 'candidate_review';
  aspectRatio: string; // Proposed prototype layout ratio
  textureHint: string;
}

export const CONTACT_INFO = {
  email: 'theycallmemaho@gmail.com',
  emailHref: 'mailto:theycallmemaho@gmail.com',
  phone: '+39 375 1295019',
  phoneHref: 'tel:+393751295019',
  instagramHandle: '@callmemahop',
  tiktokHandle: '@callmemahop',
  note: 'Social profile URLs are unverified in source handover; handles preserved as text.',
};

export const PROJECTS: Record<string, ProjectData> = {
  letoile: {
    id: 'letoile-maho',
    slug: '/work/letoile-maho',
    title: "L'ETOILE MAHO",
    displayTitle: "L'ETOILE MAHO",
    sourcePages: 'Pages 6–15',
    credits: [
      { role: 'Models', name: 'Julien, Kyma & Chaïna' },
      { role: 'Photographer', name: 'Sirine' },
      { role: 'Clothing made by', name: 'Aurelia Mahop Di Toro' },
    ],
    creditNote: 'Credits verified from pages 6–7. Attribution across later chapters is subject to source verification.',
    leadAssetId: 'ETOILE-OPEN-TBD',
    chapters: [
      {
        id: 'mercury',
        name: 'Mercury',
        assetId: 'ETOILE-MERCURY-TBD',
        accentColor: 'Mercury grey',
        accentHex: '#7B7373',
      },
      {
        id: 'uranus',
        name: 'Uranus',
        assetId: 'ETOILE-URANUS-TBD',
        accentColor: 'Uranus pale cyan',
        accentHex: '#95BFBC',
      },
      {
        id: 'pluto',
        name: 'Pluto',
        assetId: 'ETOILE-PLUTO-TBD',
        accentColor: 'Pluto charcoal neutral',
        accentHex: '#454644',
      },
      {
        id: 'mars',
        name: 'Mars',
        assetId: 'ETOILE-MARS-TBD',
        accentColor: 'Mars terracotta orange',
        accentHex: '#E87F3E',
      },
    ],
  },
  mahp: {
    id: 'mah-star-p',
    slug: '/work/mah-star-p',
    title: 'MAH★P',
    displayTitle: 'MAH★P',
    sourcePages: 'Pages 20–22',
    credits: [
      { role: 'Photographer', name: 'Avi Bellaiche' },
      { role: 'Model', name: 'BAAN' },
    ],
    creditNote: 'Garment maker is not identified in source handover. No additional maker credit inferred.',
    leadAssetId: 'MAHP-COLLAGE-01',
    secondaryAssets: ['MAHP-COLLAGE-02', 'MAHP-PHOTO-TBD'],
  },
  aurora: {
    id: 'aurora-de-liage-x-auro-dapunk',
    slug: '/work/aurora-de-liage-x-auro-dapunk',
    title: "AURORA DE LIAGE X AURO DA'PUNK",
    displayTitle: "AURORA DE LIAGE X AURO DA'PUNK",
    sourcePages: 'Pages 3–4',
    credits: [
      { role: 'Photographer', name: 'Raphaël Kassouri' },
      { role: 'Stylist', name: '@Playarabian' },
      { role: 'Model', name: 'Brazy' },
      { role: 'Dress by', name: 'Aurelia Mahop Di Toro' },
    ],
    creditNote: 'Exact title spelling and punctuation preserved. Meaning of X is unstated in source.',
    leadAssetId: 'AURORA-COLLAGE-TBD',
    secondaryAssets: ['AURORA-PHOTO-TBD'],
  },
};

// 27 Provisional Material Swatch Inventory (SWATCH-01 to SWATCH-27)
// Preserves all 27 candidate objects per Master Blueprint Section 6.5.
// Candidate source pages across collection: 2, 5, 9, 11, 13, 15, 16, 18.
// Individual page mappings, distinctness, and material properties remain unverified pending direct source inspection.
export const MATERIAL_SWATCHES: MaterialSwatch[] = Array.from({ length: 27 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');

  return {
    id: `SWATCH-${num}`,
    label: `Material ${num}`,
    provisionalPage: 'Source page mapping pending verification',
    classification: 'candidate_review',
    // Proposed prototype layout aspect ratios (not measured physical swatch dimensions)
    aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '3/4',
    textureHint: 'Textile specimen details pending source verification',
  };
});
