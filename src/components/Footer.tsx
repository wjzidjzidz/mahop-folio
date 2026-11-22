import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_INFO } from '../data/content';
import { Link } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useExhibitionStage } from '../context/ExhibitionStageContext';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { setEnvironmentState, planetJourneyRef } = useExhibitionStage();
  const [starSettled, setStarSettled] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStarSettled(true);
      return;
    }

    const onDockStatus = (e: Event) => {
      const docked = Boolean((e as CustomEvent<boolean>).detail);
      setStarSettled(docked);
    };

    window.addEventListener('mahop:star-dock-status', onDockStatus);
    return () => {
      window.removeEventListener('mahop:star-dock-status', onDockStatus);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const enforcePure2D = () => {
      if (!planetJourneyRef.current.active) {
        setEnvironmentState('ambient-archive', 1, 0, 0);
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom bottom',
        onEnter: enforcePure2D,
        onEnterBack: enforcePure2D,
        onToggle: (self) => {
          if (self.isActive) enforcePure2D();
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, [setEnvironmentState, planetJourneyRef]);

  return (
    <footer
      ref={footerRef}
      id="white-footer"
      data-testid="white-footer"
      className="relative z-20 w-full bg-white text-black"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-16 sm:pt-36 sm:pb-20">
        {/* Closing MAH★P Signature: The traveling star returns to complete MAH ★ P and locks permanently */}
        <div
          id="footer-star-dock"
          data-testid="footer-star-dock"
          data-settled={starSettled ? 'true' : 'false'}
          className="flex flex-col items-center justify-center text-center pt-4 pb-20 sm:pb-28"
        >
          <div className="mb-10 sm:mb-12 flex items-center justify-center">
            <BrandLogo
              size="contact"
              as="div"
              starSlotId="footer"
              starHidden={!reducedMotion && !starSettled}
              leftGlyphStyle={
                reducedMotion
                  ? undefined
                  : {
                      opacity: starSettled ? 1 : 0.42,
                      transform: starSettled ? 'translate3d(0, 0, 0)' : 'translate3d(-16px, 0, 0)',
                      transition:
                        'opacity 680ms cubic-bezier(0.16, 1, 0.3, 1), transform 680ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }
              }
              rightGlyphStyle={
                reducedMotion
                  ? undefined
                  : {
                      opacity: starSettled ? 1 : 0.42,
                      transform: starSettled ? 'translate3d(0, 0, 0)' : 'translate3d(16px, 0, 0)',
                      transition:
                        'opacity 680ms cubic-bezier(0.16, 1, 0.3, 1), transform 680ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }
              }
              className="text-black"
            />
          </div>

          <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.88] text-black max-w-5xl">
            THE JOURNEY ENDS HERE.
            <span className="block mt-2">THE CREATION CONTINUES.</span>
          </h2>
          <p className="mt-6 font-serif italic text-xl sm:text-2xl text-neutral-700">
            Aurelia Mahop Di Toro — Nocturnal Textile Theatre
          </p>
        </div>

        {/* Open Unboxed Contacts & Social Handles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 pb-16 sm:pb-20">
          <div className="md:col-span-5 space-y-2">
            <span className="text-[10px] tracking-[0.28em] text-neutral-500 uppercase block font-mono">
              Direct Dialogue
            </span>
            <p className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-black">
              Aurelia Mahop Di Toro
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed font-sans pt-1">
              Textile commissions, fashion collaborations, and exhibition enquiries.
            </p>
          </div>

          <div className="md:col-span-4 space-y-5">
            <div>
              <span className="text-[10px] tracking-[0.28em] text-neutral-500 uppercase block mb-1 font-mono">
                Email
              </span>
              <a
                href={CONTACT_INFO.emailHref}
                className="editorial-link min-h-[44px] text-base sm:text-lg font-mono text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            <div>
              <span className="text-[10px] tracking-[0.28em] text-neutral-500 uppercase block mb-1 font-mono">
                Telephone
              </span>
              <a
                href={CONTACT_INFO.phoneHref}
                className="editorial-link min-h-[44px] text-base sm:text-lg font-mono text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] tracking-[0.28em] text-neutral-500 uppercase block font-mono">
              Social
            </span>
            <div className="space-y-2 text-sm font-mono text-black">
              <div className="flex items-center justify-between gap-4 min-h-[44px]">
                <span className="text-xs text-neutral-500">Instagram</span>
                <a
                  href={CONTACT_INFO.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link min-h-[44px] text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.instagramHandle}
                </a>
              </div>
              <div className="flex items-center justify-between gap-4 min-h-[44px]">
                <span className="text-xs text-neutral-500">TikTok</span>
                <a
                  href={CONTACT_INFO.tiktokHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link min-h-[44px] text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.tiktokHandle}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Colophon — clean editorial text without any second star */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-neutral-600">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg sm:text-xl uppercase tracking-tight text-black">
              MAHOP
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500">
              Nocturnal Textile Theatre
            </span>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 sm:gap-7 text-[11px] tracking-[0.24em] uppercase font-mono"
          >
            <Link
              href="/work"
              className="editorial-link min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              Work
            </Link>
            <Link
              href="/material"
              className="editorial-link min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              Material
            </Link>
            <Link
              href="/about"
              className="editorial-link min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
