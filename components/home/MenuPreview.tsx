'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { menuData } from '@/data/menu';
import { premiumEase } from '@/lib/animations';

const DESSERT_CATEGORY = 'десерты';

export const MENU_PREVIEW = [
  { number: '01', title: 'кофе', text: 'классика и авторские напитки', category: 'напитки' },
  { number: '02', title: 'завтраки', text: 'с 8:00 до 14:00', category: 'завтраки' },
  { number: '03', title: 'десерты', text: 'для сладких моментов', category: DESSERT_CATEGORY }
] as const;

function getPreviewCount(category: string | null) {
  if (!category) return null;
  return menuData.find((section) => section.category === category)?.items.length ?? null;
}

export default function MenuPreview({ onOpenCategory }: { onOpenCategory: (category: string | null) => void }) {
  const reduceMotion = useReducedMotion();
  const previewItems = MENU_PREVIEW.map((item) => ({
    ...item,
    previewCount: getPreviewCount(item.category)
  }));

  return (
    <motion.div
      className="mt-5 overflow-hidden border border-[#ed6a32]/44 bg-[#fffdf8]"
      role="group"
      aria-label="быстрый переход к разделам меню"
      initial={reduceMotion ? false : { y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 0.16, duration: reduceMotion ? 0.01 : 0.38, ease: premiumEase }}
    >
      {previewItems.map((item, index) => (
        <motion.button
          type="button"
          onClick={() => onOpenCategory(item.category)}
          key={item.number}
          aria-label={`открыть раздел ${item.title}`}
          className="group relative grid w-full grid-cols-[58px_1fr_44px] items-center border-b border-[#ed6a32]/34 px-4 py-5 text-left last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ed6a32]"
          initial={reduceMotion ? false : { y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.14 + index * 0.05, duration: reduceMotion ? 0.01 : 0.36, ease: premiumEase }}
          whileTap={reduceMotion ? undefined : { scale: 0.992 }}
        >
          <div className="mars-coordinate-label text-[10px] text-[#f87c56]" aria-hidden>
            {item.number}
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.01em] text-[#0b0b0b]">{item.title}</div>
            <div className="mt-1 text-[12px] text-[#403e3e]">{item.text}</div>
          </div>
          <div className="text-right text-[10px] text-[#403e3e]">{item.previewCount ? `${item.previewCount} поз.` : '→'}</div>
        </motion.button>
      ))}
    </motion.div>
  );
}
