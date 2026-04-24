'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import RollingCoordinate from '@/components/home/RollingCoordinate';
import { LocationId, locations } from '@/data/locations';
import { menuData } from '@/data/menu';
import { premiumEase } from '@/lib/animations';

type Phase = 'map' | 'lock' | 'docking' | 'wash' | 'open';
type Coordinates = { lat: number; lng: number };
type LocationPoint = {
  id: LocationId;
  code: string;
  title: string;
  lat: number;
  lng: number;
  visual: { x: number; y: number };
};
type NearestLocation = LocationPoint & { distance: number };

const LOCATION_META: Record<LocationId, Pick<LocationPoint, 'code' | 'title' | 'visual'>> = {
  o12: { code: 'о12', title: 'октябрьская, 12', visual: { x: 7, y: 34 } },
  k10: { code: 'к10', title: 'костромская, 10', visual: { x: 7, y: 54 } },
  p7: { code: 'п7', title: 'пролетарская, 7', visual: { x: 7, y: 74 } }
};

const LOCATIONS: LocationPoint[] = locations.map((location) => ({
  id: location.id,
  code: LOCATION_META[location.id].code,
  title: LOCATION_META[location.id].title,
  lat: location.lat,
  lng: location.lng,
  visual: LOCATION_META[location.id].visual
}));

const LOCATION_DETAILS = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<LocationId, (typeof locations)[number]>;

const MENU_PREVIEW = [
  { number: '01', title: 'кофе', text: 'классика и авторские напитки', category: 'напитки' },
  { number: '02', title: 'завтраки', text: 'с 8:00 до 14:00', category: 'завтраки' },
  { number: '03', title: 'десерты', text: 'для сладких моментов', category: null }
] as const;

const DEMO_USER_COORDS = { lat: 54.71264, lng: 20.51214 };
const ORANGE = '#ed6a32';
const easeOut = premiumEase;
const gateEase = [0.76, 0, 0.24, 1] as const;

const toRad = (value: number) => (value * Math.PI) / 180;

function getDistanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function getNearestLocation(coords: Coordinates | null): NearestLocation | null {
  if (!coords) return null;

  let nearest: NearestLocation | null = null;
  let minDistance = Infinity;

  for (const point of LOCATIONS) {
    const distance = getDistanceKm(coords.lat, coords.lng, point.lat, point.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...point, distance };
    }
  }

  return nearest;
}

function GateCode({ id, size = 'large', active = false }: { id: string; size?: 'small' | 'large' | 'hero'; active?: boolean }) {
  const fontSize = size === 'hero' ? 'text-[112px]' : size === 'small' ? 'text-[14px]' : 'text-[58px]';
  const tracking = size === 'hero' ? 'tracking-[-0.035em]' : size === 'small' ? 'tracking-[-0.01em]' : 'tracking-[-0.025em]';

  return (
    <motion.div
      className={`font-halvar inline-block ${fontSize} ${tracking} font-black leading-[0.86] text-[#ed6a32]`}
      animate={{ scale: active ? 1.012 : 1 }}
      transition={{ duration: 0.28 }}
    >
      {id}
    </motion.div>
  );
}

function Brand() {
  return (
    <motion.div
      className="absolute left-7 right-28 top-9 z-[95] text-left"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: easeOut }}
    >
      <Link href="/" className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]">
        <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
        <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
      </Link>
    </motion.div>
  );
}

