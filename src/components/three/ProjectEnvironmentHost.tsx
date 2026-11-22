import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  PROJECT_ENVIRONMENTS,
  sceneUsesWebGL,
  shouldRenderWebGLHost,
  type EnvironmentSceneId,
} from '../../utils/journeyLogic';
import { useIsCompactViewport, useReducedMotion } from '../../hooks/useReducedMotion';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import { probeWebGLCapabilities } from './webglCapabilities';
import { PlanetScenes } from './PlanetScenes';

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

/**
 * Controlled cinematic HDR Bloom post-processing using Three.js EffectComposer + UnrealBloomPass.
 * Strictly active on GPU hardware when not static/low-power; gracefully bypassed on software WebGL
 * so headless/CPU devices render cleanly without stalls.
 */
function PostProcessingRig({
  enabled,
  sceneId,
}: {
  enabled: boolean;
  sceneId: EnvironmentSceneId;
}) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);

  const composerBundle = useMemo(() => {
    if (!enabled) return null;
    const rt = new THREE.WebGLRenderTarget(
      Math.max(1, size.width),
      Math.max(1, size.height),
      { type: THREE.HalfFloatType }
    );
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.48,
      0.56,
      0.72
    );
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    return { composer, bloomPass, rt };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, gl, scene, camera]);

  useEffect(() => {
    if (!composerBundle) {
      composerRef.current = null;
      bloomRef.current = null;
      return;
    }
    composerRef.current = composerBundle.composer;
    bloomRef.current = composerBundle.bloomPass;
    return () => {
      composerBundle.bloomPass.dispose();
      composerBundle.rt.dispose();
      composerBundle.composer.dispose();
      composerRef.current = null;
      bloomRef.current = null;
    };
  }, [composerBundle]);

  useEffect(() => {
    if (!composerRef.current || !bloomRef.current) return;
    composerRef.current.setSize(size.width, size.height);
    bloomRef.current.resolution.set(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(() => {
    if (!bloomRef.current) return;
    bloomRef.current.strength = 0.34;
    bloomRef.current.radius = 0.44;
    bloomRef.current.threshold = 0.78;
  }, [sceneId]);

  useFrame(() => {
    if (enabled && composerRef.current) {
      composerRef.current.render();
    }
  }, enabled ? 1 : 0);

  return null;
}

function InvalidationController({
  sceneId,
  isStatic,
  isSoftwareGl,
  isWebGLScene,
  menuOpen,
}: {
  sceneId: EnvironmentSceneId;
  isStatic: boolean;
  isSoftwareGl: boolean;
  isWebGLScene: boolean;
  menuOpen: boolean;
}) {
  const { invalidate, gl } = useThree();

  useEffect(() => {
    if (!isWebGLScene || menuOpen) return;
    invalidate();
  }, [sceneId, isWebGLScene, menuOpen, invalidate]);

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
    if (isStatic || !isWebGLScene || !isSoftwareGl || menuOpen) return;
    invalidate();
    const timer = window.setInterval(() => {
      invalidate();
    }, 90);
    return () => window.clearInterval(timer);
  }, [isStatic, isSoftwareGl, isWebGLScene, menuOpen, invalidate, sceneId]);

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
  if (
    sceneId === 'gateway' ||
    sceneId === 'letoile-overview' ||
    sceneId === 'mercury' ||
    sceneId === 'uranus' ||
    sceneId === 'pluto' ||
    sceneId === 'mars'
  ) {
    return (
      <PlanetScenes
        sceneId={sceneId}
        scrollProgressRef={scrollProgressRef}
        isStatic={isStatic}
        isLowPower={isLowPower}
      />
    );
  }
  return null;
}

function WebGLFallbackBackdrop({ sceneId }: { sceneId: EnvironmentSceneId }) {
  const cfg = PROJECT_ENVIRONMENTS[sceneId];
  return (
    <div
      className="absolute inset-0"
      style={{ background: cfg.backdropGradient }}
      aria-hidden="true"
    />
  );
}

/**
 * Single Root Persistent WebGL Host:
 * Mounted once in App.tsx so Hero -> L'Étoile Maho and planetary transitions share a single WebGL canvas.
 * Hides immediately and suspends ticks cleanly during pure-2D routes, archive pages, and whenever EXPLORE is open.
 */
export function ProjectEnvironmentHost() {
  const { sceneId, sceneOpacity, backdropDim, menuOpen, scrollProgressRef } =
    useExhibitionStage();
  const reducedMotion = useReducedMotion();
  const isCompact = useIsCompactViewport();
  const [capabilities] = useState(() => probeWebGLCapabilities());
  const [contextLost, setContextLost] = useState(false);

  const isWebGLWorld = sceneUsesWebGL(sceneId);
  const showWebGL = shouldRenderWebGLHost(sceneId, menuOpen);
  const canRenderWebGL = capabilities.supported && !contextLost;
  const isSoftwareGl = capabilities.isSoftwareGl;
  const isLowPower = isCompact || isSoftwareGl;
  const useDemandLoop = reducedMotion || isSoftwareGl || !showWebGL;
  const enablePostProcessing =
    canRenderWebGL && showWebGL && !isLowPower && !isSoftwareGl && !reducedMotion;

  return (
    <div
      aria-hidden="true"
      data-testid="three-environment-host"
      data-active-scene={sceneId}
      data-render-mode={!showWebGL ? 'pure-2d' : canRenderWebGL ? 'webgl' : 'fallback'}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
      style={{
        opacity: showWebGL ? sceneOpacity : 0,
        visibility: showWebGL ? 'visible' : 'hidden',
      }}
    >
      {showWebGL && <WebGLFallbackBackdrop sceneId={sceneId} />}

      {canRenderWebGL && (
        <Canvas
          className="!absolute !inset-0 !h-full !w-full"
          dpr={isLowPower ? 1 : [1, 1.5]}
          frameloop={useDemandLoop ? 'demand' : 'always'}
          camera={{ fov: 46, near: 0.1, far: 65, position: PROJECT_ENVIRONMENTS[sceneId].cameraPosition }}
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
          <InvalidationController
            sceneId={sceneId}
            isStatic={reducedMotion}
            isSoftwareGl={isSoftwareGl}
            isWebGLScene={showWebGL && isWebGLWorld}
            menuOpen={menuOpen}
          />
          <SceneRouter
            sceneId={sceneId}
            scrollProgressRef={scrollProgressRef}
            isStatic={reducedMotion}
            isLowPower={isLowPower}
          />
          <PostProcessingRig enabled={enablePostProcessing} sceneId={sceneId} />
        </Canvas>
      )}

      {showWebGL && (
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
          style={{ opacity: backdropDim * 0.55 }}
        />
      )}
    </div>
  );
}
