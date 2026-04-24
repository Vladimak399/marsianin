'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import { getLocationLabel, LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';
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

export default function MenuDetailView({
  item,
  items,
  activeIndex,
  category,
  selectedLocation,
  onClose,
  onChangeIndex
}: MenuDetailViewProps) {
  useEffect(() => {
    if (!item) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [item]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

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
          className="fixed inset-0 z-50 bg-[#0b0b0b]/30 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: premiumEase }}
          onClick={onClose}
        >
          <motion.article
            className="absolute inset-0 mx-auto max-w-[430px] overflow-y-auto bg-white text-[#0b0b0b] sm:inset-y-8 sm:max-h-[min(90vh,760px)] sm:border sm:border-black/[0.065]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2, ease: premiumEase }}
            onClick={(event) => event.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 overflow-hidden bg-white">
              <div
                className="absolute inset-0 opacity-[0.11]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(237,106,50,.72) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.72) 1px, transparent 1px)',
                  backgroundSize: '96px 112px'
                }}
              />
              <div className="absolute inset-5 border border-black/[0.035]" />
            </div>

            <div className="sticky top-0 z-20 border-b border-black/[0.055] bg-white/86 px-7 py-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="mars-coordinate-label font-sans text-[10px] text-[#ed6a32] lowercase">{category}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-10 border border-black/[0.065] bg-white/78 px-4 py-2 font-sans text-xs tracking-[0.08em] text-[#403e3e] lowercase transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32]"
                >
                  закрыть
                </button>
              </div>
            </div>

            <div className="relative z-10 px-7 pb-8 pt-5">
              <div className="relative aspect-[16/10] overflow-hidden border border-black/[0.065] bg-white/70">
                <Image src={item.image} alt={item.name} fill className="object-cover opacity-90" sizes="(max-width: 430px) 100vw, 430px" />
              </div>

              <div className="mt-5 border-y border-black/[0.055] bg-white/72 py-4 backdrop-blur-sm">
                <p className="mars-coordinate-label text-[10px] text-[#ed6a32] lowercase">цена · {getLocationLabel(selectedLocation)}</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h2 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-[#0b0b0b] lowercase">{item.name}</h2>
                  <p className="shrink-0 text-2xl font-semibold text-[#ed6a32]">{item.priceByLocation[selectedLocation]} ₽</p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#403e3e] lowercase">{item.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-black/[0.055] pb-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="min-h-10 border border-black/[0.065] bg-white/78 px-3 py-2 font-sans text-xs tracking-[0.08em] lowercase text-[#403e3e] transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  назад
                </button>
                <p className="mars-coordinate-label font-sans text-[11px] text-[#403e3e] lowercase">
                  {activeIndex + 1} из {items.length}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="min-h-10 border border-black/[0.065] bg-white/78 px-3 py-2 font-sans text-xs tracking-[0.08em] lowercase text-[#403e3e] transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40"
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
