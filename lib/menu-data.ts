import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

export type Location = {
  id: string;
  code: string;
  name: string;
  address: string | null;
  working_hours: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  composition: string | null;
  calories: number | null;
  proteins: number | null;
  fats: number | null;
  carbs: number | null;
  weight: string | null;
  volume: string | null;
  image_url: string | null;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
  categories?: { name: string; slug: string } | null;
};

export type ProductLocationPrice = {
  id: string;
  product_id: string;
  location_id: string;
  price: number;
  old_price: number | null;
  is_available: boolean;
  is_visible: boolean;
};

export async function getLocations() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('locations').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Location[];
}

export async function getCategories() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getProducts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name,slug)')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProductLocationPrices() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('product_location_prices').select('*');
  if (error) throw new Error(error.message);
  return (data ?? []) as ProductLocationPrice[];
}

export async function getPublicMenuByLocationCode(code: string) {
  const supabase = createSupabaseServerClient();

  const { data: location, error: locationError } = await supabase
    .from('locations')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (locationError || !location) return null;

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (categoriesError) throw new Error(categoriesError.message);

  const { data: rows, error: menuError } = await supabase
    .from('product_location_prices')
    .select('price, old_price, is_available, is_visible, products!inner(*, categories!inner(*))')
    .eq('location_id', location.id)
    .eq('is_visible', true)
    .order('sort_order', { foreignTable: 'products', ascending: true });

  if (menuError) throw new Error(menuError.message);

  const grouped = (categories ?? []).map((category) => {
    const items = (rows ?? [])
      .map((row: any) => ({
        ...row.products,
        locationPrice: {
          price: row.price,
          old_price: row.old_price,
          is_available: row.is_available,
          is_visible: row.is_visible
        }
      }))
      .filter((product: any) => product.is_active && product.category_id === category.id);

    return {
      ...category,
      products: items
    };
  });

  return { location: location as Location, categories: grouped.filter((cat) => cat.products.length > 0) };
}

export function getAdminSupabase() {
  return createSupabaseAdminClient();
}
