import type { MaterialSwatch } from '../data/content';

export type PlanetKind = 'mercury' | 'uranus' | 'pluto' | 'mars';

export type EnvironmentSceneId =
  | 'gateway'
  | 'letoile-overview'
  | 'mercury'
  | 'uranus'
  | 'pluto'
  | 'mars'
  | 'white-collage'
  | 'editorial-nature'
  | 'aurora-punk'
  | 'ambient-archive';

export interface ProjectEnvironmentConfig {
  id: EnvironmentSceneId;
  label: string;
  subtitle: string;
  accentHex: string;
  secondaryHex: string;
  backdropGradient: string;
  cameraPosition: [number, number, number];
  usesWebGL: boolean;
}

export const PROJECT_ENVIRONMENTS: Record<EnvironmentSceneId, ProjectEnvironmentConfig> = {
  gateway: {
    id: 'gateway',
    label: 'Stage Entrance',
    subtitle: 'Pure deep black nocturnal entrance revealing the four-planet horizon below',
    accentHex: '#F5F3EF',
    secondaryHex: '#000000',
    backdropGradient:
      'radial-gradient(circle at 50% 48%, rgba(10,14,18,0.65) 0%, rgba(0,0,0,1) 78%)',
    cameraPosition: [0, 1.45, 13.4],
    usesWebGL: true,
  },
  'letoile-overview': {
    id: 'letoile-overview',
    label: "L'ETOILE MAHO — Solar Overview",
    subtitle: 'All four planets in synchronized orbital perspective',
    accentHex: '#95BFBC',
    secondaryHex: '#E87F3E',
    backdropGradient:
      'radial-gradient(circle at 50% 48%, rgba(10,14,18,0.65) 0%, rgba(0,0,0,1) 78%)',
    cameraPosition: [0, 0.22, 11.4],
    usesWebGL: true,
  },
  mercury: {
    id: 'mercury',
    label: 'Mercury',
    subtitle: 'Metallic mineral craters, orbiting basalt shards, graphite reflections',
    accentHex: '#908584',
    secondaryHex: '#7B7373',
    backdropGradient:
      'radial-gradient(circle at 50% 44%, rgba(144,133,132,0.28) 0%, rgba(123,115,115,0.12) 42%, rgba(0,0,0,1) 80%)',
    cameraPosition: [-3.4, 0.25, 2.4],
    usesWebGL: true,
  },
  uranus: {
    id: 'uranus',
    label: 'Uranus',
    subtitle: 'Luminous frozen cyan clouds, oblique crystalline rings, cold haze',
    accentHex: '#95BFBC',
    secondaryHex: '#AED5D2',
    backdropGradient:
      'radial-gradient(circle at 50% 44%, rgba(149,191,188,0.28) 0%, rgba(19,104,150,0.14) 44%, rgba(0,0,0,1) 80%)',
    cameraPosition: [3.2, 0.4, 2.5],
    usesWebGL: true,
  },
  pluto: {
    id: 'pluto',
    label: 'Pluto',
    subtitle: 'Silent dark charcoal crust, frost basins, orbiting moonlet',
    accentHex: '#8E9296',
    secondaryHex: '#454644',
    backdropGradient:
      'radial-gradient(circle at 50% 46%, rgba(84,90,98,0.24) 0%, rgba(36,38,42,0.14) 42%, rgba(0,0,0,1) 80%)',
    cameraPosition: [-2.6, -0.35, -0.8],
    usesWebGL: true,
  },
  mars: {
    id: 'mars',
    label: 'Mars',
    subtitle: 'Volcanic terracotta ridges, glowing magma fissures, warm dust',
    accentHex: '#E87F3E',
    secondaryHex: '#C68D68',
    backdropGradient:
      'radial-gradient(circle at 50% 46%, rgba(232,127,62,0.3) 0%, rgba(107,17,17,0.18) 44%, rgba(0,0,0,1) 80%)',
    cameraPosition: [2.8, -0.2, -0.2],
    usesWebGL: true,
  },
  'white-collage': {
    id: 'white-collage',
    label: 'MAH★P — White Collage Interlude',
    subtitle: 'Fluorescent green, black, and white 2D print exhibition theatre',
    accentHex: '#39FF14',
    secondaryHex: '#000000',
    backdropGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAF6 100%)',
    cameraPosition: [0, 0, 7.2],
    usesWebGL: false,
  },
  'editorial-nature': {
    id: 'editorial-nature',
    label: 'Editorial Studio Photography',
    subtitle: 'Nocturnal deep-black and fluorescent-green 2D botanical environment',
    accentHex: '#39FF14',
    secondaryHex: '#345727',
    backdropGradient:
      'linear-gradient(180deg, #020402 0%, rgba(16,32,14,0.95) 55%, #020302 100%)',
    cameraPosition: [0, 0.85, 5.4],
    usesWebGL: false,
  },
  'aurora-punk': {
    id: 'aurora-punk',
    label: "AURORA DE LIAGE X AURO DA'PUNK",
    subtitle: 'Underground photocopy grain, black crochet mesh, wheatpaste torn paper',
    accentHex: '#C9A24D',
    secondaryHex: '#7B0000',
    backdropGradient:
      'radial-gradient(circle at 38% 36%, rgba(124,17,184,0.22) 0%, rgba(123,0,0,0.24) 44%, rgba(8,7,8,1) 84%)',
    cameraPosition: [0, 0.12, 5.7],
    usesWebGL: false,
  },
  'ambient-archive': {
    id: 'ambient-archive',
    label: 'Exhibition Archive Stage',
    subtitle: 'Pure nocturnal editorial ground across Work, Material, and About (zero Three.js starfield)',
    accentHex: '#F5F3EF',
    secondaryHex: '#7B7373',
    backdropGradient: 'linear-gradient(180deg, #000000 0%, #050507 100%)',
    cameraPosition: [0, 0, 7.6],
    usesWebGL: false,
  },
};

export function sceneUsesWebGL(sceneId: EnvironmentSceneId): boolean {
  return PROJECT_ENVIRONMENTS[sceneId]?.usesWebGL ?? true;
}

