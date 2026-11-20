import { Link } from '../../router/RouterContext';
import { PortfolioImage } from '../PortfolioImage';
import { PORTFOLIO_ASSETS } from '../../data/portfolioAssets';
import { CONTACT_INFO } from '../../data/content';
import { computeAboutRevealState, type AboutRevealState } from '../../utils/journeyLogic';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AboutSectionProps {
  revealState?: AboutRevealState;
  immediateReveal?: boolean;
  embeddedInChamber?: boolean;
}

/**
 * Final About Composition:
 * - Centered ABOUT display heading positioned clearly above
 * - Authentic central illustration centered on pure black stage
 * - Verified factual identity and direct dialogue beside the illustration
 */
export function AboutSection({
  revealState,
  immediateReveal = false,
  embeddedInChamber = false,
}: AboutSectionProps) {
  const reducedMotion = useReducedMotion();
  const state =
    revealState || computeAboutRevealState(1, reducedMotion, immediateReveal || true);

  return (
    <section
      id="about-stage"
      data-testid="section-about"
      data-about-revealed={state.isRevealed ? 'true' : 'false'}
      className={
        embeddedInChamber
          ? 'w-full h-full flex flex-col justify-center px-5 sm:px-10 lg:px-14 pointer-events-auto'
          : 'w-full bg-black text-[#F5F3EF] pt-28 pb-28 sm:pt-36 sm:pb-36 px-5 sm:px-10 lg:px-14'
      }
      style={{
        pointerEvents: state.textOpacity > 0.12 || immediateReveal ? 'auto' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Heading Centered Above */}
        <div
          className="text-center mb-6 sm:mb-10 transition-opacity duration-300"
          style={{
            opacity: state.headingOpacity,
            transform: `translate3d(0, ${state.translateY * 0.6}px, 0)`,
          }}
        >
          <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-[#B8B5B1] block mb-2">
            Aurelia Mahop Di Toro
          </span>
          <h2 className="font-display uppercase tracking-tighter text-6xl sm:text-8xl lg:text-9xl leading-[0.82] text-[#F5F3EF]">
            ABOUT
          </h2>
        </div>

        {/* Centered Authentic Illustration + Verified Text Beside */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center"
          style={{
            transform: `translate3d(0, ${state.translateY}px, 0)`,
          }}
        >
          {/* Left Flank Supporting Cover Illustration */}
          <div
            className="hidden md:flex md:col-span-3 justify-end items-end transition-opacity duration-300"
            style={{ opacity: state.illustrationOpacity * 0.78 }}
          >
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.about.supporting}
              className="w-auto max-h-[34vh] lg:max-h-[42vh] object-contain"
            />
          </div>

          {/* Centered Iconic Illustration */}
          <div
            className="md:col-span-5 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: state.illustrationOpacity,
              transform: `scale(${state.illustrationScale})`,
            }}
          >
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.about.primary}
              className="w-auto max-h-[40vh] md:max-h-[54vh] lg:max-h-[60vh] object-contain"
              eager
            />
          </div>

          {/* Verified Factual Text Beside the Illustration */}
          <div
            className="md:col-span-4 space-y-5 text-left transition-opacity duration-300"
            style={{ opacity: state.textOpacity }}
          >
            <p className="font-serif italic text-2xl sm:text-3xl text-[#F5F3EF] leading-snug">
              Aurelia Mahop Di Toro
            </p>
            <p className="text-sm text-[#D6D3CE] leading-relaxed font-sans">
              Fashion, textile architecture, collage, and photographic direction across MAH★P — Nocturnal Textile Theatre.
            </p>

            <div className="pt-2 space-y-1.5 font-mono text-xs text-[#B8B5B1]">
              <p>
                <a
                  href={CONTACT_INFO.emailHref}
                  className="editorial-link text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="editorial-link text-[#F5F3EF]/85 hover:text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.phone}
                </a>
              </p>
              <p className="pt-1 flex items-center gap-5 text-[11px] uppercase tracking-[0.2em]">
                <a
                  href={CONTACT_INFO.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link hover:text-[#F5F3EF]"
                >
                  IG {CONTACT_INFO.instagramHandle}
                </a>
                <a
                  href={CONTACT_INFO.tiktokHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link hover:text-[#F5F3EF]"
                >
                  TT {CONTACT_INFO.tiktokHandle}
                </a>
              </p>
            </div>

            {!embeddedInChamber && (
              <div className="pt-4 flex flex-wrap gap-6 font-mono text-[11px] tracking-[0.24em] uppercase">
                <Link
                  href="/work"
                  className="editorial-link text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
                >
                  Selected Work
                </Link>
                <Link
                  href="/material"
                  className="editorial-link text-[#B8B5B1] hover:text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
                >
                  Material Table
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
