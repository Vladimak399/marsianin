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

type PointVisual = {
  id: LocationId;
  x: number;
  y: number;
};

const pointVisuals: PointVisual[] = [
  { id: 'o12', x: 18, y: 62 },
  { id: 'k10', x: 56, y: 30 },
  { id: 'p7', x: 84, y: 68 }
];

const locationById = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<LocationId, (typeof locations)[number]>;

export default function Hero() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation, setGuestCoordinates } = useLocation();

  const [geoState, setGeoState] = useState<GeolocationState>('idle');
  const [geoMessage, setGeoMessage] = useState('определяем ближайшую точку');
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);

  const nearestPoint = useMemo(() => {
    if (!userPosition) {
      return null;
    }

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
        const nextPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserPosition(nextPosition);
        setGuestCoordinates(nextPosition);
        setGeoState('ready');
        setGeoMessage('ближайшая точка найдена');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGuestCoordinates(null);
          setGeoState('denied');
          setGeoMessage('доступ к геолокации отключён, выберите точку вручную');
          return;
        }

        setGuestCoordinates(null);
        setGeoState('error');
        setGeoMessage('не удалось определить геолокацию, выберите точку вручную');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  }, [setGuestCoordinates]);

  return (
    <motion.section
      className="relative min-h-svh overflow-hidden border border-[#e6e0da] bg-[#f8f5f1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(255,132,59,0.13),transparent_34%),radial-gradient(circle_at_82%_76%,rgba(255,150,75,0.1),transparent_38%),linear-gradient(145deg,rgba(255,244,235,0.56)_0%,rgba(255,248,242,0.24)_56%,rgba(255,252,248,0.08)_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,106,44,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,106,44,0.3)_1px,transparent_1px)] [background-size:52px_52px] sm:[background-size:70px_70px] lg:[background-size:88px_88px]"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1180px] flex-col px-4 pb-6 pt-5 text-left sm:px-6 sm:pt-6 lg:px-12">
        <header className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Логотип Марсианин" width={40} height={40} priority className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-[clamp(1.25rem,5vw,1.9rem)] leading-none tracking-[0.03em] text-[#202020]">марсианин</p>
            <p className="mt-1 text-[11px] tracking-[0.08em] text-[#797979]">меню кофейни</p>
          </div>
        </header>

        <div className="relative mt-6 grid flex-1 gap-5 lg:mt-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-8">
          <div className="space-y-4 sm:space-y-5">
            <h1 className="text-[clamp(1.75rem,8vw,3.2rem)] font-semibold leading-[0.95] tracking-[0.01em] text-[#141414]">
              Выберите точку
              <br />
              и откройте меню
            </h1>
            <p className="max-w-[520px] text-[clamp(0.92rem,3.8vw,1.05rem)] leading-relaxed text-[#636363]">
              Сразу покажем меню выбранной локации с фотографиями и ценами.
            </p>

            <div className="rounded-sm border border-[#e4d5ca] bg-[#fff8f2]/90 p-3 sm:p-4">
              <p className="text-[11px] tracking-[0.1em] text-[#8e6b55]">Геолокация: {geoMessage}</p>
              <p className="mt-1 text-[12px] text-[#5f4b3d]">
                {nearestPoint
                  ? `Ближайшая точка — ${nearestPoint.label} (${nearestPoint.distanceKm.toFixed(1)} км)`
                  : geoState === 'loading'
                    ? 'Ищем ближайшую точку...'
                    : 'Ближайшая точка не определена'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                      backgroundColor: isActive ? '#ffefe4' : '#fffaf6',
                      boxShadow: isActive ? '0 10px 24px rgba(255,109,45,0.18)' : '0 1px 5px rgba(0,0,0,0.04)'
                    }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.18, ease: premiumEase }}
                  >
                    <p
                      className="leading-none tracking-[0.01em]"
                      style={{
                        fontSize: isActive ? 'clamp(2rem,9vw,3.1rem)' : 'clamp(1.8rem,8vw,2.75rem)',
                        color: isActive ? '#ff6d2d' : '#be7750',
                        fontWeight: isActive ? 700 : 600
                      }}
                    >
                      {location.label}
                    </p>
                    <p className="mt-1 text-[10px] tracking-[0.11em] text-[#7c736c]">{location.lat.toFixed(3)}° / {location.lng.toFixed(3)}°</p>
                    <p className={`mt-1 text-[10px] tracking-[0.11em] ${isNearest ? 'text-[#d45524]' : 'text-[#8b827a]'}`}>
                      {isNearest ? 'ближайшая' : 'локация'}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="space-y-2">
              <p className="text-[12px] text-[#5f5a54]">
                Выбрано: <span className="text-[#1e1e1e]">{activeLocation.label}</span> · {activeLocation.address}
              </p>
              <button
                type="button"
                onClick={() => router.push(`/menu/${activeLocationId}?category=завтраки`)}
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[#ff7a43] bg-[#ffe7d9] px-5 py-2 text-[12px] tracking-[0.12em] text-[#a24419] transition-colors hover:bg-[#ffdcc9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a43]"
              >
                открыть меню {activeLocation.label}
              </button>
            </div>
          </div>

          <div className="relative hidden min-h-[360px] rounded-sm border border-[#efcdb8] bg-[#fff4ec]/90 p-4 lg:block">
            {pointVisuals.map((point) => {
              const isActive = activeLocationId === point.id;
              const isNearest = nearestPoint?.id === point.id;
              const location = locationById[point.id];

              return (
                <motion.button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedLocation(point.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  animate={{ scale: isActive ? 1.04 : 1, opacity: isActive ? 1 : 0.86 }}
                  transition={{ duration: 0.2, ease: premiumEase }}
                >
                  <p
                    className="leading-none tracking-[0.01em]"
                    style={{
                      fontSize: isActive ? '4.2rem' : '3.5rem',
                      color: isActive ? '#ff6d2d' : '#c57a52',
                      fontWeight: isActive ? 700 : 600
                    }}
                  >
                    {location.label}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.11em] text-[#705f53]">{location.lat.toFixed(4)}° / {location.lng.toFixed(4)}°</p>
                  <p className={`mt-1 text-[11px] tracking-[0.11em] ${isNearest ? 'text-[#d45524]' : 'text-[#8a7e75]'}`}>
                    {isNearest ? 'ближайшая точка' : 'точка'}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