export function shouldRenderWebGLHost(
  sceneId: EnvironmentSceneId,
  menuOpen: boolean
): boolean {
  if (menuOpen) return false;
  return sceneUsesWebGL(sceneId);
}

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

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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
 * Reversible scroll transition out of the Pure Black Opening Gateway into L'ÉTOILE MAHO.
 */
export function computeHeroGatewayMetrics(
  progress: number,
  reducedMotion: boolean
): HeroGatewayMetrics {
  if (reducedMotion) {
    return {
      wordmarkScale: 1,
      wordmarkOpacity: 1,
      collageOpacity: 1,
      starScale: 1,
      starYOffsetPx: 0,
    };
  }
  const p = clamp01(progress);
  const exitT = smoothStep(0.04, 0.78, p);
  return {
    wordmarkScale: Number((1 - exitT * 0.04).toFixed(4)),
    wordmarkOpacity: Number((1 - exitT).toFixed(4)),
    collageOpacity: Number((1 - exitT).toFixed(4)),
    starScale: 1,
    starYOffsetPx: 0,
  };
}

export interface HeroStarDetachState {
  detachProgress: number;
  isDockedInHero: boolean;
  lettersOpacity: number;
  letterSpreadPx: number;
  subtitleOpacity: number;
  arcOffsetY: number;
}

/**
 * Governs the monumental Hero ★ detaching smoothly out of MAH★P on scroll down
 * to become the single persistent JourneyStarCompanion, and seamlessly reversing
 * back into the central MAH★P lockup at scrollY = 0.
 */
export function computeHeroStarDetachState(
  rawDetachProgress: number,
  reducedMotion: boolean
): HeroStarDetachState {
  if (reducedMotion) {
    return {
      detachProgress: 0,
      isDockedInHero: true,
      lettersOpacity: 1,
      letterSpreadPx: 0,
      subtitleOpacity: 1,
      arcOffsetY: 0,
    };
  }

  const p = clamp01(rawDetachProgress);
  const lettersFade = smoothStep(0.06, 0.68, p);
  const subFade = smoothStep(0.0, 0.38, p);
  const arcOffsetY = Math.sin(p * Math.PI) * 34;

  return {
    detachProgress: Number(p.toFixed(4)),
    isDockedInHero: p < 0.012,
    lettersOpacity: Number((1 - lettersFade).toFixed(4)),
    letterSpreadPx: Number((lettersFade * 18).toFixed(2)),
    subtitleOpacity: Number((1 - subFade).toFixed(4)),
    arcOffsetY: Number(arcOffsetY.toFixed(2)),
  };
}

export interface HeroHorizonRevealMetrics {
  maskStartPercent: number;
  maskFeatherPercent: number;
  maskOpacity: number;
  sceneOpacity: number;
  scrollCueOpacity: number;
}

/**
 * Pure scroll-driven black veil & atmospheric horizon curve bridging the Pure Black Hero
 * into L'ÉTOILE MAHO's shared four-planet Three.js canvas:
 * - p = 0 (Hero resting): top 56% is pure #000000 around MAH★P; bottom portion softly reveals
 *   the lower 4-planet silhouette horizon & cosmic glow at the bottom edge.
 * - p = 0 -> 1 (scrolling down): black mask expands upward & dissolves cleanly to 0 while the
 *   shared camera rises into centered L'ÉTOILE MAHO framing. Fully reversible scrolling up.
 */
export function computeHeroHorizonRevealMetrics(
  progress: number,
  reducedMotion: boolean
): HeroHorizonRevealMetrics {
  if (reducedMotion) {
    return {
      maskStartPercent: 60,
      maskFeatherPercent: 92,
      maskOpacity: 1,
      sceneOpacity: 0.76,
      scrollCueOpacity: 1,
    };
  }

  const p = clamp01(progress);
  const expandT = smoothStep(0.02, 0.78, p);
  const veilFadeT = smoothStep(0.18, 0.86, p);
  const cueFadeT = smoothStep(0.0, 0.34, p);

  return {
    maskStartPercent: Number(lerp(56, -24, expandT).toFixed(2)),
    maskFeatherPercent: Number(lerp(94, 18, expandT).toFixed(2)),
    maskOpacity: Number((1 - veilFadeT).toFixed(4)),
    sceneOpacity: 1,
    scrollCueOpacity: Number((1 - cueFadeT).toFixed(4)),
  };
}

export interface ChapterStageMetrics {
  sceneOpacity: number;
  backdropDim: number;
  titleOpacity: number;
  chapterPhase: 'entering' | 'foreground' | 'settled';
}

/**
 * Reversible prominence curve for project environments across deliberate pinned portals:
 * - Entry & Portal (0..0.58): 3D planetary approach, atmospheric veil & chapter world dominate at full clarity (1.0, dim 0).
 * - Foreground travel (0.58..0.88): background recedes smoothly to subtle atmosphere (0.22)
 *   so oversized fashion photography & cutouts take clear visual priority.
 * - Upward scroll reverses the curve identically.
 */
export function computeChapterStageMetrics(
  progress: number,
  reducedMotion: boolean
): ChapterStageMetrics {
  if (reducedMotion) {
    return {
      sceneOpacity: 0.65,
      backdropDim: 0.22,
      titleOpacity: 1,
      chapterPhase: 'settled',
    };
  }

  const p = clamp01(progress);

  if (p < 0.56) {
    const titleT = smoothStep(0.24, 0.41, p);
    return {
      sceneOpacity: 1,
      backdropDim: 0,
      titleOpacity: Number((0.12 + 0.88 * titleT).toFixed(4)),
      chapterPhase: 'entering',
    };
  }

  if (p <= 0.88) {
    const recedeT = smoothStep(0.56, 0.88, p);
    return {
      sceneOpacity: Number((1.0 - 0.78 * recedeT).toFixed(4)),
      backdropDim: Number((0.14 + 0.54 * recedeT).toFixed(4)),
      titleOpacity: Number((1.0 - 0.32 * smoothStep(0.70, 0.88, p)).toFixed(4)),
      chapterPhase: 'foreground',
    };
  }

  const settleT = smoothStep(0.88, 1.0, p);
  return {
    sceneOpacity: Number((0.22 - 0.04 * settleT).toFixed(4)),
    backdropDim: Number((0.68 + 0.1 * settleT).toFixed(4)),
    titleOpacity: Number((0.68 - 0.28 * settleT).toFixed(4)),
    chapterPhase: 'settled',
  };
}

