import test from 'node:test';
import assert from 'node:assert/strict';
import { MATERIAL_SWATCHES } from '../data/content';
import {
  classifyDeviceTier,
  computeAboutRevealState,
  computeChapterStageMetrics,
  computeContactStarMorph,
  computeHeroGatewayMetrics,
  computeHeroHorizonRevealMetrics,
  computeHeroStarDetachState,
  computeIntroTimelineMetrics,
  computeMaterialSampleState,
  computePlanetary2DTransitionState,
  computePlanetJourneyState,
  computePlanetWorldPosition,
  computePuzzleTileMaskState,
  computeSolarSystemState,
  computeStarCompanionState,
  evaluateWebGLFramePacing,
  getMappedMaterialSwatches,
  isPlanetaryScene,
  resolvePlanetaryRenderMode,
  sceneUsesWebGL,
  shouldRenderWebGLHost,
  SOLAR_PLANET_SPECS,
  stepMobilePlanetaryScrubState,
  type MobilePlanetaryScrubState,
  type PlanetKind,
} from './journeyLogic';

test('getMappedMaterialSwatches returns strictly the 24 mapped items without inventing unresolved records', () => {
  const mapped = getMappedMaterialSwatches(MATERIAL_SWATCHES);
  assert.equal(MATERIAL_SWATCHES.length, 27);
  assert.equal(mapped.length, 24);
  assert.ok(mapped.every((item) => item.mappingStatus === 'mapped' && Boolean(item.image)));
});

test('sceneUsesWebGL & shouldRenderWebGLHost disable WebGL across EXPLORE menu, archive pages, and 2D worlds', () => {
  assert.equal(sceneUsesWebGL('gateway'), true);
  assert.equal(sceneUsesWebGL('white-collage'), false);
  assert.equal(sceneUsesWebGL('editorial-nature'), false);
  assert.equal(sceneUsesWebGL('aurora-punk'), false);
  assert.equal(sceneUsesWebGL('ambient-archive'), false);
  assert.equal(sceneUsesWebGL('letoile-overview'), true);
  assert.equal(sceneUsesWebGL('mercury'), true);

  assert.equal(shouldRenderWebGLHost('gateway', false), true);
  assert.equal(shouldRenderWebGLHost('gateway', true), false);
  assert.equal(shouldRenderWebGLHost('letoile-overview', true), false);
  assert.equal(shouldRenderWebGLHost('ambient-archive', false), false);
});

test('gateway horizon transition connects seamlessly into centered L’Étoile overview and reverses cleanly', () => {
  const heroStart = computeHeroHorizonRevealMetrics(0, false);
  const heroMid = computeHeroHorizonRevealMetrics(0.45, false);
  const heroEnd = computeHeroHorizonRevealMetrics(1, false);

  assert.ok(heroStart.maskStartPercent >= 50);
  assert.equal(heroStart.maskOpacity, 1);
  assert.ok(heroMid.maskStartPercent < heroStart.maskStartPercent);
  assert.equal(heroEnd.maskOpacity, 0);

  const camAtHero = computeSolarSystemState('gateway', 0, false);
  const camAtEnd = computeSolarSystemState('gateway', 1, false);
  const overviewStart = computeSolarSystemState('letoile-overview', 0, false);

  assert.ok(camAtHero.lookAt[1] > overviewStart.lookAt[1]);
  assert.deepEqual(camAtEnd.cameraPosition, overviewStart.cameraPosition);
  assert.deepEqual(camAtEnd.lookAt, overviewStart.lookAt);
  assert.equal(camAtEnd.exteriorOpacity, overviewStart.exteriorOpacity);
});

test('4 planets stay visually distinct and never overlap at any point in their orbital animation', () => {
  const kinds: PlanetKind[] = ['mercury', 'uranus', 'pluto', 'mars'];
  const overview = computeSolarSystemState('letoile-overview', 0, false);

  for (let step = 0; step < 64; step++) {
    const t = step * 2.1;
    const positions = kinds.map((k) => computePlanetWorldPosition(k, t, null, false));
    const projected = kinds.map((k, idx) => {
      const p = positions[idx];
      const dz = overview.cameraPosition[2] - p[2];
      const radius = SOLAR_PLANET_SPECS[k].boundingRadius * SOLAR_PLANET_SPECS[k].baseScale;
      return {
        k,
        sx: p[0] / dz,
        sy: (p[1] - overview.cameraPosition[1]) / dz,
        sr: radius / dz,
      };
    });

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];
        const dist = Math.hypot(a.sx - b.sx, a.sy - b.sy);
        assert.ok(
          dist > a.sr + b.sr,
          `Planets ${a.k} and ${b.k} overlapped at t=${t.toFixed(1)} (dist=${dist.toFixed(4)}, sumR=${(a.sr + b.sr).toFixed(4)})`
        );
      }
    }
  }
});

