import { CONTACT_INFO } from '../data/content';
import { Link } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function Footer() {
  const contactReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <footer className="w-full bg-black border-t border-[#F5F3EF]/15 mt-24 text-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Editorial Contact Bridge with M18 Reveal */}
        <div
          ref={contactReveal.ref}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 pb-16 border-b border-[#F5F3EF]/15 transition-opacity duration-500 ${
            contactReveal.isVisible ? 'opacity-100 animate-contact-reveal' : 'opacity-85'
          }`}
        >
          <div className="lg:col-span-5">
            <span className="text-[11px] tracking-[0.25em] text-[#B8B5B1] uppercase block mb-4">
              Stage Dialogue · Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight leading-none mb-6">
              For enquiries, get in touch.
            </h2>
            <p className="text-xs sm:text-sm text-[#B8B5B1] max-w-md leading-relaxed font-sans">
              Direct communication for commissions, collaborative research, curatorial dialogues, and textile acquisition.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block mb-1">
                Direct Email
              </span>
              <a
                href={CONTACT_INFO.emailHref}
                className="editorial-link text-base sm:text-lg font-mono text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2 rounded-sm"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block mb-1">
                Direct Telephone
              </span>
              <a
                href={CONTACT_INFO.phoneHref}
                className="editorial-link text-base sm:text-lg font-mono text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2 rounded-sm"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase block mb-1">
                Social Presence (Handles)
              </span>
              <div className="space-y-1 text-sm font-mono text-[#F5F3EF]">
                <p className="flex items-center justify-between py-1 border-b border-[#F5F3EF]/10">
                  <span className="text-xs text-[#B8B5B1]">Instagram</span>
                  <span>{CONTACT_INFO.instagramHandle}</span>
                </p>
                <p className="flex items-center justify-between py-1 border-b border-[#F5F3EF]/10">
                  <span className="text-xs text-[#B8B5B1]">TikTok</span>
                  <span>{CONTACT_INFO.tiktokHandle}</span>
                </p>
              </div>
              <p className="text-[10px] text-[#B8B5B1]/70 mt-2 italic leading-tight">
                * Note: Exact URLs unverified in handover; handles preserved as text.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#B8B5B1] tracking-wider">
          <div className="flex items-baseline gap-3">
            <BrandLogo size="sm" className="text-[#F5F3EF]" />
            <span className="text-[11px]">· NOCTURNAL TEXTILE THEATRE</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] tracking-widest uppercase">
            <Link href="/work" className="editorial-link hover:text-white transition-colors">
              Work
            </Link>
            <Link href="/material" className="editorial-link hover:text-white transition-colors">
              Material Library
            </Link>
            <Link href="/about" className="editorial-link hover:text-white transition-colors">
              About
            </Link>
          </div>

          <p className="text-[10px] text-[#B8B5B1]/60">
            Aurelia Mahop Di Toro · Prototype v1
          </p>
        </div>
      </div>
    </footer>
  );
}
