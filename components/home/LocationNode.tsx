'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  nearestId,
  nearestDistance,
  mode = 'desktop'
}: {
  point: LocationPoint;
  selected: LocationPoint | null;
  phase: Phase;
  isBusy: boolean;
  onSelect: (point: LocationPoint) => void;
  index: number;
  nearestId: string | null;
  nearestDistance?: number | null;
  mode?: 'desktop' | 'mobile';
}) {
  const reduceMotion = useReducedMotion();
  const isActive = selected?.id === point.id;
  const isDimmed = selected && !isActive;
  const isNearest = nearestId === point.id;
  const hidden = phase === 'open';
  const shouldRollCoordinates = phase === 'map' || isActive || (isNearest && !selected);
  const rollKey = `coord-${point.id}-${phase}-${isActive ? 'active' : 'idle'}-${isNearest ? 'nearest' : 'normal'}`;
  const accessibleLabel = isNearest ? `выбрать точку ${point.code}, ${point.title}, ближайшая точка` : `выбрать точку ${point.code}, ${point.title}`;
  const nodeFocusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]';

  if (mode === 'mobile') {
    return (
      <motion.button
        type="button"
        aria-label={accessibleLabel}
        aria-pressed={isActive}
        className={`relative w-full border bg-[#fffdf8] px-4 py-4 text-left outline-none transition-opacity ${nodeFocusClass} ${
          isBusy ? 'cursor-progress opacity-80' : 'cursor-pointer'
        } ${
          isActive
            ? 'border-[#ed6a32]/78'
            : isNearest
              ? 'border-[#ed6a32]/76 shadow-[0_0_0_1px_rgba(237,106,50,0.22),0_14px_34px_rgba(237,106,50,0.16)]'
              : 'border-black/[0.08]'
        }`}
        onClick={() => onSelect(point)}
        disabled={isBusy}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: hidden ? 0 : isDimmed ? 0.42 : 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.38, delay: reduceMotion ? 0 : phase === 'map' ? index * 0.07 : 0, ease: premiumEase }}
      >
        {isNearest ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-1 border border-[#ed6a32]/18"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: premiumEase }}
          />
        ) : null}
        <div className="grid grid-cols-[150px_1fr] gap-3 max-[380px]:grid-cols-[136px_1fr]">
          <div className="shrink-0">
            <GateCode id={point.code} active={isActive || isNearest} />
          </div>
          <div className="min-w-0 pt-1">
            <div className="text-[13px] tracking-[-0.02em] text-black/56">{point.title}</div>
            <RollingCoordinate
              key={rollKey}
              lat={point.lat}
              lng={point.lng}
              active={shouldRollCoordinates}
              variant="compact"
              animationKey={rollKey}
              delayOffset={reduceMotion ? 0 : index * 0.06}
              className={`mt-2 text-[10px] ${isNearest ? 'text-black/55' : 'text-black/34'}`}
            />
            {isNearest && !selected ? <div className="mt-2 text-[10px] text-[#bc4c1f]">ближайшая точка · {(nearestDistance ?? 0).toFixed(2)} км</div> : null}
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      aria-label={accessibleLabel}
      aria-pressed={isActive}
      className={`absolute z-30 -translate-y-1/2 text-left outline-none transition-opacity ${nodeFocusClass} ${
        isBusy ? 'cursor-progress opacity-80' : 'cursor-pointer'
      }`}
      style={{ left: `${point.visual.x}%`, top: `${point.visual.y}%` }}
      onClick={() => onSelect(point)}
      disabled={isBusy}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: hidden ? 0 : isDimmed ? 0.14 : 1, y: 0, scale: !reduceMotion && isActive ? (phase === 'docking' ? 1.018 : 1) : 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.44, delay: reduceMotion ? 0 : phase === 'map' ? index * 0.065 : 0, ease: premiumEase }}
    >
      <motion.div
        className={`relative w-[min(292px,76vw)] border bg-[#fffdf8] px-4 py-4 ${
          isActive ? 'border-[#ed6a32]/78' : isNearest ? 'border-[#ed6a32]/76 shadow-[0_0_0_1px_rgba(237,106,50,0.22),0_14px_34px_rgba(237,106,50,0.16)]' : 'border-black/[0.08]'
        }`}
        animate={{ opacity: isDimmed ? 0.8 : 1, y: !reduceMotion && isActive ? -2 : 0, scale: !reduceMotion && isActive ? 1.01 : !reduceMotion && isNearest ? 1.004 : 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
      >
        {isNearest ? <div className="pointer-events-none absolute -inset-1 border border-[#ed6a32]/18" /> : null}
        <div className={`absolute left-0 top-0 h-px bg-[#ed6a32]/58 ${isActive ? 'w-full' : isNearest ? 'w-[68%]' : 'w-[24%]'}`} />

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
              delayOffset={reduceMotion ? 0 : index * 0.05}
              className={`mt-2 text-[9px] ${isNearest ? 'text-black/55' : 'text-black/34'}`}
            />
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function LockCaption({ selected, phase }: { selected: LocationPoint | null; phase: Phase }) {
  const reduceMotion = useReducedMotion();

  if (!selected || phase === 'open') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none absolute left-7 right-7 top-[113px] z-40 grid grid-cols-[1fr_auto] items-center gap-4 border-y border-black/[0.045] bg-[#fffdf8]/90 py-3 backdrop-blur-sm"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.26 }}
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
