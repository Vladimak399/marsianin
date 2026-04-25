'use client';

import { motion } from 'framer-motion';

export default function GateCode({ id, size = 'large', active = false }: { id: string; size?: 'small' | 'large' | 'hero'; active?: boolean }) {
  const fontSize = size === 'hero' ? 'text-[112px]' : size === 'small' ? 'text-[14px]' : 'text-[58px]';
  const tracking = size === 'hero' ? 'tracking-[-0.035em]' : size === 'small' ? 'tracking-[-0.02em]' : 'tracking-[-0.03em]';

  return (
    <motion.div
      className={`font-halvar inline-block ${fontSize} ${tracking} font-black leading-[0.86] text-[#ed6a32]`}
      animate={{ scale: active ? 1.012 : 1 }}
      transition={{ duration: 0.28 }}
    >
      {id}
    </motion.div>
  );
}