export interface IntroTimelineMetrics {
  phase: 'writing' | 'star-glow' | 'hero-handoff' | 'settled';
  revealedCount: number; // 0..5 across M, A, H, ★, P
  writeProgress: number; // 0..1 calligraphic light trace
  starGlow: number; // 0..1 refined SVG/CSS radial glow on logo star
  starSettleT: number; // 0..1 pen tracing -> monumental central logo star
  loaderOpacity: number; // 1 -> 0 seamless dissolve into Hero
  heroWordmarkOpacity: number; // 0 -> 1 synchronized Hero emergence
  isComplete: boolean;
}

/**
 * Pure editorial SVG/CSS loading clock (zero Three.js star):
 * - Stage 1 (writing, 0..1.48s): companion star traces light curve and forms M A H ★ P
 * - Stage 2 (star-glow, 1.48..2.60s): central star expands into Hero scale with refined radial light glow
 * - Stage 3 (hero-handoff, 2.60..3.50s): loader dissolves smoothly onto the pure black Hero with exact star continuity
 * - Stage 4 (settled, >=3.50s): loader unmounts invisibly with zero cut, restart, or duplicate star
 */
export function computeIntroTimelineMetrics(
  elapsedSec: number,
  reducedMotion: boolean
): IntroTimelineMetrics {
  if (reducedMotion) {
    return {
      phase: 'settled',
      revealedCount: 5,
      writeProgress: 1,
      starGlow: 0,
      starSettleT: 1,
      loaderOpacity: 0,
      heroWordmarkOpacity: 1,
      isComplete: true,
    };
  }

  const t = Math.max(0, elapsedSec);

  const revealedCount =
    t >= 1.24 ? 5 : t >= 0.96 ? 4 : t >= 0.68 ? 3 : t >= 0.40 ? 2 : t >= 0.14 ? 1 : 0;

  const writeProgress = clamp01(t / 1.42);
  const starSettleT = smoothStep(1.26, 2.05, t);
  // Bell-curve glow crest in Stage 2 that softens cleanly before Hero lock
  const glowRise = smoothStep(1.36, 2.05, t);
  const glowSettle = 1 - smoothStep(2.25, 3.25, t) * 0.85;
  const starGlow = glowRise * glowSettle;

  const handoffT = smoothStep(2.58, 3.42, t);

  const phase: IntroTimelineMetrics['phase'] =
    t >= 3.55
      ? 'settled'
      : t >= 2.58
        ? 'hero-handoff'
        : t >= 1.42
          ? 'star-glow'
          : 'writing';

  return {
    phase,
    revealedCount,
    writeProgress: Number(writeProgress.toFixed(4)),
    starGlow: Number(starGlow.toFixed(4)),
    starSettleT: Number(starSettleT.toFixed(4)),
    loaderOpacity: Number((1 - handoffT).toFixed(4)),
    heroWordmarkOpacity: Number(handoffT.toFixed(4)),
    isComplete: t >= 3.55,
  };
}

export interface PlanetOrbitalPose {
  id: PlanetKind;
  anchor: [number, number, number];
  phaseOffset: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitRadiusZ: number;
  orbitSpeed: number;
  spinSpeed: number;
  baseScale: number;
  boundingRadius: number;
  activeScaleBoost: number;
}

export const SOLAR_PLANET_SPECS: Record<PlanetKind, PlanetOrbitalPose> = {
  mercury: {
    id: 'mercury',
    anchor: [-4.4, 2.0, -1.8],
    phaseOffset: 0.25,
    orbitRadiusX: 0.28,
    orbitRadiusY: 0.12,
    orbitRadiusZ: 0.24,
    orbitSpeed: 0.21,
    spinSpeed: 0.11,
    baseScale: 0.72,
    boundingRadius: 1.62,
    activeScaleBoost: 1.08,
  },
  uranus: {
    id: 'uranus',
    anchor: [4.2, 1.95, -3.6],
    phaseOffset: 1.75,
    orbitRadiusX: 0.34,
    orbitRadiusY: 0.14,
    orbitRadiusZ: 0.28,
    orbitSpeed: 0.14,
    spinSpeed: 0.085,
    baseScale: 0.78,
    boundingRadius: 2.38,
    activeScaleBoost: 1.12,
  },
  pluto: {
    id: 'pluto',
    anchor: [-3.4, -2.25, -5.2],
    phaseOffset: 3.3,
    orbitRadiusX: 0.24,
    orbitRadiusY: 0.11,
    orbitRadiusZ: 0.22,
    orbitSpeed: 0.09,
    spinSpeed: 0.045,
    baseScale: 0.68,
    boundingRadius: 1.56,
    activeScaleBoost: 1.02,
  },
  mars: {
    id: 'mars',
    anchor: [4.1, -2.05, -2.4],
    phaseOffset: 4.85,
    orbitRadiusX: 0.3,
    orbitRadiusY: 0.13,
    orbitRadiusZ: 0.25,
    orbitSpeed: 0.17,
    spinSpeed: 0.105,
    baseScale: 0.78,
    boundingRadius: 1.78,
    activeScaleBoost: 1.12,
  },
};

/**
 * Pure bounded orbital position solver for each planet so planets never overlap
 * at any time t across the four-quadrant constellation.
 */
export function computePlanetWorldPosition(
  kind: PlanetKind,
  timeSec: number,
  focusPlanet: PlanetKind | null,
  isStatic: boolean
): [number, number, number] {
  const spec = SOLAR_PLANET_SPECS[kind];
  if (isStatic) {
    return [...spec.anchor];
  }
  const orbitAngle = timeSec * spec.orbitSpeed + spec.phaseOffset;
  const orbitWeight = focusPlanet === kind ? 0.18 : 1;
  return [
    spec.anchor[0] + Math.cos(orbitAngle) * spec.orbitRadiusX * orbitWeight,
    spec.anchor[1] + Math.sin(orbitAngle * 0.7) * spec.orbitRadiusY * orbitWeight,
    spec.anchor[2] + Math.sin(orbitAngle) * spec.orbitRadiusZ * orbitWeight,
  ];
}

