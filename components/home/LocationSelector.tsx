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
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
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
            className="group relative overflow-hidden border border-grid bg-white px-6 py-10 text-left transition-colors disabled:cursor-wait"
            animate={{
              borderColor: isSelected ? '#ff6a00' : '#e8e8e8',
              backgroundColor: isSelected ? '#171717' : '#ffffff',
              scale: isSelected ? 1.05 : 1,
              opacity: isDimmed ? 0.35 : 1
            }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.15, ease: premiumEase }}
          >
            <span className="mb-8 block text-xs uppercase tracking-[0.3em] text-neutral-500">узел</span>
            <span
              className={`block text-5xl font-semibold uppercase leading-none tracking-[0.08em] sm:text-6xl ${
                isSelected ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {location.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
