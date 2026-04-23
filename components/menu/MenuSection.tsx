import { MenuCategory } from '@/data/menu';
import MenuCard from './MenuCard';

type MenuSectionProps = {
  section: MenuCategory;
};

export default function MenuSection({ section }: MenuSectionProps) {
  return (
    <section id={section.category} className="scroll-mt-24 border-t border-grid pt-10 first:border-t-0 first:pt-0">
      <header className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-neutral-900 sm:text-3xl">
          {section.category}
        </h2>
        <p className="text-xs uppercase tracking-wider text-neutral-500">{section.items.length} поз.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item) => (
          <MenuCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}
