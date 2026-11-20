import { Link } from '../router/RouterContext';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { PROJECTS } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

export function WorkIndexPage() {
  const letoile = PROJECTS.letoile;
  const mahp = PROJECTS.mahp;
  const aurora = PROJECTS.aurora;

  return (
    <div className="w-full bg-black text-[#F5F3EF] pt-28 sm:pt-36">
      {/* Unboxed Gallery Opening */}
      <header className="px-5 sm:px-10 lg:px-16 pb-16 sm:pb-24 max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-[#B8B5B1] block mb-3">
            Curated Exhibition Worlds
          </span>
          <h1 className="font-display uppercase tracking-tighter text-[20vw] sm:text-[14vw] lg:text-[11vw] leading-[0.82] text-[#F5F3EF]">
            WORK
          </h1>
        </div>

        <div className="max-w-md space-y-4">
          <p className="font-serif italic text-xl sm:text-2xl text-[#F5F3EF]/88 leading-snug">
            Three complete creative universes across planetary fashion, luminous collage, and underground photography.
          </p>
          <Link
            href="/material"
            className="editorial-link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] uppercase text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <span>Explore Material Table (24 Swatches)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* WORLD 01 — L'ETOILE MAHO */}
      <article
        className="relative w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 72% 45%, rgba(149,191,188,0.16) 0%, rgba(232,127,62,0.08) 38%, rgba(0,0,0,1) 76%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#95BFBC] block">
              World I · {letoile.sourcePages}
            </span>
            <h2 className="font-display uppercase tracking-tighter text-5xl sm:text-7xl lg:text-8xl leading-[0.86]">
              <Link
                href={letoile.slug}
                className="hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
              >
                {letoile.title}
              </Link>
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#D6D3CE]">
              Mercury · Uranus · Pluto · Mars
            </p>
            <div className="space-y-1 font-mono text-xs text-[#B8B5B1]">
              {letoile.credits.map((c) => (
                <p key={c.role}>
                  {c.role}: <span className="text-[#F5F3EF]">{c.name}</span>
                </p>
              ))}
            </div>
            <div className="pt-2">
              <Link
                href={letoile.slug}
                className="editorial-link inline-flex items-center gap-2 font-mono text-xs tracking-[0.26em] uppercase text-[#F5F3EF]"
              >
                <span>Enter L'ETOILE MAHO</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <Link href={letoile.slug} className="block group">
              <div
                className="relative mx-auto w-full max-w-[820px]"
                style={{
                  aspectRatio: `${PORTFOLIO_ASSETS.work.etoile.plate.width}/${PORTFOLIO_ASSETS.work.etoile.plate.height}`,
                }}
              >
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.etoile.plate}
                  className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.etoile.models}
                  className="absolute bottom-0 left-1/2 z-10 h-[90%] w-auto max-w-[60%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)]"
                />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.etoile.illustration}
                  className="hidden sm:block absolute bottom-0 left-0 z-20 h-[78%] w-auto max-w-[26%] object-contain object-bottom"
                />
              </div>
            </Link>
          </div>
        </div>
      </article>

      {/* WORLD 02 — MAH★P (White Collage & Emerald Botanical Contrast) */}
      <article className="relative w-full bg-white text-black py-20 sm:py-28 px-5 sm:px-10 lg:px-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Link href={mahp.slug} className="block group">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.work.mahp.composite}
                className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Link>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#345727] block">
              World II · {mahp.sourcePages}
            </span>
            <h2 className="font-display uppercase tracking-tighter text-6xl sm:text-8xl leading-[0.84] text-black">
              <Link
                href={mahp.slug}
                className="hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-black"
              >
                {mahp.displayTitle}
              </Link>
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-neutral-700">
              White Collage Interlude & Botanical Editorial Studio
            </p>
            <div className="space-y-1 font-mono text-xs text-neutral-600">
              {mahp.credits.map((c) => (
                <p key={c.role}>
                  {c.role}: <span className="text-black">{c.name}</span>
                </p>
              ))}
            </div>
            <Link href={mahp.slug} className="block pt-2">
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.work.mahp.photo}
                className="w-full h-auto object-cover"
              />
            </Link>
            <div className="pt-2">
              <Link
                href={mahp.slug}
                className="editorial-link inline-flex items-center gap-2 font-mono text-xs tracking-[0.26em] uppercase text-black"
              >
                <span>Enter MAH★P</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* WORLD 03 — AURORA DE LIAGE X AURO DA'PUNK */}
      <article
        className="relative w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 28% 50%, rgba(124,17,184,0.22) 0%, rgba(123,0,0,0.16) 40%, rgba(0,0,0,1) 78%)',
        }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C48CE9] block">
              World III · {aurora.sourcePages}
            </span>
            <h2 className="font-display uppercase tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[0.88]">
              <Link
                href={aurora.slug}
                className="hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
              >
                {aurora.displayTitle}
              </Link>
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#D6D3CE]">
              Wheatpaste Torn Collage → Brazy Studio Photography
            </p>
            <div className="space-y-1 font-mono text-xs text-[#B8B5B1]">
              {aurora.credits.map((c) => (
                <p key={c.role}>
                  {c.role}: <span className="text-[#F5F3EF]">{c.name}</span>
                </p>
              ))}
            </div>
            <div className="pt-2">
              <Link
                href={aurora.slug}
                className="editorial-link inline-flex items-center gap-2 font-mono text-xs tracking-[0.26em] uppercase text-[#F5F3EF]"
              >
                <span>Enter AURORA</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Link href={aurora.slug} className="block group">
              <div
                className="relative mx-auto w-full max-w-[740px]"
                style={{
                  aspectRatio: `${PORTFOLIO_ASSETS.work.aurora.plate.width}/${PORTFOLIO_ASSETS.work.aurora.plate.height}`,
                }}
              >
                <div className="torn-paper-edge absolute inset-0 overflow-hidden">
                  <PortfolioImage
                    asset={PORTFOLIO_ASSETS.work.aurora.plate}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.aurora.model}
                  className="absolute bottom-0 right-[10%] z-10 h-[92%] w-auto max-w-[38%] object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)]"
                />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.aurora.illustration}
                  className="hidden sm:block absolute bottom-0 left-[6%] z-20 h-[78%] w-auto max-w-[26%] object-contain object-bottom"
                />
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
