import { useEffect, useRef, useState } from 'react';
import { CONTACT_INFO } from '../data/content';
import { Link } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { BrandStar } from './BrandStar';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [starSettled, setStarSettled] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStarSettled(true);
      return;
    }

    const el = footerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setStarSettled(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setStarSettled(entries[0].isIntersecting);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <footer
      ref={footerRef}
      data-testid="white-footer"
      className="relative w-full bg-white text-black"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-16 sm:pt-32 sm:pb-20">
        {/* Centered Star Finale */}
        <div
          id="footer-star-dock"
          data-testid="footer-star-dock"
          data-settled={starSettled ? 'true' : 'false'}
          className="flex flex-col items-center justify-center text-center pb-20 sm:pb-28"
        >
          <div
            className="mb-10 flex h-16 w-16 items-center justify-center transition-all duration-700 ease-out"
            style={{
              opacity: starSettled ? 1 : 0.28,
              transform: starSettled ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-12px)',
            }}
            aria-hidden="true"
          >
            <BrandStar className="w-11 h-11 text-black" />
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
                className="editorial-link text-base sm:text-lg font-mono text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
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
                className="editorial-link text-base sm:text-lg font-mono text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] tracking-[0.28em] text-neutral-500 uppercase block font-mono">
              Social
            </span>
            <div className="space-y-3 text-sm font-mono text-black">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-neutral-500">Instagram</span>
                <a
                  href={CONTACT_INFO.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.instagramHandle}
                </a>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-neutral-500">TikTok</span>
                <a
                  href={CONTACT_INFO.tiktokHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
                >
                  {CONTACT_INFO.tiktokHandle}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Colophon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-neutral-600">
          <div className="flex items-baseline gap-3">
            <BrandLogo size="sm" className="text-black" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500">
              Nocturnal Textile Theatre
            </span>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-7 text-[11px] tracking-[0.24em] uppercase font-mono"
          >
            <Link
              href="/work"
              className="editorial-link text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              Work
            </Link>
            <Link
              href="/material"
              className="editorial-link text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              Material
            </Link>
            <Link
              href="/about"
              className="editorial-link text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