test('computeSolarSystemState & computePlanetJourneyState execute controlled ~2.6s planetary portal flight and reverse cleanly', () => {
  const overview = computeSolarSystemState('letoile-overview', 0, false);
  assert.equal(overview.focusPlanet, null);
  assert.equal(overview.exteriorOpacity, 1);
  assert.equal(overview.interiorWorldOpacity, 0);

  const selection = computePlanetJourneyState(0.2, 2.6);
  const approach = computePlanetJourneyState(1.0, 2.6);
  const entry = computePlanetJourneyState(1.75, 2.6);
  const arrival = computePlanetJourneyState(2.6, 2.6);

  assert.equal(selection.phase, 'selection');
  assert.equal(approach.phase, 'approach');
  assert.equal(entry.phase, 'entry');
  assert.equal(arrival.phase, 'arrival');
  assert.equal(arrival.isComplete, true);

  const approachingCam = computeSolarSystemState('mars', approach.portalProgress, false);
  assert.equal(approachingCam.focusPlanet, 'mars');
  assert.ok(approachingCam.portalApproach > 0.35);
  assert.ok(approachingCam.planetScales.mars > overview.planetScales.mars);

  const portalCross = computeSolarSystemState('mars', entry.portalProgress, false);
  assert.ok(portalCross.portalVeilOpacity > 0.15);
  assert.ok(portalCross.interiorWorldOpacity > 0);

  const insideMarsWorld = computeSolarSystemState('mars', arrival.portalProgress, false);
  assert.equal(insideMarsWorld.exteriorOpacity, 0);
  assert.equal(insideMarsWorld.interiorWorldOpacity, 1);

  const reversed = computeSolarSystemState('letoile-overview', 0, false);
  assert.deepEqual(reversed, overview);
});

test('computeIntroTimelineMetrics runs clean 3-stage editorial load -> star glow -> seamless Hero handoff', () => {
  const stage1 = computeIntroTimelineMetrics(0.7, false);
  assert.equal(stage1.phase, 'writing');
  assert.ok(stage1.revealedCount >= 2 && stage1.revealedCount < 5);
  assert.equal(stage1.starGlow, 0);
  assert.equal(stage1.loaderOpacity, 1);

  const stage2 = computeIntroTimelineMetrics(2.05, false);
  assert.equal(stage2.phase, 'star-glow');
  assert.equal(stage2.revealedCount, 5);
  assert.ok(stage2.starGlow > 0.7);
  assert.equal(stage2.starSettleT, 1);

  const stage3 = computeIntroTimelineMetrics(3.0, false);
  assert.equal(stage3.phase, 'hero-handoff');
  assert.ok(stage3.loaderOpacity > 0 && stage3.loaderOpacity < 1);
  assert.ok(stage3.heroWordmarkOpacity > 0 && stage3.heroWordmarkOpacity < 1);

  const stage4 = computeIntroTimelineMetrics(3.7, false);
  assert.equal(stage4.phase, 'settled');
  assert.equal(stage4.loaderOpacity, 0);
  assert.equal(stage4.heroWordmarkOpacity, 1);
  assert.equal(stage4.isComplete, true);
});

test('computeHeroGatewayMetrics & computeHeroStarDetachState detach Hero star downward and reverse smoothly', () => {
  const docked = computeHeroStarDetachState(0, false);
  assert.equal(docked.isDockedInHero, true);
  assert.equal(docked.lettersOpacity, 1);
  assert.equal(docked.arcOffsetY, 0);

  const midDetach = computeHeroStarDetachState(0.45, false);
  assert.equal(midDetach.isDockedInHero, false);
  assert.ok(midDetach.lettersOpacity < 0.7);
  assert.ok(midDetach.arcOffsetY > 15);

  const fullyDetached = computeHeroStarDetachState(1, false);
  assert.equal(fullyDetached.lettersOpacity, 0);
  assert.equal(fullyDetached.subtitleOpacity, 0);

  const start = computeHeroGatewayMetrics(0, false);
  const end = computeHeroGatewayMetrics(0.95, false);
  assert.equal(start.wordmarkOpacity, 1);
  assert.equal(end.wordmarkOpacity, 0);

  const reduced = computeHeroStarDetachState(0.8, true);
  assert.equal(reduced.isDockedInHero, true);
  assert.equal(reduced.lettersOpacity, 1);
});

