import { Link } from '../router/RouterContext';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { PROJECTS } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowUpRight } from 'lucide-react';

export function WorkIndexPage() {
  const letoile = PROJECTS.letoile;
  const mahp = PROJECTS.mahp;
  const aurora = PROJECTS.aurora;

  const entry1Reveal = useScrollReveal({ threshold: 0.1 });
  const entry2Reveal = useScrollReveal({ threshold: 0.1 });
  const entry3Reveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-32">
      {/* Page Header */}
      <header className="border-b border-[#F5F3EF]/15 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-rule-draw">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
            CURATED ARCHIVE · THREE PRIMARY BODIES
          </span>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display uppercase tracking-tight text-[#F5F3EF] animate-title-settle">
            WORK
          </h1>
        </div>
        <div className="max-w-md space-y-3 text-xs sm:text-sm text-[#B8B5B1] font-mono leading-relaxed">
          <p>
            An asymmetric editorial sequence. Three distinct compositional rhythms across planetary mythologies, white collage interludes, and tactile deconstructions.
          </p>
          <div className="pt-2">
            <Link
              href="/material"
              className="editorial-link inline-flex items-center gap-1.5 text-[#F5F3EF] uppercase tracking-widest text-[11px]"
            >
              <span>Explore Material Library (24 mapped samples)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ENTRY 1: L'ETOILE MAHO (Dominant Planetary Stage) */}
      <article
        ref={entry1Reveal.ref}
        className={`border-b border-[#F5F3EF]/15 pb-24 transition-opacity duration-500 ${
          entry1Reveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#B8B5B1]">01 / 03</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#B8B5B1]">
                · {letoile.sourcePages}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-tight">
              <Link
                href={letoile.slug}
                className="hover:text-white/80 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] rounded-sm transition-colors"
              >
                {letoile.title}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed">
              Four planetary chapters exploring Mercury, Uranus, Pluto, and Mars. Architectural knitwear silhouettes, editorial framing, and mythic scale.
            </p>

            <div className="pt-2 flex flex-col space-y-1 text-xs font-mono text-[#B8B5B1]/80">
              <p>Models: Julien, Kyma & Chaïna</p>
              <p>Photographer: Sirine</p>
              <p>Clothing made by: Aurelia Mahop Di Toro</p>
            </div>

            <div className="pt-4">
              <Link
                href={letoile.slug}
                className="editorial-link inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#F5F3EF]"
              >
                <span>VIEW CHAPTER SEQUENCE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <Link href={letoile.slug} className="block group">
              <div className="relative mx-auto w-full max-w-[840px]" style={{ aspectRatio: `${PORTFOLIO_ASSETS.work.etoile.plate.width}/${PORTFOLIO_ASSETS.work.etoile.plate.height}` }}>
                <PortfolioImage asset={PORTFOLIO_ASSETS.work.etoile.plate} className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]" />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.etoile.models}
                  className="absolute bottom-0 left-1/2 z-10 h-[88%] w-auto max-w-[62%] -translate-x-1/2 object-contain object-bottom"
                  style={{ maxWidth: `${Math.min(520, PORTFOLIO_ASSETS.work.etoile.models.width * 2 / 3)}px` }}
                />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.etoile.illustration}
                  className="absolute bottom-0 left-0 z-20 hidden h-[80%] w-auto max-w-[28%] object-contain object-bottom min-[600px]:block"
                  style={{ maxWidth: `${Math.min(280, PORTFOLIO_ASSETS.work.etoile.illustration.width * 2 / 3)}px` }}
                />
              </div>
            </Link>
          </div>
        </div>
      </article>

      {/* ENTRY 2: MAH★P (The High-Contrast White Break) */}
      <article
        ref={entry2Reveal.ref}
        className={`border-b border-[#F5F3EF]/15 pb-24 transition-opacity duration-500 ${
          entry2Reveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-colors duration-300">
          <div className="lg:col-span-7">
            <Link href={mahp.slug} className="block group bg-white">
              <PortfolioImage asset={PORTFOLIO_ASSETS.work.mahp.composite} className="block h-auto w-full max-w-[1400px] transition-opacity group-hover:opacity-95" />
            </Link>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#B8B5B1]">02 / 03</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#B8B5B1]">
                · {mahp.sourcePages}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-tight text-[#F5F3EF]">
              <Link
                href={mahp.slug}
                className="hover:text-white/80 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] rounded-sm transition-colors"
              >
                {mahp.displayTitle}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed">
              A deliberate white interlude disrupting the nocturnal stage. Two large flattened collage compositions followed by sharp editorial photography.
            </p>

            <div className="pt-2 flex flex-col space-y-1 text-xs font-mono text-[#B8B5B1]/80">
              <p>Photographer: Avi Bellaiche</p>
              <p>Model: BAAN</p>
              <p className="text-[10px] text-[#B8B5B1]/60 italic">* Garment maker uncredited in source</p>
            </div>
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.work.mahp.photo}
              className="block h-auto w-full max-w-[720px] border border-[#F5F3EF]/10"
            />

            <div className="pt-4">
              <Link
                href={mahp.slug}
                className="editorial-link inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#F5F3EF]"
              >
                <span>VIEW MAH★P COMPOSITIONS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* ENTRY 3: AURORA DE LIAGE X AURO DA'PUNK */}
      <article
        ref={entry3Reveal.ref}
        className={`pb-12 transition-opacity duration-500 ${
          entry3Reveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#B8B5B1]">03 / 03</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#B8B5B1]">
                · {aurora.sourcePages}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display uppercase tracking-tight leading-tight">
              <Link
                href={aurora.slug}
                className="hover:text-white/80 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] rounded-sm transition-colors"
              >
                {aurora.displayTitle}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed">
              Transition from dense, torn-edge collage imagery to stark fashion photography. Sampled deep purple accents and sculptural dress construction.
            </p>

            <div className="pt-2 flex flex-col space-y-1 text-xs font-mono text-[#B8B5B1]/80">
              <p>Photographer: Raphaël Kassouri</p>
              <p>Stylist: @Playarabian</p>
              <p>Model: Brazy</p>
              <p>Dress by: Aurelia Mahop Di Toro</p>
            </div>

            <div className="pt-4">
              <Link
                href={aurora.slug}
                className="editorial-link inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#F5F3EF]"
              >
                <span>VIEW COLLAGE & PHOTOGRAPHY</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Link href={aurora.slug} className="block group">
              <div className="relative mx-auto w-full max-w-[700px]" style={{ aspectRatio: `${PORTFOLIO_ASSETS.work.aurora.plate.width}/${PORTFOLIO_ASSETS.work.aurora.plate.height}` }}>
                <PortfolioImage asset={PORTFOLIO_ASSETS.work.aurora.plate} className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]" />
                <PortfolioImage
                  asset={PORTFOLIO_ASSETS.work.aurora.model}
                  className="absolute bottom-0 right-[12%] z-10 h-[92%] w-auto max-w-[38%] object-contain object-bottom"
                  style={{ maxWidth: `${PORTFOLIO_ASSETS.work.aurora.model.width * 2 / 3}px` }}
                />
                <PortfolioImage asset={PORTFOLIO_ASSETS.work.aurora.illustration} className="absolute bottom-0 left-[8%] z-20 hidden h-[78%] w-auto max-w-[28%] object-contain object-bottom min-[600px]:block" />
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
