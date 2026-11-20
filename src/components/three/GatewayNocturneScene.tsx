import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GatewayNocturneSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isStatic: boolean;
  isLowPower: boolean;
}

const _dummy = new THREE.Object3D();

/**
 * Opening Gateway 3D Nocturne Stage:
 * Deep celestial dust field + quiet monumental constellation orbit ring
 * sitting behind the oversized MAH★P wordmark and multi-directional drifting plates.
 */
export function GatewayNocturneScene({
  scrollProgressRef,
  isStatic,
  isLowPower,
}: GatewayNocturneSceneProps) {
  const starsRef = useRef<THREE.InstancedMesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const starCount = isLowPower ? 90 : 220;

  const starSpecs = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number; scale: number; phase: number }> = [];
    for (let i = 0; i < starCount; i++) {
      const s1 = ((i * 7919 + 104729) % 10000) / 10000;
      const s2 = ((i * 3571 + 65537) % 10000) / 10000;
      const s3 = ((i * 1999 + 31337) % 10000) / 10000;
      items.push({
        x: (s1 - 0.5) * 14,
        y: (s2 - 0.5) * 9,
        z: -2 - s3 * 8,
        scale: 0.012 + s3 * 0.025,
        phase: s1 * Math.PI * 2,
      });
    }
    return items;
  }, [starCount]);

  useEffect(() => {
    const mesh = starsRef.current;
    if (!mesh) return;
    starSpecs.forEach((s, i) => {
      _dummy.position.set(s.x, s.y, s.z);
      _dummy.scale.setScalar(s.scale);
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [starSpecs]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = scrollProgressRef.current;
    if (ringRef.current) {
      if (!isStatic) {
        ringRef.current.rotation.z += dt * 0.04;
      }
      ringRef.current.rotation.x = 1.15 + p * 0.35;
      ringRef.current.scale.setScalar(1 + p * 0.4);
    }
    if (starsRef.current && !isStatic) {
      const t = state.clock.elapsedTime;
      starsRef.current.rotation.y = Math.sin(t * 0.08) * 0.06;
      starsRef.current.position.y = -p * 0.8;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#000000', 5, 16]} />
      <ambientLight color="#2E2626" intensity={0.65} />
      <pointLight color="#6B1111" position={[-4, 2, 2]} intensity={2.2} distance={14} />
      <pointLight color="#F5F3EF" position={[4, -2, 3]} intensity={1.1} distance={14} />

      <instancedMesh ref={starsRef} args={[undefined, undefined, starCount]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#F5F3EF" transparent opacity={0.55} />
      </instancedMesh>

      <mesh ref={ringRef} position={[0, 0, -2.5]} rotation={[1.15, 0.15, 0]}>
        <torusGeometry args={[2.9, 0.012, 12, isLowPower ? 64 : 128]} />
        <meshStandardMaterial color="#8E8782" metalness={0.75} roughness={0.28} transparent opacity={0.38} />
      </mesh>
    </>
  );
}
