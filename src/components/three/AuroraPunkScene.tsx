import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createUrbanGalleryTextures } from './webglCapabilities';

interface AuroraPunkSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}

const _dummy = new THREE.Object3D();

/**
 * Underground Concrete & Street-Art Installation Environment for AURORA:
 * Architectural poured concrete gallery walls & monolithic side piers,
 * procedural purple (#7C11B8) & crimson (#7B0000) spray washes,
 * layered torn-paper wheatpaste wall reliefs, overhead gallery spot cones,
 * and airborne urban dust.
 */
export function AuroraPunkScene({
  scrollProgressRef,
  isStatic,
  isLowPower,
}: AuroraPunkSceneProps) {
  const { gl } = useThree();
  const stageGroupRef = useRef<THREE.Group>(null);
  const purpleLightRef = useRef<THREE.PointLight>(null);
  const motesRef = useRef<THREE.InstancedMesh>(null);

  const maxAniso = useMemo(() => (isLowPower ? 1 : Math.min(8, gl.capabilities.getMaxAnisotropy())), [gl, isLowPower]);
  const urban = useMemo(
    () => createUrbanGalleryTextures(isLowPower ? 256 : 512, maxAniso),
    [isLowPower, maxAniso]
  );

  useEffect(() => {
    return () => {
      urban.dispose();
    };
  }, [urban]);

  const moteCount = isLowPower ? 50 : 140;
  const moteData = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number; phase: number; scale: number }> = [];
    for (let i = 0; i < moteCount; i++) {
      const s1 = ((i * 5119 + 19937) % 10000) / 10000;
      const s2 = ((i * 7717 + 41113) % 10000) / 10000;
      items.push({
        x: (s1 - 0.5) * 11,
        y: (s2 - 0.5) * 6.5,
        z: -2 + s1 * 3.6,
        phase: s2 * Math.PI * 2,
        scale: 0.014 + s1 * 0.015,
      });
    }
    return items;
  }, [moteCount]);

  useEffect(() => {
    const motes = motesRef.current;
    if (!motes) return;
    moteData.forEach((m, i) => {
      _dummy.position.set(m.x, m.y, m.z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.setScalar(m.scale);
      _dummy.updateMatrix();
      motes.setMatrixAt(i, _dummy.matrix);
    });
    motes.instanceMatrix.needsUpdate = true;
    motes.computeBoundingSphere();
  }, [moteData]);

  useFrame((state) => {
    const scrollP = scrollProgressRef.current;
    if (stageGroupRef.current) {
      const targetRotY = (scrollP - 0.5) * 0.16;
      const targetPosY = (scrollP - 0.5) * 0.48;
      const factor = isStatic ? 1 : 0.08;
      stageGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        stageGroupRef.current.rotation.y,
        targetRotY,
        factor
      );
      stageGroupRef.current.position.y = THREE.MathUtils.lerp(
        stageGroupRef.current.position.y,
        targetPosY,
        factor
      );
    }

    if (purpleLightRef.current && !isStatic) {
      const t = state.clock.elapsedTime;
      purpleLightRef.current.position.x = -2.4 + Math.sin(t * 0.35) * 1.1;
      purpleLightRef.current.intensity = 3.8 + Math.sin(t * 0.65) * 0.55;
    }

    if (motesRef.current && !isStatic) {
      const t = state.clock.elapsedTime;
      for (let i = 0; i < moteCount; i++) {
        const m = moteData[i];
        _dummy.position.set(
          m.x + Math.cos(t * 0.18 + m.phase) * 0.25,
          m.y + Math.sin(t * 0.22 + m.phase) * 0.22,
          m.z
        );
        _dummy.scale.setScalar(m.scale);
        _dummy.updateMatrix();
        motesRef.current.setMatrixAt(i, _dummy.matrix);
      }
      motesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#060508', 4.5, 15]} />
      <hemisphereLight args={['#8E7F9E', '#191314', 0.55]} />
      <directionalLight color="#E8E4DF" position={[2.5, 5.2, 5.2]} intensity={1.35} />
      <pointLight
        ref={purpleLightRef}
        color="#7C11B8"
        position={[-2.4, 1.3, 1.5]}
        intensity={4.0}
        distance={14}
      />
      <pointLight color="#7B0000" position={[3.2, -1.2, 1.2]} intensity={3.2} distance={12} />

      <group ref={stageGroupRef}>
        {/* Back architectural poured concrete wall */}
        <mesh position={[0, 0, -3.4]}>
          <planeGeometry args={[18, 11]} />
          <meshStandardMaterial
            map={urban.concreteMap}
            bumpMap={urban.concreteBump}
            bumpScale={0.04}
            roughness={0.9}
            metalness={0.08}
          />
        </mesh>

        {/* Brutalist left architectural concrete pier */}
        <mesh position={[-3.6, 0, -2.3]} rotation={[0, 0.22, 0]}>
          <boxGeometry args={[2.1, 7.6, 0.55]} />
          <meshStandardMaterial
            map={urban.concreteMap}
            bumpMap={urban.concreteBump}
            bumpScale={0.03}
            color="#2A282E"
            roughness={0.86}
            metalness={0.1}
          />
        </mesh>

        {/* Brutalist right architectural concrete pier */}
        <mesh position={[3.7, -0.1, -2.1]} rotation={[0, -0.24, 0]}>
          <boxGeometry args={[2.2, 7.2, 0.55]} />
          <meshStandardMaterial
            map={urban.concreteMap}
            bumpMap={urban.concreteBump}
            bumpScale={0.03}
            color="#262225"
            roughness={0.88}
            metalness={0.1}
          />
        </mesh>

        {/* Underground gallery floor plane */}
        <mesh position={[0, -2.85, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 8]} />
          <meshStandardMaterial color="#121114" roughness={0.72} metalness={0.18} />
        </mesh>

        {/* Wheatpasted torn-paper wall panels (layered cleanly ahead of back concrete wall) */}
        <mesh position={[-1.55, 0.55, -2.55]} rotation={[0, 0.05, -0.07]}>
          <planeGeometry args={[2.25, 3.35]} />
          <meshStandardMaterial map={urban.posterPurple} roughness={0.78} metalness={0.05} />
        </mesh>
        <mesh position={[1.75, -0.42, -2.35]} rotation={[0, -0.07, 0.06]}>
          <planeGeometry args={[2.1, 3.1]} />
          <meshStandardMaterial map={urban.posterCrimson} roughness={0.8} metalness={0.05} />
        </mesh>

        {/* Overhead gallery cone washes */}
        <mesh position={[-2.2, 1.2, -1.7]} rotation={[0, 0, 0.22]}>
          <coneGeometry args={[1.6, 6.2, 16, 1, true]} />
          <meshBasicMaterial color="#7C11B8" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[2.4, 1.0, -1.6]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[1.5, 6.0, 16, 1, true]} />
          <meshBasicMaterial color="#7B0000" transparent opacity={0.055} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>

        {/* Subtle airborne street dust */}
        <instancedMesh ref={motesRef} args={[undefined, undefined, moteCount]} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#D9CEE8" transparent opacity={0.35} />
        </instancedMesh>
      </group>
    </>
  );
}
