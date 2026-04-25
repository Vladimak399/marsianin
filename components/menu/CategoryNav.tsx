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
      role="navigation"
      aria-label="категории меню"
      className="sticky top-0 z-50 mt-5 rounded-2xl border border-[rgba(24,21,18,0.1)] bg-[rgba(255,255,255,0.8)] px-2 py-2 shadow-[0_12px_30px_rgba(24,21,18,0.08)] backdrop-blur-md lg:top-3"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,transparent_10%,transparent_90%,rgba(255,255,255,0.96)_100%)]" />

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
              className="relative min-h-10 snap-start whitespace-nowrap rounded-lg border px-3 py-2 font-sans text-[11px] tracking-[0.08em] lowercase lg:w-full"
              animate={{
                borderColor: isActive ? 'rgba(237,106,50,.82)' : 'rgba(24,21,18,.12)',
                color: isActive ? '#ed6a32' : '#504942',
                backgroundColor: 'rgba(255,255,255,.9)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: premiumEase }}
              aria-current={isActive ? 'page' : undefined}
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
