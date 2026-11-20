import { Link } from '../router/RouterContext';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { PROJECTS } from '../data/content';
import { AuroraSection } from '../components/sections/AuroraSection';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function AuroraPage() {
  const project = PROJECTS.aurora;

  return (
    <div className="w-full bg-black text-[#F5F3EF]">
      <header className="relative z-20 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-10">
        <Link
          href="/work"
          className="editorial-link group inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.26em] uppercase text-[#B8B5B1] hover:text-[#F5F3EF] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Work Archive</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] tracking-[0.32em] uppercase text-[#C48CE9] block mb-3 font-mono">
              Collage to Photography · {project.sourcePages}
            </span>
            <h1 className="text-[12vw] sm:text-[9vw] lg:text-[7.5vw] font-display uppercase tracking-tighter leading-[0.86] text-[#F5F3EF]">
              {project.displayTitle}
            </h1>
          </div>

          <div className="space-y-1 text-left lg:text-right font-mono text-xs text-[#B8B5B1]">
            {project.credits.map((c) => (
              <p key={c.role}>
                {c.role}: <span className="text-[#F5F3EF]">{c.name}</span>
              </p>
            ))}
          </div>
        </div>
      </header>

      <AuroraSection standaloneStage={true} showHeader={false} />

      <nav
        className="relative z-20 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20"
        aria-label="Project Navigation"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/work/mah-star-p"
            className="editorial-link inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous: MAH★P</span>
          </Link>

          <Link
            href="/material"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#F5F3EF]"
          >
            <span>Explore Material Table</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Link href="/work/letoile-maho" className="mt-12 block w-full overflow-hidden">
          <PortfolioImage
            asset={PORTFOLIO_ASSETS.aurora.next}
            className="h-24 w-full object-cover object-center sm:h-36 opacity-80 hover:opacity-100 transition-opacity"
          />
          <span className="sr-only">Next project: L'ETOILE MAHO</span>
        </Link>
      </nav>
    </div>
  );
}
