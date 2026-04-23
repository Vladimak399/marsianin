'use client';

import { motion } from 'framer-motion';

type CategoryNavProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-3 z-30 mt-6 border border-grid bg-white/85 p-2 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className="relative whitespace-nowrap border px-3 py-2 text-xs uppercase tracking-[0.18em]"
              animate={{
                borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                color: isActive ? '#171717' : '#737373',
                backgroundColor: isActive ? '#fff2e8' : '#ffffff'
              }}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.18 }}
            >
              {category}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
