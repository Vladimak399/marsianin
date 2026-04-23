'use client';

import { motion } from 'framer-motion';

export default function GridOverlay() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(23,23,23,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.18)_1px,transparent_1px)] bg-[size:40px_40px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1 }}
    />
  );
}
