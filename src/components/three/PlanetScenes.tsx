import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createPlanetTextures } from './webglCapabilities';
import { useExhibitionStage } from '../../context/ExhibitionStageContext';
import {
  computePlanetWorldPosition,
  computeSolarSystemState,
  SOLAR_PLANET_SPECS,
  type EnvironmentSceneId,
  type PlanetKind,
} from '../../utils/journeyLogic';

interface PlanetScenesProps {
  sceneId: EnvironmentSceneId;
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}

const _dummy = new THREE.Object3D();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0, -3.0);
const _bgColor = new THREE.Color('#040406');

const PLANET_SKY_COLORS: Record<'overview' | PlanetKind, string> = {
  overview: '#040406',
  mercury: '#110B07',
  uranus: '#041216',
  pluto: '#04060B',
  mars: '#140603',
};

const PORTAL_VEIL_COLORS: Record<PlanetKind, string> = {
  mercury: '#E0B482',
  uranus: '#95BFBC',
  pluto: '#7A90AC',
  mars: '#E87F3E',
};

const SKY_PALETTES: Record<
  PlanetKind,
  { zenith: string; mid: string; horizon: string; sunGlow: string; sunPos: [number, number] }
> = {
  mercury: {
    zenith: '#050404',
    mid: '#19100B',
    horizon: '#633318',
    sunGlow: '#FFE1A8',
    sunPos: [-0.22, 0.2],
  },
  uranus: {
    zenith: '#02090C',
    mid: '#092229',
    horizon: '#1E5B66',
    sunGlow: '#9EE8E3',
    sunPos: [0.08, 0.34],
  },
  pluto: {
    zenith: '#020307',
    mid: '#0A101B',
    horizon: '#20314B',
    sunGlow: '#B8D4F5',
    sunPos: [0.22, 0.28],
  },
  mars: {
    zenith: '#090302',
    mid: '#280D06',
    horizon: '#7C3216',
    sunGlow: '#FFAA66',
    sunPos: [0.24, 0.24],
  },
};

function buildTerrainGeometry(mode: PlanetKind, segments: number): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(48, 40, segments, segments);
  geom.rotateX(-Math.PI / 2);
  const pos = geom.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = 0;

    if (mode === 'mercury') {
      const wave = Math.sin(x * 0.28) * Math.cos(z * 0.24) * 0.52;
      const d1 = Math.hypot(x - 3.5, z + 6.0);
      const crater1 =
        d1 < 4.5
          ? -Math.cos((d1 / 4.5) * Math.PI * 0.5) * 0.9 +
            Math.exp(-Math.pow(d1 - 3.9, 2)) * 0.62
          : 0;
      const d2 = Math.hypot(x + 5.2, z + 9.5);
      const crater2 =
        d2 < 3.6
          ? -Math.cos((d2 / 3.6) * Math.PI * 0.5) * 0.68 +
            Math.exp(-Math.pow(d2 - 3.1, 2)) * 0.45
          : 0;
      y = wave + crater1 + crater2 + Math.sin(x * 0.9 + z * 0.7) * 0.14;
    } else if (mode === 'uranus') {
      y =
        Math.sin(x * 0.18 + z * 0.12) * 0.64 +
        Math.cos(z * 0.26 - x * 0.1) * 0.44 +
        Math.sin(x * 0.5 - z * 0.4) * 0.1;
    } else if (mode === 'pluto') {
      const valley = Math.min(1, Math.abs(x) / 6.2);
      const ridge =
        Math.abs(Math.sin(x * 0.42 + Math.cos(z * 0.35))) * 1.75 * valley +
        Math.abs(Math.cos(z * 0.55 - x * 0.2)) * 0.52;
      y = ridge - 0.58;
    } else {
      const dune = Math.sin(x * 0.24 + Math.sin(z * 0.18) * 1.45) * 0.82;
      const canyon =
        Math.abs(x) > 5.8 ? Math.min(2.45, Math.pow((Math.abs(x) - 5.8) * 0.32, 1.15)) : 0;
      y = dune + canyon + Math.cos(z * 0.48) * 0.2;
    }

    pos.setY(i, y);
  }

  geom.computeVertexNormals();
  return geom;
}

const PLANET_ATMOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormalDir;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormalDir = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PLANET_ATMOSPHERE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uOpacity;
  varying vec3 vNormalDir;
  varying vec3 vViewDir;
  void main() {
    float ndotv = abs(dot(normalize(vNormalDir), normalize(vViewDir)));
    float rim = pow(clamp(1.0 - ndotv, 0.0, 1.0), 2.45);
    float edgeMask = smoothstep(0.0, 0.34, ndotv);
    float alpha = rim * edgeMask * uIntensity * uOpacity;
    gl_FragColor = vec4(uColor * (0.9 + rim * 0.7), clamp(alpha, 0.0, 1.0));
  }
`;

const PLANETARY_SKY_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLANETARY_SKY_FRAG = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSunGlow;
  uniform vec2 uSunPos;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float y = clamp(vUv.y, 0.0, 1.0);
    vec3 sky = mix(uHorizon, uMid, smoothstep(0.0, 0.36, y));
    sky = mix(sky, uZenith, smoothstep(0.28, 0.85, y));

    // Directional solar horizon scattering halo
    vec2 aspectUv = vec2((vUv.x - 0.5) * 2.0, vUv.y);
    vec2 sunTarget = vec2(uSunPos.x * 2.0, uSunPos.y);
    float dSun = length(aspectUv - sunTarget);
    float scatter = exp(-dSun * 3.8) * 0.55 * smoothstep(0.0, 0.25, y + 0.1);
    sky += uSunGlow * scatter;

    float horizonFade = smoothstep(0.0, 0.12, y);
    float alpha = mix(0.92, 0.78, smoothstep(0.4, 0.95, y)) * horizonFade * uOpacity;
    gl_FragColor = vec4(sky, alpha);
  }
`;

