'use client';

import { AnimatePresence, motion } from 'framer-motion';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import { LocationPoint, Phase } from './types';

const gateEase = [0.76, 0, 0.24, 1] as const;

export default function TransitionOverlay({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  const active = selected && phase === 'wash';

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70] bg-[#fffaf5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, times: [0, 0.55, 1], ease: 'easeInOut' }}
        >
          <CoordinateSystemLayer mode="transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative h-[110px] w-[260px] border border-[#ed6a32]/34"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1.14, opacity: [0, 1, 0] }}
              transition={{ duration: 0.42, ease: gateEase }}
            >
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#ed6a32]/30" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#ed6a32]/30" />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
