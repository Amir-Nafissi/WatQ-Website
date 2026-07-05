"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Color, TorusKnotGeometry, type Points as ThreePoints } from "three";

const DESKTOP_COUNT = 24000;
const MOBILE_COUNT = 10000;
const REPEL_RADIUS = 1.1;
const REPEL_STRENGTH = 0.012;
const RETURN_STRENGTH = 0.002;
const DAMPING = 0.94;

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

/**
 * A torus knot "woven" from light particles. The cursor repels nearby
 * particles, which spring back to their place in the weave with damping.
 */
function buildWeave(count: number) {
  const rand = mulberry32(0x9e3779b9);
  const knot = new TorusKnotGeometry(1.5, 0.45, 220, 36);
  const source = knot.attributes.position;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const photon = new Color("#FF007F");
  const qubit = new Color("#00F0FF");
  const c = new Color();

  for (let i = 0; i < count; i++) {
    const v = i % source.count;
    positions[i * 3] = source.getX(v);
    positions[i * 3 + 1] = source.getY(v);
    positions[i * 3 + 2] = source.getZ(v);

    // photon → qubit gradient along the strand, with slight shimmer
    c.lerpColors(photon, qubit, (v / source.count + rand() * 0.15) % 1);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  knot.dispose();
  return { positions, colors };
}

function WovenKnot({ count }: { count: number }) {
  const ref = useRef<ThreePoints>(null);

  const { positions, colors } = useMemo(() => buildWeave(count), [count]);

  // mutable simulation state, owned by the animation loop (not render);
  // `count` is fixed for the lifetime of the component (set once at mount)
  const sim = useRef<{ originals: Float32Array; velocities: Float32Array } | null>(null);
  if (sim.current === null) {
    sim.current = {
      originals: Float32Array.from(positions),
      velocities: new Float32Array(count * 3),
    };
  }

  useFrame((state) => {
    const points = ref.current;
    if (!points || !sim.current) return;
    const { originals, velocities } = sim.current;

    const t = state.clock.getElapsedTime();
    points.rotation.y = t * 0.08;

    // Screen-space (cylindrical) repulsion: distance to the cursor is
    // measured in world x/y only, ignoring depth, so every strand under
    // the pointer ripples — near side and far side alike.
    const wx = state.pointer.x * 3.2;
    const wy = state.pointer.y * 3.2;
    const cos = Math.cos(points.rotation.y);
    const sin = Math.sin(points.rotation.y);

    const pos = points.geometry.attributes.position
      .array as Float32Array;

    const count = originals.length / 3;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      // particle x in world space (knot only rotates around Y, so world y = local y)
      const xw = pos[ix] * cos + pos[iz] * sin;
      const dx = xw - wx;
      const dy = pos[iy] - wy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 1e-4) {
        const force = ((REPEL_RADIUS - dist) * REPEL_STRENGTH) / dist;
        // world-space push (dx, dy, 0), rotated back into the knot's frame
        const fx = dx * force;
        velocities[ix] += fx * cos;
        velocities[iy] += dy * force;
        velocities[iz] += fx * sin;
      }

      // spring back into the weave, then damp
      velocities[ix] =
        (velocities[ix] + (originals[ix] - pos[ix]) * RETURN_STRENGTH) *
        DAMPING;
      velocities[iy] =
        (velocities[iy] + (originals[iy] - pos[iy]) * RETURN_STRENGTH) *
        DAMPING;
      velocities[iz] =
        (velocities[iz] + (originals[iz] - pos[iz]) * RETURN_STRENGTH) *
        DAMPING;

      pos[ix] += velocities[ix];
      pos[iy] += velocities[iy];
      pos[iz] += velocities[iz];
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.016}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

export default function ParticleField() {
  // this component only mounts client-side (dynamic, ssr: false), so the
  // viewport is known at first render; sized once — no need to react to resize
  const [mobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  return (
    <Canvas
      // pull the camera back on narrow screens so the knot fits the width
      camera={{ position: [0, 0, mobile ? 6.6 : 5], fov: 70 }}
      dpr={[1, mobile ? 1.25 : 1.5]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
    >
      <WovenKnot count={mobile ? MOBILE_COUNT : DESKTOP_COUNT} />
    </Canvas>
  );
}
