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

  // Sync document title dynamically per route with official MAH★P brand
  useEffect(() => {
    switch (normalizedPath) {
      case '/':
        document.title = 'MAH★P — Nocturnal Textile Theatre';
        break;
      case '/work':
        document.title = 'Work Archive — MAH★P';
        break;
      case '/work/letoile-maho':
        document.title = "L'ETOILE MAHO — MAH★P";
        break;
      case '/work/mah-star-p':
        document.title = 'MAH★P — MAH★P';
        break;
      case '/work/aurora-de-liage-x-auro-dapunk':
        document.title = "AURORA DE LIAGE X AURO DA'PUNK — MAH★P";
        break;
      case '/material':
        document.title = 'Material Library (27 Swatches) — MAH★P';
        break;
      case '/about':
        document.title = 'About & Contact — MAH★P';
        break;
      default:
        document.title = '404 Not Found — MAH★P';
        break;
    }
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
