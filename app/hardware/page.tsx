import type { Metadata } from "next";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";
import WaveguideDiagram from "@/components/hardware/WaveguideDiagram";
import MilestoneTimeline from "@/components/hardware/MilestoneTimeline";
import { physicsPillars } from "@/data/hardware";

export const metadata: Metadata = {
  title: "Hardware",
  description:
    "WatQ's hardware sub-team designs and tests photonic quantum chips — silicon waveguides, interferometers, and photon-pair sources.",
};

export default function HardwarePage() {
  return (
    <div className="px-6 pt-36 pb-24">
      {/* hero */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-photon">
          HARDWARE SUB-TEAM
        </p>
        <KineticHeading className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Photonic Quantum{" "}
          <span className="bg-gradient-to-r from-photon to-photon-deep bg-clip-text text-transparent">
            Hardware
          </span>
        </KineticHeading>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-dim">
            We design, simulate, and characterize silicon photonic integrated
            circuits — working toward a chip that generates, manipulates, and
            measures entangled photons.
          </p>
        </Reveal>
      </section>

      {/* physics explainer */}
      <section className="mx-auto mt-28 max-w-6xl">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            Computing with light
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {physicsPillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <div className="glass h-full rounded-2xl p-8 transition-all duration-500 hover:border-photon/30 hover:shadow-[0_0_40px_rgba(255,0,127,0.1)]">
                <span className="font-mono text-xs text-photon">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* animated interferometer */}
      <section className="mx-auto mt-28 max-w-4xl">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            The Mach–Zehnder interferometer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-ink-dim">
            The fundamental building block of our chips: split a photon onto
            two paths, shift the phase of one, and recombine. The interference
            pattern at the output is a single-qubit gate — in silicon.
          </p>
        </Reveal>
        <div className="glass mt-12 rounded-3xl p-6 sm:p-12">
          <WaveguideDiagram />
        </div>
      </section>

      {/* milestones */}
      <section className="mx-auto mt-28 max-w-3xl">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            Chips in development
          </h2>
          <p className="mt-4 mb-12 text-center text-ink-dim">
            Our roadmap from first test structures to a two-qubit photonic
            processor.
          </p>
        </Reveal>
        <MilestoneTimeline />
      </section>
    </div>
  );
}
