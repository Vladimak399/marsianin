'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import LocationSelector from '@/components/home/LocationSelector';
import { useLocation } from '@/components/providers/LocationProvider';
import { premiumEase } from '@/lib/animations';
import { LocationId } from '@/data/locations';

export default function Hero() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const handleTeleport = useCallback(
    (location: LocationId, _event: MouseEvent<HTMLButtonElement>) => {
      setSelectedLocation(location);
      router.push(`/menu?location=${location}&category=завтраки`);
    },
    [router, setSelectedLocation]
  );

  const goToMenu = () => {
    const location = selectedLocation ?? 'o12';
    router.push(`/menu?location=${location}&category=завтраки`);
  };

  return (
    <motion.section
      className="relative h-full overflow-hidden border border-[#ececec] bg-[#f6f6f6]"
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_8%,rgba(255,122,45,0.28),transparent_42%),radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.9),rgba(240,240,240,0.96))]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(17,17,17,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.07)_1px,transparent_1px)] [background-size:360px_220px]"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-6 lg:px-12 lg:pb-6 lg:pt-7">
        <header className="flex items-start justify-between text-[#9f9f9f]">
          <div>
            <p className="text-[38px] leading-none text-[#b7b7b7] sm:text-[42px] lg:text-[46px]">Y</p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#ff5a1f]">марсианин</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.36em] text-[#b3b3b3]">кофейная система</p>
          </div>
          <motion.button
            type="button"
            onClick={goToMenu}
            className="mt-1 inline-flex items-center gap-4 border border-[#d5d5d5] bg-white/85 px-3 py-2 text-[10px] uppercase tracking-[0.32em] text-[#575757]"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>меню</span>
            <span className="space-y-1">
              <span className="block h-px w-6 bg-[#969696]" />
              <span className="block h-px w-6 bg-[#969696]" />
            </span>
          </motion.button>
        </header>

        <div className="mt-5 grid flex-1 grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <div className="space-y-4 pt-1 lg:space-y-5">
            <p className="text-[10px] uppercase tracking-[0.48em] text-[#616161] sm:text-xs">исследуйте систему</p>
            <h1 className="max-w-4xl text-[clamp(2.2rem,5vw,4.9rem)] font-semibold uppercase leading-[0.92] tracking-[0.028em] text-[#131720]">
              выберите точку <br /> и начните маршрут
            </h1>
            <p className="max-w-xl text-[clamp(1rem,1.45vw,1.45rem)] leading-[1.45] text-[#7e7e7e]">
              Каждая точка — это уникальный протокол вкуса, данные, процесс и внимание к деталям.
            </p>
          </div>

          <div className="hidden items-start justify-end pt-2 lg:flex">
            <div className="max-w-sm border-l border-[#d8d8d8] pl-6 text-[11px] uppercase tracking-[0.38em] text-[#7f7f7f]">
              coffee navigation system
              <br />
              ms — 012 research grid
            </div>
          </div>
        </div>

        <LocationSelector selectedLocation={selectedLocation} onSelect={handleTeleport} />

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#dedede] pt-3 text-[9px] uppercase tracking-[0.3em] text-[#9a9a9a] sm:text-[10px] sm:tracking-[0.34em]">
          <span>system / ms-012</span>
          <span>grid lock / 3×5</span>
          <span>
            date / {currentDate} <span className="ml-4">time / {currentTime}</span>
          </span>
        </footer>
      </div>
    </motion.section>
  );
}
