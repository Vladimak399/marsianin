'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';

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
      className="group relative grid w-full grid-cols-[112px_1fr] overflow-hidden rounded-2xl border border-[rgba(24,21,18,0.1)] bg-[#fffdf8] text-left shadow-[0_8px_20px_rgba(24,21,18,0.06)] sm:flex sm:flex-col"
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.14, ease: premiumEase }}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-px w-full bg-[#ed6a32]/24" />
      <div className="relative min-h-[146px] w-full overflow-hidden border-r border-[rgba(24,21,18,0.1)] bg-white sm:aspect-[4/3] sm:min-h-0 sm:border-b sm:border-r-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 430px, 33vw"
          className="object-cover opacity-92 transition-transform duration-300 sm:group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="min-w-0 text-[0.98rem] font-semibold leading-snug tracking-[-0.02em] text-[#181512] sm:text-[1rem]">{item.name}</h3>
          <p className="shrink-0 text-[1.05rem] font-semibold text-[#ed6a32]">{price} ₽</p>
        </div>

        <p className="line-clamp-2 text-[12px] leading-relaxed text-[#504942] sm:line-clamp-none sm:text-sm">{item.description}</p>

        <div className="mt-auto border-t border-[rgba(24,21,18,0.08)] pt-2 sm:pt-3">
          <p className="mars-coordinate-label text-[9px] text-[#504942] sm:text-[11px]">
            кбжу · {item.nutrition.calories} / {item.nutrition.protein} / {item.nutrition.fat} / {item.nutrition.carbs}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
