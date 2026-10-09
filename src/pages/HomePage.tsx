import { Link } from '../router/RouterContext';
import { BrandLogo } from '../components/BrandLogo';
import { PROJECTS } from '../data/content';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowUpRight } from 'lucide-react';

export function HomePage() {
  const letoile = PROJECTS.letoile;
  const mahp = PROJECTS.mahp;
  const previewSwatches = PORTFOLIO_ASSETS.home.materials;

  const castReveal = useScrollReveal({ threshold: 0.1 });
  const letoileReveal = useScrollReveal({ threshold: 0.1 });
  const mahpReveal = useScrollReveal({ threshold: 0.1 });
  const materialReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="relative w-full overflow-x-clip">
      {/* SECTION 1: Opening Stage / Wordmark */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-12 pb-16">
        {/* Top Kicker / Stage Setting with M02 Rule Draw */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F3EF]/15 pb-6 animate-rule-draw">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F5F3EF]" aria-hidden="true" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8B5B1]">
              STAGE 01 · NOCTURNAL TEXTILE THEATRE
            </span>
          </div>
          <span className="text-[11px] font-mono tracking-widest text-[#B8B5B1]">
            A STAGE, NOT A CATALOGUE
          </span>
        </div>

        {/* Oversized Official Typographic Object with M01 Wordmark Reveal */}
        <div className="my-auto py-12">
          <div className="relative">
            <BrandLogo
              size="hero"
              as="h1"
              className="text-[#F5F3EF] animate-wordmark-reveal"
            />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mt-4 border-t border-[#F5F3EF]/15 animate-rule-draw">
              <p className="text-xs sm:text-sm text-[#B8B5B1] font-mono tracking-wider max-w-md">
                Ink on black paper. Revealing fashion, textile architecture, photography, and collage installations.
              </p>
              <div className="flex items-center gap-6 text-xs tracking-widest">
                <Link
                  href="/work"
                  className="editorial-link group inline-flex items-center gap-2 text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
                >
                  <span>EXPLORE STAGE WORK</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#F5F3EF]/15 pt-6 animate-rule-draw">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block">
              STAGE 02 · CAST & SILHOUETTES
            </span>
            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed max-w-xl">
              Fashion illustrations and textile studies enter the black stage as a deliberate cast, held in their original proportions.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#B8B5B1] tracking-widest">COVER · SOURCE PAGE 01</span>
        </div>
      </section>

      {/* SECTION 2: Artistic Cast / Visual Introduction with M05 Cut-out Drift */}
      <section
        ref={castReveal.ref}
        className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F3EF]/15 transition-opacity duration-500 ${
          castReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
              STAGE 02 · CAST & SILHOUETTES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight">
              Artistic Cast
            </h2>
          </div>
          <p className="text-xs text-[#B8B5B1] max-w-md font-mono">
            Layered placement of genuine cut-out figures. Transparency and original silhouette preserved.
          </p>
        </div>

        <div className="relative mx-auto flex min-h-[54svh] max-w-6xl items-end justify-center overflow-hidden sm:min-h-[68svh]">
          <div className="pointer-events-none absolute bottom-0 left-0 z-0 flex items-end">
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.home.textiles[0]}
              className="w-[94px] object-contain sm:w-[180px] lg:w-[240px]"
              style={{ maxWidth: `${Math.min(340, PORTFOLIO_ASSETS.home.textiles[0].width * 2 / 3)}px` }}
              aria-hidden="true"
            />
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.home.textiles[1]}
              className="-ml-8 w-[100px] object-contain sm:-ml-14 sm:w-[190px] lg:w-[260px]"
              style={{ maxWidth: `${Math.min(400, PORTFOLIO_ASSETS.home.textiles[1].width * 2 / 3)}px` }}
              aria-hidden="true"
            />
          </div>
          <div className="relative z-10 flex h-full w-full items-end justify-center">
            {PORTFOLIO_ASSETS.home.cast.map((asset, index) => {
              const sizes = ['50svh', '60svh', '64svh', '72svh'];
              const widths = ['24%', '28%', '31%', '35%'];
              return (
                <PortfolioImage
                  key={asset.slot}
                  asset={asset}
                  eager
                  className={`${index ? '-ml-[8%] sm:-ml-[5%]' : ''} h-auto w-auto max-w-[31%] object-contain object-bottom sm:max-w-[29%] ${
                    index === 0 ? 'z-10' : index === 1 ? 'z-20' : index === 2 ? 'z-30' : 'z-40'
                  }`}
                  style={{ maxHeight: sizes[index], maxWidth: widths[index] }}
                />
              );
            })}
          </div>
        </div>
        <p className="mt-5 text-[10px] font-mono uppercase tracking-widest text-[#B8B5B1]">
          Four cover illustrations · transparency preserved · no figure identified as the artist
        </p>
      </section>

      {/* SECTION 3: Featured L'ETOILE MAHO */}
      <section
        ref={letoileReveal.ref}
        className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F3EF]/15 transition-opacity duration-500 ${
          letoileReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B1111]" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1]">
                PROJECT 01 · FOUR PLANETARY CHAPTERS
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-tight">
              {letoile.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed font-sans">
              A sequence traversing Mercury, Uranus, Pluto, and Mars. Distinct color atmospheres, structural knits, and editorial photography.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-mono text-[#F5F3EF]/80">
              <span className="px-2 py-1 border border-[#7B7373]/40 bg-[#7B7373]/10">Mercury</span>
              <span className="px-2 py-1 border border-[#95BFBC]/40 bg-[#95BFBC]/10">Uranus</span>
              <span className="px-2 py-1 border border-[#454644]/40 bg-[#454644]/10">Pluto</span>
              <span className="px-2 py-1 border border-[#E87F3E]/40 bg-[#E87F3E]/10">Mars</span>
            </div>

            <div className="pt-4">
              <Link
                href={letoile.slug}
                className="editorial-link group inline-flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-[#F5F3EF]"
              >
                <span>ENTER L'ETOILE MAHO CHAPTERS</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Link href={letoile.slug} className="group block">
              <div className="relative mx-auto w-full max-w-[780px]" style={{ aspectRatio: `${PORTFOLIO_ASSETS.home.etoile.plate.width}/${PORTFOLIO_ASSETS.home.etoile.plate.height}` }}>
                <PortfolioImage asset={PORTFOLIO_ASSETS.home.etoile.plate} className="absolute inset-0 h-full w-full object-contain" />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.home.etoile.models}
                  className="absolute bottom-0 left-1/2 z-10 h-[88%] w-auto max-w-[68%] -translate-x-1/2 object-contain object-bottom"
                  style={{ maxWidth: `${Math.min(520, PORTFOLIO_ASSETS.home.etoile.models.width * 2 / 3)}px` }}
                />
                {PORTFOLIO_ASSETS.home.etoile.illustrations.map((asset, index) => (
                  <PortfolioImage
                    key={asset.slot}
                    asset={asset}
                    className={`absolute bottom-0 z-20 hidden h-[80%] w-auto max-w-[26%] object-contain object-bottom min-[600px]:block ${
                      index === 0 ? 'left-0' : 'right-0'
                    }`}
                  />
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: Featured MAH★P — The White Stage Interlude */}
      <section
        ref={mahpReveal.ref}
        className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F3EF]/15 transition-opacity duration-500 ${
          mahpReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
              PROJECT 02 · PURPOSEFUL WHITE BREAK
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-tight">
              {mahp.displayTitle}
            </h2>
          </div>
          <p className="text-xs text-[#B8B5B1] max-w-md font-mono">
            A high-contrast white collage field breaking the nocturnal environment. Preserved intact without dark recoloring.
          </p>
        </div>

        {/* White Stage Container */}
        <div className="overflow-hidden bg-white transition-colors duration-300">
          <Link href={mahp.slug} className="block group">
            <PortfolioImage asset={PORTFOLIO_ASSETS.home.mahp} className="block h-auto w-full max-w-[1400px] mx-auto" />
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black px-4 py-4 text-xs text-[#B8B5B1]">
            <span className="font-mono text-[11px]">Flattened compositions · source pages 20–21 · p.22 photography credits on project page</span>
            <Link
              href={mahp.slug}
              className="editorial-link inline-flex items-center gap-1.5 text-[#F5F3EF] uppercase tracking-widest text-[11px] font-mono"
            >
              <span>View MAH★P Sequence</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: Material Library Preview */}
      <section
        ref={materialReveal.ref}
        className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#F5F3EF]/15 transition-opacity duration-500 ${
          materialReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
              TEXTILE ARCHIVE · 8 SELECTED SAMPLES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight">
              Material Library Preview
            </h2>
          </div>
          <Link
            href="/material"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5F3EF]"
          >
            <span>Explore 24 Mapped Samples</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {previewSwatches.map((item) => (
            <Link key={item.slot} href="/material" className="group flex w-[55vw] shrink-0 snap-start flex-col items-center justify-end gap-3 border-b border-[#F5F3EF]/10 pb-4 sm:w-[340px]">
              <PortfolioImage
                asset={item}
                className="h-[210px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:-translate-y-1"
                style={{ maxWidth: `min(100%, ${Math.min(340, item.width * 2 / 3)}px)` }}
              />
              <span className="sr-only">Explore the Material Library</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
