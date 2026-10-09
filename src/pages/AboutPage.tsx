import { CONTACT_INFO } from '../data/content';
import { PortfolioImage } from '../components/PortfolioImage';
import { PORTFOLIO_ASSETS } from '../data/portfolioAssets';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Mail, Phone, Instagram } from 'lucide-react';

export function AboutPage() {
  const contactReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-24">
      {/* Page Header */}
      <header className="border-b border-[#F5F3EF]/15 pb-12 animate-rule-draw">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
          ARTISTIC IDENTITY & ARCHIVE DESCRIPTION
        </span>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display uppercase tracking-tight text-[#F5F3EF] animate-title-settle">
          ABOUT
        </h1>
      </header>

      {/* Factual Portfolio Description */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8 text-[#F5F3EF]">
          <div className="space-y-4 text-base sm:text-lg leading-relaxed font-sans">
            <p>
              MAH★P is an image-led artistic portfolio presenting the fashion, textile architecture, photography, collage, illustration, and visual-art creations of Aurelia Mahop Di Toro.
            </p>
            <p className="text-sm sm:text-base text-[#B8B5B1]">
              Constructed under the art direction of “Nocturnal Textile Theatre,” the presentation treats each project as a staged spatial installation rather than a commercial product catalogue.
            </p>
          </div>

          {/* Factual Integrity & Standards */}
          <div className="p-6 bg-white/[0.02] border border-[#F5F3EF]/15 space-y-3 font-mono text-xs text-[#B8B5B1]">
            <span className="text-[10px] uppercase tracking-widest text-[#F5F3EF] block">
              Curatorial Standards & Archival Evidence
            </span>
            <p>
              Every title, credit line, and chapter division is preserved strictly from verified source documentation. Editorial texts avoid speculative biographical histories, unverified awards, or fabricated claims.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto flex min-h-[500px] max-w-[487px] items-end justify-center overflow-hidden">
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.about.primary}
              className="relative z-10 h-auto max-h-[537px] w-auto max-w-[72%] object-contain object-bottom"
            />
            <PortfolioImage
              asset={PORTFOLIO_ASSETS.about.supporting}
              className="absolute bottom-0 left-0 z-20 hidden h-auto max-h-[400px] w-auto max-w-[42%] object-contain object-bottom min-[600px]:block"
            />
          </div>
          <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[#B8B5B1]">
            Cover illustrations · source page 01
          </p>
        </div>
      </section>

      {/* Direct Contact & Inquiries with M18 Reveal */}
      <section
        ref={contactReveal.ref}
        className={`border-t border-[#F5F3EF]/15 pt-16 space-y-12 transition-opacity duration-500 ${
          contactReveal.isVisible ? 'opacity-100 animate-contact-reveal' : 'opacity-85'
        }`}
      >
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8B5B1] block mb-2">
            DIRECT COMMUNICATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight">
            Contact & Acquisition Enquiries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email */}
          <div className="p-6 border border-[#F5F3EF]/15 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B8B5B1]">
              <Mail className="w-4 h-4 text-[#F5F3EF]" />
              <span className="uppercase tracking-widest">Electronic Mail</span>
            </div>
            <a
              href={CONTACT_INFO.emailHref}
              className="editorial-link text-base sm:text-lg font-mono text-[#F5F3EF] block focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
            >
              {CONTACT_INFO.email}
            </a>
            <p className="text-[11px] text-[#B8B5B1]">For editorial, curatorial, and acquisition dialogue.</p>
          </div>

          {/* Phone */}
          <div className="p-6 border border-[#F5F3EF]/15 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B8B5B1]">
              <Phone className="w-4 h-4 text-[#F5F3EF]" />
              <span className="uppercase tracking-widest">Telephone</span>
            </div>
            <a
              href={CONTACT_INFO.phoneHref}
              className="editorial-link text-base sm:text-lg font-mono text-[#F5F3EF] block focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
            >
              {CONTACT_INFO.phone}
            </a>
            <p className="text-[11px] text-[#B8B5B1]">Direct telephone communication line.</p>
          </div>

          {/* Social Presence */}
          <div className="p-6 border border-[#F5F3EF]/15 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B8B5B1]">
              <Instagram className="w-4 h-4 text-[#F5F3EF]" />
              <span className="uppercase tracking-widest">Social Accounts</span>
            </div>
            <div className="space-y-1 font-mono text-sm text-[#F5F3EF]">
              <p>
                Instagram:{' '}
                <a
                  href={CONTACT_INFO.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
                >
                  {CONTACT_INFO.instagramHandle}
                </a>
              </p>
              <p>
                TikTok:{' '}
                <a
                  href={CONTACT_INFO.tiktokHref}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
                >
                  {CONTACT_INFO.tiktokHandle}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
