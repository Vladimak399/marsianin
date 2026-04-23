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
          if (next) {
            setActiveCategory(next);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.2, 0.45, 0.7] }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-category]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveCategory(category);
    updateQuery(activeLocation, category);
  };

  const handleOpenDetails = (item: MenuItem, category: string) => {
    setSelectedItem(item);
    setSelectedItemCategory(category);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_5%,rgba(255,130,44,0.18),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(255,155,90,0.14),transparent_35%),linear-gradient(#f8f8f8,#f4f4f4)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <section className="relative overflow-hidden border border-grid bg-white/88 px-5 py-8 sm:px-8">
          <GridOverlay className="z-0" />

          <AnimatePresence>
            <motion.div
              key={switchPulseKey}
              className="pointer-events-none absolute inset-0 z-[1] bg-neutral-900"
              initial={{ opacity: 0.08 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0.08 }}
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
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2, ease: premiumEase }}
                >
                  {location.label}
                </motion.button>
              );
            })}
          </motion.div>

          <CategoryNav categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />

          <div className="relative z-10 mt-8 space-y-10">
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
