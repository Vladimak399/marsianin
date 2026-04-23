'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { menuData } from '@/data/menu';
import GridOverlay from '@/components/ui/GridOverlay';
import MenuCard from './MenuCard';

type MenuPageProps = {
  initialLocation?: string;
};

export default function MenuPage({ initialLocation }: MenuPageProps) {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);

  useEffect(() => {
    if (!initialLocation) return;

    const normalized = initialLocation.toLowerCase();
    const isKnownLocation = locations.some((location) => location.id === normalized);

    if (isKnownLocation) {
      setSelectedLocation(normalized as LocationId);
    }
  }, [initialLocation, setSelectedLocation]);

  const currentCategory = useMemo(
    () => menuData.find((section) => section.category === activeCategory) ?? menuData[0],
    [activeCategory]
  );

  const activeLocation = selectedLocation ?? 'o12';
  const currentLocation = locations.find((location) => location.id === activeLocation);

  return (
    <main className="relative mx-auto min-h-screen max-w-[1240px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden border border-grid bg-white px-5 py-8 sm:px-8">
        <GridOverlay className="z-0" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-grid pb-5">
          <div className="flex flex-wrap items-center gap-4">
            {currentLocation ? (
              <motion.div
                layoutId={`location-${currentLocation.id}`}
                className="border border-accent bg-neutral-900 px-4 py-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white"
              >
                {currentLocation.label}
              </motion.div>
            ) : null}
            <h1 className="text-3xl font-semibold uppercase tracking-[0.08em] text-neutral-900">меню системы</h1>
          </div>
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-accent">
            сменить точку
          </Link>
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 border-b border-grid pb-4">
          {locations.map((location) => {
            const isActive = activeLocation === location.id;
            return (
              <motion.button
                key={location.id}
                type="button"
                layout
                layoutId={`location-${location.id}-switch`}
                onClick={() => setSelectedLocation(location.id)}
                className="border px-4 py-2 text-xs uppercase tracking-[0.2em]"
                animate={{
                  borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                  color: isActive ? '#171717' : '#737373',
                  backgroundColor: isActive ? '#fff2e8' : '#ffffff'
                }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.24 }}
              >
                {location.label}
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          {menuData.map((section) => {
            const isActive = section.category === activeCategory;
            return (
              <motion.button
                key={section.category}
                type="button"
                layout
                onClick={() => setActiveCategory(section.category)}
                className="border px-4 py-2 text-xs uppercase tracking-[0.2em]"
                animate={{
                  borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                  color: isActive ? '#171717' : '#737373',
                  backgroundColor: isActive ? '#fff2e8' : '#ffffff'
                }}
                whileHover={{ y: -2 }}
              >
                {section.category}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.category}
            className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            layout
          >
            {currentCategory.items.map((item, index) => (
              <motion.div
                key={`${activeLocation}-${currentCategory.category}-${item.name}`}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, delay: index * 0.02 }}
              >
                <MenuCard item={item} selectedLocation={activeLocation} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