function UserLocationPanel({
  userCoords,
  nearest,
  phase,
  geoUnavailable
}: {
  userCoords: Coordinates | null;
  nearest: NearestLocation | null;
  phase: Phase;
  geoUnavailable: boolean;
}) {
  if (phase === 'open') return null;

  if (!userCoords) {
    if (!geoUnavailable) return null;

    return (
      <motion.div
        className="absolute left-7 right-7 top-[98px] z-40 border-y border-black/[0.055] bg-white/78 py-3 text-[10px] text-black/40 backdrop-blur-sm"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.34, ease: easeOut }}
      >
        геолокация недоступна
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute left-7 right-7 top-[98px] z-40 border-y border-black/[0.055] bg-white/78 py-3 backdrop-blur-sm"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: 0.18, duration: 0.36, ease: easeOut }}
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div>
          <div className="text-[9px] tracking-[0.12em] text-[#ed6a32]">ваши координаты</div>
          <RollingCoordinate lat={userCoords.lat} lng={userCoords.lng} active className="mt-1 text-[10px] text-black/40" />
        </div>
        {nearest ? (
          <motion.div className="text-right" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.48, duration: 0.34 }}>
            <div className="text-[9px] tracking-[0.1em] text-black/34">ближайшая</div>
            <div className="mt-1">
              <GateCode id={nearest.code} size="small" />
            </div>
            <div className="mt-1 text-[9px] text-black/38">{nearest.distance.toFixed(2)} km</div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

function Axis({ selected, phase, nearestId }: { selected: LocationPoint | null; phase: Phase; nearestId: string | null }) {
  const hidden = phase === 'open';

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-10" animate={{ opacity: hidden ? 0 : 1 }} transition={{ duration: 0.3 }}>
      <div className="absolute left-7 top-[31%] h-[46%] w-px bg-black/[0.055]" />
      <motion.div
        className="absolute left-7 top-[31%] w-px bg-[#ed6a32]/32"
        animate={{ height: selected ? `${Math.max(0, selected.visual.y - 31)}%` : nearestId ? '43%' : '46%' }}
        transition={{ duration: 0.56, ease: easeOut }}
      />
      {LOCATIONS.map((point) => (
        <motion.div
          key={point.id}
          className="absolute left-[25px] h-1.5 w-1.5 border border-[#ed6a32]/45 bg-white"
          style={{ top: `${point.visual.y}%` }}
          animate={{ opacity: selected && selected.id !== point.id ? 0.16 : nearestId === point.id ? 1 : 0.54, scale: nearestId === point.id && !selected ? [1, 1.45, 1] : 1 }}
          transition={{ opacity: { duration: 0.28 }, scale: { duration: 1.4, repeat: nearestId === point.id && !selected ? Infinity : 0, ease: 'easeInOut' } }}
        />
      ))}
    </motion.div>
  );
}

function ProximityLine({ nearest, phase }: { nearest: NearestLocation | null; phase: Phase }) {
  if (!nearest || phase === 'open') return null;

  return (
    <motion.div
      className="pointer-events-none absolute left-7 right-7 z-20 h-px bg-[#ed6a32]/28"
      style={{ top: `${nearest.visual.y}%` }}
      initial={{ scaleX: 0, opacity: 0, transformOrigin: 'left' }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{ delay: 0.58, duration: 0.62, ease: easeOut }}
    />
  );
}