export interface SolarSystemCameraState {
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  focusPlanet: PlanetKind | null;
  planetScales: Record<PlanetKind, number>;
  planetSpreadX: number;
  portalApproach: number;
  portalEntry: number;
  portalVeilOpacity: number;
  exteriorOpacity: number;
  interiorWorldOpacity: number;
  recedeFactor: number;
}

/**
 * Unified 4-Planet Solar System + Immersive Planetary Portal State for L'ÉTOILE MAHO.
 * - 'letoile-overview': all 4 planets orbit in separated quadrants (Mars & Uranus clearly separated).
 * - 'mercury' | 'uranus' | 'pluto' | 'mars':
 *   1. p 0.00..0.30: Camera focuses & glides deliberately toward the planet's outer rim.
 *   2. p 0.24..0.43: Camera pierces its atmospheric portal veil while exterior shells fade
 *      and the chapter's immersive 3D planetary habitat opens cleanly inside the pinned stage.
 *   3. p 0.43..1.00: Camera drifts serenely over the planet's dedicated terrain/sky while scrolling
 *      photography unfolds cleanly in foreground. Scrolling upward reverses identically.
 */
export function computeSolarSystemState(
  sceneId: EnvironmentSceneId,
  chapterProgress: number,
  reducedMotion: boolean,
  aspectRatio = 1.6
): SolarSystemCameraState {
  const p = clamp01(chapterProgress);
  const portraitPush = aspectRatio < 0.9 ? (0.9 - aspectRatio) * 10.6 : 0;
  const overviewFov =
    aspectRatio < 0.85
      ? Number(lerp(56, 46, clamp01((aspectRatio - 0.45) / 0.4)).toFixed(2))
      : 46;
  const planetSpreadX = aspectRatio < 0.88 ? Number(Math.max(0.58, aspectRatio / 0.88).toFixed(3)) : 1;
  const overviewCam: [number, number, number] = [0, 0.22, Number((11.4 + portraitPush).toFixed(3))];
  const overviewLook: [number, number, number] = [0, 0, -3.0];

  const defaultScales: Record<PlanetKind, number> = {
    mercury: SOLAR_PLANET_SPECS.mercury.baseScale,
    uranus: SOLAR_PLANET_SPECS.uranus.baseScale,
    pluto: SOLAR_PLANET_SPECS.pluto.baseScale,
    mars: SOLAR_PLANET_SPECS.mars.baseScale,
  };

  if (sceneId === 'gateway') {
    const entryT = reducedMotion ? 0 : smoothStep(0.02, 0.96, p);
    const camPos: [number, number, number] = [
      0,
      Number(lerp(1.45, overviewCam[1], entryT).toFixed(3)),
      Number(lerp(13.4 + portraitPush, overviewCam[2], entryT).toFixed(3)),
    ];
    const camLook: [number, number, number] = [
      0,
      Number(lerp(3.85, overviewLook[1], entryT).toFixed(3)),
      overviewLook[2],
    ];
    return {
      cameraPosition: camPos,
      lookAt: camLook,
      fov: overviewFov,
      focusPlanet: null,
      planetScales: defaultScales,
      planetSpreadX,
      portalApproach: 0,
      portalEntry: 0,
      portalVeilOpacity: 0,
      exteriorOpacity: 1,
      interiorWorldOpacity: 0,
      recedeFactor: 0,
    };
  }

  if (
    sceneId !== 'mercury' &&
    sceneId !== 'uranus' &&
    sceneId !== 'pluto' &&
    sceneId !== 'mars'
  ) {
    return {
      cameraPosition: overviewCam,
      lookAt: overviewLook,
      fov: overviewFov,
      focusPlanet: null,
      planetScales: defaultScales,
      planetSpreadX,
      portalApproach: 0,
      portalEntry: 0,
      portalVeilOpacity: 0,
      exteriorOpacity: 1,
      interiorWorldOpacity: 0,
      recedeFactor: 0,
    };
  }

  const targetSpec = SOLAR_PLANET_SPECS[sceneId];
  const portalApproach = reducedMotion ? 1 : smoothStep(0.05, 0.30, p);
  const portalEntry = reducedMotion ? 1 : smoothStep(0.24, 0.43, p);
  const recedeFactor = reducedMotion ? 0.25 : smoothStep(0.56, 0.94, p);

  // Bell-curve atmospheric mist crossing as the camera pierces the planet's outer rim
  const veilPeak = Math.sin(clamp01((portalEntry - 0.04) / 0.92) * Math.PI);
  const portalVeilOpacity = reducedMotion ? 0 : Number((veilPeak * 0.42).toFixed(4));

  // Exterior 4-planet shell glides forward into the lens then hands off cleanly to interior world
  const exteriorOpacity = Number((1 - smoothStep(0.27, 0.40, p)).toFixed(4));
  const interiorWorldOpacity = Number(smoothStep(0.27, 0.43, p).toFixed(4));

  // Stage A camera: approaches target planet center smoothly
  const approachCam: [number, number, number] = [
    targetSpec.anchor[0] * planetSpreadX * 0.86,
    targetSpec.anchor[1] * 0.86 + 0.06,
    targetSpec.anchor[2] + 3.85,
  ];
  const approachLook: [number, number, number] = [
    targetSpec.anchor[0] * planetSpreadX,
    targetSpec.anchor[1],
    targetSpec.anchor[2],
  ];

  // Stage B camera: glides inside the planet's dedicated habitat world at [0, -24, 0] space-offset
  const habitatTravel = smoothStep(0.43, 1.0, p);
  const habitatOrigin: [number, number, number] = [0, -24.0, 7.6 - habitatTravel * 2.2];
  const habitatLook: [number, number, number] = [
    sceneId === 'mercury' ? -0.3 : sceneId === 'mars' ? 0.35 : 0,
    sceneId === 'uranus' ? -23.92 : -23.74,
    -4.5,
  ];

  let cameraPosition: [number, number, number];
  let lookAt: [number, number, number];
  let fov = 46;

  if (portalEntry < 0.5) {
    const camT = portalApproach;
    const throughT = smoothStep(0.08, 0.5, portalEntry);
    const midCamZ = approachCam[2] - throughT * 3.1;
    cameraPosition = [
      Number(lerp(overviewCam[0], approachCam[0], camT).toFixed(3)),
      Number(lerp(overviewCam[1], approachCam[1], camT).toFixed(3)),
      Number(lerp(overviewCam[2], midCamZ, camT).toFixed(3)),
    ];
    lookAt = [
      Number(lerp(overviewLook[0], approachLook[0], camT).toFixed(3)),
      Number(lerp(overviewLook[1], approachLook[1], camT).toFixed(3)),
      Number(lerp(overviewLook[2], approachLook[2], camT).toFixed(3)),
    ];
    fov = Number(lerp(46, 52, throughT).toFixed(2));
  } else {
    const settleT = smoothStep(0.5, 1.0, portalEntry);
    cameraPosition = [
      Number(lerp(habitatOrigin[0] * 0.4, habitatOrigin[0], settleT).toFixed(3)),
      Number(habitatOrigin[1].toFixed(3)),
      Number((habitatOrigin[2] + (1 - settleT) * 1.4).toFixed(3)),
    ];
    lookAt = [
      Number(habitatLook[0].toFixed(3)),
      Number(habitatLook[1].toFixed(3)),
      Number(habitatLook[2].toFixed(3)),
    ];
    fov = Number(lerp(52, 47, settleT).toFixed(2));
  }

  const planetScales: Record<PlanetKind, number> = {
    mercury:
      sceneId === 'mercury'
        ? Number(lerp(SOLAR_PLANET_SPECS.mercury.baseScale, SOLAR_PLANET_SPECS.mercury.activeScaleBoost, portalApproach).toFixed(3))
        : Number((SOLAR_PLANET_SPECS.mercury.baseScale * 0.85).toFixed(3)),
    uranus:
      sceneId === 'uranus'
        ? Number(lerp(SOLAR_PLANET_SPECS.uranus.baseScale, SOLAR_PLANET_SPECS.uranus.activeScaleBoost, portalApproach).toFixed(3))
        : Number((SOLAR_PLANET_SPECS.uranus.baseScale * 0.85).toFixed(3)),
    pluto:
      sceneId === 'pluto'
        ? Number(lerp(SOLAR_PLANET_SPECS.pluto.baseScale, SOLAR_PLANET_SPECS.pluto.activeScaleBoost, portalApproach).toFixed(3))
        : Number((SOLAR_PLANET_SPECS.pluto.baseScale * 0.85).toFixed(3)),
    mars:
      sceneId === 'mars'
        ? Number(lerp(SOLAR_PLANET_SPECS.mars.baseScale, SOLAR_PLANET_SPECS.mars.activeScaleBoost, portalApproach).toFixed(3))
        : Number((SOLAR_PLANET_SPECS.mars.baseScale * 0.85).toFixed(3)),
  };

  return {
    cameraPosition,
    lookAt,
    fov,
    focusPlanet: sceneId,
    planetScales,
    planetSpreadX,
    portalApproach: Number(portalApproach.toFixed(4)),
    portalEntry: Number(portalEntry.toFixed(4)),
    portalVeilOpacity,
    exteriorOpacity: reducedMotion ? 0 : exteriorOpacity,
    interiorWorldOpacity: reducedMotion ? 1 : interiorWorldOpacity,
    recedeFactor: Number(recedeFactor.toFixed(4)),
  };
}

