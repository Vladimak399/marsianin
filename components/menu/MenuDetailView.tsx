'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { LocationId } from '@/data/locations';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';
import NutritionTable from './NutritionTable';

type MenuDetailViewProps = {
  item: MenuItem | null;
  category: string;
  selectedLocation: LocationId;
  onClose: () => void;
};

export default function MenuDetailView({ item, category, selectedLocation, onClose }: MenuDetailViewProps) {
  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 backdrop-blur-[2px] sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: premiumEase }}
          onClick={onClose}
        >
          <motion.article
            className="w-full max-w-3xl border border-grid bg-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: premiumEase }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[240px] border-b border-grid bg-[#f9efe6] md:min-h-[420px] md:border-b-0 md:border-r">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
              </div>
              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-grid pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">{category}</p>
                    <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.06em] text-neutral-900">{item.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    закрыть
                  </button>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700">{item.description}</p>
                <div className="mt-4 border border-grid bg-[#ffefe2] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-600">цена / {selectedLocation}</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">{item.priceByLocation[selectedLocation]} ₽</p>
                </div>
                <NutritionTable nutrition={item.nutrition} />
                {item.techNote ? (
                  <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">{item.techNote}</p>
                ) : null}
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
