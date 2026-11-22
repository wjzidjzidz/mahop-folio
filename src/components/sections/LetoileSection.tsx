import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioImage } from '../PortfolioImage';
import { PORTFOLIO_ASSETS } from '../../data/portfolioAssets';
import { PROJECTS } from '../../data/content';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import {
  computeChapterStageMetrics,
  computePlanetJourneyState,
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
  type PlanetKind,
} from '../../utils/journeyLogic';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface LetoileSectionProps {
  showHeader?: boolean;
}

const CHAPTER_SUBTITLES: Record<string, string> = {
  mercury: 'Metallic mineral craters & graphite light',
  uranus: 'Frozen cyan haze & oblique crystal rings',
  pluto: 'Charcoal frost stillness & twin moonlet',
  mars: 'Volcanic terracotta ridges & ember fissures',
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV'] as const;

export function LetoileSection({ showHeader = true }: LetoileSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introStageRef = useRef<HTMLDivElement>(null);
  const journeyRafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();
  const { setEnvironmentState, planetJourneyRef, cancelPlanetJourneyRef } = useExhibitionStage();
  const project = PROJECTS.letoile;
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKind | null>(null);

  useEffect(() => {
    const emitEnv = (
      sceneId: EnvironmentSceneId,
      progress: number,
      metrics = computeChapterStageMetrics(progress, reducedMotion)
    ) => {
      setEnvironmentState(sceneId, progress, metrics.sceneOpacity, metrics.backdropDim);
      window.dispatchEvent(
        new CustomEvent('mahop:scene-accent', {
          detail: PROJECT_ENVIRONMENTS[sceneId].accentHex,
        })
      );
    };

    const computeOverviewMetrics = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      if (p <= 0.44) {
        return {
          sceneOpacity: 1,
          backdropDim: 0,
          titleOpacity: 1,
          chapterPhase: 'entering' as const,
        };
      }
      const photoT = (p - 0.44) / 0.56;
      return {
        sceneOpacity: Number((1 - photoT * 0.28).toFixed(4)),
        backdropDim: Number((photoT * 0.26).toFixed(4)),
        titleOpacity: 1,
        chapterPhase: 'foreground' as const,
      };
    };

    const ctx = gsap.context(() => {
      // Overview phase across L'Étoile pinned showcase + intro collage + 6 photos:
      // hands off edge-to-edge from HomePage ('bottom 28%') directly to chapter-mercury ('top 45%')
      if (introStageRef.current) {
        ScrollTrigger.create({
          trigger: introStageRef.current,
          start: 'top 28%',
          end: 'bottom 45%',
          scrub: true,
          onEnter: (self) => {
            if (planetJourneyRef.current.active) return;
            emitEnv('letoile-overview', self.progress, computeOverviewMetrics(self.progress));
          },
          onEnterBack: (self) => {
            if (planetJourneyRef.current.active) return;
            emitEnv('letoile-overview', self.progress, computeOverviewMetrics(self.progress));
          },
          onRefresh: (self) => {
            if (planetJourneyRef.current.active) return;
            if (self.isActive) {
              emitEnv('letoile-overview', self.progress, computeOverviewMetrics(self.progress));
            }
          },
          onUpdate: (self) => {
            if (planetJourneyRef.current.active) return;
            if (self.isActive) {
              emitEnv('letoile-overview', self.progress, computeOverviewMetrics(self.progress));
            }
          },
        });
      }

      if (!reducedMotion) {
        gsap.fromTo(
          '[data-letoile-intro-cutout]',
          { y: 42 },
          {
            y: -36,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-letoile-intro-stage]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          '[data-letoile-photo-band="upper"]',
          { xPercent: 4 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-letoile-photos]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          '[data-letoile-photo-band="lower"]',
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-letoile-photos]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      const chapterEls = gsap.utils.toArray<HTMLElement>('[data-planet-chapter]');
      chapterEls.forEach((chapterEl) => {
        const chapterId = chapterEl.dataset.planetChapter as EnvironmentSceneId;
        if (!chapterId) return;
        const titleEl = chapterEl.querySelector<HTMLElement>('[data-chapter-title]');

        const syncChapter = (progress: number) => {
          const metrics = computeChapterStageMetrics(progress, reducedMotion);
          emitEnv(chapterId, progress, metrics);
          if (titleEl) {
            titleEl.style.opacity = String(metrics.titleOpacity);
          }
        };

        ScrollTrigger.create({
          trigger: chapterEl,
          start: 'top 45%',
          end: 'bottom 45%',
          scrub: true,
          onEnter: (self) => {
            if (planetJourneyRef.current.active) return;
            syncChapter(self.progress);
          },
          onEnterBack: (self) => {
            if (planetJourneyRef.current.active) return;
            syncChapter(self.progress);
          },
          onRefresh: (self) => {
            if (planetJourneyRef.current.active) return;
            if (self.isActive) {
              syncChapter(self.progress);
            }
          },
          onToggle: (self) => {
            if (planetJourneyRef.current.active) return;
            if (self.isActive) {
              syncChapter(self.progress);
            }
          },
          onUpdate: (self) => {
            if (planetJourneyRef.current.active) return;
            if (self.isActive) {
              syncChapter(self.progress);
            }
          },
        });

        if (!reducedMotion) {
          const foregroundTargets = chapterEl.querySelectorAll<HTMLElement>('[data-chapter-float]');
          foregroundTargets.forEach((el, idx) => {
            gsap.fromTo(
              el,
              { y: idx % 2 === 0 ? 48 : 72 },
              {
                y: idx % 2 === 0 ? -24 : -42,
                ease: 'none',
                scrollTrigger: {
                  trigger: chapterEl,
                  start: 'top 78%',
                  end: 'bottom 22%',
                  scrub: true,
                },
              }
            );
          });
        }
      });
    }, sectionRef);

    const sectionEl = sectionRef.current;
    let refreshTimer: number | undefined;
    const scheduleRefresh = () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      }, 60);
    };

    const handleCaptureLoad = (event: Event) => {
      if ((event.target as HTMLElement | null)?.tagName === 'IMG') {
        scheduleRefresh();
      }
    };

    sectionEl?.addEventListener('load', handleCaptureLoad, true);

    let resizeObserver: ResizeObserver | undefined;
    if (sectionEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        scheduleRefresh();
      });
      resizeObserver.observe(sectionEl);
    }

    let fontsCancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!fontsCancelled) scheduleRefresh();
      });
    }

    return () => {
      fontsCancelled = true;
      if (refreshTimer) window.clearTimeout(refreshTimer);
      sectionEl?.removeEventListener('load', handleCaptureLoad, true);
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, [reducedMotion, setEnvironmentState, planetJourneyRef]);

  // Cancel any active planetary flight cleanly on unmount or manual interruption
  useEffect(() => {
    const cancelJourney = () => {
      if (journeyRafRef.current) {
        window.cancelAnimationFrame(journeyRafRef.current);
        journeyRafRef.current = 0;
      }
      if (planetJourneyRef.current.active) {
        planetJourneyRef.current = {
          active: false,
          targetPlanet: null,
          phase: 'idle',
          portalProgress: 0,
        };
        setSelectedPlanet(null);
      }
    };

    cancelPlanetJourneyRef.current = cancelJourney;

    const onManualWheelOrTouch = () => cancelJourney();
    const onManualKey = (e: KeyboardEvent) => {
      if (
        ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', ' ', 'Home', 'End'].includes(e.key)
      ) {
        cancelJourney();
      }
    };

    window.addEventListener('wheel', onManualWheelOrTouch, { passive: true });
    window.addEventListener('touchstart', onManualWheelOrTouch, { passive: true });
    window.addEventListener('keydown', onManualKey);

    return () => {
      cancelJourney();
      cancelPlanetJourneyRef.current = null;
      window.removeEventListener('wheel', onManualWheelOrTouch);
      window.removeEventListener('touchstart', onManualWheelOrTouch);
      window.removeEventListener('keydown', onManualKey);
    };
  }, [planetJourneyRef, cancelPlanetJourneyRef]);

  /**
   * Controlled ~2.6s Direct Planetary Click Flight:
   * Highlights selected planet -> smoothly flies camera toward planet sphere -> pierces atmospheric portal veil
   * -> silently aligns #chapter-{id} behind peak atmospheric veil -> reveals chapter title & photography cleanly
   * without racing past intermediate planets.
   */
  const jumpToChapter = (chapterId: string) => {
    const targetPlanet = chapterId as PlanetKind;
    const el = document.getElementById(`chapter-${chapterId}`);
    if (!el) return;

    if (journeyRafRef.current) {
      window.cancelAnimationFrame(journeyRafRef.current);
      journeyRafRef.current = 0;
    }

    if (reducedMotion) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
      setEnvironmentState(targetPlanet, 0.28, 0.85, 0.25);
      return;
    }

    const durationSec = 2.6;
    const startTime = performance.now();
    let scrollAligned = false;

    setSelectedPlanet(targetPlanet);
    planetJourneyRef.current = {
      active: true,
      targetPlanet,
      phase: 'selection',
      portalProgress: 0,
    };
    setEnvironmentState(targetPlanet, 0, 0.96, 0.12);
    window.dispatchEvent(
      new CustomEvent('mahop:scene-accent', {
        detail: PROJECT_ENVIRONMENTS[targetPlanet].accentHex,
      })
    );

    const stepFlight = (now: number) => {
      if (!planetJourneyRef.current.active) return;

      const elapsedSec = (now - startTime) / 1000;
      const m = computePlanetJourneyState(elapsedSec, durationSec);

      planetJourneyRef.current = {
        active: true,
        targetPlanet,
        phase: m.phase,
        portalProgress: m.portalProgress,
      };
      setEnvironmentState(
        targetPlanet,
        m.portalProgress,
        m.phase === 'arrival' ? 0.92 : 0.98,
        m.phase === 'arrival' ? 0.2 : 0.1
      );

      // Silently align DOM position cleanly behind the atmospheric crossing veil (~t = 0.72)
      // to the end of the pinned portal chamber so the planet title & habitat match seamlessly.
      if (!scrollAligned && m.normalizedTime >= 0.72) {
        scrollAligned = true;
        const titleEl = el.querySelector<HTMLElement>('[data-chapter-title]');
        if (titleEl) titleEl.style.opacity = '1';
        const portalEl = el.querySelector<HTMLElement>('[data-planet-portal-stage]');
        const portalTravel = portalEl ? Math.max(0, portalEl.offsetHeight - window.innerHeight) : 0;
        const rect = el.getBoundingClientRect();
        const targetTop = Math.max(0, window.scrollY + rect.top + portalTravel);
        window.scrollTo({ top: targetTop, behavior: 'auto' });
      }

      if (m.isComplete) {
        planetJourneyRef.current = {
          active: false,
          targetPlanet: null,
          phase: 'idle',
          portalProgress: m.portalProgress,
        };
        setSelectedPlanet(null);
        journeyRafRef.current = 0;
        ScrollTrigger.refresh();
        return;
      }

      journeyRafRef.current = window.requestAnimationFrame(stepFlight);
    };

    journeyRafRef.current = window.requestAnimationFrame(stepFlight);
  };

  return (
    <section
      ref={sectionRef}
      id="letoile-maho"
      data-testid="section-letoile-maho"
      data-planet-journey={selectedPlanet ?? 'idle'}
      className="relative z-10 w-full text-[#F5F3EF]"
    >
      {/* Solar Overview Stage: Sticky Orbital Chamber + Intro Collage + 6 Editorial Photos */}
      <div ref={introStageRef}>
        {showHeader && (
          <div
            data-letoile-overview-pin
            className={
              reducedMotion
                ? 'relative px-5 sm:px-8 lg:px-14 pt-24 pb-12'
                : 'relative min-h-[175vh] sm:min-h-[190vh]'
            }
          >
            <div
              className={
                reducedMotion
                  ? 'max-w-7xl mx-auto'
                  : 'sticky top-0 min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 lg:px-14 pt-20 sm:pt-28 pb-7 sm:pb-12 pointer-events-none'
              }
            >
              <div className="max-w-7xl w-full mx-auto pointer-events-auto">
                <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-4 mb-3 sm:mb-5">
                  <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#B8B5B1]">
                    {project.sourcePages} · Unified Four-Planet System
                  </span>
                  <span className="font-serif italic text-xs sm:text-lg text-[#B8B5B1]">
                    Models {project.credits[0].name} · Photography {project.credits[1].name} · Clothing {project.credits[2].name}
                  </span>
                </div>

                <h2 className="font-display uppercase tracking-tighter text-[13vw] sm:text-[10vw] lg:text-[8.5vw] leading-[0.83] text-[#F5F3EF]">
                  {project.title}
                </h2>
              </div>

              <div className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 pt-4 sm:pt-8 pointer-events-auto">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-1 sm:gap-6 text-[11px] font-mono tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#B8B5B1] w-full sm:w-auto">
                  {project.chapters?.map((ch, idx) => {
                    const isActiveTarget = selectedPlanet === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        data-testid={`planet-nav-${ch.id}`}
                        aria-current={isActiveTarget ? 'true' : undefined}
                        onClick={() => jumpToChapter(ch.id)}
                        className={`editorial-link min-h-[44px] px-1.5 sm:px-2 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 ${
                          isActiveTarget ? 'text-[#F5F3EF]' : 'hover:text-[#F5F3EF]'
                        }`}
                      >
                        <span style={{ color: ch.accentHex }} className="mr-1.5 sm:mr-2">
                          {ROMAN_NUMERALS[idx]}
                        </span>
                        <span>{ch.name}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="hidden sm:inline font-mono text-[10px] tracking-[0.28em] uppercase text-[#B8B5B1]/75">
                  Scroll to enter planetary chambers
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Intro Collage Stage + Cutout Cast (p. 6) */}
        <div
          data-letoile-intro-stage
          className="relative px-4 sm:px-8 lg:px-14 py-12 sm:py-20"
        >
          <div className="relative mx-auto max-w-[1380px] min-h-[60vw] sm:min-h-[68vh] flex items-center justify-center">
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.letoile.intro.plate}
              className="w-full max-w-[1160px] h-auto object-contain opacity-92"
            />
            <div
              data-letoile-intro-cutout
              className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none"
            >
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.intro.models}
                className="w-[64%] sm:w-[46%] max-w-[660px] h-auto object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.85)]"
              />
            </div>
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.letoile.intro.illustrations[0]}
              className="hidden md:block absolute left-0 lg:left-6 bottom-4 w-[21%] max-w-[290px] h-auto object-contain animate-cutout-drift"
            />
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.letoile.intro.illustrations[1]}
              className="hidden md:block absolute right-0 lg:right-6 bottom-6 w-[21%] max-w-[290px] h-auto object-contain animate-cutout-drift"
            />
          </div>
          <p className="mt-6 text-center font-serif italic text-sm sm:text-base text-[#B8B5B1]/80">
            {project.creditNote}
          </p>
        </div>

        {/* 6 Editorial Photographs (p. 7) — Unboxed Asymmetric Gallery Bands */}
        <div data-letoile-photos className="py-16 sm:py-28 space-y-10 sm:space-y-16 overflow-x-clip">
          <div
            data-letoile-photo-band="upper"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 px-5 sm:px-10 lg:px-16 items-end"
          >
            <div className="md:col-span-5">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[0]}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-4 md:pb-12">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[1]}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-3">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[2]}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div
            data-letoile-photo-band="lower"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 px-5 sm:px-10 lg:px-16 items-start"
          >
            <div className="md:col-span-3 md:col-start-2">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[3]}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-4 md:pt-10">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[4]}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-3">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.letoile.photographs[5]}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOUR PLANETARY CHAPTERS — Tiled Edge-to-Edge With Pinned Portals */}
      <div className="pb-12 sm:pb-20">
        {PORTFOLIO_ASSETS.letoile.chapters.map((chapter, idx) => {
          const chapterMeta = project.chapters?.[idx];
          const chapterId = (chapterMeta?.id || chapter.name.toLowerCase()) as EnvironmentSceneId;
          const accentHex = chapterMeta?.accentHex || '#F5F3EF';
          const isUranus = chapterId === 'uranus';
          const isPluto = chapterId === 'pluto';
          const isMars = chapterId === 'mars';

          return (
            <article
              key={chapter.name}
              id={`chapter-${chapterId}`}
              data-planet-chapter={chapterId}
              data-testid={`chapter-${chapterId}`}
              className="relative w-full scroll-mt-24 pb-24 sm:pb-36"
            >
              {/* Deliberate Pinned Planetary Portal Runway — zero dark box behind titles */}
              <div
                data-planet-portal-stage={chapterId}
                className={
                  reducedMotion
                    ? 'relative min-h-[54svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 pointer-events-none'
                    : 'relative min-h-[185vh] sm:min-h-[235vh]'
                }
              >
                <div
                  className={
                    reducedMotion
                      ? 'relative z-10 max-w-7xl w-full mx-auto'
                      : 'sticky top-0 h-[100svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-14 sm:pb-20 pointer-events-none'
                  }
                >
                  <div
                    data-chapter-title
                    className="relative z-10 max-w-7xl w-full mx-auto transition-opacity duration-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.72)]"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                      <span
                        className="font-mono text-xs tracking-[0.3em] uppercase brightness-125"
                        style={{ color: accentHex }}
                      >
                        Chapter {ROMAN_NUMERALS[idx]}
                      </span>
                      <span className="font-serif italic text-base sm:text-xl text-[#F5F3EF]/95">
                        {CHAPTER_SUBTITLES[chapterId]}
                      </span>
                    </div>
                    <h3 className="font-display uppercase tracking-tighter text-[17vw] sm:text-[15vw] lg:text-[13vw] leading-[0.8] text-[#F5F3EF]">
                      {chapter.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Foreground Exhibition Choreography Distinct per Planet */}
              <div className="px-5 sm:px-10 lg:px-16 max-w-[1440px] mx-auto">
                {!isUranus && !isPluto && !isMars && (
                  <div className="space-y-14 sm:space-y-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      <div className="lg:col-span-7" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.plate}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="lg:col-span-5 grid grid-cols-2 gap-6 items-end" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.models[0]}
                          className="w-full h-auto object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
                        />
                        <PortfolioImage
                          asset={chapter.models[1]}
                          className="w-full h-auto object-contain translate-y-6 drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-10 items-center" data-chapter-float>
                      <div className="col-span-2 md:col-span-4 flex items-center justify-center">
                        <PortfolioImage
                          asset={chapter.illustration}
                          className="max-h-[480px] w-auto object-contain"
                        />
                      </div>
                      {chapter.swatches.map((sw, sIdx) => (
                        <div
                          key={sw.slot}
                          className={`md:col-span-2 ${
                            sIdx === 1 ? 'md:col-start-6 -translate-y-4' : sIdx === 2 ? 'md:col-start-9' : ''
                          }`}
                        >
                          <PortfolioImage
                            asset={sw}
                            className="w-full max-w-[240px] mx-auto h-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isUranus && (
                  <div className="space-y-16 sm:space-y-24">
                    <div className="mx-auto max-w-[1180px]" data-chapter-float>
                      <PortfolioImage
                        asset={chapter.plate}
                        className="w-full h-auto object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-end" data-chapter-float>
                      {chapter.models.map((m, mIdx) => (
                        <div
                          key={m.slot}
                          className={mIdx === 1 ? 'md:-translate-y-10' : ''}
                        >
                          <PortfolioImage
                            asset={m}
                            className="w-full max-h-[560px] object-contain mx-auto drop-shadow-[0_24px_55px_rgba(0,0,0,0.75)]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-12 gap-8 items-center" data-chapter-float>
                      {chapter.swatches.map((sw, sIdx) => (
                        <div
                          key={sw.slot}
                          className={sIdx === 0 ? 'col-span-2 md:col-span-3' : sIdx === 1 ? 'md:col-span-3' : 'md:col-span-2'}
                        >
                          <PortfolioImage
                            asset={sw}
                            className="w-full max-w-[240px] mx-auto h-auto object-contain"
                          />
                        </div>
                      ))}
                      <div className="col-span-2 md:col-span-4 flex justify-center">
                        <PortfolioImage
                          asset={chapter.illustration}
                          className="max-h-[500px] w-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isPluto && (
                  <div className="space-y-16 sm:space-y-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                      <div className="lg:col-span-4 lg:order-2 flex justify-center" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.illustration}
                          className="max-h-[540px] w-auto object-contain"
                        />
                      </div>
                      <div className="lg:col-span-8 lg:order-1" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.plate}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center" data-chapter-float>
                      {chapter.models.map((m, mIdx) => (
                        <div
                          key={m.slot}
                          className={`md:col-span-4 ${mIdx === 1 ? 'md:translate-y-8' : ''}`}
                        >
                          <PortfolioImage
                            asset={m}
                            className="w-full max-h-[480px] object-contain mx-auto"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20" data-chapter-float>
                      {chapter.swatches.map((sw) => (
                        <PortfolioImage
                          key={sw.slot}
                          asset={sw}
                          className="w-52 sm:w-64 h-auto object-contain"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {isMars && (
                  <div className="space-y-16 sm:space-y-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                      <div className="lg:col-span-8" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.plate}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="lg:col-span-4 flex justify-center" data-chapter-float>
                        <PortfolioImage
                          asset={chapter.illustration}
                          className="max-h-[520px] w-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end" data-chapter-float>
                      {chapter.models.map((m, mIdx) => (
                        <PortfolioImage
                          key={m.slot}
                          asset={m}
                          className={`w-full max-h-[530px] object-contain mx-auto ${
                            mIdx === 1 ? 'md:-translate-y-8' : ''
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-center max-w-4xl mx-auto" data-chapter-float>
                      {chapter.swatches.map((sw) => (
                        <PortfolioImage
                          key={sw.slot}
                          asset={sw}
                          className="w-56 sm:w-64 h-auto object-contain mx-auto"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
