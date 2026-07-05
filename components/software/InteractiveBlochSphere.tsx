"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { Quaternion, Vector3 } from "three";
import { RotateCcw } from "lucide-react";
import { useReducedMotionPref } from "@/components/motion/MotionProvider";
import {
  GATES,
  type BlochVector,
  type GateSpec,
  anglesFromBloch,
  normalizeBloch,
  readoutFromAngles,
  rotateBloch,
} from "@/lib/quantum";

// Bloch coords (z up = |0⟩, x toward viewer) ↔ three.js coords (y up)
function blochToThree(b: BlochVector): Vector3 {
  return new Vector3(b.y, b.z, b.x);
}
function threeToBloch(t: Vector3): BlochVector {
  return { x: t.z, y: t.x, z: t.y };
}

interface GateAnimation {
  axis: BlochVector;
  totalAngle: number;
  start: BlochVector;
  progress: number; // 0 → 1
}

const GATE_DURATION = 0.8; // seconds

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Generate points of a unit circle in the plane spanned by three.js axes a, b. */
function circlePoints(
  a: [number, number, number],
  b: [number, number, number],
  segments = 96
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push([a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s]);
  }
  return pts;
}

interface SceneProps {
  blochRef: React.RefObject<BlochVector>;
  animRef: React.RefObject<GateAnimation | null>;
  onFrame: (theta: number, phi: number, animating: boolean) => void;
  dragging: boolean;
  setDragging: (v: boolean) => void;
  setOrbiting: (v: boolean) => void;
}

function BlochScene({
  blochRef,
  animRef,
  onFrame,
  dragging,
  setDragging,
  setOrbiting,
}: SceneProps) {
  const vectorGroup = useRef<import("three").Group>(null);
  const scratch = useMemo(
    () => ({ dir: new Vector3(), quat: new Quaternion(), up: new Vector3(0, 1, 0) }),
    []
  );

  const equator = useMemo(() => circlePoints([1, 0, 0], [0, 0, 1]), []);
  const meridianA = useMemo(() => circlePoints([0, 1, 0], [0, 0, 1]), []);
  const meridianB = useMemo(() => circlePoints([0, 1, 0], [1, 0, 0]), []);

  useFrame((_, delta) => {
    // advance a running gate animation
    const anim = animRef.current;
    if (anim) {
      anim.progress = Math.min(1, anim.progress + delta / GATE_DURATION);
      const eased = easeInOutCubic(anim.progress);
      blochRef.current = rotateBloch(
        anim.start,
        anim.axis,
        anim.totalAngle * eased
      );
      if (anim.progress >= 1) animRef.current = null;
    }

    // orient the vector group toward the current state
    const b = blochRef.current;
    scratch.dir.copy(blochToThree(b)).normalize();
    scratch.quat.setFromUnitVectors(scratch.up, scratch.dir);
    vectorGroup.current?.quaternion.copy(scratch.quat);

    const { theta, phi } = anglesFromBloch(b);
    onFrame(theta, phi, animRef.current !== null);
  });

  /** Project a pointer ray onto the unit sphere (nearest silhouette point on miss). */
  const dragTo = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const o = e.ray.origin;
      const d = e.ray.direction;
      const od = o.dot(d);
      const disc = od * od - (o.lengthSq() - 1);
      const t = disc >= 0 ? -od - Math.sqrt(disc) : -od;
      const p = new Vector3().copy(d).multiplyScalar(t).add(o).normalize();
      animRef.current = null;
      blochRef.current = normalizeBloch(threeToBloch(p));
    },
    [animRef, blochRef]
  );

  return (
    <>
      {/* glass sphere body */}
      <mesh>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial color="#0A0A0F" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.1} />
      </mesh>

      {/* dashed equator + meridians (echoes the old SVG illustration) */}
      <Line points={equator} color="#475569" dashed dashSize={0.06} gapSize={0.05} lineWidth={1} transparent opacity={0.8} />
      <Line points={meridianA} color="#334155" dashed dashSize={0.06} gapSize={0.05} lineWidth={1} transparent opacity={0.6} />
      <Line points={meridianB} color="#334155" dashed dashSize={0.06} gapSize={0.05} lineWidth={1} transparent opacity={0.6} />

      {/* axes */}
      <Line points={[[0, -1.15, 0], [0, 1.15, 0]]} color="#475569" lineWidth={1} transparent opacity={0.7} />
      <Line points={[[-1.15, 0, 0], [1.15, 0, 0]]} color="#334155" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[0, 0, -1.15], [0, 0, 1.15]]} color="#334155" lineWidth={1} transparent opacity={0.5} />

      {/* labels */}
      <Html position={[0, 1.32, 0]} center style={{ pointerEvents: "none" }} className="pointer-events-none select-none font-mono text-sm text-ink">|0⟩</Html>
      <Html position={[0, -1.32, 0]} center style={{ pointerEvents: "none" }} className="pointer-events-none select-none font-mono text-sm text-ink">|1⟩</Html>
      <Html position={[0, 0, 1.3]} center style={{ pointerEvents: "none" }} className="pointer-events-none select-none font-mono text-xs text-ink-dim">x</Html>
      <Html position={[1.3, 0, 0]} center style={{ pointerEvents: "none" }} className="pointer-events-none select-none font-mono text-xs text-ink-dim">y</Html>

      {/* state vector: cylinder shaft + glowing tip, laid out along +Y and rotated */}
      <group ref={vectorGroup}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 1, 12]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.05, 16, 12]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
        {/* additive halo = glow */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.25} depthWrite={false} />
        </mesh>
        {/* generous invisible hitbox for dragging the tip (touch-friendly) */}
        <mesh
          position={[0, 1, 0]}
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (dragging) dragTo(e);
          }}
          onPointerUp={(e) => {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            setDragging(false);
          }}
        >
          <sphereGeometry args={[0.22, 12, 8]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>

      <OrbitControls
        enabled={!dragging}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.6}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI - 0.3}
        onStart={() => setOrbiting(true)}
        onEnd={() => setOrbiting(false)}
      />
    </>
  );
}

