'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocation } from '@/components/providers/LocationProvider';
import { LocationId, locations } from '@/data/locations';
import { Coordinates } from '@/lib/geo';
import { MenuItem } from '@/data/menu';
import { premiumEase } from '@/lib/animations';
import { useMenuCatalog } from '@/lib/useMenuCatalog';
import CoordinateSystemLayer from '@/components/CoordinateSystemLayer';
import CategoryNav from './CategoryNav';
import MenuDetailView from './MenuDetailView';
import MenuSection from './MenuSection';
import Footer from '@/components/Footer';

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
  const { catalog: menuCatalog } = useMenuCatalog();
  const { selectedLocation, setSelectedLocation, guestCoordinates, setGuestCoordinates, entrySource, setEntrySource } = useLocation();
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? '');
  const [viewerItems, setViewerItems] = useState<MenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItemCategory, setSelectedItemCategory] = useState('');
  const [categoryChangeSource, setCategoryChangeSource] = useState<CategoryChangeSource>('intersection-observer');
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const [categoryNavHeight, setCategoryNavHeight] = useState(64);
  const initialResolvedLocation = useMemo<LocationId | null>(() => {
    if (!initialLocation) return null;

    const normalized = initialLocation.toLowerCase();
    const matchedLocation = locations.find((location) => location.id === normalized);
    return matchedLocation?.id ?? null;
  }, [initialLocation]);

  useEffect(() => {
    if (!initialResolvedLocation) return;
    setSelectedLocation(initialResolvedLocation);
  }, [initialResolvedLocation, setSelectedLocation]);

  useEffect(() => {
    if (!initialGuestCoordinates) return;
    setGuestCoordinates(initialGuestCoordinates);
  }, [initialGuestCoordinates, setGuestCoordinates]);

  useEffect(() => {
    if (initialEntrySource === 'qr') setEntrySource('qr');
  }, [initialEntrySource, setEntrySource]);

  const categories = useMemo(() => menuCatalog.map((section) => section.category), [menuCatalog]);
  const activeLocation = selectedLocation ?? initialResolvedLocation ?? DEFAULT_LOCATION;
  const currentLocation = locations.find((location) => location.id === activeLocation);

  useEffect(() => {
    if (categories.length === 0) return;

    if (!activeCategory || !categories.includes(activeCategory)) {
      setActiveCategory(initialCategory && categories.includes(initialCategory) ? initialCategory : categories[0]);
    }
  }, [activeCategory, categories, initialCategory]);

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
    const section = menuCatalog.find((entry) => entry.category === category);
    const items = section?.items ?? [];
    const nextIndex = items.findIndex((entry) => entry.id === item.id);
    if (nextIndex < 0) return;

    setViewerItems(items);
    setActiveIndex(nextIndex);
    setSelectedItemCategory(category);
  };

  return (
    <main className="font-halvar relative min-h-[100dvh] overflow-x-clip bg-transparent text-[#181512]">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[430px] bg-[#fffdf8] shadow-[0_24px_70px_rgba(24,21,18,0.1)] sm:border-x sm:border-[rgba(24,21,18,0.08)] lg:max-w-[1180px]">
        <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 overflow-hidden bg-white lg:max-w-[1180px]">
          <CoordinateSystemLayer mode="menu" muted />
        </div>

        <div className="relative z-10 px-5 pb-12 pt-7 sm:px-7 sm:pt-9 lg:px-10">
          <section className="relative overflow-visible">
            <motion.div
              className="relative z-10 overflow-hidden border border-[rgba(24,21,18,0.095)] bg-[#fffdf8]/94 px-4 pb-5 pt-4 shadow-[0_8px_20px_rgba(24,21,18,0.045)] backdrop-blur-sm sm:px-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: premiumEase }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ed6a32]/42" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-[38%] bg-[#ed6a32]/34" />
              <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-[#ed6a32]/22" />

              <div className="grid grid-cols-[1fr_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] tracking-[0.14em] text-black/32">
                    <span className="mars-coordinate-label text-[#ed6a32]">активная точка</span>
                    <span className="mars-coordinate-label">система меню</span>
                  </div>
                  <Link href="/" className="inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]">
                    <div className="text-[23px] font-medium tracking-[0.12em] text-black/84">марсианин</div>
                    <div className="mt-1.5 text-[11px] tracking-[0.04em] text-black/46">кофейня, где есть жизнь</div>
                  </Link>
                  <h1 className="mt-8 text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-[#181512]">карта меню</h1>
                  <p className="mt-3 max-w-[310px] text-xs leading-relaxed text-[#504942]">
                    актуальные цены, состав и кбжу без лишней навигационной суеты
                  </p>
                </div>
                {currentLocation ? (
                  <div className="mt-[70px] text-right">
                    <p className="mars-coordinate-label mb-2 text-[8px] tracking-[0.14em] text-black/32">индекс точки</p>
                    <div className="text-[58px] font-black leading-[0.86] tracking-[-0.03em] text-[#ed6a32]">
                      {currentLocation.label}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-2">
                {currentLocation ? (
                  <a
                    href={`tel:${currentLocation.phoneTel}`}
                    className="inline-flex min-h-12 items-center justify-center border border-[rgba(24,21,18,0.105)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-xs tracking-[0.06em] text-[#504942] backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]"
                  >
                    позвонить
                  </a>
                ) : null}
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center border border-[rgba(24,21,18,0.105)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-xs tracking-[0.06em] text-[#504942] backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32]"
                >
                  сменить точку
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative z-10 mt-5 grid grid-cols-3 gap-2 border border-[rgba(24,21,18,0.095)] bg-[#fffdf8]/92 p-3 shadow-[0_6px_16px_rgba(24,21,18,0.04)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.04, ease: premiumEase }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ed6a32]/28" />
              {locations.map((location) => {
                const isActive = activeLocation === location.id;
                return (
                  <motion.button
                    key={location.id}
                    type="button"
                    onClick={() => handleLocationSwitch(location.id)}
                    className={`relative min-h-12 whitespace-nowrap border bg-white px-3 py-2 text-left text-xs tracking-[0.04em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a32] ${
                      isActive
                        ? 'border-[#ed6a32]/80 text-[#ed6a32] shadow-[0_0_0_1px_rgba(237,106,50,0.18)]'
                        : 'border-[rgba(24,21,18,0.105)] text-[#504942] hover:border-[#ed6a32]/45 hover:text-[#ed6a32]'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: premiumEase }}
                  >
                    {isActive ? <span className="pointer-events-none absolute inset-x-2 bottom-1 h-px bg-[#ed6a32]/70" /> : null}
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
              {menuCatalog.map((section, index) => (
                <MenuSection
                  key={section.category}
                  section={section}
                  selectedLocation={activeLocation}
                  onOpenItem={handleOpenDetails}
                  isFirstSection={index === 0}
                />
              ))}
            </div>

            <Footer />
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
