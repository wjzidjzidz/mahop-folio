import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandLogo } from '../components/BrandLogo';
import { LetoileSection } from '../components/sections/LetoileSection';
import { MahStarPSection } from '../components/sections/MahStarPSection';
import { AuroraSection } from '../components/sections/AuroraSection';
import { MaterialTableSection } from '../components/sections/MaterialTableSection';
import { useExhibitionStage } from '../context/ExhibitionStageContext';
import {
  computeHeroHorizonRevealMetrics,
  computeHeroStarDetachState,
  PROJECT_ENVIRONMENTS,
} from '../utils/journeyLogic';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home Exhibition Page:
 * Flows seamlessly from the Pure Black Hero gateway (with the four-planet horizon emerging softly
 * at the bottom edge) into all four exhibition chapters:
 * 1. Opening Gateway -> Continuous shared WebGL transition into L'ETOILE MAHO
 * 2. L'ETOILE MAHO — Unified 4-planet cosmic overview zooming into Mercury, Uranus, Pluto, Mars
 * 3. MAH★P — Act I 2D Fluorescent-Green/Black/White Collage + Act II 2D Botanical Meadow
 * 4. AURORA DE LIAGE X AURO DA'PUNK — Pure 2D Underground Xerox/Crochet/Wheatpaste Punk Stage
 * 5. Material Table (24 Mapped Swatches) -> 24-Tile Masked Puzzle Reveal into About -> Stationary Contact MAH★P
 */
