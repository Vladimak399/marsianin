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
  delayOffset?: number;
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
        initial={{ y: '-56%', opacity: 0.34 }}
        animate={{ y: ['-56%', '-136%', '-133.33%'], opacity: [0.34, 0.9, 1] }}
        transition={{
          y: {
            duration: 1.12,
            delay,
            ease: premiumEase,
            times: [0, 0.74, 1]
          },
          opacity: {
            duration: 1.08,
            delay,
            ease: premiumEase,
            times: [0, 0.62, 1]
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
  animationKey,
  delayOffset = 0
}: RollingCoordinateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`font-halvar tabular-nums ${className}`}
      initial={reduceMotion || !active ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: delayOffset, ease: premiumEase }}
    >
      <RollingGroup axis="lat" value={lat} active={active} delay={0.01 + delayOffset} variant={variant} animationKey={animationKey} />
      <RollingGroup axis="lng" value={lng} active={active} delay={0.1 + delayOffset} variant={variant} animationKey={animationKey} />
    </motion.div>
  );
}
