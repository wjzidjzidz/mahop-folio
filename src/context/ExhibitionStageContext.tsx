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

export type StageVisualsListener = (opacity: number, dim: number) => void;

interface ExhibitionStageContextValue {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  sceneOpacityRef: React.MutableRefObject<number>;
  backdropDimRef: React.MutableRefObject<number>;
  subscribeStageVisuals: (listener: StageVisualsListener) => () => void;
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
  scrollProgressRef: { current: 0 },
  sceneOpacityRef: { current: 1 },
  backdropDimRef: { current: 0 },
  subscribeStageVisuals: () => () => {},
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
  const [introActive, setIntroActiveState] = useState<boolean>(initialIntroActive);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const scrollProgressRef = useRef<number>(0);
  const sceneOpacityRef = useRef<number>(1);
  const backdropDimRef = useRef<number>(0);
  const lastEmittedSceneRef = useRef<EnvironmentSceneId>(sceneId);
  const visualListenersRef = useRef<Set<StageVisualsListener>>(new Set());

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

  const subscribeStageVisuals = useCallback((listener: StageVisualsListener) => {
    visualListenersRef.current.add(listener);
    listener(sceneOpacityRef.current, backdropDimRef.current);
    return () => {
      visualListenersRef.current.delete(listener);
    };
  }, []);

  const notifyVisualListeners = useCallback(() => {
    const op = sceneOpacityRef.current;
    const dim = backdropDimRef.current;
    visualListenersRef.current.forEach((fn) => fn(op, dim));
  }, []);

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
    lastEmittedSceneRef.current = nextScene;
    setSceneId(nextScene);
    sceneOpacityRef.current = nextScene === 'ambient-archive' ? 0 : 1;
    backdropDimRef.current = 0;
    scrollProgressRef.current = 0;
    notifyVisualListeners();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mahop:scene-accent', {
          detail: PROJECT_ENVIRONMENTS[nextScene].accentHex,
        })
      );
      window.dispatchEvent(new CustomEvent('mahop:env-progress'));
    }
  }, [currentPath, notifyVisualListeners]);

  const setEnvironmentState = useCallback(
    (
      nextScene: EnvironmentSceneId,
      progress = 0,
      opacity?: number,
      dim?: number
    ) => {
      scrollProgressRef.current = progress;

      let visualsChanged = false;
      if (typeof opacity === 'number' && Math.abs(opacity - sceneOpacityRef.current) > 0.0005) {
        sceneOpacityRef.current = opacity;
        visualsChanged = true;
      }
      if (typeof dim === 'number' && Math.abs(dim - backdropDimRef.current) > 0.0005) {
        backdropDimRef.current = dim;
        visualsChanged = true;
      }
      if (visualsChanged) {
        notifyVisualListeners();
      }

      if (lastEmittedSceneRef.current !== nextScene) {
        lastEmittedSceneRef.current = nextScene;
        setSceneId(nextScene);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('mahop:scene-accent', {
              detail: PROJECT_ENVIRONMENTS[nextScene].accentHex,
            })
          );
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mahop:env-progress'));
      }
    },
    [notifyVisualListeners]
  );

  const value = useMemo(
    () => ({
      sceneId,
      scrollProgressRef,
      sceneOpacityRef,
      backdropDimRef,
      subscribeStageVisuals,
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
    [
      sceneId,
      subscribeStageVisuals,
      introActive,
      setIntroActive,
      menuOpen,
      setEnvironmentState,
    ]
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
