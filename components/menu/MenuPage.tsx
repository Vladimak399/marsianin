'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { MenuItem, menuData } from '@/data/menu';
import GridOverlay from '@/components/ui/GridOverlay';
import { premiumEase } from '@/lib/animations';
import CategoryNav from './CategoryNav';
import MenuDetailView from './MenuDetailView';
import MenuSection from './MenuSection';

const DEFAULT_LOCATION: LocationId = 'o12';

type MenuPageProps = {
  initialLocation?: string;
  initialCategory?: string;
};

export default function MenuPage({ initialLocation, initialCategory }: MenuPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? menuData[0].category);
  const [switchPulseKey, setSwitchPulseKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');

  useEffect(() => {
    if (!initialLocation) return;

    const normalized = initialLocation.toLowerCase();
    const isKnownLocation = locations.some((location) => location.id === normalized);

    if (isKnownLocation) {
      setSelectedLocation(normalized as LocationId);
    }
  }, [initialLocation, setSelectedLocation]);

  const categories = useMemo(() => menuData.map((section) => section.category), []);
  const activeLocation = selectedLocation ?? DEFAULT_LOCATION;
  const currentLocation = locations.find((location) => location.id === activeLocation);

  useEffect(() => {
    if (!initialCategory) return;
    if (categories.includes(initialCategory.toLowerCase())) {
      setActiveCategory(initialCategory.toLowerCase());
    }
  }, [categories, initialCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          const next = visible[0].target.getAttribute('data-category');
          if (next) setActiveCategory(next);
        }
      },
      { rootMargin: '-24% 0px -60% 0px', threshold: [0.2, 0.45, 0.7] }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-category]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeChip = document.querySelector<HTMLElement>(`[data-category-chip="${activeCategory}"]`);
    activeChip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeCategory]);

  const updateQuery = (nextLocation: LocationId, nextCategory: string) => {
    const currentSearch = typeof window === 'undefined' ? '' : window.location.search;
    const params = new URLSearchParams(currentSearch);
    params.set('location', nextLocation);
    params.set('category', nextCategory);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLocationSwitch = (location: LocationId) => {
    setSelectedLocation(location);
    setSwitchPulseKey((prev) => prev + 1);
    updateQuery(location, activeCategory);
  };

  const handleCategorySelect = (category: string) => {
    const section = document.getElementById(`section-${category}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveCategory(category);
    updateQuery(activeLocation, category);
  };

  const handleOpenDetails = (item: MenuItem, category: string) => {
    setSelectedItem(item);
    setSelectedItemCategory(category);
  };

  return (
    <main className="relative min-h-svh overflow-hidden px-3 pb-12 pt-3 sm:px-6 sm:pt-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,130,44,0.18),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(255,155,90,0.13),transparent_30%),linear-gradient(#faf8f5,#f5f4f1)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <section className="relative overflow-hidden border border-grid bg-white/90 px-4 py-5 sm:px-8 sm:py-8">
          <GridOverlay className="z-0 opacity-70" />

          <AnimatePresence>
            <motion.div
              key={switchPulseKey}
              className="pointer-events-none absolute inset-0 z-[1] bg-neutral-900"
              initial={{ opacity: 0.07 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0.07 }}
              transition={{ duration: 0.12, ease: premiumEase }}
            />
          </AnimatePresence>

          <motion.div
            className="relative z-10 flex flex-col gap-4 border-b border-grid pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: premiumEase }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {currentLocation ? (
                <motion.div
                  layoutId={`location-${currentLocation.id}`}
                  className="border border-accent bg-neutral-900 px-3 py-1.5 text-[1.4rem] font-semibold tracking-[0.02em] text-white sm:px-4 sm:py-2 sm:text-2xl"
                >
                  {currentLocation.label}
                </motion.div>
              ) : null}
              <div>
                <h1 className="text-[1.45rem] font-semibold tracking-[0.02em] text-neutral-900 sm:text-3xl">меню</h1>
                <p className="text-[11px] tracking-[0.08em] text-neutral-500">каталог блюд и напитков</p>
              </div>
            </div>
            <Link href="/" className="text-[11px] tracking-[0.08em] text-neutral-500 hover:text-accent">
              сменить точку
            </Link>
          </motion.div>

          <motion.div
            className="relative z-10 mt-4 flex gap-2 overflow-x-auto border-b border-grid pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04, ease: premiumEase }}
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
                  className="min-h-10 whitespace-nowrap border px-4 py-2 text-sm tracking-[0.06em]"
                  animate={{
                    borderColor: isActive ? '#ff6a00' : '#d4d4d4',
                    color: isActive ? '#171717' : '#737373',
                    backgroundColor: isActive ? '#fff2e8' : '#ffffff'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.16, ease: premiumEase }}
                >
                  {location.label}
                </motion.button>
              );
            })}
          </motion.div>

          <CategoryNav categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />

          <div className="relative z-10 mt-6 space-y-8 sm:mt-8 sm:space-y-10">
            {menuData.map((section) => (
              <MenuSection
                key={section.category}
                section={section}
                selectedLocation={activeLocation}
                onOpenItem={handleOpenDetails}
              />
            ))}
          </div>
        </section>
      </div>

      <MenuDetailView
        item={selectedItem}
        category={selectedItemCategory}
        selectedLocation={activeLocation}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
