import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  classifyDeviceTier,
  isPlanetaryScene,
  PROJECT_ENVIRONMENTS,
  resolvePlanetaryRenderMode,
  sceneUsesWebGL,
  shouldRenderWebGLHost,
  type DeviceTier,
  type EnvironmentSceneId,
  type PlanetaryRenderMode,
  type WebGLQualityTier,
} from '../../utils/journeyLogic';
import { useIsCompactViewport, useReducedMotion } from '../../hooks/useReducedMotion';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import { probeWebGLCapabilities, readBrowserDeviceInputs } from './webglProbe';
import { Planetary2DUniverse } from '../environments/Planetary2DUniverse';

const LazyWebGLCanvasStage = lazy(() => import('./WebGLCanvasStage'));

function WebGLFallbackBackdrop({ sceneId }: { sceneId: EnvironmentSceneId }) {
  const cfg = PROJECT_ENVIRONMENTS[sceneId];
  return (
    <div
      className="absolute inset-0"
      style={{ background: cfg.backdropGradient }}
      aria-hidden="true"
    />
  );
}

/**
 * Single Root Persistent Stage Host:
 * - Phones & constrained/fallback tablets strictly load ONLY 2D modules (zero Three.js bundle download/parse).
 * - Desktop & capable tablets asynchronously hydrate the shared Three.js WebGL stage on mount/idle,
 *   suspending rendering completely ('never' frameloop) when hidden, in EXPLORE, or during pure-2D chapters.
 * - Subscribes directly to opacity & backdrop dim changes so 60fps scrolling triggers zero React re-renders.
 */
