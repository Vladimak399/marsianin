'use client';

import { motion } from 'framer-motion';
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
  return (
    <motion.div
      className="mt-8 grid h-12 grid-cols-5 items-center border border-black/[0.065] bg-white/72 text-center text-[13px] font-black"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.36, ease: premiumEase }}
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
  );
}
