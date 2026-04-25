'use client';

import { AnimatePresence, motion } from 'framer-motion';
import RollingCoordinate from '@/components/home/RollingCoordinate';
import { premiumEase } from '@/lib/animations';
import GateCode from './GateCode';
import { LocationPoint, Phase } from './types';

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
  const shouldRollCoordinates =
    isActive ||
    (isNearest && !selected && phase === 'map') ||
    (isActive && (phase === 'lock' || phase === 'docking'));
  const rollKey = `coord-${point.id}-${phase}-${isActive ? 'active' : 'idle'}-${isNearest ? 'nearest' : 'normal'}`;

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
            <RollingCoordinate
              key={rollKey}
              lat={point.lat}
              lng={point.lng}
              active={shouldRollCoordinates}
              variant="compact"
              animationKey={rollKey}
              className="mt-2 text-[9px] text-black/34"
            />
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
        <RollingCoordinate
          lat={selected.lat}
          lng={selected.lng}
          active={phase === 'lock' || phase === 'docking'}
          variant="labeled"
          animationKey={`${selected.id}-${phase}`}
          className="text-right text-[9px] leading-relaxed"
        />
      </motion.div>
    </AnimatePresence>
  );
}
