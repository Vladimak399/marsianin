'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import { LocationPoint, Phase } from './types';

const gateEase = [0.76, 0, 0.24, 1] as const;

export default function TransitionOverlay({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  const reduceMotion = useReducedMotion();
  const active = selected && phase === 'wash';
  const duration = reduceMotion ? 0.08 : 0.34;

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70] bg-[#fffaf5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduceMotion ? 1 : [0, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration, times: reduceMotion ? undefined : [0, 0.55, 1], ease: 'easeInOut' }}
        >
          <CoordinateSystemLayer mode="transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative h-[110px] w-[260px] border border-[#ed6a32]/34"
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1.14, opacity: [0, 1, 0] }}
              transition={{ duration: reduceMotion ? 0.08 : 0.42, ease: gateEase }}
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
