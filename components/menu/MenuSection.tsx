'use client';

import { LocationId } from '@/data/locations';
import { MenuCategory, MenuItem } from '@/data/menu';
import MenuCard from './MenuCard';

type MenuSectionProps = {
  section: MenuCategory;
  selectedLocation: LocationId | null;
  onOpenItem: (item: MenuItem, category: string) => void;
  isFirstSection?: boolean;
};

export default function MenuSection({ section, selectedLocation, onOpenItem, isFirstSection = false }: MenuSectionProps) {
  return (
    <section id={`section-${section.category}`} data-category={section.category} className="scroll-mt-32 border-t border-[rgba(24,21,18,0.08)] pt-7 first:border-t-0 first:pt-0">
      <header className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#181512]">{section.category}</h2>
        <p className="mars-coordinate-label rounded-full border border-[#ed6a32]/30 bg-[#ed6a32]/10 px-2.5 py-1 text-xs text-[#ed6a32]">
          {section.items.length} поз.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            category={section.category}
            selectedLocation={selectedLocation}
            onOpen={onOpenItem}
            priority={isFirstSection && index === 0}
          />
        ))}
      </div>
    </section>
  );
}
