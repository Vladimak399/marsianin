'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

export default function BrandHeader() {
  return (
    <motion.header
      className="absolute left-7 right-28 top-9 z-[95] text-left"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: premiumEase }}
    >
      <Link href="/" className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]">
        <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
        <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
      </Link>
    </motion.header>
  );
}
