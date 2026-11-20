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

interface AuroraSectionProps {
  standaloneStage?: boolean;
  showHeader?: boolean;
  onEnvironmentChange?: (sceneId: EnvironmentSceneId, progress: number) => void;
}

export function AuroraSection({
  standaloneStage = false,
  showHeader = true,
  onEnvironmentChange,
}: AuroraSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const project = PROJECTS.aurora;

  const [auroraProgress, setAuroraProgress] = useState(0);
  const metrics = computeChapterStageMetrics(auroraProgress, reducedMotion);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 62%',
        end: 'bottom 38%',
        scrub: true,
        onEnter: () => {
          onEnvironmentChange?.('aurora-punk', 0.05);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['aurora-punk'].accentHex,
            })
          );
        },
        onEnterBack: () => {
          onEnvironmentChange?.('aurora-punk', 0.92);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['aurora-punk'].accentHex,
            })
          );
        },
        onToggle: (self) => {
          if (self.isActive) {
            onEnvironmentChange?.('aurora-punk', self.progress);
            window.dispatchEvent(
              new CustomEvent('mahop:scene-accent', {
                detail: PROJECT_ENVIRONMENTS['aurora-punk'].accentHex,
              })
            );
          }
        },
        onUpdate: (self) => {
          setAuroraProgress(self.progress);
          if (self.isActive) {
            onEnvironmentChange?.('aurora-punk', self.progress);
          }
        },
      });

      if (!reducedMotion) {
        gsap.fromTo(
          '[data-aurora-wheatpaste]',
          { y: 42 },
          {
            y: -34,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-aurora-phase="collage"]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        // Reversible torn-paper threshold gliding smoothly between collage and photography
        gsap.fromTo(
          '[data-aurora-threshold]',
          { xPercent: -6, scaleX: 0.96 },
          {
            xPercent: 4,
            scaleX: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-aurora-threshold]',
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          '[data-aurora-portrait-lead]',
          { y: 46, scale: 0.97 },
          {
            y: -18,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-aurora-phase="photography"]',
              start: 'top 82%',
              end: 'center center',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, onEnvironmentChange]);

  return (
    <section
      ref={sectionRef}
      id="aurora-punk"
      data-testid="section-aurora"
      className="relative w-full text-[#F5F3EF]"
    >
      {standaloneStage && (
        <div className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 overflow-hidden">
          <ProjectEnvironmentHost
            sceneId="aurora-punk"
            opacity={metrics.sceneOpacity}
            scrollProgress={auroraProgress}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: `rgba(6,5,8,${metrics.backdropDim * 0.5})` }}
          />
        </div>
      )}

      <div className={standaloneStage ? 'relative z-10 -mt-[100svh]' : 'relative z-10'}>
        {/* Underground Concrete Opening Window */}
        {showHeader && (
          <div className="min-h-[54svh] sm:min-h-[68svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pt-28 pb-14 sm:pb-20">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#C48CE9]">
                  {project.sourcePages} · Underground Concrete Stage
                </span>
                <span className="font-serif italic text-base sm:text-lg text-[#F5F3EF]/85">
                  Photographer {project.credits[0].name} · Stylist {project.credits[1].name} · Model {project.credits[2].name} · Dress by {project.credits[3].name}
                </span>
              </div>

              <h2 className="font-display uppercase tracking-tighter text-[12vw] sm:text-[9.5vw] lg:text-[8vw] leading-[0.86] text-[#F5F3EF]">
                {project.displayTitle}
              </h2>
            </div>
          </div>
        )}

        {/* PHASE 01 (p. 3) — Torn-Paper Wheatpaste Concrete Installation */}
        <div
          data-aurora-phase="collage"
          className="px-4 sm:px-8 lg:px-14 py-12 sm:py-20 max-w-[1440px] mx-auto"
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="torn-paper-edge overflow-hidden">
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.aurora.intro.plate}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6 items-end" data-aurora-wheatpaste>
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.intro.fullCutout}
                className="w-full max-h-[540px] object-contain drop-shadow-[0_24px_55px_rgba(0,0,0,0.9)]"
              />
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.intro.halfCutout}
                className="w-full max-h-[400px] object-contain drop-shadow-[0_24px_55px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>

          <div className="mt-14 sm:mt-20 flex flex-wrap items-end justify-center gap-12 sm:gap-24" data-aurora-wheatpaste>
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.aurora.intro.illustrations[0]}
              className="w-44 sm:w-56 h-auto object-contain"
            />
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.aurora.intro.illustrations[1]}
              className="w-40 sm:w-52 h-auto object-contain translate-y-4"
            />
          </div>
        </div>

        {/* REVERSIBLE TORN-PAPER THRESHOLD INTO PHASE 02 PHOTOGRAPHY */}
        <div className="py-10 sm:py-16 overflow-x-clip">
          <div
            data-aurora-threshold
            className="torn-paper-edge mx-auto w-[96vw] max-w-[1380px] h-14 sm:h-20 flex items-center justify-between px-8"
            style={{
              background:
                'linear-gradient(90deg, rgba(124,17,184,0.34) 0%, rgba(123,0,0,0.42) 52%, rgba(20,16,24,0.8) 100%)',
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-[#F5F3EF]/85">
              Phase 01 Collage · Torn Ephemera
            </span>
            <span className="font-serif italic text-base sm:text-lg text-[#F5F3EF]">
              Threshold → Phase 02 Editorial Portrait
            </span>
          </div>
        </div>

        {/* PHASE 02 (p. 4) — Large-Format Brazy Photography Sequence */}
        <div
          data-aurora-phase="photography"
          className="px-4 sm:px-8 lg:px-14 pt-8 pb-28 sm:pb-40 max-w-[1440px] mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            <div className="lg:col-span-6" data-aurora-portrait-lead>
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.photographs[0]}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:pt-16">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.photographs[1]}
                className="w-full h-auto object-cover sm:col-span-2"
              />
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.photographs[2]}
                className="w-full h-auto object-cover"
              />
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.aurora.photographs[3]}
                className="w-full h-auto object-cover sm:translate-y-8"
              />
            </div>
          </div>

          <p className="mt-10 font-serif italic text-sm sm:text-base text-[#B8B5B1]/80 text-right">
            {project.creditNote}
          </p>
        </div>
      </div>
    </section>
  );
}
