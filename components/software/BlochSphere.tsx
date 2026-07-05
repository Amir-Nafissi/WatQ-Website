"use client";

import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/components/motion/MotionProvider";

/** Stylized SVG Bloch sphere with a slowly precessing state vector. */
export default function BlochSphere() {
  const reduced = useReducedMotionPref();

  return (
    <svg
      viewBox="0 0 320 320"
      className="mx-auto w-full max-w-xs"
      aria-label="Bloch sphere representation of a qubit state"
      role="img"
    >
      {/* sphere outline */}
      <circle cx="160" cy="160" r="120" stroke="#334155" strokeWidth="1.5" fill="none" />
      {/* equator ellipse */}
      <ellipse cx="160" cy="160" rx="120" ry="34" stroke="#334155" strokeWidth="1" fill="none" strokeDasharray="4 5" />
      {/* meridian */}
      <ellipse cx="160" cy="160" rx="34" ry="120" stroke="#334155" strokeWidth="1" fill="none" strokeDasharray="4 5" />
      {/* axes */}
      <line x1="160" y1="20" x2="160" y2="300" stroke="#475569" strokeWidth="1" />
      <line x1="30" y1="160" x2="290" y2="160" stroke="#475569" strokeWidth="1" />
      {/* pole labels */}
      <text x="160" y="14" textAnchor="middle" fontSize="14" className="fill-ink" fontFamily="var(--font-jetbrains-mono)">|0⟩</text>
      <text x="160" y="318" textAnchor="middle" fontSize="14" className="fill-ink" fontFamily="var(--font-jetbrains-mono)">|1⟩</text>
      <text x="298" y="164" fontSize="12" className="fill-ink-dim" fontFamily="var(--font-jetbrains-mono)">x</text>
      <text x="150" y="132" fontSize="12" className="fill-ink-dim" fontFamily="var(--font-jetbrains-mono)">ψ</text>

      {/* precessing state vector */}
      <motion.g
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "160px 160px" }}
      >
        <line x1="160" y1="160" x2="238" y2="82" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="238" cy="82" r="6" fill="#00F0FF" />
        <circle cx="238" cy="82" r="12" fill="#00F0FF" opacity="0.2" />
      </motion.g>

      <circle cx="160" cy="160" r="3.5" fill="#E2E8F0" />
    </svg>
  );
}
