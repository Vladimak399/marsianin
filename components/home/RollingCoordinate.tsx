'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

type RollingCoordinateProps = {
  lat: number;
  lng: number;
  active?: boolean;
  className?: string;
};

function formatCoordinate(label: 'lat' | 'lng', value: number) {
  return `${label}: ${value.toFixed(6)}`;
}

function buildSteps(value: number, label: 'lat' | 'lng') {
  const signedDelta = label === 'lat' ? 0.0234 : -0.0178;
  const start = value + signedDelta;
  const near = value + signedDelta * 0.22;
  return [formatCoordinate(label, start), formatCoordinate(label, near), formatCoordinate(label, value)];
}

function RollingGroup({ label, value, active, delay = 0 }: { label: 'lat' | 'lng'; value: number; active: boolean; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const finalValue = formatCoordinate(label, value);

  if (!active || reduceMotion) {
    return <div className="leading-[1.35]">{finalValue}</div>;
  }

  const rows = buildSteps(value, label);

  return (
    <div className="h-[1.35em] overflow-hidden leading-[1.35]">
      <motion.div
        key={`${label}-${finalValue}`}
        className="[will-change:transform,opacity]"
        initial={{ y: '-66.66%', opacity: 0.72 }}
        animate={{ y: '-133.33%', opacity: 1 }}
        transition={{ duration: 0.58, delay, ease: premiumEase }}
      >
        {rows.map((row) => (
          <div key={`${label}-${row}`}>{row}</div>
        ))}
      </motion.div>
    </div>
  );
}

export default function RollingCoordinate({ lat, lng, active = false, className = '' }: RollingCoordinateProps) {
  return (
    <div className={`font-halvar tabular-nums ${className}`}>
      <RollingGroup label="lat" value={lat} active={active} delay={0.02} />
      <RollingGroup label="lng" value={lng} active={active} delay={0.06} />
    </div>
  );
}
