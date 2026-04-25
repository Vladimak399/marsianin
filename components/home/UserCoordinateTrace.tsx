'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import GateCode from './GateCode';
import RollingCoordinate from './RollingCoordinate';
import { Coordinates, LOCATIONS, LocationPoint, NearestLocation, Phase } from './types';

const LAT_RANGE = {
  min: Math.min(...LOCATIONS.map((point) => point.lat)),
  max: Math.max(...LOCATIONS.map((point) => point.lat))
};

const LNG_RANGE = {
  min: Math.min(...LOCATIONS.map((point) => point.lng)),
  max: Math.max(...LOCATIONS.map((point) => point.lng))
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getUserVisualPoint(userCoords: Coordinates) {
  const xRatio = (userCoords.lng - LNG_RANGE.min) / Math.max(LNG_RANGE.max - LNG_RANGE.min, 0.0001);
  const yRatio = (userCoords.lat - LAT_RANGE.min) / Math.max(LAT_RANGE.max - LAT_RANGE.min, 0.0001);

  return {
    x: clamp(7 + xRatio * 13, 5.8, 21),
    y: clamp(77 - yRatio * 50, 26, 82)
  };
}

export function UserCoordinateTrace({
  userCoords,
  nearest,
  phase,
  selected,
  geoUnavailable = false
}: {
  userCoords: Coordinates | null;
  nearest: NearestLocation | null;
  phase: Phase;
  selected: LocationPoint | null;
  geoUnavailable?: boolean;
}) {
  return (
    <motion.div
      className="absolute left-7 right-7 top-[98px] z-40 border-y border-black/[0.055] bg-[#fffdf8]/90 py-3 backdrop-blur-sm max-md:top-[92px]"
      initial={{ opacity: 0, y: -8 }}
      animate={
        phase === 'open'
          ? { opacity: 0.62, y: -2, scale: 0.985 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: 0.12, duration: 0.34, ease: premiumEase }}
    >
      {!userCoords ? (
        <div className="text-[10px] text-black/45">
          {geoUnavailable ? 'геолокация недоступна, выберите точку вручную' : 'определяем координаты'}
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <div>
            <div className="text-[9px] tracking-[0.12em] text-[#ed6a32]">ваши координаты</div>
            <RollingCoordinate
              lat={userCoords.lat}
              lng={userCoords.lng}
              active
              variant="labeled"
              animationKey={`${userCoords.lat}-${userCoords.lng}`}
              className="mt-1 text-[10px] text-black/45"
            />
          </div>
          {nearest ? (
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24, duration: 0.3, ease: premiumEase }}
            >
              <div className="text-[9px] tracking-[0.1em] text-black/38">ближайшая точка</div>
              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                <span className="text-[9px] text-black/40">{nearest.code}</span>
                <GateCode id={nearest.code} size="small" />
              </div>
              <div className="mt-1 text-[9px] text-black/34">{nearest.distance.toFixed(2)} км</div>
            </motion.div>
          ) : null}
        </div>
      )}
    </motion.div>
  );
}

export function UserTraceLayer({
  userCoords,
  nearest,
  selected,
  phase
}: {
  userCoords: Coordinates | null;
  nearest: NearestLocation | null;
  selected: LocationPoint | null;
  phase: Phase;
}) {
  const reduceMotion = useReducedMotion();

  if (!userCoords || !nearest) return null;

  const userVisual = getUserVisualPoint(userCoords);
  const target = nearest.visual;
  const activeTarget = selected ? selected.id === nearest.id : false;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[15]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.26, ease: premiumEase }}
    >
      <svg aria-hidden className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d={`M ${userVisual.x} ${userVisual.y} C ${userVisual.x + 1.8} ${userVisual.y - 4.5}, ${target.x - 1.2} ${target.y + 4.5}, ${target.x} ${target.y}`}
          fill="none"
          stroke="#ed6a32"
          strokeWidth={activeTarget ? 0.34 : 0.28}
          strokeOpacity={activeTarget ? 0.45 : 0.32}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={
            reduceMotion
              ? { pathLength: 1, opacity: phase === 'open' ? 0.2 : activeTarget ? 0.45 : 0.32 }
              : { pathLength: 1, opacity: phase === 'open' ? 0.2 : activeTarget ? 0.45 : 0.32 }
          }
          transition={{ duration: 0.6, ease: premiumEase }}
        />
      </svg>

      <motion.div
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border border-[#ed6a32]/70 bg-white"
        style={{ left: `${userVisual.x}%`, top: `${userVisual.y}%` }}
        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={phase === 'open' ? { scale: 0.9, opacity: 0.56 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.32, ease: premiumEase }}
      />
    </motion.div>
  );
}
