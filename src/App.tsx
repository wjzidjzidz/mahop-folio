import { useEffect } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { StarCursor } from './components/StarCursor';
import { JourneyStarCompanion } from './components/JourneyStarCompanion';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkIndexPage } from './pages/WorkIndexPage';
import { LetoileMahoPage } from './pages/LetoileMahoPage';
import { MahStarPPage } from './pages/MahStarPPage';
import { AuroraPage } from './pages/AuroraPage';
import { MaterialPage } from './pages/MaterialPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

interface RouteMetadata {
  title: string;
  description: string;
}

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'MAH★P — Nocturnal Textile Theatre',
    description:
      'Portfolio of fashion, textile architecture, photography, and visual-art work by Aurelia Mahop Di Toro.',
  },
  '/work': {
    title: 'Work Archive — MAH★P',
    description:
      "Archive of selected fashion, textile, and photographic projects including L'ETOILE MAHO, MAH★P, and AURORA DE LIAGE X AURO DA'PUNK.",
  },
  '/work/letoile-maho': {
    title: "L'ETOILE MAHO — MAH★P",
    description:
      "L'ETOILE MAHO: fashion collection across planetary chapters Mercury, Uranus, Pluto, and Mars. Clothing by Aurelia Mahop Di Toro; photography by Sirine.",
  },
  '/work/mah-star-p': {
    title: 'MAH★P — MAH★P',
    description:
      'MAH★P: white collage interlude and editorial studio photography series. Photography by Avi Bellaiche; model BAAN.',
  },
  '/work/aurora-de-liage-x-auro-dapunk': {
    title: "AURORA DE LIAGE X AURO DA'PUNK — MAH★P",
    description:
      "AURORA DE LIAGE X AURO DA'PUNK: collage composition and editorial photography sequence. Dress by Aurelia Mahop Di Toro; photography by Raphaël Kassouri.",
  },
  '/material': {
    title: 'Material Table (24 Mapped Samples) — MAH★P',
    description:
      'Curated textile archive board of 24 mapped swatch specimens preserving knit structures and visual textures.',
  },
  '/about': {
    title: 'About & Contact — MAH★P',
    description:
      'Artistic portfolio information and direct enquiry contact for Aurelia Mahop Di Toro.',
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

function AppContent() {
  const { currentPath } = useRouter();

  const normalizedPath =
    currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

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
      <StarCursor />
      <JourneyStarCompanion />

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
