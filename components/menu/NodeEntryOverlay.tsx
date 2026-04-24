'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

type OverlayMode = 'full' | 'short';

type NodeEntryOverlayProps = {
  mode: OverlayMode;
  nodeCode: string;
  address: string;
  lat: number;
  lng: number;
  guestCoordinates?: { lat: number; lng: number } | null;
  onDone: () => void;
};

const fullDurationMs = 1650;
const shortDurationMs = 560;

const formatCoordinate = (value: number, positiveLabel: string, negativeLabel: string) => {
  const direction = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)} ${direction}`;
};

export default function NodeEntryOverlay({
  mode,
  nodeCode,
  address,
  lat,
  lng,
  guestCoordinates,
  onDone
}: NodeEntryOverlayProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDone, mode === 'full' ? fullDurationMs : shortDurationMs);
    return () => window.clearTimeout(timeoutId);
  }, [mode, onDone]);

  if (mode === 'short') {
    return (
      <motion.div
        className="pointer-events-none fixed inset-0 z-[140]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-[#f8f6f2]/85" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.45, scale: 1.03 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(23,23,23,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,23,0.15) 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#f5a36f] bg-[#f8f6f2]/88 px-4 py-2 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <p className="text-[10px] tracking-[0.16em] text-neutral-500">активная точка</p>
          <p className="mt-0.5 text-base font-semibold tracking-[0.08em] text-[#ff6a2d]">{nodeCode}</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[140] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
        <div className="absolute inset-0 bg-[#f8f6f2]/96" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(20,20,20,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,20,0.1) 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
      />
      <motion.div
        className="absolute inset-6 hidden border border-[#d8d1ca] md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0.22] }}
        transition={{ duration: 0.9, times: [0, 0.45, 1] }}
      />
      {guestCoordinates ? (
        <>
          <motion.div
            className="absolute left-8 top-8 w-[240px] border border-[#d8d1ca] bg-[#f8f6f2]/74 px-3 py-2 md:left-10 md:top-10"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0, 0, 1], y: [-6, -6, 0] }}
            transition={{ duration: 0.85, times: [0, 0.36, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] tracking-[0.16em] text-neutral-500">координаты гостя</p>
            <p className="mt-1 text-xs tracking-[0.1em] text-neutral-700">
              {formatCoordinate(guestCoordinates.lat, 'N', 'S')} / {formatCoordinate(guestCoordinates.lng, 'E', 'W')}
            </p>
          </motion.div>
          <motion.div
            className="absolute left-[120px] top-[100px] h-[1px] w-[44vw] origin-left bg-[#ff7d45]/80 md:left-[150px] md:top-[110px] md:w-[38vw]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0, 1], scaleX: [0, 0, 1] }}
            transition={{ duration: 1.1, times: [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: 'rotate(20deg)' }}
          />
        </>
      ) : null}

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 0.45, repeat: 1, repeatType: 'mirror' }}
      >
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7d45]" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#bbb3ab] md:h-[420px] md:w-[420px]"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.32, opacity: [0, 0.55, 0.1] }}
        transition={{ duration: 1.05, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full w-full rounded-full border border-[#d8d0c9] [mask-image:radial-gradient(circle,transparent_30%,black_100%)]" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cac3bc] md:block"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: [0, 0, 0.45, 0.25], scale: [0.94, 0.94, 1.02, 1.03] }}
        transition={{ duration: 1.25, times: [0, 0.45, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[1px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-[#ff7d45]"
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: [0, 0, 1, 1], scaleX: [0.3, 0.3, 1, 1] }}
        transition={{ duration: 1.2, times: [0, 0.52, 0.72, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[200px] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-[#ff7d45]"
        initial={{ opacity: 0, scaleY: 0.3 }}
        animate={{ opacity: [0, 0, 1, 1], scaleY: [0.3, 0.3, 1, 1] }}
        transition={{ duration: 1.2, times: [0, 0.52, 0.72, 1] }}
      />

      <motion.div
        className="absolute left-1/2 top-[62%] w-[min(92vw,420px)] -translate-x-1/2 border border-[#d7cec6] bg-[#f8f6f2]/76 px-5 py-4 md:top-[64%]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: [0, 0, 1], y: [14, 14, 0] }}
        transition={{ duration: 1.35, times: [0, 0.66, 1], ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] tracking-[0.16em] text-neutral-500">активная точка</p>
        <p className="mt-1 text-[2rem] font-semibold leading-none tracking-[0.06em] text-[#ff6a2d]">{nodeCode}</p>
        <p className="mt-1 text-[11px] tracking-[0.08em] text-neutral-700">{address}</p>
        <p className="mt-1 text-[10px] tracking-[0.12em] text-neutral-500">
          {formatCoordinate(lat, 'N', 'S')} / {formatCoordinate(lng, 'E', 'W')}
        </p>
      </motion.div>
    </motion.div>
  );
}
