'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MenuItem } from '@/data/menu';
import { locations } from '@/data/locations';
import { useMenuCatalog } from '@/lib/useMenuCatalog';

const ADMIN_SESSION_KEY = 'marsianin:admin:session';
const DEFAULT_MENU_LOCATION = 'o12';

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
  const { catalog, updateCatalog, restoreCatalog, applyCatalog } = useMenuCatalog({ admin: true });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(catalog[0]?.category ?? '');
  const [draftItem, setDraftItem] = useState<MenuItem>(createDraftItem());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const draftImageInputRef = useRef<HTMLInputElement>(null);

  const activeCategory = useMemo(
    () => catalog.find((category) => category.category === selectedCategory) ?? catalog[0],
    [catalog, selectedCategory]
  );

  useEffect(() => {
    if (!activeCategory) return;
    if (selectedCategory !== activeCategory.category) setSelectedCategory(activeCategory.category);
  }, [activeCategory, selectedCategory]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsAuthorized(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'ok');
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    const handler = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges, isAuthorized]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login, password })
      });

      if (response.ok) {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'ok');
        setIsAuthorized(true);
        setAuthError('');
        setSaveMessage('');
        return;
      }

      const payload = (await response.json().catch(() => ({ message: 'Ошибка входа' }))) as { message: string };
      setAuthError(payload.message);
    } catch {
      setAuthError('Не удалось подключиться к админке. Проверьте соединение и настройки Vercel.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthorized(false);
    setPassword('');
  };

  const markDirty = () => {
    setHasUnsavedChanges(true);
    setSaveMessage('Есть несохраненные изменения');
  };

  const applyCatalogLocally = (nextCatalog: typeof catalog) => {
    applyCatalog(nextCatalog);
    markDirty();
  };

  const handleSaveChanges = async () => {
    await updateCatalog(catalog);
    setHasUnsavedChanges(false);
    setSaveMessage(`Сохранено: ${new Date().toLocaleTimeString('ru-RU')}`);
  };

  const handleUploadImage = async (file: File, itemId?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const payload = (await response.json().catch(() => ({ message: 'Не удалось загрузить файл' }))) as { url?: string; message?: string };
    if (!response.ok || !payload.url) {
      setSaveMessage(payload.message ?? 'Ошибка загрузки файла');
      return;
    }

    if (!itemId) {
      setDraftItem((prev) => ({ ...prev, image: payload.url ?? prev.image }));
      return;
    }

    if (!activeCategory) return;
    const nextCatalog = catalog.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.map((item) => (item.id === itemId ? { ...item, image: payload.url ?? item.image } : item))
      };
    });

    applyCatalogLocally(nextCatalog);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await handleUploadImage(file, itemId);
  };

  const updateItem = (itemId: string, updater: (item: MenuItem) => MenuItem) => {
    if (!activeCategory) return;

    const nextCatalog = catalog.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.map((item) => (item.id === itemId ? updater(item) : item))
      };
    });

    applyCatalogLocally(nextCatalog);
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-svh bg-[#f4f1ea] px-4 py-10 text-[#0b0b0b] sm:px-6">
        <div className="mx-auto w-full max-w-md border border-black/[0.08] bg-white p-5">
          <h1 className="text-2xl font-semibold">Вход в админ-кабинет</h1>
          <p className="mt-2 text-sm text-black/60">Введите логин и пароль администратора.</p>

          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              className="w-full border border-black/[0.1] px-3 py-2 text-sm"
              placeholder="Логин"
              autoComplete="username"
              disabled={isLoggingIn}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-black/[0.1] px-3 py-2 text-sm"
              placeholder="Пароль"
              autoComplete="current-password"
              disabled={isLoggingIn}
              required
            />
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-progress disabled:opacity-60"
            >
              {isLoggingIn ? 'Входим…' : 'Войти'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const handleAddCategory = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = newCategoryName.trim().toLowerCase();
    if (!trimmed) return;
    if (catalog.some((entry) => entry.category === trimmed)) return;

    const nextCatalog = [...catalog, { category: trimmed, items: [] }];
    applyCatalogLocally(nextCatalog);
    setSelectedCategory(trimmed);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (category: string) => {
    if (!confirm(`Удалить категорию «${category}»?`)) return;

    const nextCatalog = catalog.filter((entry) => entry.category !== category);
    const normalizedCatalog = nextCatalog.length > 0 ? nextCatalog : catalog;
    applyCatalogLocally(normalizedCatalog);
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
            id: `${activeCategory.category}-${Date.now()}`
          }
        ]
      };
    });

    applyCatalogLocally(nextCatalog);
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

    applyCatalogLocally(nextCatalog);
  };

  return (
    <main className="min-h-svh bg-[#f4f1ea] px-4 py-8 text-[#0b0b0b] sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border border-black/[0.08] bg-white p-4">
          <div>
            <h1 className="text-2xl font-semibold">Админ-кабинет меню</h1>
            <p className="text-sm text-black/60">Изменения сохраняются на сервере после нажатия «Сохранить».</p>
            {saveMessage ? <p className="text-xs text-[#ed6a32]">{saveMessage}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleSaveChanges()}
              disabled={!hasUnsavedChanges}
              className="border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Сохранить
            </button>
            <Link href={`/menu/${DEFAULT_MENU_LOCATION}`} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Открыть меню
            </Link>
            <button type="button" onClick={handleLogout} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Выйти
            </button>
            <button
              type="button"
              onClick={() => {
                void restoreCatalog();
                setHasUnsavedChanges(false);
                setSaveMessage('Каталог сброшен до исходного состояния');
              }}
              className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]"
            >
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
                      onChange={(event) => updateItem(item.id, (entryItem) => ({ ...entryItem, name: event.target.value }))}
                      className="border border-black/[0.1] px-3 py-2 text-sm"
                      placeholder="Название"
                    />
                    <div className="flex gap-2">
                      <input value={item.image} readOnly className="w-full border border-black/[0.1] px-3 py-2 text-sm" placeholder="Изображение" />
                      <label className="cursor-pointer border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                        +
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={(event) => void handleFileChange(event, item.id)} />
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(event) => updateItem(item.id, (entryItem) => ({ ...entryItem, description: event.target.value }))}
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
                            updateItem(item.id, (entryItem) => ({
                              ...entryItem,
                              priceByLocation: {
                                ...entryItem.priceByLocation,
                                [location.id]: Number.isFinite(value) ? value : 0
                              }
                            }));
                          }}
                          className="w-full border border-black/[0.1] px-2 py-1"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-2 md:grid-cols-4">
                    <label className="text-sm">
                      ккал
                      <input
                        type="number"
                        value={item.nutrition.calories}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          updateItem(item.id, (entryItem) => ({
                            ...entryItem,
                            nutrition: { ...entryItem.nutrition, calories: Number.isFinite(value) ? value : 0 }
                          }));
                        }}
                        className="mt-1 w-full border border-black/[0.1] px-2 py-1"
                      />
                    </label>
                    <label className="text-sm">
                      белки
                      <input
                        type="number"
                        value={item.nutrition.protein}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          updateItem(item.id, (entryItem) => ({
                            ...entryItem,
                            nutrition: { ...entryItem.nutrition, protein: Number.isFinite(value) ? value : 0 }
                          }));
                        }}
                        className="mt-1 w-full border border-black/[0.1] px-2 py-1"
                      />
                    </label>
                    <label className="text-sm">
                      жиры
                      <input
                        type="number"
                        value={item.nutrition.fat}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          updateItem(item.id, (entryItem) => ({
                            ...entryItem,
                            nutrition: { ...entryItem.nutrition, fat: Number.isFinite(value) ? value : 0 }
                          }));
                        }}
                        className="mt-1 w-full border border-black/[0.1] px-2 py-1"
                      />
                    </label>
                    <label className="text-sm">
                      углеводы
                      <input
                        type="number"
                        value={item.nutrition.carbs}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          updateItem(item.id, (entryItem) => ({
                            ...entryItem,
                            nutrition: { ...entryItem.nutrition, carbs: Number.isFinite(value) ? value : 0 }
                          }));
                        }}
                        className="mt-1 w-full border border-black/[0.1] px-2 py-1"
                      />
                    </label>
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
                <div className="flex gap-2">
                  <input value={draftItem.image} readOnly className="w-full border border-black/[0.1] px-3 py-2 text-sm" placeholder="Изображение" />
                  <button type="button" onClick={() => draftImageInputRef.current?.click()} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                    +
                  </button>
                  <input
                    ref={draftImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    className="hidden"
                    onChange={(event) => void handleFileChange(event)}
                  />
                </div>
              </div>
              <textarea
                value={draftItem.description}
                onChange={(event) => setDraftItem((prev) => ({ ...prev, description: event.target.value }))}
                className="min-h-20 w-full border border-black/[0.1] px-3 py-2 text-sm"
                placeholder="Описание"
              />

              <div className="grid gap-2 md:grid-cols-4">
                <input
                  type="number"
                  value={draftItem.nutrition.calories}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, nutrition: { ...prev.nutrition, calories: Number(event.target.value) || 0 } }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="ккал"
                />
                <input
                  type="number"
                  value={draftItem.nutrition.protein}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, nutrition: { ...prev.nutrition, protein: Number(event.target.value) || 0 } }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="белки"
                />
                <input
                  type="number"
                  value={draftItem.nutrition.fat}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, nutrition: { ...prev.nutrition, fat: Number(event.target.value) || 0 } }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="жиры"
                />
                <input
                  type="number"
                  value={draftItem.nutrition.carbs}
                  onChange={(event) => setDraftItem((prev) => ({ ...prev, nutrition: { ...prev.nutrition, carbs: Number(event.target.value) || 0 } }))}
                  className="border border-black/[0.1] px-3 py-2 text-sm"
                  placeholder="углеводы"
                />
              </div>

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
