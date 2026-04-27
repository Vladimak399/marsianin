import { put } from '@vercel/blob';
import { MenuCategory } from '@/data/menu';
import { getDefaultMenuCatalog, sanitizeMenuCatalog } from '@/lib/menuCatalog';

const MENU_BLOB_PATH = 'menu/catalog.json';

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const readCatalogFromBlob = async (): Promise<MenuCategory[]> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return getDefaultMenuCatalog();

  const response = await fetch(`https://blob.vercel-storage.com/${MENU_BLOB_PATH}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) return getDefaultMenuCatalog();

  const payload = (await response.json()) as unknown;
  return sanitizeMenuCatalog(payload);
};

export const readCatalogFromFile = async (): Promise<MenuCategory[]> => {
  try {
    return await readCatalogFromBlob();
  } catch {
    return getDefaultMenuCatalog();
  }
};

export const writeCatalogToFile = async (catalog: MenuCategory[]) => {
  if (!hasBlobToken()) {
    throw new Error('Не настроен BLOB_READ_WRITE_TOKEN в Vercel Environment Variables');
  }

  const sanitized = sanitizeMenuCatalog(catalog);

  await put(MENU_BLOB_PATH, JSON.stringify(sanitized, null, 2), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true
  });

  return sanitized;
};
