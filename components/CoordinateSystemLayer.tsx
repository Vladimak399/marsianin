'use client';

import { motion, useReducedMotion } from 'framer-motion';

type CoordinateSystemLayerProps = {
  selectedShift?: number;
  calm?: boolean;
  className?: string;
};

export default function CoordinateSystemLayer({ selectedShift = 0, calm = false, className = '' }: CoordinateSystemLayerProps) {
  const reduceMotion = useReducedMotion();
  const safeShift = Math.max(-20, Math.min(20, selectedShift));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden bg-white ${className}`} aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? { opacity: calm ? 0.06 : 0.1 }
            : { opacity: calm ? 0.05 : 0.1, y: safeShift, scale: calm ? 1.01 : 1 }
        }
        transition={{ duration: reduceMotion ? 0.12 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(237,106,50,.62) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.62) 1px, transparent 1px)',
          backgroundSize: '96px 112px'
        }}
      />

      <motion.div
        className="absolute left-6 right-6 top-[20%] h-px bg-gradient-to-r from-transparent via-[#ed6a32]/40 to-transparent"
        animate={reduceMotion ? { opacity: 0.5 } : { opacity: calm ? 0.22 : 0.54, y: safeShift * 0.3 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
      />
      <motion.div
        className="absolute bottom-[24%] top-6 w-px bg-gradient-to-b from-transparent via-[#ed6a32]/30 to-transparent"
        style={{ left: 'calc(20% + 8px)' }}
        animate={reduceMotion ? { opacity: 0.44 } : { opacity: calm ? 0.2 : 0.44, y: safeShift * 0.4 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
      />

      <motion.div
        className="absolute inset-5 border border-black/[0.035]"
        animate={reduceMotion ? { opacity: 1 } : { opacity: calm ? 0.7 : 1, y: safeShift * 0.15 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.5 }}
      />

      <motion.div
        className="absolute left-[-180px] top-[58px] h-[290px] w-[680px] -rotate-[14deg]"
        animate={
          reduceMotion ? { opacity: calm ? 0.1 : 0.18 } : { opacity: calm ? 0.1 : 0.2, y: safeShift * 0.25, x: calm ? 12 : 0 }
        }
        transition={{ duration: reduceMotion ? 0.12 : 0.6 }}
        style={{
          background: 'linear-gradient(90deg, rgba(237,106,50,0), rgba(237,106,50,.24), rgba(237,106,50,.07), rgba(237,106,50,0))'
        }}
      />

      <div className="absolute left-6 top-8 font-halvar text-[9px] tracking-[0.1em] text-black/30">grid x: 20.512 | y: 54.712</div>
      <div className="absolute right-6 top-8 font-halvar text-[9px] tracking-[0.1em] text-black/28">sector mrsn-01</div>
      <div className="absolute bottom-8 left-6 font-halvar text-[9px] tracking-[0.08em] text-black/30">ticks: 08 / 16 / 24</div>
      <div className="absolute bottom-8 right-6 font-halvar text-[9px] tracking-[0.08em] text-black/24">axis stable</div>
    </div>
  );
}
