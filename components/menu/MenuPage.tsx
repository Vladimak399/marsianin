'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { MenuItem, menuData } from '@/data/menu';
import GridOverlay from '@/components/ui/GridOverlay';
import { premiumEase } from '@/lib/animations';
import CategoryNav from './CategoryNav';
import MenuDetailView from './MenuDetailView';
import MenuSection from './MenuSection';
import NodeEntryOverlay from './NodeEntryOverlay';

const DEFAULT_LOCATION: LocationId = 'o12';

type MenuPageProps = {
  initialLocation?: string;
  initialCategory?: string;
};

type CategoryChangeSource = 'intersection-observer' | 'chip-click';
const INTRO_SEEN_KEY = 'marsianin-node-intro-seen';

export default function MenuPage({ initialLocation, initialCategory }: MenuPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedLocation, setSelectedLocation, guestCoordinates } = useLocation();
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? menuData[0].category);
  const [switchPulseKey, setSwitchPulseKey] = useState(0);
  const [viewerItems, setViewerItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');
  const [categoryChangeSource, setCategoryChangeSource] = useState<CategoryChangeSource>('intersection-observer');
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const [categoryNavHeight, setCategoryNavHeight] = useState(64);
  const [entryOverlayMode, setEntryOverlayMode] = useState<'full' | 'short' | null>(null);

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
    if (!pathname?.startsWith('/menu/') || !currentLocation) return;
    const seenBefore = window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    setEntryOverlayMode(seenBefore ? 'short' : 'full');
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  }, [pathname, currentLocation]);

  useEffect(() => {
    if (!initialCategory) return;
    if (categories.includes(initialCategory.toLowerCase())) {
      setActiveCategory(initialCategory.toLowerCase());
    }
  }, [categories, initialCategory]);

  useEffect(() => {
    const navElement = categoryNavRef.current;
    if (!navElement) return;

    const updateNavHeight = () => {
      setCategoryNavHeight(Math.round(navElement.getBoundingClientRect().height));
    };

    updateNavHeight();

    const resizeObserver = new ResizeObserver(updateNavHeight);
    resizeObserver.observe(navElement);
    window.addEventListener('resize', updateNavHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          const next = visible[0].target.getAttribute('data-category');
          if (next) {
            setCategoryChangeSource('intersection-observer');
            setActiveCategory(next);
          }
        }
      },
      {
        rootMargin: `-${categoryNavHeight + 28}px 0px -55% 0px`,
        threshold: [0.15, 0.35, 0.6]
      }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-category]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [categoryNavHeight]);

  useEffect(() => {
    const container = chipsContainerRef.current;
    if (!container) return;

    const activeChip = container.querySelector<HTMLElement>(`[data-category-chip="${activeCategory}"]`);
    if (!activeChip) return;

    const behavior: ScrollBehavior = categoryChangeSource === 'chip-click' ? 'smooth' : 'auto';
    const targetLeft = activeChip.offsetLeft + activeChip.offsetWidth / 2 - container.clientWidth / 2;
    const maxLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
    const left = Math.min(Math.max(targetLeft, 0), maxLeft);

    container.scrollTo({ left, behavior });
    if (categoryChangeSource === 'chip-click') {
      setCategoryChangeSource('intersection-observer');
    }
  }, [activeCategory, categoryChangeSource]);

  const updateQuery = (nextLocation: LocationId, nextCategory: string) => {
    const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
    params.set('category', nextCategory);
    router.replace(`/menu/${nextLocation}?${params.toString()}`, { scroll: false });
  };

  const handleLocationSwitch = (location: LocationId) => {
    if (location !== activeLocation) {
      setEntryOverlayMode('short');
    }
    setSelectedLocation(location);
    setSwitchPulseKey((prev) => prev + 1);
    updateQuery(location, activeCategory);
  };

  const handleCategorySelect = (category: string) => {
    const section = document.getElementById(`section-${category}`);
    setCategoryChangeSource('chip-click');
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offsetTop = sectionTop - categoryNavHeight - 24;
      window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
    }
    setActiveCategory(category);
    updateQuery(activeLocation, category);
  };

  const handleOpenDetails = (item: MenuItem, category: string) => {
    const section = menuData.find((entry) => entry.category === category);
    const items = section?.items ?? [];
    const nextIndex = items.findIndex((entry) => entry.id === item.id);

    if (nextIndex < 0) return;

    setViewerItems(items);
    setActiveIndex(nextIndex);
    setSelectedItemCategory(category);
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden px-3 pb-12 pt-3 sm:px-6 sm:pt-6 lg:px-8">
      <AnimatePresence>
        {entryOverlayMode && currentLocation ? (
          <NodeEntryOverlay
            mode={entryOverlayMode}
            nodeCode={currentLocation.nodeCode}
            address={currentLocation.address}
            lat={currentLocation.lat}
            lng={currentLocation.lng}
            guestCoordinates={guestCoordinates}
            onDone={() => setEntryOverlayMode(null)}
          />
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,130,44,0.18),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(255,155,90,0.13),transparent_30%),linear-gradient(#faf8f5,#f5f4f1)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <section className="relative overflow-visible border border-grid bg-white/90 px-4 py-5 sm:px-8 sm:py-8">
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
                  className="border border-accent bg-neutral-900 px-3 py-1.5 text-[1.55rem] font-semibold tracking-[0.04em] text-white sm:px-4 sm:py-2 sm:text-2xl"
                >
                  {currentLocation.label}
                </motion.div>
              ) : null}
              <div>
                <h1 className="text-[1.45rem] font-semibold tracking-[0.02em] text-neutral-900 sm:text-3xl">меню</h1>
                <p className="text-[10px] tracking-[0.14em] text-neutral-500">активная точка · каталог по точкам</p>
                {currentLocation ? (
                  <p className="mt-1 text-[10px] tracking-[0.11em] text-neutral-500">
                    {currentLocation.address} · {currentLocation.lat.toFixed(4)} N / {currentLocation.lng.toFixed(4)} E
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentLocation ? (
                <a
                  href={`tel:${currentLocation.phoneTel}`}
                  className="inline-flex min-h-10 items-center justify-center border border-[#f0a16f] bg-[#ffe3cf] px-3 py-2 font-sans text-[11px] tracking-[0.12em] text-[#a55226] transition-colors hover:bg-[#ffd6b8]"
                >
                  позвонить
                </a>
              ) : null}
              <Link href="/" className="inline-flex min-h-10 items-center text-[11px] tracking-[0.14em] text-neutral-500 hover:text-accent">
                сменить точку
              </Link>
            </div>
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
                  className="min-h-10 whitespace-nowrap border px-4 py-2 text-xs tracking-[0.12em]"
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

          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelect={handleCategorySelect}
            navRef={categoryNavRef}
            chipsContainerRef={chipsContainerRef}
          />

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
        item={viewerItems[activeIndex] ?? null}
        items={viewerItems}
        activeIndex={activeIndex}
        category={selectedItemCategory}
        selectedLocation={activeLocation}
        onChangeIndex={setActiveIndex}
        onClose={() => {
          setViewerItems([]);
          setActiveIndex(0);
        }}
      />
    </main>
  );
}