export function ProjectEnvironmentHost() {
  const {
    sceneId,
    menuOpen,
    scrollProgressRef,
    sceneOpacityRef,
    backdropDimRef,
    subscribeStageVisuals,
  } = useExhibitionStage();
  const reducedMotion = useReducedMotion();
  const isCompact = useIsCompactViewport();

  const hostRef = useRef<HTMLDivElement>(null);
  const dimLayerRef = useRef<HTMLDivElement>(null);

  // Lock tier render-mode once per tier so L'Étoile Maho never flickers mid-scroll
  const lockedTierModeRef = useRef<Partial<Record<DeviceTier, PlanetaryRenderMode>>>({});

  const evaluateTierAndMode = () => {
    const inputs = readBrowserDeviceInputs();
    const tier = classifyDeviceTier(
      inputs.viewportWidth,
      inputs.isCoarsePointer,
      inputs.maxTouchPoints
    );
    const cachedMode = lockedTierModeRef.current[tier];
    if (cachedMode) {
      return {
        tier,
        mode: cachedMode,
        caps:
          tier === 'phone'
            ? { supported: false, isSoftwareGl: false, rendererName: 'mobile-2d', quickBenchmarkMs: 0 }
            : probeWebGLCapabilities(),
      };
    }
    const caps =
      tier === 'phone'
        ? { supported: false, isSoftwareGl: false, rendererName: 'mobile-2d', quickBenchmarkMs: 0 }
        : probeWebGLCapabilities();
    const mode = resolvePlanetaryRenderMode({
      deviceTier: tier,
      webglSupported: caps.supported,
      isSoftwareGl: caps.isSoftwareGl,
      reducedMotion,
      hardwareConcurrency: inputs.hardwareConcurrency,
      deviceMemory: inputs.deviceMemory,
      quickBenchmarkMs: caps.quickBenchmarkMs,
    });
    lockedTierModeRef.current[tier] = mode;
    return { tier, mode, caps };
  };

  const initialEvaluation = useMemo(() => evaluateTierAndMode(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [tierState, setTierState] = useState<{ tier: DeviceTier; mode: PlanetaryRenderMode }>({
    tier: initialEvaluation.tier,
    mode: initialEvaluation.mode,
  });
  const [capabilities, setCapabilities] = useState(initialEvaluation.caps);
  const [contextLost, setContextLost] = useState(false);
  const [qualityTier, setQualityTier] = useState<WebGLQualityTier>('full');
  const [documentHidden, setDocumentHidden] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  );

  useEffect(() => {
    const onResize = () => {
      const next = evaluateTierAndMode();
      setCapabilities(next.caps);
      setTierState((prev) =>
        prev.tier === next.tier && prev.mode === next.mode
          ? prev
          : { tier: next.tier, mode: next.mode }
      );
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  useEffect(() => {
    const onVisibility = () => {
      setDocumentHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const isWebGLWorld = sceneUsesWebGL(sceneId);
  const showHost = shouldRenderWebGLHost(sceneId, menuOpen);
  const isPlanetary = isPlanetaryScene(sceneId);
  const forced2DFallback = qualityTier === 'fallback-2d' || contextLost;
  const use2DPlanetary = (tierState.mode === '2d' || forced2DFallback) && isPlanetary;
  const canRenderWebGL =
    tierState.mode === '3d' && capabilities.supported && !forced2DFallback;
  const isSoftwareGl = capabilities.isSoftwareGl;
  const isLowPower = isCompact || isSoftwareGl;

  // Apply scroll-driven host opacity & dim layer directly to DOM nodes with zero React re-renders
  useEffect(() => {
    const applyVisuals = (op: number, dim: number) => {
      if (hostRef.current) {
        hostRef.current.style.opacity = showHost ? String(op) : '0';
      }
      if (dimLayerRef.current) {
        dimLayerRef.current.style.opacity = String(dim * 0.55);
      }
    };
    applyVisuals(sceneOpacityRef.current, backdropDimRef.current);
    return subscribeStageVisuals(applyVisuals);
  }, [showHost, sceneOpacityRef, backdropDimRef, subscribeStageVisuals]);

  const renderModeAttr = !showHost
    ? 'pure-2d'
    : use2DPlanetary
      ? '2d-planetary'
      : canRenderWebGL
        ? qualityTier === 'conservative'
          ? 'webgl-conservative'
          : 'webgl'
        : 'fallback';

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="three-environment-host"
      data-active-scene={sceneId}
      data-device-tier={tierState.tier}
      data-render-mode={renderModeAttr}
      data-quality-tier={qualityTier}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
      style={{
        opacity: showHost ? sceneOpacityRef.current : 0,
        visibility: showHost ? 'visible' : 'hidden',
      }}
    >
      {showHost && use2DPlanetary && (
        <Planetary2DUniverse
          sceneId={sceneId}
          scrollProgressRef={scrollProgressRef}
          active={showHost && !documentHidden}
          deviceTier={tierState.tier}
        />
      )}

      {showHost && !use2DPlanetary && !canRenderWebGL && (
        <WebGLFallbackBackdrop sceneId={sceneId} />
      )}

      {canRenderWebGL && (
        <>
          {showHost && <WebGLFallbackBackdrop sceneId={sceneId} />}
          <Suspense fallback={null}>
            <LazyWebGLCanvasStage
              sceneId={sceneId}
              scrollProgressRef={scrollProgressRef}
              reducedMotion={reducedMotion}
              isLowPower={isLowPower}
              isSoftwareGl={isSoftwareGl}
              showHost={showHost}
              isWebGLWorld={isWebGLWorld}
              menuOpen={menuOpen}
              documentHidden={documentHidden}
              qualityTier={qualityTier}
              onQualityChange={(next) => {
                setQualityTier(next);
                if (next === 'fallback-2d') {
                  lockedTierModeRef.current[tierState.tier] = '2d';
                }
              }}
              onContextLostChange={setContextLost}
            />
          </Suspense>
        </>
      )}

      {showHost && (
        <div
          ref={dimLayerRef}
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
          style={{ opacity: backdropDimRef.current * 0.55 }}
        />
      )}
    </div>
  );
}
