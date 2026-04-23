'use client';

import { motion, MotionStyle } from 'framer-motion';

type GridOverlayProps = {
  style?: MotionStyle;
  className?: string;
};

export default function GridOverlay({ style, className = '' }: GridOverlayProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(23,23,23,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.12)_1px,transparent_1px)] bg-[size:48px_48px] ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}