function GateNode({
  point,
  selected,
  phase,
  isBusy,
  onSelect,
  index,
  nearestId
}: {
  point: LocationPoint;
  selected: LocationPoint | null;
  phase: Phase;
  isBusy: boolean;
  onSelect: (point: LocationPoint) => void;
  index: number;
  nearestId: string | null;
}) {
  const isActive = selected?.id === point.id;
  const isDimmed = selected && !isActive;
  const isNearest = nearestId === point.id;
  const hidden = phase === 'open';

  return (
    <motion.button
      type="button"
      className={`absolute z-30 -translate-y-1/2 text-left outline-none transition-opacity ${
        isBusy ? 'cursor-progress opacity-80' : 'cursor-pointer'
      }`}
      style={{ left: `${point.visual.x}%`, top: `${point.visual.y}%` }}
      onClick={() => onSelect(point)}
      disabled={isBusy}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: hidden ? 0 : isDimmed ? 0.14 : 1, y: 0, scale: isActive ? (phase === 'docking' ? 1.018 : 1) : 1 }}
      transition={{ duration: 0.44, delay: phase === 'map' ? index * 0.065 : 0, ease: easeOut }}
      whileHover={phase === 'map' ? { scale: isActive ? 1.015 : 1.01 } : undefined}
    >
      <motion.div
        className={`relative w-[min(292px,76vw)] border bg-white/95 px-4 py-4 [will-change:transform,opacity] ${
          isActive ? 'border-[#ed6a32]/78' : isNearest ? 'border-[#ed6a32]/72' : 'border-black/[0.08]'
        }`}
        animate={{ opacity: isDimmed ? 0.8 : 1, y: isActive ? -2 : 0, scale: isActive ? 1.01 : isNearest ? 1.004 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="absolute left-0 top-0 h-px bg-[#ed6a32]/58" initial={false} animate={{ width: isActive ? '100%' : isNearest ? '68%' : '24%' }} transition={{ duration: 0.26 }} />

        {isNearest && !selected ? <motion.div className="absolute left-0 top-3 h-[calc(100%-24px)] w-px bg-[#ed6a32]/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }} /> : null}

        {isNearest && !selected ? (
          <motion.div
            className="absolute right-4 top-3.5 border border-[#ed6a32]/36 bg-[#fff5f1] px-2 py-0.5 text-[9px] tracking-[0.06em] text-[#bc4c1f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.78, 1, 0.78] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ближайшая точка
          </motion.div>
        ) : null}

        <div className="grid grid-cols-[106px_1fr] items-start gap-4">
          <GateCode id={point.code} active={isActive || isNearest} />
          <div className="pt-1.5">
            <div className="text-[13px] tracking-[-0.02em] text-black/50">{point.title}</div>
            <RollingCoordinate lat={point.lat} lng={point.lng} active={isActive && (phase === 'lock' || phase === 'docking')} className="mt-2 text-[9px] text-black/34" />
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

function LockCaption({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  if (!selected || phase === 'open') return null;

  return (
    <motion.div
      className="pointer-events-none absolute left-7 right-7 top-[113px] z-40 grid grid-cols-[1fr_auto] items-center gap-4 border-y border-black/[0.045] bg-white/80 py-3 backdrop-blur-sm"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.26 }}
    >
      <div>
        <div className="text-[9px] tracking-[0.14em] text-[#ed6a32]">фиксация точки</div>
        <div className="mt-1 text-[12px] text-black/42">{selected.title}</div>
      </div>
      <RollingCoordinate lat={selected.lat} lng={selected.lng} active={phase === 'lock' || phase === 'docking'} className="text-right text-[9px] leading-relaxed" />
    </motion.div>
  );
}

function DockTransition({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  const active = selected && phase === 'wash';

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[70] bg-white [will-change:opacity]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, times: [0, 0.55, 1], ease: 'easeInOut' }}
        >
          <CoordinateSystemLayer mode="transition" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative h-[110px] w-[260px] border border-[#ed6a32]/34"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1.14, opacity: [0, 1, 0] }}
              transition={{ duration: 0.42, ease: gateEase }}
            >
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#ed6a32]/30" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#ed6a32]/30" />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function getPreviewCount(category: string | null) {
  if (!category) return null;
  return menuData.find((section) => section.category === category)?.items.length ?? null;
}

function MenuRow({
  index,
  number,
  title,
  text,
  count,
  onOpen
}: {
  index: number;
  number: string;
  title: string;
  text: string;
  count: number | null;
  onOpen?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="group relative grid w-full grid-cols-[58px_1fr_44px] items-center border-b border-[#f87c56] bg-[#f9f9f9]/92 px-4 py-5 text-left last:border-b-0"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.14 + index * 0.05, duration: 0.36, ease: easeOut }}
      whileTap={{ scale: 0.992 }}
      layout
    >
      <motion.div className="absolute bottom-0 left-0 h-px bg-[#f87c56]" initial={{ width: '0%' }} whileHover={{ width: '100%' }} transition={{ duration: 0.28, ease: easeOut }} />
      <div className="mars-coordinate-label text-[10px] text-[#f87c56]">{number}</div>
      <div>
        <div className="text-[13px] font-semibold tracking-[0.01em] text-[#0b0b0b]">{title}</div>
        <div className="mt-1 text-[12px] text-[#403e3e]">{text}</div>
      </div>
      <div className="text-right text-[10px] text-[#403e3e]">{count ? `${count} поз.` : '→'}</div>
    </motion.button>
  );
}

