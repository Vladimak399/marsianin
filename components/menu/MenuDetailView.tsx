'use client';

import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';
import NutritionTable from './NutritionTable';

type MenuDetailViewProps = {
  items: MenuItem[];
  activeIndex: number;
  category: string;
  selectedLocation: LocationId;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
};

const SWIPE_OFFSET_THRESHOLD = 72;
const SWIPE_VELOCITY_THRESHOLD = 520;

export default function MenuDetailView({
  items,
  activeIndex,
  category,
  selectedLocation,
  onClose,
  onSelectIndex
}: MenuDetailViewProps) {
  const item = items[activeIndex];
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const handleSwipeEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) * Math.abs(info.velocity.x);

    if (info.offset.x <= -SWIPE_OFFSET_THRESHOLD || (info.velocity.x < -SWIPE_VELOCITY_THRESHOLD && swipePower > 8000)) {
      if (hasNext) onSelectIndex(activeIndex + 1);
      return;
    }

    if (info.offset.x >= SWIPE_OFFSET_THRESHOLD || (info.velocity.x > SWIPE_VELOCITY_THRESHOLD && swipePower > 8000)) {
      if (hasPrevious) onSelectIndex(activeIndex - 1);
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
            className="absolute inset-x-0 bottom-0 top-8 overflow-hidden border border-grid bg-white shadow-[0_-14px_45px_rgba(15,23,42,0.16)] sm:inset-8 sm:mx-auto sm:max-h-[min(90vh,760px)] sm:max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2, ease: premiumEase }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-grid bg-white/95 px-4 py-3 backdrop-blur">
              <div className="mx-auto mb-2 h-1.5 w-14 rounded-full bg-neutral-300 sm:hidden" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                  {category} · {activeIndex + 1}/{items.length}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-10 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 active:text-neutral-900"
                >
                  закрыть
                </button>
              </div>
            </div>

            <motion.div
              key={item.id}
              className="h-[calc(100%-57px)] overflow-y-auto"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18, ease: premiumEase }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={handleSwipeEnd}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-h-[250px] border-b border-grid bg-[#f9efe6] sm:min-h-[440px] sm:border-b-0 sm:border-r">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/28 to-transparent px-4 pb-4 pt-12 text-[10px] uppercase tracking-[0.22em] text-white/90 sm:hidden">
                    <span>{hasPrevious ? '← предыдущее' : 'начало'}</span>
                    <span>{hasNext ? 'следующее →' : 'конец'}</span>
                  </div>
                </div>
                <div className="flex flex-col p-5 sm:p-6">
                  <h2 className="text-[1.45rem] font-semibold uppercase tracking-[0.05em] text-neutral-900 sm:text-2xl">{item.name}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-700">{item.description}</p>

                  <div className="mt-4 border border-grid bg-[#ffefe2] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-600">цена / {selectedLocation.toUpperCase()}</p>
                    <p className="mt-1 text-2xl font-semibold text-neutral-900">{item.priceByLocation[selectedLocation]} ₽</p>
                  </div>

                  <NutritionTable nutrition={item.nutrition} />
                  {item.techNote ? <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">{item.techNote}</p> : null}
                </div>
              </div>
            </motion.div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
