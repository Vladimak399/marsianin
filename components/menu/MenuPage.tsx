'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { menuData } from '@/data/menu';
import GridOverlay from '@/components/ui/GridOverlay';
import { premiumEase } from '@/lib/animations';
import MenuCard from './MenuCard';

type MenuPageProps = {
  initialLocation?: string;
};

export default function MenuPage({ initialLocation }: MenuPageProps) {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);
  const [switchPulseKey, setSwitchPulseKey] = useState(0);

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

  const handleLocationSwitch = (location: LocationId) => {
    setSelectedLocation(location);
    setSwitchPulseKey((prev) => prev + 1);
  };

  return (
    <main className="relative mx-auto min-h-screen max-w-[1240px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden border border-grid bg-white px-5 py-8 sm:px-8">
        <GridOverlay className="z-0" />

        <AnimatePresence>
          <motion.div
            key={switchPulseKey}
            className="pointer-events-none absolute inset-0 z-[1] bg-neutral-900"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0.1 }}
            transition={{ duration: 0.15, ease: premiumEase }}
          />
        </AnimatePresence>

        <motion.div
          className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-grid pb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: premiumEase }}
        >
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
        </motion.div>

        <motion.div
          className="relative z-10 mt-6 flex flex-wrap items-center gap-2 border-b border-grid pb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.08, ease: premiumEase }}
        >
          {locations.map((location) => {
            const isActive = activeLocation === location.id;
            return (
              <motion.button
                key={location.id}
                type="button"
                layout
                layoutId={`location-${location.id}-switch`}
                onClick={() => handleLocationSwitch(location.id)}
                className="border px-4 py-2 text-xs uppercase tracking-[0.2em]"
                animate={{
                  borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                  color: isActive ? '#171717' : '#737373',
                  backgroundColor: isActive ? '#fff2e8' : '#ffffff'
                }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: premiumEase }}
              >
                {location.label}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          className="relative z-10 mt-6 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.14, ease: premiumEase }}
        >
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
                transition={{ duration: 0.2, ease: premiumEase }}
              >
                {section.category}
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.category}
            className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.2 }
              }
            }}
            transition={{ duration: 0.24, ease: premiumEase }}
            layout
          >
            {currentCategory.items.map((item) => (
              <motion.div
                key={`${activeLocation}-${currentCategory.category}-${item.name}`}
                layout
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.2, ease: premiumEase }}
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
