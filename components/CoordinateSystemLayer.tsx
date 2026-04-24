'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

type CoordinateSystemLayerProps = {
  mode: 'map' | 'menu' | 'open' | 'transition';
  verticalShift?: number;
  muted?: boolean;
};

export default function CoordinateSystemLayer({ mode, verticalShift = 0, muted = false }: CoordinateSystemLayerProps) {
  const reduceMotion = useReducedMotion();
  const isOpen = mode === 'open';
  const isMenu = mode === 'menu';

  const baseOpacity = muted ? 0.05 : isOpen ? 0.075 : isMenu ? 0.062 : 0.07;
  const axisOpacity = muted ? 0.16 : isOpen ? 0.24 : 0.2;

  const shiftY = reduceMotion ? 0 : verticalShift;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white" aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: baseOpacity, y: shiftY }}
        transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: premiumEase }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(237,106,50,.38) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.38) 1px, transparent 1px)',
          backgroundSize: '104px 104px'
        }}
      />

      <motion.div
        className="absolute inset-5 border border-black/[0.035]"
        animate={{ opacity: muted ? 0.72 : 1, y: shiftY * 0.35 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: premiumEase }}
      />

      <motion.div
        className="absolute left-6 right-6 top-[26%] h-px bg-gradient-to-r from-transparent via-[#ed6a32]/55 to-transparent"
        animate={{ opacity: axisOpacity, scaleX: isOpen ? 1 : 0.94, y: shiftY * 0.45 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.48, ease: premiumEase }}
      />

      <motion.div
        className="absolute bottom-8 top-8 left-[22%] w-px bg-gradient-to-b from-transparent via-[#ed6a32]/40 to-transparent"
        animate={{ opacity: axisOpacity * 0.92, scaleY: isOpen ? 1 : 0.95, y: shiftY * 0.55 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.48, ease: premiumEase }}
      />

      <motion.div
        className="absolute left-[calc(22%-3px)] top-[26%] h-[7px] w-[7px] rounded-full border border-[#ed6a32]/60"
        animate={{ opacity: muted ? 0.35 : 0.7, y: shiftY * 0.5 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: premiumEase }}
      />

    </div>
  );
}
