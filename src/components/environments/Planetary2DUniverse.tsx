import { useEffect, useMemo, useRef, useState } from 'react';
import {
  computePlanetary2DTransitionState,
  PROJECT_ENVIRONMENTS,
  stepMobilePlanetaryScrubState,
  type DeviceTier,
  type EnvironmentSceneId,
  type MobilePlanetaryScrubState,
  type PlanetKind,
} from '../../utils/journeyLogic';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import { Planetary2DWorlds } from './Planetary2DWorlds';

interface Planetary2DUniverseProps {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  active: boolean;
  deviceTier?: DeviceTier;
}

interface Planet2DSlotSpec {
  id: PlanetKind;
  restXPercent: number;
  restYPercent: number;
  sizeClamp: string;
  veilTint: string;
}

const PLANET_SLOTS: Planet2DSlotSpec[] = [
  {
    id: 'mercury',
    restXPercent: 25,
    restYPercent: 31,
    sizeClamp: 'clamp(74px, 21vw, 134px)',
    veilTint: 'radial-gradient(circle, rgba(229,184,139,0.52) 0%, rgba(144,133,132,0.28) 48%, rgba(8,6,6,0) 78%)',
  },
  {
    id: 'uranus',
    restXPercent: 75,
    restYPercent: 32,
    sizeClamp: 'clamp(82px, 23vw, 146px)',
    veilTint: 'radial-gradient(circle, rgba(174,213,210,0.55) 0%, rgba(19,104,150,0.28) 50%, rgba(3,9,12,0) 78%)',
  },
  {
    id: 'pluto',
    restXPercent: 27,
    restYPercent: 67,
    sizeClamp: 'clamp(68px, 19vw, 122px)',
    veilTint: 'radial-gradient(circle, rgba(182,196,210,0.48) 0%, rgba(69,70,68,0.28) 50%, rgba(4,5,7,0) 78%)',
  },
  {
    id: 'mars',
    restXPercent: 74,
    restYPercent: 66,
    sizeClamp: 'clamp(82px, 23vw, 144px)',
    veilTint: 'radial-gradient(circle, rgba(232,127,62,0.56) 0%, rgba(107,17,17,0.32) 50%, rgba(8,3,2,0) 78%)',
  },
];

