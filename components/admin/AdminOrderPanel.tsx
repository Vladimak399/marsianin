'use client';

import Link from 'next/link';
import { DragEvent, useEffect, useMemo, useState } from 'react';
import { MenuCategory, MenuItem } from '@/data/menu';

const moveArrayItem = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) return items;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
};

const getCategoryItemCount = (category: MenuCategory) => category.items.length;

export default function AdminOrderPanel() {
  const [catalog, setCatalog] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('Загрузка…');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const activeCategory = useMemo(
    () => catalog.find((category) => category.category === selectedCategory) ?? catalog[0],
    [catalog, selectedCategory]
  );

  const activeCategoryIndex = useMemo(
    () => catalog.findIndex((category) => category.category === activeCategory?.category),
    [activeCategory?.category, catalog]
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const markDirty = () => {
    setHasUnsavedChanges(true);
    setMessage('Есть несохраненные изменения');
  };

  const moveCategory = (fromIndex: number, toIndex: number) => {
    setCatalog((currentCatalog) => {
      const nextCatalog = moveArrayItem(currentCatalog, fromIndex, toIndex);
      const movedCategory = currentCatalog[fromIndex];
      if (movedCategory) setSelectedCategory(movedCategory.category);
      return nextCatalog;
    });
    markDirty();
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (activeCategoryIndex < 0) return;

    setCatalog((currentCatalog) => {
      const currentCategory = currentCatalog[activeCategoryIndex];
      if (!currentCategory) return currentCatalog;

      const nextCatalog = [...currentCatalog];
      nextCatalog[activeCategoryIndex] = {
        ...currentCategory,
        items: moveArrayItem(currentCategory.items, fromIndex, toIndex)
      };
      return nextCatalog;
    });
    markDirty();
  };

  const handleCategoryDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    setDraggedCategoryIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleCategoryDrop = (event: DragEvent<HTMLButtonElement>, targetIndex: number) => {
    event.preventDefault();
    if (draggedCategoryIndex === null) return;
    moveCategory(draggedCategoryIndex, targetIndex);
    setDraggedCategoryIndex(null);
  };

  const handleItemDragStart = (event: DragEvent<HTMLElement>, index: number) => {
    setDraggedItemIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleItemDrop = (event: DragEvent<HTMLElement>, targetIndex: number) => {
    event.preventDefault();
    if (draggedItemIndex === null) return;
    moveItem(draggedItemIndex, targetIndex);
    setDraggedItemIndex(null);
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

      const payload = (await response.json().catch(() => ({ message: 'Не удалось сохранить порядок' }))) as { catalog?: MenuCategory[]; message?: string };

      if (!response.ok || !payload.catalog) {
        throw new Error(payload.message ?? 'Не удалось сохранить порядок');
      }

      setCatalog(payload.catalog);
      setSelectedCategory(payload.catalog.find((category) => category.category === selectedCategory)?.category ?? payload.catalog[0]?.category ?? '');
      setHasUnsavedChanges(false);
      setMessage(`Порядок сохранен: ${new Date().toLocaleTimeString('ru-RU')}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить порядок');
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
            <h1 className="mt-1 text-2xl font-semibold">Порядок меню</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
              Здесь меняется только порядок отображения разделов и позиций. Названия, цены, фото и доступность не редактируются.
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
              {isSaving ? 'Сохраняем…' : 'Сохранить порядок'}
            </button>
            <Link href="/admin" className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Назад в меню
            </Link>
          </div>
        </header>

        {hasUnsavedChanges ? (
          <div className="sticky top-3 z-20 border border-[#ed6a32]/35 bg-[#fff8f1] px-4 py-3 text-sm text-[#7b3a1d] shadow-[0_10px_30px_rgba(24,21,18,0.08)]">
            Есть несохраненные изменения. Чтобы порядок обновился в гостевом меню, нажмите «Сохранить порядок».
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 border border-black/[0.08] bg-white p-4">
            <div>
              <h2 className="text-lg font-semibold">Разделы</h2>
              <p className="mt-1 text-xs leading-relaxed text-black/55">Перетащи раздел вверх или вниз. Этот порядок будет использоваться в гостевом меню.</p>
            </div>
            <div className="space-y-2">
              {catalog.map((category, index) => (
                <button
                  key={category.category}
                  type="button"
                  draggable
                  onDragStart={(event) => handleCategoryDragStart(event, index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleCategoryDrop(event, index)}
                  onDragEnd={() => setDraggedCategoryIndex(null)}
                  onClick={() => setSelectedCategory(category.category)}
                  className={`w-full cursor-grab border px-3 py-2 text-left text-sm active:cursor-grabbing ${activeCategory?.category === category.category ? 'border-[#ed6a32] text-[#ed6a32]' : 'border-black/[0.1]'} ${draggedCategoryIndex === index ? 'opacity-50' : ''}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium">{String(index + 1).padStart(2, '0')} · {category.category}</span>
                    <span className="text-xs text-black/40">↕</span>
                  </span>
                  <span className="mt-1 block text-xs text-black/45">{getCategoryItemCount(category)} поз.</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4 border border-black/[0.08] bg-white p-4">
            <div>
              <h2 className="text-lg font-semibold">Позиции: {activeCategory?.category ?? '—'}</h2>
              <p className="mt-1 text-sm text-black/55">Перетащи блюдо/напиток. Первые позиции будут первыми в разделе меню.</p>
            </div>

            <div className="space-y-2">
              {activeCategory?.items.map((item: MenuItem, index: number) => (
                <article
                  key={item.id}
                  draggable
                  onDragStart={(event) => handleItemDragStart(event, index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleItemDrop(event, index)}
                  onDragEnd={() => setDraggedItemIndex(null)}
                  className={`cursor-grab border border-black/[0.08] bg-white px-3 py-3 active:cursor-grabbing ${draggedItemIndex === index ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{String(index + 1).padStart(2, '0')} · {item.name || item.id}</p>
                      {item.subcategory ? <p className="mt-1 text-xs text-black/45">{item.subcategory}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.containsAlcohol ? <span className="border border-[#ed6a32]/35 bg-[#ed6a32]/[0.06] px-2 py-1 text-xs text-[#ed6a32]">18+</span> : null}
                      <span className="text-xs text-black/40">↕</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
