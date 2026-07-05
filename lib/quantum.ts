// Pure single-qubit math for the Bloch sphere, in Bloch coordinates
// (z up = |0⟩, x toward viewer, y right-handed). Global phase is ignored,
// which is exact for anything displayed on the sphere.

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface QubitAngles {
  /** polar angle, [0, π] */
  theta: number;
  /** azimuthal angle, [0, 2π) */
  phi: number;
}

export function anglesFromBloch(v: BlochVector): QubitAngles {
  const theta = Math.acos(Math.min(1, Math.max(-1, v.z)));
  let phi = Math.atan2(v.y, v.x);
  if (phi < 0) phi += 2 * Math.PI;
  // φ is undefined at the poles; pin it to 0 for a stable readout
  if (Math.abs(v.z) > 0.99999) phi = 0;
  return { theta, phi };
}

export function blochFromAngles(theta: number, phi: number): BlochVector {
  const s = Math.sin(theta);
  return { x: s * Math.cos(phi), y: s * Math.sin(phi), z: Math.cos(theta) };
}

/**
 * Single-qubit gates as rotations of the Bloch sphere: each unitary
 * U = e^{-i(angle/2) n̂·σ⃗} (up to global phase) rotates the Bloch vector
 * by `angle` around `axis`.
 */
export interface GateSpec {
  id: string;
  label: string;
  name: string;
  axis: BlochVector;
  angle: number;
}

const INV_SQRT2 = Math.SQRT1_2;

export const GATES: GateSpec[] = [
  { id: "x", label: "X", name: "Pauli-X (NOT)", axis: { x: 1, y: 0, z: 0 }, angle: Math.PI },
  { id: "y", label: "Y", name: "Pauli-Y", axis: { x: 0, y: 1, z: 0 }, angle: Math.PI },
  { id: "z", label: "Z", name: "Pauli-Z", axis: { x: 0, y: 0, z: 1 }, angle: Math.PI },
  { id: "h", label: "H", name: "Hadamard", axis: { x: INV_SQRT2, y: 0, z: INV_SQRT2 }, angle: Math.PI },
  { id: "s", label: "S", name: "Phase (√Z)", axis: { x: 0, y: 0, z: 1 }, angle: Math.PI / 2 },
  { id: "t", label: "T", name: "π/8 (⁴√Z)", axis: { x: 0, y: 0, z: 1 }, angle: Math.PI / 4 },
];

/** Rotate a Bloch vector by `angle` around unit `axis` (Rodrigues' formula). */
export function rotateBloch(
  v: BlochVector,
  axis: BlochVector,
  angle: number
): BlochVector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = axis.x * v.x + axis.y * v.y + axis.z * v.z;
  const crossX = axis.y * v.z - axis.z * v.y;
  const crossY = axis.z * v.x - axis.x * v.z;
  const crossZ = axis.x * v.y - axis.y * v.x;
  return {
    x: v.x * cos + crossX * sin + axis.x * dot * (1 - cos),
    y: v.y * cos + crossY * sin + axis.y * dot * (1 - cos),
    z: v.z * cos + crossZ * sin + axis.z * dot * (1 - cos),
  };
}

export function normalizeBloch(v: BlochVector): BlochVector {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

// --- formatting helpers for the readout panel ---

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export interface Readout {
  theta: number;
  phi: number;
  thetaDeg: number;
  phiDeg: number;
  /** amplitude of |0⟩, cos(θ/2) */
  alpha: number;
  /** magnitude of the |1⟩ amplitude, sin(θ/2) */
  beta: number;
  p0: number;
  p1: number;
}

export function readoutFromAngles(theta: number, phi: number): Readout {
  const alpha = Math.cos(theta / 2);
  const beta = Math.sin(theta / 2);
  return {
    theta,
    phi,
    thetaDeg: toDegrees(theta),
    phiDeg: toDegrees(phi),
    alpha,
    beta,
    p0: alpha * alpha,
    p1: beta * beta,
  };
}
