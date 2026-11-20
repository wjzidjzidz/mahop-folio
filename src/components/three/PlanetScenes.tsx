import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createPlanetTextures } from './webglCapabilities';

export type PlanetKind = 'mercury' | 'uranus' | 'pluto' | 'mars';

interface PlanetScenesProps {
  planet: PlanetKind;
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}

const _dummy = new THREE.Object3D();

const PLANET_SPEC: Record<
  PlanetKind,
  {
    radius: number;
    basePos: [number, number, number];
    keyColor: string;
    keyPos: [number, number, number];
    rimColor: string;
    hemiSky: string;
    hemiGround: string;
    fogColor: string;
    particleColor: string;
    particleCountDesktop: number;
    particleCountMobile: number;
    roughness: number;
    metalness: number;
    bumpScale: number;
    axialTilt: [number, number, number];
  }
> = {
  mercury: {
    radius: 2.05,
    basePos: [0.65, -0.04, -0.6],
    keyColor: '#F3EEE8',
    keyPos: [5.5, 2.5, 4.2],
    rimColor: '#B8967A',
    hemiSky: '#8D8684',
    hemiGround: '#1F1C1C',
    fogColor: '#050506',
    particleColor: '#CFCAC6',
    particleCountDesktop: 170,
    particleCountMobile: 64,
    roughness: 0.36,
    metalness: 0.62,
    bumpScale: 0.068,
    axialTilt: [0.14, 0.25, 0.06],
  },
  uranus: {
    radius: 2.1,
    basePos: [0.52, 0.06, -0.8],
    keyColor: '#E9FAFA',
    keyPos: [-5.0, 2.8, 4.5],
    rimColor: '#95BFBC',
    hemiSky: '#B8E5E3',
    hemiGround: '#16353B',
    fogColor: '#040A0B',
    particleColor: '#D6F2F0',
    particleCountDesktop: 210,
    particleCountMobile: 78,
    roughness: 0.42,
    metalness: 0.08,
    bumpScale: 0.015,
    axialTilt: [0.58, 0.12, -0.78],
  },
  pluto: {
    radius: 1.72,
    basePos: [0.42, 0.08, -1.05],
    keyColor: '#CBD4DF',
    keyPos: [4.2, 3.0, 3.8],
    rimColor: '#6E7A88',
    hemiSky: '#565D66',
    hemiGround: '#111214',
    fogColor: '#030406',
    particleColor: '#9CA6B2',
    particleCountDesktop: 110,
    particleCountMobile: 48,
    roughness: 0.84,
    metalness: 0.1,
    bumpScale: 0.064,
    axialTilt: [0.24, -0.1, 0.16],
  },
  mars: {
    radius: 2.08,
    basePos: [0.48, 0.02, -0.65],
    keyColor: '#FFD6B0',
    keyPos: [5.2, 2.0, 4.0],
    rimColor: '#E87F3E',
    hemiSky: '#E87F3E',
    hemiGround: '#320C06',
    fogColor: '#0A0302',
    particleColor: '#F09B64',
    particleCountDesktop: 220,
    particleCountMobile: 80,
    roughness: 0.78,
    metalness: 0.08,
    bumpScale: 0.072,
    axialTilt: [0.28, 0, 0.34],
  },
};

