# WatQ Website — Architecture

This document explains how the WatQ website is built: the rendering model, the design system, the motion and 3D layers, the data layer, and the conventions to follow when extending it.

## 1. Overview

The site is a **fully static, frontend-only** Next.js application. There is no backend, no database, and no API route: every page is prerendered to static HTML at build time, and all content (team members, hardware milestones, algorithms, recruitment info) is hardcoded in TypeScript modules under `/data`. Interactivity — animations, the WebGL hero, the interactive Bloch sphere — runs entirely in the browser.

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), TypeScript, React 19 |
| Styling | Tailwind CSS v4 (design tokens via `@theme` in `app/globals.css`) |
| UI animation | Framer Motion 12 |
| 3D / WebGL | three.js via `@react-three/fiber` (R3F) + `@react-three/drei` |
| Icons | `lucide-react` (+ two inline brand SVGs) |
| Code highlighting | `react-syntax-highlighter` (PrismLight, Python only) |
| Fonts | Inter (body) + JetBrains Mono (accents/code) via `next/font/google` |
| Hosting | Vercel, zero-config (`next build`, no `output: 'export'` needed) |

## 2. Rendering Model: Static Shell, Client Islands

Every route is a **Server Component page** that prerenders to static HTML (the build output shows `○ (Static)` for all routes). Interactive pieces are isolated into **client components** (`"use client"`) that hydrate on load:

```
Server (static HTML at build time)          Client (hydrates in browser)
──────────────────────────────────          ─────────────────────────────
app/layout.tsx  ── fonts, metadata          MotionProvider (context)
app/*/page.tsx  ── copy, structure          Navbar (route highlight, menu)
data/*.ts       ── content                  Reveal / KineticHeading
                                            ParticleField (WebGL, lazy)
                                            InteractiveBlochSphere (WebGL, lazy)
                                            AlgorithmShowcase, QubitToggle…
```

Two rules keep this clean:

1. **Pages never use hooks.** `app/*/page.tsx` files are server components that compose client components and pass data from `/data` down as props (or the client component imports the data module itself — data modules are isomorphic).
2. **WebGL never renders on the server.** The two `<Canvas>` components (`ParticleField`, `InteractiveBlochSphere`) are loaded with `next/dynamic` and `ssr: false`. Because `ssr: false` is only allowed inside client components, each canvas has a thin client wrapper that owns the dynamic import (`Hero.tsx` for the particle field, `BlochSphereSection.tsx` for the Bloch sphere). This also code-splits three.js out of the initial bundle for pages that don't need it.

## 3. Directory Layout

```
app/                    Routes (App Router). One folder per page + shared chrome.
  layout.tsx            Root layout: fonts, metadata, Navbar/Footer, MotionProvider.
  template.tsx          Page-transition wrapper (re-mounts per navigation).
  globals.css           THE design system: @theme tokens, glass utility, base styles.
  page.tsx              Home. hardware/ software/ team/ join/ follow the same shape.
components/
  layout/               Navbar, Footer (site chrome).
  motion/               MotionProvider, Reveal, KineticHeading (motion primitives).
  ui/                   MagneticButton, BrandIcons (generic UI atoms).
  three/                ParticleField (hero WebGL scene).
  home/ hardware/       Page-specific sections, grouped by the page that owns
  software/ team/ join/   them (Hero, WaveguideDiagram, InteractiveBlochSphere…).
data/                   All site content, typed. No fetching anywhere.
lib/                    Pure logic: colors.ts (palette constants), quantum.ts (qubit math).
```

**Convention:** a component used by exactly one page lives in `components/<page>/`; anything reused across pages lives in `components/ui|motion|layout`. Content strings that a non-developer might edit belong in `data/`, not in JSX.

## 4. Design System ("Quantum Minimalism")

The entire design system lives in `app/globals.css` as Tailwind v4 `@theme` tokens — there is no `tailwind.config.*`:

```css
--color-void:   #050508   /* page background (deep space)        */
--color-panel:  #0A0A0F   /* cards / panels                      */
--color-photon: #FF007F   /* Hardware accent (photonics magenta) */
--color-photon-deep: #D900FF
--color-qubit:  #00F0FF   /* Software accent (Qiskit cyan)       */
--color-ink:    #E2E8F0   /* primary text                        */
--color-ink-dim:#94A3B8   /* secondary text                      */
```

