'use client';

import { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';
import { LocationId, locations } from '@/data/locations';

type LocationSelectorProps = {
  selectedLocation: LocationId | null;
  onSelect: (location: LocationId, event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function LocationSelector({ selectedLocation, onSelect, disabled = false }: LocationSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {locations.map((location) => {
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
              backgroundColor: isSelected ? '#fff1e8' : '#faf8f5',
              boxShadow: isSelected ? '0 14px 34px rgba(255, 100, 48, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
              y: isSelected ? -2 : 0,
              opacity: isSelected ? 1 : 0.78
            }}
            whileHover={{ y: isSelected ? -3 : -1, scale: isSelected ? 1.015 : 1.01 }}
            whileFocus={{ y: isSelected ? -3 : -1, scale: isSelected ? 1.015 : 1.01 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.18, ease: premiumEase }}
            style={{ filter: isSelected ? 'saturate(1)' : 'saturate(0.82)' }}
          >
            <span className={`text-[10px] tracking-[0.18em] ${isSelected ? 'text-[#8b664f]' : 'text-[#968e86]'}`}>точка</span>
            <div className="mt-2 flex items-end justify-between gap-4">
              <span
                className={`font-semibold leading-[0.9] tracking-[0.01em] ${
                  isSelected ? 'text-[#ff6430]' : 'text-[#181818]'
                }`}
                style={{ fontSize: isSelected ? 'clamp(2.35rem,10.8vw,3.5rem)' : 'clamp(2.15rem,10vw,3.25rem)' }}
              >
                {location.label}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full border ${
                  isSelected ? 'border-[#ff6430] bg-[#ff6430]' : 'border-[#8f8f8f] bg-transparent'
                }`}
              />
            </div>
            <p className={`mt-2 text-[11px] tracking-[0.14em] ${isSelected ? 'text-[#7d6455]' : 'text-[#7d7d7d]'}`}>
              {location.lat.toFixed(4)}° / {location.lng.toFixed(4)}°
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
