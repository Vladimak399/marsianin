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
      router.push(`/menu?location=${location}`);
    },
    [router, setSelectedLocation]
  );

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden border border-[#ececec] bg-[#f6f6f6]"
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.8),rgba(240,240,240,0.95))]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(17,17,17,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.07)_1px,transparent_1px)] [background-size:360px_220px]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1700px] flex-col px-6 pb-8 pt-10 sm:px-10 lg:px-14">
        <header className="flex items-start justify-between text-[#9f9f9f]">
          <div>
            <p className="text-[48px] leading-none text-[#b7b7b7]">Y</p>
            <p className="text-[11px] uppercase tracking-[0.6em] text-[#ff5a1f]">марсианин</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.42em] text-[#b3b3b3]">кофейная система</p>
          </div>
          <div className="mt-2 flex items-center gap-5 text-[11px] uppercase tracking-[0.4em] text-[#8f8f8f]">
            <span>меню</span>
            <span className="space-y-1.5">
              <span className="block h-px w-7 bg-[#b0b0b0]" />
              <span className="block h-px w-7 bg-[#b0b0b0]" />
            </span>
          </div>
        </header>

        <div className="mt-16 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-9 pt-10">
            <p className="text-xs uppercase tracking-[0.6em] text-[#616161]">исследуйте систему</p>
            <h1 className="max-w-4xl text-5xl font-semibold uppercase leading-[0.98] tracking-[0.04em] text-[#131720] sm:text-7xl lg:text-[88px]">
              выберите точку <br /> и начните маршрут
            </h1>
            <p className="max-w-xl text-2xl leading-relaxed text-[#a6a6a6]">
              Каждая точка — это уникальный протокол вкуса, данные, процесс и внимание к деталям.
            </p>
          </div>

          <div className="hidden items-start justify-end pt-20 lg:flex">
            <div className="max-w-sm border-l border-[#d8d8d8] pl-8 text-xs uppercase tracking-[0.45em] text-[#7f7f7f]">
              coffee navigation system
              <br />
              ms — 012 research grid
            </div>
          </div>
        </div>

        <LocationSelector selectedLocation={selectedLocation} onSelect={handleTeleport} />

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#dedede] pt-5 text-[10px] uppercase tracking-[0.38em] text-[#9a9a9a]">
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
