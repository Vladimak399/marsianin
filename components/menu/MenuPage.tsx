'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { Coordinates } from '@/lib/geo';
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
  initialEntrySource?: string;
  initialGuestCoordinates?: Coordinates | null;
};

type CategoryChangeSource = 'intersection-observer' | 'chip-click';

export default function MenuPage({
  initialLocation,
  initialCategory,
  initialEntrySource,
  initialGuestCoordinates
}: MenuPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    selectedLocation,
    setSelectedLocation,
    guestCoordinates,
    setGuestCoordinates,
    entrySource,
    setEntrySource
  } = useLocation();
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? menuData[0].category);
  const [viewerItems, setViewerItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');
  const [categoryChangeSource, setCategoryChangeSource] = useState<CategoryChangeSource>('intersection-observer');
  const [isEntryOverlayOpen, setEntryOverlayOpen] = useState(true);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const [categoryNavHeight, setCategoryNavHeight] = useState(64);

  useEffect(() => {
    if (!initialLocation) return;

    const normalized = initialLocation.toLowerCase();
    const isKnownLocation = locations.some((location) => location.id === normalized);
    if (isKnownLocation) setSelectedLocation(normalized as LocationId);
  }, [initialLocation, setSelectedLocation]);

  useEffect(() => {
    if (!initialGuestCoordinates) return;
    setGuestCoordinates(initialGuestCoordinates);
  }, [initialGuestCoordinates, setGuestCoordinates]);

  useEffect(() => {
    if (initialEntrySource === 'qr') setEntrySource('qr');
  }, [initialEntrySource, setEntrySource]);

  const categories = useMemo(() => menuData.map((section) => section.category), []);
  const activeLocation = selectedLocation ?? DEFAULT_LOCATION;
  const currentLocation = locations.find((location) => location.id === activeLocation);

  useEffect(() => {
    if (!initialCategory) return;
    const normalized = initialCategory.toLowerCase();
    if (categories.includes(normalized)) setActiveCategory(normalized);
  }, [categories, initialCategory]);

  useEffect(() => {
    const navElement = categoryNavRef.current;
    if (!navElement) return;

    const updateNavHeight = () => setCategoryNavHeight(Math.round(navElement.getBoundingClientRect().height));
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

        const next = visible[0]?.target.getAttribute('data-category');
        if (next) {
          setCategoryChangeSource('intersection-observer');
          setActiveCategory(next);
        }
      },
      {
        rootMargin: `-${categoryNavHeight + 18}px 0px -55% 0px`,
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

    if (categoryChangeSource === 'chip-click') setCategoryChangeSource('intersection-observer');
  }, [activeCategory, categoryChangeSource]);

  const updateQuery = (nextCategory: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('category', nextCategory);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLocationSwitch = (location: LocationId) => {
    setSelectedLocation(location);
    router.replace(`/menu/${location}?category=${activeCategory}`, { scroll: false });
  };

  const handleCategorySelect = (category: string) => {
    const section = document.getElementById(`section-${category}`);
    setCategoryChangeSource('chip-click');

    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offsetTop = sectionTop - categoryNavHeight - 18;
      window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
    }

    setActiveCategory(category);
    updateQuery(category);
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,130,44,0.14),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(255,155,90,0.09),transparent_28%),linear-gradient(#faf8f5,#f5f4f1)]" />
      <div className="relative mx-auto max-w-[1240px]">
        {entrySource === 'qr' && isEntryOverlayOpen ? (
          <div className="mb-3 border border-[#f0b08a] bg-[#fff4eb] p-3 text-xs text-[#91401a] sm:mb-4 sm:text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Вход через QR: точка {currentLocation?.label ?? activeLocation}</p>
                <p>гостевые координаты: {guestCoordinates ? `${guestCoordinates.lat.toFixed(5)}, ${guestCoordinates.lng.toFixed(5)}` : 'не переданы'}</p>
              </div>
              <button type="button" onClick={() => setEntryOverlayOpen(false)} className="text-xs text-[#91401a] underline">
                скрыть
              </button>
            </div>
          </div>
        ) : null}

        <section className="relative overflow-visible border border-grid bg-white/90 px-4 py-5 sm:px-8 sm:py-8">
          <GridOverlay className="z-0 opacity-60" />

          <motion.div
            className="relative z-10 flex flex-col gap-4 border-b border-grid pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: premiumEase }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {currentLocation ? (
                <div className="border border-[#f0b08a] bg-[#fff4eb] px-3 py-1.5 text-[1.55rem] font-semibold text-[#db6123] sm:px-4 sm:py-2 sm:text-2xl">
                  {currentLocation.label}
                </div>
              ) : null}
              <div>
                <h1 className="text-[1.45rem] font-semibold text-neutral-900 sm:text-3xl">меню</h1>
                <p className="text-xs text-neutral-500">актуальные цены и состав</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentLocation ? (
                <a
                  href={`tel:${currentLocation.phoneTel}`}
                  className="inline-flex min-h-10 items-center justify-center border border-[#f0a16f] bg-[#ffe3cf] px-3 py-2 text-xs text-[#a55226] transition-colors hover:bg-[#ffd6b8]"
                >
                  позвонить
                </a>
              ) : null}
              <Link href="/" className="inline-flex min-h-10 items-center text-xs text-neutral-500 hover:text-accent">
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
                  onClick={() => handleLocationSwitch(location.id)}
                  className="min-h-10 whitespace-nowrap border px-4 py-2 text-xs"
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
            {menuData.map((section, index) => (
              <MenuSection
                key={section.category}
                section={section}
                selectedLocation={activeLocation}
                onOpenItem={handleOpenDetails}
                isFirstSection={index === 0}
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
