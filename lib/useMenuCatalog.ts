'use client';

import { useCallback, useEffect, useState } from 'react';
import { MenuCategory } from '@/data/menu';
import { loadMenuCatalog, MENU_STORAGE_KEY, resetMenuCatalog, saveMenuCatalog, sanitizeMenuCatalog } from './menuCatalog';

export const useMenuCatalog = () => {
  const [catalog, setCatalog] = useState<MenuCategory[]>(() => loadMenuCatalog());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== MENU_STORAGE_KEY) return;
      setCatalog(loadMenuCatalog());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateCatalog = useCallback((nextCatalog: MenuCategory[]) => {
    const normalized = sanitizeMenuCatalog(nextCatalog);
    setCatalog(normalized);
    saveMenuCatalog(normalized);
  }, []);

  const restoreCatalog = useCallback(() => {
    resetMenuCatalog();
    setCatalog(loadMenuCatalog());
  }, []);

  return { catalog, updateCatalog, restoreCatalog };
};
