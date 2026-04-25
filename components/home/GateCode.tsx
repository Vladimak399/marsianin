'use client';

import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

export default function GateCode({ id, size = 'large', active = false }: { id: string; size?: 'small' | 'large' | 'hero'; active?: boolean }) {
  const fontSize = size === 'hero' ? 'text-[112px] sm:text-[128px]' : size === 'small' ? 'text-[17px]' : 'text-[64px]';
  const tracking = size === 'hero' ? 'tracking-[-0.04em]' : size === 'small' ? 'tracking-[-0.025em]' : 'tracking-[-0.035em]';

  return (
    <motion.div
      className={`font-halvar inline-block ${fontSize} ${tracking} font-black leading-[0.86] text-[#ed6a32] [text-shadow:0_0_18px_rgba(237,106,50,0.16)]`}
      animate={{
        scale: active ? 1.035 : 1,
        opacity: active ? 1 : 0.92
      }}
      transition={{ duration: 0.28, ease: premiumEase }}
    >
      {id}
    </motion.div>
  );
}
