'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={navRef}
      role="navigation"
      aria-label="категории меню"
      className="sticky top-0 z-50 mt-5 border border-black/[0.075] bg-[#fffdf8]/88 px-2 py-2 shadow-[0_10px_28px_rgba(24,21,18,0.055)] backdrop-blur-md lg:top-3"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ed6a32]/28" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/[0.045]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.98)_0%,transparent_12%,transparent_88%,rgba(255,253,248,0.98)_100%)]" />

      <div
        ref={chipsContainerRef}
        className="relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible"
      >
        {categories.map((category, index) => {
          const isActive = category === activeCategory;

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              data-category-chip={category}
              className="relative min-h-10 snap-start whitespace-nowrap border px-3 py-2 font-sans text-[11px] tracking-[0.08em] lowercase outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] lg:w-full"
              animate={{
                borderColor: isActive ? 'rgba(237,106,50,.84)' : 'rgba(24,21,18,.095)',
                color: isActive ? '#ed6a32' : '#504942',
                backgroundColor: isActive ? 'rgba(255,250,245,.98)' : 'rgba(255,255,255,.72)'
              }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.16, ease: premiumEase }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="mars-coordinate-label absolute left-2 top-1 text-[7px] text-black/26" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="relative top-0.5">{category}</span>
              <motion.span
                className="absolute inset-x-2 -bottom-px h-px bg-[#ed6a32]"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0.72 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: premiumEase }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
