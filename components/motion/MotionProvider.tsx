"use client";

import { createContext, useContext } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

const ReducedMotionContext = createContext(false);

/** True when the user prefers reduced motion — used to disable heavy effects (3D, oscillation). */
export function useReducedMotionPref() {
  return useContext(ReducedMotionContext);
}

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <ReducedMotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReducedMotionContext.Provider>
  );
}
