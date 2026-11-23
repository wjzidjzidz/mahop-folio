import { lazy, Suspense, useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { ExhibitionStageProvider, useExhibitionStage } from './context/ExhibitionStageContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { JourneyStarCompanion } from './components/JourneyStarCompanion';
import { IntroLoader } from './components/IntroLoader';
import { ProjectEnvironmentHost } from './components/three/ProjectEnvironmentHost';

// HomePage is kept eager for instant / route paint; secondary archive routes are code-split cleanly.
import { HomePage } from './pages/HomePage';

const WorkIndexPage = lazy(() =>
  import('./pages/WorkIndexPage').then((m) => ({ default: m.WorkIndexPage }))
);
const LetoileMahoPage = lazy(() =>
  import('./pages/LetoileMahoPage').then((m) => ({ default: m.LetoileMahoPage }))
);
const MahStarPPage = lazy(() =>
  import('./pages/MahStarPPage').then((m) => ({ default: m.MahStarPPage }))
);
const AuroraPage = lazy(() =>
  import('./pages/AuroraPage').then((m) => ({ default: m.AuroraPage }))
);
const MaterialPage = lazy(() =>
  import('./pages/MaterialPage').then((m) => ({ default: m.MaterialPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

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

function shouldShowIntroInitially(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1' || params.get('skipIntro') === '1') {
    return false;
  }
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  if (params.get('loader') === '1') return true;
  const path = window.location.pathname || '/';
  return path === '/' || path === '';
}

function AppContent({
  showIntro,
  onIntroComplete,
}: {
  showIntro: boolean;
  onIntroComplete: () => void;
}) {
  const { currentPath } = useRouter();
  const { setIntroActive } = useExhibitionStage();

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

  const handleIntroComplete = () => {
    setIntroActive(false);
    onIntroComplete();
  };

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
      {/* Persistent root WebGL / 2D Planetary stage */}
      <ProjectEnvironmentHost />

      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}

      <JourneyStarCompanion />

      <Navigation />
      <main id="main-content" className="relative z-10 flex-1 focus:outline-none">
        <Suspense fallback={<div className="min-h-screen bg-black" aria-hidden="true" />}>
          <div key={normalizedPath} className="animate-page-enter">
            {renderRoute()}
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(shouldShowIntroInitially);

  return (
    <RouterProvider>
      <ExhibitionStageProvider initialIntroActive={showIntro}>
        <AppContent
          showIntro={showIntro}
          onIntroComplete={() => setShowIntro(false)}
        />
      </ExhibitionStageProvider>
    </RouterProvider>
  );
}
