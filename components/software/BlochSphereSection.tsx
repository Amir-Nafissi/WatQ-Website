"use client";

import dynamic from "next/dynamic";

// Canvas can't SSR — same pattern as the hero's ParticleField
const InteractiveBlochSphere = dynamic(() => import("./InteractiveBlochSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-video items-center justify-center font-mono text-xs text-ink-dim">
      loading qubit…
    </div>
  ),
});

export default function BlochSphereSection() {
  return <InteractiveBlochSphere />;
}
