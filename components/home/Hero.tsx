'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/components/providers/LocationProvider';
import { getLocationLabel, LocationId, locations } from '@/data/locations';
import { premiumEase } from '@/lib/animations';
import { Coordinates, haversineDistanceKm } from '@/lib/geo';
import LocationSelector from './LocationSelector';

type NodeConfig = {
  id: LocationId;
  x: number;
  y: number;
  technical: string;
  coords: string;
};

type GeolocationState = 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported' | 'error';

const nodes: NodeConfig[] = [
  {
    id: 'o12',
    x: 18,
    y: 63,
    technical: 'стартовый сектор',
    coords: 'x: 05 | y: 12'
  },
  {
    id: 'k10',
    x: 62,
    y: 31,
    technical: 'кофейный протокол',
    coords: 'x: 18 | y: 10'
  },
  {
    id: 'p7',
    x: 81,
    y: 70,
    technical: 'финальный вектор',
    coords: 'x: 24 | y: 07'
  }
];

const locationById = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<LocationId, (typeof locations)[number]>;

export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const routeTimerRef = useRef<number | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [hoveredNode, setHoveredNode] = useState<LocationId | null>(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50, inside: false });
  const [geoState, setGeoState] = useState<GeolocationState>('idle');
  const [geoMessage, setGeoMessage] = useState('ожидание геопозиции');
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);

  const nearestPoint = useMemo(() => {
    if (!userPosition) {
      return null;
    }

    const ranked = locations
      .map((location) => ({
        ...location,
        distanceKm: haversineDistanceKm(userPosition, { lat: location.lat, lng: location.lng })
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return ranked[0] ?? null;
  }, [userPosition]);

  const focusNodeId = hoveredNode ?? selectedLocation ?? nearestPoint?.id ?? 'o12';
  const focusNode = nodes.find((node) => node.id === focusNodeId) ?? nodes[0];

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    []
  );

  useEffect(
    () => () => {
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoState('unsupported');
      setGeoMessage('геолокация не поддерживается');
      return;
    }

    setGeoState('loading');
    setGeoMessage('запрашиваем доступ к координатам');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoState('ready');
        setGeoMessage('координаты получены');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoState('denied');
          setGeoMessage('доступ к геолокации отклонён');
          return;
        }

        setGeoState('error');
        setGeoMessage('не удалось определить позицию');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60_000
      }
    );
  }, []);

  const handleMove = useCallback((event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setCursor({ x, y, inside: true });
  }, []);

  const handleLeave = () => {
    setCursor((prev) => ({ ...prev, inside: false }));
    setHoveredNode(null);
  };

  const goToMenu = (location: LocationId) => {
    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
    }

    routeTimerRef.current = window.setTimeout(() => {
      router.push(`/menu?location=${location}&category=завтраки`);
    }, 140);
  };

  const handleNodeClick = (location: LocationId) => {
    setSelectedLocation(location);
    goToMenu(location);
  };

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative min-h-svh overflow-hidden border border-[#e6e0da] bg-[#f8f5f1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_7%,rgba(255,132,59,0.12),transparent_34%),radial-gradient(circle_at_85%_78%,rgba(255,150,75,0.09),transparent_38%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(23,23,23,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.07)_1px,transparent_1px)] [background-size:72px_72px] sm:[background-size:92px_92px]"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
        animate={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          width: cursor.inside ? 320 : 260,
          height: cursor.inside ? 320 : 260,
          opacity: cursor.inside ? 0.32 : 0
        }}
        transition={{ duration: 0.18, ease: premiumEase }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,114,40,0.22) 0%, rgba(255,114,40,0.08) 35%, rgba(255,114,40,0) 75%)'
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1240px] flex-col px-4 pb-5 pt-5 sm:px-6 sm:pt-6 lg:px-12">
        <header className="flex items-start justify-between gap-3 text-[10px] tracking-[0.16em] text-[#808080]">
          <div>
            <p className="text-[clamp(1.55rem,8vw,2.2rem)] leading-none tracking-[0.03em] text-[#202020]">марсианин</p>
            <p className="mt-1 text-[9px] tracking-[0.16em] text-[#9c9c9c]">система выбора точки</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/menu?location=${selectedLocation ?? 'o12'}&category=завтраки`)}
            className="min-h-10 border border-[#d8d2cb] px-3 py-2 text-[10px] tracking-[0.12em] text-[#6f6f6f] transition-colors hover:bg-[#ffffffa6]"
          >
            меню
          </button>
        </header>

        <div className="relative mt-6 flex-1 lg:mt-8">
          <div className="relative z-20 max-w-[640px] space-y-3 sm:space-y-4">
            <p className="text-[10px] tracking-[0.18em] text-[#777777]">координаты · навигация · выбор</p>
            <h1 className="text-[clamp(1.85rem,9vw,3.6rem)] font-semibold leading-[0.95] tracking-[0.01em] text-[#121212]">
              выберите
              <br />
              точку входа
            </h1>
            <p className="max-w-[520px] text-[clamp(0.9rem,3.6vw,1.08rem)] leading-relaxed text-[#666666]">
              показываем ваше положение, определяем ближайшую точку и даём переход одним действием.
            </p>

            <div className="grid gap-2 border border-[#ddcfc4] bg-[#fff8f2]/80 p-3 text-[10px] tracking-[0.14em] text-[#6b625b] sm:grid-cols-2">
              <div>
                <p className="text-[#9a7f69]">положение пользователя</p>
                <p className="mt-1 text-[11px] text-[#3f3a36]">{geoMessage}</p>
                {userPosition ? (
                  <p className="mt-1 text-[10px] text-[#5b534c]">
                    lat {userPosition.lat.toFixed(4)} · lng {userPosition.lng.toFixed(4)}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-[#9a7f69]">ближайшая точка</p>
                {nearestPoint ? (
                  <>
                    <p className="mt-1 text-[11px] text-[#3f3a36]">
                      {nearestPoint.label} · {nearestPoint.distanceKm.toFixed(2)} км
                    </p>
                    <p className="mt-1 text-[10px] text-[#5b534c]">{nearestPoint.address}</p>
                  </>
                ) : (
                  <p className="mt-1 text-[11px] text-[#3f3a36]">определение недоступно, выберите вручную</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!nearestPoint}
                onClick={() => {
                  if (!nearestPoint) {
                    return;
                  }

                  setSelectedLocation(nearestPoint.id);
                  goToMenu(nearestPoint.id);
                }}
                className="min-h-10 border border-[#ff7a43] bg-[#fff1e8] px-3 py-2 text-[10px] tracking-[0.14em] text-[#b34b1f] transition-colors hover:bg-[#ffe7da] disabled:cursor-not-allowed disabled:border-[#e1d5cc] disabled:bg-[#f3efeb] disabled:text-[#9f9389]"
              >
                перейти в ближайшую точку
              </button>
              <button
                type="button"
                onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="min-h-10 border border-[#d8d2cb] bg-transparent px-3 py-2 text-[10px] tracking-[0.14em] text-[#6f6f6f] transition-colors hover:bg-[#ffffffa6]"
              >
                выбрать вручную
              </button>
            </div>
          </div>

          <div className="mt-6 lg:hidden">
            <LocationSelector
              selectedLocation={selectedLocation}
              onSelect={(location) => {
                setSelectedLocation(location);
                goToMenu(location);
              }}
            />
          </div>

          <div className="pointer-events-none mt-5 flex items-center justify-between text-[9px] tracking-[0.14em] text-[#929292] lg:hidden">
            <span>y: 10</span>
            <span>y: 05</span>
            <span>y: 00</span>
          </div>

          <div className="relative hidden h-full min-h-[420px] lg:block">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 border-t border-[#ff7a43]/70"
              animate={{ top: `${focusNode.y}%`, opacity: hoveredNode || selectedLocation || nearestPoint ? 1 : 0.7 }}
              transition={{ duration: 0.2, ease: premiumEase }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-0 top-0 border-l border-[#ff7a43]/70"
              animate={{ left: `${focusNode.x}%`, opacity: hoveredNode || selectedLocation || nearestPoint ? 1 : 0.7 }}
              transition={{ duration: 0.2, ease: premiumEase }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff6e37] bg-[#fff4ee]"
              animate={{ left: `${focusNode.x}%`, top: `${focusNode.y}%`, scale: hoveredNode ? 1.08 : 1 }}
              transition={{ duration: 0.16, ease: premiumEase }}
            />

            {nodes.map((node) => {
              const isActive = selectedLocation === node.id;
              const isNearest = nearestPoint?.id === node.id;
              const isFocused = focusNodeId === node.id;
              const isDimmed = Boolean(focusNodeId) && !isFocused;
              const location = locationById[node.id];

              return (
                <motion.button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onFocus={() => setHoveredNode(node.id)}
                  onBlur={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  animate={{ opacity: isDimmed ? 0.42 : 1, scale: isActive ? 1.03 : 1 }}
                  transition={{ duration: 0.18, ease: premiumEase }}
                >
                  <div className="mb-2 text-[9px] tracking-[0.16em] text-[#8d8d8d]">{node.technical}</div>
                  <div className="text-[clamp(2.8rem,5vw,4.8rem)] font-medium leading-[0.88] tracking-[0.01em] text-[#1d1d1d]">
                    {location.label}
                  </div>
                  <div className="mt-1.5 text-[10px] tracking-[0.16em] text-[#7a7a7a]">{node.coords}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] tracking-[0.16em]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        isNearest ? 'border-[#ff6e37] bg-[#ff6e37]' : 'border-[#ff7a44] bg-[#fff5ef]'
                      }`}
                    />
                    <span className={isNearest ? 'text-[#ff6e37]' : isFocused ? 'text-[#ff6e37]' : 'text-[#777777]'}>
                      {isNearest ? 'ближайший узел' : `точка ${location.label}`}
                    </span>
                  </div>
                  <div className="mt-1 text-[9px] tracking-[0.12em] text-[#9c8f84]">{location.address}</div>
                </motion.button>
              );
            })}

            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[9px] tracking-[0.16em] text-[#9b9b9b]">
              <span>y: 30</span>
              <span>y: 20</span>
              <span>y: 10</span>
              <span>y: 00</span>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-between text-[9px] tracking-[0.16em] text-[#9b9b9b]">
              <span>x: 00</span>
              <span>x: 08</span>
              <span>x: 16</span>
              <span>x: 24</span>
              <span>x: 32</span>
            </div>
          </div>
        </div>

        <footer className="mt-5 grid grid-cols-1 gap-2 border-t border-[#ddd7d1] pt-3 text-[9px] tracking-[0.14em] text-[#8d8d8d] sm:grid-cols-2 lg:grid-cols-4">
          <span>статус системы · {geoState}</span>
          <span>текущая точка · {getLocationLabel(selectedLocation ?? 'o12')}</span>
          <span>ближайшая · {nearestPoint ? getLocationLabel(nearestPoint.id) : 'ручной выбор'}</span>
          <span>дата · {currentDate}</span>
        </footer>
      </div>
    </motion.section>
  );
}
