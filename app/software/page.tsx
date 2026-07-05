import type { Metadata } from "next";
import KineticHeading from "@/components/motion/KineticHeading";
import Reveal from "@/components/motion/Reveal";
import AlgorithmShowcase from "@/components/software/AlgorithmShowcase";
import BlochSphereSection from "@/components/software/BlochSphereSection";

export const metadata: Metadata = {
  title: "Software",
  description:
    "WatQ's software sub-team implements and visualizes quantum algorithms in Qiskit — Grover's search, VQE, and QAOA on simulators and real hardware.",
};

export default function SoftwarePage() {
  return (
    <div className="px-6 pt-36 pb-24">
      {/* hero */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-qubit">
          SOFTWARE SUB-TEAM
        </p>
        <KineticHeading className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Algorithmic Quantum{" "}
          <span className="bg-gradient-to-r from-qubit to-photon-deep bg-clip-text text-transparent">
            Software
          </span>
        </KineticHeading>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-dim">
            We implement quantum algorithms in Qiskit, benchmark them on
            simulators and IBM Quantum hardware, and build visualizations that
            make quantum mechanics tangible.
          </p>
        </Reveal>
      </section>

      {/* interactive bloch sphere */}
      <section className="mx-auto mt-28 max-w-5xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              One qubit, infinite states
            </h2>
            <p className="mt-5 leading-relaxed text-ink-dim">
              A classical bit is 0 or 1. A qubit lives anywhere on the surface
              of the Bloch sphere — a continuous superposition{" "}
              <span className="font-mono text-sm text-qubit">
                α|0⟩ + β|1⟩
              </span>{" "}
              of both. Quantum gates are rotations of this sphere. Try it:
              drag the state vector, or apply real gates and watch the qubit
              rotate.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="glass mt-12 rounded-3xl p-6 sm:p-10">
            <BlochSphereSection />
          </div>
        </Reveal>
      </section>

      {/* algorithms */}
      <section className="mx-auto mt-28 max-w-6xl">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            Algorithms we build
          </h2>
          <p className="mx-auto mt-4 mb-12 max-w-2xl text-center text-ink-dim">
            Real Qiskit implementations from our repository — from unstructured
            search to variational chemistry.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <AlgorithmShowcase />
        </Reveal>
      </section>
    </div>
  );
}
