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
    <div className="grid grid-cols-1 gap-5 pb-2 pt-8 sm:grid-cols-3">
      {locations.map((location) => {
        const isSelected = selectedLocation === location.id;
        const isDimmed = Boolean(selectedLocation) && !isSelected;

        return (
          <motion.button
            key={location.id}
            layout
            layoutId={`location-${location.id}`}
            onClick={(event) => onSelect(location.id, event)}
            disabled={disabled}
            className="group relative overflow-hidden border border-[#dfdfdf] bg-[#f7f7f7] px-7 py-10 text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors disabled:cursor-wait"
            animate={{
              borderColor: isSelected ? '#ff5a1f' : '#dfdfdf',
              backgroundColor: '#f7f7f7',
              scale: isSelected ? 1.04 : 1,
              opacity: isDimmed ? 0.42 : 1,
              boxShadow: isSelected ? '0 16px 36px rgba(0, 0, 0, 0.12)' : '0 2px 10px rgba(0, 0, 0, 0.02)'
            }}
            whileHover={{ y: -4 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.18, ease: premiumEase }}
          >
            <span className="mb-3 block text-xs uppercase tracking-[0.45em] text-[#6c6c6c]">точка</span>
            <span
              className={`block text-[112px] font-medium uppercase leading-none tracking-[0.02em] sm:text-[132px] ${
                isSelected ? 'text-[#ff5a1f]' : 'text-[#131720]'
              }`}
            >
              {location.label}
            </span>
            <span className="mt-2 block text-sm uppercase tracking-[0.28em] text-[#8a8a8a]">
              [ x: 0{String(locations.indexOf(location) + 1)} ] [ y: {location.label.slice(1)} ]
            </span>
            <span className="mt-3 block text-3xl text-[#8f8f8f]">+</span>
          </motion.button>
        );
      })}
    </div>
  );
}
