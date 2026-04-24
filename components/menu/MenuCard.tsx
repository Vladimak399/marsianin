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
      className="group relative flex w-full flex-col overflow-hidden border border-black/[0.065] bg-white/78 text-left backdrop-blur-sm"
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.14, ease: premiumEase }}
      layout
    >
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-px bg-[#ed6a32]/70"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.28, ease: premiumEase }}
      />
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-black/[0.065] bg-white/70">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover opacity-90 transition-transform duration-300 sm:group-hover:scale-[1.015]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1rem] font-semibold leading-snug tracking-[-0.02em] text-[#0b0b0b]">{item.name}</h3>
          <p className="shrink-0 text-[1.05rem] font-semibold text-[#ed6a32]">{price} ₽</p>
        </div>

        <p className="text-sm leading-relaxed text-[#403e3e]">{item.description}</p>

        <div className="mt-auto border-t border-black/[0.055] pt-3">
          <p className="mars-coordinate-label text-[11px] text-[#403e3e]">
            кбжу · {item.nutrition.calories} / {item.nutrition.protein} / {item.nutrition.fat} / {item.nutrition.carbs}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
