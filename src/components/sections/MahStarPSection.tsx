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

interface MahStarPSectionProps {
  standaloneStage?: boolean;
  showHeader?: boolean;
  onEnvironmentChange?: (sceneId: EnvironmentSceneId, progress: number) => void;
}

export function MahStarPSection({
  standaloneStage = false,
  showHeader = true,
  onEnvironmentChange,
}: MahStarPSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const actTwoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const project = PROJECTS.mahp;

  const [natureProgress, setNatureProgress] = useState(0);
  const metrics = computeChapterStageMetrics(natureProgress, reducedMotion);

  useEffect(() => {
    const actTwo = actTwoRef.current;
    if (!actTwo) return;

    const ctx = gsap.context(() => {
      if (!reducedMotion) {
        // Gentle scale + vertical breath on the two massive white collage plates
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

      ScrollTrigger.create({
        trigger: actTwo,
        start: 'top 62%',
        end: 'bottom 38%',
        scrub: true,
        onEnter: () => {
          onEnvironmentChange?.('editorial-nature', 0.05);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['editorial-nature'].accentHex,
            })
          );
        },
        onEnterBack: () => {
          onEnvironmentChange?.('editorial-nature', 0.92);
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS['editorial-nature'].accentHex,
            })
          );
        },
        onToggle: (self) => {
          if (self.isActive) {
            onEnvironmentChange?.('editorial-nature', self.progress);
            window.dispatchEvent(
              new CustomEvent('mahop:scene-accent', {
                detail: PROJECT_ENVIRONMENTS['editorial-nature'].accentHex,
              })
            );
          }
        },
        onUpdate: (self) => {
          setNatureProgress(self.progress);
          if (self.isActive) {
            onEnvironmentChange?.('editorial-nature', self.progress);
          }
        },
      });

      if (!reducedMotion) {
        // Horizontal camera sweep across wide trousers close-up
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
  }, [reducedMotion, onEnvironmentChange]);

  return (
    <section
      ref={sectionRef}
      id="mah-star-p"
      data-testid="section-mah-star-p"
      className="relative w-full"
    >
      {/* ACT I — EDGE-TO-EDGE LUMINOUS WHITE COLLAGE VOID */}
      <div
        data-mahp-act="white"
        className="relative z-20 w-full bg-white text-black py-24 sm:py-32 lg:py-40 px-4 sm:px-8 lg:px-14"
      >
        <div className="max-w-[1440px] mx-auto">
          {showHeader && (
            <div className="mb-16 sm:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500 block mb-3">
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
                <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-500">
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

      {/* ACT II — BOTANICAL GREEN FIELD & TWO REAL PAGE-22 PHOTOGRAPHS */}
      <div
        ref={actTwoRef}
        data-mahp-act="nature"
        className="relative w-full text-[#F5F3EF]"
      >
        {standaloneStage && (
          <div className="sticky top-0 h-[100svh] w-full pointer-events-none z-0 overflow-hidden">
            <ProjectEnvironmentHost
              sceneId="editorial-nature"
              opacity={metrics.sceneOpacity}
              scrollProgress={natureProgress}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: `rgba(7,12,6,${metrics.backdropDim * 0.45})` }}
            />
          </div>
        )}

        <div className={standaloneStage ? 'relative z-10 -mt-[100svh]' : 'relative z-10'}>
          {/* Atmospheric Emerald Opening Window */}
          <div className="min-h-[52svh] sm:min-h-[66svh] flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#93BA96] block mb-2">
                  Act II · Botanical Ground
                </span>
                <h3 className="font-display uppercase tracking-tighter text-5xl sm:text-7xl lg:text-8xl leading-[0.86] text-[#F5F3EF]">
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
              <p className="mt-4 font-serif italic text-sm sm:text-base text-[#C4DEC6]/85">
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
