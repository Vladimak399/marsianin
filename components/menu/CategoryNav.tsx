'use client';

import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { premiumEase } from '@/lib/animations';

type CategoryNavProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  navRef: RefObject<HTMLDivElement>;
  chipsContainerRef: RefObject<HTMLDivElement>;
};

export default function CategoryNav({ categories, activeCategory, onSelect, navRef, chipsContainerRef }: CategoryNavProps) {
  return (
    <div
      ref={navRef}
      className="sticky top-0 z-50 mt-5 border-y border-black/[0.065] bg-white/90 px-2 py-2 shadow-[0_10px_28px_rgba(64,62,62,0.07)] backdrop-blur-sm sm:border lg:top-3"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,transparent_8%,transparent_92%,rgba(255,255,255,0.96)_100%)]" />

      <div
        ref={chipsContainerRef}
        className="relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              data-category-chip={category}
              className="relative min-h-10 snap-start whitespace-nowrap border px-3 py-2 font-sans text-[11px] tracking-[0.08em] lowercase lg:w-full"
              animate={{
                borderColor: isActive ? 'rgba(237,106,50,.82)' : 'rgba(0,0,0,.065)',
                color: isActive ? '#ed6a32' : '#403e3e',
                backgroundColor: 'rgba(255,255,255,.72)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: premiumEase }}
              aria-current={isActive ? 'true' : 'false'}
            >
              <motion.span
                className="absolute inset-x-2 -bottom-px h-px bg-[#ed6a32]"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.18, ease: premiumEase }}
              />
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
