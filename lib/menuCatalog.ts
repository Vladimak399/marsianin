import { menuData, MenuCategory, MenuItem } from '@/data/menu';
import { locations, LocationId } from '@/data/locations';

export const MENU_STORAGE_KEY = 'marsianin:menu-catalog:v1';

const FALLBACK_IMAGE = '/images/mock/breakfast-card.svg';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const getDefaultMenuCatalog = (): MenuCategory[] => clone(menuData);

const getNumeric = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
};

const sanitizePriceByLocation = (priceByLocation: Partial<Record<LocationId, number>>): Record<LocationId, number> => {
  return locations.reduce(
    (acc, location) => {
      acc[location.id] = getNumeric(priceByLocation[location.id], 0);
      return acc;
    },
    {} as Record<LocationId, number>
  );
};

const sanitizeMenuItem = (item: Partial<MenuItem>, category: string, index: number): MenuItem => {
  const baseId = item.id && item.id.trim().length > 0 ? item.id : `${category}-${index + 1}`;

  return {
    id: baseId,
    name: typeof item.name === 'string' ? item.name : `позиция ${index + 1}`,
    description: typeof item.description === 'string' ? item.description : '',
    image: item.image?.trim() || FALLBACK_IMAGE,
    priceByLocation: sanitizePriceByLocation(item.priceByLocation ?? {}),
    nutrition: {
      calories: getNumeric(item.nutrition?.calories, 0),
      protein: getNumeric(item.nutrition?.protein, 0),
      fat: getNumeric(item.nutrition?.fat, 0),
      carbs: getNumeric(item.nutrition?.carbs, 0)
    }
  };
};

const sanitizeMenuCategory = (category: Partial<MenuCategory>, index: number): MenuCategory => {
  const categoryName = category.category?.trim().toLowerCase() || `категория-${index + 1}`;

  return {
    category: categoryName,
    items: (category.items ?? []).map((item, itemIndex) => sanitizeMenuItem(item, categoryName, itemIndex))
  };
};

export const sanitizeMenuCatalog = (catalog: unknown): MenuCategory[] => {
  if (!Array.isArray(catalog)) return getDefaultMenuCatalog();

  const normalized = catalog.map((entry, index) => sanitizeMenuCategory(entry as Partial<MenuCategory>, index));
  return normalized.length > 0 ? normalized : getDefaultMenuCatalog();
};

export const loadMenuCatalog = (): MenuCategory[] => {
  if (typeof window === 'undefined') return getDefaultMenuCatalog();

  try {
    const raw = window.localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) return getDefaultMenuCatalog();

    return sanitizeMenuCatalog(JSON.parse(raw));
  } catch {
    return getDefaultMenuCatalog();
  }
};

export const saveMenuCatalog = (catalog: MenuCategory[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(sanitizeMenuCatalog(catalog)));
};

export const resetMenuCatalog = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(MENU_STORAGE_KEY);
};
