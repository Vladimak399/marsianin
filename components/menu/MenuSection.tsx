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
  isFirstSection?: boolean;
};

export default function MenuSection({ section, selectedLocation, onOpenItem, isFirstSection = false }: MenuSectionProps) {
  return (
    <section id={`section-${section.category}`} data-category={section.category} className="scroll-mt-32 border-t border-black/[0.055] pt-7 first:border-t-0 first:pt-0">
      <header className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#0b0b0b]">{section.category}</h2>
        <p className="mars-coordinate-label text-xs text-[#ed6a32]">{section.items.length} поз.</p>
      </header>
      <div className="grid grid-cols-1 gap-4">
        {section.items.map((item, index) => (
          <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-8% 0px -8% 0px' }}>
            <MenuCard
              item={item}
              category={section.category}
              selectedLocation={selectedLocation}
              onOpen={onOpenItem}
              priority={isFirstSection && index === 0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
