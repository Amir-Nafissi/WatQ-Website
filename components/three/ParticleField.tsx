"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Points as ThreePoints } from "three";

const COUNT = 3500;

// deterministic PRNG (mulberry32) — pure under React's render rules and
// gives the same particle field on every mount
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Cloud() {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(0x9e3779b9);
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // random point in a sphere shell for depth
      const r = 1.2 + rand() * 2.8;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // slow ambient drift
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.008;
    // observer effect: particles subtly follow the pointer
    const { x, y } = state.pointer;
    ref.current.rotation.y += (x * 0.15 - ref.current.rotation.y) * delta * 0.5;
    ref.current.rotation.x += (-y * 0.1 - ref.current.rotation.x) * delta * 0.5;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#8ab8d8"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 65 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
    >
      <Cloud />
    </Canvas>
  );
}
