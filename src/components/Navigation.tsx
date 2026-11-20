import { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { CONTACT_INFO } from '../data/content';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const { currentPath } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'WORK', href: '/work' },
    { label: 'MATERIAL', href: '/material' },
    { label: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F5F3EF] focus:text-black focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Floating transparent scrim bar — never obstructs 3D opening stages or uses backdrop-blur over WebGL */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div
          className="h-20 w-full bg-gradient-to-b from-black/58 via-black/18 to-transparent flex items-start"
        >
          <div className="w-full px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between pointer-events-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center text-[#F5F3EF] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 transition-opacity"
              aria-label="MAH★P Homepage"
            >
              <BrandLogo size="md" />
            </Link>

            <nav
              className="hidden md:flex items-center gap-9 text-[11px] font-mono tracking-[0.26em] uppercase"
              aria-label="Main Navigation"
            >
              {navLinks.map((item) => {
                const isActive =
                  item.href === '/work'
                    ? currentPath.startsWith('/work')
                    : currentPath === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`editorial-link py-1 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 ${
                      isActive
                        ? 'text-[#F5F3EF]'
                        : 'text-[#F5F3EF]/72 hover:text-[#F5F3EF]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#F5F3EF]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex md:hidden items-center">
              <button
                ref={toggleButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#F5F3EF] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 bg-black text-[#F5F3EF] flex flex-col justify-between px-6 pt-6 pb-10 md:hidden animate-mobile-menu-in"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5F3EF]"
              aria-label="MAH★P Homepage"
            >
              <BrandLogo size="md" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                toggleButtonRef.current?.focus();
              }}
              className="p-2 text-[#F5F3EF] focus-visible:outline-2 focus-visible:outline-[#F5F3EF]"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-6 my-auto">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/work'
                  ? currentPath.startsWith('/work')
                  : currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-5xl font-display uppercase tracking-tight py-1 transition-colors flex items-baseline justify-between ${
                    isActive
                      ? 'text-white'
                      : 'text-[#F5F3EF]/55 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#B8B5B1]">
                      CURRENT
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1.5 font-mono text-xs text-[#B8B5B1]">
            <p className="text-[#F5F3EF]">{CONTACT_INFO.email}</p>
            <p>{CONTACT_INFO.phone}</p>
          </div>
        </div>
      )}
    </>
  );
}
