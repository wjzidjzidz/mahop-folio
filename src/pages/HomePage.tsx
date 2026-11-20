import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandLogo } from '../components/BrandLogo';
import { BrandStar } from '../components/BrandStar';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { LetoileSection } from '../components/sections/LetoileSection';
import { MahStarPSection } from '../components/sections/MahStarPSection';
import { AuroraSection } from '../components/sections/AuroraSection';
import { MaterialTableSection } from '../components/sections/MaterialTableSection';
import { ProjectEnvironmentHost } from '../components/three/ProjectEnvironmentHost';
import {
  computeChapterStageMetrics,
  computeHeroGatewayMetrics,
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
} from '../utils/journeyLogic';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const [activeScene, setActiveScene] = useState<EnvironmentSceneId>('gateway');
  const [sceneProgress, setSceneProgress] = useState(0);
  const [gatewayProgress, setGatewayProgress] = useState(0);

  const handleSectionEnvironmentChange = useCallback(
    (sceneId: EnvironmentSceneId, progress: number) => {
      setActiveScene(sceneId);
      setSceneProgress(progress);
    },
    []
  );

  // Debounced ScrollTrigger.refresh when lazy exhibition artwork finishes loading
  useEffect(() => {
    const root = pageRef.current;
    if (!root || reducedMotion) return;

    let timer: number | undefined;
    const scheduleRefresh = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 180);
    };

    const imgs = Array.from(root.querySelectorAll('img'));
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', scheduleRefresh, { once: true });
      }
    });

    return () => {
      if (timer) window.clearTimeout(timer);
      imgs.forEach((img) => img.removeEventListener('load', scheduleRefresh));
    };
  }, [reducedMotion]);

  useEffect(() => {
    const gatewayEl = gatewayRef.current;
    if (!gatewayEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: gatewayEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onEnter: () => {
          setActiveScene('gateway');
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS.gateway.accentHex,
            })
          );
        },
        onEnterBack: () => {
          setActiveScene('gateway');
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS.gateway.accentHex,
            })
          );
        },
        onUpdate: (self) => {
          setGatewayProgress(self.progress);
          if (self.isActive) {
            setActiveScene('gateway');
            setSceneProgress(self.progress);
          }
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const heroMetrics = computeHeroGatewayMetrics(gatewayProgress, reducedMotion);
  const stageMetrics =
    activeScene === 'gateway'
      ? {
          sceneOpacity: Number((0.92 - gatewayProgress * 0.2).toFixed(3)),
          backdropDim: Number((0.12 + gatewayProgress * 0.25).toFixed(3)),
        }
      : computeChapterStageMetrics(sceneProgress, reducedMotion);

  const driftClass = (kind: string) => (reducedMotion ? '' : kind);

  return (
    <div ref={pageRef} className="w-full bg-black text-[#F5F3EF]">
      {/* Unified Exhibition Stage spanning Gateway -> L'Étoile -> MAH★P Act II -> Aurora */}
      <div className="relative w-full">
        {/* Single sticky WebGL Canvas — pauses automatically once Material Table enters */}
        <div className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 overflow-hidden">
          <ProjectEnvironmentHost
            sceneId={activeScene}
            opacity={stageMetrics.sceneOpacity}
            scrollProgress={sceneProgress}
          />
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: stageMetrics.backdropDim * 0.55 }}
          />
        </div>

        {/* Continuous Scrollable Worlds over the Sticky 3D Host */}
        <div className="relative z-10 -mt-[100svh]">
          {/* MOVEMENT 01 — THE GATEWAY */}
          <section
            ref={gatewayRef}
            data-testid="home-hero-gateway"
            className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden px-4 py-20"
          >
            {/* Multi-Directional Drifting Visual Artwork across Perimeter */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-200"
              style={{ opacity: heroMetrics.collageOpacity }}
              aria-hidden="true"
            >
              {/* Top-left drift L -> R */}
              <div
                className={`absolute top-[9%] left-[4%] sm:left-[7%] w-[24vw] sm:w-[13vw] max-w-[180px] opacity-55 sm:opacity-70 ${driftClass(
                  'animate-hero-drift-lr'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.cast[0]}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>

              {/* Top-right drift R -> L */}
              <div
                className={`absolute top-[11%] right-[5%] sm:right-[9%] w-[30vw] sm:w-[19vw] max-w-[260px] opacity-48 sm:opacity-65 ${driftClass(
                  'animate-hero-drift-rl'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.etoile.plate}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>

              {/* Mid-left drift T -> B */}
              <div
                className={`hidden md:block absolute top-[34%] left-[2%] w-[12vw] max-w-[165px] opacity-65 ${driftClass(
                  'animate-hero-drift-tb'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.cast[1]}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>

              {/* Mid-right drift B -> T */}
              <div
                className={`hidden md:block absolute top-[32%] right-[3%] w-[13vw] max-w-[180px] opacity-65 ${driftClass(
                  'animate-hero-drift-bt'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.cast[2]}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>

              {/* Bottom-left diagonal drift */}
              <div
                className={`absolute bottom-[7%] left-[6%] sm:left-[12%] w-[26vw] sm:w-[16vw] max-w-[220px] opacity-55 sm:opacity-70 ${driftClass(
                  'animate-hero-drift-diag'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.aurora.intro.illustrations[0]}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>

              {/* Bottom-right textile & editorial drift */}
              <div
                className={`absolute bottom-[8%] right-[6%] sm:right-[11%] w-[26vw] sm:w-[15vw] max-w-[210px] opacity-55 sm:opacity-70 ${driftClass(
                  'animate-hero-drift-rl'
                )}`}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.materials[0]}
                  className="w-full h-auto object-contain"
                  eager
                />
              </div>
            </div>

            {/* Monumental Central Wordmark + Guiding Star Entrance */}
            <div
              className="relative z-20 flex flex-col items-center text-center select-none"
              style={{
                opacity: heroMetrics.wordmarkOpacity,
                transform: `scale(${heroMetrics.wordmarkScale})`,
              }}
            >
              <div
                className="mb-4 sm:mb-6 text-[#F5F3EF] transition-transform duration-150"
                style={{
                  transform: `translate3d(0, ${heroMetrics.starYOffsetPx}px, 0) scale(${heroMetrics.starScale})`,
                }}
                aria-hidden="true"
              >
                <BrandStar className="w-7 h-7 sm:w-9 sm:h-9" />
              </div>

              <BrandLogo
                size="hero"
                as="h1"
                className="text-[#F5F3EF] drop-shadow-[0_18px_60px_rgba(0,0,0,0.9)]"
              />

              <p className="mt-6 sm:mt-8 font-serif italic text-xl sm:text-3xl text-[#F5F3EF]/88 tracking-wide">
                Nocturnal Textile Theatre — Aurelia Mahop Di Toro
              </p>
            </div>

            <div
              className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.34em] uppercase text-[#B8B5B1]/85 pointer-events-none"
              style={{ opacity: Math.max(0, 1 - gatewayProgress * 3) }}
            >
              Scroll to enter
            </div>
          </section>

          {/* MOVEMENT 02 — L'ETOILE MAHO (Mercury · Uranus · Pluto · Mars) */}
          <LetoileSection
            standaloneStage={false}
            showHeader={true}
            onEnvironmentChange={handleSectionEnvironmentChange}
          />

          {/* MOVEMENT 03 — MAH★P (White Collage Act I + Botanical Emerald Field Act II) */}
          <MahStarPSection
            standaloneStage={false}
            showHeader={true}
            onEnvironmentChange={handleSectionEnvironmentChange}
          />

          {/* MOVEMENT 04 — AURORA DE LIAGE X AURO DA'PUNK */}
          <AuroraSection
            standaloneStage={false}
            showHeader={true}
            onEnvironmentChange={handleSectionEnvironmentChange}
          />
        </div>
      </div>

      {/* MOVEMENT 05–06 — UNIFIED MATERIAL TABLE -> ABOUT REVEAL -> WHITE FOOTER */}
      <MaterialTableSection
        continuousAboutTransition={true}
        showMovementTag={true}
      />
    </div>
  );
}
