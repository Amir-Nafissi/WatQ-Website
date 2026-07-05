export interface Milestone {
  id: string;
  title: string;
  term: string;
  status: "Complete" | "In Progress" | "Planned";
  description: string;
}

export const milestones: Milestone[] = [
  {
    id: "mzi-v1",
    title: "Mach–Zehnder Interferometer v1",
    term: "Fall 2025",
    status: "Complete",
    description:
      "First fabricated silicon photonic test structure: a thermally tuned Mach–Zehnder interferometer used to characterize on-chip phase control and insertion loss.",
  },
  {
    id: "ring-resonators",
    title: "Ring Resonator Characterization",
    term: "Winter 2026",
    status: "Complete",
    description:
      "Measured quality factors and free spectral range across a bank of microring resonators to validate our waveguide geometry and coupling gap models.",
  },
  {
    id: "sfwm-source",
    title: "Photon-Pair Source (SFWM)",
    term: "Spring 2026",
    status: "In Progress",
    description:
      "Designing a spiral waveguide photon-pair source based on spontaneous four-wave mixing, with on-chip pump rejection filters — the entangled-photon engine for our first quantum chip.",
  },
  {
    id: "2q-processor",
    title: "Two-Qubit Photonic Processor",
    term: "Fall 2026",
    status: "Planned",
    description:
      "A reconfigurable dual-rail chip combining our pair source with a programmable interferometer mesh, targeting on-chip Hong–Ou–Mandel interference and a CNOT demonstration.",
  },
];

export const physicsPillars = [
  {
    title: "Photons as Qubits",
    body: "We encode quantum information in single photons — which path a photon takes through a pair of waveguides defines its |0⟩ and |1⟩ states. Photons barely interact with their environment, so they hold quantum states with exceptional fidelity at room temperature.",
  },
  {
    title: "Interference is Computation",
    body: "A beam splitter puts a photon into superposition; a phase shifter rotates that state. Meshes of Mach–Zehnder interferometers compose these primitives into arbitrary unitary operations — the photonic equivalent of a quantum logic circuit.",
  },
  {
    title: "Silicon Photonics",
    body: "Our chips are fabricated in standard silicon-on-insulator processes — the same foundries that make classical transceivers. That means nanometre-precision waveguides, thousands of components per chip, and a real path to scaling.",
  },
];
