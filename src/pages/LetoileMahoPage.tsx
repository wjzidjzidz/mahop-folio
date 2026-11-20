import { Link } from '../router/RouterContext';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { PROJECTS } from '../data/content';
import { LetoileSection } from '../components/sections/LetoileSection';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function LetoileMahoPage() {
  const project = PROJECTS.letoile;

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
            <span className="text-[10px] tracking-[0.32em] uppercase text-[#B8B5B1] block mb-3 font-mono">
              Four-Part Planetary Installation · {project.sourcePages}
            </span>
            <h1 className="text-[14vw] sm:text-[11vw] lg:text-[9vw] font-display uppercase tracking-tighter leading-[0.84] text-[#F5F3EF]">
              {project.title}
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

      <LetoileSection standaloneStage={true} showHeader={false} />

      <nav
        className="relative z-20 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20"
        aria-label="Project Navigation"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/work"
            className="editorial-link inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Work</span>
          </Link>

          <Link
            href="/work/mah-star-p"
            className="editorial-link group inline-flex items-center gap-4 text-xs font-mono uppercase tracking-[0.24em] text-[#F5F3EF]"
          >
            <PortfolioImage asset={PORTFOLIO_ASSETS.letoile.next} className="h-9 w-28 object-cover" />
            <span>Next: MAH★P</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
