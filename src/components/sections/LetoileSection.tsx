import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioImage } from '../PortfolioImage';
import { PORTFOLIO_ASSETS } from '../../data/portfolioAssets';
import { PROJECTS } from '../../data/content';
import { ProjectEnvironmentHost } from '../three/ProjectEnvironmentHost';
import {
  computeChapterStageMetrics,
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
} from '../../utils/journeyLogic';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface LetoileSectionProps {
  standaloneStage?: boolean;
  showHeader?: boolean;
  onEnvironmentChange?: (sceneId: EnvironmentSceneId, progress: number) => void;
}

const CHAPTER_SUBTITLES: Record<string, string> = {
  mercury: 'Metallic mineral craters & graphite light',
  uranus: 'Frozen cyan haze & oblique crystal rings',
  pluto: 'Charcoal frost stillness & twin moonlet',
  mars: 'Volcanic terracotta ridges & ember fissures',
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV'] as const;

export function LetoileSection({
  standaloneStage = false,
  showHeader = true,
  onEnvironmentChange,
}: LetoileSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const project = PROJECTS.letoile;

  const [activeScene, setActiveScene] = useState<EnvironmentSceneId>('mercury');
  const [sceneProgress, setSceneProgress] = useState(0);
  const [chapterMetrics, setChapterMetrics] = useState<
    Record<string, ReturnType<typeof computeChapterStageMetrics>>
  >(() => ({
    mercury: computeChapterStageMetrics(0, reducedMotion),
    uranus: computeChapterStageMetrics(0, reducedMotion),
    pluto: computeChapterStageMetrics(0, reducedMotion),
    mars: computeChapterStageMetrics(0, reducedMotion),
  }));

  useEffect(() => {
    const onEnv = (sceneId: EnvironmentSceneId, progress: number) => {
      setActiveScene(sceneId);
      setSceneProgress(progress);
      onEnvironmentChange?.(sceneId, progress);
      window.dispatchEvent(
        new CustomEvent('mahop:scene-accent', {
          detail: PROJECT_ENVIRONMENTS[sceneId].accentHex,
        })
      );
    };

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      // Subtle parallax inside L'Étoile intro plate & cutouts
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

      // Horizontal gallery drift for the 6 editorial photographs
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

      const chapterEls = gsap.utils.toArray<HTMLElement>('[data-planet-chapter]');
      chapterEls.forEach((chapterEl) => {
        const chapterId = chapterEl.dataset.planetChapter as EnvironmentSceneId;
        if (!chapterId) return;

        ScrollTrigger.create({
          trigger: chapterEl,
          start: 'top 62%',
          end: 'bottom 38%',
          scrub: true,
          onEnter: () => onEnv(chapterId, 0.04),
          onEnterBack: () => onEnv(chapterId, 0.92),
          onToggle: (self) => {
            if (self.isActive) {
              onEnv(chapterId, self.progress);
            }
          },
          onUpdate: (self) => {
            const m = computeChapterStageMetrics(self.progress, false);
            setChapterMetrics((prev) => ({ ...prev, [chapterId]: m }));
            if (self.isActive) {
              onEnv(chapterId, self.progress);
            }
          },
        });

        // Foreground figure glides smoothly over receding planet
        const foregroundTargets = chapterEl.querySelectorAll<HTMLElement>('[data-chapter-float]');
        foregroundTargets.forEach((el, idx) => {
          gsap.fromTo(
            el,
            { y: idx % 2 === 0 ? 52 : 76, opacity: 0.88 },
            {
              y: idx % 2 === 0 ? -24 : -44,
              opacity: 1,
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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, onEnvironmentChange]);

  const activeMetrics = chapterMetrics[activeScene] || computeChapterStageMetrics(0, reducedMotion);

  const jumpToChapter = (chapterId: string) => {
    const el = document.getElementById(`chapter-${chapterId}`);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="letoile-maho"
      data-testid="section-letoile-maho"
      className="relative w-full text-[#F5F3EF]"
    >
      {/* Dedicated sticky WebGL canvas ONLY on standalone /work/letoile-maho route */}
      {standaloneStage && (
        <div className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 overflow-hidden">
          <ProjectEnvironmentHost
            sceneId={activeScene}
            opacity={activeMetrics.sceneOpacity}
            scrollProgress={sceneProgress}
          />
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: activeMetrics.backdropDim * 0.55 }}
          />
        </div>
      )}

      <div className={standaloneStage ? 'relative z-10 -mt-[100svh]' : 'relative z-10'}>
        {/* Exhibition Opening Curtain */}
        {showHeader && (
          <div className="px-5 sm:px-8 lg:px-14 pt-28 sm:pt-36 pb-16 sm:pb-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#B8B5B1]">
                  {project.sourcePages} · Planetary Collection
                </span>
                <span className="font-serif italic text-base sm:text-lg text-[#B8B5B1]">
                  Models {project.credits[0].name} · Photography {project.credits[1].name} · Clothing {project.credits[2].name}
                </span>
              </div>

              <h2 className="font-display uppercase tracking-tighter text-[15vw] sm:text-[13vw] lg:text-[11vw] leading-[0.83] text-[#F5F3EF]">
                {project.title}
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-[11px] font-mono tracking-[0.26em] uppercase text-[#B8B5B1]">
                {project.chapters?.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => jumpToChapter(ch.id)}
                    className="editorial-link hover:text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
                  >
                    <span style={{ color: ch.accentHex }} className="mr-2">
                      {ROMAN_NUMERALS[idx]}
                    </span>
                    <span>{ch.name}</span>
                  </button>
                ))}
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

        {/* FOUR PLANETARY CHAPTERS */}
        <div className="space-y-24 sm:space-y-36 pb-20 sm:pb-32">
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
                className="relative w-full"
              >
                {/* Unobstructed Atmospheric Opening Stage over Live 3D Planet */}
                <div className="min-h-[54svh] sm:min-h-[72svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 sm:pb-20 pointer-events-none">
                  <div className="max-w-7xl w-full mx-auto">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span
                        className="font-mono text-xs tracking-[0.3em] uppercase"
                        style={{ color: accentHex }}
                      >
                        Chapter {ROMAN_NUMERALS[idx]}
                      </span>
                      <span className="font-serif italic text-base sm:text-xl text-[#F5F3EF]/82">
                        {CHAPTER_SUBTITLES[chapterId]}
                      </span>
                    </div>
                    <h3
                      className="font-display uppercase tracking-tighter text-[17vw] sm:text-[15vw] lg:text-[13vw] leading-[0.8]"
                      style={{ color: '#F5F3EF' }}
                    >
                      {chapter.name}
                    </h3>
                  </div>
                </div>

                {/* Foreground Exhibition Choreography Distinct per Planet */}
                <div className="px-5 sm:px-10 lg:px-16 max-w-[1440px] mx-auto">
                  {!isUranus && !isPluto && !isMars && (
                    /* MERCURY — Asymmetric metallic collage + tall silhouettes */
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
                    /* URANUS — Panoramic pale cyan horizon + floating 3-figure ensemble */
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
                    /* PLUTO — Monumental monochrome plate + charcoal stillness */
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
                    /* MARS — Terracotta diagonal surge + radiant orange textiles */
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
      </div>
    </section>
  );
}