export interface PlanetJourneyState {
  phase: 'selection' | 'approach' | 'entry' | 'arrival';
  normalizedTime: number;
  portalProgress: number; // Fed cleanly into computeSolarSystemState(target, portalProgress)
  isComplete: boolean;
}

/**
 * Pure ~2.6s controlled planetary click-flight timeline:
 * 1. Selection (0.00..0.16): Locks target world in orbital overview cleanly without visiting other chapters.
 * 2. Camera Approach (0.16..0.56): Smooth deceleration toward target planet shell.
 * 3. Atmospheric Entry (0.56..0.80): Crosses planet atmosphere veil into habitat horizon.
 * 4. Arrival (0.80..1.00): Settles into chapter habitat stage ready for foreground photos.
 */
export function computePlanetJourneyState(
  elapsedSec: number,
  durationSec = 2.6
): PlanetJourneyState {
  const safeDur = Math.max(0.4, durationSec);
  const t = clamp01(elapsedSec / safeDur);

  let portalProgress = 0;
  let phase: PlanetJourneyState['phase'] = 'selection';

  if (t < 0.16) {
    phase = 'selection';
    portalProgress = smoothStep(0, 0.16, t) * 0.07;
  } else if (t < 0.56) {
    phase = 'approach';
    const localT = smoothStep(0.16, 0.56, t);
    portalProgress = lerp(0.07, 0.28, localT);
  } else if (t < 0.80) {
    phase = 'entry';
    const localT = smoothStep(0.56, 0.80, t);
    portalProgress = lerp(0.28, 0.44, localT);
  } else {
    phase = 'arrival';
    const localT = smoothStep(0.80, 1.0, t);
    portalProgress = lerp(0.44, 0.50, localT);
  }

  return {
    phase,
    normalizedTime: Number(t.toFixed(4)),
    portalProgress: Number(portalProgress.toFixed(4)),
    isComplete: t >= 1,
  };
}

/**
 * Deterministic asymmetrical dismantling sequence for the 24 Material samples.
 */
