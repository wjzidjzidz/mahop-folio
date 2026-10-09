import { Link } from '../router/RouterContext';
import { StructuralPlaceholder } from '../components/StructuralPlaceholder';
import { PROJECTS } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function AuroraPage() {
  const project = PROJECTS.aurora;
  const transitionReveal = useScrollReveal({ threshold: 0.1 });
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
              COLLAGE TO PHOTOGRAPHY EVOLUTION · {project.sourcePages}
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display uppercase tracking-tight text-[#F5F3EF] leading-tight animate-title-settle">
              {project.displayTitle}
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs font-mono text-[#B8B5B1] border-l border-[#F5F3EF]/15 pl-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F3EF]">Verified Credits (pp. 3–4)</span>
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

      {/* SEQUENCE PART 1: COLLAGE ARCHITECTURE with M03 Reveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#7C11B8]" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1]">
                PHASE 01 · TORN-PAPER COLLAGE FIELD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight">
              Collage Composition
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B8B5B1]">Source Page 3 · Flattened Layer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <StructuralPlaceholder
              id={project.leadAssetId}
              title="Aurora Master Collage Composition"
              sourceRef="Source Page 3 (Collage Sequence)"
              aspectRatio="4/5"
              variant="aurora"
              accentColor="#7C11B8"
              className="w-full"
            />
          </div>

          <div className="lg:col-span-4 space-y-6 text-xs text-[#B8B5B1]">
            <div className="p-5 border border-[#7C11B8]/30 bg-[#7C11B8]/05">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C11B8] block mb-2">
                Sampled Accent: Deep Purple (#7C11B8)
              </span>
              <p className="leading-relaxed">
                The collage layers photographic fashion elements with raw textures and torn outlines. Intact without artificial animation overlays.
              </p>
            </div>
            <p className="font-mono text-[11px] text-[#B8B5B1]/70">
              Asset ID: {project.leadAssetId}
            </p>
          </div>
        </div>
      </section>

      {/* M11: TRANSITIONAL THRESHOLD DIVIDER */}
      <div
        ref={transitionReveal.ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="border-t border-[#F5F3EF]/15 pt-8 flex items-center justify-between text-xs font-mono text-[#B8B5B1]">
          <span className="tracking-widest">TRANSITION · COLLAGE → DIRECT PHOTOGRAPHY</span>
          <span
            className={`h-0.5 bg-[#7C11B8] transition-all duration-500 ${
              transitionReveal.isVisible ? 'w-24 sm:w-32 animate-aurora-transition' : 'w-12'
            }`}
          />
        </div>
      </div>

      {/* SEQUENCE PART 2: EDITORIAL PHOTOGRAPHY with M12 Photo Reveal */}
      <section
        ref={photoReveal.ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-opacity duration-500 ${
          photoReveal.isVisible ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
              PHASE 02 · EDITORIAL STUDY
            </span>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight">
              Photography Sequence
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B8B5B1]">Source Page 4 · Raphaël Kassouri</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 animate-photo-reveal">
            <StructuralPlaceholder
              id="AURORA-PHOTO-TBD"
              title="Aurora Editorial Fashion Photography"
              sourceRef="Source Page 4 (Model: Brazy · Stylist: @Playarabian)"
              aspectRatio="3/4"
              variant="stage"
              className="w-full"
            />
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs font-mono text-[#B8B5B1]">
            <div className="border border-[#F5F3EF]/15 p-5 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F3EF] block">
                Garment Silhouette
              </span>
              <p className="font-sans leading-relaxed text-[#B8B5B1]">
                Dress created by Aurelia Mahop Di Toro. Sculptural drape and tension captured in isolated darkness.
              </p>
            </div>
            <p className="text-[10px] text-[#B8B5B1]/70">
              Asset ID: AURORA-PHOTO-TBD
            </p>
          </div>
        </div>
      </section>

      {/* Project Navigation Bridge */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F5F3EF]/15" aria-label="Project Navigation">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/work/mah-star-p"
            className="editorial-link inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous: MAH★P</span>
          </Link>

          <Link
            href="/material"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5F3EF]"
          >
            <span>Explore Material Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
