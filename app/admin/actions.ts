'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearAdminSession, isAdminAuthenticated, setAdminSession, validateCredentials } from '@/lib/admin/auth';
import { getAdminSupabase } from '@/lib/menu-data';

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');
}

function toNumber(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBool(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true';
}

function revalidateMenuPages() {
  revalidatePath('/menu/o12');
  revalidatePath('/menu/k10');
  revalidatePath('/menu/p7');
}

export async function loginAdminAction(_: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!validateCredentials(email, password)) {
    return { error: 'Неверный логин или пароль.' };
  }

  await setAdminSession(email);
  redirect('/admin');
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function saveCategoryAction(formData: FormData) {
  await ensureAdmin();
  const supabase = getAdminSupabase();

  const id = String(formData.get('id') ?? '');
  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim().toLowerCase(),
    description: String(formData.get('description') ?? '').trim() || null,
    is_active: toBool(formData.get('is_active')),
    sort_order: Number(formData.get('sort_order') ?? 0)
  };

  if (id) {
    const { error } = await supabase.from('categories').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('categories').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidateMenuPages();
  revalidatePath('/admin/categories');
}

export async function saveLocationAction(formData: FormData) {
  await ensureAdmin();
  const supabase = getAdminSupabase();

  const id = String(formData.get('id') ?? '');
  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    address: String(formData.get('address') ?? '').trim() || null,
    working_hours: String(formData.get('working_hours') ?? '').trim() || null,
    is_active: toBool(formData.get('is_active')),
    sort_order: Number(formData.get('sort_order') ?? 0)
  };

  const { error } = await supabase.from('locations').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidateMenuPages();
  revalidatePath('/admin/locations');
}

export async function saveProductAction(formData: FormData) {
  await ensureAdmin();
  const supabase = getAdminSupabase();

  const id = String(formData.get('id') ?? '');
  const payload = {
    category_id: String(formData.get('category_id') ?? ''),
    name: String(formData.get('name') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim().toLowerCase(),
    short_description: String(formData.get('short_description') ?? '').trim() || null,
    composition: String(formData.get('composition') ?? '').trim() || null,
    calories: toNumber(formData.get('calories')),
    proteins: toNumber(formData.get('proteins')),
    fats: toNumber(formData.get('fats')),
    carbs: toNumber(formData.get('carbs')),
    weight: String(formData.get('weight') ?? '').trim() || null,
    volume: String(formData.get('volume') ?? '').trim() || null,
    badge: String(formData.get('badge') ?? '').trim() || null,
    is_active: toBool(formData.get('is_active')),
    sort_order: Number(formData.get('sort_order') ?? 0)
  };

  const image = formData.get('image') as File | null;
  if (image && image.size > 0) {
    const imagePath = `products/${Date.now()}-${image.name}`;
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(imagePath, image, {
      upsert: true,
      contentType: image.type || 'image/jpeg'
    });

    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from('menu-images').getPublicUrl(imagePath);
    (payload as any).image_url = data.publicUrl;
  }

  let productId = id;
  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from('products').insert(payload).select('id').single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  const locationIds = String(formData.get('location_ids') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  for (const locationId of locationIds) {
    const price = toNumber(formData.get(`price_${locationId}`));
    if (price === null) continue;

    const pricePayload = {
      product_id: productId,
      location_id: locationId,
      price,
      old_price: toNumber(formData.get(`old_price_${locationId}`)),
      is_available: toBool(formData.get(`is_available_${locationId}`)),
      is_visible: toBool(formData.get(`is_visible_${locationId}`))
    };

    const { error } = await supabase
      .from('product_location_prices')
      .upsert(pricePayload, { onConflict: 'product_id,location_id' });

    if (error) throw new Error(error.message);
  }

  revalidateMenuPages();
  revalidatePath('/admin/products');
  redirect('/admin/products?saved=1');
}

export async function quickUpdatePriceAction(formData: FormData) {
  await ensureAdmin();
  const supabase = getAdminSupabase();

  const payload = {
    product_id: String(formData.get('product_id')),
    location_id: String(formData.get('location_id')),
    price: Number(formData.get('price')),
    old_price: toNumber(formData.get('old_price')),
    is_available: toBool(formData.get('is_available')),
    is_visible: toBool(formData.get('is_visible'))
  };

  const { error } = await supabase.from('product_location_prices').upsert(payload, { onConflict: 'product_id,location_id' });
  if (error) throw new Error(error.message);

  revalidateMenuPages();
  revalidatePath('/admin/products');
}
