'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@/data/menu';
import { locations } from '@/data/locations';
import { useMenuCatalog } from '@/lib/useMenuCatalog';

const createDraftItem = (): MenuItem => ({
  id: `item-${Date.now()}`,
  name: '',
  description: '',
  image: '/images/mock/breakfast-card.svg',
  priceByLocation: {
    o12: 0,
    k10: 0,
    p7: 0
  },
  nutrition: {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  }
});

export default function AdminPanel() {
  const { catalog, updateCatalog, restoreCatalog } = useMenuCatalog();
  const [selectedCategory, setSelectedCategory] = useState(catalog[0]?.category ?? '');
  const [draftItem, setDraftItem] = useState<MenuItem>(createDraftItem());
  const [newCategoryName, setNewCategoryName] = useState('');

  const activeCategory = useMemo(
    () => catalog.find((category) => category.category === selectedCategory) ?? catalog[0],
    [catalog, selectedCategory]
  );

  useEffect(() => {
    if (!activeCategory) return;
    if (selectedCategory !== activeCategory.category) setSelectedCategory(activeCategory.category);
  }, [activeCategory, selectedCategory]);

  const handleAddCategory = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = newCategoryName.trim().toLowerCase();
    if (!trimmed) return;
    if (catalog.some((entry) => entry.category === trimmed)) return;

    const nextCatalog = [...catalog, { category: trimmed, items: [] }];
    updateCatalog(nextCatalog);
    setSelectedCategory(trimmed);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (category: string) => {
    if (!confirm(`Удалить категорию «${category}»?`)) return;

    const nextCatalog = catalog.filter((entry) => entry.category !== category);
    updateCatalog(nextCatalog.length > 0 ? nextCatalog : catalog);
    if (selectedCategory === category && nextCatalog[0]) setSelectedCategory(nextCatalog[0].category);
  };

  const handleAddItem = (event: FormEvent) => {
    event.preventDefault();
    if (!activeCategory) return;

    const nextCatalog = catalog.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: [
          ...entry.items,
          {
            ...draftItem,
            id: `${activeCategory.category}-${Date.now()}`,
            name: draftItem.name.trim() || `новая позиция ${entry.items.length + 1}`,
            description: draftItem.description.trim() || 'описание обновляется'
          }
        ]
      };
    });

    updateCatalog(nextCatalog);
    setDraftItem(createDraftItem());
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeCategory) return;

    const nextCatalog = catalog.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.filter((item) => item.id !== itemId)
      };
    });

    updateCatalog(nextCatalog);
  };

  const handleUpdateItemField = (itemId: string, field: keyof MenuItem, value: string) => {
    if (!activeCategory) return;

    const nextCatalog = catalog.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
      };
    });

    updateCatalog(nextCatalog);
  };

  return (
    <main className="min-h-svh bg-[#f4f1ea] px-4 py-8 text-[#0b0b0b] sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border border-black/[0.08] bg-white p-4">
          <div>
            <h1 className="text-2xl font-semibold">Админ-кабинет меню</h1>
            <p className="text-sm text-black/60">Изменения сохраняются локально и не конфликтуют с публичным контентом.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/menu" className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Открыть меню
            </Link>
            <button type="button" onClick={restoreCatalog} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Сбросить изменения
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 border border-black/[0.08] bg-white p-4">
            <h2 className="text-lg font-semibold">Категории</h2>
            <div className="space-y-2">
              {catalog.map((entry) => (
                <div key={entry.category} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(entry.category)}
                    className={`flex-1 border px-3 py-2 text-left text-sm ${
                      activeCategory?.category === entry.category ? 'border-[#ed6a32] text-[#ed6a32]' : 'border-black/[0.1]'
                    }`}
                  >
                    {entry.category}
                  </button>
                  <button type="button" onClick={() => handleRemoveCategory(entry.category)} className="border border-black/[0.1] px-2 text-sm">
                    ×
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="space-y-2">
              <input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                className="w-full border border-black/[0.1] px-3 py-2 text-sm"
                placeholder="новая категория"
              />
              <button type="submit" className="w-full border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                Добавить категорию
              </button>
            </form>
          </aside>

          <section className="space-y-4 border border-black/[0.08] bg-white p-4">
            <h2 className="text-lg font-semibold">Позиции: {activeCategory?.category ?? '—'}</h2>

            <div className="space-y-3">
              {activeCategory?.items.map((item) => (
                <article key={item.id} className="space-y-3 border border-black/[0.08] p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      value={item.name}
                      onChange={(event) => handleUpdateItemField(item.id, 'name', event.target.value)}
                      className="border border-black/[0.1] px-3 py-2 text-sm"
                      placeholder="Название"
                    />
                    <input
                      value={item.image}
                      onChange={(event) => handleUpdateItemField(item.id, 'image', event.target.value)}
                      className="border border-black/[0.1] px-3 py-2 text-sm"
                      placeholder="Путь к изображению"
                    />
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(event) => handleUpdateItemField(item.id, 'description', event.target.value)}
                    className="min-h-20 w-full border border-black/[0.1] px-3 py-2 text-sm"
                    placeholder="Описание"
                  />

                  <div className="grid gap-2 md:grid-cols-3">
                    {locations.map((location) => (
                      <label key={location.id} className="flex items-center gap-2 border border-black/[0.08] px-2 py-1 text-sm">
                        <span>{location.label}</span>
                        <input
                          type="number"
                          value={item.priceByLocation[location.id]}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            const nextCatalog = catalog.map((entry) => {
                              if (entry.category !== activeCategory?.category) return entry;
                              return {
                                ...entry,
                                items: entry.items.map((entryItem) =>
                                  entryItem.id === item.id
                                    ? { ...entryItem, priceByLocation: { ...entryItem.priceByLocation, [location.id]: Number.isFinite(value) ? value : 0 } }
                                    : entryItem
                                )
                              };
                            });

                            updateCatalog(nextCatalog);
                          }}
                          className="w-full border border-black/[0.1] px-2 py-1"
                        />
                      </label>
                    ))}
                  </div>

                  <button type="button" onClick={() => handleRemoveItem(item.id)} className="border border-black/[0.1] px-3 py-2 text-sm">
                    Удалить позицию
                  </button>
                </article>
              ))}
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 border border-dashed border-black/[0.2] p-3">
              <h3 className="font-medium">Добавить новую позицию</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  value={draftItem.name}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, name: event.target.value }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="Название"
                />
                <input
                  value={draftItem.image}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, image: event.target.value }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="Путь к изображению"
                />
              </div>
              <textarea
                value={draftItem.description}
                onChange={(event) => setDraftItem((prev) => ({ ...prev, description: event.target.value }))}
                className="min-h-20 w-full border border-black/[0.1] px-3 py-2 text-sm"
                placeholder="Описание"
              />
              <button type="submit" className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                Добавить позицию
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
