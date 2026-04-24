'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { premiumEase } from '@/lib/animations';
import { Coordinates, haversineDistanceKm } from '@/lib/geo';

type GeolocationState = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';

const locationById = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<LocationId, (typeof locations)[number]>;

export default function Hero() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();

  const [geoState, setGeoState] = useState<GeolocationState>('idle');
  const [geoMessage, setGeoMessage] = useState('определяем ближайшую точку');
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);

  const nearestPoint = useMemo(() => {
    if (!userPosition) return null;

    return (
      locations
        .map((location) => ({
          ...location,
          distanceKm: haversineDistanceKm(userPosition, { lat: location.lat, lng: location.lng })
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null
    );
  }, [userPosition]);

  const activeLocationId = selectedLocation ?? nearestPoint?.id ?? 'o12';
  const activeLocation = locationById[activeLocationId];

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoState('unsupported');
      setGeoMessage('геолокация не поддерживается, выберите точку вручную');
      return;
    }

    setGeoState('loading');
    setGeoMessage('запрашиваем геолокацию');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGeoState('ready');
        setGeoMessage('ближайшая точка найдена');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoState('denied');
          setGeoMessage('доступ к геолокации отключён, выберите точку вручную');
          return;
        }

        setGeoState('error');
        setGeoMessage('не удалось определить геолокацию, выберите точку вручную');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  }, []);

  return (
    <motion.section
      className="relative min-h-svh overflow-hidden bg-[#f8f5f1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(255,132,59,0.12),transparent_34%),radial-gradient(circle_at_82%_76%,rgba(255,150,75,0.08),transparent_38%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,106,44,0.24)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,106,44,0.24)_1px,transparent_1px)] [background-size:56px_56px] sm:[background-size:72px_72px]"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1100px] flex-col px-4 pb-8 pt-5 text-left sm:px-6 lg:px-10">
        <header className="flex items-center gap-3">
          <Image src="/logo.svg" alt="логотип марсианин" width={40} height={40} priority className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-[clamp(1.2rem,5vw,1.8rem)] leading-none text-[#222]">марсианин</p>
            <p className="mt-1 text-xs text-[#6d6a67]">кофейня, где есть жизнь</p>
          </div>
        </header>

        <div className="mt-7 max-w-[620px]">
          <h1 className="text-[clamp(1.8rem,8vw,3rem)] font-semibold leading-[0.96] text-[#151515]">выберите точку и откройте меню</h1>
          <p className="mt-3 text-[clamp(0.95rem,3.9vw,1.04rem)] leading-relaxed text-[#636363]">
            блюда с фотографиями, описанием и ценами для каждой точки.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
          {locations.map((location) => {
            const isActive = activeLocationId === location.id;
            const isNearest = nearestPoint?.id === location.id;

            return (
              <motion.button
                key={location.id}
                type="button"
                onClick={() => setSelectedLocation(location.id)}
                className="rounded-sm border px-2 py-3 text-left sm:px-3 sm:py-4"
                animate={{
                  borderColor: isActive ? '#ff6d2d' : '#dfd5cc',
                  backgroundColor: isActive ? '#fff1e7' : '#fffaf6',
                  boxShadow: isActive ? '0 10px 24px rgba(255,109,45,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.18, ease: premiumEase }}
              >
                <p
                  className="leading-none"
                  style={{
                    fontSize: isActive ? 'clamp(2rem,9vw,3.1rem)' : 'clamp(1.85rem,8vw,2.8rem)',
                    color: isActive ? '#ff6d2d' : '#ca7e55',
                    fontWeight: isActive ? 700 : 600
                  }}
                >
                  {location.label}
                </p>
                <p className={`mt-2 text-[11px] ${isNearest ? 'text-[#d45524]' : 'text-[#7d756f]'}`}>{isNearest ? 'ближайшая точка' : 'точка меню'}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3 rounded-sm border border-[#e9d6c8] bg-[#fff9f3] p-4">
          <p className="text-xs text-[#765f50]">геолокация: {geoMessage}</p>
          <p className="text-sm text-[#3a332f]">выбрано: {activeLocation.label} · {activeLocation.address}</p>
          <p className="text-xs text-[#6f655e]">координаты точки: {activeLocation.lat.toFixed(4)}° / {activeLocation.lng.toFixed(4)}°</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => router.push(`/menu?location=${activeLocationId}&category=завтраки`)}
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[#ff7a43] bg-[#ffe7d9] px-5 py-2 text-xs text-[#a24419] transition-colors hover:bg-[#ffdcc9]"
            >
              открыть меню {activeLocation.label}
            </button>
            <a
              href={`tel:${activeLocation.phoneTel}`}
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[#f0a16f] bg-white px-4 py-2 text-xs text-[#9b532a] transition-colors hover:bg-[#fff2e9]"
            >
              позвонить {activeLocation.phone}
            </a>
          </div>
          {geoState === 'ready' && nearestPoint ? <p className="text-xs text-[#7f736b]">ближайшая к вам: {nearestPoint.label} ({nearestPoint.distanceKm.toFixed(1)} км)</p> : null}
        </div>
      </div>
    </motion.section>
  );
}
