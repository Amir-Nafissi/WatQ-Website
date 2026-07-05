import type { Metadata } from "next";
import { Mail } from "lucide-react";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import QubitToggle from "@/components/join/QubitToggle";
import { recruitment } from "@/data/join";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join WatQ — we recruit University of Waterloo undergraduates every term for our hardware and software quantum design tracks. No prior quantum experience required.",
};

export default function JoinPage() {
  return (
    <div className="px-6 pt-36 pb-24">
      <section className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-ink-dim">
          RECRUITMENT
        </p>
        <KineticHeading className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Collapse into the{" "}
          <span className="bg-gradient-to-r from-photon to-qubit bg-clip-text text-transparent">
            team
          </span>
        </KineticHeading>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-dim">
            {recruitment.headline} {recruitment.body}
          </p>
        </Reveal>
      </section>

      {/* application steps */}
      <section className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
        {recruitment.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.12}>
            <div className="glass h-full rounded-2xl p-7 text-center">
              <span className="font-mono text-xs text-ink-dim">
                step 0{i + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* qubit state toggle */}
      <section className="mx-auto mt-28 max-w-3xl">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            Pick your track
          </h2>
          <p className="mt-4 mb-12 text-center text-ink-dim">
            Two sub-teams, one superposition. Flip the qubit to see what each
            track looks for.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <QubitToggle />
        </Reveal>
      </section>

      {/* contact */}
      <section className="mx-auto mt-28 max-w-2xl text-center">
        <Reveal>
          <h2 className="text-2xl font-bold text-ink">Questions?</h2>
          <p className="mt-4 text-ink-dim">
            Reach out any time — we love talking about quantum computing.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton
              href={`mailto:${recruitment.email}`}
              accent="qubit"
            >
              <Mail size={16} /> {recruitment.email}
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
