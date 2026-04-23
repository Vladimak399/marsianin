'use client';

import { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import { LocationId, locations } from '@/data/locations';

type LocationSelectorProps = {
  selectedLocation: LocationId | null;
  onSelect: (location: LocationId, event?: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function LocationSelector({ selectedLocation, onSelect, disabled = false }: LocationSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {locations.map((location, index) => {
        const isSelected = selectedLocation === location.id;

        return (
          <motion.button
            key={location.id}
            layout
            layoutId={`location-${location.id}`}
            onClick={(event) => onSelect(location.id, event)}
            disabled={disabled}
            className="group relative min-h-[108px] overflow-hidden rounded-sm border bg-[#faf8f5] px-4 py-4 text-left transition-colors disabled:cursor-wait sm:min-h-[132px] sm:px-5"
            animate={{
              borderColor: isSelected ? '#ff6430' : '#d9d3cc',
              backgroundColor: isSelected ? '#fff2ea' : '#faf8f5',
              boxShadow: isSelected ? '0 10px 24px rgba(255, 100, 48, 0.16)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
              y: isSelected ? -1 : 0
            }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.16, ease: premiumEase }}
          >
            <span className="text-[10px] tracking-[0.1em] text-[#8d877f]">точка</span>
            <div className="mt-2 flex items-end justify-between gap-4">
              <span
                className={`text-[clamp(2.15rem,10vw,3.25rem)] font-semibold leading-[0.9] tracking-[0.02em] ${
                  isSelected ? 'text-[#ff6430]' : 'text-[#181818]'
                }`}
              >
                {location.label}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full border ${
                  isSelected ? 'border-[#ff6430] bg-[#ff6430]' : 'border-[#8f8f8f] bg-transparent'
                }`}
              />
            </div>
            <p className="mt-2 text-[11px] tracking-[0.08em] text-[#7d7d7d]">[x: 0{index + 1}] [y: {location.label.slice(1)}]</p>
          </motion.button>
        );
      })}
    </div>
  );
}
