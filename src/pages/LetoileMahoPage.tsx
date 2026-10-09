import { useState, useEffect } from 'react';
import { Link } from '../router/RouterContext';
import { StructuralPlaceholder } from '../components/StructuralPlaceholder';
import { PROJECTS } from '../data/content';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function LetoileMahoPage() {
  const project = PROJECTS.letoile;
  const chapters = project.chapters || [];
  const [activeChapter, setActiveChapter] = useState<string>('mercury');

  // M09: Observer to update active chapter indicator
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('chapter-', '');
            setActiveChapter(id);
          }
        });
      },
      { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' }
    );

    chapters.forEach((ch) => {
      const el = document.getElementById(`chapter-${ch.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <div className="w-full">
      {/* Top Breadcrumb & Return Link */}
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
              FOUR-PART PLANETARY INSTALLATION · {project.sourcePages}
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display uppercase tracking-tight text-[#F5F3EF] animate-title-settle">
              {project.title}
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs font-mono text-[#B8B5B1] border-l border-[#F5F3EF]/15 pl-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F3EF]">Verified Credits (pp. 6–7)</span>
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

      {/* Lead Visual Anchor with M03 Image Reveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <StructuralPlaceholder
          id={project.leadAssetId}
          title="L'ETOILE MAHO Opening Stage Visual"
          sourceRef="Source Pages 6–7 Lead Presentation"
          aspectRatio="16/9"
          variant="stage"
          accentColor="#6B1111"
        />
      </section>

      {/* M09: Discreet Chapter Tracker (Desktop/Tablet) */}
      <div className="sticky top-20 z-30 hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none mb-4">
        <div className="flex justify-end">
          <nav
            aria-label="Chapter quick navigation"
            className="pointer-events-auto bg-black/85 backdrop-blur-md border border-[#F5F3EF]/15 p-2 flex items-center gap-3 text-[11px] font-mono tracking-widest"
          >
            <span className="text-[#B8B5B1]/60 px-1 uppercase text-[10px]">Chapter:</span>
            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <a
                  key={ch.id}
                  href={`#chapter-${ch.id}`}
                  className={`px-2 py-0.5 transition-all duration-300 rounded-xs flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] ${
                    isActive
                      ? 'text-[#F5F3EF] bg-white/10 font-medium'
                      : 'text-[#B8B5B1]/70 hover:text-[#F5F3EF]'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: isActive ? ch.accentHex : `${ch.accentHex}66` }}
                    aria-hidden="true"
                  />
                  <span>{ch.name}</span>
                  {isActive && <span className="sr-only">(current)</span>}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* FOUR PLANETARY CHAPTERS with M06, M07, M08 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-36">
        {chapters.map((ch, index) => {
          const isEven = index % 2 === 0;
          const isActive = activeChapter === ch.id;

          return (
            <article
              key={ch.id}
              id={`chapter-${ch.id}`}
              className="relative border-t border-[#F5F3EF]/15 pt-12 transition-colors duration-300"
              style={{
                borderTopColor: isActive ? `${ch.accentHex}88` : undefined,
              }}
            >
              {/* Chapter Header with M06 Chapter Outline & Settle */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#B8B5B1]">
                    [CHAPTER 0{index + 1}]
                  </span>
                  <h2
                    className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight animate-chapter-title"
                    style={{ color: '#F5F3EF' }}
                  >
                    {ch.name}
                  </h2>
                </div>

                {/* M07: Chapter-specific colour cue */}
                <div className="flex items-center gap-2 text-xs font-mono transition-colors duration-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-transform duration-300"
                    style={{
                      backgroundColor: ch.accentHex,
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-[#B8B5B1]">Sampled Accent: {ch.accentColor}</span>
                  <span className="text-[#F5F3EF]/60 font-mono text-[11px]">({ch.accentHex})</span>
                </div>
              </div>

              {/* Asymmetric Composition with M08 Chapter Image Settle */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className={`${isEven ? 'lg:col-span-8' : 'lg:col-span-7 lg:order-2'} animate-chapter-image`}>
                  <StructuralPlaceholder
                    id={ch.assetId}
                    title={`Chapter ${ch.name} Image Composition`}
                    sourceRef={`Source Pages 8–15 (${ch.name} Group)`}
                    aspectRatio={index === 1 ? '3/2' : index === 3 ? '1/1' : '4/5'}
                    variant="chapter"
                    accentColor={ch.accentHex}
                    className="w-full"
                  />
                </div>

                <div
                  className={`${
                    isEven ? 'lg:col-span-4' : 'lg:col-span-5 lg:order-1'
                  } space-y-6 text-xs text-[#B8B5B1] font-sans`}
                >
                  <div
                    className="p-5 border transition-colors duration-300"
                    style={{ borderColor: `${ch.accentHex}44`, backgroundColor: `${ch.accentHex}0a` }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest block mb-2" style={{ color: ch.accentHex }}>
                      Atmospheric Tone
                    </span>
                    <p className="leading-relaxed">
                      Chapter {ch.name} introduces a distinct palette rhythm sampled directly from the original composition. Visual scale and negative space adapt to the garment and silhouette.
                    </p>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-[#B8B5B1]/70">
                    <p>Asset ID: {ch.assetId}</p>
                    <p>Stage Palette: {ch.accentHex}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Understated Project Navigation Bridge */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F5F3EF]/15" aria-label="Project Navigation">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href="/work"
            className="editorial-link inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B8B5B1] hover:text-[#F5F3EF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Work Index</span>
          </Link>

          <Link
            href="/work/mah-star-p"
            className="editorial-link group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F5F3EF]"
          >
            <span>Next Project: MAH★P</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
