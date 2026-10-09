import type { PortfolioAsset } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from './portfolioAssets';

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
  provisionalPage: string;
  classification: 'candidate_review';
  aspectRatio: string;
  textureHint: string;
  image?: PortfolioAsset;
  mappingStatus: 'mapped' | 'unresolved';
}

export const CONTACT_INFO = {
  email: 'theycallmemaho@gmail.com',
  emailHref: 'mailto:theycallmemaho@gmail.com',
  phone: '+39 375 1295019',
  phoneHref: 'tel:+393751295019',
  instagramHandle: '@callmemahop',
  instagramHref: 'https://www.instagram.com/callmemahop/',
  tiktokHandle: '@callmemahop',
  tiktokHref: 'https://www.tiktok.com/@callmemahop',
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

const materialSources = [
  ['p. 9 · Mercury samples', 'Grey knitted sample gathered into a knot'],
  ['p. 9 · Mercury samples', 'Grey knit sample with silver beads'],
  ['p. 9 · Mercury samples', 'Grey knit sample with a blue beaded motif'],
  ['p. 11 · Uranus samples', 'Pale blue lace-like knit sample with open holes'],
  ['p. 11 · Uranus samples', 'White and blue knit sample with beads'],
  ['p. 11 · Uranus samples', 'Grey knit sample with a circuit-like pattern'],
  ['p. 13 · Pluto samples', 'Navy and grey zebra-stripe knit sample'],
  ['p. 13 · Pluto samples', 'Grey knit sample with a cabled texture'],
  ['p. 15 · Mars samples', 'Orange chunky knit sample with yellow beads'],
  ['p. 15 · Mars samples', 'Brown and orange layered knit sample'],
  ['p. 15 · Mars samples', 'Orange knit sample with a honeycomb texture and brown cord'],
  ['p. 2 · Other samples', 'Pink and olive patterned knit sample'],
  ['p. 2 · Other samples', 'Brown and rust textured knit sample'],
  ['p. 2 · Other samples', 'Dusty pink ribbed knit sample'],
  ['p. 2 · Other samples', 'Red knit sample with vertical cable-like ribs'],
  ['p. 5 · Other samples', 'Green knit sample with raised outline motif'],
  ['p. 5 · Other samples', 'Leopard-pattern knit sample with gold coin-shaped trim'],
  ['p. 5 · Other samples', 'Red knit sample with looped cord decoration on an orange edge'],
  ['p. 5 · Other samples', 'Red and cream chevron knit sample'],
  ['p. 16 · Other samples', 'Yellow and ochre geometric knit sample'],
  ['p. 16 · Other samples', 'Green knit sample with neon yellow laces'],
  ['p. 18 · Other samples', 'Brown knit sample with thin yellow and orange zigzag lines'],
  ['p. 18 · Other samples', 'Cream sculptural knit sample with folded forms'],
  ['p. 18 · Other samples', 'Brown and cream patterned knit sample'],
] as const;

// Preserve the existing 27 provisional records. The supplied placement map
// maps 24 visible assets, holds two candidates, and does not reconcile one record.
export const MATERIAL_SWATCHES: MaterialSwatch[] = Array.from({ length: 27 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const source = materialSources[i];
  const image = PORTFOLIO_ASSETS.material[i];

  return {
    id: `SWATCH-${num}`,
    label: `Material ${num}`,
    provisionalPage: source?.[0] ?? 'Placement mapping unresolved',
    classification: 'candidate_review',
    aspectRatio: image ? `${image.width}/${image.height}` : '1/1',
    textureHint: source?.[1] ?? 'No source mapping assigned in the supplied placement map',
    image,
    mappingStatus: image ? 'mapped' : 'unresolved',
  };
});
