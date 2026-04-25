'use client';

import { motion, useReducedMotion } from 'framer-motion';
import GateCode from './GateCode';
import { LOCATIONS, LocationPoint } from './types';
import { premiumEase } from '@/lib/animations';

export default function LocationSwitcher({
  selected,
  isBusy,
  onSwitch
}: {
  selected: LocationPoint;
  isBusy: boolean;
  onSwitch: (point: LocationPoint) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mt-8 grid h-12 grid-cols-5 items-center border border-black/[0.065] bg-white/72 text-center text-[13px] font-black"
      role="group"
      aria-label="выбор точки"
      initial={reduceMotion ? false : { y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 0.1, duration: reduceMotion ? 0.01 : 0.36, ease: premiumEase }}
    >
      {LOCATIONS.map((point, index) => {
        const isSelected = point.id === selected.id;

        return (
          <span key={point.id} className="contents">
            <button
              type="button"
              onClick={() => onSwitch(point)}
              disabled={isBusy}
              aria-pressed={isSelected}
              aria-label={`точка ${point.code}`}
              className={`relative flex h-full items-center justify-center transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] ${isBusy ? 'cursor-progress opacity-70' : ''}`}
            >
              <span className={isSelected ? 'text-[#ed6a32]' : 'text-black/28'}>
                <GateCode id={point.code} size="small" />
              </span>
              {isSelected ? <span className="absolute bottom-0 left-1/2 h-px w-9 -translate-x-1/2 bg-[#ed6a32]" /> : null}
            </button>
            {index < LOCATIONS.length - 1 ? <div className="font-normal text-black/18" aria-hidden>|</div> : null}
          </span>
        );
      })}
    </motion.div>
  );
}
