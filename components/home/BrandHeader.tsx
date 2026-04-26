'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import { Phase } from './types';

export default function BrandHeader({ phase = 'map' }: { phase?: Phase }) {
  const isPointTransition = phase === 'lock' || phase === 'docking' || phase === 'wash';

  return (
    <motion.header
      className="absolute left-7 right-28 top-9 z-[95] text-left"
      initial={false}
      animate={{ opacity: isPointTransition ? 0.42 : 1, y: 0 }}
      transition={{ duration: 0.28, ease: premiumEase }}
    >
      <Link href="/" className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]">
        <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
        <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
      </Link>
    </motion.header>
  );
}
