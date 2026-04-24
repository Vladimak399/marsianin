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
        initial={{ y: '-58%', opacity: 0.5 }}
        animate={{ y: ['-58%', '-138%', '-133.33%'], opacity: [0.5, 0.86, 1, 0.94, 1] }}
        transition={{
          y: {
            duration: 0.82,
            delay,
            ease: premiumEase,
            times: [0, 0.72, 1],
          },
          opacity: {
            duration: 0.82,
            delay,
            ease: premiumEase,
            times: [0, 0.55, 0.86, 0.93, 1],
          },
        }}
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
      <RollingGroup label="lat" value={lat} active={active} delay={0.01} />
      <RollingGroup label="lng" value={lng} active={active} delay={0.08} />
    </div>
  );
}
