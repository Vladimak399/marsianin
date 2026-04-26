'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import RollingCoordinate from './RollingCoordinate';
import GateCode from './GateCode';
import { Coordinates, LOCATION_DETAILS, LocationPoint, LOCATIONS } from './types';
import LocationSwitcher from './LocationSwitcher';

export default function LocationOpenPanel({
  selected,
  userCoords,
  isBusy,
  onBack,
  onSwitch,
  onOpenCategory
}: {
  selected: LocationPoint;
  userCoords: Coordinates | null;
  isBusy: boolean;
  onBack: () => void;
  onSwitch: (point: LocationPoint) => void;
  onOpenCategory: (category: string | null) => void;
}) {
  const [isOpeningMenu, setIsOpeningMenu] = useState(false);
  const reduceMotion = useReducedMotion();
  const selectedLocation = LOCATION_DETAILS[selected.id];

  const actionCardClass =
    'group relative grid min-h-[86px] w-full grid-cols-[44px_1fr_auto] items-center gap-3 border border-black/[0.08] bg-[#fffdf8] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#ed6a32]/48 hover:shadow-[0_14px_34px_rgba(237,106,50,0.10)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ed6a32]';
  const primaryActionCardClass =
    'group relative grid min-h-[92px] w-full grid-cols-[44px_1fr_auto] items-center gap-3 border border-[#ed6a32]/72 bg-[#ed6a32] px-4 py-4 text-left text-white shadow-[0_18px_42px_rgba(237,106,50,0.20)] transition hover:-translate-y-0.5 hover:bg-[#df5f2c] active:scale-[0.99] disabled:cursor-progress disabled:bg-[#df8f6e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#ed6a32]';
  const utilityLinkClass =
    'inline-flex min-h-12 items-center justify-center border border-black/[0.08] bg-[#fffdf8] px-3 py-2 text-[10px] tracking-[0.04em] text-black/58 transition hover:-translate-y-0.5 hover:border-[#ed6a32]/45 hover:text-[#ed6a32] hover:shadow-[0_10px_24px_rgba(237,106,50,0.08)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]';
  const mainCtaText = isOpeningMenu ? 'открываем меню' : selected.code ? `открыть меню ${selected.code}` : 'открыть меню';
  const enterInitial = reduceMotion ? false : { y: 14, opacity: 0 };
  const enterAnimate = { y: 0, opacity: 1 };
  const enterTransition = { delay: reduceMotion ? 0 : 0.18, duration: reduceMotion ? 0.01 : 0.34, ease: premiumEase };

  const handleOpenMenu = () => {
    if (isBusy || isOpeningMenu) return;
    setIsOpeningMenu(true);
    onOpenCategory(null);
  };

  return (
    <motion.div
      className="absolute inset-0 z-[80] min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#fffdf8] px-7 pb-8 pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#ed6a32]/14 blur-3xl" />
        <div className="absolute bottom-20 left-8 h-60 w-60 rounded-full bg-[#ed6a32]/10 blur-3xl" />
      </div>

      <div className="sticky top-0 z-[120] -mx-7 flex items-center justify-between border-b border-black/[0.06] bg-[#fffdf8]/92 px-7 py-3 backdrop-blur-sm">
        <div>
          <div className="text-[17px] font-medium tracking-[0.1em] text-black/78">марсианин</div>
          <div className="mt-1 text-[9px] tracking-[0.04em] text-black/42">активная точка</div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="border border-black/[0.065] bg-[#fffdf8]/95 px-4 py-2 text-[10px] tracking-[0.08em] text-black/58 transition hover:-translate-y-0.5 hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]"
        >
          карта
        </button>
      </div>

      <div className="relative z-10 pb-24 pt-8">
        <motion.div initial={reduceMotion ? false : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0.01 : 0.44, ease: premiumEase }}>
          <GateCode id={selected.code} size="hero" active />
          <motion.div className="mt-7 text-lg tracking-[-0.03em] text-black/66" initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.08, duration: reduceMotion ? 0.01 : 0.32 }}>
            {selected.title}
          </motion.div>
          <RollingCoordinate lat={selected.lat} lng={selected.lng} active className="mt-2 text-[10px] text-black/34" />
          <div className="mt-4 space-y-1 text-[11px] text-black/56">
            <p>{selectedLocation.address}</p>
            <p>{selectedLocation.workingHours}</p>
          </div>
          <div className="mt-4 border-y border-black/[0.06] py-2.5">
            <div className="text-[9px] tracking-[0.12em] text-[#ed6a32]">ваши координаты</div>
            {userCoords ? (
              <RollingCoordinate lat={userCoords.lat} lng={userCoords.lng} active variant="labeled" className="mt-1 text-[10px] text-black/45" />
            ) : (
              <div className="mt-1 text-[10px] text-black/38">определяем координаты…</div>
            )}
          </div>
        </motion.div>

        <LocationSwitcher selected={selected} isBusy={isBusy} onSwitch={onSwitch} />

        <motion.div
          className="mt-5 overflow-hidden border border-[#ed6a32]/36 bg-[#fffdf8]"
          role="group"
          aria-label="действия выбранной точки"
          initial={enterInitial}
          animate={enterAnimate}
          transition={enterTransition}
        >
          <button type="button" onClick={handleOpenMenu} disabled={isBusy || isOpeningMenu} aria-busy={isOpeningMenu} className={primaryActionCardClass}>
            <span className="mars-coordinate-label text-[10px] text-white/82" aria-hidden>
              01
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-[0.01em]">{mainCtaText}</span>
              <span className="mt-1 block text-[12px] text-white/82">полное меню, цены и кбжу</span>
            </span>
            <span className="text-[10px] font-semibold text-white/86">{isOpeningMenu ? '...' : 'перейти'}</span>
          </button>

          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noopener noreferrer" className={`${actionCardClass} border-t-0`}>
            <span className="mars-coordinate-label text-[10px] text-[#f87c56]" aria-hidden>
              02
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-[0.01em] text-[#0b0b0b]">построить маршрут</span>
              <span className="mt-1 block text-[12px] text-[#403e3e]">открыть точку в яндекс картах</span>
            </span>
            <span className="text-[10px] text-[#403e3e] group-hover:text-[#ed6a32]">маршрут</span>
          </a>

          <a href={selectedLocation.links.yandexEda} target="_blank" rel="noopener noreferrer" className={`${actionCardClass} border-t-0`}>
            <span className="mars-coordinate-label text-[10px] text-[#f87c56]" aria-hidden>
              03
            </span>
            <span>
              <span className="block text-[13px] font-semibold tracking-[0.01em] text-[#0b0b0b]">доставка</span>
              <span className="mt-1 block text-[12px] text-[#403e3e]">заказать через яндекс еду</span>
            </span>
            <span className="text-[10px] text-[#403e3e] group-hover:text-[#ed6a32]">заказать</span>
          </a>
        </motion.div>

        <motion.div className="mt-4 grid grid-cols-2 gap-2" initial={enterInitial} animate={enterAnimate} transition={{ ...enterTransition, delay: reduceMotion ? 0 : 0.2 }}>
          <a href={`tel:${selectedLocation.phoneTel}`} className={utilityLinkClass}>
            звонок
          </a>
          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noopener noreferrer" className={utilityLinkClass}>
            яндекс карты
          </a>
          <a href={selectedLocation.links.maps.twoGis} target="_blank" rel="noopener noreferrer" className={utilityLinkClass}>
            2гис
          </a>
          <a href={selectedLocation.links.reviews.yandex} target="_blank" rel="noopener noreferrer" className={utilityLinkClass}>
            оставить отзыв
          </a>
        </motion.div>

        <motion.footer className="mt-8 border-t border-black/[0.08] pt-4 text-[10px] tracking-[0.02em] text-black/42" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0.01 : 0.32 }}>
          <p>марсианин</p>
          <p className="mt-1">точки: {LOCATIONS.map((point) => point.code).join(' · ')}</p>
          <p className="mt-1">режим: {selectedLocation.workingHours}</p>
          <p className="mt-1">информация на сайте не является публичной офертой</p>
        </motion.footer>
      </div>
    </motion.div>
  );
}