function Planet2DArtwork({ id }: { id: PlanetKind }) {
  if (id === 'mercury') {
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="p2d-orb-mercury" cx="34%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#D6C8C0" />
            <stop offset="42%" stopColor="#908584" />
            <stop offset="76%" stopColor="#463E3D" />
            <stop offset="100%" stopColor="#141111" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="68" fill="#E5B88B" opacity="0.12" />
        <circle cx="80" cy="80" r="56" fill="url(#p2d-orb-mercury)" stroke="#C89E78" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="58" cy="64" r="9" fill="#3B3535" opacity="0.55" />
        <circle cx="96" cy="96" r="12" fill="#2A2424" opacity="0.6" />
        <circle cx="102" cy="58" r="5.5" fill="#C4B6AE" opacity="0.45" />
        <polygon points="16,42 26,34 29,48" fill="#B8AFAF" opacity="0.65" />
        <polygon points="134,116 146,108 140,124" fill="#D98A4E" opacity="0.55" />
      </svg>
    );
  }

  if (id === 'uranus') {
    return (
      <svg viewBox="0 0 180 180" className="w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="p2d-orb-uranus" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#E1F7F5" />
            <stop offset="44%" stopColor="#95BFBC" />
            <stop offset="80%" stopColor="#266478" />
            <stop offset="100%" stopColor="#091C24" />
          </radialGradient>
        </defs>
        <circle cx="90" cy="90" r="72" fill="#95BFBC" opacity="0.14" />
        <g transform="rotate(-24 90 90)">
          <ellipse cx="90" cy="90" rx="86" ry="20" fill="none" stroke="#AED5D2" strokeOpacity="0.48" strokeWidth="2.2" />
          <ellipse cx="90" cy="90" rx="74" ry="15" fill="none" stroke="#DDF7F5" strokeOpacity="0.3" strokeWidth="1" />
        </g>
        <circle cx="90" cy="90" r="48" fill="url(#p2d-orb-uranus)" stroke="#AED5D2" strokeOpacity="0.45" strokeWidth="1" />
        <path d="M46,82 Q90,72 134,82" fill="none" stroke="#E8FCFB" strokeOpacity="0.24" strokeWidth="4" />
        <path d="M50,100 Q90,92 130,100" fill="none" stroke="#136896" strokeOpacity="0.28" strokeWidth="3.5" />
      </svg>
    );
  }

  if (id === 'pluto') {
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="p2d-orb-pluto" cx="34%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#B8C4D0" />
            <stop offset="38%" stopColor="#72777C" />
            <stop offset="76%" stopColor="#353739" />
            <stop offset="100%" stopColor="#121417" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="64" fill="#8E9296" opacity="0.1" />
        <circle cx="80" cy="80" r="52" fill="url(#p2d-orb-pluto)" stroke="#B6C4D2" strokeOpacity="0.34" strokeWidth="1" />
        <path d="M64,74 C72,64 88,66 94,76 C98,84 86,96 76,94 C66,92 58,82 64,74 Z" fill="#C9D6E2" opacity="0.28" />
        {/* Charon twin-moonlet */}
        <circle cx="136" cy="40" r="9.5" fill="#9AA4AE" stroke="#D2DCE6" strokeOpacity="0.45" strokeWidth="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="p2d-orb-mars" cx="34%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#F5A66E" />
          <stop offset="42%" stopColor="#E87F3E" />
          <stop offset="78%" stopColor="#7B1D12" />
          <stop offset="100%" stopColor="#260704" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="#E87F3E" opacity="0.16" />
      <circle cx="80" cy="80" r="56" fill="url(#p2d-orb-mars)" stroke="#E87F3E" strokeOpacity="0.52" strokeWidth="1.2" />
      <path d="M40,74 Q74,64 114,82" fill="none" stroke="#FF8338" strokeOpacity="0.48" strokeWidth="2.2" />
      <path d="M52,98 L78,92 L104,104" fill="none" stroke="#3E0B06" strokeOpacity="0.72" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="128" cy="48" r="2.2" fill="#F5A66E" opacity="0.7" />
      <circle cx="32" cy="112" r="1.8" fill="#C68D68" opacity="0.6" />
    </svg>
  );
}

/**
 * Unified Pure-2D Planetary Experience Stage (zero Three.js / WebGL).
 * Drives the entire scroll-linked planetary journey on phones & fallback tablets:
 * - Gateway Hero horizon rise -> 4-planet L'Étoile overview
 * - Chosen planet focus & expansion -> expanding geometric silhouette / iris portal
 * - Atmospheric portal veil -> full 2D animated planetary world -> clean photo priority
 */