function OpenScreen({
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

  const actionLinkClass =
    'inline-flex min-h-11 items-center justify-center border border-black/[0.065] bg-white/86 px-3 py-2 text-[10px] tracking-[0.06em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]';
  const mainCtaText = selected.code ? `открыть меню ${selected.code}` : 'смотреть меню';

  return (
    <motion.div
      className="absolute inset-0 z-[80] overflow-hidden bg-white px-7 pb-8 pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CoordinateSystemLayer mode="open" muted />

      <div className="relative z-10">
        <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.44, ease: easeOut }}>
          <GateCode id={selected.code} size="hero" active />
          <motion.div className="mt-7 text-lg tracking-[-0.03em] text-black/66" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.32 }}>
            {selected.title}
          </motion.div>
          <RollingCoordinate lat={selected.lat} lng={selected.lng} active className="mt-2 text-[10px] text-black/34" />
          <div className="mt-4 space-y-1 text-[11px] text-black/56">
            <p>{selectedLocation.address}</p>
            <p>{selectedLocation.workingHours}</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 grid h-12 grid-cols-5 items-center border border-black/[0.065] bg-white/72 text-center text-[13px] font-black backdrop-blur-sm"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.36, ease: easeOut }}
        >
          {LOCATIONS.map((point, index) => (
            <span key={point.id} className="contents">
              <button
                type="button"
                onClick={() => onSwitch(point)}
                disabled={isBusy}
                className={`relative flex h-full items-center justify-center transition-opacity ${isBusy ? 'cursor-progress opacity-70' : ''}`}
              >
                <span className={point.id === selected.id ? 'text-[#ed6a32]' : 'text-black/28'}>
                  <GateCode id={point.code} size="small" />
                </span>
                {point.id === selected.id ? <span className="absolute bottom-0 left-1/2 h-px w-9 -translate-x-1/2 bg-[#ed6a32]" /> : null}
              </button>
              {index < LOCATIONS.length - 1 ? <div className="font-normal text-black/18">|</div> : null}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="mt-5 overflow-hidden border border-[#f87c56] bg-[#f9f9f9]/92 backdrop-blur-sm"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.38, ease: easeOut }}
        >
          {MENU_PREVIEW.map((item, index) => (
            <MenuRow
              key={item.number}
              index={index}
              number={item.number}
              title={item.title}
              text={item.text}
              count={getPreviewCount(item.category)}
              onOpen={() => onOpenCategory(item.category)}
            />
          ))}
        </motion.div>

        <motion.div initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.34, ease: easeOut }}>
          <Link
            href={menuHref}
            aria-disabled={isBusy}
            className={`mt-3 inline-flex min-h-12 w-full items-center justify-center border border-[#ed6a32]/75 px-4 py-3 text-xs font-semibold tracking-[0.08em] text-white transition [will-change:transform] ${
              isBusy ? 'pointer-events-none cursor-progress bg-[#df8f6e]' : 'bg-[#ed6a32] hover:bg-[#df5f2c]'
            }`}
          >
            {mainCtaText}
          </Link>
        </motion.div>

        <motion.div
          className="mt-4 grid grid-cols-2 gap-2"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.34, ease: easeOut }}
        >
          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noreferrer" className={`${actionLinkClass} col-span-2`}>
            построить маршрут
          </a>
          <a href={selectedLocation.links.yandexEda} target="_blank" rel="noreferrer" className={actionLinkClass}>
            заказать доставку
          </a>
          <a href={`tel:${selectedLocation.phoneTel}`} className={actionLinkClass}>
            позвонить
          </a>
          <a href={selectedLocation.links.maps.yandex} target="_blank" rel="noreferrer" className={actionLinkClass}>
            открыть в яндекс картах
          </a>
          <a href={selectedLocation.links.maps.twoGis} target="_blank" rel="noreferrer" className={actionLinkClass}>
            открыть в 2гис
          </a>
          <a href={selectedLocation.links.reviews.yandex} target="_blank" rel="noreferrer" className={`${actionLinkClass} col-span-2 text-black/46`}>
            оставить отзыв
          </a>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-7 right-7 z-10 flex items-center justify-between border-t border-black/[0.06] pt-4 text-[9px] tracking-[0.04em] text-black/36"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.32 }}
      >
        <span>08:00-22:00</span>
        <span>wi-fi</span>
        <span>можно с питомцами</span>
      </motion.div>

      <button
        type="button"
        onClick={onBack}
        className="absolute right-7 top-9 z-[120] border border-black/[0.065] bg-white/86 px-4 py-2 text-[10px] tracking-[0.1em] text-black/58 transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]"
      >
        карта
      </button>
    </motion.div>
  );
}

