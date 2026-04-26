'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();
  const fallbackLocation: LocationId = 'o12';
  const location = selectedLocation ?? fallbackLocation;
  const price = item.priceByLocation[location];
  const hasPrice = typeof price === 'number';

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item, category)}
      className={`group relative grid w-full grid-cols-[112px_1fr] overflow-hidden border bg-[#fffdf8] text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] sm:flex sm:flex-col ${
        hasPrice
          ? 'border-black/[0.075] shadow-[0_8px_20px_rgba(24,21,18,0.045)] hover:border-[#ed6a32]/34 hover:shadow-[0_14px_34px_rgba(237,106,50,0.08)]'
          : 'border-black/[0.055] opacity-[0.68]'
      }`}
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.14, ease: premiumEase }}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-px w-full bg-[#ed6a32]/24" />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-px w-[34%] bg-[#ed6a32]/38" />
      <div className="relative min-h-[146px] w-full overflow-hidden border-r border-black/[0.07] bg-white sm:aspect-[4/3] sm:min-h-0 sm:border-b sm:border-r-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 430px, 33vw"
          className={`object-cover transition-transform duration-300 ${hasPrice ? 'opacity-[0.94] sm:group-hover:scale-[1.025]' : 'opacity-[0.58] grayscale'}`}
        />
        {!hasPrice ? <div className="absolute inset-0 bg-[#fffdf8]/38" /> : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="min-w-0 text-[0.98rem] font-semibold leading-snug tracking-[-0.02em] text-[#181512] sm:text-[1rem]">{item.name}</h3>
          {hasPrice ? (
            <p className="mars-coordinate-label shrink-0 border border-[#ed6a32]/28 bg-[#ed6a32]/[0.08] px-2 py-1 text-[11px] text-[#ed6a32]">{price} ₽</p>
          ) : (
            <p className="mars-coordinate-label shrink-0 max-w-[82px] text-right text-[9px] leading-tight text-[#9a9188]">нет в этой точке</p>
          )}
        </div>

        <p className="line-clamp-2 text-[12px] leading-relaxed text-[#504942] sm:line-clamp-none sm:text-sm">{item.description}</p>

        <div className="mt-auto border-t border-black/[0.055] pt-2 sm:pt-3">
          <p className="mars-coordinate-label text-[9px] text-[#504942]/82 sm:text-[10px]">
            кбжу · {item.nutrition.calories} / {item.nutrition.protein} / {item.nutrition.fat} / {item.nutrition.carbs}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
