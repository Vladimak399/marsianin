'use client';

import { MotionStyle, MotionValue, motion, useMotionValue, useTransform } from 'framer-motion';

type GridOverlayProps = {
  style?: MotionStyle;
  className?: string;
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
};

export default function GridOverlay({ style, className = '', pointerX, pointerY }: GridOverlayProps) {
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);

  const reactiveX = useTransform(pointerX ?? fallbackX, [-0.5, 0.5], [-3, 3]);
  const reactiveY = useTransform(pointerY ?? fallbackY, [-0.5, 0.5], [-3, 3]);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(23,23,23,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.12)_1px,transparent_1px)] bg-[size:48px_48px] ${className}`}
      style={{ ...style, x: reactiveX, y: reactiveY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}
