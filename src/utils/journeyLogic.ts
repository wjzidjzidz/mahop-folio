import type { MaterialSwatch } from '../data/content';

export type EnvironmentSceneId =
  | 'gateway'
  | 'mercury'
  | 'uranus'
  | 'pluto'
  | 'mars'
  | 'editorial-nature'
  | 'aurora-punk';

export interface ProjectEnvironmentConfig {
  id: EnvironmentSceneId;
  label: string;
  subtitle: string;
  accentHex: string;
  secondaryHex: string;
  backdropGradient: string;
  cameraPosition: [number, number, number];
}

export const PROJECT_ENVIRONMENTS: Record<EnvironmentSceneId, ProjectEnvironmentConfig> = {
  gateway: {
    id: 'gateway',
    label: 'Stage Entrance',
    subtitle: 'Deep celestial nocturne and subtle kinetic starlight',
    accentHex: '#F5F3EF',
    secondaryHex: '#6B1111',
    backdropGradient:
      'radial-gradient(circle at 50% 45%, rgba(107,17,17,0.16) 0%, rgba(18,18,22,0.4) 44%, rgba(0,0,0,1) 82%)',
    cameraPosition: [0, 0, 7.2],
  },
  mercury: {
    id: 'mercury',
    label: 'Mercury',
    subtitle: 'Metallic mineral craters, orbiting basalt shards, graphite reflections',
    accentHex: '#7B7373',
    secondaryHex: '#908584',
    backdropGradient:
      'radial-gradient(circle at 50% 44%, rgba(144,133,132,0.28) 0%, rgba(123,115,115,0.12) 42%, rgba(0,0,0,1) 80%)',
    cameraPosition: [0, 0.08, 6.1],
  },
  uranus: {
    id: 'uranus',
    label: 'Uranus',
    subtitle: 'Luminous frozen cyan clouds, oblique crystalline rings, cold haze',
    accentHex: '#95BFBC',
    secondaryHex: '#AED5D2',
    backdropGradient:
      'radial-gradient(circle at 50% 44%, rgba(149,191,188,0.28) 0%, rgba(19,104,150,0.14) 44%, rgba(0,0,0,1) 80%)',
    cameraPosition: [0, 0.14, 6.5],
  },
  pluto: {
    id: 'pluto',
    label: 'Pluto',
    subtitle: 'Silent dark charcoal crust, frost basins, orbiting moonlet',
    accentHex: '#454644',
    secondaryHex: '#8E9296',
    backdropGradient:
      'radial-gradient(circle at 50% 46%, rgba(84,90,98,0.24) 0%, rgba(36,38,42,0.14) 42%, rgba(0,0,0,1) 80%)',
    cameraPosition: [0, 0.05, 6.2],
  },
  mars: {
    id: 'mars',
    label: 'Mars',
    subtitle: 'Volcanic terracotta ridges, glowing magma fissures, warm dust',
    accentHex: '#E87F3E',
    secondaryHex: '#C68D68',
    backdropGradient:
      'radial-gradient(circle at 50% 46%, rgba(232,127,62,0.3) 0%, rgba(107,17,17,0.18) 44%, rgba(0,0,0,1) 80%)',
    cameraPosition: [0, 0.1, 6.0],
  },
  'editorial-nature': {
    id: 'editorial-nature',
    label: 'Editorial Studio Photography',
    subtitle: 'Botanical emerald terrain, wind-swept grass, diffused daylight shafts',
    accentHex: '#618F65',
    secondaryHex: '#345727',
    backdropGradient:
      'linear-gradient(180deg, rgba(16,28,14,0.96) 0%, rgba(52,87,39,0.34) 50%, rgba(7,12,6,1) 100%)',
    cameraPosition: [0, 0.85, 5.4],
  },
  'aurora-punk': {
    id: 'aurora-punk',
    label: "AURORA DE LIAGE X AURO DA'PUNK",
    subtitle: 'Underground concrete gallery walls, torn-paper reliefs, crimson & violet spots',
    accentHex: '#7C11B8',
    secondaryHex: '#7B0000',
    backdropGradient:
      'radial-gradient(circle at 38% 36%, rgba(124,17,184,0.28) 0%, rgba(123,0,0,0.18) 44%, rgba(6,5,8,1) 82%)',
    cameraPosition: [0, 0.12, 5.7],
  },
};

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function smoothStep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Returns strictly the 24 mapped MaterialSwatch records, excluding unresolved candidates.
 */
