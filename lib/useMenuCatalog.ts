'use client';

import { useCallback, useEffect, useState } from 'react';
import { MenuCategory } from '@/data/menu';
import { loadMenuCatalog, MENU_STORAGE_KEY, resetMenuCatalog, saveMenuCatalog, sanitizeMenuCatalog } from './menuCatalog';

type UseMenuCatalogOptions = {
  admin?: boolean;
};

const parseApiErrorMessage = async (response: Response, fallback: string) => {
  const payload = (await response.json().catch(() => null)) as { message?: unknown } | null;
  return typeof payload?.message === 'string' && payload.message.trim() ? payload.message : fallback;
};

export const useMenuCatalog = (options: UseMenuCatalogOptions = {}) => {
  const [catalog, setCatalog] = useState<MenuCategory[]>(() => loadMenuCatalog());
  const [isServerSyncing, setIsServerSyncing] = useState(true);

  const applyCatalog = useCallback((nextCatalog: MenuCategory[]) => {
    const normalized = sanitizeMenuCatalog(nextCatalog);
    setCatalog(normalized);
    saveMenuCatalog(normalized);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== MENU_STORAGE_KEY) return;
      setCatalog(loadMenuCatalog());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncFromServer = async () => {
      setIsServerSyncing(true);
      try {
        const endpoint = options.admin ? '/api/admin/menu' : '/api/menu';
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { catalog: MenuCategory[] };
        if (!isMounted) return;
        applyCatalog(payload.catalog);
      } finally {
        if (isMounted) setIsServerSyncing(false);
      }
    };

    void syncFromServer();

    return () => {
      isMounted = false;
    };
  }, [applyCatalog, options.admin]);

  const updateCatalog = useCallback(
    async (nextCatalog: MenuCategory[]) => {
      const normalized = sanitizeMenuCatalog(nextCatalog);
      applyCatalog(normalized);

      if (!options.admin) return;

      const response = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ catalog: normalized })
      });

      if (!response.ok) {
        throw new Error(await parseApiErrorMessage(response, 'Не удалось сохранить меню'));
      }
    },
    [applyCatalog, options.admin]
  );

  const restoreCatalog = useCallback(async () => {
    resetMenuCatalog();
    const defaultCatalog = loadMenuCatalog();
    setCatalog(defaultCatalog);

    if (!options.admin) return;

    const response = await fetch('/api/admin/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ catalog: defaultCatalog })
    });

    if (!response.ok) {
      throw new Error(await parseApiErrorMessage(response, 'Не удалось сбросить меню'));
    }
  }, [options.admin]);

  return { catalog, updateCatalog, restoreCatalog, applyCatalog, isServerSyncing };
};
