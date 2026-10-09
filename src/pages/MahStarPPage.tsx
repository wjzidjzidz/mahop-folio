import { Link } from '../router/RouterContext';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { PROJECTS } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function MahStarPPage() {
  const project = PROJECTS.mahp;
  const collage1Reveal = useScrollReveal({ threshold: 0.1 });
  const photoReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="w-full">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          href="/work"
          className="editorial-link group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#B8B5B1] hover:text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO WORK ARCHIVE</span>
        </Link>
      </div>

      {/* Project Opening Header with M04 Title Settle */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 border-b border-[#F5F3EF]/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-3 animate-rule-draw">
              WHITE COLLAGE INTERLUDE · {project.sourcePages}
            </span>
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display uppercase tracking-tight text-[#F5F3EF] animate-title-settle">
              {project.displayTitle}
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs font-mono text-[#B8B5B1] border-l border-[#F5F3EF]/15 pl-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F3EF]">Verified Credits (p. 22)</span>
              {project.credits.map((c, i) => (
                <p key={i}>
                  <span className="text-[#B8B5B1]">{c.role}:</span>{' '}
                  <span className="text-[#F5F3EF]">{c.name}</span>
                </p>
              ))}
            </div>
            <p className="text-[10px] text-[#B8B5B1]/70 leading-normal italic pt-1">
              * Note: {project.creditNote}
            </p>
          </div>
        </div>
      </header>

      {/* Breathing Space Before The White Interlude */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-6">
          <p className="text-xs sm:text-sm font-mono text-[#B8B5B1] max-w-xl">
            The stage shifts intentionally from darkness to white paper. Flattened collage compositions remain intact.
          </p>
          <PortfolioImage asset={PORTFOLIO_ASSETS.mahp.logo} className="h-auto w-[110px] shrink-0 object-contain" />
        </div>
      </div>

      {/* WHITE COLLAGE INTERLUDE · FLATTENED PAGES 20–21 */}
      <section
        ref={collage1Reveal.ref}
        className={`w-full bg-[#FAF9F5] text-black transition-opacity duration-500 ${
          collage1Reveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="px-4 py-5 sm:px-8">
            <span className="text-[10px] font-mono tracking-widest uppercase text-black/60">
              WHITE INTERLUDE · SOURCE PAGES 20–21
            </span>
          </div>
          {PORTFOLIO_ASSETS.mahp.interlude.map((asset) => (
            <PortfolioImage key={asset.slot} asset={asset} className="block h-auto w-full bg-[#FAF9F5]" />
          ))}
        </div>
      </section>

      {/* RETURN TO BLACK STAGE: PHOTOGRAPHY SEQUENCE (Source Page 22) with M12 Photo Reveal */}
      <section
        ref={photoReveal.ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-[#F5F3EF]/15 transition-opacity duration-500 ${
          photoReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block">
              PHOTOGRAPHY SEQUENCE · SOURCE PAGE 22
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight">
              Editorial Studio Photography
            </h2>
            <p className="text-xs sm:text-sm text-[#B8B5B1] leading-relaxed">
              Transitioning from white paper collage back to focused editorial photography.
            </p>
            <div className="p-4 border border-[#F5F3EF]/15 font-mono text-xs text-[#F5F3EF] space-y-1">
              <p>Photographer: Avi Bellaiche</p>
              <p>Model: BAAN</p>
            </div>
          </div>

          <div className="lg:col-span-7 animate-photo-reveal">
            <div className="mx-auto w-full max-w-[1440px]">
              <div className="aspect-[4/5] max-h-[85svh] w-full sm:aspect-[3/2]">
                <PortfolioImage asset={PORTFOLIO_ASSETS.mahp.hero} eager className="h-full w-full object-cover object-[50%_72%] sm:object-contain" />
              </div>
              <PortfolioImage
                asset={PORTFOLIO_ASSETS.mahp.seated}
                className="ml-auto mt-8 block h-auto w-full max-w-[533px] border border-[#F5F3EF]/15"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Understated Project Navigation Bridge */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F5F3EF]/15" aria-label="Project Navigation">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/work/letoile-maho"
            className="editorial-link inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous: L'ETOILE MAHO</span>
          </Link>

          <Link
            href="/work/aurora-de-liage-x-auro-dapunk"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5F3EF]"
          >
            <PortfolioImage asset={PORTFOLIO_ASSETS.mahp.next} className="h-8 w-28 object-cover" />
            <span>Next: AURORA DE LIAGE X AURO DA'PUNK</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
