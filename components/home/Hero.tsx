'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GridOverlay from '@/components/ui/GridOverlay';
import LocationSelector from '@/components/home/LocationSelector';
import { useLocation } from '@/components/providers/LocationProvider';
import { fadeUp, premiumEase, staggerContainer } from '@/lib/animations';
import { LocationId } from '@/data/locations';

const DECISION_DELAY = 100;
const TELEPORT_DELAY = 460;

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { selectedLocation, setSelectedLocation, isTeleporting, setIsTeleporting, setTeleportOrigin } = useLocation();
  const [isCollapsing, setIsCollapsing] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.3 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.3 });

  const heroOpacity = useTransform(scrollY, [0, 360], [1, 0.58]);
  const heroTranslateY = useTransform(scrollY, [0, 360], [0, -26]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isTeleporting) return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [isTeleporting, pointerX, pointerY]
  );

  const handleMouseLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const handleScroll = useCallback(() => {
    if (!heroRef.current) return;
    const offset = Math.max(window.scrollY - heroRef.current.offsetTop, 0);
    scrollY.set(offset);
  }, [scrollY]);

  const currentLocationLabel = useMemo(() => selectedLocation?.toUpperCase() ?? '---', [selectedLocation]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isTeleporting) {
      setIsCollapsing(false);
    }
  }, [isTeleporting]);

  const handleTeleport = useCallback(
    (location: LocationId, event: MouseEvent<HTMLButtonElement>) => {
      if (isTeleporting) return;

      const rect = event.currentTarget.getBoundingClientRect();
      setTeleportOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      setSelectedLocation(location);

      window.setTimeout(() => {
        setIsCollapsing(true);
        setIsTeleporting(true);

        window.setTimeout(() => {
          router.push(`/menu?location=${location}`);
        }, TELEPORT_DELAY);
      }, DECISION_DELAY);
    },
    [isTeleporting, router, setIsTeleporting, setSelectedLocation, setTeleportOrigin]
  );

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden border border-grid bg-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: isTeleporting ? 'none' : 'auto' }}
      animate={{ opacity: isCollapsing ? 0.2 : 1, scale: isCollapsing ? 0.98 : 1 }}
      transition={{ duration: 0.25, ease: premiumEase }}
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative h-full min-h-screen" style={{ opacity: heroOpacity, y: heroTranslateY }}>
        <GridOverlay className="z-10" pointerX={smoothX} pointerY={smoothY} />

        <div className="relative z-20 mx-auto grid min-h-screen w-full max-w-[1240px] grid-cols-1 items-center px-5 py-16 sm:px-8 lg:px-10">
          <motion.div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, ease: premiumEase }}>
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Image src="/logo.svg" alt="Марсианин" width={88} height={88} priority className="h-12 w-12 sm:h-16 sm:w-16" />
              <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">активный узел: {currentLocationLabel}</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-semibold uppercase leading-none tracking-[0.08em] text-neutral-900 sm:text-6xl">
              выберите точку
            </motion.h1>

            <LocationSelector selectedLocation={selectedLocation} onSelect={handleTeleport} disabled={isTeleporting} />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
