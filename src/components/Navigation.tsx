import { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const { currentPath } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key press
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent background scroll when mobile menu is open
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
      {/* Skip Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F5F3EF] focus:text-black focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-[#F5F3EF]/15 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center text-[#F5F3EF] hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 rounded-sm transition-opacity"
            aria-label="MAH★P Homepage"
          >
            <BrandLogo size="md" withDot />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/work'
                  ? currentPath.startsWith('/work')
                  : currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`editorial-link py-1 text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 rounded-sm ${
                    isActive ? 'text-[#F5F3EF] font-medium' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#F5F3EF]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              ref={toggleButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5F3EF] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-2 rounded-sm"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with M17 Transition */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 top-16 z-50 bg-black/98 text-[#F5F3EF] flex flex-col justify-between p-6 md:hidden animate-mobile-menu-in"
        >
          <div className="pt-8 flex flex-col space-y-8">
            <span className="text-[10px] tracking-[0.25em] text-[#B8B5B1] uppercase border-b border-[#F5F3EF]/15 pb-2">
              Menu Navigation
            </span>
            <div className="flex flex-col space-y-6">
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
                    className={`text-3xl font-display tracking-wide py-2 transition-colors flex items-center justify-between border-b border-[#F5F3EF]/10 ${
                      isActive ? 'text-white pl-2 border-[#F5F3EF]/40' : 'text-[#F5F3EF]/60 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-xs font-sans tracking-widest text-[#B8B5B1]">[ACTIVE]</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#F5F3EF]/15 pt-6 pb-8 space-y-3">
            <p className="text-xs text-[#B8B5B1] tracking-widest uppercase">Direct Enquiries</p>
            <p className="text-sm font-mono text-[#F5F3EF]">theycallmemaho@gmail.com</p>
            <p className="text-sm font-mono text-[#B8B5B1]">+39 375 1295019</p>
          </div>
        </div>
      )}
    </>
  );
}
