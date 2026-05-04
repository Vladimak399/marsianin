'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { getLocationLabel, LocationId } from '@/data/locations';
import { MenuItem, PriceOption } from '@/data/menu';
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
const hasPendingPrice = (price: unknown) => typeof price === 'number' && Number.isFinite(price) && price === 0;
const detailButtonFocusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]';

function DetailPriceOptions({ options }: { options: PriceOption[] }) {
  return (
    <div className="mt-3 border border-[#ed6a32]/24 bg-[#ed6a32]/[0.055] p-3">
      <p className="mars-coordinate-label mb-2 text-[9px] text-[#ed6a32]">объем / цена</p>
      <div className="space-y-1.5">
        {options.map((option) => (
          <p key={`${option.label}-${option.price}`} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/[0.045] pb-1.5 text-sm last:border-b-0 last:pb-0">
            <span className="text-[#504942]">{option.label}</span>
            <span className="font-semibold text-[#ed6a32]">{option.price} ₽</span>
          </p>
        ))}
      </div>
    </div>
  );
}

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
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isOpen = Boolean(item);
  const normalizedImage = item?.image?.trim() || FALLBACK_MENU_IMAGE;
  const [imageSrc, setImageSrc] = useState(normalizedImage);

  useEffect(() => {
    setImageSrc(normalizedImage);
  }, [normalizedImage]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
      if (!closeButtonRef.current) dialogRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      const previousFocus = previousFocusRef.current;
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocusRef.current = null;
    };
  }, [isOpen, onClose]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;
  const price = item?.priceByLocation[selectedLocation];
  const priceOptions = item?.priceOptionsByLocation?.[selectedLocation];
  const hasPrice = hasValidPrice(price);
  const isPricePending = hasPendingPrice(price);

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
            ref={dialogRef}
            className="absolute inset-0 mx-auto max-w-[430px] overflow-y-auto bg-[#fffdf8] text-[#181512] sm:inset-y-8 sm:max-h-[min(90vh,760px)] sm:border sm:border-black/[0.08] sm:shadow-[0_20px_60px_rgba(24,21,18,0.14)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: premiumEase }}
            onClick={(event) => event.stopPropagation()}
            drag={reduceMotion ? false : 'x'}
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
                  ref={closeButtonRef}
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
                {item.containsAlcohol ? (
                  <div className="mars-coordinate-label absolute right-3 top-3 z-10 border border-[#ed6a32]/35 bg-[#fffdf8]/90 px-2.5 py-1.5 text-[10px] text-[#ed6a32] backdrop-blur-sm">18+ · содержит алкоголь</div>
                ) : null}
                <div className="pointer-events-none absolute left-0 top-0 h-px w-[42%] bg-[#ed6a32]/42" />
              </div>

              <div className="mt-5 border border-black/[0.08] bg-white/72 px-4 py-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 border-b border-black/[0.055] pb-3">
                  <p className="mars-coordinate-label text-[10px] text-[#ed6a32] lowercase">цена · {getLocationLabel(selectedLocation)}</p>
                  {hasPrice && !priceOptions?.length ? (
                    <p className="mars-coordinate-label border border-[#ed6a32]/28 bg-[#ed6a32]/[0.08] px-2.5 py-1 text-[11px] text-[#ed6a32]">{price} ₽</p>
                  ) : isPricePending ? (
                    <p className="mars-coordinate-label border border-black/[0.08] bg-white/70 px-2.5 py-1 text-[10px] text-[#6f675f]">цена уточняется</p>
                  ) : !hasPrice ? (
                    <p className="mars-coordinate-label max-w-[120px] text-right text-[9px] leading-tight text-[#9a9188]">нет в этой точке</p>
                  ) : null}
                </div>

                <h2 id={titleId} className="mt-3 text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-[#181512] lowercase">{item.name}</h2>
                {priceOptions?.length ? <DetailPriceOptions options={priceOptions} /> : null}
                {item.description.trim() ? <p id={descriptionId} className="mt-4 text-sm leading-relaxed text-[#504942] lowercase">{item.description}</p> : null}
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
