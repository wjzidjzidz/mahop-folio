import { Link } from '../router/RouterContext';
import { BrandLogo } from '../components/BrandLogo';
import { StructuralPlaceholder } from '../components/StructuralPlaceholder';
import { MATERIAL_SWATCHES, PROJECTS } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowUpRight } from 'lucide-react';

export function HomePage() {
  const letoile = PROJECTS.letoile;
  const mahp = PROJECTS.mahp;
  const previewSwatches = MATERIAL_SWATCHES.slice(0, 4);

  const castReveal = useScrollReveal({ threshold: 0.1 });
  const letoileReveal = useScrollReveal({ threshold: 0.1 });
  const mahpReveal = useScrollReveal({ threshold: 0.1 });
  const materialReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="relative w-full">
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

        {/* Hero Partner Slot with M03 Image Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-[#F5F3EF]/15 pt-8 animate-rule-draw">
          <div className="md:col-span-8">
            <StructuralPlaceholder
              id="HOME-HERO-TBD"
              title="Opening Stage Lead Visual"
              sourceRef="Cover / Lead Composition Reference"
              aspectRatio="16/9"
              variant="stage"
              className="max-h-[500px]"
            />
          </div>
          <div className="md:col-span-4 flex flex-col justify-end space-y-4">
            <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block">
              Curatorial Observation
            </span>
            <p className="text-xs text-[#B8B5B1] leading-relaxed">
              Black is the principal stage. Form and silhouette emerge through deliberate negative space rather than commercial presentation.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#F5F3EF]/60 block">
                [PROVISIONAL ASSET: HOME-HERO-TBD]
              </span>
            </div>
          </div>
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

        {/* Asymmetric Cut-out Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <StructuralPlaceholder
              id="HOME-CAST-TBD"
              title="Layered Silhouette Cut-outs"
              sourceRef="Source Page Figure Reconstructions (Alpha Channel)"
              aspectRatio="4/5"
              variant="cast"
              className="max-h-[550px]"
            />
          </div>
          <div className="md:col-span-5 space-y-8 pl-0 md:pl-6">
            <div className="border-l border-[#F5F3EF]/20 pl-6 space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-[#B8B5B1] uppercase block">
                Preservation Standard
              </span>
              <p className="text-sm text-[#F5F3EF] leading-relaxed">
                Authentic contours remain uncropped. Garments, textile edges, and anatomical gestures are displayed without synthetic background extraction.
              </p>
            </div>
            <div className="border-l border-[#F5F3EF]/20 pl-6 space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-[#B8B5B1] uppercase block">
                Motion Protocol
              </span>
              <p className="text-xs text-[#B8B5B1] leading-relaxed">
                Reveal, settle, drift. Low-amplitude drift on desktop with zero scroll-jacking.
              </p>
            </div>
          </div>
        </div>
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
            <Link href={letoile.slug} className="block group">
              <StructuralPlaceholder
                id={letoile.leadAssetId}
                title="L'ETOILE MAHO Opening Composition"
                sourceRef="Source Pages 6–7"
                aspectRatio="16/10"
                variant="stage"
                accentColor="#6B1111"
                className="group-hover:border-[#F5F3EF]/40 transition-colors duration-300"
              />
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
        <div className="p-4 sm:p-8 md:p-12 bg-white/5 border border-white/10 transition-colors duration-300">
          <Link href={mahp.slug} className="block group">
            <StructuralPlaceholder
              id={mahp.leadAssetId}
              title="MAH★P White Collage Composition"
              sourceRef="Source Page 20 (Flattened White Composition)"
              aspectRatio="16/9"
              variant="white-collage"
              className="group-hover:shadow-lg transition-shadow duration-300"
            />
          </Link>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F5F3EF]/15 text-xs text-[#B8B5B1]">
            <span className="font-mono text-[11px]">Source pages 20–21 flattened collages · Avi Bellaiche & BAAN</span>
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
              TEXTURE ARCHITECTURE · 27 PROVISIONAL SWATCHES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight">
              Material Library Preview
            </h2>
          </div>
          <Link
            href="/material"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5F3EF]"
          >
            <span>Explore All 27 Swatches</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* 4 Swatch Object Cluster with M13 Swatch Feedback */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {previewSwatches.map((item) => (
            <Link
              key={item.id}
              href="/material"
              className="group block space-y-3 p-3 bg-white/[0.02] border border-[#F5F3EF]/10 hover:border-[#F5F3EF]/40 hover:scale-[1.02] transition-all duration-200"
            >
              <StructuralPlaceholder
                id={item.id}
                title={item.label}
                sourceRef={item.provisionalPage}
                aspectRatio="1/1"
                variant="swatch"
                showStatusBadge={false}
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-[#B8B5B1]">
                <span className="text-[#F5F3EF]">{item.label}</span>
                <span>{item.id}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
