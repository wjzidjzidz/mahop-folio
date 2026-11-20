import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
} from '../../utils/journeyLogic';
import { useIsCompactViewport, useReducedMotion } from '../../hooks/useReducedMotion';
import { probeWebGLCapabilities } from './webglCapabilities';
import { GatewayNocturneScene } from './GatewayNocturneScene';
import { PlanetScenes, type PlanetKind } from './PlanetScenes';
import { EditorialNatureScene } from './EditorialNatureScene';
import { AuroraPunkScene } from './AuroraPunkScene';

interface ProjectEnvironmentHostProps {
  sceneId: EnvironmentSceneId;
  opacity?: number;
  scrollProgress?: number;
  isActive?: boolean;
  className?: string;
}

function RoomEnvironmentRig() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envRT = pmrem.fromScene(room, 0.04);
    scene.environment = envRT.texture;
    room.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      envRT.dispose();
    };
  }, [gl, scene]);

  return null;
}

function CameraAndInvalidationController({
  sceneId,
  scrollProgressRef,
  isStatic,
  isSoftwareGl,
  isVisible,
}: {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isSoftwareGl: boolean;
  isVisible: boolean;
}) {
  const { camera, invalidate, gl } = useThree();

  useEffect(() => {
    const target = PROJECT_ENVIRONMENTS[sceneId].cameraPosition;
    camera.position.set(target[0], target[1], target[2]);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [sceneId, camera, invalidate]);

  useEffect(() => {
    const dom = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
    };
    const onRestored = () => {
      invalidate();
    };
    dom.addEventListener('webglcontextlost', onLost);
    dom.addEventListener('webglcontextrestored', onRestored);
    return () => {
      dom.removeEventListener('webglcontextlost', onLost);
      dom.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl, invalidate]);

  useEffect(() => {
    if (isStatic || !isVisible || !isSoftwareGl) return;
    invalidate();
    const timer = window.setInterval(() => {
      invalidate();
    }, 120);
    return () => window.clearInterval(timer);
  }, [isStatic, isSoftwareGl, isVisible, invalidate, sceneId]);

  useEffect(() => {
    if (!isVisible) return;
    invalidate();
  }, [scrollProgressRef.current, isVisible, invalidate]);

  return null;
}

function SceneRouter({
  sceneId,
  scrollProgressRef,
  isStatic,
  isLowPower,
}: {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}) {
  if (sceneId === 'gateway') {
    return (
      <GatewayNocturneScene
        scrollProgressRef={scrollProgressRef}
        isStatic={isStatic}
        isLowPower={isLowPower}
      />
    );
  }
  if (
    sceneId === 'mercury' ||
    sceneId === 'uranus' ||
    sceneId === 'pluto' ||
    sceneId === 'mars'
  ) {
    return (
      <PlanetScenes
        planet={sceneId as PlanetKind}
        scrollProgressRef={scrollProgressRef}
        isStatic={isStatic}
        isLowPower={isLowPower}
      />
    );
  }
  if (sceneId === 'editorial-nature') {
    return (
      <EditorialNatureScene
        scrollProgressRef={scrollProgressRef}
        isStatic={isStatic}
        isLowPower={isLowPower}
      />
    );
  }
  return (
    <AuroraPunkScene
      scrollProgressRef={scrollProgressRef}
      isStatic={isStatic}
      isLowPower={isLowPower}
    />
  );
}

function WebGLFallbackBackdrop({ sceneId }: { sceneId: EnvironmentSceneId }) {
  const cfg = PROJECT_ENVIRONMENTS[sceneId];
  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ background: cfg.backdropGradient }}
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: sceneId === 'pluto' ? 'min(48vw, 380px)' : 'min(58vw, 500px)',
          height: sceneId === 'pluto' ? 'min(48vw, 380px)' : 'min(58vw, 500px)',
          border: `1px solid ${cfg.accentHex}38`,
          boxShadow: `0 0 110px ${cfg.accentHex}28 inset`,
        }}
      />
    </div>
  );
}

/**
 * Single reusable WebGL stage host routing cleanly across Gateway,
 * Mercury, Uranus, Pluto, Mars, Botanical Field, and Aurora Concrete Gallery.
 */
export function ProjectEnvironmentHost({
  sceneId,
  opacity = 1,
  scrollProgress = 0,
  isActive = true,
  className = '',
}: ProjectEnvironmentHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const reducedMotion = useReducedMotion();
  const isCompact = useIsCompactViewport();
  const [capabilities] = useState(() => probeWebGLCapabilities());
  const [contextLost, setContextLost] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsVisible(entries[0].isIntersecting);
        }
      },
      { rootMargin: '150px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const canUseWebGL = capabilities.supported && !contextLost && isActive;
  const isSoftwareGl = capabilities.isSoftwareGl;
  const isLowPower = isCompact || isSoftwareGl;
  const useDemandLoop = reducedMotion || isSoftwareGl || !isVisible;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="three-environment-host"
      data-active-scene={sceneId}
      data-render-mode={canUseWebGL ? 'webgl' : 'fallback'}
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-black transition-opacity duration-300 ${className}`}
      style={{ opacity }}
    >
      <WebGLFallbackBackdrop sceneId={sceneId} />

      {canUseWebGL && (
        <Canvas
          className="!absolute !inset-0 !h-full !w-full"
          dpr={isLowPower ? 1 : [1, 1.5]}
          frameloop={useDemandLoop ? 'demand' : 'always'}
          camera={{ fov: 44, near: 0.1, far: 45, position: PROJECT_ENVIRONMENTS[sceneId].cameraPosition }}
          gl={{
            alpha: true,
            antialias: !isLowPower,
            powerPreference: isLowPower ? 'low-power' : 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setContextLost(true);
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              setContextLost(false);
            });
          }}
        >
          <RoomEnvironmentRig />
          <CameraAndInvalidationController
            sceneId={sceneId}
            scrollProgressRef={scrollProgressRef}
            isStatic={reducedMotion}
            isSoftwareGl={isSoftwareGl}
            isVisible={isVisible}
          />
          <SceneRouter
            sceneId={sceneId}
            scrollProgressRef={scrollProgressRef}
            isStatic={reducedMotion}
            isLowPower={isLowPower}
          />
        </Canvas>
      )}
    </div>
  );
}
