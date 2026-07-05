import { milestones } from "@/data/hardware";
import Reveal from "@/components/motion/Reveal";
import { CheckCircle2, CircleDot, Circle } from "lucide-react";

const statusIcon = {
  Complete: <CheckCircle2 size={18} className="text-photon" />,
  "In Progress": <CircleDot size={18} className="text-photon-deep" />,
  Planned: <Circle size={18} className="text-ink-dim" />,
};

export default function MilestoneTimeline() {
  return (
    <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[8px] before:w-px before:bg-white/10">
      {milestones.map((m, i) => (
        <li key={m.id} className="relative pl-10">
          <span className="absolute top-1 left-0 bg-void py-1">
            {statusIcon[m.status]}
          </span>
          <Reveal delay={i * 0.08}>
            <div className="glass rounded-2xl p-6 transition-colors hover:border-photon/30">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-ink">{m.title}</h3>
                <span className="font-mono text-xs text-ink-dim">
                  {m.term} · {m.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                {m.description}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
