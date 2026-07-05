"use client";

import { motion } from "framer-motion";

const draw = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, delay, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay },
    },
  },
});

/** Animated line drawing of a Mach–Zehnder interferometer that draws itself on scroll. */
export default function WaveguideDiagram() {
  return (
    <motion.svg
      viewBox="0 0 800 240"
      fill="none"
      className="w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      aria-label="Diagram of a Mach–Zehnder interferometer"
      role="img"
    >
      {/* input waveguide */}
      <motion.path
        d="M 20 120 H 160"
        stroke="#FF007F"
        strokeWidth="2.5"
        variants={draw(0)}
      />
      {/* first coupler split */}
      <motion.path
        d="M 160 120 C 220 120 220 60 280 60"
        stroke="#FF007F"
        strokeWidth="2.5"
        variants={draw(0.4)}
      />
      <motion.path
        d="M 160 120 C 220 120 220 180 280 180"
        stroke="#D900FF"
        strokeWidth="2.5"
        variants={draw(0.4)}
      />
      {/* two arms */}
      <motion.path
        d="M 280 60 H 520"
        stroke="#FF007F"
        strokeWidth="2.5"
        variants={draw(0.9)}
      />
      <motion.path
        d="M 280 180 H 520"
        stroke="#D900FF"
        strokeWidth="2.5"
        variants={draw(0.9)}
      />
      {/* phase shifter on top arm */}
      <motion.rect
        x="370"
        y="42"
        width="60"
        height="36"
        rx="6"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        variants={draw(1.3)}
      />
      {/* recombining coupler */}
      <motion.path
        d="M 520 60 C 580 60 580 120 640 120"
        stroke="#FF007F"
        strokeWidth="2.5"
        variants={draw(1.6)}
      />
      <motion.path
        d="M 520 180 C 580 180 580 120 640 120"
        stroke="#D900FF"
        strokeWidth="2.5"
        variants={draw(1.6)}
      />
      {/* output */}
      <motion.path
        d="M 640 120 H 780"
        stroke="#FF007F"
        strokeWidth="2.5"
        variants={draw(2.1)}
      />
      {/* labels */}
      <motion.text
        x="400"
        y="30"
        textAnchor="middle"
        className="fill-ink-dim font-mono"
        fontSize="12"
        variants={draw(1.5)}
      >
        φ — phase shifter
      </motion.text>
      <motion.text
        x="20"
        y="145"
        className="fill-ink-dim font-mono"
        fontSize="12"
        variants={draw(0.2)}
      >
        |photon in⟩
      </motion.text>
      <motion.text
        x="780"
        y="145"
        textAnchor="end"
        className="fill-ink-dim font-mono"
        fontSize="12"
        variants={draw(2.3)}
      >
        interference out
      </motion.text>
    </motion.svg>
  );
}
