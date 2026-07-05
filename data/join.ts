export interface Track {
  id: "hardware" | "software";
  ket: string;
  name: string;
  summary: string;
  skills: string[];
  niceToHave: string[];
}

export const tracks: Track[] = [
  {
    id: "hardware",
    ket: "|H⟩",
    name: "Hardware Track",
    summary:
      "Design, simulate, and test photonic integrated circuits — from waveguide geometry to chip bring-up in the lab.",
    skills: [
      "Electromagnetics or optics coursework (or strong interest)",
      "Python for simulation and data analysis",
      "Comfort reading physics papers and datasheets",
      "Curiosity about nanofabrication and lab work",
    ],
    niceToHave: [
      "Lumerical / MEEP / KLayout experience",
      "PCB design or test-bench automation",
      "Quantum optics exposure (single photons, interference)",
    ],
  },
  {
    id: "software",
    ket: "|S⟩",
    name: "Software Track",
    summary:
      "Implement quantum algorithms in Qiskit, build visualizations, and run experiments on simulators and real quantum hardware.",
    skills: [
      "Solid Python fundamentals",
      "Linear algebra (vectors, matrices, complex numbers)",
      "Git and collaborative development basics",
      "Interest in algorithms and complexity",
    ],
    niceToHave: [
      "Qiskit, Cirq, or PennyLane experience",
      "React / TypeScript for visualization tools",
      "Numerical computing (NumPy, SciPy, JAX)",
    ],
  },
];

export const recruitment = {
  headline: "We recruit every term.",
  body: "WatQ opens applications during the first two weeks of each academic term (Fall, Winter, Spring). No prior quantum experience is required — we run an onboarding bootcamp covering the fundamentals of quantum information for every new member.",
  steps: [
    { title: "Apply", body: "Submit a short application form at the start of term — tell us what you want to build." },
    { title: "Chat", body: "A casual 20-minute conversation with a team lead. No whiteboard interviews, ever." },
    { title: "Onboard", body: "Join the bootcamp, pick a project, and start contributing in your first month." },
  ],
  email: "watq@uwaterloo.ca",
};