const fmt = (n: number, d = 2) => n.toFixed(d);

export default function InteractiveBlochSphere() {
  const reduced = useReducedMotionPref();
  const blochRef = useRef<BlochVector>({ x: 0, y: 0, z: 1 });
  const animRef = useRef<GateAnimation | null>(null);
  const lastReadout = useRef({ theta: -1, phi: -1 });

  const [dragging, setDragging] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [angles, setAngles] = useState({ theta: 0, phi: 0 });

  // called from useFrame — only re-render when the rounded values change
  const handleFrame = useCallback(
    (theta: number, phi: number, isAnimating: boolean) => {
      const rt = Math.round(theta * 1000) / 1000;
      const rp = Math.round(phi * 1000) / 1000;
      if (rt !== lastReadout.current.theta || rp !== lastReadout.current.phi) {
        lastReadout.current = { theta: rt, phi: rp };
        setAngles({ theta: rt, phi: rp });
      }
      setAnimating((prev) => (prev === isAnimating ? prev : isAnimating));
    },
    []
  );

  const applyRotation = useCallback(
    (axis: BlochVector, angle: number) => {
      if (animRef.current) return;
      if (reduced) {
        blochRef.current = rotateBloch(blochRef.current, axis, angle);
        return;
      }
      animRef.current = {
        axis,
        totalAngle: angle,
        start: { ...blochRef.current },
        progress: 0,
      };
    },
    [reduced]
  );

  const applyGate = useCallback(
    (gate: GateSpec) => applyRotation(gate.axis, gate.angle),
    [applyRotation]
  );

  const reset = useCallback(() => {
    const b = blochRef.current;
    const target: BlochVector = { x: 0, y: 0, z: 1 };
    const dot = Math.min(1, Math.max(-1, b.z));
    const angle = Math.acos(dot);
    if (angle < 1e-4) return;
    // rotation axis = cross(current, target), or any equatorial axis if antipodal
    let axis: BlochVector = { x: b.y * 1 - b.z * 0, y: b.z * 0 - b.x * 1, z: 0 };
    const len = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
    axis =
      len < 1e-6
        ? { x: 1, y: 0, z: 0 }
        : { x: axis.x / len, y: axis.y / len, z: 0 };
    if (reduced) {
      blochRef.current = target;
      return;
    }
    applyRotation(axis, angle);
  }, [applyRotation, reduced]);

  const r = readoutFromAngles(angles.theta, angles.phi);
  const busy = animating;

  return (
    <div>
      <div className="grid items-center gap-6 sm:grid-cols-[1.2fr_1fr]">
        {/* 3D sphere — grab cursor everywhere (tip-drag or orbit) */}
        <div
          className={`relative mx-auto aspect-square w-full max-w-sm touch-none ${
            dragging || orbiting ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <Canvas camera={{ position: [2.2, 1.4, 2.6], fov: 45 }} dpr={[1, 1.5]}>
            <BlochScene
              blochRef={blochRef}
              animRef={animRef}
              onFrame={handleFrame}
              dragging={dragging}
              setDragging={setDragging}
              setOrbiting={setOrbiting}
            />
          </Canvas>
        </div>

        {/* live readout */}
        <div className="rounded-2xl border border-white/10 bg-void/60 p-5 font-mono text-sm">
          <p className="text-xs tracking-[0.2em] text-ink-dim uppercase">
            State readout
          </p>
          <div className="mt-4 space-y-2 text-ink">
            <p>
              <span className="text-ink-dim">θ =</span> {fmt(r.theta)} rad{" "}
              <span className="text-ink-dim">({fmt(r.thetaDeg, 1)}°)</span>
            </p>
            <p>
              <span className="text-ink-dim">φ =</span> {fmt(r.phi)} rad{" "}
              <span className="text-ink-dim">({fmt(r.phiDeg, 1)}°)</span>
            </p>
            <p className="border-t border-white/10 pt-3 leading-relaxed">
              |ψ⟩ = {fmt(r.alpha)}|0⟩
              {" + "}
              <span className="whitespace-nowrap">
                e<sup>i·{fmt(r.phi)}</sup>·{fmt(r.beta)}|1⟩
              </span>
            </p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-qubit">P(0) = {fmt(r.p0 * 100, 1)}%</span>
              <span className="text-photon">P(1) = {fmt(r.p1 * 100, 1)}%</span>
            </div>
            <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="bg-qubit transition-none"
                style={{ width: `${r.p0 * 100}%` }}
              />
              <div
                className="bg-photon"
                style={{ width: `${r.p1 * 100}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-dim">
            Drag the glowing tip, or apply a gate below.
          </p>
        </div>
      </div>

      {/* gate controls */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {GATES.map((gate) => (
          <button
            key={gate.id}
            onClick={() => applyGate(gate)}
            disabled={busy}
            title={gate.name}
            className="glass min-w-11 cursor-pointer rounded-full px-4 py-2.5 font-mono text-sm text-ink transition-all duration-200 hover:border-qubit/50 hover:text-qubit disabled:cursor-default disabled:opacity-40"
          >
            {gate.label}
          </button>
        ))}
        <button
          onClick={reset}
          disabled={busy}
          title="Reset to |0⟩"
          className="glass inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-sm text-ink-dim transition-all duration-200 hover:border-white/30 hover:text-ink disabled:cursor-default disabled:opacity-40"
        >
          <RotateCcw size={13} /> |0⟩
        </button>
      </div>
    </div>
  );
}
