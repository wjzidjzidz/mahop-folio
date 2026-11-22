import { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { BrandLogo } from './BrandLogo';
import { CONTACT_INFO } from '../data/content';
import { useExhibitionStage } from '../context/ExhibitionStageContext';
import { X } from 'lucide-react';

export function Navigation() {
  const { currentPath, navigate } = useRouter();
  const { sceneId, introActive, setMenuOpen, setEnvironmentState } = useExhibitionStage();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [footerInHeaderZone, setFooterInHeaderZone] = useState(false);
  const [heroDocked, setHeroDocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (window.location.pathname === '/' || window.location.pathname === '') && window.scrollY < 40;
  });
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkLightBackdrop = () => {
      const footer = document.querySelector('footer[data-testid="white-footer"]');
      const footerOverlapsHeader = footer
        ? footer.getBoundingClientRect().top <= 72
        : false;
      setFooterInHeaderZone(footerOverlapsHeader);
      const isHome = currentPath === '/' || currentPath === '';
      setHeroDocked(isHome && window.scrollY < 44);
    };

    const onHeroDock = (e: Event) => {
      const docked = Boolean((e as CustomEvent<boolean>).detail);
      setHeroDocked(docked && (currentPath === '/' || currentPath === ''));
    };

    checkLightBackdrop();
    window.addEventListener('scroll', checkLightBackdrop, { passive: true });
    window.addEventListener('resize', checkLightBackdrop, { passive: true });
    window.addEventListener('mahop:route-change', checkLightBackdrop);
    window.addEventListener('mahop:hero-star-dock', onHeroDock);
    return () => {
      window.removeEventListener('scroll', checkLightBackdrop);
      window.removeEventListener('resize', checkLightBackdrop);
      window.removeEventListener('mahop:route-change', checkLightBackdrop);
      window.removeEventListener('mahop:hero-star-dock', onHeroDock);
    };
  }, [currentPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && exploreOpen) {
        setExploreOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exploreOpen]);

  useEffect(() => {
    setExploreOpen(false);
  }, [currentPath]);

  useEffect(() => {
    setMenuOpen(exploreOpen);
    if (exploreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      setMenuOpen(false);
    };
  }, [exploreOpen, setMenuOpen]);

  const useLightHeader = sceneId === 'white-collage' || footerInHeaderZone;

  const closeMenu = () => {
    document.body.style.overflow = '';
    setExploreOpen(false);
  };

  const handleRouteSelect = (href: string) => {
    closeMenu();
    if (href === '/work' || href === '/material' || href === '/about') {
      setEnvironmentState('ambient-archive', 0, 0, 0);
    }
    navigate(href);
  };

  const handleContactSelect = () => {
    setEnvironmentState('ambient-archive', 0, 0, 0);
    closeMenu();
    window.requestAnimationFrame(() => {
      const footer = document.querySelector('footer[data-testid="white-footer"]');
      if (footer) {
        footer.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setEnvironmentState('ambient-archive', 1, 0, 0);
    });
  };

  const menuItems = [
    {
      id: 'projects',
      label: 'PROJECTS',
      sublabel: "L'Étoile Maho · MAH★P · Aurora de Liage",
      href: '/work',
      testId: 'explore-link-projects',
      isActive: currentPath.startsWith('/work'),
      onSelect: () => handleRouteSelect('/work'),
    },
    {
      id: 'materials',
      label: 'MATERIALS',
      sublabel: '24 Mapped Knit Swatches',
      href: '/material',
      testId: 'explore-link-materials',
      isActive: currentPath === '/material',
      onSelect: () => handleRouteSelect('/material'),
    },
    {
      id: 'about',
      label: 'ABOUT THE ARTIST',
      sublabel: 'Aurelia Mahop Di Toro',
      href: '/about',
      testId: 'explore-link-about',
      isActive: currentPath === '/about',
      onSelect: () => handleRouteSelect('/about'),
    },
    {
      id: 'contact',
      label: 'CONTACT',
      sublabel: `${CONTACT_INFO.email} · ${CONTACT_INFO.instagramHandle}`,
      href: '#white-footer',
      testId: 'explore-link-contact',
      isActive: false,
      onSelect: handleContactSelect,
    },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F5F3EF] focus:text-black focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Floating transparent scrim bar — single crisp EXPLORE trigger across desktop, tablet & mobile */}
      <header
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={introActive ? { opacity: 'var(--mahop-nav-reveal, 0)' } : undefined}
      >
        <div
          className={`h-20 w-full bg-gradient-to-b flex items-start transition-colors duration-300 ${
            footerInHeaderZone
              ? 'from-transparent to-transparent'
              : useLightHeader
                ? 'from-white/94 via-white/58 to-transparent'
                : 'from-black/92 via-black/48 to-transparent'
          }`}
        >
          <div className="w-full px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between pointer-events-auto">
            <Link
              href="/"
              onClick={() => closeMenu()}
              className={`group min-h-[44px] flex items-center hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 transition-all duration-300 ${
                heroDocked ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } ${
                useLightHeader
                  ? 'text-black focus-visible:outline-black'
                  : 'text-[#F5F3EF] focus-visible:outline-[#F5F3EF]'
              }`}
              aria-label="MAH★P Homepage"
              aria-hidden={heroDocked || undefined}
              tabIndex={heroDocked ? -1 : 0}
            >
              <BrandLogo size="md" />
            </Link>

            <button
              ref={toggleButtonRef}
              type="button"
              data-testid="explore-menu-trigger"
              onClick={() => setExploreOpen((prev) => !prev)}
              aria-expanded={exploreOpen}
              aria-controls="explore-menu"
              aria-label={exploreOpen ? 'Close Explore menu' : 'Open Explore menu'}
              className={`editorial-link min-h-[44px] min-w-[44px] inline-flex items-center gap-2.5 px-2 font-mono text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                useLightHeader
                  ? 'text-black hover:text-neutral-700 focus-visible:outline-black'
                  : 'text-[#F5F3EF] hover:text-white focus-visible:outline-[#F5F3EF]'
              }`}
            >
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rotate-45 bg-current opacity-85"
              />
              <span>EXPLORE</span>
            </button>
          </div>
        </div>
      </header>

      {exploreOpen && (
        <div
          id="explore-menu"
          data-testid="explore-menu-panel"
          data-render-mode="pure-2d"
          role="dialog"
          aria-modal="true"
          aria-label="Explore portfolio"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeMenu();
              toggleButtonRef.current?.focus();
            }
          }}
          className="fixed inset-0 z-50 bg-[#000000] text-[#F5F3EF] flex flex-col justify-between px-6 sm:px-10 lg:px-14 pt-5 pb-10 animate-mobile-menu-in"
        >
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link
              href="/"
              onClick={() => closeMenu()}
              className="min-h-[44px] flex items-center text-[#F5F3EF] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
              aria-label="MAH★P Homepage"
            >
              <BrandLogo size="md" />
            </Link>

            <button
              type="button"
              data-testid="explore-menu-close"
              onClick={() => {
                closeMenu();
                toggleButtonRef.current?.focus();
              }}
              className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 px-2 font-mono text-[11px] tracking-[0.26em] uppercase text-[#F5F3EF]/85 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4"
              aria-label="Close Explore menu"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav
            aria-label="Exhibition index"
            className="my-auto max-w-5xl w-full mx-auto flex flex-col space-y-5 sm:space-y-6"
          >
            {menuItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-testid={item.testId}
                onClick={item.onSelect}
                className={`group text-left min-h-[56px] w-full flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-2 border-b border-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F3EF] focus-visible:outline-offset-4 ${
                  item.isActive
                    ? 'text-white'
                    : 'text-[#F5F3EF]/72 hover:text-white'
                }`}
              >
                <span className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-mono text-[10px] tracking-[0.26em] text-[#B8B5B1]/75">
                    0{idx + 1}
                  </span>
                  <span className="font-display uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[0.88] group-hover:translate-x-2 transition-transform duration-300">
                    {item.label}
                  </span>
                </span>

                <span className="flex items-center gap-3 pl-8 sm:pl-0">
                  <span className="font-serif italic text-sm sm:text-base text-[#B8B5B1] group-hover:text-[#F5F3EF] transition-colors">
                    {item.sublabel}
                  </span>
                  {item.isActive && (
                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/85">
                      CURRENT
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>

          <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] text-[#B8B5B1]">
            <p className="text-[#F5F3EF]">Nocturnal Textile Theatre — Aurelia Mahop Di Toro</p>
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={CONTACT_INFO.emailHref}
                className="min-h-[44px] inline-flex items-center hover:text-white transition-colors"
              >
                {CONTACT_INFO.email}
              </a>
              <a
                href={CONTACT_INFO.instagramHref}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] inline-flex items-center hover:text-white transition-colors"
              >
                {CONTACT_INFO.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
