import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '../router/RouterContext';
import {
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
  type IntroTimelineMetrics,
  type PlanetJourneyState,
  type PlanetKind,
} from '../utils/journeyLogic';

export interface IntroSyncState {
  active: boolean;
  phase: IntroTimelineMetrics['phase'];
  starGlow: number;
  heroWordmarkOpacity: number;
}

export interface IntroStarGuideState {
  active: boolean;
  mode: 'writing' | 'slot';
  clientX: number;
  clientY: number;
  sizePx: number;
  rotationDeg: number;
  starGlow: number;
}

export interface PlanetJourneySyncState {
  active: boolean;
  targetPlanet: PlanetKind | null;
  phase: 'idle' | PlanetJourneyState['phase'];
  portalProgress: number;
}

interface ExhibitionStageContextValue {
  sceneId: EnvironmentSceneId;
  sceneOpacity: number;
  backdropDim: number;
  scrollProgressRef: React.MutableRefObject<number>;
  introStateRef: React.MutableRefObject<IntroSyncState>;
  introStarGuideRef: React.MutableRefObject<IntroStarGuideState>;
  planetJourneyRef: React.MutableRefObject<PlanetJourneySyncState>;
  cancelPlanetJourneyRef: React.MutableRefObject<(() => void) | null>;
  introActive: boolean;
  setIntroActive: (active: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setEnvironmentState: (
    nextScene: EnvironmentSceneId,
    progress?: number,
    opacity?: number,
    dim?: number
  ) => void;
}

const defaultSceneForPath = (path: string): EnvironmentSceneId => {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  switch (clean) {
    case '/':
      return 'gateway';
    case '/work/letoile-maho':
      return 'letoile-overview';
    case '/work/mah-star-p':
      return 'white-collage';
    case '/work/aurora-de-liage-x-auro-dapunk':
      return 'aurora-punk';
    default:
      return 'ambient-archive';
  }
};

const DEFAULT_INTRO_SYNC: IntroSyncState = {
  active: false,
  phase: 'settled',
  starGlow: 0,
  heroWordmarkOpacity: 1,
};

const DEFAULT_INTRO_STAR_GUIDE: IntroStarGuideState = {
  active: false,
  mode: 'slot',
  clientX: 0,
  clientY: 0,
  sizePx: 24,
  rotationDeg: 0,
  starGlow: 0,
};

const DEFAULT_PLANET_JOURNEY: PlanetJourneySyncState = {
  active: false,
  targetPlanet: null,
  phase: 'idle',
  portalProgress: 0,
};

const ExhibitionStageContext = createContext<ExhibitionStageContextValue>({
  sceneId: 'gateway',
  sceneOpacity: 1,
  backdropDim: 0.12,
  scrollProgressRef: { current: 0 },
  introStateRef: { current: { ...DEFAULT_INTRO_SYNC } },
  introStarGuideRef: { current: { ...DEFAULT_INTRO_STAR_GUIDE } },
  planetJourneyRef: { current: { ...DEFAULT_PLANET_JOURNEY } },
  cancelPlanetJourneyRef: { current: null },
  introActive: false,
  setIntroActive: () => {},
  menuOpen: false,
  setMenuOpen: () => {},
  setEnvironmentState: () => {},
});

export function ExhibitionStageProvider({
  children,
  initialIntroActive = false,
}: {
  children: React.ReactNode;
  initialIntroActive?: boolean;
}) {
  const { currentPath } = useRouter();
  const [sceneId, setSceneId] = useState<EnvironmentSceneId>(() =>
    defaultSceneForPath(currentPath)
  );
  const [sceneOpacity, setSceneOpacity] = useState(1);
  const [backdropDim, setBackdropDim] = useState(0);
  const [introActive, setIntroActiveState] = useState<boolean>(initialIntroActive);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const scrollProgressRef = useRef<number>(0);

  const introStateRef = useRef<IntroSyncState>(
    initialIntroActive
      ? {
          active: true,
          phase: 'writing',
          starGlow: 0,
          heroWordmarkOpacity: 0,
        }
      : { ...DEFAULT_INTRO_SYNC }
  );

  const introStarGuideRef = useRef<IntroStarGuideState>({
    ...DEFAULT_INTRO_STAR_GUIDE,
    active: initialIntroActive,
    mode: initialIntroActive ? 'writing' : 'slot',
  });

  const planetJourneyRef = useRef<PlanetJourneySyncState>({
    ...DEFAULT_PLANET_JOURNEY,
  });

  const cancelPlanetJourneyRef = useRef<(() => void) | null>(null);

  const setIntroActive = useCallback((active: boolean) => {
    setIntroActiveState(active);
    if (!active) {
      introStateRef.current = {
        active: false,
        phase: 'settled',
        starGlow: 0,
        heroWordmarkOpacity: 1,
      };
      introStarGuideRef.current = {
        ...DEFAULT_INTRO_STAR_GUIDE,
        active: false,
      };
    }
  }, []);

  // Sync baseline environment immediately when route changes
  useEffect(() => {
    cancelPlanetJourneyRef.current?.();
    planetJourneyRef.current = { ...DEFAULT_PLANET_JOURNEY };

    const nextScene = defaultSceneForPath(currentPath);
    setSceneId(nextScene);
    setSceneOpacity(nextScene === 'ambient-archive' ? 0 : 1);
    setBackdropDim(0);
    scrollProgressRef.current = 0;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mahop:scene-accent', {
          detail: PROJECT_ENVIRONMENTS[nextScene].accentHex,
        })
      );
    }
  }, [currentPath]);

  const setEnvironmentState = useCallback(
    (
      nextScene: EnvironmentSceneId,
      progress = 0,
      opacity?: number,
      dim?: number
    ) => {
      scrollProgressRef.current = progress;
      setSceneId((prev) => (prev === nextScene ? prev : nextScene));
      if (typeof opacity === 'number') {
        setSceneOpacity(opacity);
      }
      if (typeof dim === 'number') {
        setBackdropDim(dim);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      sceneId,
      sceneOpacity,
      backdropDim,
      scrollProgressRef,
      introStateRef,
      introStarGuideRef,
      planetJourneyRef,
      cancelPlanetJourneyRef,
      introActive,
      setIntroActive,
      menuOpen,
      setMenuOpen,
      setEnvironmentState,
    }),
    [sceneId, sceneOpacity, backdropDim, introActive, setIntroActive, menuOpen, setEnvironmentState]
  );

  return (
    <ExhibitionStageContext.Provider value={value}>
      {children}
    </ExhibitionStageContext.Provider>
  );
}

export function useExhibitionStage() {
  return useContext(ExhibitionStageContext);
}
