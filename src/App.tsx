import { useEffect, useState, useCallback, useRef } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { IntroLoader } from './components/IntroLoader';
import { StarCursor } from './components/StarCursor';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkIndexPage } from './pages/WorkIndexPage';
import { LetoileMahoPage } from './pages/LetoileMahoPage';
import { MahStarPPage } from './pages/MahStarPPage';
import { AuroraPage } from './pages/AuroraPage';
import { MaterialPage } from './pages/MaterialPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Route-specific factual metadata configuration for all 7 routes
interface RouteMetadata {
  title: string;
  description: string;
}

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'MAH★P — Nocturnal Textile Theatre',
    description: 'Portfolio of fashion, textile architecture, photography, and visual-art work by Aurelia Mahop Di Toro.',
  },
  '/work': {
    title: 'Work Archive — MAH★P',
    description: "Archive of selected fashion, textile, and photographic projects including L'ETOILE MAHO, MAH★P, and AURORA DE LIAGE X AURO DA'PUNK.",
  },
  '/work/letoile-maho': {
    title: "L'ETOILE MAHO — MAH★P",
    description: "L'ETOILE MAHO: fashion collection across planetary chapters Mercury, Uranus, Pluto, and Mars. Clothing by Aurelia Mahop Di Toro; photography by Sirine.",
  },
  '/work/mah-star-p': {
    title: 'MAH★P — MAH★P',
    description: 'MAH★P: white collage interlude and fashion photography series. Photography by Avi Bellaiche; model BAAN.',
  },
  '/work/aurora-de-liage-x-auro-dapunk': {
    title: "AURORA DE LIAGE X AURO DA'PUNK — MAH★P",
    description: "AURORA DE LIAGE X AURO DA'PUNK: collage composition and editorial photography sequence. Dress by Aurelia Mahop Di Toro; photography by Raphaël Kassouri.",
  },
  '/material': {
    title: 'Material Library (27 Swatches) — MAH★P',
    description: 'Provisional object repertory of 27 textile swatch candidates preserving knit structures and material specimens.',
  },
  '/about': {
    title: 'About & Contact — MAH★P',
    description: 'Artistic portfolio information and direct enquiry contact for Aurelia Mahop Di Toro.',
  },
};

function updateMetaTag(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Module-level document session guard:
// Ensures the signature intro loader runs strictly once per document session (initial tab load or full browser reload).
// Internal SPA navigation, router changes, and component rerenders never re-trigger the loader.
let hasPlayedInitialIntro = false;

function AppContent() {
  const { currentPath } = useRouter();
  const [showIntro, setShowIntro] = useState(() => !hasPlayedInitialIntro);

  const handleIntroComplete = useCallback(() => {
    hasPlayedInitialIntro = true;
    setShowIntro(false);
  }, []);

  // Normalize path removing any trailing slash (except root '/')
  const normalizedPath = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  // Dismiss intro immediately if user navigates to another route during the intro sequence
  const prevPathRef = useRef(normalizedPath);
  useEffect(() => {
    if (prevPathRef.current !== normalizedPath) {
      prevPathRef.current = normalizedPath;
      if (showIntro) {
        handleIntroComplete();
      }
    }
  }, [normalizedPath, showIntro, handleIntroComplete]);

  // Synchronise document title, description, and OpenGraph/Twitter metadata dynamically per route
  useEffect(() => {
    const meta = ROUTE_METADATA[normalizedPath] || {
      title: '404 Not Found — MAH★P',
      description: 'The requested page could not be found.',
    };

    document.title = meta.title;
    updateMetaTag('description', meta.description);
    updateMetaTag('og:title', meta.title, true);
    updateMetaTag('og:description', meta.description, true);
    updateMetaTag('twitter:title', meta.title);
    updateMetaTag('twitter:description', meta.description);
  }, [normalizedPath]);

  // Route selector
  const renderRoute = () => {
    switch (normalizedPath) {
      case '/':
        return <HomePage />;
      case '/work':
        return <WorkIndexPage />;
      case '/work/letoile-maho':
        return <LetoileMahoPage />;
      case '/work/mah-star-p':
        return <MahStarPPage />;
      case '/work/aurora-de-liage-x-auro-dapunk':
        return <AuroraPage />;
      case '/material':
        return <MaterialPage />;
      case '/about':
        return <AboutPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-[#F5F3EF]">
      {/* Signature Custom Star Cursor */}
      <StarCursor />

      {/* Signature Theatrical Intro Loader */}
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      <Navigation />
      <main id="main-content" className="flex-1 focus:outline-none">
        <div key={normalizedPath} className="animate-page-enter">
          {renderRoute()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