const AURORA_RIBBON_VERT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(p.x * 0.35 + uTime * 0.45) * 0.55;
    p.z += cos(p.x * 0.22 - uTime * 0.32) * 0.45;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const AURORA_RIBBON_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float wave = 0.5 + 0.5 * sin(vUv.x * 12.0 + uTime * 0.7 + sin(vUv.y * 6.0));
    float verticalFade = smoothstep(0.0, 0.38, vUv.y) * smoothstep(1.0, 0.22, vUv.y);
    float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    vec3 col = mix(vec3(0.08, 0.42, 0.52), vec3(0.72, 0.94, 0.92), wave);
    float alpha = verticalFade * edgeFade * (0.28 + wave * 0.42) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

const HORIZON_HAZE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HORIZON_HAZE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float edgeX = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.72, vUv.x);
    float bellY = pow(sin(clamp(vUv.y, 0.0, 1.0) * 3.14159265), 2.2);
    float alpha = edgeX * bellY * uOpacity;
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
`;

function createAtmosphereMaterial(colorHex: string, intensity = 1.6) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uIntensity: { value: intensity },
      uOpacity: { value: 1.0 },
    },
    vertexShader: PLANET_ATMOSPHERE_VERT,
    fragmentShader: PLANET_ATMOSPHERE_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
}

function createSkyDomeMaterial(planet: PlanetKind) {
  const pal = SKY_PALETTES[planet];
  return new THREE.ShaderMaterial({
    uniforms: {
      uZenith: { value: new THREE.Color(pal.zenith) },
      uMid: { value: new THREE.Color(pal.mid) },
      uHorizon: { value: new THREE.Color(pal.horizon) },
      uSunGlow: { value: new THREE.Color(pal.sunGlow) },
      uSunPos: { value: new THREE.Vector2(pal.sunPos[0], pal.sunPos[1]) },
      uOpacity: { value: 1 },
    },
    vertexShader: PLANETARY_SKY_VERT,
    fragmentShader: PLANETARY_SKY_FRAG,
    transparent: true,
    depthWrite: false,
  });
}

const SUN_CORONA_FRAG = /* glsl */ `
  uniform vec3 uCoreColor;
  uniform vec3 uHaloColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - vec2(0.5)) * 2.0;
    float core = exp(-d * d * 18.0);
    float corona = exp(-d * 3.4) * 0.65 * smoothstep(1.0, 0.18, d);
    vec3 col = mix(uHaloColor, uCoreColor, clamp(core * 1.4, 0.0, 1.0));
    float alpha = clamp(core + corona, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function createSunCoronaMaterial(coreHex: string, haloHex: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color(coreHex) },
      uHaloColor: { value: new THREE.Color(haloHex) },
      uOpacity: { value: 1 },
    },
    vertexShader: PLANETARY_SKY_VERT,
    fragmentShader: SUN_CORONA_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Unified Four-Planet L'ETOILE MAHO Cosmic Universe + Upgraded Planetary Habitats:
 * 1. Overview: Mercury, Uranus, Pluto, and Mars orbit simultaneously in separated quadrants
 *    with custom GLSL Fresnel atmospheric scattering shells.
 * 2. Portal Entry (Scroll or Controlled ~2.6s Click Flight via planetJourneyRef):
 *    Camera glides smoothly toward chosen planet, passes through atmospheric portal veil,
 *    and opens a distinct 3D world with GLSL sky & horizon scattering dome, geological ridges/spires,
 *    directional lighting, and suspended particulates.
 */
