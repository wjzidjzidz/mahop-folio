import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  evaluateWebGLFramePacing,
  PROJECT_ENVIRONMENTS,
  type EnvironmentSceneId,
  type WebGLQualityTier,
} from '../../utils/journeyLogic';
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
 * Strictly active on capable GPU hardware in full quality tier; cleanly disabled in conservative or static modes.
 */
function PostProcessingRig({
  enabled,
  sceneId,
  dprCap,
}: {
  enabled: boolean;
  sceneId: EnvironmentSceneId;
  dprCap: number;
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
    composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.34,
      0.44,
      0.78
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
    composerRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    composerRef.current.setSize(size.width, size.height);
    bloomRef.current.resolution.set(size.width, size.height);
  }, [size.width, size.height, dprCap]);

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

/**
 * Compiles all 4 planetary GLSL shaders & materials upfront during idle creation
 * so entering Mercury, Uranus, Pluto, or Mars never stalls on shader compilation.
 */
function ShaderWarmup({ isActive }: { isActive: boolean }) {
  const { gl, scene, camera } = useThree();
  const warmedRef = useRef(false);

  useEffect(() => {
    if (warmedRef.current || !isActive) return;
    warmedRef.current = true;

    const timer = window.setTimeout(() => {
      try {
        const hiddenGroups: THREE.Object3D[] = [];
        scene.traverse((obj) => {
          if (!obj.visible && obj.type === 'Group') {
            obj.visible = true;
            hiddenGroups.push(obj);
          }
        });
        gl.compile(scene, camera);
        for (let i = 0; i < hiddenGroups.length; i++) {
          hiddenGroups[i].visible = false;
        }
      } catch {
        // Non-fatal; shaders compile normally on demand
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [gl, scene, camera, isActive]);

  return null;
}

function FramePacingMonitor({
  active,
  isSoftwareGl,
  qualityTier,
  onQualityChange,
}: {
  active: boolean;
  isSoftwareGl: boolean;
  qualityTier: WebGLQualityTier;
  onQualityChange: (nextTier: WebGLQualityTier) => void;
}) {
  const warmupStartRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);
  const samplesRef = useRef<number[]>([]);
  const slowWindowsRef = useRef<number>(0);

  useEffect(() => {
    warmupStartRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
    samplesRef.current = [];
  }, [qualityTier, active]);

  useFrame((_, delta) => {
    if (!active || isSoftwareGl || qualityTier === 'fallback-2d') return;
    const now = performance.now();
    // Ignore first 1.6s of initial scene/shader warm-up so startup compilation never trips degradation
    if (now - warmupStartRef.current < 1600) return;

    const ms = Math.min(250, delta * 1000);
    samplesRef.current.push(ms);

    if (samplesRef.current.length >= 48) {
      const res = evaluateWebGLFramePacing({
        currentTier: qualityTier,
        sampleFrameMs: samplesRef.current,
        consecutiveSlowWindows: slowWindowsRef.current,
        isSoftwareGl,
      });
      samplesRef.current = [];
      slowWindowsRef.current = res.nextConsecutiveSlowWindows;
      if (res.changed) {
        onQualityChange(res.nextTier);
      }
    }
  });

  return null;
}

function InvalidationController({
  sceneId,
  isStatic,
  isSoftwareGl,
  isWebGLScene,
  menuOpen,
  documentHidden,
}: {
  sceneId: EnvironmentSceneId;
  isStatic: boolean;
  isSoftwareGl: boolean;
  isWebGLScene: boolean;
  menuOpen: boolean;
  documentHidden: boolean;
}) {
  const { invalidate, gl } = useThree();

  useEffect(() => {
    if (!isWebGLScene || menuOpen || documentHidden) return;
    invalidate();
  }, [sceneId, isWebGLScene, menuOpen, documentHidden, invalidate]);

  useEffect(() => {
    const onScrollOrProgress = () => {
      if (isWebGLScene && !menuOpen && !documentHidden) {
        invalidate();
      }
    };
    window.addEventListener('mahop:env-progress', onScrollOrProgress);
    return () => window.removeEventListener('mahop:env-progress', onScrollOrProgress);
  }, [isWebGLScene, menuOpen, documentHidden, invalidate]);

  useEffect(() => {
    const dom = gl.domElement;
    const onRestored = () => {
      invalidate();
    };
    dom.addEventListener('webglcontextrestored', onRestored);
    return () => {
      dom.removeEventListener('webglcontextrestored', onRestored);
      gl.renderLists.dispose();
    };
  }, [gl, invalidate]);

  useEffect(() => {
    if (isStatic || !isWebGLScene || !isSoftwareGl || menuOpen || documentHidden) return;
    invalidate();
    const timer = window.setInterval(() => {
      invalidate();
    }, 90);
    return () => window.clearInterval(timer);
  }, [isStatic, isSoftwareGl, isWebGLScene, menuOpen, documentHidden, invalidate, sceneId]);

  return null;
}

export interface WebGLCanvasStageProps {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
  isLowPower: boolean;
  isSoftwareGl: boolean;
  showHost: boolean;
  isWebGLWorld: boolean;
  menuOpen: boolean;
  documentHidden: boolean;
  qualityTier: WebGLQualityTier;
  onQualityChange: (nextTier: WebGLQualityTier) => void;
  onContextLostChange: (lost: boolean) => void;
}

export default function WebGLCanvasStage({
  sceneId,
  scrollProgressRef,
  reducedMotion,
  isLowPower,
  isSoftwareGl,
  showHost,
  isWebGLWorld,
  menuOpen,
  documentHidden,
  qualityTier,
  onQualityChange,
  onContextLostChange,
}: WebGLCanvasStageProps) {
  const effectiveLowPower = isLowPower || qualityTier === 'conservative';
  const activeRendering = showHost && isWebGLWorld && !menuOpen && !documentHidden;

  // Pause R3F loop completely when hidden, in EXPLORE, or scrolled onto pure-2D sections
  const frameloop: 'always' | 'demand' | 'never' = !activeRendering
    ? 'never'
    : reducedMotion || isSoftwareGl
      ? 'demand'
      : 'always';

  const dprCap = effectiveLowPower ? 1 : 1.5;
  const enablePostProcessing =
    activeRendering &&
    !effectiveLowPower &&
    !isSoftwareGl &&
    !reducedMotion &&
    qualityTier === 'full';

  return (
    <Canvas
      className="!absolute !inset-0 !h-full !w-full"
      dpr={effectiveLowPower ? 1 : [1, 1.5]}
      frameloop={frameloop}
      camera={{
        fov: 46,
        near: 0.1,
        far: 65,
        position: PROJECT_ENVIRONMENTS[sceneId].cameraPosition,
      }}
      gl={{
        alpha: true,
        antialias: !effectiveLowPower,
        powerPreference: effectiveLowPower ? 'low-power' : 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onContextLostChange(true);
        });
        gl.domElement.addEventListener('webglcontextrestored', () => {
          onContextLostChange(false);
        });
      }}
    >
      <RoomEnvironmentRig />
      <ShaderWarmup isActive={activeRendering} />
      <FramePacingMonitor
        active={activeRendering}
        isSoftwareGl={isSoftwareGl}
        qualityTier={qualityTier}
        onQualityChange={onQualityChange}
      />
      <InvalidationController
        sceneId={sceneId}
        isStatic={reducedMotion}
        isSoftwareGl={isSoftwareGl}
        isWebGLScene={activeRendering}
        menuOpen={menuOpen}
        documentHidden={documentHidden}
      />
      <PlanetScenes
        sceneId={sceneId}
        scrollProgressRef={scrollProgressRef}
        isStatic={reducedMotion}
        isLowPower={effectiveLowPower}
      />
      <PostProcessingRig
        enabled={enablePostProcessing}
        sceneId={sceneId}
        dprCap={dprCap}
      />
    </Canvas>
  );
}
