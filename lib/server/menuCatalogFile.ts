import { list, put } from '@vercel/blob';
import { MenuCategory } from '@/data/menu';
import { getDefaultMenuCatalog, sanitizeMenuCatalog } from '@/lib/menuCatalog';

const MENU_BLOB_PATH = 'menu/catalog.json';

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const readCatalogFromBlob = async (): Promise<MenuCategory[]> => {
  if (!hasBlobToken()) return getDefaultMenuCatalog();

  const { blobs } = await list({
    prefix: MENU_BLOB_PATH,
    limit: 1
  });

  const catalogBlob = blobs.find((blob) => blob.pathname === MENU_BLOB_PATH);
  if (!catalogBlob) return getDefaultMenuCatalog();

  const response = await fetch(catalogBlob.url, { cache: 'no-store' });
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
