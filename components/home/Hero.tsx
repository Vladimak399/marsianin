'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import { useLocation } from '@/components/providers/LocationProvider';
import BrandHeader from './BrandHeader';
import { CoordinateBackground } from './CoordinateBackground';
import DesktopScene from './DesktopScene';
import { LockCaption } from './LocationNode';
import LocationMap from './LocationMap';
import LocationOpenPanel from './LocationOpenPanel';
import TransitionOverlay from './TransitionOverlay';
import { UserCoordinateTrace, UserTraceLayer } from './UserCoordinateTrace';
import { Coordinates, getNearestLocation, LocationPoint, Phase } from './types';

const DEMO_USER_COORDS = { lat: 54.71264, lng: 20.51214 };

export default function Hero() {
  const { setSelectedLocation, setGuestCoordinates, setIsTeleporting, setTeleportOrigin } = useLocation();
  const [selected, setSelected] = useState<LocationPoint | null>(null);
  const [phase, setPhase] = useState<Phase>('map');
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [geoUnavailable, setGeoUnavailable] = useState(false);

  const applyCoordinates = useCallback(
    (nextCoords: Coordinates, unavailable = false) => {
      setUserCoords(nextCoords);
      setGuestCoordinates(nextCoords);
      setGeoUnavailable(unavailable);
    },
    [setGuestCoordinates]
  );
  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<Phase>('map');

  const nearest = useMemo(() => getNearestLocation(userCoords), [userCoords]);
  const cameraY = useMemo(() => (selected ? 50 - selected.visual.y : 0), [selected]);
  const isBusy = phase !== 'map' && phase !== 'open';

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function addTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const applyDemoFallback = () => {
      // В production геолокация часто блокируется (HTTP, отказ пользователя, политика браузера),
      // поэтому всегда показываем рабочие координаты и оставляем интерфейс живым.
      applyCoordinates(DEMO_USER_COORDS, true);
    };

    if (!('geolocation' in navigator)) {
      applyDemoFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        applyCoordinates(nextCoords, false);
      },
      () => applyDemoFallback(),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );

    return clearTimers;
  }, [applyCoordinates]);

  function runPointSelection(point: LocationPoint) {
    const currentPhase = phaseRef.current;
    const canSelect = currentPhase === 'map' || currentPhase === 'open';
    if (!canSelect) return;

    clearTimers();
    setSelectedLocation(point.id);
    setSelected(point);
    setPhase('lock');
    addTimer(() => setPhase('docking'), 220);
    addTimer(() => setPhase('wash'), 660);
    addTimer(() => setPhase('open'), 900);
  }

  function select(point: LocationPoint) {
    runPointSelection(point);
  }

  function back() {
    clearTimers();
    setIsTeleporting(false);
    setPhase('map');
    addTimer(() => setSelected(null), 120);
  }

  function switchPoint(point: LocationPoint) {
    clearTimers();
    setPhase('map');
    setSelected(null);
    addTimer(() => runPointSelection(point), 90);
  }

  function openCategory(category: string | null) {
    if (!selected) return;

    clearTimers();

    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const href = `/menu/${selected.id}${query}`;

    setSelectedLocation(selected.id);
    setTeleportOrigin({ x: selected.visual.x, y: selected.visual.y });
    setIsTeleporting(true);

    window.setTimeout(() => {
      window.location.assign(href);
    }, 180);
  }

  return (
    <section className="font-halvar relative min-h-[100dvh] overflow-hidden bg-[#f7f4ee] text-black">
      <style>{`
        .font-halvar {
          font-family: var(--font-halvar-mittel), "Halvar Mittelschrift", "Halvar", "Arial Narrow", "Inter", system-ui, sans-serif;
          font-feature-settings: "tnum" 1, "lnum" 1;
        }
      `}</style>

      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[#fffdf8] shadow-[0_16px_52px_rgba(0,0,0,.06)] sm:border-x sm:border-black/[0.04] lg:hidden">
        <CoordinateSystemLayer
          mode={phase === 'open' ? 'open' : phase === 'docking' || phase === 'wash' ? 'transition' : 'map'}
          verticalShift={phase === 'docking' || phase === 'wash' ? cameraY * 0.8 : 0}
          muted={phase === 'open'}
        />
        <div className="pointer-events-none absolute -right-20 top-24 z-[3] h-64 w-64 rounded-full bg-[#ed6a32]/12 blur-3xl" />
        {phase !== 'open' ? <BrandHeader /> : null}
        <AnimatePresence>
          <UserCoordinateTrace
            userCoords={userCoords}
            nearest={nearest}
            phase={phase}
            selected={selected}
            geoUnavailable={geoUnavailable}
          />
        </AnimatePresence>
        <CoordinateBackground selected={selected} phase={phase} nearestId={nearest?.id ?? null} />
        <UserTraceLayer userCoords={userCoords} nearest={nearest} selected={selected} phase={phase} />
        <LocationMap phase={phase} cameraY={cameraY} selected={selected} isBusy={isBusy} nearest={nearest} onSelect={select} />
        <LockCaption selected={selected} phase={phase} />
        <TransitionOverlay selected={selected} phase={phase} />
        <AnimatePresence>
          {phase === 'open' && selected ? (
            <LocationOpenPanel
              selected={selected}
              userCoords={userCoords}
              isBusy={isBusy}
              onBack={back}
              onSwitch={switchPoint}
              onOpenCategory={openCategory}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <DesktopScene
        selected={selected}
        phase={phase}
        nearest={nearest}
        userCoords={userCoords}
        isBusy={isBusy}
        onSelect={select}
        onBack={back}
        onSwitch={switchPoint}
        onOpenCategory={openCategory}
      />
    </section>
  );
}
