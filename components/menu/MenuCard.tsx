'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { cardHover } from '@/lib/animations';

type MenuCardProps = {
  item: MenuItem;
  category: string;
  selectedLocation: LocationId | null;
  onOpen: (item: MenuItem, category: string) => void;
};

export default function MenuCard({ item, category, selectedLocation, onOpen }: MenuCardProps) {
  const fallbackLocation: LocationId = 'o12';
  const location = selectedLocation ?? fallbackLocation;
  const price = item.priceByLocation[location];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item, category)}
      className="group flex h-full w-full flex-col border border-grid bg-white p-4 text-left transition-colors hover:border-neutral-400"
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      layout
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-grid bg-[#f9efe6]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium uppercase tracking-wide text-neutral-900">{item.name}</h3>
          <p className="shrink-0 text-lg font-semibold text-accent">{price} ₽</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">открыть детали</p>
      </div>
    </motion.button>
  );
}
