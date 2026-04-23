'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/components/providers/LocationProvider';
import { premiumEase } from '@/lib/animations';
import { LocationId } from '@/data/locations';

type NodeConfig = {
  id: LocationId;
  label: string;
  x: number;
  y: number;
  subLabel: string;
  technical: string;
  coords: string;
};

const nodes: NodeConfig[] = [
  {
    id: 'o12',
    label: 'O12',
    x: 18,
    y: 63,
    subLabel: 'node O12',
    technical: 'origin sector',
    coords: 'X: 05 | Y: 12'
  },
  {
    id: 'k10',
    label: 'K10',
    x: 62,
    y: 31,
    subLabel: 'active route',
    technical: 'brew protocol',
    coords: 'X: 18 | Y: 10'
  },
  {
    id: 'p7',
    label: 'P7',
    x: 81,
    y: 70,
    subLabel: 'node P7',
    technical: 'finish vector',
    coords: 'X: 24 | Y: 07'
  }
];

export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const routeTimerRef = useRef<number | null>(null);
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [hoveredNode, setHoveredNode] = useState<LocationId | null>(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50, inside: false });

  const focusNodeId = hoveredNode ?? selectedLocation;
  const focusNode = nodes.find((node) => node.id === focusNodeId) ?? null;

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

  const handleNodeClick = (location: LocationId) => {
    setSelectedLocation(location);

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
    }

    routeTimerRef.current = window.setTimeout(() => {
      router.push(`/menu?location=${location}&category=завтраки`);
    }, 220);
  };

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-full overflow-hidden border border-[#e6e0da] bg-[#f8f5f1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: premiumEase }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,132,59,0.11),transparent_40%),radial-gradient(circle_at_80%_78%,rgba(255,150,75,0.08),transparent_35%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(23,23,23,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.07)_1px,transparent_1px)] [background-size:95px_95px]"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          width: cursor.inside ? 360 : 280,
          height: cursor.inside ? 360 : 280,
          opacity: cursor.inside ? 0.36 : 0
        }}
        transition={{ duration: 0.2, ease: premiumEase }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,114,40,0.22) 0%, rgba(255,114,40,0.08) 35%, rgba(255,114,40,0) 75%)'
        }}
      />

      {focusNode && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 border-t border-[#ff7a43]/70"
            animate={{ top: `${focusNode.y}%`, opacity: hoveredNode || selectedLocation ? 1 : 0.7 }}
            transition={{ duration: 0.22, ease: premiumEase }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-0 top-0 border-l border-[#ff7a43]/70"
            animate={{ left: `${focusNode.x}%`, opacity: hoveredNode || selectedLocation ? 1 : 0.7 }}
            transition={{ duration: 0.22, ease: premiumEase }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff6e37] bg-[#fff4ee]"
            animate={{ left: `${focusNode.x}%`, top: `${focusNode.y}%`, scale: hoveredNode ? 1.1 : 1 }}
            transition={{ duration: 0.18, ease: premiumEase }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            animate={{
              left: `${focusNode.x}%`,
              top: `${focusNode.y}%`,
              width: selectedLocation ? 250 : 190,
              height: selectedLocation ? 250 : 190,
              opacity: selectedLocation ? 0.4 : 0.26
            }}
            transition={{ duration: 0.22, ease: premiumEase }}
            style={{
              background:
                'radial-gradient(circle, rgba(255,126,51,0.24) 0%, rgba(255,126,51,0.06) 45%, rgba(255,126,51,0) 76%)'
            }}
          />
        </>
      )}

      <div className="relative z-10 flex h-full w-full flex-col px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-6 lg:px-12">
        <header className="flex items-start justify-between text-[10px] uppercase tracking-[0.34em] text-[#808080]">
          <div>
            <p className="text-[1.95rem] leading-none tracking-[0.06em] text-[#202020]">марсианин</p>
            <p className="mt-1 text-[9px] tracking-[0.36em] text-[#9c9c9c]">taste observation system</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/menu?location=${selectedLocation ?? 'o12'}&category=завтраки`)}
            className="border border-[#d8d2cb] px-3 py-2 text-[9px] tracking-[0.32em] text-[#6f6f6f] transition-colors hover:bg-[#ffffffa6]"
          >
            меню
          </button>
        </header>

        <div className="relative mt-10 flex-1 lg:mt-8">
          <div className="pointer-events-none absolute left-0 top-0 max-w-[680px] space-y-4">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#777777]">grid / navigation / input</p>
            <h1 className="text-[clamp(2.2rem,6vw,5.4rem)] font-semibold uppercase leading-[0.9] tracking-[0.02em] text-[#121212]">
              выберите
              <br />
              точку входа
            </h1>
            <p className="max-w-[480px] text-[clamp(0.95rem,1.2vw,1.2rem)] leading-relaxed text-[#666666]">
              Вкус — это наблюдение. Маршрут — это выбор. Откройте узел и продолжайте движение по системе.
            </p>
          </div>

          {nodes.map((node) => {
            const isActive = selectedLocation === node.id;
            const isFocused = focusNodeId === node.id;
            const isDimmed = Boolean(focusNodeId) && !isFocused;

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
                <div className="mb-2 text-[9px] uppercase tracking-[0.32em] text-[#8d8d8d]">{node.technical}</div>
                <div className="text-[clamp(2.8rem,5vw,4.8rem)] font-medium uppercase leading-[0.88] tracking-[0.03em] text-[#1d1d1d]">
                  {node.label}
                </div>
                <div className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-[#7a7a7a]">{node.coords}</div>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]">
                  <span className="h-2 w-2 rounded-full border border-[#ff7a44] bg-[#fff5ef]" />
                  <span className={isFocused ? 'text-[#ff6e37]' : 'text-[#777777]'}>{node.subLabel}</span>
                </div>
              </motion.button>
            );
          })}

          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[9px] uppercase tracking-[0.3em] text-[#9b9b9b]">
            <span>Y: 30</span>
            <span>Y: 20</span>
            <span>Y: 10</span>
            <span>Y: 00</span>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-between text-[9px] uppercase tracking-[0.3em] text-[#9b9b9b]">
            <span>X: 00</span>
            <span>X: 08</span>
            <span>X: 16</span>
            <span>X: 24</span>
            <span>X: 32</span>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-[#ddd7d1] pt-3 text-[9px] uppercase tracking-[0.28em] text-[#8d8d8d] sm:grid-cols-4">
          <span>system status / precision</span>
          <span>current route / {selectedLocation ?? 'none'}</span>
          <span>active nodes / O12 K10 P7</span>
          <span>date / {currentDate}</span>
        </footer>
      </div>
    </motion.section>
  );
}