test('computeChapterStageMetrics keeps chapter entry & portal clean with zero dark dim and recedes for foreground photos', () => {
  const entry = computeChapterStageMetrics(0.18, false);
  const portalEnd = computeChapterStageMetrics(0.50, false);
  const foreground = computeChapterStageMetrics(0.80, false);
  const settled = computeChapterStageMetrics(0.95, false);

  assert.equal(entry.chapterPhase, 'entering');
  assert.equal(entry.backdropDim, 0);
  assert.equal(portalEnd.backdropDim, 0);
  assert.ok(portalEnd.titleOpacity > 0.9);
  assert.ok(entry.sceneOpacity > foreground.sceneOpacity);
  assert.ok(foreground.sceneOpacity < 0.5);
  assert.ok(settled.sceneOpacity >= 0.16);

  const reversedEntry = computeChapterStageMetrics(0.18, false);
  assert.deepEqual(reversedEntry, entry);
});

test('computeMaterialSampleState and computePuzzleTileMaskState synchronize piece-by-piece About reveal', () => {
  const startStates = Array.from({ length: 24 }, (_, idx) =>
    computeMaterialSampleState(idx, 24, 0, false)
  );
  assert.ok(startStates.every((s) => s.opacity === 1 && s.isInteractive));

  const startTiles = Array.from({ length: 24 }, (_, idx) =>
    computePuzzleTileMaskState(idx, 24, 0, false)
  );
  assert.ok(startTiles.every((t) => t.veilOpacity === 1 && t.revealProgress === 0));

  const midSamples = Array.from({ length: 24 }, (_, idx) =>
    computeMaterialSampleState(idx, 24, 0.5, false)
  );
  const midTiles = Array.from({ length: 24 }, (_, idx) =>
    computePuzzleTileMaskState(idx, 24, 0.5, false)
  );
  const openCount = midTiles.filter((t) => t.revealProgress > 0.7).length;
  const closedCount = midTiles.filter((t) => t.revealProgress < 0.15).length;
  assert.ok(openCount > 0 && openCount < 24);
  assert.ok(closedCount > 0 && closedCount < 24);
  assert.ok(midSamples[0].opacity === 0 && midTiles[0].revealProgress === 1);

  const endTiles = Array.from({ length: 24 }, (_, idx) =>
    computePuzzleTileMaskState(idx, 24, 0.96, false)
  );
  assert.ok(endTiles.every((t) => t.veilOpacity === 0 && t.revealProgress === 1));

  const reducedTile = computePuzzleTileMaskState(0, 24, 0.5, true);
  assert.equal(reducedTile.veilOpacity, 0);
  assert.equal(reducedTile.revealProgress, 1);
});

test('computeAboutRevealState supports puzzle curtain presence and immediateReveal', () => {
  const mid = computeAboutRevealState(0.45, false, false);
  assert.equal(mid.headingOpacity, 1);
  assert.equal(mid.illustrationOpacity, 1);
  assert.equal(mid.isRevealed, false);

  const late = computeAboutRevealState(0.95, false, false);
  assert.equal(late.headingOpacity, 1);
  assert.equal(late.textOpacity, 1);
  assert.equal(late.isRevealed, true);

  const immediate = computeAboutRevealState(0, false, true);
  assert.equal(immediate.headingOpacity, 1);
  assert.equal(immediate.textOpacity, 1);
  assert.equal(immediate.isRevealed, true);
});

test('computeStarCompanionState and computeContactStarMorph transform cleanly without duplicate stars', () => {
  const slow = computeStarCompanionState(0.45, false, false, 0, 1);
  const fast = computeStarCompanionState(0.45, false, false, 1200, 1);
  assert.ok(fast.scale > slow.scale);
  assert.ok(fast.trailSpreadPx > slow.trailSpreadPx);
  assert.equal(slow.settledInFooter, false);

  const docked = computeStarCompanionState(1, true, false, 400, 1);
  assert.equal(docked.xPercent, 50);
  assert.equal(docked.yPercent, 50);
  assert.equal(docked.rotationDeg, 0);
  assert.equal(docked.settledInFooter, true);

  const approaching = computeContactStarMorph(true, 140, 280, 44, 24);
  assert.ok(approaching.morphT > 0 && approaching.morphT < 1);
  assert.ok(approaching.targetScaleMultiplier > 1);
  assert.equal(approaching.dockEmblemVisible, false);
  assert.equal(approaching.companionVisible, true);

  const landed = computeContactStarMorph(true, 0.8, 280, 44, 24);
  assert.equal(landed.dockEmblemVisible, true);
  assert.equal(landed.companionVisible, false);
  assert.equal(landed.inkMix, 1);
});

