'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { teleportOverlayVariants } from '@/lib/animations';

type TeleportOverlayProps = {
  origin: { x: number; y: number };
  locationLabel?: string;
};

export default function TeleportOverlay({ origin, locationLabel }: TeleportOverlayProps) {
  const [showContext, setShowContext] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowContext(false), 180);
    return () => window.clearTimeout(timer);
  }, [locationLabel]);

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
        transformOrigin: `${origin.x}px ${origin.y}px`,
        willChange: 'transform, opacity'
      }}
    >
      <AnimatePresence>
        {showContext && locationLabel ? (
          <motion.div
            key={locationLabel}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-grid bg-white/95 px-5 py-2 text-xs tracking-[0.08em] text-neutral-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            точка: {locationLabel}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
