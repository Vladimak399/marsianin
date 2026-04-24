import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { MenuCategory } from '@/data/menu';
import { getDefaultMenuCatalog, sanitizeMenuCatalog } from '@/lib/menuCatalog';

const DATA_DIR = path.join(process.cwd(), 'data');
const MENU_FILE_PATH = path.join(DATA_DIR, 'menu.catalog.json');

export const readCatalogFromFile = async (): Promise<MenuCategory[]> => {
  try {
    const raw = await readFile(MENU_FILE_PATH, 'utf-8');
    return sanitizeMenuCatalog(JSON.parse(raw));
  } catch {
    return getDefaultMenuCatalog();
  }
};

export const writeCatalogToFile = async (catalog: MenuCategory[]) => {
  await mkdir(DATA_DIR, { recursive: true });
  const sanitized = sanitizeMenuCatalog(catalog);
  await writeFile(MENU_FILE_PATH, JSON.stringify(sanitized, null, 2), 'utf-8');
  return sanitized;
};
