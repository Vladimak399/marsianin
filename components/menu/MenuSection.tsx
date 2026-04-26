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
    <section id={`section-${section.category}`} data-category={section.category} className="scroll-mt-32 border-t border-black/[0.055] pt-7 first:border-t-0 first:pt-0">
      <header className="mb-4 grid grid-cols-[1fr_auto] items-end gap-4 border-b border-black/[0.045] pb-3">
        <div>
          <p className="mars-coordinate-label text-[9px] text-[#ed6a32]">раздел меню</p>
          <h2 className="mt-1 text-[1.32rem] font-semibold tracking-[-0.035em] text-[#181512]">{section.category}</h2>
        </div>
        <p className="mars-coordinate-label border border-[#ed6a32]/26 bg-[#ed6a32]/[0.08] px-2.5 py-1 text-[10px] text-[#ed6a32]">
          {section.items.length} поз.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
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
