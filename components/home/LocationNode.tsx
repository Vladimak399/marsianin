'use client';

import { AnimatePresence, motion } from 'framer-motion';
import RollingCoordinate from '@/components/home/RollingCoordinate';
import { premiumEase } from '@/lib/animations';
import GateCode from './GateCode';
import { Coordinates, LocationPoint, NearestLocation, Phase } from './types';

export function UserLocationPanel({
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
        transition={{ duration: 0.34, ease: premiumEase }}
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
      transition={{ delay: 0.18, duration: 0.36, ease: premiumEase }}
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div>
          <div className="text-[9px] tracking-[0.12em] text-[#ed6a32]">ваши координаты</div>
          <RollingCoordinate lat={userCoords.lat} lng={userCoords.lng} active className="mt-1 text-[10px] text-black/40" />
        </div>
        {nearest ? (
          <motion.div className="text-right" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.48, duration: 0.34 }}>
            <div className="text-[9px] tracking-[0.1em] text-black/34">ближайшая точка</div>
            <div className="mt-1.5 flex flex-col items-end">
              <div className="mb-0.5 text-[8px] tracking-[0.08em] text-black/32">код точки</div>
              <GateCode id={nearest.code} size="small" />
            </div>
            <div className="mt-1 text-[9px] text-black/32">{nearest.distance.toFixed(2)} км</div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function LocationNode({
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
  const shouldRollCoordinates = isActive || (isNearest && !selected && phase === 'map');
  const rollKey = `coord-${point.id}-${isActive ? 1 : 0}-${isNearest && !selected && phase === 'map' ? 'nearest-map' : 'static'}`;

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
      transition={{ duration: 0.44, delay: phase === 'map' ? index * 0.065 : 0, ease: premiumEase }}
    >
      <motion.div
        className={`relative w-[min(292px,76vw)] border bg-[#fffdf8]/95 px-4 py-4 ${
          isActive ? 'border-[#ed6a32]/78' : isNearest ? 'border-[#ed6a32]/72' : 'border-black/[0.08]'
        }`}
        animate={{ opacity: isDimmed ? 0.8 : 1, y: isActive ? -2 : 0, scale: isActive ? 1.01 : isNearest ? 1.004 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`absolute left-0 top-0 h-px bg-[#ed6a32]/58 ${
            isActive ? 'w-full' : isNearest ? 'w-[68%]' : 'w-[24%]'
          }`}
        />

        {isNearest && !selected ? <motion.div className="absolute left-0 top-3 h-[calc(100%-24px)] w-px bg-[#ed6a32]/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }} /> : null}

        {isNearest && !selected ? (
          <div className="absolute right-4 top-3.5 border border-[#ed6a32]/36 bg-[#fff5f1] px-2 py-0.5 text-[9px] tracking-[0.04em] text-[#bc4c1f]">
            ближайшая точка
          </div>
        ) : null}

        <div className="grid grid-cols-[106px_1fr] items-start gap-4">
          <GateCode id={point.code} active={isActive || isNearest} />
          <div className="pt-1.5">
            <div className="text-[13px] tracking-[-0.02em] text-black/50">{point.title}</div>
            <RollingCoordinate key={rollKey} lat={point.lat} lng={point.lng} active={shouldRollCoordinates} className="mt-2 text-[9px] text-black/34" />
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function LockCaption({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  if (!selected || phase === 'open') return null;

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
}