export function Planetary2DUniverse({
  sceneId,
  scrollProgressRef,
  active,
  deviceTier = 'phone',
}: Planetary2DUniverseProps) {
  const reducedMotion = useReducedMotion();
  const { planetJourneyRef } = useExhibitionStage();
  const rootRef = useRef<HTMLDivElement>(null);
  const exteriorLayerRef = useRef<HTMLDivElement>(null);
  const portalRingRef = useRef<HTMLDivElement>(null);
  const interiorClipRef = useRef<HTMLDivElement>(null);
  const portalVeilRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<Record<PlanetKind, HTMLDivElement | null>>({
    mercury: null,
    uranus: null,
    pluto: null,
    mars: null,
  });
  const parallaxRef = useRef(0);
  const targetSceneRef = useRef<EnvironmentSceneId>(sceneId);
  targetSceneRef.current = sceneId;

  const scrubStateRef = useRef<MobilePlanetaryScrubState>({
    sceneId,
    progress: scrollProgressRef.current,
  });
  const [renderedSceneId, setRenderedSceneId] = useState<EnvironmentSceneId>(sceneId);

  const activeChapterPlanet: PlanetKind | null =
    renderedSceneId === 'mercury' ||
    renderedSceneId === 'uranus' ||
    renderedSceneId === 'pluto' ||
    renderedSceneId === 'mars'
      ? renderedSceneId
      : null;

  const starPins = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        x: ((i * 61 + 17) % 94) + 3,
        y: ((i * 37 + 11) % 92) + 4,
        r: i % 5 === 0 ? 1.5 : 0.9,
        opacity: 0.2 + (i % 4) * 0.14,
      })),
    []
  );

  // Continuous single-rAF smooth scrubbing loop (phone uses frame-delta damping; tablet keeps native tracking)
  // Using (reducedMotion ? sceneId : null) updates static reduced-motion frames cleanly without restarting the active rAF loop.
  const reducedMotionSceneKey = reducedMotion ? sceneId : null;
  useEffect(() => {
    if (!active) return;
    let rafId = 0;
    let lastTime = performance.now();

    const applyFrame = () => {
      const now = performance.now();
      const dtSec = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
      lastTime = now;

      const targetScene = targetSceneRef.current;
      const targetProgress = scrollProgressRef.current;
      const isDirectFlight = planetJourneyRef.current.active;

      const nextScrub =
        deviceTier === 'phone'
          ? stepMobilePlanetaryScrubState(
              scrubStateRef.current,
              targetScene,
              targetProgress,
              dtSec,
              reducedMotion,
              isDirectFlight
            )
          : { sceneId: targetScene, progress: targetProgress };

      scrubStateRef.current = nextScrub;

      setRenderedSceneId((prev) => (prev === nextScrub.sceneId ? prev : nextScrub.sceneId));

      const st = computePlanetary2DTransitionState(
        nextScrub.sceneId,
        nextScrub.progress,
        reducedMotion
      );
      parallaxRef.current = st.worldParallaxProgress;

      if (rootRef.current) {
        rootRef.current.style.setProperty('--p2d-parallax', String(st.worldParallaxProgress));
        rootRef.current.setAttribute('data-scrub-scene', nextScrub.sceneId);
        rootRef.current.setAttribute('data-scrub-progress', String(nextScrub.progress));
        rootRef.current.setAttribute('data-portal-iris', String(Math.round(st.portalIrisRadiusPercent)));
        rootRef.current.setAttribute('data-interior-opacity', String(st.interiorWorldOpacity));
      }

      if (exteriorLayerRef.current) {
        exteriorLayerRef.current.style.opacity = String(st.exteriorOpacity);
        exteriorLayerRef.current.style.transform = `translate3d(0, ${st.overviewLiftYPercent}%, 0) scale(${st.overviewScale})`;
      }

      for (let i = 0; i < PLANET_SLOTS.length; i++) {
        const slot = PLANET_SLOTS[i];
        const el = planetRefs.current[slot.id];
        if (!el) continue;

        const isFocused = st.focusPlanet === slot.id;
        const shiftT = isFocused ? st.planetShiftToCenter : 0;
        const x = slot.restXPercent + (50 - slot.restXPercent) * shiftT;
        const y = slot.restYPercent + (48 - slot.restYPercent) * shiftT;
        const scale = isFocused
          ? st.planetFocusScale[slot.id] * (1 + (st.portalExpandScale - 1) * 0.28)
          : st.planetFocusScale[slot.id];

        el.style.left = `${x.toFixed(2)}%`;
        el.style.top = `${y.toFixed(2)}%`;
        el.style.opacity = String(st.planetFadeOpacity[slot.id]);
        el.style.transform = `translate3d(-50%, -50%, 0) scale(${scale.toFixed(3)})`;
      }

      if (portalRingRef.current) {
        const ringVisible = Boolean(st.focusPlanet) && st.portalExpandScale > 1.02 && st.exteriorOpacity > 0.02;
        portalRingRef.current.style.opacity = ringVisible
          ? String(Number((st.exteriorOpacity * 0.65).toFixed(3)))
          : '0';
        portalRingRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${st.portalExpandScale.toFixed(
          3
        )})`;
      }

      if (interiorClipRef.current) {
        interiorClipRef.current.style.opacity = String(st.interiorWorldOpacity);
        interiorClipRef.current.style.clipPath = st.focusPlanet
          ? `circle(${st.portalIrisRadiusPercent.toFixed(1)}% at 50% 48%)`
          : 'circle(0% at 50% 48%)';
      }

      if (portalVeilRef.current) {
        portalVeilRef.current.style.opacity = String(st.portalVeilOpacity);
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(applyFrame);
      }
    };

    applyFrame();
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [active, deviceTier, scrollProgressRef, planetJourneyRef, reducedMotion, reducedMotionSceneKey]);

  const activeSpec = PLANET_SLOTS.find((s) => s.id === activeChapterPlanet);
  const accentHex = PROJECT_ENVIRONMENTS[renderedSceneId]?.accentHex || '#F5F3EF';

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid="planetary-2d-universe"
      data-planetary-scene={renderedSceneId}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-black"
    >
      {/* Distant Cosmic Starfield & Subtle Orbital Constellation */}
      <svg
        className="absolute inset-0 w-full h-full opacity-75"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {starPins.map((star, idx) => (
          <circle
            key={idx}
            cx={star.x}
            cy={star.y}
            r={star.r * 0.16}
            fill="#F5F3EF"
            opacity={star.opacity}
          />
        ))}
      </svg>

      {/* Layer A: 4-Planet Orbital System + Focus & Silhouette Expansion */}
      <div ref={exteriorLayerRef} className="absolute inset-0 will-change-transform">
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          viewBox="0 0 400 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="200" cy="340" rx="164" ry="225" fill="none" stroke="#F5F3EF" strokeWidth="0.6" strokeDasharray="3 9" />
          <ellipse cx="200" cy="340" rx="112" ry="152" fill="none" stroke={accentHex} strokeOpacity="0.45" strokeWidth="0.6" />
        </svg>

        {PLANET_SLOTS.map((slot) => (
          <div
            key={slot.id}
            ref={(el) => {
              planetRefs.current[slot.id] = el;
            }}
            data-planet-2d-orb={slot.id}
            className="absolute will-change-transform"
            style={{
              left: `${slot.restXPercent}%`,
              top: `${slot.restYPercent}%`,
              width: slot.sizeClamp,
              height: slot.sizeClamp,
              transform: 'translate3d(-50%, -50%, 0)',
            }}
          >
            <Planet2DArtwork id={slot.id} />
          </div>
        ))}

        {/* Expanding Geometric Portal Ring around Focused Planet */}
        <div
          ref={portalRingRef}
          className="absolute left-1/2 top-[48%] w-36 h-36 rounded-full border will-change-transform"
          style={{
            opacity: 0,
            borderColor: accentHex,
            boxShadow: `0 0 38px ${accentHex}44, inset 0 0 24px ${accentHex}28`,
          }}
        />
      </div>

      {/* Layer B: Expanding Iris Reveal of the Dedicated 2D Planetary World */}
      <div
        ref={interiorClipRef}
        className="absolute inset-0 will-change-[clip-path,opacity]"
        style={{ opacity: 0, clipPath: 'circle(0% at 50% 48%)' }}
      >
        {activeChapterPlanet && (
          <Planetary2DWorlds
            activePlanet={activeChapterPlanet}
            reducedMotion={reducedMotion}
            parallaxRef={parallaxRef}
          />
        )}
      </div>

      {/* Layer C: Atmospheric Portal Crossing Bloom Veil */}
      <div
        ref={portalVeilRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            activeSpec?.veilTint ||
            'radial-gradient(circle, rgba(245,243,239,0.28) 0%, rgba(0,0,0,0) 75%)',
        }}
      />
    </div>
  );
}
