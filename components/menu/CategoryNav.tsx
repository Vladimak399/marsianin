'use client';

import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

type CategoryNavProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-2 z-30 mt-4 border border-grid bg-white/90 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:top-3 sm:mt-6">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className="min-h-10 snap-start whitespace-nowrap rounded-sm border px-4 py-2 text-xs uppercase tracking-[0.16em]"
              animate={{
                borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                color: isActive ? '#171717' : '#737373',
                backgroundColor: isActive ? '#fff2e8' : '#ffffff'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: premiumEase }}
            >
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
