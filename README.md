# WatQ — Waterloo Quantum Design Team

Website for WatQ, an undergraduate quantum design team at the University of Waterloo with two sub-teams:

- **Hardware** — photonics-based quantum chip design (silicon photonics, Mach–Zehnder interferometers, photon-pair sources)
- **Software** — Qiskit implementations and visualizations of quantum algorithms (Grover's, VQE, QAOA)

100% frontend, statically generated — no backend, no database. All content lives in `/data`. See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of how the site is built.

## Pages & highlights

| Route | What's there |
| --- | --- |
| `/` | Hero with an interactive WebGL torus knot woven from 24k light particles (cursor repels the strands), sub-team split cards, manifesto |
| `/hardware` | Photonics explainer, Mach–Zehnder interferometer SVG that draws itself on scroll, chip roadmap timeline |
| `/software` | **Interactive 3D Bloch sphere** — drag the state vector, apply X/Y/Z/H/S/T gates with animated rotations, live θ/φ/Dirac/probability readout — plus a tabbed algorithm showcase with syntax-highlighted Qiskit code |
| `/team` | Staggered grid of member cards, accent-coded by sub-team |
| `/join` | Termly recruitment info and a qubit-state toggle that flips between Hardware and Software track requirements |

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript + React 19
- Tailwind CSS v4 (design tokens in `app/globals.css`, no `tailwind.config`)
- Framer Motion — page transitions, scroll reveals, micro-interactions
- React Three Fiber + drei — hero particle knot and the interactive Bloch sphere (single-qubit math in `lib/quantum.ts`)
- lucide-react, react-syntax-highlighter, `next/font` (Inter + JetBrains Mono)

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — all routes prerender as static
npx eslint .     # lint (ESLint 9 + React Compiler rules)
```

There is no test suite; `npm run build` doubles as the type check. Repo guidance for AI-assisted development lives in [CLAUDE.md](CLAUDE.md).

## Editing content

| What | Where |
| --- | --- |
| Team members | `data/team.ts` |
| Hardware milestones & physics copy | `data/hardware.ts` |
| Algorithms & Qiskit snippets | `data/software.ts` |
| Recruitment info & track skills | `data/join.ts` |
| Color palette & fonts | `app/globals.css` (`@theme`) |

## Deployment

Zero-config on [Vercel](https://vercel.com): import the repo and deploy. Every route is statically prerendered.

## Accessibility

Animations respect `prefers-reduced-motion` (via a `MotionProvider` context): the WebGL scenes, kinetic typography, magnetic buttons, and gate animations are disabled or made instant for users who prefer reduced motion. The hero canvas is also skipped on mobile in favor of a static gradient.
