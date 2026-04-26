'use client';

import { motion, useReducedMotion } from 'framer-motion';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import RollingCoordinate from '@/components/home/RollingCoordinate';
import { LocationId } from '@/data/locations';
import { premiumEase } from '@/lib/animations';
import BrandHeader from './BrandHeader';
import DesktopOpenPanel from './DesktopOpenPanel';
import GateCode from './GateCode';
import { Coordinates, LOCATIONS, LocationPoint, NearestLocation, Phase } from './types';

export default function DesktopScene({
  selected,
  phase,
  nearest,
  userCoords,
  isBusy,
  onSelect,
  onBack,
  onSwitch,
  onOpenCategory
}: {
  selected: LocationPoint | null;
  phase: Phase;
  nearest: NearestLocation | null;
  userCoords: Coordinates | null;
  isBusy: boolean;
  onSelect: (point: LocationPoint) => void;
  onBack: () => void;
  onSwitch: (point: LocationPoint) => void;
  onOpenCategory: (category: string | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const desktopPoints = [
    { id: 'o12' as LocationId, x: 24, y: 70 },
    { id: 'k10' as LocationId, x: 67, y: 35 },
    { id: 'p7' as LocationId, x: 87, y: 74 }
  ];

  const isOpen = phase === 'open' && selected;
  const focusPoint = selected ?? (nearest ? (LOCATIONS.find((point) => point.id === nearest.id) ?? null) : null);
  const focusVisual = focusPoint ? desktopPoints.find((point) => point.id === focusPoint.id) : null;

  return (
    <div className="relative mx-auto hidden min-h-[100dvh] w-full max-w-[1180px] bg-[#fffdf8] shadow-[0_16px_56px_rgba(0,0,0,.06)] lg:block">
      {isOpen ? (
        <DesktopOpenPanel selected={selected} isBusy={isBusy} onBack={onBack} onSwitch={onSwitch} onOpenCategory={onOpenCategory} />
      ) : (
        <>
          <CoordinateSystemLayer mode={phase === 'docking' || phase === 'wash' ? 'transition' : 'map'} />
          <div className="pointer-events-none absolute -left-16 top-12 z-[2] h-80 w-80 rounded-full bg-[#ed6a32]/10 blur-3xl" />
          <BrandHeader />

          <div className="relative z-10 grid min-h-[100dvh] grid-cols-[330px_1fr] gap-10 px-10 pb-10 pt-32">
            <aside className="self-start border border-black/[0.055] bg-[#fffdf8]/72 p-6 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.14em] text-[#ed6a32]">карта точек</div>
              <div className="mt-2 max-w-[245px] text-[13px] leading-relaxed text-black/58">выберите точку, чтобы открыть меню и маршрут</div>

              <div className="mt-6 border-t border-black/[0.06] pt-4">
                <div className="text-[10px] tracking-[0.12em] text-black/42">координаты гостя</div>
                {userCoords ? (
                  <RollingCoordinate lat={userCoords.lat} lng={userCoords.lng} active className="mt-2 text-[10px] text-black/45" />
                ) : (
                  <div className="mt-2 text-[11px] text-black/38">координаты определяются…</div>
                )}
              </div>

              <div className="mt-5 border-t border-black/[0.06] pt-4">
                <div className="text-[10px] tracking-[0.12em] text-black/42">ближайшая точка</div>
                <div className="mt-2 text-[48px] font-black leading-none tracking-[-0.04em] text-[#ed6a32]">{nearest?.code ?? selected?.code ?? 'о12'}</div>
                <div className="mt-2 text-xs text-black/42">{nearest ? `${nearest.distance.toFixed(2)} км` : 'выберите точку'}</div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {LOCATIONS.map((point) => {
                  const isNearest = nearest?.id === point.id;
                  return (
                    <button
                      key={`desktop-switch-${point.id}`}
                      type="button"
                      onClick={() => onSelect(point)}
                      disabled={isBusy}
                      className={`border bg-[#fffdf8] px-3 py-3 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] ${
                        isNearest ? 'border-[#ed6a32]/70 shadow-[0_10px_24px_rgba(237,106,50,0.12)]' : 'border-black/[0.065] hover:border-[#ed6a32]/45'
                      } ${isBusy ? 'cursor-progress opacity-70' : 'hover:-translate-y-0.5'}`}
                    >
                      <GateCode id={point.code} size="small" active={isNearest} />
                      <div className="mt-1 text-[10px] text-black/42">{point.title}</div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="relative overflow-hidden border border-[#ed6a32]/20 bg-[#fffdf8]/82">
              <motion.svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: premiumEase }}
              >
                <motion.path
                  d="M 24 70 H 67 V 35 H 87 V 74"
                  fill="none"
                  stroke="#ed6a32"
                  strokeOpacity="0.24"
                  strokeWidth="0.32"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: premiumEase }}
                />
                <motion.path
                  d="M 24 70 H 87 M 67 35 V 74"
                  fill="none"
                  stroke="#ed6a32"
                  strokeDasharray="1.2 2.4"
                  strokeOpacity="0.14"
                  strokeWidth="0.24"
                  strokeLinecap="square"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.38, delay: reduceMotion ? 0 : 0.16, ease: premiumEase }}
                />
                {focusVisual ? (
                  <motion.g
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: premiumEase }}
                  >
                    <line x1="0" x2="100" y1={focusVisual.y} y2={focusVisual.y} stroke="#ed6a32" strokeOpacity="0.18" strokeWidth="0.18" />
                    <line x1={focusVisual.x} x2={focusVisual.x} y1="0" y2="100" stroke="#ed6a32" strokeOpacity="0.18" strokeWidth="0.18" />
                    <rect
                      x={focusVisual.x - 3.2}
                      y={focusVisual.y - 3.2}
                      width="6.4"
                      height="6.4"
                      fill="none"
                      stroke="#ed6a32"
                      strokeOpacity="0.34"
                      strokeWidth="0.22"
                    />
                  </motion.g>
                ) : null}
              </motion.svg>

              {desktopPoints.map((visual, index) => {
                const point = LOCATIONS.find((entry) => entry.id === visual.id);
                if (!point) return null;

                const isActive = selected?.id === point.id;
                const isNearest = nearest?.id === point.id;
                const isHighlighted = isActive || isNearest;

                return (
                  <motion.button
                    key={`desktop-node-${point.id}`}
                    type="button"
                    onClick={() => onSelect(point)}
                    disabled={isBusy}
                    className={`absolute z-20 w-[238px] -translate-x-1/2 -translate-y-1/2 border bg-[#fffdf8]/90 p-4 text-left backdrop-blur-sm transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] ${
                      isBusy ? 'cursor-progress opacity-80' : 'hover:shadow-[0_16px_34px_rgba(237,106,50,0.12)]'
                    } ${isHighlighted ? 'shadow-[0_18px_42px_rgba(237,106,50,0.13)]' : ''}`}
                    style={{ left: `${visual.x}%`, top: `${visual.y}%` }}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{
                      opacity: selected && !isActive ? 0.34 : 1,
                      y: 0,
                      scale: reduceMotion ? 1 : isHighlighted ? 1.035 : 1,
                      borderColor: isHighlighted ? 'rgba(237,106,50,.9)' : 'rgba(0,0,0,.065)'
                    }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.34, delay: reduceMotion ? 0 : index * 0.05, ease: premiumEase }}
                    whileHover={!reduceMotion && phase === 'map' ? { y: -3 } : undefined}
                  >
                    <div className="pointer-events-none absolute -left-3 top-1/2 h-px w-6 -translate-y-1/2 bg-[#ed6a32]/45" />
                    <div className="pointer-events-none absolute left-1/2 -top-3 h-6 w-px -translate-x-1/2 bg-[#ed6a32]/28" />
                    <GateCode id={point.code} active={isHighlighted} />
                    <div className="mt-3 text-[13px] text-black/62">{point.title}</div>
                    <RollingCoordinate lat={point.lat} lng={point.lng} active={isHighlighted} className={`mt-2 text-[9px] ${isHighlighted ? 'text-black/56' : 'text-black/34'}`} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
