'use client';

import { motion } from 'framer-motion';
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
  const desktopPoints = [
    { id: 'o12' as LocationId, x: 18, y: 66 },
    { id: 'k10' as LocationId, x: 58, y: 28 },
    { id: 'p7' as LocationId, x: 82, y: 70 }
  ];

  const isOpen = phase === 'open' && selected;

  return (
    <div className="relative mx-auto hidden min-h-[100dvh] w-full max-w-[1180px] bg-[#fffdf8] shadow-[0_16px_56px_rgba(0,0,0,.06)] lg:block">
      {isOpen ? (
        <DesktopOpenPanel selected={selected} isBusy={isBusy} onBack={onBack} onSwitch={onSwitch} onOpenCategory={onOpenCategory} />
      ) : (
        <>
          <CoordinateSystemLayer mode={phase === 'docking' || phase === 'wash' ? 'transition' : 'map'} />
          <div className="pointer-events-none absolute -left-16 top-12 z-[2] h-80 w-80 rounded-full bg-[#ed6a32]/12 blur-3xl" />
          <BrandHeader />

          <div className="relative z-10 grid min-h-[100dvh] grid-cols-[390px_1fr] gap-10 px-10 pb-10 pt-32">
            <div className="self-start border border-black/[0.07] bg-[#fffdf8] p-6">
              <div className="text-[11px] tracking-[0.14em] text-[#ed6a32]">карта точек</div>
              <div className="mt-2 text-[13px] text-black/54">выберите точку на схеме для перехода в open state</div>

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
                <div className="mt-2 text-[42px] font-black leading-none tracking-[-0.035em] text-black/80">{nearest?.code ?? selected?.code ?? 'о12'}</div>
                <div className="mt-2 text-xs text-black/42">{nearest ? `${nearest.distance.toFixed(2)} км` : 'выберите точку'}</div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {LOCATIONS.map((point) => (
                  <button
                    key={`desktop-switch-${point.id}`}
                    type="button"
                    onClick={() => onSelect(point)}
                    disabled={isBusy}
                    className={`border border-black/[0.065] bg-[#fffdf8] px-3 py-3 text-left transition ${isBusy ? 'cursor-progress opacity-70' : 'hover:border-[#ed6a32]/45'}`}
                  >
                    <GateCode id={point.code} size="small" />
                    <div className="mt-1 text-[10px] text-black/42">{point.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden border border-[#ed6a32]/22 bg-[#fffdf8]">
              <motion.svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, ease: premiumEase }}
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
                  transition={{ duration: 0.9, ease: premiumEase }}
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
                  transition={{ duration: 1.1, delay: 0.08, ease: premiumEase }}
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
                    className={`absolute z-20 w-[230px] -translate-x-1/2 -translate-y-1/2 border bg-[#fffdf8] p-4 text-left transition-opacity ${isBusy ? 'cursor-progress opacity-80' : ''}`}
                    style={{ left: `${visual.x}%`, top: `${visual.y}%` }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: selected && !isActive ? 0.34 : 1,
                      y: 0,
                      scale: isActive ? 1.04 : 1,
                      borderColor: isActive || isNearest ? 'rgba(237,106,50,.82)' : 'rgba(0,0,0,.065)'
                    }}
                    transition={{ duration: 0.34, delay: index * 0.05, ease: premiumEase }}
                    whileHover={phase === 'map' ? { y: -3 } : undefined}
                  >
                    <GateCode id={point.code} active={isActive || isNearest} />
                    <div className="mt-3 text-[13px] text-black/54">{point.title}</div>
                    <RollingCoordinate lat={point.lat} lng={point.lng} active={isActive || isNearest} className={`mt-2 text-[9px] ${isNearest ? 'text-black/55' : 'text-black/34'}`} />
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