export function PlanetScenes({
  planet,
  scrollProgressRef,
  isStatic,
  isLowPower,
}: PlanetScenesProps) {
  const spec = PLANET_SPEC[planet];
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const veilRef = useRef<THREE.Mesh>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);
  const moonletGroupRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.InstancedMesh>(null);

  const maxAniso = useMemo(() => (isLowPower ? 1 : Math.min(8, gl.capabilities.getMaxAnisotropy())), [gl, isLowPower]);
  const textures = useMemo(
    () => createPlanetTextures(planet, isLowPower ? 256 : 512, maxAniso),
    [planet, isLowPower, maxAniso]
  );

  useEffect(() => {
    return () => {
      textures.dispose();
    };
  }, [textures]);

  // Mineral faceted monolith geometry for Mercury & volcanic boulders for Mars
  const shardGeom = useMemo(() => {
    const g = new THREE.OctahedronGeometry(0.16, 0);
    g.scale(0.8, 1.85, 0.65);
    return g;
  }, []);

  useEffect(() => {
    return () => shardGeom.dispose();
  }, [shardGeom]);

  const starData = useMemo(() => {
    const count = isLowPower ? 75 : 200;
    const items: Array<{ x: number; y: number; z: number; scale: number }> = [];
    for (let i = 0; i < count; i++) {
      const seed = (i + 1) * 9301 + 49297;
      const r1 = ((seed % 233280) / 233280) * 2 - 1;
      const r2 = (((seed * 3) % 233280) / 233280) * 2 - 1;
      const r3 = ((seed * 7) % 233280) / 233280;
      items.push({
        x: r1 * 13,
        y: r2 * 8,
        z: -4.5 - r3 * 10,
        scale: 0.012 + r3 * 0.028,
      });
    }
    return { count, items };
  }, [isLowPower]);

  const dustData = useMemo(() => {
    const count = isLowPower ? spec.particleCountMobile : spec.particleCountDesktop;
    const items: Array<{
      angle: number;
      radius: number;
      yOffset: number;
      speed: number;
      scale: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      items.push({
        angle: t * Math.PI * 2 * 6.1,
        radius: spec.radius * (1.25 + ((i * 17) % 31) * 0.042),
        yOffset:
          planet === 'uranus'
            ? (((i * 23) % 41) / 41 - 0.5) * 0.28 // aligned closely with Uranus ring plane
            : (((i * 23) % 41) / 41 - 0.5) * 3.6,
        speed: planet === 'pluto' ? 0.025 + ((i * 13) % 19) * 0.004 : 0.065 + ((i * 13) % 19) * 0.008,
        scale: planet === 'uranus' ? 0.016 + ((i * 7) % 11) * 0.003 : 0.012 + ((i * 7) % 11) * 0.0025,
      });
    }
    return { count, items };
  }, [isLowPower, planet, spec.particleCountDesktop, spec.particleCountMobile, spec.radius]);

  useEffect(() => {
    const stars = starsRef.current;
    if (!stars) return;
    starData.items.forEach((s, i) => {
      _dummy.position.set(s.x, s.y, s.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.setScalar(s.scale);
      _dummy.updateMatrix();
      stars.setMatrixAt(i, _dummy.matrix);
    });
    stars.instanceMatrix.needsUpdate = true;
    stars.computeBoundingSphere();
  }, [starData]);

  useEffect(() => {
    const dust = dustRef.current;
    if (!dust) return;
    dustData.items.forEach((d, i) => {
      _dummy.position.set(Math.cos(d.angle) * d.radius, d.yOffset, Math.sin(d.angle) * d.radius);
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
    const scrollP = scrollProgressRef.current;

    if (globeRef.current) {
      if (!isStatic) {
        const spin = planet === 'pluto' ? 0.032 : planet === 'uranus' ? 0.075 : 0.095;
        globeRef.current.rotation.y += dt * spin;
      } else {
        globeRef.current.rotation.y = 0.4 + scrollP * 0.4;
      }
    }

    if (veilRef.current && !isStatic) {
      veilRef.current.rotation.y -= dt * 0.045;
    }

    // Gently push planet deeper along Z & shift laterally as scroll advances so foreground photos dominate
    if (groupRef.current) {
      const targetX = spec.basePos[0] + (scrollP - 0.5) * -0.45;
      const targetY = spec.basePos[1] + (scrollP - 0.5) * 0.24;
      const targetZ = spec.basePos[2] - scrollP * 1.45;
      const factor = isStatic ? 1 : 0.08;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, factor);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, factor);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, factor);
    }

    if (shardsGroupRef.current && !isStatic) {
      shardsGroupRef.current.rotation.y += dt * (planet === 'mars' ? 0.14 : 0.09);
    }

    if (moonletGroupRef.current && !isStatic) {
      const t = state.clock.elapsedTime * 0.16;
      moonletGroupRef.current.position.set(
        Math.cos(t) * 2.85,
        Math.sin(t * 0.7) * 0.55,
        Math.sin(t) * 1.8
      );
      moonletGroupRef.current.rotation.y += dt * 0.25;
    }

    if (dustRef.current && !isStatic) {
      const elapsed = state.clock.elapsedTime;
      for (let i = 0; i < dustData.count; i++) {
        const d = dustData.items[i];
        const a = d.angle + elapsed * d.speed;
        _dummy.position.set(
          Math.cos(a) * d.radius,
          d.yOffset + Math.sin(elapsed * 0.3 + i) * (planet === 'uranus' ? 0.03 : 0.09),
          Math.sin(a) * d.radius
        );
        _dummy.rotation.set(a, i, 0);
        _dummy.scale.setScalar(d.scale);
        _dummy.updateMatrix();
        dustRef.current.setMatrixAt(i, _dummy.matrix);
      }
      dustRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const sphereSegments = isLowPower ? 36 : 64;

  return (
    <>
      <fog attach="fog" args={[spec.fogColor, 6, 18]} />
      <hemisphereLight args={[spec.hemiSky, spec.hemiGround, planet === 'pluto' ? 0.5 : 0.95]} />
      <directionalLight color={spec.keyColor} position={spec.keyPos} intensity={planet === 'pluto' ? 1.85 : 2.5} />
      <pointLight color={spec.rimColor} position={[-5.2, -2.6, -2.5]} intensity={2.4} distance={16} />

      {/* Distant celestial starfield */}
      <instancedMesh ref={starsRef} args={[undefined, undefined, starData.count]} frustumCulled={false}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#F5F3EF" transparent opacity={planet === 'pluto' ? 0.65 : 0.5} />
      </instancedMesh>

      <group ref={groupRef} position={spec.basePos} rotation={spec.axialTilt}>
        {/* Primary Planetary Sphere */}
        <mesh ref={globeRef}>
          <sphereGeometry args={[spec.radius, sphereSegments, sphereSegments]} />
          <meshStandardMaterial
            map={textures.map}
            bumpMap={textures.bumpMap}
            bumpScale={spec.bumpScale}
            roughnessMap={textures.roughnessMap}
            roughness={spec.roughness}
            metalness={spec.metalness}
            emissive={planet === 'mars' ? '#FF5E1E' : '#000000'}
            emissiveMap={textures.emissiveMap}
            emissiveIntensity={planet === 'mars' ? 1.35 : 0}
          />
        </mesh>

        {/* MERCURY: Metallic graphite mineral ring arc + orbiting basalt/metal monolith shards */}
        {planet === 'mercury' && (
          <group ref={shardsGroupRef}>
            <mesh rotation={[Math.PI * 0.42, 0.2, 0]}>
              <torusGeometry args={[spec.radius * 1.48, 0.015, 8, isLowPower ? 48 : 96]} />
              <meshStandardMaterial color="#A39C9A" metalness={0.85} roughness={0.22} transparent opacity={0.42} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              const dist = spec.radius * 1.45 + (i % 2) * 0.28;
              return (
                <group key={i} position={[Math.cos(a) * dist, ((i % 3) - 1) * 0.42, Math.sin(a) * dist]} rotation={[i, a, 0.3]}>
                  <mesh geometry={shardGeom} scale={0.7 + (i % 3) * 0.25}>
                    <meshStandardMaterial color="#7B7373" metalness={0.82} roughness={0.28} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* URANUS: Counter-rotating translucent cloud veil + Rayleigh cyan corona + multi-band ice rings */}
        {planet === 'uranus' && (
          <>
            <mesh ref={veilRef} scale={1.028}>
              <sphereGeometry args={[spec.radius, isLowPower ? 28 : 44, isLowPower ? 28 : 44]} />
              <meshStandardMaterial
                color="#CBECE9"
                transparent
                opacity={0.18}
                roughness={0.2}
                depthWrite={false}
              />
            </mesh>
            <mesh scale={1.09}>
              <sphereGeometry args={[spec.radius, isLowPower ? 24 : 40, isLowPower ? 24 : 40]} />
              <meshBasicMaterial
                color="#95BFBC"
                transparent
                opacity={0.18}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[Math.PI * 0.49, 0.06, 0]}>
              <ringGeometry args={[spec.radius * 1.32, spec.radius * 2.05, isLowPower ? 56 : 112]} />
              <meshBasicMaterial
                map={textures.ringMap}
                transparent
                opacity={0.78}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </>
        )}

        {/* PLUTO: Multi-part frozen binary moonlet (core + icy frost shell) + faint frost rim */}
        {planet === 'pluto' && (
          <>
            <mesh scale={1.05}>
              <sphereGeometry args={[spec.radius, isLowPower ? 24 : 36, isLowPower ? 24 : 36]} />
              <meshBasicMaterial color="#6D7A8A" transparent opacity={0.09} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <group ref={moonletGroupRef} position={[2.85, 0.4, -0.5]}>
              <mesh>
                <sphereGeometry args={[0.32, 20, 20]} />
                <meshStandardMaterial color="#585B5E" roughness={0.9} metalness={0.06} />
              </mesh>
              <mesh position={[0.06, 0.12, 0.04]} scale={0.78}>
                <dodecahedronGeometry args={[0.32, 1]} />
                <meshStandardMaterial color="#9BA6B2" roughness={0.42} metalness={0.12} />
              </mesh>
            </group>
          </>
        )}

        {/* MARS: Glowing warm dust corona + volcanic basalt boulder ring */}
        {planet === 'mars' && (
          <>
            <mesh scale={1.07}>
              <sphereGeometry args={[spec.radius, isLowPower ? 24 : 40, isLowPower ? 24 : 40]} />
              <meshBasicMaterial
                color="#E87F3E"
                transparent
                opacity={0.16}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </mesh>
            <group ref={shardsGroupRef}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const a = (i / 7) * Math.PI * 2;
                const dist = spec.radius * 1.42 + (i % 2) * 0.35;
                return (
                  <mesh
                    key={i}
                    position={[Math.cos(a) * dist, Math.sin(a * 2) * 0.38, Math.sin(a) * dist]}
                    rotation={[i * 0.7, a, 0.4]}
                    scale={0.65 + (i % 3) * 0.22}
                  >
                    <dodecahedronGeometry args={[0.14, 0]} />
                    <meshStandardMaterial color="#6E2414" roughness={0.88} metalness={0.05} />
                  </mesh>
                );
              })}
            </group>
          </>
        )}

        {/* Fine environmental dust / icy crystals */}
        <instancedMesh ref={dustRef} args={[undefined, undefined, dustData.count]} frustumCulled={false}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={spec.particleColor} transparent opacity={planet === 'uranus' ? 0.62 : 0.48} />
        </instancedMesh>
      </group>
    </>
  );
}
