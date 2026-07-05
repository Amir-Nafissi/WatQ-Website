# WatQ — Waterloo Quantum Design Team

Website for WatQ, an undergraduate quantum design team at the University of Waterloo with two sub-teams:

- **Hardware** — photonics-based quantum chip design (silicon photonics, Mach–Zehnder interferometers, photon-pair sources)
- **Software** — Qiskit implementations and visualizations of quantum algorithms (Grover's, VQE, QAOA)

100% frontend, statically generated — no backend, no database. All content lives in `/data`.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- Framer Motion — page transitions, scroll reveals, micro-interactions
- React Three Fiber + drei — hero particle field ("Observer Effect")
- lucide-react, react-syntax-highlighter, `next/font` (Inter + JetBrains Mono)

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — all routes prerender as static
npx eslint .     # lint
```

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

Animations respect `prefers-reduced-motion` (via a `MotionProvider` context): the 3D particle field, kinetic typography, and magnetic-button effects are disabled for users who prefer reduced motion. The 3D canvas is also skipped on mobile in favor of a static gradient.
