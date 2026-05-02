'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { LocationId, locations } from '@/data/locations';
import { MenuCategory, MenuItem } from '@/data/menu';
import { useMenuCatalog } from '@/lib/useMenuCatalog';
import AdminImageField from './AdminImageField';
import AdminNumberField from './AdminNumberField';

const ADMIN_SESSION_KEY = 'marsianin:admin:session';
const DEFAULT_MENU_LOCATION = 'o12';

const fieldClass = 'border border-black/[0.1] px-3 py-2 text-sm';
const numberFieldClass = 'mt-1 w-full border border-black/[0.1] px-2 py-1';

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

const getCatalogFromJsonPayload = (payload: unknown): MenuCategory[] | null => {
  if (Array.isArray(payload)) return payload as MenuCategory[];
  if (!payload || typeof payload !== 'object') return null;

  const catalog = (payload as { catalog?: unknown }).catalog;
  return Array.isArray(catalog) ? (catalog as MenuCategory[]) : null;
};

const getCatalogSummary = (nextCatalog: MenuCategory[]) => {
  const itemCount = nextCatalog.reduce((sum, category) => sum + category.items.length, 0);
  const categoryText = nextCatalog.length === 1 ? 'категория' : nextCatalog.length > 1 && nextCatalog.length < 5 ? 'категории' : 'категорий';
  const itemText = itemCount === 1 ? 'позиция' : itemCount > 1 && itemCount < 5 ? 'позиции' : 'позиций';
  return `${nextCatalog.length} ${categoryText}, ${itemCount} ${itemText}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

const isLikelyErrorMessage = (message: string) =>
  /ошибка|не удалось|не авторизован|истекла|не настроен|проверьте/i.test(message);

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
  const [isSaving, setIsSaving] = useState(false);
  const [isImportingSeed, setIsImportingSeed] = useState(false);

  const catalogJsonInputRef = useRef<HTMLInputElement>(null);
  const latestCatalogRef = useRef<MenuCategory[]>(catalog);

  const activeCategory = useMemo(
    () => catalog.find((category) => category.category === selectedCategory) ?? catalog[0],
    [catalog, selectedCategory]
  );

  useEffect(() => {
    latestCatalogRef.current = catalog;
  }, [catalog]);

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

  const clearLocalAdminSession = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthorized(false);
    setPassword('');
  };

  const markDirty = () => {
    setHasUnsavedChanges(true);
    setSaveMessage('Есть несохраненные изменения');
  };

  const applyCatalogLocally = (nextCatalog: MenuCategory[]) => {
    latestCatalogRef.current = nextCatalog;
    applyCatalog(nextCatalog);
    markDirty();
  };

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
    clearLocalAdminSession();
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('Сохраняем…');

    try {
      await updateCatalog(latestCatalogRef.current);
      setHasUnsavedChanges(false);
      setSaveMessage(`Сохранено: ${new Date().toLocaleTimeString('ru-RU')}`);
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось сохранить изменения');
      if (message.includes('Сессия администратора истекла')) clearLocalAdminSession();
      setSaveMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportSeedCatalog = async () => {
    const shouldImport = window.confirm(
      'Загрузить seed-меню из кода в живой каталог? Текущее меню будет сохранено в backup, затем заменено seed-версией.'
    );
    if (!shouldImport) return;

    setIsImportingSeed(true);
    setSaveMessage('Загружаем seed-меню…');

    try {
      const response = await fetch('/api/admin/menu/seed', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.status === 401) {
        clearLocalAdminSession();
        throw new Error('Сессия администратора истекла. Войдите заново');
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ message: 'Не удалось загрузить seed-меню' }))) as { message?: string };
        throw new Error(payload.message ?? 'Не удалось загрузить seed-меню');
      }

      const payload = (await response.json()) as { catalog: MenuCategory[]; summary?: { categories: number; items: number } };
      latestCatalogRef.current = payload.catalog;
      applyCatalog(payload.catalog);
      setSelectedCategory(payload.catalog[0]?.category ?? '');
      setHasUnsavedChanges(false);
      setSaveMessage(`Seed-меню загружено: ${getCatalogSummary(payload.catalog)}`);
    } catch (error) {
      setSaveMessage(getErrorMessage(error, 'Не удалось загрузить seed-меню'));
    } finally {
      setIsImportingSeed(false);
    }
  };

  const handleExportCatalogJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      catalog: latestCatalogRef.current
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marsianin-menu-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSaveMessage(`JSON меню скачан: ${getCatalogSummary(latestCatalogRef.current)}`);
  };

  const handleImportCatalogJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const payload = JSON.parse(await file.text()) as unknown;
      const nextCatalog = getCatalogFromJsonPayload(payload);

      if (!nextCatalog) {
        setSaveMessage('Не удалось загрузить JSON: внутри должен быть массив категорий или поле catalog');
        return;
      }

      applyCatalogLocally(nextCatalog);
      setSelectedCategory(nextCatalog[0]?.category ?? '');
      setSaveMessage(`JSON загружен: ${getCatalogSummary(nextCatalog)}. Проверьте меню и нажмите «Сохранить»`);
    } catch {
      setSaveMessage('Не удалось загрузить JSON. Проверьте структуру файла');
    }
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

    if (response.status === 401) {
      clearLocalAdminSession();
      setSaveMessage('Сессия администратора истекла. Войдите заново');
      return;
    }

    if (!response.ok || !payload.url) {
      setSaveMessage(payload.message ?? 'Ошибка загрузки файла');
      return;
    }

    if (!itemId) {
      setDraftItem((prev) => ({ ...prev, image: payload.url ?? prev.image }));
      setSaveMessage('Фото загружено. Проверьте превью и нажмите «Добавить позицию»');
      return;
    }

    if (!activeCategory) return;
    const nextCatalog = latestCatalogRef.current.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.map((item) => (item.id === itemId ? { ...item, image: payload.url ?? item.image } : item))
      };
    });

    applyCatalogLocally(nextCatalog);
    setSaveMessage('Фото загружено. Проверьте превью и нажмите «Сохранить»');
  };

  const updateItem = (itemId: string, updater: (item: MenuItem) => MenuItem) => {
    if (!activeCategory) return;

    const nextCatalog = latestCatalogRef.current.map((entry) => {
      if (entry.category !== activeCategory.category) return entry;
      return {
        ...entry,
        items: entry.items.map((item) => (item.id === itemId ? updater(item) : item))
      };
    });

    applyCatalogLocally(nextCatalog);
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!activeCategory) return;

    const currentCategory = latestCatalogRef.current.find((entry) => entry.category === activeCategory.category);
    if (!currentCategory) return;

    const currentIndex = currentCategory.items.findIndex((item) => item.id === itemId);
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentCategory.items.length) return;

    const nextItems = [...currentCategory.items];
    [nextItems[currentIndex], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[currentIndex]];

    const nextCatalog = latestCatalogRef.current.map((entry) => (entry.category === currentCategory.category ? { ...entry, items: nextItems } : entry));
    applyCatalogLocally(nextCatalog);
  };

  const updateDraftPrice = (locationId: LocationId, value: number) => {
    setDraftItem((prev) => ({
      ...prev,
      priceByLocation: {
        ...prev.priceByLocation,
        [locationId]: value
      }
    }));
  };

  const updateDraftNutrition = (field: keyof MenuItem['nutrition'], value: number) => {
    setDraftItem((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value
      }
    }));
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-svh bg-[#f4f1ea] px-4 py-10 text-[#0b0b0b] sm:px-6">
        <div className="mx-auto w-full max-w-md border border-black/[0.08] bg-white p-5">
          <h1 className="text-2xl font-semibold">Вход в админ-кабинет</h1>
          <p className="mt-2 text-sm text-black/60">Введите логин и пароль администратора.</p>

          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input value={login} onChange={(event) => setLogin(event.target.value)} className={`w-full ${fieldClass}`} placeholder="Логин" autoComplete="username" disabled={isLoggingIn} required />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={`w-full ${fieldClass}`} placeholder="Пароль" autoComplete="current-password" disabled={isLoggingIn} required />
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button type="submit" disabled={isLoggingIn} className="w-full border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-progress disabled:opacity-60">
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

    const nextCatalog = [...latestCatalogRef.current, { category: trimmed, items: [] }];
    applyCatalogLocally(nextCatalog);
    setSelectedCategory(trimmed);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (category: string) => {
    if (!confirm(`Удалить категорию «${category}»?`)) return;

    const nextCatalog = latestCatalogRef.current.filter((entry) => entry.category !== category);
    const normalizedCatalog = nextCatalog.length > 0 ? nextCatalog : latestCatalogRef.current;
    applyCatalogLocally(normalizedCatalog);
    if (selectedCategory === category && nextCatalog[0]) setSelectedCategory(nextCatalog[0].category);
  };

  const handleAddItem = (event: FormEvent) => {
    event.preventDefault();
    if (!activeCategory) return;

    const nextCatalog = latestCatalogRef.current.map((entry) => {
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

    const nextCatalog = latestCatalogRef.current.map((entry) => {
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
            {saveMessage ? <p className={`text-xs ${isLikelyErrorMessage(saveMessage) ? 'text-red-600' : 'text-[#ed6a32]'}`}>{saveMessage}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void handleSaveChanges()} disabled={!hasUnsavedChanges || isSaving} className="border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button type="button" onClick={() => void handleImportSeedCatalog()} disabled={isImportingSeed || isSaving} className="border border-[#ed6a32]/40 px-3 py-2 text-sm text-[#ed6a32] enabled:hover:bg-[#ed6a32]/[0.06] disabled:cursor-not-allowed disabled:opacity-50">
              {isImportingSeed ? 'Загружаем seed…' : 'Загрузить seed-меню'}
            </button>
            <button type="button" onClick={handleExportCatalogJson} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Скачать JSON
            </button>
            <button type="button" onClick={() => catalogJsonInputRef.current?.click()} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Загрузить JSON
            </button>
            <input ref={catalogJsonInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void handleImportCatalogJson(event)} />
            <Link href={`/menu/${DEFAULT_MENU_LOCATION}`} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Открыть меню
            </Link>
            <button type="button" onClick={handleLogout} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
              Выйти
            </button>
            <button
              type="button"
              onClick={() => {
                void restoreCatalog()
                  .then(() => {
                    latestCatalogRef.current = catalog;
                    setHasUnsavedChanges(false);
                    setSaveMessage('Каталог сброшен до исходного состояния');
                  })
                  .catch((error) => setSaveMessage(getErrorMessage(error, 'Не удалось сбросить меню')));
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
                  <button type="button" onClick={() => setSelectedCategory(entry.category)} className={`flex-1 border px-3 py-2 text-left text-sm ${activeCategory?.category === entry.category ? 'border-[#ed6a32] text-[#ed6a32]' : 'border-black/[0.1]'}`}>
                    {entry.category}
                  </button>
                  <button type="button" onClick={() => handleRemoveCategory(entry.category)} className="border border-black/[0.1] px-2 text-sm">
                    ×
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="space-y-2">
              <input value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} className={`w-full ${fieldClass}`} placeholder="новая категория" />
              <button type="submit" className="w-full border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                Добавить категорию
              </button>
            </form>
          </aside>

          <section className="space-y-4 border border-black/[0.08] bg-white p-4">
            <h2 className="text-lg font-semibold">Позиции: {activeCategory?.category ?? '—'}</h2>

            <div className="space-y-3">
              {activeCategory?.items.map((item, itemIndex) => (
                <article key={item.id} className="space-y-3 border border-black/[0.08] p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input value={item.name} onChange={(event) => updateItem(item.id, (entryItem) => ({ ...entryItem, name: event.target.value }))} className={fieldClass} placeholder="Название" />
                    <AdminImageField value={item.image} onChange={(nextValue) => updateItem(item.id, (entryItem) => ({ ...entryItem, image: nextValue }))} onUpload={(file) => handleUploadImage(file, item.id)} />
                  </div>

                  <textarea value={item.description} onChange={(event) => updateItem(item.id, (entryItem) => ({ ...entryItem, description: event.target.value }))} className="min-h-20 w-full border border-black/[0.1] px-3 py-2 text-sm" placeholder="Описание" />

                  <div className="grid gap-2 md:grid-cols-3">
                    {locations.map((location) => (
                      <label key={location.id} className="flex items-center gap-2 border border-black/[0.08] px-2 py-1 text-sm">
                        <span>{location.label}</span>
                        <AdminNumberField
                          value={item.priceByLocation[location.id]}
                          onChange={(value) => updateItem(item.id, (entryItem) => ({ ...entryItem, priceByLocation: { ...entryItem.priceByLocation, [location.id]: value } }))}
                          className="w-full border border-black/[0.1] px-2 py-1"
                          ariaLabel={`цена ${location.label}`}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-2 md:grid-cols-4">
                    <label className="text-sm">
                      ккал
                      <AdminNumberField value={item.nutrition.calories} onChange={(value) => updateItem(item.id, (entryItem) => ({ ...entryItem, nutrition: { ...entryItem.nutrition, calories: value } }))} className={numberFieldClass} ariaLabel="ккал" />
                    </label>
                    <label className="text-sm">
                      белки
                      <AdminNumberField value={item.nutrition.protein} onChange={(value) => updateItem(item.id, (entryItem) => ({ ...entryItem, nutrition: { ...entryItem.nutrition, protein: value } }))} className={numberFieldClass} ariaLabel="белки" />
                    </label>
                    <label className="text-sm">
                      жиры
                      <AdminNumberField value={item.nutrition.fat} onChange={(value) => updateItem(item.id, (entryItem) => ({ ...entryItem, nutrition: { ...entryItem.nutrition, fat: value } }))} className={numberFieldClass} ariaLabel="жиры" />
                    </label>
                    <label className="text-sm">
                      углеводы
                      <AdminNumberField value={item.nutrition.carbs} onChange={(value) => updateItem(item.id, (entryItem) => ({ ...entryItem, nutrition: { ...entryItem.nutrition, carbs: value } }))} className={numberFieldClass} ariaLabel="углеводы" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveItem(item.id, 'up')} disabled={itemIndex === 0} className="border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40">
                      Выше
                    </button>
                    <button type="button" onClick={() => moveItem(item.id, 'down')} disabled={itemIndex === activeCategory.items.length - 1} className="border border-black/[0.1] px-3 py-2 text-sm enabled:hover:border-[#ed6a32] enabled:hover:text-[#ed6a32] disabled:cursor-not-allowed disabled:opacity-40">
                      Ниже
                    </button>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]">
                      Удалить позицию
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 border border-dashed border-black/[0.2] p-3">
              <h3 className="font-medium">Добавить новую позицию</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <input value={draftItem.name} onChange={(event) => setDraftItem((prev) => ({ ...prev, name: event.target.value }))} className={fieldClass} placeholder="Название" />
                <AdminImageField value={draftItem.image} onChange={(nextValue) => setDraftItem((prev) => ({ ...prev, image: nextValue }))} onUpload={(file) => handleUploadImage(file)} />
              </div>
              <textarea value={draftItem.description} onChange={(event) => setDraftItem((prev) => ({ ...prev, description: event.target.value }))} className="min-h-20 w-full border border-black/[0.1] px-3 py-2 text-sm" placeholder="Описание" />

              <div className="grid gap-2 md:grid-cols-3">
                {locations.map((location) => (
                  <label key={location.id} className="flex items-center gap-2 border border-black/[0.08] px-2 py-1 text-sm">
                    <span>{location.label}</span>
                    <AdminNumberField value={draftItem.priceByLocation[location.id]} onChange={(value) => updateDraftPrice(location.id, value)} className="w-full border border-black/[0.1] px-2 py-1" ariaLabel={`цена новой позиции ${location.label}`} />
                  </label>
                ))}
              </div>

              <div className="grid gap-2 md:grid-cols-4">
                <AdminNumberField value={draftItem.nutrition.calories} onChange={(value) => updateDraftNutrition('calories', value)} className={fieldClass} placeholder="ккал" ariaLabel="ккал новой позиции" />
                <AdminNumberField value={draftItem.nutrition.protein} onChange={(value) => updateDraftNutrition('protein', value)} className={fieldClass} placeholder="белки" ariaLabel="белки новой позиции" />
                <AdminNumberField value={draftItem.nutrition.fat} onChange={(value) => updateDraftNutrition('fat', value)} className={fieldClass} placeholder="жиры" ariaLabel="жиры новой позиции" />
                <AdminNumberField value={draftItem.nutrition.carbs} onChange={(value) => updateDraftNutrition('carbs', value)} className={fieldClass} placeholder="углеводы" ariaLabel="углеводы новой позиции" />
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
