"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import KineticHeading from "@/components/motion/KineticHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { useReducedMotionPref } from "@/components/motion/MotionProvider";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

export default function Hero() {
  const reduced = useReducedMotionPref();

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      {/* static gradient fallback — always present, sits behind the canvas */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,240,255,0.06),transparent),radial-gradient(ellipse_50%_40%_at_70%_70%,rgba(255,0,127,0.05),transparent)]"
      />
      {/* 3D particle field — all viewports (scaled down internally on
          mobile), disabled for reduced motion */}
      {!reduced && (
        <div aria-hidden className="absolute inset-0">
          <ParticleField />
        </div>
      )}
      {/* scrim: dark vignette between the particles and the copy so the
          headline holds ≥4.5:1 contrast without dimming the whole knot;
          pointer-events-none so mouse input still reaches the canvas below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_44%_34%_at_50%_46%,rgba(5,5,8,0.72)_0%,rgba(5,5,8,0.35)_55%,rgba(5,5,8,0)_75%)]"
      />

      <div className="pointer-events-none relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 font-mono text-sm tracking-[0.3em] text-qubit"
        >
          WATERLOO QUANTUM DESIGN TEAM
        </motion.p>

        <KineticHeading className="text-5xl font-bold leading-[1.05] tracking-tight text-ink [text-shadow:0_2px_28px_rgba(5,5,8,0.9)] sm:text-7xl lg:text-8xl">
          Designing at the{" "}
          <span className="bg-gradient-to-r from-photon via-photon-deep to-qubit bg-clip-text text-transparent [text-shadow:none]">
            Fundamental
          </span>{" "}
          Level.
        </KineticHeading>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-ink/90 [text-shadow:0_1px_16px_rgba(5,5,8,0.9)]"
        >
          An undergraduate team building photonic quantum chips and
          Qiskit-powered quantum algorithms at the University of Waterloo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="/join" accent="qubit">
            Join the team <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="/hardware" accent="neutral">
            Explore our work
          </MagneticButton>
        </motion.div>
      </div>

    </section>
  );
}
