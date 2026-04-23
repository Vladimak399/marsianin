'use client';

import Image from 'next/image';
import { MouseEvent, useCallback, useRef } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import GridOverlay from '@/components/ui/GridOverlay';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const gridX = useTransform(pointerX, [-0.5, 0.5], [-3, 3]);
  const gridY = useTransform(pointerY, [-0.5, 0.5], [-3, 3]);
  const logoX = useTransform(pointerX, [-0.5, 0.5], [-1, 1]);
  const logoY = useTransform(pointerY, [-0.5, 0.5], [-1, 1]);
  const textX = useTransform(pointerX, [-0.5, 0.5], [-2, 2]);
  const textY = useTransform(pointerY, [-0.5, 0.5], [-2, 2]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 24]);

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

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden border border-grid bg-white"
      style={{ opacity: heroOpacity, y: heroY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative h-full min-h-screen">
        <motion.div variants={fadeUp} style={{ x: gridX, y: gridY }}>
          <GridOverlay className="z-10" />
        </motion.div>

        <div className="relative z-20 mx-auto grid min-h-screen w-full max-w-[1240px] grid-cols-1 items-center px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-7">
            <motion.div
              layout
              variants={fadeUp}
              className="relative w-full"
              style={{ x: logoX, y: logoY }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Image src="/logo.svg" alt="Марсианин" width={220} height={220} priority className="h-32 w-32 sm:h-44 sm:w-44" />
            </motion.div>

            <motion.div layout variants={fadeUp} className="space-y-4" style={{ x: textX, y: textY }}>
              <h1 className="text-5xl font-semibold uppercase leading-none tracking-tight text-neutral-900 sm:text-7xl">марсианин</h1>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                Локальная кофейня с инженерным подходом к меню: точная граммовка, прозрачная структура блюд и система,
                в которой важна каждая деталь.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.24, ease: 'easeOut' }}>
              <PrimaryButton href="#menu">смотреть меню</PrimaryButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
