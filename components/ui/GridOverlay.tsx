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
      className={`pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,106,44,0.33)_1.2px,transparent_1.2px),linear-gradient(to_bottom,rgba(255,106,44,0.33)_1.2px,transparent_1.2px),radial-gradient(circle_at_20%_10%,rgba(255,140,64,0.12),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,168,98,0.08),transparent_52%)] bg-[size:40px_40px,40px_40px,100%_100%,100%_100%] sm:bg-[size:56px_56px,56px_56px,100%_100%,100%_100%] ${className}`}
      style={{ ...style, x: reactiveX, y: reactiveY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.24 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}
