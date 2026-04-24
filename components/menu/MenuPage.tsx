'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { Coordinates } from '@/lib/geo';
import { MenuItem, menuData } from '@/data/menu';
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
  const { selectedLocation, setSelectedLocation, guestCoordinates, setGuestCoordinates, entrySource, setEntrySource } = useLocation();
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
    <main className="font-halvar relative min-h-svh overflow-x-clip bg-[#f4f1ea] text-[#0b0b0b]">
      <div className="relative mx-auto min-h-svh w-full max-w-[430px] bg-white shadow-[0_24px_80px_rgba(0,0,0,.08)] sm:border-x sm:border-black/[0.04] lg:max-w-[1180px]">
        <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 overflow-hidden bg-white lg:max-w-[1180px]">
          <div
            className="absolute inset-0 opacity-[0.085]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(237,106,50,.72) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.72) 1px, transparent 1px)',
              backgroundSize: '96px 112px'
            }}
          />
          <div className="absolute inset-5 border border-black/[0.035]" />
          <div className="absolute left-[-190px] top-[70px] h-[310px] w-[720px] -rotate-[14deg] bg-[linear-gradient(90deg,rgba(237,106,50,0),rgba(237,106,50,.28),rgba(237,106,50,.08),rgba(237,106,50,0))] opacity-20 blur-3xl" />
          <div className="absolute bottom-[-105px] right-[-210px] h-[360px] w-[650px] -rotate-[22deg] bg-[linear-gradient(90deg,rgba(237,106,50,0),rgba(237,106,50,.24),rgba(237,106,50,0))] opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 px-5 pb-10 pt-7 sm:px-7 sm:pt-9 lg:px-10">
          {entrySource === 'qr' && isEntryOverlayOpen ? (
            <div className="mb-4 border-y border-black/[0.055] bg-white/78 py-3 text-xs text-[#403e3e] backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#0b0b0b]">вход через qr: точка {currentLocation?.label ?? activeLocation}</p>
                  <p>
                    гостевые координаты:{' '}
                    {guestCoordinates ? `${guestCoordinates.lat.toFixed(5)}, ${guestCoordinates.lng.toFixed(5)}` : 'не переданы'}
                  </p>
                </div>
                <button type="button" onClick={() => setEntryOverlayOpen(false)} className="text-xs text-[#403e3e] underline">
                  скрыть
                </button>
              </div>
            </div>
          ) : null}

          <section className="relative overflow-visible">
            <motion.div
              className="relative z-10 border-b border-black/[0.055] pb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: premiumEase }}
            >
              <div className="grid grid-cols-[1fr_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
                  <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
                  <h1 className="mt-10 text-[1.45rem] font-semibold leading-none text-[#0b0b0b]">карта меню</h1>
                  <p className="mt-3 max-w-[310px] text-xs leading-relaxed text-[#403e3e]">
                    актуальные цены, состав и кбжу без лишней навигационной суеты
                  </p>
                </div>
                {currentLocation ? (
                  <div className="mt-[78px] text-right text-[58px] font-black leading-[0.86] tracking-[-0.025em] text-[#ed6a32]">
                    {currentLocation.label}
                  </div>
                ) : null}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-2">
                {currentLocation ? (
                  <a
                    href={`tel:${currentLocation.phoneTel}`}
                    className="inline-flex min-h-12 items-center justify-center border border-black/[0.065] bg-white/78 px-4 py-3 text-xs text-[#403e3e] backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32]"
                  >
                    позвонить
                  </a>
                ) : null}
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center border border-black/[0.065] bg-white/78 px-4 py-3 text-xs text-[#403e3e] backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32]"
                >
                  сменить точку
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative z-10 mt-5 grid grid-cols-3 gap-2 border-b border-black/[0.055] pb-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.04, ease: premiumEase }}
            >
              {locations.map((location, index) => {
                const isActive = activeLocation === location.id;
                return (
                  <motion.button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSwitch(location.id)}
                    className="min-h-12 whitespace-nowrap border bg-white/72 px-3 py-2 text-left text-xs backdrop-blur-sm"
                    animate={{
                      borderColor: isActive ? 'rgba(237,106,50,.82)' : 'rgba(0,0,0,.065)',
                      color: isActive ? '#ed6a32' : '#403e3e',
                      backgroundColor: 'rgba(255,255,255,.72)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: premiumEase }}
                  >
                    <span className="mars-coordinate-label mr-3 text-black/40">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-black tracking-[-0.01em]">{location.label}</span>
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

            <div className="relative z-10 mt-7 space-y-7 sm:space-y-8">
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
