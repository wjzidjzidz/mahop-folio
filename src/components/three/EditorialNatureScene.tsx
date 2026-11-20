import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EditorialNatureSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}

const _dummy = new THREE.Object3D();

/**
 * The Green Botanical World for MAH★P Act II (Editorial Studio Photography):
 * Undulating deep emerald meadow terrain, 1,600+ wind-swayed grass blades,
 * tall botanical reed silhouettes, soft warm sunlight shafts, and backlit pollen motes.
 */
export function EditorialNatureScene({
  scrollProgressRef,
  isStatic,
  isLowPower,
}: EditorialNatureSceneProps) {
  const bladesRef = useRef<THREE.InstancedMesh>(null);
  const reedsRef = useRef<THREE.InstancedMesh>(null);
  const pollenRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const bladeCount = isLowPower ? 400 : 1550;
  const reedCount = isLowPower ? 48 : 180;
  const pollenCount = isLowPower ? 45 : 140;

  // Undulating meadow ground geometry
  const groundGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(28, 18, 28, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const swell = Math.sin(x * 0.38) * 0.35 + Math.cos(y * 0.45) * 0.25;
      pos.setZ(i, swell);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => () => groundGeo.dispose(), [groundGeo]);

  const bladeSpecs = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      z: number;
      height: number;
      width: number;
      phase: number;
      baseLean: number;
      yaw: number;
      color: THREE.Color;
    }> = [];

    const palette = [
      new THREE.Color('#27411D'),
      new THREE.Color('#345727'),
      new THREE.Color('#485E39'),
      new THREE.Color('#618F65'),
      new THREE.Color('#7EA673'),
    ];

    for (let i = 0; i < bladeCount; i++) {
      const s1 = ((i * 7919 + 104729) % 10000) / 10000;
      const s2 = ((i * 3571 + 65537) % 10000) / 10000;
      const s3 = ((i * 1999 + 31337) % 10000) / 10000;
      const x = (s1 - 0.5) * 16;
      const z = -5.8 + s2 * 6.6;
      const groundY = -1.65 + Math.sin(x * 0.38) * 0.28 + Math.cos(z * 0.45) * 0.18;
      items.push({
        x,
        y: groundY,
        z,
        height: 0.78 + s3 * 1.28,
        width: 0.028 + s1 * 0.025,
        phase: s2 * Math.PI * 2 + s1 * 3.1,
        baseLean: (s3 - 0.5) * 0.24,
        yaw: s1 * Math.PI,
        color: palette[i % palette.length],
      });
    }
    return items;
  }, [bladeCount]);

  const reedSpecs = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      z: number;
      height: number;
      phase: number;
      color: THREE.Color;
    }> = [];
    const palette = [new THREE.Color('#4E7043'), new THREE.Color('#709460'), new THREE.Color('#92AC79')];
    for (let i = 0; i < reedCount; i++) {
      const s1 = ((i * 5381 + 87179) % 10000) / 10000;
      const s2 = ((i * 4211 + 19391) % 10000) / 10000;
      const x = (s1 - 0.5) * 15;
      const z = -4.6 + s2 * 6.5;
      const groundY = -1.65 + Math.sin(x * 0.38) * 0.28;
      items.push({
        x,
        y: groundY,
        z,
        height: 1.85 + s2 * 1.35,
        phase: s1 * 5.2,
        color: palette[i % palette.length],
      });
    }
    return items;
  }, [reedCount]);

  const pollenSpecs = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number; phase: number; scale: number }> = [];
    for (let i = 0; i < pollenCount; i++) {
      const s1 = ((i * 4409 + 12347) % 10000) / 10000;
      const s2 = ((i * 6733 + 54321) % 10000) / 10000;
      items.push({
        x: (s1 - 0.5) * 12,
        y: -0.4 + s2 * 3.6,
        z: -3.2 + s1 * 5.0,
        phase: s2 * Math.PI * 2,
        scale: 0.015 + s1 * 0.018,
      });
    }
    return items;
  }, [pollenCount]);

  useEffect(() => {
    const blades = bladesRef.current;
    if (!blades) return;
    bladeSpecs.forEach((b, i) => {
      blades.setColorAt(i, b.color);
      _dummy.position.set(b.x, b.y + b.height * 0.45, b.z);
      _dummy.rotation.set(b.baseLean, b.yaw, 0);
      _dummy.scale.set(b.width, b.height, 1);
      _dummy.updateMatrix();
      blades.setMatrixAt(i, _dummy.matrix);
    });
    if (blades.instanceColor) blades.instanceColor.needsUpdate = true;
    blades.instanceMatrix.needsUpdate = true;
    blades.computeBoundingSphere();
  }, [bladeSpecs]);

  useEffect(() => {
    const reeds = reedsRef.current;
    if (!reeds) return;
    reedSpecs.forEach((r, i) => {
      reeds.setColorAt(i, r.color);
      _dummy.position.set(r.x, r.y + r.height * 0.5, r.z);
      _dummy.rotation.set(0.06, i * 0.5, 0);
      _dummy.scale.set(0.024, r.height, 0.024);
      _dummy.updateMatrix();
      reeds.setMatrixAt(i, _dummy.matrix);
    });
    if (reeds.instanceColor) reeds.instanceColor.needsUpdate = true;
    reeds.instanceMatrix.needsUpdate = true;
    reeds.computeBoundingSphere();
  }, [reedSpecs]);

  useEffect(() => {
    const pollen = pollenRef.current;
    if (!pollen) return;
    pollenSpecs.forEach((p, i) => {
      _dummy.position.set(p.x, p.y, p.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.setScalar(p.scale);
      _dummy.updateMatrix();
      pollen.setMatrixAt(i, _dummy.matrix);
    });
    pollen.instanceMatrix.needsUpdate = true;
    pollen.computeBoundingSphere();
  }, [pollenSpecs]);

  useFrame((state) => {
    const scrollP = scrollProgressRef.current;
    if (groupRef.current) {
      const targetY = (scrollP - 0.5) * 0.42;
      const targetZ = -scrollP * 0.85;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, isStatic ? 1 : 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, isStatic ? 1 : 0.08);
    }

    if (isStatic) return;

    const t = state.clock.elapsedTime;
    const blades = bladesRef.current;
    if (blades) {
      for (let i = 0; i < bladeCount; i++) {
        const b = bladeSpecs[i];
        const gust = Math.sin(t * 0.95 + b.phase + b.x * 0.35) * 0.18;
        const counter = Math.cos(t * 0.55 + b.z * 0.5) * 0.08;
        _dummy.position.set(b.x, b.y + b.height * 0.45, b.z);
        _dummy.rotation.set(b.baseLean + counter, b.yaw, gust);
        _dummy.scale.set(b.width, b.height, 1);
        _dummy.updateMatrix();
        blades.setMatrixAt(i, _dummy.matrix);
      }
      blades.instanceMatrix.needsUpdate = true;
    }

    const reeds = reedsRef.current;
    if (reeds) {
      for (let i = 0; i < reedCount; i++) {
        const r = reedSpecs[i];
        const sway = Math.sin(t * 0.72 + r.phase + r.x * 0.25) * 0.14;
        _dummy.position.set(r.x, r.y + r.height * 0.5, r.z);
        _dummy.rotation.set(0.05, i * 0.5, sway);
        _dummy.scale.set(0.024, r.height, 0.024);
        _dummy.updateMatrix();
        reeds.setMatrixAt(i, _dummy.matrix);
      }
      reeds.instanceMatrix.needsUpdate = true;
    }

    const pollen = pollenRef.current;
    if (pollen) {
      for (let i = 0; i < pollenCount; i++) {
        const p = pollenSpecs[i];
        _dummy.position.set(
          p.x + Math.sin(t * 0.25 + p.phase) * 0.38,
          p.y + Math.cos(t * 0.3 + p.phase) * 0.2,
          p.z
        );
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(p.scale);
        _dummy.updateMatrix();
        pollen.setMatrixAt(i, _dummy.matrix);
      }
      pollen.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#091407', 4.2, 14]} />
      <hemisphereLight args={['#CAE0BD', '#182A12', 1.1]} />
      <directionalLight color="#EFE5C6" position={[4.2, 6.2, 3.2]} intensity={1.7} />
      <pointLight color="#618F65" position={[-3.8, 1.8, 2.2]} intensity={1.2} distance={13} />

      <group ref={groupRef}>
        {/* Botanical ground hills */}
        <mesh geometry={groundGeo} position={[0, -1.72, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#182D12" roughness={0.94} metalness={0.03} />
        </mesh>

        {/* Subtle sunlit atmospheric shafts through foliage */}
        <mesh position={[-1.4, 1.3, -2.6]} rotation={[0, 0, -0.34]}>
          <planeGeometry args={[1.9, 8.2]} />
          <meshBasicMaterial color="#DCE6BA" transparent opacity={0.055} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[1.8, 1.1, -3.1]} rotation={[0, 0, -0.28]}>
          <planeGeometry args={[1.4, 7.6]} />
          <meshBasicMaterial color="#B5CFA1" transparent opacity={0.045} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>

        {/* Grass blades */}
        <instancedMesh ref={bladesRef} args={[undefined, undefined, bladeCount]} frustumCulled={false}>
          <coneGeometry args={[0.5, 1, 3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.78} metalness={0.04} />
        </instancedMesh>

        {/* Tall botanical reeds */}
        <instancedMesh ref={reedsRef} args={[undefined, undefined, reedCount]} frustumCulled={false}>
          <cylinderGeometry args={[0.28, 0.72, 1, 5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.82} metalness={0.04} />
        </instancedMesh>

        {/* Pollen & soft botanical sunlight motes */}
        <instancedMesh ref={pollenRef} args={[undefined, undefined, pollenCount]} frustumCulled={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#EBF2D4" transparent opacity={0.42} />
        </instancedMesh>
      </group>
    </>
  );
}
