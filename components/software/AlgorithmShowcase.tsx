"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { algorithms } from "@/data/software";
import CodeBlock from "./CodeBlock";

export default function AlgorithmShowcase() {
  const [activeId, setActiveId] = useState(algorithms[0].id);
  const active = algorithms.find((a) => a.id === activeId) ?? algorithms[0];

  return (
    <div>
      {/* tab bar */}
      <div className="glass mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full p-1.5">
        {algorithms.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveId(a.id)}
            className={`relative rounded-full px-5 py-2 font-mono text-sm transition-colors ${
              a.id === activeId ? "text-void" : "text-ink-dim hover:text-ink"
            }`}
          >
            {a.id === activeId && (
              <motion.span
                layoutId="algo-tab"
                className="absolute inset-0 rounded-full bg-qubit"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{a.name}</span>
          </button>
        ))}
      </div>

      {/* active algorithm */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="glass rounded-2xl p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-2xl font-bold text-ink">{active.name}</h3>
              <span className="shrink-0 rounded-full border border-qubit/30 px-3 py-1 font-mono text-xs text-qubit">
                {active.complexity}
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-qubit">
              {active.tagline}
            </p>
            <p className="mt-5 leading-relaxed text-ink-dim">
              {active.description}
            </p>
          </div>
          <CodeBlock code={active.code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
