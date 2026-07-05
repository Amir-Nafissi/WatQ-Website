# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Static marketing site for WatQ, a UWaterloo quantum design team. Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Framer Motion 12 + React Three Fiber/drei. **No backend, no database, no tests** — every route prerenders to static HTML; all content is hardcoded in `/data/*.ts`. Deploys zero-config to Vercel. See `ARCHITECTURE.md` for the full picture.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build — every route must show ○ (Static); also the type check
npx eslint .     # ESLint 9 flat config with React Compiler rules (see below)
```

There is no test suite. Verify changes with `npx eslint .` + `npm run build`, and check pure math (e.g. `lib/quantum.ts`) directly with `node --experimental-strip-types -e "import('./lib/quantum.ts').then(...)"`.

## Architecture (big picture)

- **Static shell, client islands**: `app/*/page.tsx` are server components (copy + structure, export `metadata`, never use hooks). Interactivity lives in `"use client"` components under `components/<page>/` (page-specific) or `components/{ui,motion,layout}/` (shared). Editable content strings belong in `data/*.ts`, not JSX.
- **WebGL never SSRs**: both `<Canvas>` scenes (`components/three/ParticleField.tsx`, `components/software/InteractiveBlochSphere.tsx`) load via `next/dynamic` with `ssr: false` from a thin client wrapper (`components/home/Hero.tsx`, `components/software/BlochSphereSection.tsx`). New 3D scenes must follow this pattern and provide a non-WebGL fallback for mobile/reduced motion.
- **Design tokens live in `app/globals.css`** (`@theme` block — there is no `tailwind.config.*`): `void`/`panel` backgrounds, `ink`/`ink-dim` text, plus a `glass` custom utility. **Semantic color rule: magenta `photon` = Hardware, cyan `qubit` = Software** — everywhere (cards, badges, buttons, bars). `lib/colors.ts` mirrors the hex values for three.js/SVG.
- **Motion primitives** in `components/motion/`: reuse `Reveal` (scroll reveal), `KineticHeading` (H1 oscillation), `MagneticButton` before writing new motion code. `app/template.tsx` provides route transitions. All motion must respect reduced motion via `useReducedMotionPref()` from `MotionProvider` (this also gates the WebGL canvases entirely).
- **Bloch sphere math** is pure and framework-free in `lib/quantum.ts` (gates = axis–angle SO(3) rotations; Bloch z-up ↔ three.js y-up mapping is owned solely by `blochToThree`/`threeToBloch` in the component).

## Constraints that shaped the code (violating these breaks lint or behavior)

- **React Compiler ESLint rules are strict**: no `Math.random()` during render (use the seeded mulberry32 PRNG pattern), no mutating `useMemo` results in callbacks. Per-frame simulation state (particle velocities, Bloch vector, animation progress) lives in **refs** and is mutated only inside `useFrame`/event handlers. `useMemo` must receive an inline arrow function.
- **Hero layering**: everything stacked above the hero canvas (scrim, text) must be `pointer-events-none` (CTAs re-enable with `pointer-events-auto`), or the particle field silently stops receiving mouse input.
- **`lucide-react` v1 removed brand icons** — GitHub/LinkedIn glyphs are inline SVGs in `components/ui/BrandIcons.tsx`; don't import `Github`/`Linkedin` from lucide.
- **`text-shadow` bleeds through gradient-clipped text** (`bg-clip-text text-transparent`) — such spans need `[text-shadow:none]`.
- **`turbopack.root` is pinned in `next.config.ts`** because a stray lockfile in a parent directory breaks root inference; don't remove it.
