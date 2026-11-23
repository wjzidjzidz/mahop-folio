import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioImage } from '../PortfolioImage';
import { PORTFOLIO_ASSETS } from '../../data/portfolioAssets';
import { PROJECTS } from '../../data/content';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import { WhiteCollageBackdrop } from '../environments/WhiteCollageBackdrop';
import { BotanicalGroundBackdrop } from '../environments/BotanicalGroundBackdrop';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface MahStarPSectionProps {
  showHeader?: boolean;
}

export function MahStarPSection({ showHeader = true }: MahStarPSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const actOneRef = useRef<HTMLDivElement>(null);
  const actTwoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { setEnvironmentState } = useExhibitionStage();
  const project = PROJECTS.mahp;

  const [whiteProgress, setWhiteProgress] = useState(0);
  const [natureProgress, setNatureProgress] = useState(0);

  useEffect(() => {
    const actOne = actOneRef.current;
    const actTwo = actTwoRef.current;
    if (!actOne || !actTwo) return;

    const ctx = gsap.context(() => {
      // ACT I: Pure 2D Fluorescent Green / Black / White stage — pause & hide WebGL
      const setQuantizedWhite = (p: number) => {
        const q = Number(p.toFixed(3));
        setWhiteProgress((prev) => (Math.abs(prev - q) >= 0.004 || q === 0 || q === 1 ? q : prev));
      };
      ScrollTrigger.create({
        trigger: actOne,
        start: 'top 62%',
        end: 'bottom 38%',
        scrub: true,
        onEnter: () => {
          setEnvironmentState('white-collage', 0.05, 0, 0);
        },
        onEnterBack: () => {
          setEnvironmentState('white-collage', 0.92, 0, 0);
        },
        onToggle: (self) => {
          if (self.isActive) {
            setEnvironmentState('white-collage', self.progress, 0, 0);
          }
        },
        onUpdate: (self) => {
          setQuantizedWhite(self.progress);
          if (self.isActive) {
            setEnvironmentState('white-collage', self.progress, 0, 0);
          }
        },
      });

      if (!reducedMotion) {
        gsap.fromTo(
          '[data-mahp-white-plate="first"]',
          { y: 36, scale: 0.97 },
          {
            y: -18,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-mahp-act="white"]',
              start: 'top 80%',
              end: 'center center',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          '[data-mahp-white-plate="second"]',
          { y: 48, scale: 0.96 },
          {
            y: -12,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-mahp-white-plate="second"]',
              start: 'top 88%',
              end: 'center center',
              scrub: true,
            },
          }
        );
      }

      // ACT II: Pure 2D Deep-Black & Fluorescent-Green Botanical Stage (Zero WebGL)
      const emitNature = (progress: number) => {
        const q = Number(progress.toFixed(3));
        setNatureProgress((prev) => (Math.abs(prev - q) >= 0.004 || q === 0 || q === 1 ? q : prev));
        setEnvironmentState('editorial-nature', progress, 0, 0);
      };

      ScrollTrigger.create({
        trigger: actTwo,
        start: 'top 72%',
        end: 'bottom 28%',
        scrub: true,
        onEnter: () => emitNature(0.05),
        onEnterBack: () => emitNature(0.92),
        onToggle: (self) => {
          if (self.isActive) emitNature(self.progress);
        },
        onUpdate: (self) => {
          const q = Number(self.progress.toFixed(3));
          setNatureProgress((prev) => (Math.abs(prev - q) >= 0.004 || q === 0 || q === 1 ? q : prev));
          if (self.isActive) emitNature(self.progress);
        },
      });

      if (!reducedMotion) {
        gsap.fromTo(
          '[data-mahp-photo="hero"]',
          { xPercent: -3, scale: 1.03 },
          {
            xPercent: 3,
            scale: 0.98,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-mahp-photo="hero"]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          '[data-mahp-photo="seated"]',
          { y: 54, xPercent: 4 },
          {
            y: -26,
            xPercent: -2,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-mahp-photo="seated"]',
              start: 'top bottom',
              end: 'bottom top',
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
      id="mah-star-p"
      data-testid="section-mah-star-p"
      className="relative z-10 w-full"
    >
      {/* ACT I — PURE 2D FLUORESCENT GREEN / BLACK / WHITE COLLAGE INTERLUDE (ZERO THREE.JS) */}
      <div
        ref={actOneRef}
        data-mahp-act="white"
        className="relative z-20 w-full bg-white text-black pt-28 pb-24 sm:pt-36 sm:pb-32 lg:pt-40 lg:pb-40 px-4 sm:px-8 lg:px-14 overflow-hidden"
      >
        {/* Soft nocturnal atmospheric bridge easing Mars into the white paper threshold */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 sm:h-28 z-20 bg-gradient-to-b from-black/22 via-black/6 to-transparent"
        />
        <WhiteCollageBackdrop scrollProgress={whiteProgress} />

        <div className="relative z-10 max-w-[1440px] mx-auto">
          {showHeader && (
            <div className="mb-16 sm:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/65 block mb-3">
                  {project.sourcePages} · White Collage Interlude
                </span>
                <h2 className="font-display uppercase tracking-tighter text-[18vw] sm:text-[13vw] lg:text-[10vw] leading-[0.82] text-black">
                  {project.displayTitle}
                </h2>
              </div>

              <div className="space-y-1 text-left lg:text-right">
                <p className="font-serif italic text-lg sm:text-xl text-neutral-800">
                  Photography {project.credits[0].name} · Model {project.credits[1].name}
                </p>
                <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-600">
                  {project.creditNote}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-16 sm:space-y-24 lg:space-y-28">
            <div data-mahp-white-plate="first" className="mx-auto max-w-[1340px]">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.interlude[0]}
                className="block w-full h-auto"
              />
            </div>

            <div data-mahp-white-plate="second" className="mx-auto max-w-[1340px]">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.interlude[1]}
                className="block w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ACT II — PURE 2D NOCTURNAL BOTANICAL GROUND & TWO REAL PAGE-22 PHOTOGRAPHS (ZERO THREE.JS) */}
      <div
        ref={actTwoRef}
        id="mah-editorial-nature"
        data-mahp-act="nature"
        data-render-mode="pure-2d"
        className="relative z-10 w-full bg-[#020402] text-[#F5F3EF] scroll-mt-20 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 z-20 bg-gradient-to-b from-white/18 to-transparent"
        />
        <BotanicalGroundBackdrop scrollProgress={natureProgress} />

        <div className="relative z-10">
          <div className="min-h-[52svh] sm:min-h-[66svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#39FF14]/85 block mb-2">
                  Act II · Botanical Ground
                </span>
                <h3 className="font-display uppercase tracking-tighter text-5xl sm:text-7xl lg:text-8xl leading-[0.92] text-[#F5F3EF]">
                  EDITORIAL STUDIO
                  <span className="block">PHOTOGRAPHY</span>
                </h3>
              </div>

              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.logo}
                className="w-28 sm:w-36 h-auto object-contain opacity-90"
              />
            </div>
          </div>

          {/* ONLY the Two Verified Page-22 Photographs — Monumental Borderless Scale */}
          <div className="space-y-16 sm:space-y-28 px-4 sm:px-8 lg:px-14 pb-28 sm:pb-40 max-w-[1440px] mx-auto overflow-x-clip">
            <div data-mahp-photo="hero" className="w-full max-w-[1320px]">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.hero}
                className="block w-full h-auto object-cover"
              />
              <p className="mt-4 font-serif italic text-sm sm:text-base text-[#C4DEC6]/90">
                {project.credits[1].name} — Photographed by {project.credits[0].name}
              </p>
            </div>

            <div data-mahp-photo="seated" className="w-full sm:w-[78%] max-w-[960px] ml-auto">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.seated}
                className="block w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