export function getMappedMaterialSwatches(swatches: MaterialSwatch[]): MaterialSwatch[] {
  return swatches.filter((swatch) => swatch.mappingStatus === 'mapped' && Boolean(swatch.image));
}

export interface HeroGatewayMetrics {
  wordmarkScale: number;
  wordmarkOpacity: number;
  collageOpacity: number;
  starScale: number;
  starYOffsetPx: number;
}

/**
 * Reversible scroll transition out of the Opening Gateway into L'ÉTOILE MAHO.
 */
export function computeHeroGatewayMetrics(
  progress: number,
  reducedMotion: boolean
): HeroGatewayMetrics {
  if (reducedMotion) {
    return {
      wordmarkScale: 1,
      wordmarkOpacity: 1,
      collageOpacity: 0.9,
      starScale: 1,
      starYOffsetPx: 0,
    };
  }
  const p = clamp01(progress);
  const exitT = smoothStep(0.05, 0.85, p);
  return {
    wordmarkScale: Number((1 + exitT * 0.16).toFixed(4)),
    wordmarkOpacity: Number((1 - exitT * 0.92).toFixed(4)),
    collageOpacity: Number((1 - exitT * 0.88).toFixed(4)),
    starScale: Number((1 + exitT * 0.45).toFixed(4)),
    starYOffsetPx: Number((-exitT * 42).toFixed(2)),
  };
}

export interface ChapterStageMetrics {
  sceneOpacity: number;
  backdropDim: number;
  titleOpacity: number;
  chapterPhase: 'entering' | 'foreground' | 'settled';
}

/**
 * Reversible prominence curve for project Three.js environments:
 * - Entry (0..0.20): 3D world and chapter title dominate cleanly (0.90..1.0).
 * - Foreground travel (0.20..0.84): Three.js world recedes smoothly to subtle atmosphere (0.16..0.24)
 *   so oversized fashion photography & cutouts take clear visual priority.
 * - Upward scroll reverses the curve identically.
 */
export function computeChapterStageMetrics(
  progress: number,
  reducedMotion: boolean
): ChapterStageMetrics {
  if (reducedMotion) {
    return {
      sceneOpacity: 0.55,
      backdropDim: 0.3,
      titleOpacity: 1,
      chapterPhase: 'settled',
    };
  }

  const p = clamp01(progress);

  if (p < 0.2) {
    const enterT = smoothStep(0, 0.2, p);
    return {
      sceneOpacity: Number((0.82 + 0.18 * enterT).toFixed(4)),
      backdropDim: Number((0.1 + 0.1 * enterT).toFixed(4)),
      titleOpacity: Number((0.88 + 0.12 * enterT).toFixed(4)),
      chapterPhase: 'entering',
    };
  }

  if (p <= 0.84) {
    const recedeT = smoothStep(0.2, 0.8, p);
    return {
      sceneOpacity: Number((1.0 - 0.82 * recedeT).toFixed(4)), // 1.0 -> 0.18
      backdropDim: Number((0.2 + 0.5 * recedeT).toFixed(4)),
      titleOpacity: Number((1.0 - 0.35 * smoothStep(0.65, 0.84, p)).toFixed(4)),
      chapterPhase: 'foreground',
    };
  }

  const settleT = smoothStep(0.84, 1.0, p);
  return {
    sceneOpacity: Number((0.18 - 0.04 * settleT).toFixed(4)), // lingers gently at 0.14..0.18
    backdropDim: Number((0.7 + 0.1 * settleT).toFixed(4)),
    titleOpacity: Number((0.65 - 0.3 * settleT).toFixed(4)),
    chapterPhase: 'settled',
  };
}

/**
 * Deterministic asymmetrical dismantling sequence for the 24 Material samples.
 */
const DISMANTLE_RANK_24 = [
  0, 5, 18, 23,
  2, 7, 13, 21,
  1, 6, 16, 20,
  4, 11, 14, 19,
  3, 8, 15, 22,
  9, 10, 12, 17,
] as const;

export interface MaterialSampleVisualState {
  opacity: number;
  translateY: number;
  scale: number;
  isInteractive: boolean;
}