export function PlanetScenes({
  sceneId,
  scrollProgressRef,
  isStatic,
  isLowPower,
}: PlanetScenesProps) {
  const { gl, camera, scene, size } = useThree();
  const { planetJourneyRef } = useExhibitionStage();

  const exteriorGroupRef = useRef<THREE.Group>(null);
  const mercuryGroupRef = useRef<THREE.Group>(null);
  const uranusGroupRef = useRef<THREE.Group>(null);
  const plutoGroupRef = useRef<THREE.Group>(null);
  const marsGroupRef = useRef<THREE.Group>(null);

  const mercuryGlobeRef = useRef<THREE.Mesh>(null);
  const mercuryShardsRef = useRef<THREE.Group>(null);
  const uranusGlobeRef = useRef<THREE.Mesh>(null);
  const uranusVeilRef = useRef<THREE.Mesh>(null);
  const plutoGlobeRef = useRef<THREE.Mesh>(null);
  const plutoMoonletRef = useRef<THREE.Group>(null);
  const marsGlobeRef = useRef<THREE.Mesh>(null);
  const marsBouldersRef = useRef<THREE.Group>(null);

  const portalVeilRef = useRef<THREE.Mesh>(null);
  const habitatGroupRef = useRef<THREE.Group>(null);
  const habitatMotesRef = useRef<THREE.InstancedMesh>(null);
  const habitatStarsRef = useRef<THREE.InstancedMesh>(null);

  const mercuryWorldRef = useRef<THREE.Group>(null);
  const uranusWorldRef = useRef<THREE.Group>(null);
  const plutoWorldRef = useRef<THREE.Group>(null);
  const marsWorldRef = useRef<THREE.Group>(null);

  const dustRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.InstancedMesh>(null);
  const smoothedProgressRef = useRef<number>(0);
  const prevWorldGroupRef = useRef<'overview' | PlanetKind>('overview');

  const maxAniso = useMemo(
    () => (isLowPower ? 1 : Math.min(8, gl.capabilities.getMaxAnisotropy())),
    [gl, isLowPower]
  );

  const texSize = isLowPower ? 256 : 512;
  const mercuryTex = useMemo(() => createPlanetTextures('mercury', texSize, maxAniso), [texSize, maxAniso]);
  const uranusTex = useMemo(() => createPlanetTextures('uranus', texSize, maxAniso), [texSize, maxAniso]);
  const plutoTex = useMemo(() => createPlanetTextures('pluto', texSize, maxAniso), [texSize, maxAniso]);
  const marsTex = useMemo(() => createPlanetTextures('mars', texSize, maxAniso), [texSize, maxAniso]);

  const terrainSegs = isLowPower ? 36 : 72;
  const mercuryTerrainGeom = useMemo(() => buildTerrainGeometry('mercury', terrainSegs), [terrainSegs]);
  const uranusTerrainGeom = useMemo(() => buildTerrainGeometry('uranus', terrainSegs), [terrainSegs]);
  const plutoTerrainGeom = useMemo(() => buildTerrainGeometry('pluto', terrainSegs), [terrainSegs]);
  const marsTerrainGeom = useMemo(() => buildTerrainGeometry('mars', terrainSegs), [terrainSegs]);

  const mercuryAtmoMat = useMemo(() => createAtmosphereMaterial('#DFC9B4', 1.15), []);
  const uranusAtmoMat = useMemo(() => createAtmosphereMaterial('#9FE4E0', 1.85), []);
  const plutoAtmoMat = useMemo(() => createAtmosphereMaterial('#8FA8C8', 1.35), []);
  const marsAtmoMat = useMemo(() => createAtmosphereMaterial('#EE7C3A', 1.7), []);
  const charonAtmoMat = useMemo(() => createAtmosphereMaterial('#A9C2E0', 1.4), []);

  const mercurySkyMat = useMemo(() => createSkyDomeMaterial('mercury'), []);
  const uranusSkyMat = useMemo(() => createSkyDomeMaterial('uranus'), []);
  const plutoSkyMat = useMemo(() => createSkyDomeMaterial('pluto'), []);
  const marsSkyMat = useMemo(() => createSkyDomeMaterial('mars'), []);

  const auroraRibbonMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
        vertexShader: AURORA_RIBBON_VERT,
        fragmentShader: AURORA_RIBBON_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const mercuryHazeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#E07D38') },
          uOpacity: { value: 0.28 },
        },
        vertexShader: HORIZON_HAZE_VERT,
        fragmentShader: HORIZON_HAZE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const plutoHazeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#7C94B4') },
          uOpacity: { value: 0.24 },
        },
        vertexShader: HORIZON_HAZE_VERT,
        fragmentShader: HORIZON_HAZE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const marsHazeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#E87F3E') },
          uOpacity: { value: 0.3 },
        },
        vertexShader: HORIZON_HAZE_VERT,
        fragmentShader: HORIZON_HAZE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const mercurySunCoronaMat = useMemo(
    () => createSunCoronaMaterial('#FFF8E6', '#F28B3C'),
    []
  );
  const marsSunCoronaMat = useMemo(
    () => createSunCoronaMaterial('#FFE8CD', '#E86E34'),
    []
  );

  const shardGeom = useMemo(() => {
    const g = new THREE.OctahedronGeometry(0.14, 0);
    g.scale(0.8, 1.85, 0.65);
    return g;
  }, []);

  const mesaGeom = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.42, 1.15, 1.75, 16, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const angle = Math.atan2(z, x);
      const terrace = Math.sin(y * 7.2) * 0.085;
      const crag = Math.sin(angle * 5.0 + y * 1.9) * 0.14 + Math.cos(angle * 3.0) * 0.1;
      const radialScale = Math.max(0.45, 1 + terrace + crag);
      pos.setX(i, x * radialScale);
      pos.setZ(i, z * radialScale);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(() => {
    return () => {
      mercuryTex.dispose();
      uranusTex.dispose();
      plutoTex.dispose();
      marsTex.dispose();
      mercuryTerrainGeom.dispose();
      uranusTerrainGeom.dispose();
      plutoTerrainGeom.dispose();
      marsTerrainGeom.dispose();
      mercuryAtmoMat.dispose();
      uranusAtmoMat.dispose();
      plutoAtmoMat.dispose();
      marsAtmoMat.dispose();
      charonAtmoMat.dispose();
      mercurySkyMat.dispose();
      uranusSkyMat.dispose();
      plutoSkyMat.dispose();
      marsSkyMat.dispose();
      auroraRibbonMat.dispose();
      mercuryHazeMat.dispose();
      plutoHazeMat.dispose();
      marsHazeMat.dispose();
      mercurySunCoronaMat.dispose();
      marsSunCoronaMat.dispose();
      shardGeom.dispose();
      mesaGeom.dispose();
    };
  }, [
    mercuryTex,
    uranusTex,
    plutoTex,
    marsTex,
    mercuryTerrainGeom,
    uranusTerrainGeom,
    plutoTerrainGeom,
    marsTerrainGeom,
    mercuryAtmoMat,
    uranusAtmoMat,
    plutoAtmoMat,
    marsAtmoMat,
    charonAtmoMat,
    mercurySkyMat,
    uranusSkyMat,
    plutoSkyMat,
    marsSkyMat,
    auroraRibbonMat,
    mercuryHazeMat,
    plutoHazeMat,
    marsHazeMat,
    mercurySunCoronaMat,
    marsSunCoronaMat,
    shardGeom,
    mesaGeom,
  ]);

  const starData = useMemo(() => {
    const count = isLowPower ? 95 : 240;
    const items: Array<{ x: number; y: number; z: number; scale: number }> = [];
    for (let i = 0; i < count; i++) {
      const seed = (i + 1) * 9301 + 49297;
      const r1 = ((seed % 233280) / 233280) * 2 - 1;
      const r2 = (((seed * 3) % 233280) / 233280) * 2 - 1;
      const r3 = ((seed * 7) % 233280) / 233280;
      items.push({
        x: r1 * 22,
        y: r2 * 14,
        z: -8 - r3 * 16,
        scale: 0.015 + r3 * 0.032,
      });
    }
    return { count, items };
  }, [isLowPower]);

  const dustData = useMemo(() => {
    const count = isLowPower ? 80 : 180;
    const items: Array<{
      orbitX: number;
      orbitZ: number;
      y: number;
      angle: number;
      speed: number;
      scale: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      items.push({
        orbitX: 2.8 + ((i * 19) % 41) * 0.2,
        orbitZ: 2.4 + ((i * 23) % 37) * 0.18,
        y: (((i * 29) % 47) / 47 - 0.5) * 5.4,
        angle: t * Math.PI * 2 * 5.3,
        speed: 0.04 + ((i * 13) % 19) * 0.004,
        scale: 0.012 + ((i * 7) % 11) * 0.0028,
      });
    }
    return { count, items };
  }, [isLowPower]);

  const habitatMotes = useMemo(() => {
    const count = isLowPower ? 75 : 160;
    const items = Array.from({ length: count }, (_, i) => {
      const s1 = ((i * 7919 + 104729) % 10000) / 10000;
      const s2 = ((i * 3571 + 65537) % 10000) / 10000;
      const s3 = ((i * 1999 + 31337) % 10000) / 10000;
      return {
        x: (s1 - 0.5) * 20,
        y: -25.8 + s2 * 7.2,
        z: -12 + s3 * 18,
        speed: 0.25 + s1 * 0.55,
        phase: s2 * Math.PI * 2,
        scale: 0.018 + s3 * 0.042,
      };
    });
    return { count, items };
  }, [isLowPower]);

  useEffect(() => {
    const stars = starsRef.current;
    if (stars) {
      starData.items.forEach((s, i) => {
        _dummy.position.set(s.x, s.y, s.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(s.scale);
        _dummy.updateMatrix();
        stars.setMatrixAt(i, _dummy.matrix);
      });
      stars.instanceMatrix.needsUpdate = true;
      stars.computeBoundingSphere();
    }

    const habitatStars = habitatStarsRef.current;
    if (habitatStars) {
      starData.items.forEach((s, i) => {
        _dummy.position.set(s.x, -20.5 + Math.abs(s.y) * 0.72, s.z - 2.0);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(s.scale * 1.15);
        _dummy.updateMatrix();
        habitatStars.setMatrixAt(i, _dummy.matrix);
      });
      habitatStars.instanceMatrix.needsUpdate = true;
      habitatStars.computeBoundingSphere();
    }
  }, [starData]);

  useEffect(() => {
    const dust = dustRef.current;
    if (!dust) return;
    dustData.items.forEach((d, i) => {
      _dummy.position.set(Math.cos(d.angle) * d.orbitX, d.y, -3 + Math.sin(d.angle) * d.orbitZ);
      _dummy.rotation.set(i * 0.2, i * 0.4, 0);
      _dummy.scale.setScalar(d.scale);
      _dummy.updateMatrix();
      dust.setMatrixAt(i, _dummy.matrix);
    });
    dust.instanceMatrix.needsUpdate = true;
    dust.computeBoundingSphere();
  }, [dustData]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const journey = planetJourneyRef.current;
    const activeSceneId =
      journey.active && journey.targetPlanet ? journey.targetPlanet : sceneId;
    const rawProgress =
      journey.active && journey.targetPlanet
        ? journey.portalProgress
        : scrollProgressRef.current;

    const worldGroup: 'overview' | PlanetKind =
      activeSceneId === 'mercury' ||
      activeSceneId === 'uranus' ||
      activeSceneId === 'pluto' ||
      activeSceneId === 'mars'
        ? activeSceneId
        : 'overview';

    if (prevWorldGroupRef.current !== worldGroup) {
      prevWorldGroupRef.current = worldGroup;
      smoothedProgressRef.current = rawProgress;
    } else if (isStatic || journey.active) {
      smoothedProgressRef.current = rawProgress;
    } else {
      const progDamp = 1 - Math.exp(-5.5 * dt);
      smoothedProgressRef.current = THREE.MathUtils.lerp(
        smoothedProgressRef.current,
        rawProgress,
        progDamp
      );
    }

    const activeProgress = smoothedProgressRef.current;
    const aspect = size.width / Math.max(1, size.height);

    const solarState = computeSolarSystemState(
      activeSceneId,
      activeProgress,
      isStatic,
      aspect
    );
    const damp = isStatic ? 1 : 1 - Math.exp((journey.active ? -10.5 : -6.2) * dt);

    _targetCamPos.set(...solarState.cameraPosition);
    _targetLookAt.set(...solarState.lookAt);

    if (isStatic || Math.abs(camera.position.y - _targetCamPos.y) > 9.0) {
      camera.position.copy(_targetCamPos);
      _currentLookAt.copy(_targetLookAt);
    } else {
      camera.position.lerp(_targetCamPos, damp);
      _currentLookAt.lerp(_targetLookAt, damp);
    }
    camera.lookAt(_currentLookAt);

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.lerp(camera.fov, solarState.fov, damp);
      if (Math.abs(nextFov - camera.fov) > 0.05) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    const activePlanet = solarState.focusPlanet;
    const skyHex =
      activePlanet && solarState.interiorWorldOpacity > 0.25
        ? PLANET_SKY_COLORS[activePlanet]
        : PLANET_SKY_COLORS.overview;
    _bgColor.set(skyHex);
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(_bgColor, damp);
      scene.fog.near = THREE.MathUtils.lerp(
        scene.fog.near,
        activePlanet && solarState.interiorWorldOpacity > 0.35 ? 10 : 12,
        damp
      );
      scene.fog.far = THREE.MathUtils.lerp(
        scene.fog.far,
        activePlanet && solarState.interiorWorldOpacity > 0.35 ? 34 : 30,
        damp
      );
    }

    if (exteriorGroupRef.current) {
      exteriorGroupRef.current.visible = solarState.exteriorOpacity > 0.015;
    }

    mercuryAtmoMat.uniforms.uOpacity.value = solarState.exteriorOpacity;
    uranusAtmoMat.uniforms.uOpacity.value = solarState.exteriorOpacity;
    plutoAtmoMat.uniforms.uOpacity.value = solarState.exteriorOpacity;
    marsAtmoMat.uniforms.uOpacity.value = solarState.exteriorOpacity;

    const animatePlanet = (
      kind: PlanetKind,
      group: THREE.Group | null,
      globe: THREE.Mesh | null
    ) => {
      const spec = SOLAR_PLANET_SPECS[kind];
      const desiredScale = solarState.planetScales[kind];
      const [rawX, ty, tz] = computePlanetWorldPosition(kind, t, solarState.focusPlanet, isStatic);
      const tx = rawX * solarState.planetSpreadX;

      if (group) {
        group.position.x = THREE.MathUtils.lerp(group.position.x, tx, damp);
        group.position.y = THREE.MathUtils.lerp(group.position.y, ty, damp);
        group.position.z = THREE.MathUtils.lerp(group.position.z, tz, damp);

        const nextS = THREE.MathUtils.lerp(group.scale.x, desiredScale, damp);
        group.scale.setScalar(nextS);
      }

      if (globe) {
        if (!isStatic) {
          globe.rotation.y += dt * spec.spinSpeed;
        } else {
          globe.rotation.y = 0.4 + activeProgress * 0.35;
        }
        const mat = globe.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.transparent = solarState.exteriorOpacity < 0.99;
          mat.opacity = solarState.exteriorOpacity;
        }
      }
    };

    animatePlanet('mercury', mercuryGroupRef.current, mercuryGlobeRef.current);
    animatePlanet('uranus', uranusGroupRef.current, uranusGlobeRef.current);
    animatePlanet('pluto', plutoGroupRef.current, plutoGlobeRef.current);
    animatePlanet('mars', marsGroupRef.current, marsGlobeRef.current);

    if (mercuryShardsRef.current && !isStatic) {
      mercuryShardsRef.current.rotation.y += dt * 0.11;
    }
    if (uranusVeilRef.current && !isStatic) {
      uranusVeilRef.current.rotation.y -= dt * 0.05;
    }
    if (plutoMoonletRef.current && !isStatic) {
      const mt = t * 0.22;
      plutoMoonletRef.current.position.set(
        Math.cos(mt) * 2.15,
        Math.sin(mt * 0.8) * 0.36,
        Math.sin(mt) * 1.45
      );
      plutoMoonletRef.current.rotation.y += dt * 0.24;
    }
    if (marsBouldersRef.current && !isStatic) {
      marsBouldersRef.current.rotation.y += dt * 0.14;
    }

    if (portalVeilRef.current) {
      const veilVis = solarState.portalVeilOpacity > 0.01 && activePlanet !== null;
      portalVeilRef.current.visible = veilVis;
      if (veilVis && activePlanet) {
        portalVeilRef.current.position.copy(camera.position);
        portalVeilRef.current.quaternion.copy(camera.quaternion);
        portalVeilRef.current.translateZ(-1.6);
        const vMat = portalVeilRef.current.material as THREE.MeshBasicMaterial;
        vMat.color.set(PORTAL_VEIL_COLORS[activePlanet]);
        vMat.opacity = solarState.portalVeilOpacity;
      }
    }

    const worldVis = solarState.interiorWorldOpacity > 0.015 && activePlanet !== null;
    if (habitatGroupRef.current) {
      habitatGroupRef.current.visible = worldVis;
    }

    if (mercuryWorldRef.current) mercuryWorldRef.current.visible = activePlanet === 'mercury' && worldVis;
    if (uranusWorldRef.current) uranusWorldRef.current.visible = activePlanet === 'uranus' && worldVis;
    if (plutoWorldRef.current) plutoWorldRef.current.visible = activePlanet === 'pluto' && worldVis;
    if (marsWorldRef.current) marsWorldRef.current.visible = activePlanet === 'mars' && worldVis;

    if (worldVis && activePlanet) {
      const worldFade = solarState.interiorWorldOpacity * (1 - solarState.recedeFactor * 0.45);
      mercurySkyMat.uniforms.uOpacity.value = activePlanet === 'mercury' ? worldFade : 0;
      uranusSkyMat.uniforms.uOpacity.value = activePlanet === 'uranus' ? worldFade : 0;
      plutoSkyMat.uniforms.uOpacity.value = activePlanet === 'pluto' ? worldFade : 0;
      marsSkyMat.uniforms.uOpacity.value = activePlanet === 'mars' ? worldFade : 0;

      charonAtmoMat.uniforms.uOpacity.value = activePlanet === 'pluto' ? worldFade : 0;
      auroraRibbonMat.uniforms.uTime.value = isStatic ? 0 : t;
      auroraRibbonMat.uniforms.uOpacity.value = activePlanet === 'uranus' ? worldFade : 0;
      mercurySunCoronaMat.uniforms.uOpacity.value = activePlanet === 'mercury' ? worldFade : 0;
      marsSunCoronaMat.uniforms.uOpacity.value = activePlanet === 'mars' ? worldFade : 0;

      if (habitatMotesRef.current && !isStatic) {
        const isWindyMars = activePlanet === 'mars';
        const isRisingMercury = activePlanet === 'mercury';
        const motesMat = habitatMotesRef.current.material as THREE.MeshBasicMaterial;
        motesMat.color.set(
          activePlanet === 'mercury'
            ? '#FFD090'
            : activePlanet === 'uranus'
              ? '#CBECE9'
              : activePlanet === 'pluto'
                ? '#BCC8D8'
                : '#F29559'
        );
        motesMat.opacity = 0.58 * worldFade;

        for (let i = 0; i < habitatMotes.count; i++) {
          const m = habitatMotes.items[i];
          const x = isWindyMars
            ? (((m.x + t * m.speed * 2.2 + 10) % 20) - 10)
            : m.x + Math.sin(t * 0.4 + m.phase) * 0.35;
          const y = isRisingMercury
            ? -26.2 + ((m.y + 26.2 + t * m.speed * 0.65) % 6.8)
            : m.y + Math.cos(t * 0.35 + m.phase) * 0.25;

          _dummy.position.set(x, y, m.z);
          _dummy.rotation.set(t * 0.3 + i, m.phase, 0);
          _dummy.scale.setScalar(m.scale);
          _dummy.updateMatrix();
          habitatMotesRef.current.setMatrixAt(i, _dummy.matrix);
        }
        habitatMotesRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    if (dustRef.current && !isStatic && solarState.exteriorOpacity > 0.02) {
      for (let i = 0; i < dustData.count; i++) {
        const d = dustData.items[i];
        const a = d.angle + t * d.speed;
        _dummy.position.set(
          Math.cos(a) * d.orbitX,
          d.y + Math.sin(t * 0.35 + i) * 0.08,
          -3 + Math.sin(a) * d.orbitZ
        );
        _dummy.rotation.set(a, i * 0.3, 0);
        _dummy.scale.setScalar(d.scale);
        _dummy.updateMatrix();
        dustRef.current.setMatrixAt(i, _dummy.matrix);
      }
      dustRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const segs = isLowPower ? 32 : 56;

  return (
    <>
      <fog attach="fog" args={['#040406', 11, 30]} />
      <hemisphereLight args={['#B9C7C8', '#151214', 0.9]} />
      <directionalLight color="#F6ECE2" position={[6, 4.5, 6]} intensity={2.2} />
      <pointLight color="#95BFBC" position={[-6, 3, -2]} intensity={1.8} distance={22} />
      <pointLight color="#E87F3E" position={[5.5, -2.5, -1.5]} intensity={1.9} distance={20} />

      {/* Distant celestial starfield */}
      <instancedMesh ref={starsRef} args={[undefined, undefined, starData.count]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#F5F3EF" transparent opacity={0.58} />
      </instancedMesh>

      {/* =====================================================================
          LAYER A: EXTERIOR FOUR-PLANET ORBITAL CONSTELLATION (y ≈ 0)
         ===================================================================== */}
      <group ref={exteriorGroupRef}>
        <group position={[0, -0.1, -3.2]} rotation={[1.38, 0.14, 0]}>
          <mesh>
            <torusGeometry args={[4.4, 0.008, 8, isLowPower ? 64 : 120]} />
            <meshBasicMaterial color="#908584" transparent opacity={0.16} />
          </mesh>
          <mesh>
            <torusGeometry args={[5.9, 0.008, 8, isLowPower ? 64 : 120]} />
            <meshBasicMaterial color="#95BFBC" transparent opacity={0.14} />
          </mesh>
        </group>

        {/* PLANET I — MERCURY */}
        <group
          ref={mercuryGroupRef}
          position={SOLAR_PLANET_SPECS.mercury.anchor}
          rotation={[0.14, 0.25, 0.06]}
          scale={SOLAR_PLANET_SPECS.mercury.baseScale}
        >
          <mesh ref={mercuryGlobeRef}>
            <sphereGeometry args={[1.4, segs, segs]} />
            <meshStandardMaterial
              map={mercuryTex.map}
              bumpMap={mercuryTex.bumpMap}
              bumpScale={0.072}
              roughnessMap={mercuryTex.roughnessMap}
              roughness={0.36}
              metalness={0.62}
            />
          </mesh>
          <mesh scale={1.08} material={mercuryAtmoMat}>
            <sphereGeometry args={[1.4, 28, 28]} />
          </mesh>
          <group ref={mercuryShardsRef}>
            <mesh rotation={[Math.PI * 0.42, 0.2, 0]}>
              <torusGeometry args={[2.02, 0.012, 8, isLowPower ? 40 : 84]} />
              <meshStandardMaterial color="#A39C9A" metalness={0.85} roughness={0.22} transparent opacity={0.44} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              const dist = 1.98 + (i % 2) * 0.2;
              return (
                <mesh
                  key={i}
                  geometry={shardGeom}
                  position={[Math.cos(a) * dist, ((i % 3) - 1) * 0.3, Math.sin(a) * dist]}
                  rotation={[i, a, 0.3]}
                  scale={0.58 + (i % 3) * 0.2}
                >
                  <meshStandardMaterial color="#7B7373" metalness={0.8} roughness={0.28} />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* PLANET II — URANUS */}
        <group
          ref={uranusGroupRef}
          position={SOLAR_PLANET_SPECS.uranus.anchor}
          rotation={[0.56, 0.14, -0.74]}
          scale={SOLAR_PLANET_SPECS.uranus.baseScale}
        >
          <mesh ref={uranusGlobeRef}>
            <sphereGeometry args={[1.45, segs, segs]} />
            <meshStandardMaterial
              map={uranusTex.map}
              bumpMap={uranusTex.bumpMap}
              bumpScale={0.015}
              roughnessMap={uranusTex.roughnessMap}
              roughness={0.4}
              metalness={0.08}
            />
          </mesh>
          <mesh ref={uranusVeilRef} scale={1.03}>
            <sphereGeometry args={[1.45, 28, 28]} />
            <meshStandardMaterial color="#CBECE9" transparent opacity={0.18} roughness={0.2} depthWrite={false} />
          </mesh>
          <mesh scale={1.1} material={uranusAtmoMat}>
            <sphereGeometry args={[1.45, 28, 28]} />
          </mesh>
          <mesh rotation={[Math.PI * 0.49, 0.06, 0]}>
            <ringGeometry args={[1.88, 2.78, isLowPower ? 52 : 96]} />
            <meshBasicMaterial
              map={uranusTex.ringMap}
              transparent
              opacity={0.78}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* PLANET III — PLUTO */}
        <group
          ref={plutoGroupRef}
          position={SOLAR_PLANET_SPECS.pluto.anchor}
          rotation={[0.24, -0.1, 0.16]}
          scale={SOLAR_PLANET_SPECS.pluto.baseScale}
        >
          <mesh ref={plutoGlobeRef}>
            <sphereGeometry args={[1.25, segs, segs]} />
            <meshStandardMaterial
              map={plutoTex.map}
              bumpMap={plutoTex.bumpMap}
              bumpScale={0.065}
              roughnessMap={plutoTex.roughnessMap}
              roughness={0.8}
              metalness={0.12}
            />
          </mesh>
          <mesh scale={1.08} material={plutoAtmoMat}>
            <sphereGeometry args={[1.25, 28, 28]} />
          </mesh>
          <group ref={plutoMoonletRef} position={[2.1, 0.25, -0.4]}>
            <mesh>
              <sphereGeometry args={[0.25, 18, 18]} />
              <meshStandardMaterial color="#676E76" roughness={0.86} metalness={0.08} />
            </mesh>
            <mesh position={[0.05, 0.08, 0.03]} scale={0.76}>
              <dodecahedronGeometry args={[0.25, 1]} />
              <meshStandardMaterial color="#9BA6B2" roughness={0.42} metalness={0.12} />
            </mesh>
          </group>
        </group>

        {/* PLANET IV — MARS */}
        <group
          ref={marsGroupRef}
          position={SOLAR_PLANET_SPECS.mars.anchor}
          rotation={[0.28, 0, 0.34]}
          scale={SOLAR_PLANET_SPECS.mars.baseScale}
        >
          <mesh ref={marsGlobeRef}>
            <sphereGeometry args={[1.42, segs, segs]} />
            <meshStandardMaterial
              map={marsTex.map}
              bumpMap={marsTex.bumpMap}
              bumpScale={0.072}
              roughnessMap={marsTex.roughnessMap}
              roughness={0.76}
              metalness={0.08}
              emissive="#FF5E1E"
              emissiveMap={marsTex.emissiveMap}
              emissiveIntensity={1.38}
            />
          </mesh>
          <mesh scale={1.09} material={marsAtmoMat}>
            <sphereGeometry args={[1.42, 28, 28]} />
          </mesh>
          <group ref={marsBouldersRef}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const a = (i / 7) * Math.PI * 2;
              const dist = 1.95 + (i % 2) * 0.22;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(a) * dist, Math.sin(a * 2) * 0.28, Math.sin(a) * dist]}
                  rotation={[i * 0.7, a, 0.4]}
                  scale={0.56 + (i % 3) * 0.18}
                >
                  <dodecahedronGeometry args={[0.12, 0]} />
                  <meshStandardMaterial color="#6E2414" roughness={0.88} metalness={0.05} />
                </mesh>
              );
            })}
          </group>
        </group>

        <instancedMesh ref={dustRef} args={[undefined, undefined, dustData.count]} frustumCulled={false}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#E6E1DC" transparent opacity={0.44} />
        </instancedMesh>
      </group>

      {/* Atmospheric Portal Crossing Veil */}
      <mesh ref={portalVeilRef} visible={false} renderOrder={10}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#E87F3E" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* =====================================================================
          LAYER B: FOUR IMMERSIVE PLANETARY HABITATS (y = -24 stage)
         ===================================================================== */}
      <group ref={habitatGroupRef} visible={false}>
        <instancedMesh ref={habitatStarsRef} args={[undefined, undefined, starData.count]} frustumCulled={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#F5F3EF" transparent opacity={0.62} />
        </instancedMesh>

        <instancedMesh ref={habitatMotesRef} args={[undefined, undefined, habitatMotes.count]} frustumCulled={false}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#FFD090" transparent opacity={0.55} />
        </instancedMesh>

        {/* WORLD I — MERCURY: Cratered Metallic Basalt, Raking Sun & Obsidian Monoliths */}
        <group ref={mercuryWorldRef} position={[0, -24, 0]} visible={false}>
          <hemisphereLight args={['#FFD9A2', '#26140C', 1.35]} />
          <directionalLight color="#FFF1D4" position={[-6, 3.5, -10]} intensity={2.6} />
          <pointLight color="#FFE3B3" position={[-3.2, 2.4, -10]} intensity={7.8} distance={34} />
          <pointLight color="#E07234" position={[4.5, 0.2, 2]} intensity={3.5} distance={20} />

          {/* GLSL Atmospheric Horizon Sky Backdrop */}
          <mesh position={[0, 1.4, -18]} material={mercurySkyMat} renderOrder={-2}>
            <planeGeometry args={[52, 22]} />
          </mesh>

          <mesh position={[0, -2.15, -4]} geometry={mercuryTerrainGeom}>
            <meshStandardMaterial
              map={mercuryTex.map}
              bumpMap={mercuryTex.bumpMap}
              bumpScale={0.18}
              color="#B0A298"
              emissive="#4A210D"
              emissiveIntensity={0.44}
              metalness={0.68}
              roughness={0.3}
            />
          </mesh>

          {/* Scorching solar disc + seamless GLSL coronal diffraction aura */}
          <mesh position={[-3.4, 1.45, -14.2]}>
            <sphereGeometry args={[1.45, 32, 32]} />
            <meshBasicMaterial color="#FFF7E4" />
          </mesh>
          <mesh position={[-3.4, 1.45, -14.35]} material={mercurySunCoronaMat}>
            <planeGeometry args={[11.5, 11.5]} />
          </mesh>
          <mesh position={[0, -0.35, -10.5]} material={mercuryHazeMat}>
            <planeGeometry args={[38, 6.5]} />
          </mesh>

          {/* Faceted dark metallic monoliths flanking horizon */}
          {[-5.6, -2.8, 2.9, 5.8].map((sx, idx) => (
            <mesh
              key={idx}
              geometry={shardGeom}
              position={[sx, -0.95 + (idx % 2) * 0.45, -5.6 - idx * 1.1]}
              rotation={[0.2 * idx, idx * 0.8, (idx % 2 ? -1 : 1) * 0.24]}
              scale={4.6 + (idx % 2) * 1.4}
            >
              <meshStandardMaterial color="#7D7370" metalness={0.82} roughness={0.22} />
            </mesh>
          ))}
        </group>

        {/* WORLD II — URANUS: Glacial Translucent Shelf, Dual GLSL Auroras & Overhead Ring */}
        <group ref={uranusWorldRef} position={[0, -24, 0]} visible={false}>
          <hemisphereLight args={['#DCF8F6', '#0A252E', 1.4]} />
          <directionalLight color="#E2FAF8" position={[3, 6, -6]} intensity={2.1} />
          <pointLight color="#CBECE9" position={[0, 4.8, -4]} intensity={6.4} distance={32} />
          <pointLight color="#1C80B4" position={[-5, 0, 2]} intensity={4.2} distance={22} />

          <mesh position={[0, 1.5, -18]} material={uranusSkyMat} renderOrder={-2}>
            <planeGeometry args={[52, 22]} />
          </mesh>

          <mesh position={[0, -2.05, -4]} geometry={uranusTerrainGeom}>
            {isLowPower ? (
              <meshStandardMaterial
                map={uranusTex.map}
                color="#467E84"
                emissive="#071E25"
                emissiveIntensity={0.36}
                metalness={0.28}
                roughness={0.26}
              />
            ) : (
              <meshPhysicalMaterial
                map={uranusTex.map}
                color="#4E8A90"
                emissive="#071E25"
                emissiveIntensity={0.34}
                metalness={0.18}
                roughness={0.22}
                clearcoat={0.72}
                clearcoatRoughness={0.18}
              />
            )}
          </mesh>

          {/* Sweeping multi-layered aurora silk curtains overhead */}
          <mesh position={[0, 1.9, -6.8]} rotation={[0.14, 0, 0]} material={auroraRibbonMat}>
            <planeGeometry args={[26, 5.4, 32, 8]} />
          </mesh>
          <mesh position={[1.4, 1.35, -9.8]} rotation={[0.1, -0.18, 0.06]} material={auroraRibbonMat}>
            <planeGeometry args={[30, 6.0, 32, 8]} />
          </mesh>

          {/* Overhead crystalline ring arc */}
          <mesh position={[0, -0.6, -7.8]} rotation={[1.22, 0.14, 0.32]}>
            <torusGeometry args={[8.6, 0.055, 12, isLowPower ? 56 : 112]} />
            <meshBasicMaterial color="#AEE0DE" transparent opacity={0.36} />
          </mesh>
          <mesh position={[0, -0.58, -7.8]} rotation={[1.22, 0.14, 0.32]}>
            <torusGeometry args={[9.35, 0.025, 8, isLowPower ? 56 : 112]} />
            <meshBasicMaterial color="#7CB4B4" transparent opacity={0.22} />
          </mesh>

          {/* Translucent glacial crystal spires */}
          {[-4.3, -1.7, 2.1, 4.6].map((ix, idx) => (
            <mesh
              key={idx}
              geometry={shardGeom}
              position={[ix, -0.65 + (idx % 2) * 0.45, -5.2 - idx * 0.95]}
              rotation={[0.28, idx * 0.7, -0.18]}
              scale={3.1 + (idx % 3) * 0.65}
            >
              <meshStandardMaterial color="#8CC8CA" metalness={0.38} roughness={0.14} transparent opacity={0.62} />
            </mesh>
          ))}
        </group>

        {/* WORLD III — PLUTO: Cryogenic Nitrogen Ridges, Valley Mist & Fresnel Charon */}
        <group ref={plutoWorldRef} position={[0, -24, 0]} visible={false}>
          <hemisphereLight args={['#BBD2EC', '#111620', 1.2]} />
          <directionalLight color="#DCE8F8" position={[5, 4.5, -10]} intensity={2.4} />
          <pointLight color="#B8D0EC" position={[3.2, 4.2, -11]} intensity={5.4} distance={32} />
          <pointLight color="#56667E" position={[-4, 1.4, 2]} intensity={3.0} distance={20} />

          <mesh position={[0, 1.4, -18]} material={plutoSkyMat} renderOrder={-2}>
            <planeGeometry args={[52, 22]} />
          </mesh>

          <mesh position={[0, -2.1, -4]} geometry={plutoTerrainGeom}>
            <meshStandardMaterial
              map={plutoTex.map}
              bumpMap={plutoTex.bumpMap}
              bumpScale={0.2}
              color="#8C99AE"
              emissive="#182230"
              emissiveIntensity={0.48}
              metalness={0.22}
              roughness={0.58}
            />
          </mesh>

          <mesh position={[0, -0.55, -10.5]} material={plutoHazeMat}>
            <planeGeometry args={[38, 6.0]} />
          </mesh>

          {/* Towering companion moon Charon glowing with GLSL Fresnel atmosphere */}
          <group position={[3.5, 2.25, -14.5]}>
            <mesh>
              <sphereGeometry args={[2.25, 36, 36]} />
              <meshStandardMaterial
                map={plutoTex.map}
                color="#A6B3C6"
                emissive="#253042"
                emissiveIntensity={0.52}
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
            <mesh scale={1.12} material={charonAtmoMat}>
              <sphereGeometry args={[2.25, 28, 28]} />
            </mesh>
          </group>
        </group>

        {/* WORLD IV — MARS: Terracotta Dunes, Sandstone Canyon Mesas & Ochre Dusk */}
        <group ref={marsWorldRef} position={[0, -24, 0]} visible={false}>
          <hemisphereLight args={['#FFB07A', '#360F06', 1.25]} />
          <directionalLight color="#FFC28E" position={[5, 4, -8]} intensity={2.3} />
          <pointLight color="#FFA86B" position={[4.5, 3.4, -10]} intensity={6.0} distance={32} />
          <pointLight color="#B83214" position={[-4, 0.8, 2]} intensity={3.5} distance={20} />

          <mesh position={[0, 1.4, -18]} material={marsSkyMat} renderOrder={-2}>
            <planeGeometry args={[52, 22]} />
          </mesh>

          <mesh position={[0, -2.2, -4]} geometry={marsTerrainGeom}>
            <meshStandardMaterial
              map={marsTex.map}
              bumpMap={marsTex.bumpMap}
              bumpScale={0.2}
              emissive="#D44816"
              emissiveMap={marsTex.emissiveMap}
              emissiveIntensity={0.76}
              color="#DE7244"
              metalness={0.08}
              roughness={0.76}
            />
          </mesh>

          {/* Flanking sculpted stratified red sandstone canyon buttes */}
          {[-6.4, -4.1, 4.4, 6.7].map((mx, idx) => (
            <mesh
              key={idx}
              geometry={mesaGeom}
              position={[mx, -1.25, -6.8 - idx * 0.95]}
              rotation={[0, idx * 1.15, 0]}
              scale={[1.45 + (idx % 2) * 0.45, 1.15 + (idx % 3) * 0.35, 1.35]}
            >
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#6E2612' : '#863318'}
                roughness={0.88}
                metalness={0.05}
              />
            </mesh>
          ))}

          {/* Low ochre-terracotta horizon dust atmosphere & seamless GLSL solar dusk glow */}
          <mesh position={[0, -0.35, -9.5]} material={marsHazeMat}>
            <planeGeometry args={[38, 6.4]} />
          </mesh>
          <mesh position={[3.8, 2.05, -14.2]}>
            <sphereGeometry args={[0.88, 24, 24]} />
            <meshBasicMaterial color="#FFE2C2" />
          </mesh>
          <mesh position={[3.8, 2.05, -14.35]} material={marsSunCoronaMat}>
            <planeGeometry args={[7.8, 7.8]} />
          </mesh>
        </group>
      </group>
    </>
  );
}
