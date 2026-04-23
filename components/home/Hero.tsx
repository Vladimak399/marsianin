'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import GridOverlay from '@/components/ui/GridOverlay';
import LocationSelector from '@/components/home/LocationSelector';
import { useLocation } from '@/components/providers/LocationProvider';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const gridX = useTransform(pointerX, [-0.5, 0.5], [-4, 4]);
  const gridY = useTransform(pointerY, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
  }, [pointerX, pointerY]);

  const handleMouseLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const handleEnterMenu = async () => {
    if (!selectedLocation || isTransitioning) return;

    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 360));
    router.push('/menu');
  };

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden border border-grid bg-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative h-full min-h-screen">
        <motion.div variants={fadeUp} style={{ x: gridX, y: gridY }}>
          <GridOverlay className="z-10" />
        </motion.div>

        <div className="relative z-20 mx-auto grid min-h-screen w-full max-w-[1240px] grid-cols-1 items-center px-5 py-16 sm:px-8 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLocation ?? 'idle'}
              className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.34 }}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <Image src="/logo.svg" alt="Марсианин" width={88} height={88} priority className="h-12 w-12 sm:h-16 sm:w-16" />
                <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">навигация по узлам</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl font-semibold uppercase leading-none tracking-[0.08em] text-neutral-900 sm:text-6xl">
                выберите точку
              </motion.h1>

              <LocationSelector selectedLocation={selectedLocation} onSelect={setSelectedLocation} />

              <motion.button
                type="button"
                onClick={handleEnterMenu}
                disabled={!selectedLocation || isTransitioning}
                className="inline-flex items-center justify-center border border-accent px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400"
                animate={{
                  backgroundColor: selectedLocation ? '#ff6a00' : '#ffffff',
                  color: selectedLocation ? '#ffffff' : '#737373'
                }}
                whileTap={selectedLocation ? { scale: 0.98 } : undefined}
              >
                смотреть меню
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
