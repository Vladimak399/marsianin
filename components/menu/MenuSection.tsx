'use client';

import { motion } from 'framer-motion';
import { LocationId } from '@/data/locations';
import { MenuCategory, MenuItem } from '@/data/menu';
import { fadeUp } from '@/lib/animations';
import MenuCard from './MenuCard';

type MenuSectionProps = {
  section: MenuCategory;
  selectedLocation: LocationId | null;
  onOpenItem: (item: MenuItem, category: string) => void;
};

export default function MenuSection({ section, selectedLocation, onOpenItem }: MenuSectionProps) {
  return (
    <section id={`section-${section.category}`} data-category={section.category} className="scroll-mt-36 border-t border-grid pt-8 first:border-t-0 first:pt-0 sm:scroll-mt-40 sm:pt-10">
      <header className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
        <h2 className="text-[1.3rem] font-semibold text-neutral-900 sm:text-3xl">{section.category}</h2>
        <p className="text-xs text-neutral-500">{section.items.length} поз.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item) => (
          <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-8% 0px -8% 0px' }}>
            <MenuCard item={item} category={section.category} selectedLocation={selectedLocation} onOpen={onOpenItem} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
