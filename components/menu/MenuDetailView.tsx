'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: premiumEase }}
          onClick={onClose}
        >
          <motion.article
            className="absolute inset-0 overflow-y-auto border-grid bg-white sm:inset-8 sm:mx-auto sm:max-h-[min(90vh,760px)] sm:max-w-3xl sm:overflow-hidden sm:border"
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
            <div className="sticky top-0 z-10 border-b border-grid bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
              <div className="mx-auto mb-2 h-1.5 w-14 rounded-full bg-neutral-300" />
              <div className="flex items-center justify-between gap-3">
                <p className="font-sans text-[10px] tracking-[0.14em] text-neutral-500 lowercase">{category}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-10 font-sans text-xs tracking-[0.12em] text-neutral-500 lowercase transition-colors active:text-neutral-900"
                >
                  закрыть
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[260px] border-b border-grid bg-[#f9efe6] sm:min-h-[440px] sm:border-b-0 sm:border-r">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
              <div className="flex flex-col p-5 sm:p-6">
                <div className="hidden items-start justify-between gap-4 border-b border-grid pb-4 sm:flex">
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.16em] text-neutral-500 lowercase">{category}</p>
                    <h2 className="mt-2 font-sans text-[1.5rem] font-semibold tracking-[0.02em] text-neutral-900 lowercase sm:text-2xl">{item.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-10 font-sans text-xs tracking-[0.12em] text-neutral-500 lowercase transition-colors hover:text-neutral-900"
                  >
                    закрыть
                  </button>
                </div>

                <h2 className="font-sans text-[1.45rem] font-semibold tracking-[0.02em] text-neutral-900 lowercase sm:hidden">{item.name}</h2>
                <p className="mt-4 font-sans text-sm leading-relaxed text-neutral-700 lowercase">{item.description}</p>

                <div className="mt-4 border border-grid bg-[#ffefe2] px-4 py-3">
                  <p className="font-sans text-[11px] tracking-[0.14em] text-neutral-600 lowercase">цена · {getLocationLabel(selectedLocation)}</p>
                  <p className="mt-1 font-sans text-2xl font-semibold text-neutral-900">{item.priceByLocation[selectedLocation]} ₽</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-b border-grid pb-4 sm:mt-5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className="min-h-10 border border-grid px-3 py-2 font-sans text-xs tracking-[0.12em] lowercase text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    предыдущее
                  </button>
                  <p className="font-sans text-[11px] tracking-[0.12em] text-neutral-500 lowercase">
                    {activeIndex + 1} из {items.length}
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="min-h-10 border border-grid px-3 py-2 font-sans text-xs tracking-[0.12em] lowercase text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    следующее
                  </button>
                </div>

                <NutritionTable nutrition={item.nutrition} />
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