export function computeMaterialSampleState(
  index: number,
  total: number,
  progress: number,
  reducedMotion: boolean
): MaterialSampleVisualState {
  if (reducedMotion || total <= 0) {
    return {
      opacity: 1,
      translateY: 0,
      scale: 1,
      isInteractive: true,
    };
  }

  const p = clamp01(progress);
  if (p <= 0.12) {
    return {
      opacity: 1,
      translateY: 0,
      scale: 1,
      isInteractive: true,
    };
  }

  const mappedRankIndex = DISMANTLE_RANK_24.indexOf(index as (typeof DISMANTLE_RANK_24)[number]);
  const rank =
    mappedRankIndex >= 0
      ? mappedRankIndex
      : ((index * 7) % Math.max(1, total));
  const waveNorm = total > 1 ? rank / (total - 1) : 0;

  // Stagger exits organically across p ∈ [0.14, 0.86] so final samples finish clearing cleanly as About blooms
  const start = 0.14 + waveNorm * 0.56;
  const end = Math.min(0.88, start + 0.18);
  const t = smoothStep(start, end, p);

  const opacity = Number((1 - t).toFixed(4));
  const translateY = Number((-24 * t).toFixed(2));
  const scale = Number((1 - 0.08 * t).toFixed(4));

  return {
    opacity,
    translateY,
    scale,
    isInteractive: opacity > 0.2,
  };
}

export interface AboutRevealState {
  headingOpacity: number;
  illustrationOpacity: number;
  textOpacity: number;
  translateY: number;
  illustrationScale: number;
  isRevealed: boolean;
}

/**
 * Continuous Material -> About overlap sequence:
 * - About heading rises smoothly while outer textile specimens clear (0.58..0.76)
 * - Central authentic cover illustration emerges at center stage (0.66..0.84)
 * - Verified factual text blooms beside the illustration (0.74..0.90)
 */
export function computeAboutRevealState(
  materialProgress: number,
  reducedMotion: boolean,
  immediateReveal = false
): AboutRevealState {
  if (reducedMotion || immediateReveal) {
    return {
      headingOpacity: 1,
      illustrationOpacity: 1,
      textOpacity: 1,
      translateY: 0,
      illustrationScale: 1,
      isRevealed: true,
    };
  }

  const p = clamp01(materialProgress);
  const headingT = smoothStep(0.58, 0.76, p);
  const illustrationT = smoothStep(0.66, 0.84, p);
  const textT = smoothStep(0.74, 0.90, p);

  return {
    headingOpacity: Number(headingT.toFixed(4)),
    illustrationOpacity: Number(illustrationT.toFixed(4)),
    textOpacity: Number(textT.toFixed(4)),
    translateY: Number(((1 - illustrationT) * 28).toFixed(2)),
    illustrationScale: Number((0.94 + illustrationT * 0.06).toFixed(4)),
    isRevealed: p >= 0.82,
  };
}

export interface StarCompanionState {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotationDeg: number;
  opacity: number;
  settledInFooter: boolean;
}

/**
 * Computes calm, periphery-safe trajectory for the guiding BrandStar companion,
 * gradually curving toward the centered dock when entering the white footer.
 */
export function computeStarCompanionState(
  overallProgress: number,
  isFooterVisible: boolean,
  reducedMotion: boolean
): StarCompanionState {
  if (reducedMotion) {
    return {
      xPercent: 50,
      yPercent: 50,
      scale: 1,
      rotationDeg: 0,
      opacity: isFooterVisible ? 1 : 0,
      settledInFooter: isFooterVisible,
    };
  }

  const p = clamp01(overallProgress);
  const dockT = isFooterVisible ? 1 : smoothStep(0.88, 0.98, p);

  if (dockT >= 0.98) {
    return {
      xPercent: 50,
      yPercent: 50,
      scale: 1,
      rotationDeg: 0,
      opacity: 1,
      settledInFooter: true,
    };
  }

  // Subtle quiet gutter on right edge [94.0%..96.4%]
  const safetyEdgeX = 95.2 - Math.sin(p * Math.PI * 2.5) * 1.2;
  const travelY = 18 + p * 58;

  const xPercent = safetyEdgeX + (50 - safetyEdgeX) * dockT;
  const yPercent = travelY + (50 - travelY) * dockT;
  const rotationDeg = (1 - dockT) * (p * 260);
  const scale = 0.86 + 0.16 * Math.sin(p * Math.PI) + 0.16 * dockT;

  return {
    xPercent: Number(xPercent.toFixed(2)),
    yPercent: Number(yPercent.toFixed(2)),
    scale: Number(scale.toFixed(3)),
    rotationDeg: Number(rotationDeg.toFixed(1)),
    opacity: p < 0.015 ? 0.85 : 0.92,
    settledInFooter: false,
  };
}
