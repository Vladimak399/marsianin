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

type GroupedItems = {
  title: string;
  items: MenuItem[];
};

function groupItemsBySubcategory(items: MenuItem[]): GroupedItems[] {
  const groups = new Map<string, MenuItem[]>();

  items.forEach((item) => {
    const groupTitle = item.subcategory?.trim() || 'основное';
    const existing = groups.get(groupTitle) ?? [];
    existing.push(item);
    groups.set(groupTitle, existing);
  });

  return Array.from(groups.entries()).map(([title, groupItems]) => ({ title, items: groupItems }));
}

export default function MenuSection({ section, selectedLocation, onOpenItem, isFirstSection = false }: MenuSectionProps) {
  const hasItems = section.items.length > 0;
  const shouldGroupBySubcategory = section.category === 'напитки' && section.items.some((item) => item.subcategory);
  const groupedItems = shouldGroupBySubcategory ? groupItemsBySubcategory(section.items) : [];

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

      {hasItems && shouldGroupBySubcategory ? (
        <div className="space-y-7">
          {groupedItems.map((group, groupIndex) => (
            <div key={group.title} className="border-t border-black/[0.045] pt-4 first:border-t-0 first:pt-0">
              <header className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="mars-coordinate-label text-[9px] text-[#ed6a32]">{String(groupIndex + 1).padStart(2, '0')} / подкатегория</p>
                  <h3 className="mt-1 text-[1rem] font-semibold tracking-[-0.025em] text-[#181512]">{group.title}</h3>
                </div>
                <p className="mars-coordinate-label text-[9px] text-[#504942]/70">{group.items.length} поз.</p>
              </header>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
                {group.items.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    category={section.category}
                    selectedLocation={selectedLocation}
                    onOpen={onOpenItem}
                    priority={isFirstSection && groupIndex === 0 && index === 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : hasItems ? (
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
      ) : (
        <div className="border border-dashed border-black/[0.08] bg-white/62 px-4 py-8 text-center">
          <p className="mars-coordinate-label text-[10px] text-[#ed6a32]">меню обновляется</p>
          <p className="mt-2 text-sm leading-relaxed text-[#504942]">позиции в этом разделе скоро появятся</p>
        </div>
      )}
    </section>
  );
}