test('classifyDeviceTier and resolvePlanetaryRenderMode keep phones 2D, preserve desktop 3D, and gate tablets by capability', () => {
  assert.equal(classifyDeviceTier(390, true, 5), 'phone');
  assert.equal(classifyDeviceTier(767, false, 0), 'phone');
  assert.equal(classifyDeviceTier(768, true, 5), 'tablet');
  assert.equal(classifyDeviceTier(1023, false, 0), 'tablet');
  assert.equal(classifyDeviceTier(1024, true, 5), 'tablet');
  assert.equal(classifyDeviceTier(1024, false, 0), 'desktop');
  assert.equal(classifyDeviceTier(1440, false, 0), 'desktop');

  // Phones always resolve to 2D even on fast hardware
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'phone',
      webglSupported: true,
      isSoftwareGl: false,
      reducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      quickBenchmarkMs: 0.5,
    }),
    '2d'
  );

  // Desktop preserves 3D whenever WebGL is supported
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'desktop',
      webglSupported: true,
      isSoftwareGl: true,
      reducedMotion: false,
    }),
    '3d'
  );

  // Tablet uses 3D only when hardware GPU + resources + benchmark are smooth
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'tablet',
      webglSupported: true,
      isSoftwareGl: false,
      reducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      quickBenchmarkMs: 1.8,
    }),
    '3d'
  );

  // Tablet falls back cleanly to 2D on software GL, constrained hardware, or slow probe
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'tablet',
      webglSupported: true,
      isSoftwareGl: true,
      reducedMotion: false,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      quickBenchmarkMs: 1.5,
    }),
    '2d'
  );
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'tablet',
      webglSupported: true,
      isSoftwareGl: false,
      reducedMotion: false,
      hardwareConcurrency: 2,
      deviceMemory: 8,
      quickBenchmarkMs: 1.5,
    }),
    '2d'
  );
  assert.equal(
    resolvePlanetaryRenderMode({
      deviceTier: 'tablet',
      webglSupported: true,
      isSoftwareGl: false,
      reducedMotion: false,
      hardwareConcurrency: 6,
      deviceMemory: 4,
      quickBenchmarkMs: 24,
    }),
    '2d'
  );
});

test('computePlanetary2DTransitionState smoothly orchestrates gateway -> overview -> focus -> portal -> world and reverses cleanly', () => {
  assert.equal(isPlanetaryScene('gateway'), true);
  assert.equal(isPlanetaryScene('letoile-overview'), true);
  assert.equal(isPlanetaryScene('mercury'), true);
  assert.equal(isPlanetaryScene('white-collage'), false);
  assert.equal(isPlanetaryScene('aurora-punk'), false);

  const gwStart = computePlanetary2DTransitionState('gateway', 0, false);
  const gwEnd = computePlanetary2DTransitionState('gateway', 1, false);
  const overview = computePlanetary2DTransitionState('letoile-overview', 0, false);
  assert.ok(gwStart.overviewLiftYPercent > 20);
  assert.equal(gwEnd.overviewLiftYPercent, overview.overviewLiftYPercent);
  assert.equal(gwEnd.overviewScale, overview.overviewScale);

  const focus = computePlanetary2DTransitionState('uranus', 0.10, false);
  assert.equal(focus.focusPlanet, 'uranus');
  assert.ok(focus.planetFocusScale.uranus > 1.2);
  assert.ok(focus.planetFadeOpacity.mars < 0.6);

  const portalCrossing = computePlanetary2DTransitionState('uranus', 0.20, false);
  assert.ok(portalCrossing.portalVeilOpacity > 0.5);
  assert.ok(portalCrossing.portalIrisRadiusPercent > 15 && portalCrossing.portalIrisRadiusPercent < 140);
  assert.ok(portalCrossing.interiorWorldOpacity > 0);

  const worldArrived = computePlanetary2DTransitionState('uranus', 0.65, false);
  assert.equal(worldArrived.exteriorOpacity, 0);
  assert.equal(worldArrived.interiorWorldOpacity, 1);
  assert.equal(worldArrived.portalIrisRadiusPercent, 145);
  assert.ok(worldArrived.worldParallaxProgress > 0.4);

  // Reversing upward back to overview produces identical baseline state
  const reversed = computePlanetary2DTransitionState('letoile-overview', 0, false);
  assert.deepEqual(reversed, overview);

  const reduced = computePlanetary2DTransitionState('mars', 0.1, true);
  assert.equal(reduced.interiorWorldOpacity, 1);
  assert.equal(reduced.portalVeilOpacity, 0);
});