These become Tailwind utilities (`bg-void`, `text-photon`, `border-qubit/40`, …). The semantic split matters: **magenta always means Hardware, cyan always means Software** — sub-team cards, team-member badges, gate buttons, and the probability bar all follow it. `lib/colors.ts` re-exports the same hex values for contexts Tailwind can't reach (three.js materials, SVG strokes).

Other pieces:

- **Glassmorphism** is a single custom utility, `@utility glass` (`bg-white/5` + `backdrop-blur` + `border-white/10`), used by the navbar, all cards, and the gate buttons.
- **Fonts** are wired in `app/layout.tsx` via `next/font/google` into CSS variables (`--font-inter`, `--font-jetbrains-mono`) which the `@theme` block maps to `font-sans` / `font-mono`. Monospace signals "technical": kets (|0⟩), angles, code, eyebrow labels.
- **Dark mode only** by design; `color-scheme: dark` is set on `<html>`.

## 5. Motion Architecture

All UI motion is Framer Motion, organized as a small set of primitives rather than per-page animation code:

- **`MotionProvider`** (`components/motion/MotionProvider.tsx`) wraps the app in `<MotionConfig reducedMotion="user">` and exposes `useReducedMotionPref()`. Framer handles declarative animations automatically under reduced motion; the hook exists for effects Framer can't govern — the WebGL canvases, the kinetic oscillation, magnetic pull, and gate animations all check it and degrade to static/instant.
- **`Reveal`** — the standard scroll-reveal (`whileInView`, opacity 0→1, y 20→0, fire-once). Nearly every section is wrapped in it; stagger is done by passing `delay` per item.
- **`KineticHeading`** — page H1s with a perpetual ±1px vertical oscillation ("quantum fluctuation").
- **`MagneticButton`** — primary CTAs; cursor-following translation implemented with `useMotionValue` + `useSpring` (no React re-renders on mouse move).
- **`app/template.tsx`** — route transitions. Next re-mounts `template.tsx` on every navigation, so a single `motion.div` (fade + y-slide in) gives page transitions without a custom router wrapper.

Micro-interactions (card hover glow/scale, tab pills with `layoutId`, `AnimatePresence` content swaps in the algorithm tabs and qubit toggle) live in their owning components.

## 6. 3D / WebGL Layer

Both scenes follow the same performance pattern, dictated by the project's ESLint setup (React Compiler rules: `react-hooks/purity`, `react-hooks/immutability`):

> **Render-time data is immutable and memoized; simulation state lives in refs and is mutated only inside `useFrame`.** Random generation uses a seeded PRNG (mulberry32), never `Math.random()` in render.

### 6.1 Hero particle field (`components/three/ParticleField.tsx`)

