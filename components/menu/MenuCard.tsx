'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem, PriceOption } from '@/data/menu';
import { premiumEase } from '@/lib/animations';

type MenuCardProps = {
  item: MenuItem;
  category: string;
  selectedLocation: LocationId | null;
  onOpen: (item: MenuItem, category: string) => void;
  priority?: boolean;
};

const FALLBACK_MENU_IMAGE = '/images/mock/breakfast-card.svg';
const hasValidPrice = (price: unknown): price is number => typeof price === 'number' && Number.isFinite(price) && price > 0;
const hasPendingPrice = (price: unknown) => typeof price === 'number' && Number.isFinite(price) && price === 0;

function PriceOptions({ options }: { options: PriceOption[] }) {
  return (
    <div className="shrink-0 border border-[#ed6a32]/24 bg-[#ed6a32]/[0.06] px-2 py-1.5 text-right">
      <p className="mars-coordinate-label mb-1 text-[7px] text-[#ed6a32]/75">объем / цена</p>
      <div className="space-y-0.5">
        {options.map((option) => (
          <p key={`${option.label}-${option.price}`} className="grid grid-cols-[38px_1fr] gap-2 text-[10px] leading-tight text-[#181512]">
            <span className="text-[#504942]/70">{option.label}</span>
            <span className="font-semibold text-[#ed6a32]">{option.price} ₽</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MenuCard({ item, category, selectedLocation, onOpen, priority = false }: MenuCardProps) {
  const reduceMotion = useReducedMotion();
  const fallbackLocation: LocationId = 'o12';
  const location = selectedLocation ?? fallbackLocation;
  const price = item.priceByLocation[location];
  const priceOptions = item.priceOptionsByLocation?.[location];
  const hasPrice = hasValidPrice(price);
  const isPricePending = hasPendingPrice(price);
  const normalizedImage = item.image?.trim() || FALLBACK_MENU_IMAGE;
  const [imageSrc, setImageSrc] = useState(normalizedImage);

  useEffect(() => {
    setImageSrc(normalizedImage);
  }, [normalizedImage, item.id]);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item, category)}
      className={`group relative grid w-full grid-cols-[124px_1fr] overflow-hidden border bg-[#fffdf8] text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] sm:flex sm:flex-col ${
        hasPrice || isPricePending
          ? 'border-black/[0.075] shadow-[0_6px_16px_rgba(24,21,18,0.035)] hover:border-[#ed6a32]/38 hover:shadow-[0_10px_28px_rgba(237,106,50,0.07)]'
          : 'border-black/[0.055] opacity-[0.68]'
      }`}
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.14, ease: premiumEase }}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-px w-full bg-black/[0.045]" />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-px w-[38%] bg-[#ed6a32]/42" />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-px bg-[#ed6a32]/16" />
      <div className="relative min-h-[154px] w-full overflow-hidden border-r border-black/[0.07] bg-white sm:aspect-[4/3] sm:min-h-0 sm:border-b sm:border-r-0">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="(min-width: 640px) 33vw, 124px"
          priority={priority}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${hasPrice || isPricePending ? 'opacity-[0.95] sm:group-hover:scale-[1.018]' : 'opacity-[0.58] grayscale'}`}
          onError={() => {
            if (imageSrc !== FALLBACK_MENU_IMAGE) setImageSrc(FALLBACK_MENU_IMAGE);
          }}
        />
        {!hasPrice && !isPricePending ? <div className="absolute inset-0 bg-[#fffdf8]/38" /> : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#181512]/16 to-transparent" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="mars-coordinate-label mb-1 text-[8px] text-[#ed6a32]/82">позиция меню</p>
            <h3 className="min-w-0 text-[0.98rem] font-semibold leading-snug tracking-[-0.02em] text-[#181512] sm:text-[1rem]">{item.name}</h3>
          </div>
          {hasPrice && priceOptions?.length ? (
            <PriceOptions options={priceOptions} />
          ) : hasPrice ? (
            <p className="mars-coordinate-label shrink-0 border border-[#ed6a32]/30 bg-[#ed6a32]/[0.07] px-2 py-1 text-[11px] text-[#ed6a32]">{price} ₽</p>
          ) : isPricePending ? (
            <p className="mars-coordinate-label shrink-0 max-w-[94px] border border-black/[0.08] bg-white/70 px-2 py-1 text-right text-[9px] leading-tight text-[#6f675f]">цена уточняется</p>
          ) : (
            <p className="mars-coordinate-label shrink-0 max-w-[82px] text-right text-[9px] leading-tight text-[#9a9188]">нет в этой точке</p>
          )}
        </div>

        {item.description.trim() ? <p className="line-clamp-2 text-[12px] leading-relaxed text-[#504942] sm:line-clamp-none sm:text-sm">{item.description}</p> : null}

        <div className="mt-auto border-t border-black/[0.055] pt-2.5 sm:pt-3">
          <p className="mars-coordinate-label text-[9px] text-[#504942]/82 sm:text-[10px]">
            кбжу · {item.nutrition.calories} / {item.nutrition.protein} / {item.nutrition.fat} / {item.nutrition.carbs}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
