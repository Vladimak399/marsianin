'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { premiumEase } from '@/lib/animations';

type CoordinateVariant = 'plain' | 'labeled' | 'compact';

type RollingCoordinateProps = {
  lat: number;
  lng: number;
  active?: boolean;
  className?: string;
  variant?: CoordinateVariant;
  animationKey?: string | number;
};

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

function buildSteps(value: number, axis: 'lat' | 'lng') {
  const signedDelta = axis === 'lat' ? 0.0234 : -0.0178;
  const start = value + signedDelta;
  const near = value + signedDelta * 0.22;
  return [formatCoordinate(start), formatCoordinate(near), formatCoordinate(value)];
}

function getLabel(axis: 'lat' | 'lng', variant: CoordinateVariant) {
  if (variant !== 'labeled') return null;
  return axis === 'lat' ? 'широта' : 'долгота';
}

function RollingGroup({
  axis,
  value,
  active,
  delay = 0,
  variant,
  animationKey
}: {
  axis: 'lat' | 'lng';
  value: number;
  active: boolean;
  delay?: number;
  variant: CoordinateVariant;
  animationKey?: string | number;
}) {
  const reduceMotion = useReducedMotion();
  const finalValue = formatCoordinate(value);
  const label = getLabel(axis, variant);

  if (!active || reduceMotion) {
    return (
      <div className="leading-[1.35]">
        {label ? <span className="mr-1.5 text-black/45">{label}</span> : null}
        <span>{finalValue}</span>
      </div>
    );
  }

  const rows = buildSteps(value, axis);

  return (
    <div className="h-[1.35em] overflow-hidden leading-[1.35]">
      <motion.div
        key={`${axis}-${finalValue}-${animationKey ?? 'auto'}`}
        className="[will-change:transform,opacity]"
        initial={{ y: '-58%', opacity: 0.5 }}
        animate={{ y: ['-58%', '-138%', '-133.33%'], opacity: [0.5, 0.86, 1, 0.94, 1] }}
        transition={{
          y: {
            duration: 0.82,
            delay,
            ease: premiumEase,
            times: [0, 0.72, 1]
          },
          opacity: {
            duration: 0.82,
            delay,
            ease: premiumEase,
            times: [0, 0.55, 0.86, 0.93, 1]
          }
        }}
      >
        {rows.map((row) => (
          <div key={`${axis}-${row}`}>
            {label ? <span className="mr-1.5 text-black/45">{label}</span> : null}
            <span>{row}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function RollingCoordinate({
  lat,
  lng,
  active = false,
  className = '',
  variant = 'plain',
  animationKey
}: RollingCoordinateProps) {
  return (
    <div className={`font-halvar tabular-nums ${className}`}>
      <RollingGroup axis="lat" value={lat} active={active} delay={0.01} variant={variant} animationKey={animationKey} />
      <RollingGroup axis="lng" value={lng} active={active} delay={0.08} variant={variant} animationKey={animationKey} />
    </div>
  );
}