A torus knot "woven" from 24,000 particles (ported from 21st.dev's woven-light-hero, heavily optimized):

- **Geometry**: particle positions are sampled from a `TorusKnotGeometry` and colored along a photon→qubit gradient per strand position (computed once in `useMemo`).
- **Physics** (per frame, allocation-free scalar math on `Float32Array`s): the cursor repels particles within a radius; displaced particles spring back to their home position with damping (`velocity = (velocity + (home − pos) · k) · damping`).
- **Screen-space repulsion**: the cursor's influence is a *depth column*, not a sphere — distance is measured in world x/y only, with the particle's x rotated into world space to account for the knot's slow spin. This makes strands on both the near and far side ripple under the pointer.
- **Layering in the hero** (`components/home/Hero.tsx`), back to front: CSS gradient fallback → canvas (all viewports; skipped under reduced motion) → **pointer-transparent scrim** (radial vignette that restores text contrast) → copy (itself `pointer-events-none` except CTAs). The scrim and text layers must stay `pointer-events-none` or the canvas stops receiving mouse events — this exact bug happened once.

### 6.2 Interactive Bloch sphere (`components/software/InteractiveBlochSphere.tsx` + `lib/quantum.ts`)

The physics/math is deliberately split from the rendering:

- **`lib/quantum.ts`** is pure and framework-free: Bloch vector ↔ (θ, φ) conversion, Rodrigues rotation, and the gate table. Gates are stored as **axis–angle rotations** (the SO(3) action of each unitary: X/Y/Z/H rotate by π about their axis, S and T by π/2 and π/4 about z — global phase is irrelevant on the sphere). Being pure, it's directly testable with `node --experimental-strip-types`.
- **Coordinate convention**: Bloch coordinates are z-up (|0⟩ at the north pole); three.js is y-up. A single pair of helpers (`blochToThree`/`threeToBloch`) owns the mapping — no other code translates axes.
- **State flow**: the Bloch vector lives in a ref (mutable, 60 fps). `useFrame` advances any running gate animation (eased sweep of the rotation angle, so the vector travels the true arc), orients the vector mesh, and reports (θ, φ) upward via callback. The parent mirrors *rounded* angles into React state — `setState` fires only when a rounded value changes, bounding re-renders.
- **Dragging**: an invisible enlarged hitbox at the vector tip captures the pointer; each move analytically intersects the pointer ray with the unit sphere (nearest silhouette point on miss) and normalizes. Drei `OrbitControls` (rotate-only) is disabled while dragging so the two gestures don't conflict.
- Labels use drei `<Html>` (inherits site fonts, no WebGL font loading) and are pointer-transparent.

## 7. Data Layer

Each file in `/data` exports typed content consumed by exactly one page:

| File | Types | Consumed by |
| --- | --- | --- |
| `team.ts` | `TeamMember`, `SubTeam` | Team grid (accent color keyed off `subteam`) |
| `hardware.ts` | `Milestone`, physics pillars | Hardware timeline + explainer cards |
| `software.ts` | `Algorithm` (incl. Qiskit `code` strings) | Algorithm tabs + code blocks |
| `join.ts` | `Track`, `recruitment` | Qubit toggle + application steps |

Editing content requires no knowledge of the components: change the data file, the UI re-renders from it. Because the data is imported statically, content changes are picked up at build time — consistent with the fully-static model.

## 8. Accessibility & Performance Decisions

- **Reduced motion** is honored at three levels: Framer's `MotionConfig` (declarative animations), `useReducedMotionPref()` (WebGL canvases removed, oscillation/magnetics/gate sweeps disabled), and instant state jumps replacing animated ones.
- **Mobile**: the hero canvas runs everywhere but scales itself down under 768px (10k particles instead of 24k, dpr cap 1.25, camera pulled back so the knot fits narrow screens), with a static CSS radial-gradient behind it as the reduced-motion fallback; grids stack via standard Tailwind breakpoints; the Bloch canvas is `touch-none` so dragging doesn't scroll the page.
- **Bundle**: three.js loads only via the lazy canvases; `react-syntax-highlighter` uses `PrismLight` with only Python registered; both canvases cap `dpr` at 1.5 and use `antialias: false` (hero).
- **Contrast**: hero text sits on a radial scrim + dark text-shadows to hold ≥4.5:1 over the bright particle field (gradient-clipped text gets `text-shadow: none` since shadows bleed through transparent glyphs).
- **Known constraint**: `lucide-react` v1 removed brand icons, so GitHub/LinkedIn glyphs are inline SVGs in `components/ui/BrandIcons.tsx`.

## 9. Build, Lint, Deploy

```bash
npm run dev      # local dev (Turbopack)
npx eslint .     # ESLint 9 flat config + React Compiler rules (purity/immutability)
npm run build    # production build — every route must show ○ (Static)
```

- `next.config.ts` pins `turbopack.root` (a stray lockfile in a parent directory otherwise confuses root inference on this machine).
- The React Compiler lint rules are strict and shape the code: no `Math.random()` or mutation of memoized values during render — this is why both WebGL components keep simulation state in refs and use a seeded PRNG.
- **Deploy**: push to `main` → Vercel builds with defaults. No environment variables, no server runtime; every route is prerendered and served from the CDN.

## 10. Extension Guide

- **New page**: create `app/<name>/page.tsx` (server component, exports `metadata`), put its sections in `components/<name>/`, its content in `data/<name>.ts`, and add the route to the `links` array in `components/layout/Navbar.tsx`.
- **New content**: edit the relevant `/data` file only.
- **New animation**: reuse `Reveal`/`KineticHeading`/`MagneticButton` before writing new motion code; anything new must respect `useReducedMotionPref()`.
- **New 3D scene**: client component + `next/dynamic` `ssr: false` wrapper; render-immutable data in `useMemo`, mutable sim state in refs, mutations only in `useFrame`; provide a non-WebGL fallback for mobile/reduced-motion.
- **Colors**: add tokens to `@theme` in `globals.css` (and mirror in `lib/colors.ts` if three.js/SVG needs them). Keep the magenta=Hardware / cyan=Software semantics.
