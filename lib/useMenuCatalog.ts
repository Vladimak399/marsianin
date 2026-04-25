'use client';

import { useCallback, useEffect, useState } from 'react';
import { MenuCategory } from '@/data/menu';
import { loadMenuCatalog, MENU_STORAGE_KEY, resetMenuCatalog, saveMenuCatalog, sanitizeMenuCatalog } from './menuCatalog';

type UseMenuCatalogOptions = {
  admin?: boolean;
};

export const useMenuCatalog = (options: UseMenuCatalogOptions = {}) => {
  const [catalog, setCatalog] = useState<MenuCategory[]>(() => loadMenuCatalog());

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
    const syncFromServer = async () => {
      const endpoint = options.admin ? '/api/admin/menu' : '/api/menu';
      const response = await fetch(endpoint, { method: 'GET', credentials: 'include' });
      if (!response.ok) return;
      const payload = (await response.json()) as { catalog: MenuCategory[] };
      applyCatalog(payload.catalog);
    };

    void syncFromServer();
  }, [applyCatalog, options.admin]);

  const updateCatalog = useCallback(
    async (nextCatalog: MenuCategory[]) => {
      const normalized = sanitizeMenuCatalog(nextCatalog);
      applyCatalog(normalized);

      if (!options.admin) return;

      await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ catalog: normalized })
      });
    },
    [applyCatalog, options.admin]
  );

  const restoreCatalog = useCallback(async () => {
    resetMenuCatalog();
    const defaultCatalog = loadMenuCatalog();
    setCatalog(defaultCatalog);

    if (!options.admin) return;

    await fetch('/api/admin/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ catalog: defaultCatalog })
    });
  }, [options.admin]);

  return { catalog, updateCatalog, restoreCatalog, applyCatalog };
};
