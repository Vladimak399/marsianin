'use client';

import { motion } from 'framer-motion';
import { LocationPoint, NearestLocation, Phase, LOCATIONS } from './types';
import { LocationNode } from './LocationNode';

const gateEase = [0.76, 0, 0.24, 1] as const;

export default function LocationMap({
  phase,
  cameraY,
  selected,
  isBusy,
  nearest,
  onSelect
}: {
  phase: Phase;
  cameraY: number;
  selected: LocationPoint | null;
  isBusy: boolean;
  nearest: NearestLocation | null;
  onSelect: (point: LocationPoint) => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-20 px-4 pb-8 pt-44"
      role="navigation"
      aria-label="карта точек"
      animate={{
        y: phase === 'docking' || phase === 'wash' ? `${cameraY}%` : '0%',
        scale: phase === 'docking' || phase === 'wash' ? 1.02 : 1,
        opacity: phase === 'open' ? 0 : 1,
        pointerEvents: phase === 'map' ? 'auto' : 'none'
      }}
      transition={{ duration: 0.54, ease: gateEase }}
    >
      <div className="space-y-4 pt-2 lg:hidden">
        {LOCATIONS.map((point, index) => (
          <LocationNode
            key={point.id}
            point={point}
            selected={selected}
            phase={phase}
            isBusy={isBusy}
            onSelect={onSelect}
            index={index}
            nearestId={nearest?.id ?? null}
            nearestDistance={nearest?.id === point.id ? nearest.distance : null}
            mode="mobile"
          />
        ))}
      </div>
    </motion.div>
  );
}
