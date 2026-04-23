'use client';

import { motion } from 'framer-motion';
import { teleportOverlayVariants } from '@/lib/animations';

export default function TeleportOverlay() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] bg-white"
      variants={teleportOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(23,23,23,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,23,0.14) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity'
      }}
    />
  );
}
