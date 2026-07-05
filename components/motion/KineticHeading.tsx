"use client";

import { motion } from "framer-motion";
import { useReducedMotionPref } from "./MotionProvider";

interface KineticHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/** H1 with a subtle continuous 1px vertical oscillation — "quantum fluctuation". */
export default function KineticHeading({
  children,
  className,
}: KineticHeadingProps) {
  const reduced = useReducedMotionPref();
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: reduced ? 0 : [0, -1, 0, 1, 0] }}
      transition={{
        opacity: { duration: 0.8 },
        y: reduced
          ? { duration: 0.8 }
          : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
      }}
    >
      {children}
    </motion.h1>
  );
}
