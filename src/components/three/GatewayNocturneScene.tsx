import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { IntroSyncState } from '../../context/ExhibitionStageContext';

interface GatewayNocturneSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  introStateRef: React.MutableRefObject<IntroSyncState>;
  isStatic: boolean;
  isLowPower: boolean;
  variant?: 'gateway' | 'ambient-archive';
}

const SIMPLEX_3D_GLSL = /* glsl */ `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p = p * 2.04 + vec3(13.1, 7.7, 5.3);
      a *= 0.5;
    }
    return v;
  }
`;

const PHOTOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormalDir;
  varying vec3 vObjPos;
  varying vec3 vViewDir;

  void main() {
    vObjPos = normalize(position);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormalDir = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PHOTOSPHERE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  varying vec3 vNormalDir;
  varying vec3 vObjPos;
  varying vec3 vViewDir;

  ${SIMPLEX_3D_GLSL}

  void main() {
    float ndotv = clamp(dot(normalize(vNormalDir), normalize(vViewDir)), 0.0, 1.0);
    float limb = pow(ndotv, 0.52);
    float fresnel = pow(1.0 - ndotv, 2.6);

    // Multi-layered turbulent solar convection cells & magnetic filaments
    vec3 flowA = vObjPos * 2.4 + vec3(uTime * 0.07, -uTime * 0.045, uTime * 0.055);
    float granA = fbm(flowA);
    vec3 flowB = vObjPos * 5.2 + vec3(-uTime * 0.11, uTime * 0.08, granA * 0.55);
    float granB = fbm(flowB);

    float heat = clamp(0.55 + granA * 0.42 + granB * 0.24, 0.0, 1.2);
    float filament = smoothstep(0.66, 0.96, granA * 0.5 + 0.5);
    float sunspot = smoothstep(-0.32, -0.62, granB);

    vec3 deepEmber = vec3(0.42, 0.07, 0.02);
    vec3 amberPlasma = vec3(0.98, 0.52, 0.16);
    vec3 goldCore = vec3(1.18, 0.88, 0.52);
    vec3 whiteHot = vec3(1.52, 1.38, 1.15);

    vec3 col = mix(deepEmber, amberPlasma, smoothstep(0.18, 0.62, heat));
    col = mix(col, goldCore, smoothstep(0.56, 0.92, heat));
    col = mix(col, whiteHot, filament * 0.68 + pow(ndotv, 2.2) * 0.45);
    col *= (1.0 - sunspot * 0.48);

    // Physical solar limb darkening + radiant chromosphere rim
    col *= mix(0.46, 1.12, limb);
    col += vec3(1.35, 0.64, 0.24) * fresnel * 0.95;

    float alpha = smoothstep(0.02, 0.28, uReveal);
    gl_FragColor = vec4(col * uReveal, alpha);
  }
`;

const CORONA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CORONA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  varying vec2 vUv;

  ${SIMPLEX_3D_GLSL}

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r > 1.0) discard;

    float angle = atan(p.y, p.x);

    // Volumetric anisotropic coronal streamers & light-diffusion halo
    float rayA = fbm(vec3(cos(angle) * 2.8, sin(angle) * 2.8, r * 1.4 - uTime * 0.12));
    float rayB = fbm(vec3(cos(angle * 2.0 + 0.8) * 3.4, sin(angle * 2.0 + 0.8) * 3.4, r * 2.0 - uTime * 0.18));
    float streamers = smoothstep(-0.15, 0.72, rayA * 0.65 + rayB * 0.42);

    // Smooth inverse-radial atmospheric bloom curve + edge fade to zero before quad boundary
    float coreGlow = exp(-r * 5.6) * 1.48;
    float midCorona = exp(-r * 2.75) * (0.52 + 0.44 * streamers);
    float outerDiffusion = exp(-r * 1.42) * (0.2 + 0.16 * streamers);
    float edgeMask = smoothstep(1.0, 0.2, r);

    float intensity = (coreGlow + midCorona + outerDiffusion) * edgeMask * uReveal;

    vec3 innerCol = vec3(1.42, 1.22, 0.9);
    vec3 midCol = vec3(0.98, 0.56, 0.24);
    vec3 outerCol = vec3(0.48, 0.14, 0.06);

    vec3 col = mix(outerCol, midCol, smoothstep(0.68, 0.22, r));
    col = mix(col, innerCol, smoothstep(0.34, 0.04, r));

    gl_FragColor = vec4(col * intensity, clamp(intensity, 0.0, 1.0));
  }
`;

const CHROMOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormalDir;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormalDir = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const CHROMOSPHERE_FRAG = /* glsl */ `
  uniform float uReveal;
  varying vec3 vNormalDir;
  varying vec3 vViewDir;
  void main() {
    float ndotv = abs(dot(normalize(vNormalDir), normalize(vViewDir)));
    // Soft bell-shaped atmospheric limb glow that fades smoothly to 0 at the outer sphere edge
    float edgeFade = smoothstep(0.0, 0.36, ndotv);
    float innerFade = pow(1.0 - ndotv, 1.65);
    float glow = edgeFade * innerFade * 1.45 * uReveal;
    vec3 col = mix(vec3(0.95, 0.42, 0.12), vec3(1.28, 0.92, 0.54), pow(ndotv, 0.7));
    gl_FragColor = vec4(col * glow, clamp(glow, 0.0, 1.0));
  }
`;

const STARFIELD_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBrightness;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vTwinkle = (0.58 + 0.42 * sin(uTime * 1.45 + aPhase)) * uBrightness;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (260.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STARFIELD_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float core = exp(-d * 9.5);
    float halo = smoothstep(0.5, 0.0, d) * 0.45;
    float alpha = (core + halo) * vTwinkle;
    gl_FragColor = vec4(vColor * (1.0 + core * 0.75), alpha);
  }
`;

/**
 * Shared Astronomical Star & Cosmic Nocturne Stage:
 * - Renders the volumetric procedural GLSL Astronomical Star (photosphere, plasma granulation,
 *   coronal streamers, atmospheric diffusion, and multi-depth bokeh starfield).
 * - Driven continuously from Intro Stage 2 -> Stage 3 -> Homepage Hero -> downward scroll into
 *   L'ÉTOILE MAHO with zero cut, zero fade-out gap, and zero duplicate animation restart.
 */
export function GatewayNocturneScene({
  scrollProgressRef,
  introStateRef,
  isStatic,
  isLowPower,
  variant = 'gateway',
}: GatewayNocturneSceneProps) {
  const { camera, gl } = useThree();
  const starGroupRef = useRef<THREE.Group>(null);
  const photosphereRef = useRef<THREE.Mesh>(null);
  const coronaBillboardRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const revealSmoothedRef = useRef(variant === 'ambient-archive' ? 0.25 : 0.0);

  const starCount = isLowPower ? 150 : 420;

  const starGeometry = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const phases = new Float32Array(starCount);

    const palette = [
      new THREE.Color('#FFF8EC'),
      new THREE.Color('#F5F3EF'),
      new THREE.Color('#FFD9A8'),
      new THREE.Color('#BCD6EB'),
    ];

    for (let i = 0; i < starCount; i++) {
      const s1 = ((i * 7919 + 104729) % 10000) / 10000;
      const s2 = ((i * 3571 + 65537) % 10000) / 10000;
      const s3 = ((i * 1999 + 31337) % 10000) / 10000;

      positions[i * 3] = (s1 - 0.5) * 20;
      positions[i * 3 + 1] = (s2 - 0.5) * 12;
      positions[i * 3 + 2] = -1.6 - s3 * 13.5;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.65 + s3 * 2.15;
      phases[i] = s1 * Math.PI * 2;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geom;
  }, [starCount]);

  const photosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
        },
        vertexShader: PHOTOSPHERE_VERT,
        fragmentShader: PHOTOSPHERE_FRAG,
        transparent: true,
        depthWrite: true,
      }),
    []
  );

  const coronaMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
        },
        vertexShader: CORONA_VERT,
        fragmentShader: CORONA_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const chromosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uReveal: { value: 0 },
        },
        vertexShader: CHROMOSPHERE_VERT,
        fragmentShader: CHROMOSPHERE_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const starfieldMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uBrightness: { value: 1 },
        },
        vertexShader: STARFIELD_VERT,
        fragmentShader: STARFIELD_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    return () => {
      starGeometry.dispose();
      photosphereMat.dispose();
      coronaMat.dispose();
      chromosphereMat.dispose();
      starfieldMat.dispose();
    };
  }, [starGeometry, photosphereMat, coronaMat, chromosphereMat, starfieldMat]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = isStatic ? 1.2 : state.clock.elapsedTime;
    const p = scrollProgressRef.current;

    const intro = introStateRef.current;
    const isArchive = variant === 'ambient-archive';
    const targetReveal = isArchive
      ? 0.0
      : intro.active
        ? 0.9
        : Math.max(0.28, 0.94 - p * 0.42);

    revealSmoothedRef.current =
      isStatic || intro.active
        ? targetReveal
        : THREE.MathUtils.damp(revealSmoothedRef.current, targetReveal, 14.0, dt);

    const rev = revealSmoothedRef.current;

    const targetCamZ =
      variant === 'gateway' ? 7.2 + p * 1.6 - rev * 0.45 : 7.8;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -p * 0.2, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);
    camera.lookAt(0, 0, -3.2);

    photosphereMat.uniforms.uTime.value = t;
    photosphereMat.uniforms.uReveal.value = rev;
    coronaMat.uniforms.uTime.value = t;
    coronaMat.uniforms.uReveal.value = rev;
    chromosphereMat.uniforms.uReveal.value = rev;

    starfieldMat.uniforms.uTime.value = t;
    starfieldMat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    starfieldMat.uniforms.uBrightness.value = isArchive
      ? 0.52
      : Math.max(0.35, 1.0 - p * 0.4);

    if (starGroupRef.current) {
      starGroupRef.current.visible = !isArchive && rev > 0.02;
      const baseScale = 0.32 + rev * 0.68;
      const scrollRecedeScale = variant === 'gateway' ? 1 - p * 0.18 : 1;
      starGroupRef.current.scale.setScalar(baseScale * scrollRecedeScale);
      starGroupRef.current.position.y = variant === 'gateway' ? p * 0.45 : 0.2;
    }

    if (photosphereRef.current && !isStatic) {
      photosphereRef.current.rotation.y += dt * 0.055;
      photosphereRef.current.rotation.x = 0.14;
    }

    if (coronaBillboardRef.current) {
      coronaBillboardRef.current.quaternion.copy(camera.quaternion);
    }

    if (ringRef.current) {
      if (!isStatic) {
        ringRef.current.rotation.z += dt * 0.04;
      }
      ringRef.current.rotation.x = 1.18 + p * 0.35;
      const rMat = ringRef.current.material as THREE.MeshStandardMaterial;
      rMat.opacity = isArchive ? 0.14 : 0.34 * Math.max(0.15, rev);
    }

    if (outerRingRef.current) {
      if (!isStatic) {
        outerRingRef.current.rotation.z -= dt * 0.024;
      }
      const oMat = outerRingRef.current.material as THREE.MeshBasicMaterial;
      oMat.opacity = isArchive ? 0.09 : 0.16 * Math.max(0.1, rev);
    }

    if (pointsRef.current && !isStatic) {
      pointsRef.current.rotation.y = Math.sin(t * 0.06) * 0.04;
      pointsRef.current.position.y = -p * 0.7;
    }
  });

  const sphereSegs = isLowPower ? 36 : 64;

  return (
    <>
      <fog attach="fog" args={['#000000', 8, 24]} />
      <ambientLight color="#382B24" intensity={0.7} />
      <pointLight
        color="#FFAE5C"
        position={[0, 0, -1.2]}
        intensity={variant === 'gateway' ? 3.2 : 1.0}
        distance={16}
      />
      <pointLight color="#6B1111" position={[-4, 2, 2]} intensity={1.4} distance={14} />

      {/* Restrained multi-depth stellar particle field */}
      <points ref={pointsRef} geometry={starGeometry} material={starfieldMat} frustumCulled={false} />

      {/* Center solar sphere omitted in ambient-archive so only subtle orbital rings/dust remain */}
      <group ref={starGroupRef} position={[0, 0, -3.2]} visible={variant !== 'ambient-archive'}>
        <mesh ref={photosphereRef} material={photosphereMat} renderOrder={2}>
          <sphereGeometry args={[1.48, sphereSegs, sphereSegs]} />
        </mesh>
        <mesh material={chromosphereMat} renderOrder={3}>
          <sphereGeometry args={[1.76, 40, 40]} />
        </mesh>
        <mesh ref={coronaBillboardRef} material={coronaMat} renderOrder={4}>
          <planeGeometry args={[12.5, 12.5]} />
        </mesh>
      </group>

      {/* Subtle constellation guide rings */}
      <mesh ref={ringRef} position={[0, 0, -3.2]} rotation={[1.18, 0.15, 0]}>
        <torusGeometry args={[3.25, 0.011, 10, isLowPower ? 64 : 128]} />
        <meshStandardMaterial
          color="#A2988E"
          metalness={0.78}
          roughness={0.28}
          transparent
          opacity={0.34}
        />
      </mesh>

      <mesh ref={outerRingRef} position={[0, 0, -3.4]} rotation={[1.34, -0.22, 0.2]}>
        <torusGeometry args={[4.5, 0.008, 8, isLowPower ? 48 : 96]} />
        <meshBasicMaterial color="#7B7373" transparent opacity={0.16} />
      </mesh>
    </>
  );
}
