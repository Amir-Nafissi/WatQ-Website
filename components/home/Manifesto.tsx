import Reveal from "@/components/motion/Reveal";

export default function Manifesto() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-32 text-center">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-ink-dim uppercase">
          Our mission
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-8 text-2xl leading-relaxed font-light text-ink sm:text-3xl">
          Quantum computing shouldn&apos;t wait for graduate school. WatQ
          exists so that undergraduates can{" "}
          <span className="text-photon">fabricate real photonic chips</span>,{" "}
          <span className="text-qubit">run real quantum algorithms</span>, and
          publish real results — together, as a design team.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-8 text-ink-dim">
          We are students of physics, engineering, math, and computer science
          united by a single question: what can we build at the most
          fundamental level of nature?
        </p>
      </Reveal>
    </section>
  );
}
