'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getLocationLabel, LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import NutritionTable from './NutritionTable';

type MenuDetailViewProps = {
  item: MenuItem | null;
  items: MenuItem[];
  activeIndex: number;
  category: string;
  selectedLocation: LocationId;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
};

const SWIPE_THRESHOLD = 60;
const FALLBACK_MENU_IMAGE = '/images/mock/breakfast-card.svg';
const hasValidPrice = (price: unknown): price is number => typeof price === 'number' && Number.isFinite(price) && price > 0;
const detailButtonFocusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]';

export default function MenuDetailView({
  item,
  items,
  activeIndex,
  category,
  selectedLocation,
  onClose,
  onChangeIndex
}: MenuDetailViewProps) {
  const reduceMotion = useReducedMotion();
  const normalizedImage = item?.image?.trim() || FALLBACK_MENU_IMAGE;
  const [imageSrc, setImageSrc] = useState(normalizedImage);

  useEffect(() => {
    setImageSrc(normalizedImage);
  }, [normalizedImage]);

  useEffect(() => {
    if (!item) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;
  const price = item?.priceByLocation[selectedLocation];
  const hasPrice = hasValidPrice(price);

  const handlePrev = () => {
    if (hasPrev) onChangeIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (hasNext) onChangeIndex(activeIndex + 1);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x <= -SWIPE_THRESHOLD && hasNext) {
      handleNext();
      return;
    }

    if (info.offset.x >= SWIPE_THRESHOLD && hasPrev) {
      handlePrev();
    }
  };

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 bg-[#0b0b0b]/30 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.16, ease: premiumEase }}
          onClick={onClose}
        >
          <motion.article
            className="absolute inset-0 mx-auto max-w-[430px] overflow-y-auto bg-[#fffdf8] text-[#181512] sm:inset-y-8 sm:max-h-[min(90vh,760px)] sm:border sm:border-black/[0.08] sm:shadow-[0_20px_60px_rgba(24,21,18,0.14)]"
            role="dialog"
            aria-modal="true"
            aria-label={`позиция меню: ${item.name}`}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: premiumEase }}
            onClick={(event) => event.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 overflow-hidden bg-white">
              <CoordinateSystemLayer mode="menu" muted />
            </div>

            <div className="sticky top-0 z-20 border-b border-black/[0.065] bg-[#fffdf8]/88 px-7 py-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="mars-coordinate-label font-sans text-[10px] text-[#ed6a32] lowercase">{category}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className={`min-h-10 border border-black/[0.105] bg-white/90 px-4 py-2 font-sans text-xs tracking-[0.08em] text-[#504942] lowercase transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] ${detailButtonFocusClass}`}
                >
                  закрыть
                </button>
              </div>
            </div>

            <div className="relative z-10 px-7 pb-8 pt-5">
              <div className="relative aspect-[16/10] overflow-hidden border border-black/[0.08] bg-white/80 shadow-[0_10px_30px_rgba(24,21,18,0.06)]">
                <Image
                  src={imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover opacity-[0.92]"
                  sizes="(max-width: 430px) 100vw, 430px"
                  onError={() => {
                    if (imageSrc !== FALLBACK_MENU_IMAGE) setImageSrc(FALLBACK_MENU_IMAGE);
                  }}
                />
                <div className="pointer-events-none absolute left-0 top-0 h-px w-[42%] bg-[#ed6a32]/42" />
              </div>

              <div className="mt-5 border border-black/[0.08] bg-white/72 px-4 py-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 border-b border-black/[0.055] pb-3">
                  <p className="mars-coordinate-label text-[10px] text-[#ed6a32] lowercase">цена · {getLocationLabel(selectedLocation)}</p>
                  {hasPrice ? (
                    <p className="mars-coordinate-label border border-[#ed6a32]/28 bg-[#ed6a32]/[0.08] px-2.5 py-1 text-[11px] text-[#ed6a32]">{price} ₽</p>
                  ) : (
                    <p className="mars-coordinate-label max-w-[120px] text-right text-[9px] leading-tight text-[#9a9188]">нет в этой точке</p>
                  )}
                </div>

                <h2 className="mt-3 text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-[#181512] lowercase">{item.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#504942] lowercase">{item.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-black/[0.065] pb-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className={`min-h-10 border border-black/[0.105] bg-white/90 px-3 py-2 font-sans text-xs tracking-[0.08em] lowercase text-[#504942] transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40 ${detailButtonFocusClass}`}
                >
                  назад
                </button>
                <p className="mars-coordinate-label font-sans text-[11px] text-[#504942] lowercase">
                  {activeIndex + 1} из {items.length}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className={`min-h-10 border border-black/[0.105] bg-white/90 px-3 py-2 font-sans text-xs tracking-[0.08em] lowercase text-[#504942] transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40 ${detailButtonFocusClass}`}
                >
                  вперед
                </button>
              </div>

              <NutritionTable nutrition={item.nutrition} />
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
