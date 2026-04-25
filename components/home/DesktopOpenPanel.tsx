'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import { premiumEase } from '@/lib/animations';
import BrandHeader from './BrandHeader';
import GateCode from './GateCode';
import LocationSwitcher from './LocationSwitcher';
import MenuPreview from './MenuPreview';
import RollingCoordinate from './RollingCoordinate';
import { LOCATION_DETAILS, LocationPoint, LOCATIONS } from './types';

export default function DesktopOpenPanel({
  selected,
  isBusy,
  onBack,
  onSwitch,
  onOpenCategory
}: {
  selected: LocationPoint;
  isBusy: boolean;
  onBack: () => void;
  onSwitch: (point: LocationPoint) => void;
  onOpenCategory: (category: string | null) => void;
}) {
  const selectedLocation = LOCATION_DETAILS[selected.id];
  const menuHref = `/menu/${selected.id}`;
  const mainCtaText = selected.code ? `открыть меню ${selected.code}` : 'смотреть меню';
  const actionLinkClass =
    'inline-flex min-h-11 items-center justify-center border border-black/[0.08] bg-[#fffdf8] px-3 py-2 text-[10px] tracking-[0.04em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]';

  return (
    <div className="relative min-h-[100dvh] bg-[#fffdf8]">
      <CoordinateSystemLayer mode="open" muted />
      <BrandHeader />

      <button
        type="button"
        onClick={onBack}
        className="absolute right-10 top-8 z-30 border border-black/[0.065] bg-[#fffdf8] px-4 py-2 text-[10px] tracking-[0.08em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]"
      >
        карта
      </button>

      <div className="relative z-20 px-10 pb-10 pt-32">
        <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.36, ease: premiumEase }}>
            <GateCode id={selected.code} size="hero" active />
            <div className="mt-6 text-[22px] tracking-[-0.03em] text-black/70">{selected.title}</div>
            <div className="mt-3 space-y-1 border-y border-black/[0.06] py-4 text-[12px] text-black/54">
              <p>{selectedLocation.address}</p>
              <p>{selectedLocation.workingHours}</p>
              <RollingCoordinate lat={selected.lat} lng={selected.lng} active className="text-[10px] text-black/36" />
            </div>

            <div className="mt-6 max-w-[360px]">
              <LocationSwitcher selected={selected} isBusy={isBusy} onSwitch={onSwitch} />
            </div>
          </motion.div>

          <motion.div
            className="border border-black/[0.08] bg-[#fffdf8] p-6"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.36, ease: premiumEase }}
          >
            <MenuPreview onOpenCategory={onOpenCategory} />

            <Link
              href={menuHref}
              aria-disabled={isBusy}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center border border-[#ed6a32]/75 px-4 py-3 text-xs font-semibold tracking-[0.04em] text-white transition ${
                isBusy ? 'pointer-events-none cursor-progress bg-[#df8f6e]' : 'bg-[#ed6a32] hover:bg-[#df5f2c]'
              }`}
            >
              {mainCtaText}
            </Link>

            <div className="mt-4 grid grid-cols-2 gap-2">
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
            </div>

            <footer className="mt-6 border-t border-black/[0.08] pt-3 text-[10px] tracking-[0.02em] text-black/42">
              <p>марсианин · точки: {LOCATIONS.map((point) => point.code).join(' · ')}</p>
              <p className="mt-1">инн/огрн: данные уточняются · информация на сайте не является публичной офертой</p>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
