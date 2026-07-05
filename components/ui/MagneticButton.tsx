"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotionPref } from "@/components/motion/MotionProvider";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  accent?: "photon" | "qubit" | "neutral";
  className?: string;
}

const accentClasses = {
  photon:
    "border-photon/40 text-photon hover:bg-photon/10 hover:shadow-[0_0_30px_rgba(255,0,127,0.25)]",
  qubit:
    "border-qubit/40 text-qubit hover:bg-qubit/10 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]",
  neutral:
    "border-white/20 text-ink hover:bg-white/10 hover:shadow-[0_0_30px_rgba(226,232,240,0.15)]",
};

/** CTA link with a slight magnetic pull toward the cursor on hover. */
export default function MagneticButton({
  href,
  children,
  accent = "neutral",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  function handleMouseMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-2 rounded-full border px-7 py-3 font-mono text-sm tracking-wide transition-all duration-300 ${accentClasses[accent]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
