"use client";

import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { team, type SubTeam } from "@/data/team";
import Reveal from "@/components/motion/Reveal";

const subteamStyle: Record<
  SubTeam,
  { text: string; border: string; glow: string }
> = {
  Hardware: {
    text: "text-photon",
    border: "hover:border-photon/40",
    glow: "hover:shadow-[0_0_40px_rgba(255,0,127,0.12)]",
  },
  Software: {
    text: "text-qubit",
    border: "hover:border-qubit/40",
    glow: "hover:shadow-[0_0_40px_rgba(0,240,255,0.12)]",
  },
  Lead: {
    text: "text-photon-deep",
    border: "hover:border-photon-deep/40",
    glow: "hover:shadow-[0_0_40px_rgba(217,0,255,0.12)]",
  },
};

/** Staggered masonry-style layout: middle column offset on desktop. */
export default function TeamGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, i) => {
        const style = subteamStyle[member.subteam];
        // offset the middle column downward for a staggered rhythm
        const offset = i % 3 === 1 ? "lg:translate-y-10" : "";
        return (
          <Reveal key={member.name} delay={(i % 3) * 0.1} className={offset}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`glass group relative overflow-hidden rounded-2xl p-7 transition-all duration-500 ${style.border} ${style.glow}`}
            >
              <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${style.text}`}>
                {member.subteam}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-ink">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-ink">{member.role}</p>
              <p className="mt-2 font-mono text-xs text-ink-dim">
                {member.major}
              </p>

              {/* socials — revealed on hover (always visible on touch) */}
              <div className="mt-5 flex gap-3 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className="text-ink-dim transition-colors hover:text-ink"
                  >
                    <GithubIcon size={17} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="text-ink-dim transition-colors hover:text-ink"
                  >
                    <LinkedinIcon size={17} />
                  </a>
                )}
              </div>
            </motion.div>
          </Reveal>
        );
      })}
    </div>
  );
}
