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
  const isTransition = mode === 'transition';

  const baseOpacity = muted ? 0.055 : isOpen ? 0.09 : isMenu ? 0.07 : 0.085;
  const axisOpacity = muted ? 0.2 : isOpen ? 0.34 : 0.28;
  const glowOpacity = muted ? 0.06 : isOpen ? 0.18 : isTransition ? 0.24 : 0.12;

  const shiftY = reduceMotion ? 0 : verticalShift;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white" aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: baseOpacity, y: shiftY }}
        transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: premiumEase }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(237,106,50,.68) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.68) 1px, transparent 1px)',
          backgroundSize: '96px 112px'
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
        animate={{ opacity: muted ? 0.35 : 0.7, scale: isTransition && !reduceMotion ? [1, 1.2, 1] : 1, y: shiftY * 0.5 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.2, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-[-170px] top-[74px] h-[290px] w-[680px] -rotate-[14deg] blur-3xl"
        animate={{ opacity: glowOpacity, x: isOpen && !reduceMotion ? 18 : 0, y: shiftY * 0.2 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: premiumEase }}
        style={{
          background: 'linear-gradient(90deg, rgba(237,106,50,0), rgba(237,106,50,.3), rgba(237,106,50,.08), rgba(237,106,50,0))'
        }}
      />

      <motion.div
        className="absolute bottom-[-105px] right-[-210px] h-[350px] w-[640px] -rotate-[22deg] blur-3xl"
        animate={{ opacity: glowOpacity * 0.9, x: isOpen && !reduceMotion ? -14 : 0, y: shiftY * 0.16 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.75, ease: premiumEase }}
        style={{ background: 'linear-gradient(90deg, rgba(237,106,50,0), rgba(237,106,50,.24), rgba(237,106,50,0))' }}
      />

      <div className="absolute left-4 top-4 font-halvar text-[9px] tracking-[0.14em] text-[#ed6a32]/65">X:72.19 / Y:13.04</div>
      <div className="absolute right-4 top-4 font-halvar text-[9px] tracking-[0.12em] text-black/35">GRID·A1</div>
      <div className="absolute bottom-4 right-4 font-halvar text-[9px] tracking-[0.12em] text-black/32">SYS·MARS</div>

      <div className="absolute left-[22%] top-[26%]">
        <div className="absolute -left-[11px] -top-[26px] h-4 w-px bg-[#ed6a32]/48" />
        <div className="absolute -left-[11px] top-[34px] h-4 w-px bg-[#ed6a32]/48" />
        <div className="absolute left-[30px] -top-[3px] h-px w-4 bg-[#ed6a32]/48" />
        <div className="absolute -left-[49px] -top-[3px] h-px w-4 bg-[#ed6a32]/48" />
      </div>
    </div>
  );
}