function DesktopScene({
  selected,
  phase,
  nearest,
  isBusy,
  onSelect,
  onBack,
  onSwitch,
  onOpenCategory
}: {
  selected: LocationPoint | null;
  phase: Phase;
  nearest: NearestLocation | null;
  isBusy: boolean;
  onSelect: (point: LocationPoint) => void;
  onBack: () => void;
  onSwitch: (point: LocationPoint) => void;
  onOpenCategory: (category: string | null) => void;
}) {
  const desktopPoints = [
    { id: 'o12' as LocationId, x: 18, y: 66 },
    { id: 'k10' as LocationId, x: 58, y: 28 },
    { id: 'p7' as LocationId, x: 82, y: 70 }
  ];

  return (
    <div className="relative mx-auto hidden min-h-svh w-full max-w-[1180px] overflow-hidden bg-white shadow-[0_16px_56px_rgba(0,0,0,.06)] lg:block">
      <CoordinateSystemLayer mode={phase === 'open' ? 'open' : 'map'} muted={phase === 'open'} />
      <Brand />

      <div className="relative z-10 grid min-h-svh grid-cols-[390px_1fr] gap-10 px-10 pb-10 pt-32">
        <div className="self-end pb-8">
          <div className="text-[82px] font-black leading-[0.82] tracking-[-0.04em] text-[#ed6a32]">map</div>
          <div className="mt-8 border-y border-black/[0.055] py-4">
            <div className="text-[10px] tracking-[0.14em] text-[#ed6a32]">nearest</div>
            <div className="mt-2 text-[42px] font-black leading-none tracking-[-0.035em] text-black/80">
              {nearest?.code ?? selected?.code ?? 'o12'}
            </div>
            <div className="mt-2 text-xs text-black/42">{nearest ? `${nearest.distance.toFixed(2)} km` : 'выберите точку'}</div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {LOCATIONS.map((point) => (
              <button
                key={`desktop-switch-${point.id}`}
                type="button"
                onClick={() => (phase === 'open' ? onSwitch(point) : onSelect(point))}
                disabled={isBusy}
                className={`border border-black/[0.065] bg-white/72 px-3 py-3 text-left backdrop-blur-sm transition ${
                  isBusy ? 'cursor-progress opacity-70' : 'hover:border-[#ed6a32]/45'
                }`}
              >
                <GateCode id={point.code} size="small" />
                <div className="mt-1 text-[10px] text-black/42">{point.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden border border-[#ed6a32]/22 bg-white/58">
          <motion.svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'open' ? 0.18 : 1 }}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            <motion.path
              d="M 16 68 C 30 38, 45 20, 59 29 S 79 52, 83 70"
              fill="none"
              stroke="#ed6a32"
              strokeOpacity="0.38"
              strokeWidth="0.7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: easeOut }}
            />
            <motion.path
              d="M 18 24 C 36 46, 52 64, 86 84"
              fill="none"
              stroke="#ed6a32"
              strokeDasharray="1.4 2.3"
              strokeOpacity="0.22"
              strokeWidth="0.35"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.08, ease: easeOut }}
            />
          </motion.svg>

          {desktopPoints.map((visual, index) => {
            const point = LOCATIONS.find((entry) => entry.id === visual.id);
            if (!point) return null;

            const isActive = selected?.id === point.id;
            const isNearest = nearest?.id === point.id;

            return (
              <motion.button
                key={`desktop-node-${point.id}`}
                type="button"
                onClick={() => onSelect(point)}
                disabled={isBusy}
                className={`absolute z-20 w-[230px] -translate-x-1/2 -translate-y-1/2 border bg-white/88 p-4 text-left backdrop-blur-sm transition-opacity ${
                  isBusy ? 'cursor-progress opacity-80' : ''
                }`}
                style={{ left: `${visual.x}%`, top: `${visual.y}%` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: phase === 'open' ? 0.18 : selected && !isActive ? 0.34 : 1,
                  y: 0,
                  scale: isActive ? 1.04 : 1,
                  borderColor: isActive || isNearest ? 'rgba(237,106,50,.82)' : 'rgba(0,0,0,.065)'
                }}
                transition={{ duration: 0.34, delay: index * 0.05, ease: easeOut }}
                whileHover={phase === 'map' ? { y: -3 } : undefined}
              >
                <GateCode id={point.code} active={isActive || isNearest} />
                <div className="mt-3 text-[13px] text-black/54">{point.title}</div>
                <RollingCoordinate lat={point.lat} lng={point.lng} active={isActive} className="mt-2 text-[9px] text-black/34" />
              </motion.button>
            );
          })}

          <AnimatePresence>
            {phase === 'open' && selected ? (
              <OpenScreen selected={selected} isBusy={isBusy} onBack={onBack} onSwitch={onSwitch} onOpenCategory={onOpenCategory} />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const router = useRouter();
  const { setSelectedLocation, setGuestCoordinates, setIsTeleporting, setTeleportOrigin } = useLocation();
  const [selected, setSelected] = useState<LocationPoint | null>(null);
  const [phase, setPhase] = useState<Phase>('map');
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [geoUnavailable, setGeoUnavailable] = useState(false);
  const timersRef = useRef<number[]>([]);

  const nearest = useMemo(() => getNearestLocation(userCoords), [userCoords]);
  const cameraY = useMemo(() => (selected ? 50 - selected.visual.y : 0), [selected]);
  const isBusy = phase !== 'map' && phase !== 'open';

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function addTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  useEffect(() => {
    const applyDemoFallback = () => {
      if (process.env.NODE_ENV !== 'production') {
        setUserCoords(DEMO_USER_COORDS);
        setGuestCoordinates(DEMO_USER_COORDS);
      } else {
        setGeoUnavailable(true);
      }
    };

    if (!('geolocation' in navigator)) {
      applyDemoFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserCoords(nextCoords);
        setGuestCoordinates(nextCoords);
        setGeoUnavailable(false);
      },
      () => applyDemoFallback(),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );

    return clearTimers;
  }, [setGuestCoordinates]);

  function select(point: LocationPoint) {
    if (phase !== 'map') return;
    clearTimers();
    setSelectedLocation(point.id);
    setIsTeleporting(true);
    setTeleportOrigin({ x: point.visual.x, y: point.visual.y });
    setSelected(point);
    setPhase('lock');
    addTimer(() => setPhase('docking'), 220);
    addTimer(() => setPhase('wash'), 660);
    addTimer(() => {
      setPhase('open');
      setIsTeleporting(false);
    }, 900);
  }

  function back() {
    clearTimers();
    setIsTeleporting(false);
    setPhase('map');
    addTimer(() => setSelected(null), 120);
  }

  function switchPoint(point: LocationPoint) {
    clearTimers();
    setPhase('map');
    setSelected(null);
    addTimer(() => select(point), 90);
  }

  function openCategory(category: string | null) {
    if (!selected) return;

    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    router.push(`/menu/${selected.id}${query}`);
  }

  return (
    <section className="font-halvar relative min-h-svh overflow-hidden bg-[#f7f4ee] text-black">
      <style>{`
        .font-halvar {
          font-family: var(--font-halvar-mittel), "Halvar Mittelschrift", "Halvar", "Arial Narrow", "Inter", system-ui, sans-serif;
          font-feature-settings: "tnum" 1, "lnum" 1;
        }
      `}</style>

      <div className="relative mx-auto min-h-svh w-full max-w-[430px] overflow-hidden bg-white shadow-[0_16px_52px_rgba(0,0,0,.06)] sm:border-x sm:border-black/[0.04] lg:hidden">
        <CoordinateSystemLayer
          mode={phase === 'open' ? 'open' : phase === 'docking' || phase === 'wash' ? 'transition' : 'map'}
          verticalShift={phase === 'docking' || phase === 'wash' ? cameraY * 0.8 : 0}
          muted={phase === 'open'}
        />
        <Brand />
        <AnimatePresence>
          <UserLocationPanel userCoords={userCoords} nearest={nearest} phase={phase} geoUnavailable={geoUnavailable} />
        </AnimatePresence>
        <Axis selected={selected} phase={phase} nearestId={nearest?.id ?? null} />
        <AnimatePresence>
          <ProximityLine nearest={nearest} phase={phase} />
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 z-20"
          animate={{
            y: phase === 'docking' || phase === 'wash' ? `${cameraY}%` : '0%',
            scale: phase === 'docking' || phase === 'wash' ? 1.045 : 1,
            opacity: phase === 'open' ? 0 : 1,
            pointerEvents: phase === 'map' ? 'auto' : 'none'
          }}
          transition={{ duration: 0.54, ease: gateEase }}
        >
          {LOCATIONS.map((point, index) => (
            <GateNode
              key={point.id}
              point={point}
              selected={selected}
              phase={phase}
              isBusy={isBusy}
              onSelect={select}
              index={index}
              nearestId={nearest?.id ?? null}
            />
          ))}
        </motion.div>

        <AnimatePresence>{selected && phase !== 'open' ? <LockCaption selected={selected} phase={phase} /> : null}</AnimatePresence>
        <DockTransition selected={selected} phase={phase} />
        <AnimatePresence>
          {phase === 'open' && selected ? <OpenScreen selected={selected} isBusy={isBusy} onBack={back} onSwitch={switchPoint} onOpenCategory={openCategory} /> : null}
        </AnimatePresence>
      </div>
      <DesktopScene
        selected={selected}
        phase={phase}
        nearest={nearest}
        isBusy={isBusy}
        onSelect={select}
        onBack={back}
        onSwitch={switchPoint}
        onOpenCategory={openCategory}
      />
    </section>
  );
}
