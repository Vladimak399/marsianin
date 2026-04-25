'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import RollingCoordinate from './RollingCoordinate';
import GateCode from './GateCode';
import { Coordinates, LOCATION_DETAILS, LocationPoint, LOCATIONS } from './types';
import { premiumEase } from '@/lib/animations';
import LocationSwitcher from './LocationSwitcher';
import MenuPreview from './MenuPreview';

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
  const selectedLocation = LOCATION_DETAILS[selected.id];
  const menuHref = `/menu/${selected.id}`;

  const actionLinkClass =
    'inline-flex min-h-11 items-center justify-center border border-black/[0.08] bg-[#fffdf8] px-3 py-2 text-[10px] tracking-[0.04em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]';
  const mainCtaText = selected.code ? `открыть меню ${selected.code}` : 'смотреть меню';

  return (
    <motion.div
      className="absolute inset-0 z-[80] min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#fffdf8] px-7 pb-8 pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#ed6a32]/14 blur-3xl" />
        <div className="absolute bottom-20 left-8 h-60 w-60 rounded-full bg-[#ed6a32]/10 blur-3xl" />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="sticky right-0 top-6 z-[120] ml-auto block border border-black/[0.065] bg-[#fffdf8]/95 px-4 py-2 text-[10px] tracking-[0.08em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]"
      >
        карта
      </button>

      <div className="relative z-10 pb-24">
        <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.44, ease: premiumEase }}>
          <GateCode id={selected.code} size="hero" active />
          <motion.div className="mt-7 text-lg tracking-[-0.03em] text-black/66" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.32 }}>
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
        <MenuPreview onOpenCategory={onOpenCategory} />

        <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.34, ease: premiumEase }}>
          <Link
            href={menuHref}
            aria-disabled={isBusy}
            className={`mt-3 inline-flex min-h-12 w-full items-center justify-center border border-[#ed6a32]/75 px-4 py-3 text-xs font-semibold tracking-[0.04em] text-white transition ${
              isBusy ? 'pointer-events-none cursor-progress bg-[#df8f6e]' : 'bg-[#ed6a32] hover:bg-[#df5f2c]'
            }`}
          >
            {mainCtaText}
          </Link>
        </motion.div>

        <motion.div className="mt-4 grid grid-cols-2 gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.34, ease: premiumEase }}>
          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noreferrer" className={`${actionLinkClass} col-span-2`}>
            построить маршрут
          </a>
          <a href={selectedLocation.links.yandexEda} target="_blank" rel="noreferrer" className={actionLinkClass}>
            доставка
          </a>
          <a href={`tel:${selectedLocation.phoneTel}`} className={actionLinkClass}>
            звонок
          </a>
          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noreferrer" className={actionLinkClass}>
            яндекс карты
          </a>
          <a href={selectedLocation.links.maps.twoGis} target="_blank" rel="noreferrer" className={actionLinkClass}>
            2гис
          </a>
          <a href={selectedLocation.links.reviews.yandex} target="_blank" rel="noreferrer" className={`${actionLinkClass} col-span-2 text-black/46`}>
            отзывы
          </a>
        </motion.div>

        <motion.footer className="mt-8 border-t border-black/[0.08] pt-4 text-[10px] tracking-[0.02em] text-black/42" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.32 }}>
          <p>марсианин</p>
          <p className="mt-1">точки: {LOCATIONS.map((point) => point.code).join(' · ')}</p>
          <p className="mt-1">режим: ежедневно 08:00-22:00</p>
          <p className="mt-1">инн/огрн: данные уточняются</p>
          <p className="mt-1">информация на сайте не является публичной офертой</p>
        </motion.footer>
      </div>
    </motion.div>
  );
}