export const DISMANTLE_RANK_24 = [
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
  if (p <= 0.1) {
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

  const start = 0.1 + waveNorm * 0.62;
  const end = Math.min(0.92, start + 0.18);
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

export interface PuzzleTileMaskState {
  veilOpacity: number;
  revealProgress: number;
  insetPercent: number;
}

/**
 * Deterministic 24-cell puzzle mask state tied to each Material sample's departure.
 * As sample `index` disappears (opacity 1 -> 0), the corresponding puzzle veil cell over
 * the underlying About composition opens piece-by-piece, reversing cleanly upward.
 */
export function computePuzzleTileMaskState(
  index: number,
  total: number,
  progress: number,
  reducedMotion: boolean
): PuzzleTileMaskState {
  if (reducedMotion) {
    return {
      veilOpacity: 0,
      revealProgress: 1,
      insetPercent: 50,
    };
  }
  const sample = computeMaterialSampleState(index, total, progress, false);
  const reveal = clamp01(1 - sample.opacity);
  return {
    veilOpacity: Number((1 - smoothStep(0.15, 0.92, reveal)).toFixed(4)),
    revealProgress: Number(reveal.toFixed(4)),
    insetPercent: Number((reveal * 50).toFixed(2)),
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
 * Continuous Material -> About puzzle reveal readiness:
 * The full About stage sits underneath the 24-tile puzzle curtain from early progress
 * so individual puzzle tiles immediately uncover pieces of the illustration, heading, and text.
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
  // About canvas already exists behind the puzzle cells once samples start dismantling (p > 0.10)
  const canvasPresence = smoothStep(0.08, 0.24, p);
  const fullClarity = smoothStep(0.68, 0.92, p);

  return {
    headingOpacity: Number(canvasPresence.toFixed(4)),
    illustrationOpacity: Number(canvasPresence.toFixed(4)),
    textOpacity: Number(Math.max(canvasPresence * 0.95, fullClarity).toFixed(4)),
    translateY: Number(((1 - fullClarity) * 8).toFixed(2)),
    illustrationScale: Number((0.97 + fullClarity * 0.03).toFixed(4)),
    isRevealed: p >= 0.84,
  };
}

export interface StarCompanionState {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotationDeg: number;
  opacity: number;
  settledInFooter: boolean;
  trailSpreadPx: number;
}

/**
 * Computes expressive, multi-axis curved journey for the living BrandStar companion,
 * responding smoothly to scroll velocity and direction, adapting trajectory per world,
 * and gliding to a completely stationary stop when docked inside the white Contact footer.
 */
export function computeStarCompanionState(
  overallProgress: number,
  isFooterVisible: boolean,
  reducedMotion: boolean,
  scrollVelocity = 0,
  scrollDirection: -1 | 0 | 1 = 1
): StarCompanionState {
  if (reducedMotion) {
    return {
      xPercent: 50,
      yPercent: 50,
      scale: 1,
      rotationDeg: 0,
      opacity: isFooterVisible ? 1 : 0,
      settledInFooter: isFooterVisible,
      trailSpreadPx: 0,
    };
  }

  const p = clamp01(overallProgress);
  const dockT = isFooterVisible ? 1 : smoothStep(0.92, 0.99, p);

  if (dockT >= 0.98) {
    return {
      xPercent: 50,
      yPercent: 50,
      scale: 1,
      rotationDeg: 0,
      opacity: 1,
      settledInFooter: true,
      trailSpreadPx: 0,
    };
  }

  const speedFactor = Math.min(1, Math.abs(scrollVelocity) / 1400);
  // Sweeping S-curves & diagonal arcs across quiet periphery/mid-margins without blocking center photos
  const waveA = Math.sin(p * Math.PI * 5.2) * (4.2 + speedFactor * 3.5);
  const waveB = Math.cos(p * Math.PI * 3.1) * (12 + speedFactor * 8);
  const baseLaneX = p < 0.08 ? 50 + (92 - 50) * smoothStep(0, 0.08, p) : 91.5 - Math.max(0, waveA);
  const baseLaneY = 18 + p * 56 + waveB * 0.45;

  const clampedX = Math.min(95.5, Math.max(6, baseLaneX));
  const clampedY = Math.min(86, Math.max(12, baseLaneY));

  const xPercent = clampedX + (50 - clampedX) * dockT;
  const yPercent = clampedY + (50 - clampedY) * dockT;

  const dirSpin = scrollDirection === -1 ? -1 : 1;
  const rotationDeg = (1 - dockT) * (p * 420 * dirSpin + speedFactor * 42 * dirSpin);
  const scale = 0.9 + 0.22 * speedFactor + 0.14 * Math.sin(p * Math.PI * 2) + 0.14 * dockT;

  return {
    xPercent: Number(xPercent.toFixed(2)),
    yPercent: Number(yPercent.toFixed(2)),
    scale: Number(scale.toFixed(3)),
    rotationDeg: Number(rotationDeg.toFixed(1)),
    opacity: p < 0.01 ? 0.9 : 0.95,
    settledInFooter: false,
    trailSpreadPx: Number((6 + speedFactor * 18).toFixed(1)),
  };
}

export interface ContactStarMorphState {
  morphT: number;
  targetScaleMultiplier: number;
  haloOpacity: number;
  inkMix: number;
  dockEmblemVisible: boolean;
  companionVisible: boolean;
}

/**
 * Pure continuous visual morph curve transforming the traveling star companion (24px glowing cosmic star)
 * into the static Contact footer star (44px crisp black BrandStar upright at 0deg).
 * Only hands off at pixel alignment (`morphT >= 0.995` and `distancePx < 2`) so zero jump or duplicate star ever appears.
 */
export function computeContactStarMorph(
  inDockZone: boolean,
  distancePx: number,
  maxDockRadiusPx = 280,
  targetEmblemPx = 44,
  companionBasePx = 24
): ContactStarMorphState {
  if (!inDockZone) {
    return {
      morphT: 0,
      targetScaleMultiplier: 1,
      haloOpacity: 0.28,
      inkMix: 0,
      dockEmblemVisible: false,
      companionVisible: true,
    };
  }

  const distRatio = clamp01(1 - distancePx / Math.max(40, maxDockRadiusPx));
  const morphT = smoothStep(0.05, 0.98, distRatio);
  const fullScale = targetEmblemPx / Math.max(12, companionBasePx);
  const targetScaleMultiplier = lerp(1, fullScale, morphT);
  const settled = morphT >= 0.99 && distancePx < 2.2;

  return {
    morphT: Number(morphT.toFixed(4)),
    targetScaleMultiplier: Number(targetScaleMultiplier.toFixed(4)),
    haloOpacity: Number(((1 - morphT) * 0.28).toFixed(4)),
    inkMix: Number(morphT.toFixed(4)),
    dockEmblemVisible: settled,
    companionVisible: !settled,
  };
}

export type DeviceTier = 'phone' | 'tablet' | 'desktop';
export type PlanetaryRenderMode = '2d' | '3d';

export interface PlanetaryCapabilitySnapshot {
  deviceTier: DeviceTier;
  webglSupported: boolean;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  quickBenchmarkMs?: number;
}

/**
 * Classifies viewport & pointer inputs into phone, tablet, or desktop.
 * - Phones (< 768px): strictly 2D planetary experience (zero Three.js WebGL).
 * - Tablets (768..1023px, or coarse-pointer touch tablets <= 1366px): evaluated once upfront.
 * - Desktop (>= 1024px non-tablet): preserves existing Three.js WebGL experience untouched.
 */
export function classifyDeviceTier(
  viewportWidth: number,
  isCoarsePointer = false,
  maxTouchPoints = 0
): DeviceTier {
  if (!Number.isFinite(viewportWidth) || viewportWidth < 768) {
    return 'phone';
  }
  if (viewportWidth < 1024) {
    return 'tablet';
  }
  if (isCoarsePointer && maxTouchPoints > 0 && viewportWidth <= 1366) {
    return 'tablet';
  }
  return 'desktop';
}

export function isPlanetaryScene(sceneId: EnvironmentSceneId): boolean {
  return (
    sceneId === 'gateway' ||
    sceneId === 'letoile-overview' ||
    sceneId === 'mercury' ||
    sceneId === 'uranus' ||
    sceneId === 'pluto' ||
    sceneId === 'mars'
  );
}

/**
 * Resolves the stable planetary rendering mode before L'Étoile Maho renders.
 * Never flips mid-scroll between 3D and 2D.
 */
export function resolvePlanetaryRenderMode(
  snapshot: PlanetaryCapabilitySnapshot
): PlanetaryRenderMode {
  if (snapshot.deviceTier === 'phone') {
    return '2d';
  }

  if (snapshot.deviceTier === 'desktop') {
    return snapshot.webglSupported ? '3d' : '2d';
  }

  // Tablet: capability & smoothness check
  if (!snapshot.webglSupported || snapshot.isSoftwareGl || snapshot.reducedMotion) {
    return '2d';
  }

  const cores = snapshot.hardwareConcurrency ?? 0;
  if (cores > 0 && cores < 4) {
    return '2d';
  }

  const mem = snapshot.deviceMemory ?? 0;
  if (mem > 0 && mem < 4) {
    return '2d';
  }

  const benchMs = snapshot.quickBenchmarkMs ?? 0;
  if (benchMs > 18) {
    return '2d';
  }

  return '3d';
}

export interface Planetary2DTransitionState {
  focusPlanet: PlanetKind | null;
  overviewLiftYPercent: number;
  overviewScale: number;
  planetFocusScale: Record<PlanetKind, number>;
  planetFadeOpacity: Record<PlanetKind, number>;
  planetShiftToCenter: number;
  portalExpandScale: number;
  portalIrisRadiusPercent: number;
  portalVeilOpacity: number;
  exteriorOpacity: number;
  interiorWorldOpacity: number;
  worldParallaxProgress: number;
  recedeFactor: number;
}

/**
 * Pure, scroll-reversible 2D planetary approach, silhouette/iris expansion,
 * atmospheric portal veil, and bespoke world reveal curve for phones & fallback tablets.
 */
export function computePlanetary2DTransitionState(
  sceneId: EnvironmentSceneId,
  chapterProgress: number,
  reducedMotion: boolean
): Planetary2DTransitionState {
  const p = clamp01(chapterProgress);
  const neutralScales: Record<PlanetKind, number> = {
    mercury: 1,
    uranus: 1,
    pluto: 1,
    mars: 1,
  };
  const neutralOpacity: Record<PlanetKind, number> = {
    mercury: 1,
    uranus: 1,
    pluto: 1,
    mars: 1,
  };

  if (sceneId === 'gateway') {
    const liftT = reducedMotion ? 0 : smoothStep(0.02, 0.96, p);
    return {
      focusPlanet: null,
      overviewLiftYPercent: Number(lerp(28, 0, liftT).toFixed(2)),
      overviewScale: Number(lerp(0.86, 1, liftT).toFixed(4)),
      planetFocusScale: neutralScales,
      planetFadeOpacity: neutralOpacity,
      planetShiftToCenter: 0,
      portalExpandScale: 1,
      portalIrisRadiusPercent: 0,
      portalVeilOpacity: 0,
      exteriorOpacity: 1,
      interiorWorldOpacity: 0,
      worldParallaxProgress: 0,
      recedeFactor: 0,
    };
  }

  if (
    sceneId !== 'mercury' &&
    sceneId !== 'uranus' &&
    sceneId !== 'pluto' &&
    sceneId !== 'mars'
  ) {
    return {
      focusPlanet: null,
      overviewLiftYPercent: 0,
      overviewScale: 1,
      planetFocusScale: neutralScales,
      planetFadeOpacity: neutralOpacity,
      planetShiftToCenter: 0,
      portalExpandScale: 1,
      portalIrisRadiusPercent: 0,
      portalVeilOpacity: 0,
      exteriorOpacity: 1,
      interiorWorldOpacity: 0,
      worldParallaxProgress: 0,
      recedeFactor: 0,
    };
  }

  if (reducedMotion) {
    return {
      focusPlanet: sceneId,
      overviewLiftYPercent: 0,
      overviewScale: 1,
      planetFocusScale: {
        mercury: sceneId === 'mercury' ? 1.8 : 0.7,
        uranus: sceneId === 'uranus' ? 1.8 : 0.7,
        pluto: sceneId === 'pluto' ? 1.8 : 0.7,
        mars: sceneId === 'mars' ? 1.8 : 0.7,
      },
      planetFadeOpacity: {
        mercury: sceneId === 'mercury' ? 1 : 0,
        uranus: sceneId === 'uranus' ? 1 : 0,
        pluto: sceneId === 'pluto' ? 1 : 0,
        mars: sceneId === 'mars' ? 1 : 0,
      },
      planetShiftToCenter: 1,
      portalExpandScale: 1,
      portalIrisRadiusPercent: 145,
      portalVeilOpacity: 0,
      exteriorOpacity: 0,
      interiorWorldOpacity: 1,
      worldParallaxProgress: 0.25,
      recedeFactor: 0.25,
    };
  }

  const focusT = smoothStep(0.01, 0.14, p);
  const othersFade = 1 - smoothStep(0.01, 0.12, p);
  const portalT = smoothStep(0.10, 0.28, p);
  const irisRadius = lerp(0, 145, smoothStep(0.12, 0.28, p));
  const veilPeak = Math.sin(clamp01((p - 0.10) / 0.18) * Math.PI);
  const portalVeilOpacity = p >= 0.10 && p <= 0.28 ? Number((veilPeak * 0.78).toFixed(4)) : 0;
  const exteriorOpacity = Number((1 - smoothStep(0.16, 0.27, p)).toFixed(4));
  const interiorWorldOpacity = Number(smoothStep(0.12, 0.27, p).toFixed(4));
  const worldParallaxProgress = Number(clamp01((p - 0.18) / 0.82).toFixed(4));
  const recedeFactor = Number(smoothStep(0.56, 0.94, p).toFixed(4));

  const targetExpandScale = Number(lerp(1, 5.4, portalT).toFixed(3));
  const targetFocusScale = Number(lerp(1, 1.85, focusT).toFixed(3));

  return {
    focusPlanet: sceneId,
    overviewLiftYPercent: 0,
    overviewScale: 1,
    planetFocusScale: {
      mercury: sceneId === 'mercury' ? targetFocusScale : Number(lerp(1, 0.72, focusT).toFixed(3)),
      uranus: sceneId === 'uranus' ? targetFocusScale : Number(lerp(1, 0.72, focusT).toFixed(3)),
      pluto: sceneId === 'pluto' ? targetFocusScale : Number(lerp(1, 0.72, focusT).toFixed(3)),
      mars: sceneId === 'mars' ? targetFocusScale : Number(lerp(1, 0.72, focusT).toFixed(3)),
    },
    planetFadeOpacity: {
      mercury: sceneId === 'mercury' ? 1 : Number(othersFade.toFixed(4)),
      uranus: sceneId === 'uranus' ? 1 : Number(othersFade.toFixed(4)),
      pluto: sceneId === 'pluto' ? 1 : Number(othersFade.toFixed(4)),
      mars: sceneId === 'mars' ? 1 : Number(othersFade.toFixed(4)),
    },
    planetShiftToCenter: Number(focusT.toFixed(4)),
    portalExpandScale: targetExpandScale,
    portalIrisRadiusPercent: Number(irisRadius.toFixed(2)),
    portalVeilOpacity,
    exteriorOpacity,
    interiorWorldOpacity,
    worldParallaxProgress,
    recedeFactor,
  };
}

export interface MobilePlanetaryScrubState {
  sceneId: EnvironmentSceneId;
  progress: number;
}

const PLANETARY_SCENE_ORDER: Record<EnvironmentSceneId, number> = {
  gateway: 0,
  'letoile-overview': 1,
  mercury: 2,
  uranus: 3,
  pluto: 4,
  mars: 5,
  'white-collage': 6,
  'editorial-nature': 7,
  'aurora-punk': 8,
  'ambient-archive': 9,
};

function isPlanetChapterScene(sceneId: EnvironmentSceneId): sceneId is PlanetKind {
  return (
    sceneId === 'mercury' ||
    sceneId === 'uranus' ||
    sceneId === 'pluto' ||
    sceneId === 'mars'
  );
}

/**
 * Pure frame-delta mobile smooth-scrubbing controller.
 * Keeps native scroll as target input while damping rendered progress so fast mobile swipes
 * unfold progressively through focus -> expansion -> portal veil -> 2D world, yet slow scrolling
 * feels tightly attached and upward direction reversals respond immediately.
 */
export function stepMobilePlanetaryScrubState(
  current: MobilePlanetaryScrubState,
  targetSceneId: EnvironmentSceneId,
  targetProgress: number,
  dtSec: number,
  reducedMotion: boolean,
  isDirectFlight = false
): MobilePlanetaryScrubState {
  const clampedTarget = clamp01(targetProgress);

  if (reducedMotion || isDirectFlight) {
    return {
      sceneId: targetSceneId,
      progress: Number(clampedTarget.toFixed(4)),
    };
  }

  const dt = Math.max(0.001, Math.min(0.05, dtSec));
  let activeProgress = clamp01(current.progress);

  // Handle cross-scene transitions cleanly without teleporting past a chapter's portal
  if (current.sceneId !== targetSceneId) {
    const prevOrder = PLANETARY_SCENE_ORDER[current.sceneId] ?? 0;
    const nextOrder = PLANETARY_SCENE_ORDER[targetSceneId] ?? 0;
    const movingDownward = nextOrder > prevOrder;

    if (isPlanetChapterScene(targetSceneId)) {
      if (movingDownward) {
        // Seed near chapter entry (0) so a rapid swipe sweeps progressively through the full portal
        activeProgress = clampedTarget <= 0.04 ? clampedTarget : 0;
      } else {
        // Reversing upward from a later chapter (e.g., Uranus -> Mercury): stay near the target gallery edge
        activeProgress = Math.min(1, Math.max(clampedTarget, Math.min(0.92, clampedTarget + 0.06)));
      }
    } else {
      activeProgress = clampedTarget;
    }
  }

  const delta = clampedTarget - activeProgress;
  if (Math.abs(delta) < 0.0008) {
    return {
      sceneId: targetSceneId,
      progress: Number(clampedTarget.toFixed(4)),
    };
  }

  const isReversing = delta < 0;
  const inPortalWindow = activeProgress < 0.34;
  // Responsive damping (lambda) so slow thumb drags stay 1:1, paired with a portal velocity cap
  // so fast flicks glide smoothly through intermediate portal layers instead of skipping them.
  const lambda = isReversing ? 9.5 : 7.8;
  const expStep = Math.abs(delta) * (1 - Math.exp(-lambda * dt));
  const maxRatePerSec = isReversing
    ? 0.78
    : inPortalWindow
      ? 0.44
      : 0.96;
  const step = Math.min(expStep, maxRatePerSec * dt);
  const nextProgress = clamp01(activeProgress + Math.sign(delta) * step);

  return {
    sceneId: targetSceneId,
    progress: Number(nextProgress.toFixed(4)),
  };
}


