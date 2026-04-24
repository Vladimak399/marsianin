'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';

type MenuCardProps = {
  item: MenuItem;
  category: string;
  selectedLocation: LocationId | null;
  onOpen: (item: MenuItem, category: string) => void;
  priority?: boolean;
};

export default function MenuCard({ item, category, selectedLocation, onOpen, priority = false }: MenuCardProps) {
  const fallbackLocation: LocationId = 'o12';
  const location = selectedLocation ?? fallbackLocation;
  const price = item.priceByLocation[location];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item, category)}
      className="group flex w-full flex-col overflow-hidden rounded-sm border border-grid bg-white text-left"
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.14 }}
      layout
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-grid bg-[#f9efe6]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 sm:group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1rem] font-semibold leading-snug tracking-[0.01em] text-neutral-900 sm:text-lg">{item.name}</h3>
          <p className="shrink-0 text-[1.1rem] font-semibold text-accent">{price} ₽</p>
        </div>

        <p className="text-sm leading-relaxed text-neutral-600">{item.description}</p>

        <div className="mt-auto border-t border-grid pt-3">
          <p className="text-[11px] tracking-[0.12em] text-neutral-500">
            кбжу · {item.nutrition.calories} / {item.nutrition.protein} / {item.nutrition.fat} / {item.nutrition.carbs}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
