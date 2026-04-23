'use client';

import { motion } from 'framer-motion';
import { LocationId } from '@/data/locations';
import { MenuCategory, MenuItem } from '@/data/menu';
import { fadeUp, staggerContainer } from '@/lib/animations';
import MenuCard from './MenuCard';

type MenuSectionProps = {
  section: MenuCategory;
  selectedLocation: LocationId | null;
  onOpenItem: (item: MenuItem, category: string) => void;
};

export default function MenuSection({ section, selectedLocation, onOpenItem }: MenuSectionProps) {
  return (
    <motion.section
      id={`section-${section.category}`}
      data-category={section.category}
      className="scroll-mt-28 border-t border-grid pt-10 first:border-t-0 first:pt-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={fadeUp}
    >
      <header className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-neutral-900 sm:text-3xl">{section.category}</h2>
        <p className="text-xs uppercase tracking-wider text-neutral-500">{section.items.length} поз.</p>
      </header>
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {section.items.map((item) => (
          <motion.div key={item.id} variants={fadeUp} layout>
            <MenuCard item={item} category={section.category} selectedLocation={selectedLocation} onOpen={onOpenItem} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
