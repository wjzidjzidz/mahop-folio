import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioImage } from '../PortfolioImage';
import { PORTFOLIO_ASSETS } from '../../data/portfolioAssets';
import { PROJECTS } from '../../data/content';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import { AuroraPunkBackdrop } from '../environments/AuroraPunkBackdrop';
import { PROJECT_ENVIRONMENTS } from '../../utils/journeyLogic';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface AuroraSectionProps {
  showHeader?: boolean;
}

export function AuroraSection({ showHeader = true }: AuroraSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { setEnvironmentState } = useExhibitionStage();
  const project = PROJECTS.aurora;

  const [auroraProgress, setAuroraProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pure 2D Punk World — explicitly keep root WebGL canvas hidden & paused
      ScrollTrigger.create({
        trigger: section,
        start: 'top 62%',
        end: 'bottom 38%',
        scrub: true,
        onEnter: () => {
          setEnvironmentState('aurora-punk', 0.05, 0, 0);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['aurora-punk'].accentHex,
            })
          );
        },
        onEnterBack: () => {
          setEnvironmentState('aurora-punk', 0.92, 0, 0);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['aurora-punk'].accentHex,
            })
          );
        },
        onToggle: (self) => {
          if (self.isActive) {
            setEnvironmentState('aurora-punk', self.progress, 0, 0);
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
            setEnvironmentState('aurora-punk', self.progress, 0, 0);
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
  }, [reducedMotion, setEnvironmentState]);

  return (
    <section
      ref={sectionRef}
      id="aurora-punk"
      data-testid="section-aurora"
      className="relative z-20 w-full bg-[#09080A] text-[#F5F3EF] overflow-hidden"
    >
      {/* Pure 2D Underground Punk Backdrop (No Three.js / WebGL) */}
      <AuroraPunkBackdrop scrollProgress={auroraProgress} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-[#020402] to-transparent"
      />

      <div className="relative z-10">
        {showHeader && (
          <div className="min-h-[54svh] sm:min-h-[68svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pt-28 pb-14 sm:pb-20">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#C9A24D]">
                  {project.sourcePages} · Underground Xerox & Crochet Stage
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

        {/* PHASE 01 (p. 3) — Torn-Paper Wheatpaste Installation */}
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
            className="torn-paper-edge mx-auto w-[96vw] max-w-[1380px] h-14 sm:h-20 flex items-center justify-between px-6 sm:px-8"
            style={{
              background:
                'linear-gradient(90deg, rgba(123,0,0,0.52) 0%, rgba(201,162,77,0.22) 48%, rgba(124,17,184,0.34) 100%)',
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-[#F5F3EF]/85">
              Phase 01 Collage · Torn Ephemera
            </span>
            <span className="font-serif italic text-sm sm:text-lg text-[#F5F3EF]">
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