export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLElement>(null);
  const leftWordRef = useRef<HTMLSpanElement>(null);
  const rightWordRef = useRef<HTMLSpanElement>(null);
  const subtitleWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { setEnvironmentState, introActive, planetJourneyRef } = useExhibitionStage();

  // Debounced ScrollTrigger.refresh when fonts, lazy exhibition artwork, or layout dimensions settle
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    let timer: number | undefined;
    const scheduleRefresh = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      }, 60);
    };

    const handleCaptureLoad = (event: Event) => {
      if ((event.target as HTMLElement | null)?.tagName === 'IMG') {
        scheduleRefresh();
      }
    };

    root.addEventListener('load', handleCaptureLoad, true);
    window.addEventListener('load', scheduleRefresh, { once: true });

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        scheduleRefresh();
      });
      resizeObserver.observe(root);
    }

    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleRefresh();
      });
    }

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      root.removeEventListener('load', handleCaptureLoad, true);
      window.removeEventListener('load', scheduleRefresh);
      resizeObserver?.disconnect();
    };
  }, []);

  // Synchronize Hero typography detach + bottom planetary horizon reveal 1:1 with scrollY
  useEffect(() => {
    const gatewayEl = gatewayRef.current;
    if (!gatewayEl) return;

    const initialHorizon = computeHeroHorizonRevealMetrics(0, reducedMotion);

    const applyGatewayVisuals = (rawGatewayProgress: number) => {
      const horizon = computeHeroHorizonRevealMetrics(rawGatewayProgress, reducedMotion);
      gatewayEl.style.setProperty('--hero-mask-start', `${horizon.maskStartPercent}%`);
      gatewayEl.style.setProperty('--hero-mask-feather', `${horizon.maskFeatherPercent}%`);
      gatewayEl.style.setProperty('--hero-mask-op', String(horizon.maskOpacity));
      gatewayEl.style.setProperty('--hero-cue-op', String(horizon.scrollCueOpacity));

      if (!planetJourneyRef.current.active) {
        setEnvironmentState('gateway', rawGatewayProgress, horizon.sceneOpacity, 0);
        window.dispatchEvent(
          new CustomEvent('mahop:scene-accent', {
            detail: PROJECT_ENVIRONMENTS.gateway.accentHex,
          })
        );
      }
    };

    const syncHeroTypography = () => {
      const heroHeight = gatewayEl.getBoundingClientRect().height || window.innerHeight;
      const detachThreshold = Math.min(window.innerHeight * 0.58, heroHeight * 0.58);
      const rawDetach = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(200, detachThreshold))
      );
      const st = computeHeroStarDetachState(rawDetach, reducedMotion);

      gatewayEl.style.setProperty('--hero-letters-op', String(st.lettersOpacity));
      gatewayEl.style.setProperty('--hero-letters-spread', `${st.letterSpreadPx}px`);
      gatewayEl.style.setProperty('--hero-sub-op', String(st.subtitleOpacity));

      // Continuous handoff span aligned exactly with #letoile-maho's 'top 28%' trigger
      const handoffDistance = Math.max(280, heroHeight - window.innerHeight * 0.28);
      const rawGatewayProgress = Math.min(
        1,
        Math.max(0, window.scrollY / handoffDistance)
      );
      const horizon = computeHeroHorizonRevealMetrics(rawGatewayProgress, reducedMotion);
      gatewayEl.style.setProperty('--hero-mask-start', `${horizon.maskStartPercent}%`);
      gatewayEl.style.setProperty('--hero-mask-feather', `${horizon.maskFeatherPercent}%`);
      gatewayEl.style.setProperty('--hero-mask-op', String(horizon.maskOpacity));
      gatewayEl.style.setProperty('--hero-cue-op', String(horizon.scrollCueOpacity));

      if (window.scrollY < handoffDistance - 2 && !planetJourneyRef.current.active) {
        setEnvironmentState('gateway', rawGatewayProgress, horizon.sceneOpacity, 0);
      }
    };

    applyGatewayVisuals(0);
    syncHeroTypography();
    window.addEventListener('scroll', syncHeroTypography, { passive: true });
    window.addEventListener('resize', syncHeroTypography, { passive: true });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: gatewayEl,
        start: 'top top',
        end: 'bottom 28%',
        scrub: true,
        onEnter: (self) => applyGatewayVisuals(self.progress),
        onEnterBack: (self) => applyGatewayVisuals(self.progress),
        onUpdate: (self) => {
          if (self.isActive) {
            applyGatewayVisuals(self.progress);
          }
        },
      });
    }, pageRef);

    return () => {
      window.removeEventListener('scroll', syncHeroTypography);
      window.removeEventListener('resize', syncHeroTypography);
      ctx.revert();
    };
  }, [reducedMotion, setEnvironmentState, planetJourneyRef]);

  const initialHorizon = computeHeroHorizonRevealMetrics(0, reducedMotion);

  return (
    <div ref={pageRef} className="relative z-10 w-full bg-transparent text-[#F5F3EF]">
      {/* MOVEMENT 01 — PURE BLACK OPENING STAGE WITH EMERGING FOUR-PLANET HORIZON AT BOTTOM */}
      <section
        ref={gatewayRef}
        data-testid="home-hero-gateway"
        className="relative min-h-[100svh] w-full bg-transparent flex flex-col items-center justify-center overflow-hidden px-4 py-20"
        style={
          {
            '--hero-letters-op': '1',
            '--hero-letters-spread': '0px',
            '--hero-sub-op': '1',
            '--hero-mask-start': `${initialHorizon.maskStartPercent}%`,
            '--hero-mask-feather': `${initialHorizon.maskFeatherPercent}%`,
            '--hero-mask-op': String(initialHorizon.maskOpacity),
            '--hero-cue-op': String(initialHorizon.scrollCueOpacity),
          } as React.CSSProperties
        }
      >
        {/* Scroll-receding black curtain: 100% pure #000000 across Hero top, softly parting at the bottom
            to let the real four-planet Three.js silhouette & cosmic glow shine through */}
        <div
          aria-hidden="true"
          data-testid="hero-horizon-veil"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: 'var(--hero-mask-op, 1)' as unknown as number,
            background:
              'linear-gradient(to bottom, #000000 0%, #000000 var(--hero-mask-start, 56%), rgba(0,0,0,0.42) calc((var(--hero-mask-start, 56%) + var(--hero-mask-feather, 94%)) * 0.52), rgba(0,0,0,0) var(--hero-mask-feather, 94%))',
          }}
        />

        {/* Monumental Central Wordmark over pure black top — single dominant ★ rendered by JourneyStarCompanion */}
        <div
          className="relative z-20 flex flex-col items-center text-center select-none"
          style={{
            opacity:
              introActive && !reducedMotion
                ? 'var(--mahop-hero-wordmark, 0)'
                : 1,
          }}
        >
          <span ref={leftWordRef} className="contents">
            <BrandLogo
              size="hero"
              as="h1"
              starSlotId="hero"
              starHidden={!reducedMotion}
              leftGlyphStyle={{
                opacity: 'var(--hero-letters-op, 1)' as unknown as number,
                transform: 'translate3d(calc(var(--hero-letters-spread, 0px) * -1), 0, 0)',
              }}
              rightGlyphStyle={{
                opacity: 'var(--hero-letters-op, 1)' as unknown as number,
                transform: 'translate3d(var(--hero-letters-spread, 0px), 0, 0)',
              }}
              className="text-[#F5F3EF]"
            />
          </span>

          <div
            ref={subtitleWrapRef}
            style={{ opacity: 'var(--hero-sub-op, 1)' as unknown as number }}
          >
            <p className="mt-6 sm:mt-10 font-serif italic text-lg sm:text-3xl text-[#F5F3EF]/88 tracking-wide px-4">
              Nocturnal Textile Theatre — Aurelia Mahop Di Toro
            </p>
          </div>
        </div>

        <span ref={rightWordRef} className="hidden" aria-hidden="true" />

        <div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-7 z-20 font-mono text-[10px] tracking-[0.34em] uppercase text-[#F5F3EF]/78 whitespace-nowrap"
          style={{
            opacity:
              introActive && !reducedMotion
                ? 'calc(var(--hero-cue-op, 1) * var(--mahop-hero-wordmark, 0))'
                : 'var(--hero-cue-op, 1)',
          }}
        >
          Scroll to enter
        </div>
      </section>

      {/* MOVEMENT 02 — L'ETOILE MAHO (Unified 4-Planet System) */}
      <LetoileSection showHeader={true} />

      {/* MOVEMENT 03 — MAH★P (2D Fluorescent-Green/White/Black Collage Act I + 2D Botanical Act II) */}
      <MahStarPSection showHeader={true} />

      {/* MOVEMENT 04 — AURORA DE LIAGE X AURO DA'PUNK (Pure 2D Punk Stage) */}
      <AuroraSection showHeader={true} />

      {/* MOVEMENT 05–06 — MATERIAL TABLE (24 Mapped Swatches) -> MASKED PUZZLE ABOUT REVEAL */}
      <MaterialTableSection
        continuousAboutTransition={true}
        showMovementTag={true}
      />
    </div>
  );
}
