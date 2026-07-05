"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Waves, Orbit, ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const cards = [
  {
    href: "/hardware",
    title: "Hardware",
    subtitle: "Photonic Quantum Chips",
    body: "Designing silicon photonic circuits that route, entangle, and measure single photons — quantum processors built from light.",
    Icon: Waves,
    accent: "text-photon",
    ring: "hover:border-photon/40 hover:shadow-[0_0_60px_rgba(255,0,127,0.15)]",
    glow: "from-photon/10",
  },
  {
    href: "/software",
    title: "Software",
    subtitle: "Qiskit Algorithms & Visualization",
    body: "Implementing Grover's, VQE, and QAOA in Qiskit, and building tools that make quantum states something you can see.",
    Icon: Orbit,
    accent: "text-qubit",
    ring: "hover:border-qubit/40 hover:shadow-[0_0_60px_rgba(0,240,255,0.15)]",
    glow: "from-qubit/10",
  },
];

export default function SubTeamSplit() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-24 md:grid-cols-2">
      {cards.map(({ href, title, subtitle, body, Icon, accent, ring, glow }, i) => (
        <Reveal key={href} delay={i * 0.15}>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link
              href={href}
              className={`glass group relative block overflow-hidden rounded-3xl p-10 transition-all duration-500 ${ring}`}
            >
              <div
                aria-hidden
                className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-b ${glow} to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <Icon className={`mb-6 ${accent}`} size={36} strokeWidth={1.5} />
              <p className={`font-mono text-xs tracking-[0.2em] uppercase ${accent}`}>
                {subtitle}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ink">{title}</h2>
              <p className="mt-4 leading-relaxed text-ink-dim">{body}</p>
              <span className={`mt-8 inline-flex items-center gap-1.5 font-mono text-sm ${accent}`}>
                Enter {title.toLowerCase()}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </motion.div>
        </Reveal>
      ))}
    </section>
  );
}
