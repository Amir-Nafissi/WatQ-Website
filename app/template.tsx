"use client";

import { motion } from "framer-motion";

/** Page transition: fade + slight Y-slide on every route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
