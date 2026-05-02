import { list, put } from '@vercel/blob';
import { MenuCategory } from '@/data/menu';
import {
  createMenuCatalogDocument,
  getDefaultMenuCatalog,
  MenuCatalogDocument,
  sanitizeMenuCatalog,
  sanitizeMenuCatalogDocument
} from '@/lib/menuCatalog';

const MENU_BLOB_PATH = 'menu/catalog.json';
const MENU_BACKUP_PREFIX = 'menu/backups/catalog';

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const readCatalogDocumentFromBlob = async (): Promise<MenuCatalogDocument> => {
  if (!hasBlobToken()) return createMenuCatalogDocument(getDefaultMenuCatalog(), 'seed');

  const { blobs } = await list({
    prefix: MENU_BLOB_PATH,
    limit: 1
  });

  const catalogBlob = blobs.find((blob) => blob.pathname === MENU_BLOB_PATH);
  if (!catalogBlob) return createMenuCatalogDocument(getDefaultMenuCatalog(), 'seed');

  const response = await fetch(catalogBlob.url, { cache: 'no-store' });
  if (!response.ok) return createMenuCatalogDocument(getDefaultMenuCatalog(), 'seed');

  const payload = (await response.json()) as unknown;
  return sanitizeMenuCatalogDocument(payload, 'legacy');
};

const createCatalogBackup = async () => {
  if (!hasBlobToken()) return;

  const currentCatalogDocument = await readCatalogDocumentFromBlob();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  await put(`${MENU_BACKUP_PREFIX}-${timestamp}.json`, JSON.stringify(currentCatalogDocument, null, 2), {
    access: 'public',
    contentType: 'application/json'
  });
};

const writeCatalogDocumentToBlob = async (document: MenuCatalogDocument) => {
  if (!hasBlobToken()) {
    throw new Error('Не настроен BLOB_READ_WRITE_TOKEN в Vercel Environment Variables');
  }

  await createCatalogBackup();

  await put(MENU_BLOB_PATH, JSON.stringify(document, null, 2), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true
  });

  return document.catalog;
};

export const readCatalogFromFile = async (): Promise<MenuCategory[]> => {
  try {
    return (await readCatalogDocumentFromBlob()).catalog;
  } catch {
    return getDefaultMenuCatalog();
  }
};

export const writeCatalogToFile = async (catalog: MenuCategory[]) => {
  const document = createMenuCatalogDocument(sanitizeMenuCatalog(catalog), 'admin');
  return writeCatalogDocumentToBlob(document);
};

export const importSeedCatalogToFile = async () => {
  const document = createMenuCatalogDocument(getDefaultMenuCatalog(), 'seed');
  return writeCatalogDocumentToBlob(document);
};
