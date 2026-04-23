import Image from 'next/image';
import { MenuItem } from '@/data/menu';
import NutritionTable from './NutritionTable';

type MenuCardProps = {
  item: MenuItem;
};

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="group flex h-full flex-col border border-grid bg-white p-4 transition-colors hover:border-neutral-400">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-grid bg-neutral-50">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium uppercase tracking-wide text-neutral-900">{item.name}</h3>
          <p className="shrink-0 text-lg font-semibold text-accent">{item.price} ₽</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
        <div className="mt-auto">
          <NutritionTable nutrition={item.nutrition} />
        </div>
      </div>
    </article>
  );
}
