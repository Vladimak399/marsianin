'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import { NearestLocation, Phase } from './types';
import { LOCATIONS, LocationPoint } from './types';

export function CoordinateBackground({ selected, phase, nearestId }: { selected: LocationPoint | null; phase: Phase; nearestId: string | null }) {
  const hidden = phase === 'open';
  const axisScale = selected ? Math.max(0, (selected.visual.y - 31) / 46) : nearestId ? 43 / 46 : 1;

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-10" animate={{ opacity: hidden ? 0 : 1 }} transition={{ duration: 0.3 }}>
      <div className="absolute left-7 top-[31%] h-[46%] w-px bg-black/[0.055]" />
      <motion.div
        className="absolute left-7 top-[31%] h-[46%] w-px origin-top bg-[#ed6a32]/32"
        animate={{ scaleY: axisScale }}
        transition={{ duration: 0.56, ease: premiumEase }}
      />
      {LOCATIONS.map((point) => (
        <motion.div
          key={point.id}
          className="absolute left-[25px] h-1.5 w-1.5 border border-[#ed6a32]/45 bg-white"
          style={{ top: `${point.visual.y}%` }}
          animate={{ opacity: selected && selected.id !== point.id ? 0.16 : nearestId === point.id ? 1 : 0.54, scale: nearestId === point.id && !selected ? 1.2 : 1 }}
          transition={{ duration: 0.28 }}
        />
      ))}
    </motion.div>
  );
}

export function ProximityLine({ nearest, phase }: { nearest: NearestLocation | null; phase: Phase }) {
  if (!nearest || phase === 'open') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none absolute left-7 right-7 z-20 h-px bg-[#ed6a32]/28"
        style={{ top: `${nearest.visual.y}%` }}
        initial={{ scaleX: 0, opacity: 0, transformOrigin: 'left' }}
        animate={{ scaleX: 1, opacity: 1 }}
        exit={{ scaleX: 0, opacity: 0 }}
        transition={{ delay: 0.58, duration: 0.62, ease: premiumEase }}
      />
    </AnimatePresence>
  );
}
