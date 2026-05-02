import { menuData, MenuCategory, MenuItem, PriceOption } from '@/data/menu';
import { locations, LocationId } from '@/data/locations';

export const MENU_STORAGE_KEY = 'marsianin:menu-catalog:v1';
export const MENU_SEED_VERSION = '2026-04-29-drinks-v1';

const FALLBACK_IMAGE = '/images/mock/breakfast-card.svg';

export type MenuCatalogDocument = {
  version: string;
  updatedAt: string;
  source: 'seed' | 'admin' | 'legacy';
  catalog: MenuCategory[];
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const getDefaultMenuCatalog = (): MenuCategory[] => clone(menuData);

export const createMenuCatalogDocument = (catalog: MenuCategory[], source: MenuCatalogDocument['source']): MenuCatalogDocument => ({
  version: MENU_SEED_VERSION,
  updatedAt: new Date().toISOString(),
  source,
  catalog: sanitizeMenuCatalog(catalog)
});

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

const sanitizeAvailableByLocation = (availableByLocation: unknown): Record<LocationId, boolean> => {
  if (!availableByLocation || typeof availableByLocation !== 'object') {
    return locations.reduce(
      (acc, location) => {
        acc[location.id] = true;
        return acc;
      },
      {} as Record<LocationId, boolean>
    );
  }

  const source = availableByLocation as Partial<Record<LocationId, unknown>>;
  return locations.reduce(
    (acc, location) => {
      acc[location.id] = source[location.id] !== false;
      return acc;
    },
    {} as Record<LocationId, boolean>
  );
};

const sanitizePriceOptions = (options: unknown): PriceOption[] => {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (!option || typeof option !== 'object') return null;
      const entry = option as Partial<PriceOption>;
      const label = typeof entry.label === 'string' ? entry.label.trim() : '';
      const price = getNumeric(entry.price, 0);
      if (!label || price <= 0) return null;
      return { label, price };
    })
    .filter((option): option is PriceOption => Boolean(option));
};

const sanitizePriceOptionsByLocation = (value: unknown): Record<LocationId, PriceOption[]> | undefined => {
  if (!value || typeof value !== 'object') return undefined;

  const source = value as Partial<Record<LocationId, unknown>>;
  const normalized = locations.reduce(
    (acc, location) => {
      acc[location.id] = sanitizePriceOptions(source[location.id]);
      return acc;
    },
    {} as Record<LocationId, PriceOption[]>
  );

  const hasAnyOptions = locations.some((location) => normalized[location.id].length > 0);
  return hasAnyOptions ? normalized : undefined;
};

const sanitizeMenuItem = (item: Partial<MenuItem>, category: string, index: number): MenuItem => {
  const baseId = item.id && item.id.trim().length > 0 ? item.id : `${category}-${index + 1}`;
  const priceOptionsByLocation = sanitizePriceOptionsByLocation(item.priceOptionsByLocation);

  return {
    id: baseId,
    name: typeof item.name === 'string' ? item.name : `позиция ${index + 1}`,
    description: typeof item.description === 'string' ? item.description : '',
    subcategory: typeof item.subcategory === 'string' && item.subcategory.trim() ? item.subcategory.trim().toLowerCase() : undefined,
    availableByLocation: sanitizeAvailableByLocation(item.availableByLocation),
    containsAlcohol: item.containsAlcohol === true,
    image: item.image?.trim() || FALLBACK_IMAGE,
    priceByLocation: sanitizePriceByLocation(item.priceByLocation ?? {}),
    ...(priceOptionsByLocation ? { priceOptionsByLocation } : {}),
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

export const getCatalogFromPayload = (payload: unknown): unknown => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return null;

  const catalog = (payload as { catalog?: unknown }).catalog;
  return Array.isArray(catalog) ? catalog : null;
};

export const sanitizeMenuCatalog = (catalog: unknown): MenuCategory[] => {
  const catalogPayload = getCatalogFromPayload(catalog);
  if (!Array.isArray(catalogPayload)) return getDefaultMenuCatalog();

  const normalized = catalogPayload.map((entry, index) => sanitizeMenuCategory(entry as Partial<MenuCategory>, index));
  return normalized.length > 0 ? normalized : getDefaultMenuCatalog();
};

export const sanitizeMenuCatalogDocument = (payload: unknown, source: MenuCatalogDocument['source'] = 'legacy'): MenuCatalogDocument => {
  const catalog = sanitizeMenuCatalog(payload);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return createMenuCatalogDocument(catalog, source);
  }

  const document = payload as Partial<MenuCatalogDocument>;
  return {
    version: typeof document.version === 'string' && document.version.trim() ? document.version : MENU_SEED_VERSION,
    updatedAt: typeof document.updatedAt === 'string' && document.updatedAt.trim() ? document.updatedAt : new Date().toISOString(),
    source: document.source === 'seed' || document.source === 'admin' || document.source === 'legacy' ? document.source : source,
    catalog
  };
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
