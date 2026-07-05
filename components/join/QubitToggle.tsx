"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { tracks } from "@/data/join";

export default function QubitToggle() {
  const [trackId, setTrackId] = useState<"hardware" | "software">("hardware");
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const isHardware = trackId === "hardware";

  return (
    <div>
      {/* qubit state toggle */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-xs tracking-[0.2em] text-ink-dim uppercase">
          Select your basis state
        </p>
        <button
          onClick={() => setTrackId(isHardware ? "software" : "hardware")}
          aria-label={`Switch to ${isHardware ? "Software" : "Hardware"} track`}
          className="glass relative flex w-64 items-center rounded-full p-1.5"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full ${
              isHardware
                ? "left-1.5 bg-photon/20 shadow-[0_0_25px_rgba(255,0,127,0.3)]"
                : "left-[calc(50%+0px)] bg-qubit/20 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
            }`}
          />
          <span
            className={`relative z-10 flex-1 py-2.5 text-center font-mono text-sm transition-colors ${
              isHardware ? "text-photon" : "text-ink-dim"
            }`}
          >
            |H⟩ Hardware
          </span>
          <span
            className={`relative z-10 flex-1 py-2.5 text-center font-mono text-sm transition-colors ${
              !isHardware ? "text-qubit" : "text-ink-dim"
            }`}
          >
            |S⟩ Software
          </span>
        </button>
      </div>

      {/* track detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`glass mt-10 rounded-3xl p-8 sm:p-10 ${
            isHardware
              ? "shadow-[0_0_60px_rgba(255,0,127,0.07)]"
              : "shadow-[0_0_60px_rgba(0,240,255,0.07)]"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span
              className={`font-mono text-2xl ${isHardware ? "text-photon" : "text-qubit"}`}
            >
              {track.ket}
            </span>
            <h3 className="text-2xl font-bold text-ink">{track.name}</h3>
          </div>
          <p className="mt-4 text-ink-dim">{track.summary}</p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] text-ink uppercase">
                What we look for
              </h4>
              <ul className="mt-4 space-y-3">
                {track.skills.map((s) => (
                  <li key={s} className="flex gap-3 text-sm text-ink-dim">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${isHardware ? "text-photon" : "text-qubit"}`}
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] text-ink uppercase">
                Nice to have
              </h4>
              <ul className="mt-4 space-y-3">
                {track.niceToHave.map((s) => (
                  <li key={s} className="flex gap-3 text-sm text-ink-dim">
                    <Sparkles
                      size={16}
                      className="mt-0.5 shrink-0 text-ink-dim"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
