"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Color, TorusKnotGeometry, type Points as ThreePoints } from "three";

const DESKTOP_COUNT = 50000;
const MOBILE_COUNT = 18000;
const REPEL_RADIUS = 1.5;
const REPEL_STRENGTH = 0.01;
const RETURN_STRENGTH = 0.001;
const DAMPING = 0.95;

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
  const knot = new TorusKnotGeometry(1.5, 0.5, 200, 32);
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

function WovenKnot({ count, active }: { count: number; active: React.RefObject<boolean> }) {
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
    points.rotation.y = t * 0.05;

    // True 3D repulsion (as in the original "Woven Light" component): the
    // cursor maps to a world point fixed on the z=0 plane, and particles are
    // pushed radially away from it in all three axes. Positions are compared
    // in the knot's *local* (unrotated) frame, so the disturbance swirls with
    // the spin. Until the first real pointer move, `state.pointer` sits at
    // (0,0) — dead centre — which would blow a hole in the middle of the knot
    // on load, so we hold off any repulsion until the cursor has actually moved.
    const repel = active.current;
    const mx = state.pointer.x * 3;
    const my = state.pointer.y * 3;

    const pos = points.geometry.attributes.position
      .array as Float32Array;

    const count = originals.length / 3;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const dx = pos[ix] - mx;
      const dy = pos[iy] - my;
      const dz = pos[iz];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (repel && dist < REPEL_RADIUS && dist > 1e-4) {
        // push away along the normalized (dx, dy, dz) direction
        const force = ((REPEL_RADIUS - dist) * REPEL_STRENGTH) / dist;
        velocities[ix] += dx * force;
        velocities[iy] += dy * force;
        velocities[iz] += dz * force;
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
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={1}
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

  // Repulsion stays off until the cursor genuinely moves; without this the
  // pointer's default (0,0) reads as a hover dead-centre and punches a hole
  // in the knot on first load.
  const active = useRef(false);

  return (
    <Canvas
      // pull the camera back on narrow screens so the knot fits the width
      camera={{ position: [0, 0, mobile ? 6.6 : 5], fov: 75 }}
      dpr={[1, mobile ? 1.25 : 1.5]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
      onPointerMove={() => {
        active.current = true;
      }}
    >
      <WovenKnot count={mobile ? MOBILE_COUNT : DESKTOP_COUNT} active={active} />
    </Canvas>
  );
}
