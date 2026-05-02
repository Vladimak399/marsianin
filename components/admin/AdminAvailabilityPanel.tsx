'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LocationId, locations } from '@/data/locations';
import { MenuCategory, MenuItem } from '@/data/menu';

const createDefaultAvailability = (): Record<LocationId, boolean> => {
  return locations.reduce(
    (acc, location) => {
      acc[location.id] = true;
      return acc;
    },
    {} as Record<LocationId, boolean>
  );
};

const normalizeAvailability = (item: MenuItem): Record<LocationId, boolean> => {
  const source = item.availableByLocation ?? createDefaultAvailability();
  return locations.reduce(
    (acc, location) => {
      acc[location.id] = source[location.id] !== false;
      return acc;
    },
    {} as Record<LocationId, boolean>
  );
};

const getItemAvailabilityLabel = (item: MenuItem) => {
  const availability = normalizeAvailability(item);
  const activeLocations = locations.filter((location) => availability[location.id]);

  if (activeLocations.length === locations.length) return 'все точки';
  if (activeLocations.length === 0) return 'скрыто везде';
  return activeLocations.map((location) => location.label).join(' / ');
};

export default function AdminAvailabilityPanel() {
  const [catalog, setCatalog] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('Загрузка…');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const activeCategory = useMemo(
    () => catalog.find((category) => category.category === selectedCategory) ?? catalog[0],
    [catalog, selectedCategory]
  );

  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoading(true);
      setMessage('Загрузка…');

      try {
        const response = await fetch('/api/admin/menu', { credentials: 'include' });

        if (response.status === 401) {
          setMessage('Сессия администратора истекла. Вернитесь в админку и войдите заново.');
          return;
        }

        if (!response.ok) throw new Error('Не удалось загрузить меню');

        const payload = (await response.json()) as { catalog?: MenuCategory[] };
        const nextCatalog = Array.isArray(payload.catalog) ? payload.catalog : [];
        setCatalog(nextCatalog);
        setSelectedCategory(nextCatalog[0]?.category ?? '');
        setHasUnsavedChanges(false);
        setMessage(`Загружено: ${nextCatalog.length} категорий`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Не удалось загрузить меню');
      } finally {
        setIsLoading(false);
      }
    };

    void loadCatalog();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    if (selectedCategory !== activeCategory.category) setSelectedCategory(activeCategory.category);
  }, [activeCategory, selectedCategory]);

  const updateItem = (itemId: string, updater: (item: MenuItem) => MenuItem) => {
    if (!activeCategory) return;

    const nextCatalog = catalog.map((category) => {
      if (category.category !== activeCategory.category) return category;
      return {
        ...category,
        items: category.items.map((item) => (item.id === itemId ? updater(item) : item))
      };
    });

    setCatalog(nextCatalog);
    setHasUnsavedChanges(true);
    setMessage('Есть несохраненные изменения');
  };

  const updateLocationAvailability = (item: MenuItem, locationId: LocationId, enabled: boolean) => {
    const currentAvailability = normalizeAvailability(item);
    const nextAvailability = { ...currentAvailability, [locationId]: enabled };

    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      availableByLocation: nextAvailability
    }));
  };

  const updateAlcoholFlag = (item: MenuItem, enabled: boolean) => {
    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      containsAlcohol: enabled
    }));
  };

  const applyPreset = (item: MenuItem, preset: 'all' | 'o12' | 'none') => {
    const nextAvailability = locations.reduce(
      (acc, location) => {
        acc[location.id] = preset === 'all' ? true : preset === 'o12' ? location.id === 'o12' : false;
        return acc;
      },
      {} as Record<LocationId, boolean>
    );

    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      availableByLocation: nextAvailability,
      containsAlcohol: preset === 'o12' ? currentItem.containsAlcohol : currentItem.containsAlcohol
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Сохраняем…');

    try {
      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ catalog })
      });

      if (response.status === 401) {
        setMessage('Сессия администратора истекла. Вернитесь в админку и войдите заново.');
        return;
      }

      const payload = (await response.json().catch(() => ({ message: 'Не удалось сохранить' }))) as { catalog?: MenuCategory[]; message?: string };

      if (!response.ok || !payload.catalog) {
        throw new Error(payload.message ?? 'Не удалось сохранить');
      }

      setCatalog(payload.catalog);
      setHasUnsavedChanges(false);
      setMessage(`Сохранено: ${new Date().toLocaleTimeString('ru-RU')}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-svh bg-[#f4f1ea] px-4 py-8 text-[#0b0b0b] sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border border-black/[0.08] bg-white p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#ed6a32]">админ-кабинет</p>
            <h1 className="mt-1 text-2xl font-semibold">Доступность меню по точкам</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
              Здесь управляются только точки доступности и отметка алкоголя. Цены, названия, описания и фото редактируются в основном редакторе меню.
            </p>
            {message ? <p className="mt-2 text-xs text-[#ed6a32]">{message}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!hasUnsavedChanges || isSaving || isLoading}
              className="border border-[#ed6a32]/45 px-3 py-2 text-sm text-[#ed6a32] enabled:hover:bg-[#ed6a32]/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Сохраняем…' : 'Сохранить доступность'}
            </button>
            <Link href="/admin" className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Назад в меню
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 border border-black/[0.08] bg-white p-4">
            <h2 className="text-lg font-semibold">Категории</h2>
            <div className="space-y-2">
              {catalog.map((category) => (
                <button
                  key={category.category}
                  type="button"
                  onClick={() => setSelectedCategory(category.category)}
                  className={`w-full border px-3 py-2 text-left text-sm ${activeCategory?.category === category.category ? 'border-[#ed6a32] text-[#ed6a32]' : 'border-black/[0.1]'}`}
                >
                  <span className="block">{category.category}</span>
                  <span className="text-xs text-black/45">{category.items.length} поз.</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4 border border-black/[0.08] bg-white p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{activeCategory?.category ?? '—'}</h2>
                <p className="mt-1 text-sm text-black/55">Отключенная позиция не показывается гостю на выбранной точке. Если все позиции категории отключены, категория тоже скрывается.</p>
              </div>
            </div>

            <div className="space-y-3">
              {activeCategory?.items.map((item) => {
                const availability = normalizeAvailability(item);
                return (
                  <article key={item.id} className="space-y-3 border border-black/[0.08] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{item.name || item.id}</h3>
                        <p className="mt-1 text-xs text-black/45">{getItemAvailabilityLabel(item)}</p>
                      </div>
                      {item.containsAlcohol ? <span className="border border-[#ed6a32]/35 bg-[#ed6a32]/[0.06] px-2 py-1 text-xs text-[#ed6a32]">18+ алкоголь</span> : null}
                    </div>

                    <div className="grid gap-2 md:grid-cols-3">
                      {locations.map((location) => (
                        <label key={location.id} className="flex items-center gap-2 border border-black/[0.08] bg-white px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={availability[location.id]}
                            onChange={(event) => updateLocationAvailability(item, location.id, event.target.checked)}
                          />
                          доступно на {location.label}
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-black/[0.06] pt-3">
                      <label className="flex items-center gap-2 border border-[#ed6a32]/25 bg-[#ed6a32]/[0.035] px-3 py-2 text-sm text-[#181512]">
                        <input type="checkbox" checked={item.containsAlcohol === true} onChange={(event) => updateAlcoholFlag(item, event.target.checked)} />
                        содержит алкоголь / 18+
                      </label>
                      <button type="button" onClick={() => applyPreset(item, 'all')} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                        Все точки
                      </button>
                      <button type="button" onClick={() => applyPreset(item, 'o12')} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                        Только O12
                      </button>
                      <button type="button" onClick={() => applyPreset(item, 'none')} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                        Скрыть везде
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