test('stepMobilePlanetaryScrubState prevents fast-swipe skipping, preserves slow attachment, and reverses immediately', () => {
  // 1) Fast downward swipe from 0 -> 0.45: must NOT jump straight to 0.45 in a few frames
  let state: MobilePlanetaryScrubState = { sceneId: 'uranus', progress: 0 };
  for (let i = 0; i < 6; i++) {
    state = stepMobilePlanetaryScrubState(state, 'uranus', 0.45, 0.016, false, false);
  }
  // After ~96ms, still passing through early focus/portal stages cleanly
  assert.ok(state.progress > 0.02 && state.progress < 0.12);

  // Continues sweeping cleanly through portal -> arrives at 0.45 after sustained frames
  for (let i = 0; i < 90; i++) {
    state = stepMobilePlanetaryScrubState(state, 'uranus', 0.45, 0.016, false, false);
  }
  assert.ok(Math.abs(state.progress - 0.45) < 0.01);

  // 2) Fast downward cross-chapter jump from overview -> mars at target 0.36 seeds from 0 so portal unfolds
  const entered = stepMobilePlanetaryScrubState(
    { sceneId: 'letoile-overview', progress: 0.9 },
    'mars',
    0.36,
    0.016,
    false,
    false
  );
  assert.equal(entered.sceneId, 'mars');
  assert.ok(entered.progress > 0 && entered.progress < 0.03);

  // 3) Immediate direction reversal on the very next frame
  const mid: MobilePlanetaryScrubState = { sceneId: 'mercury', progress: 0.28 };
  const reversed = stepMobilePlanetaryScrubState(mid, 'mercury', 0.05, 0.016, false, false);
  assert.ok(reversed.progress < mid.progress);

  // 4) Direct I-IV click flight & reducedMotion bypass damping
  const direct = stepMobilePlanetaryScrubState(mid, 'pluto', 0.42, 0.016, false, true);
  assert.equal(direct.sceneId, 'pluto');
  assert.equal(direct.progress, 0.42);
  const reduced = stepMobilePlanetaryScrubState(mid, 'mars', 0.55, 0.016, true, false);
  assert.equal(reduced.sceneId, 'mars');
  assert.equal(reduced.progress, 0.55);
});

test('evaluateWebGLFramePacing requires sustained slow pacing before scaling down and ignores transient spikes or software GL', () => {
  const slowWindow = Array.from({ length: 30 }, () => 42);
  const healthyWindow = Array.from({ length: 45 }, () => 16.7);
  const severeWindow = Array.from({ length: 30 }, () => 68);

  // Single transient slow window does not drop from 'full'
  const singleSpike = evaluateWebGLFramePacing({
    currentTier: 'full',
    sampleFrameMs: slowWindow,
    consecutiveSlowWindows: 0,
    isSoftwareGl: false,
  });
  assert.equal(singleSpike.nextTier, 'full');
  assert.equal(singleSpike.nextConsecutiveSlowWindows, 1);
  assert.equal(singleSpike.changed, false);

  // Healthy window resets counter
  const recovered = evaluateWebGLFramePacing({
    currentTier: 'full',
    sampleFrameMs: healthyWindow,
    consecutiveSlowWindows: 1,
    isSoftwareGl: false,
  });
  assert.equal(recovered.nextTier, 'full');
  assert.equal(recovered.nextConsecutiveSlowWindows, 0);
  assert.equal(recovered.changed, false);

  // Two consecutive slow windows drop 'full' -> 'conservative'
  const sustainedDrop = evaluateWebGLFramePacing({
    currentTier: 'full',
    sampleFrameMs: slowWindow,
    consecutiveSlowWindows: 1,
    isSoftwareGl: false,
  });
  assert.equal(sustainedDrop.nextTier, 'conservative');
  assert.equal(sustainedDrop.nextConsecutiveSlowWindows, 0);
  assert.equal(sustainedDrop.changed, true);

  // Three consecutive severe windows in 'conservative' trigger 'fallback-2d'
  const fallback = evaluateWebGLFramePacing({
    currentTier: 'conservative',
    sampleFrameMs: severeWindow,
    consecutiveSlowWindows: 2,
    isSoftwareGl: false,
  });
  assert.equal(fallback.nextTier, 'fallback-2d');
  assert.equal(fallback.changed, true);

  // Software GL (headless emulation / SwiftShader) never auto-escalates away from desktop WebGL coverage
  const softwareBypass = evaluateWebGLFramePacing({
    currentTier: 'full',
    sampleFrameMs: severeWindow,
    consecutiveSlowWindows: 5,
    isSoftwareGl: true,
  });
  assert.equal(softwareBypass.nextTier, 'full');
  assert.equal(softwareBypass.changed, false);
});




