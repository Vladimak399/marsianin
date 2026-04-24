'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
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

function randomDigit(exclude: string) {
  let digit = String(Math.floor(Math.random() * 10));
  if (digit === exclude) digit = String((Number(digit) + 4) % 10);
  return digit;
}

function RollingCharacter({ char, index, active }: { char: string; index: number; active: boolean }) {
  const isDigit = /\d/.test(char);
  const [display, setDisplay] = useState(char);
  const [settled, setSettled] = useState(!active);

  useEffect(() => {
    if (!active || !isDigit) {
      setDisplay(char);
      setSettled(true);
      return;
    }

    setSettled(false);
    let ticks = 0;
    const maxTicks = 5 + (index % 4) + Math.floor(index / 7);
    const interval = window.setInterval(() => {
      ticks += 1;
      if (ticks >= maxTicks) {
        setDisplay(char);
        setSettled(true);
        window.clearInterval(interval);
        return;
      }
      setDisplay(randomDigit(char));
    }, 30 + index * 2);

    return () => window.clearInterval(interval);
  }, [active, char, index, isDigit]);

  if (!isDigit) {
    return <span className="inline-flex h-[1.35em] items-center px-px text-black/28">{char}</span>;
  }

  return (
    <motion.span
      className="relative inline-flex h-[1.35em] min-w-[0.63em] items-center justify-center overflow-hidden px-px"
      animate={{ color: settled ? 'rgba(0,0,0,.48)' : ORANGE }}
      transition={{ duration: 0.16 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${display}-${index}-${settled}`}
          initial={{ y: active ? '-110%' : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '110%', opacity: 0 }}
          transition={{ duration: settled ? 0.16 : 0.08, ease: settled ? easeOut : 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

function CoordinateTicker({
  lat,
  lng,
  active,
  className = ''
}: {
  lat: number;
  lng: number;
  active: boolean;
  className?: string;
}) {
  const value = `${lat.toFixed(6)} / ${lng.toFixed(6)}`;

  return (
    <div className={`font-halvar tabular-nums ${className}`}>
      {value.split('').map((char, index) => (
        <RollingCharacter key={`${index}-${char}`} char={char} index={index} active={active} />
      ))}
    </div>
  );
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

function SceneBackground({ mode = 'map' }: { mode?: 'map' | 'open' | 'wash' }) {
  const open = mode === 'open';
  const wash = mode === 'wash';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: open ? 0.11 : 0.085 }}
        transition={{ duration: 0.35 }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(237,106,50,.72) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.72) 1px, transparent 1px)',
          backgroundSize: '96px 112px'
        }}
      />

      <motion.div className="absolute inset-5 border border-black/[0.035]" animate={{ opacity: open ? 0.74 : 1 }} transition={{ duration: 0.35 }} />

      <motion.div
        className="absolute left-[-190px] top-[70px] h-[310px] w-[720px] -rotate-[14deg] blur-3xl"
        animate={{ opacity: open ? 0.33 : wash ? 0.38 : 0.18, x: open ? 22 : 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        style={{
          background: 'linear-gradient(90deg, rgba(237,106,50,0), rgba(237,106,50,.34), rgba(237,106,50,.08), rgba(237,106,50,0))'
        }}
      />

      <motion.div
        className="absolute bottom-[-105px] right-[-210px] h-[360px] w-[650px] -rotate-[22deg] blur-3xl"
        animate={{ opacity: open ? 0.24 : wash ? 0.3 : 0.08, x: open ? -18 : 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        style={{ background: 'linear-gradient(90deg, rgba(237,106,50,0), rgba(237,106,50,.28), rgba(237,106,50,0))' }}
      />

      <motion.div
        className="absolute left-7 right-7 top-[264px] h-px bg-gradient-to-r from-transparent via-[#ed6a32]/44 to-transparent"
        animate={{ opacity: open ? 0.68 : 0.28, scaleX: open ? 1 : 0.86 }}
        transition={{ duration: 0.65, ease: easeOut }}
      />

      <motion.div
        className="absolute left-7 right-7 top-[480px] h-px bg-gradient-to-r from-[#ed6a32]/18 via-transparent to-[#ed6a32]/18"
        animate={{ opacity: open ? 0.45 : 0.18 }}
        transition={{ duration: 0.65, ease: easeOut }}
      />
    </div>
  );
}

function Brand() {
  return (
    <motion.div
      className="pointer-events-none absolute left-7 right-28 top-9 z-[95] text-left"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: easeOut }}
    >
      <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
      <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
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
          <CoordinateTicker lat={userCoords.lat} lng={userCoords.lng} active className="mt-1 text-[10px] text-black/40" />
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
  onSelect,
  index,
  nearestId
}: {
  point: LocationPoint;
  selected: LocationPoint | null;
  phase: Phase;
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
      className="absolute z-30 -translate-y-1/2 cursor-pointer text-left outline-none"
      style={{ left: `${point.visual.x}%`, top: `${point.visual.y}%` }}
      onClick={() => onSelect(point)}
      disabled={phase !== 'map'}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: hidden ? 0 : isDimmed ? 0.14 : 1, y: 0, scale: isActive ? (phase === 'docking' ? 1.018 : 1) : 1 }}
      transition={{ duration: 0.44, delay: phase === 'map' ? index * 0.065 : 0, ease: easeOut }}
      whileHover={phase === 'map' ? { scale: isActive ? 1.015 : 1.01 } : undefined}
    >
      <motion.div
        className="relative w-[min(300px,78vw)] border bg-white/92 px-4 py-4 backdrop-blur-sm"
        animate={{
          borderColor: isActive ? 'rgba(237,106,50,.82)' : isNearest ? 'rgba(237,106,50,.72)' : 'rgba(237,106,50,.30)',
          boxShadow: isActive ? '0 10px 28px rgba(237,106,50,.11)' : isNearest ? '0 9px 26px rgba(237,106,50,.12)' : '0 8px 18px rgba(0,0,0,.018)'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-[#ed6a32]/56" animate={{ x: isActive || isNearest ? -2 : 0, y: isActive || isNearest ? -2 : 0 }} />
        <motion.div className="absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-[#ed6a32]/56" animate={{ x: isActive || isNearest ? 2 : 0, y: isActive || isNearest ? -2 : 0 }} />
        <motion.div className="absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#ed6a32]/56" animate={{ x: isActive || isNearest ? -2 : 0, y: isActive || isNearest ? 2 : 0 }} />
        <motion.div className="absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-[#ed6a32]/56" animate={{ x: isActive || isNearest ? 2 : 0, y: isActive || isNearest ? 2 : 0 }} />

        {isNearest && !selected ? (
          <motion.div
            className="absolute right-4 top-4 text-[8px] tracking-[0.08em] text-[#ed6a32]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ближайшая
          </motion.div>
        ) : null}

        <div className="grid grid-cols-[106px_1fr] items-start gap-4">
          <GateCode id={point.code} active={isActive || isNearest} />
          <div className="pt-1.5">
            <div className="text-[13px] tracking-[-0.02em] text-black/50">{point.title}</div>
            <CoordinateTicker lat={point.lat} lng={point.lng} active={isActive && (phase === 'lock' || phase === 'docking')} className="mt-2 text-[9px] text-black/34" />
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
      <CoordinateTicker lat={selected.lat} lng={selected.lng} active={phase === 'lock' || phase === 'docking'} className="text-right text-[9px] leading-relaxed" />
    </motion.div>
  );
}

function DockTransition({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  const active = selected && phase === 'wash';

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[70] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, times: [0, 0.55, 1], ease: 'easeInOut' }}
        >
          <SceneBackground mode="wash" />
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
  onBack,
  onSwitch,
  onOpenCategory
}: {
  selected: LocationPoint;
  onBack: () => void;
  onSwitch: (point: LocationPoint) => void;
  onOpenCategory: (category: string | null) => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-[80] overflow-hidden bg-white px-7 pb-8 pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SceneBackground mode="open" />

      <div className="relative z-10">
        <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.44, ease: easeOut }}>
          <GateCode id={selected.code} size="hero" active />
          <motion.div className="mt-7 text-lg tracking-[-0.03em] text-black/66" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.32 }}>
            {selected.title}
          </motion.div>
          <CoordinateTicker lat={selected.lat} lng={selected.lng} active className="mt-2 text-[10px] text-black/34" />
        </motion.div>

        <motion.div
          className="mt-8 grid h-12 grid-cols-5 items-center border border-black/[0.065] bg-white/72 text-center text-[13px] font-black backdrop-blur-sm"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.36, ease: easeOut }}
        >
          {LOCATIONS.map((point, index) => (
            <span key={point.id} className="contents">
              <button type="button" onClick={() => onSwitch(point)} className="relative flex h-full items-center justify-center">
                <span className={point.id === selected.id ? 'text-[#ed6a32]' : 'text-black/28'}>
                  <GateCode id={point.code} size="small" />
                </span>
                {point.id === selected.id ? <span className="absolute bottom-0 left-1/2 h-px w-9 -translate-x-1/2 bg-[#ed6a32]" /> : null}
              </button>
              {index < LOCATIONS.length - 1 ? <div className="font-normal text-black/14">/</div> : null}
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
        className="absolute right-7 top-9 z-[120] border border-black/[0.065] bg-white/86 px-4 py-2 text-[10px] tracking-[0.1em] text-black/58 shadow-sm backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] active:scale-[0.98]"
      >
        карта
      </button>
    </motion.div>
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
    <section className="font-halvar relative min-h-svh overflow-hidden bg-[#f4f1ea] text-black">
      <style>{`
        .font-halvar {
          font-family: var(--font-halvar-mittel), "Halvar Mittelschrift", "Halvar", "Arial Narrow", "Inter", system-ui, sans-serif;
          font-feature-settings: "tnum" 1, "lnum" 1;
        }
      `}</style>

      <div className="relative mx-auto min-h-svh w-full max-w-[430px] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:border-x sm:border-black/[0.04]">
        <SceneBackground mode={phase === 'open' ? 'open' : 'map'} />
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
            <GateNode key={point.id} point={point} selected={selected} phase={phase} onSelect={select} index={index} nearestId={nearest?.id ?? null} />
          ))}
        </motion.div>

        <AnimatePresence>{selected && phase !== 'open' ? <LockCaption selected={selected} phase={phase} /> : null}</AnimatePresence>
        <DockTransition selected={selected} phase={phase} />
        <AnimatePresence>{phase === 'open' && selected ? <OpenScreen selected={selected} onBack={back} onSwitch={switchPoint} onOpenCategory={openCategory} /> : null}</AnimatePresence>
      </div>
    </section>
  );
}
