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
      className="sticky top-2 z-50 mt-4 border border-grid bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,247,243,0.95))] px-2 py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] backdrop-blur supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(255,255,255,0.93),rgba(249,247,243,0.88))] sm:top-3 sm:mt-6 sm:px-3 sm:py-2"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,transparent_8%,transparent_92%,rgba(255,255,255,0.92)_100%)]" />

      <div
        ref={chipsContainerRef}
        className="relative flex snap-x snap-mandatory gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              data-category-chip={category}
              className="relative min-h-9 snap-start whitespace-nowrap rounded-sm border px-3 py-1.5 font-sans text-[11px] tracking-[0.11em] lowercase"
              animate={{
                borderColor: isActive ? '#ff8a38' : '#d4d4d4',
                color: isActive ? '#171717' : '#6b7280',
                backgroundColor: isActive ? '#fff1e3' : '#ffffff'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: premiumEase }}
              aria-current={isActive ? 'true' : 'false'}
            >
              <motion.span
                className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
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
