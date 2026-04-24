import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import { quickUpdatePriceAction } from '@/app/admin/actions';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getCategories, getLocations, getProductLocationPrices, getProducts } from '@/lib/menu-data';

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: { category?: string; q?: string; saved?: string };
}) {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  const [products, categories, locations, prices] = await Promise.all([
    getProducts(),
    getCategories(),
    getLocations(),
    getProductLocationPrices()
  ]);

  const q = (searchParams.q ?? '').toLowerCase();
  const categoryFilter = searchParams.category ?? '';

  const filtered = products.filter((product) => {
    const passQ = !q || product.name.toLowerCase().includes(q);
    const passCategory = !categoryFilter || product.category_id === categoryFilter;
    return passQ && passCategory;
  });

  return (
    <AdminShell title="Продукты">
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/products/new" className="bg-[#ff8a42] px-3 py-2 text-sm text-white">
          + Добавить позицию
        </Link>
      </div>
      {searchParams.saved ? <p className="mb-3 text-sm text-green-700">Сохранено.</p> : null}
      <form className="mb-4 grid gap-2 sm:grid-cols-3">
        <input name="q" placeholder="Поиск по названию" defaultValue={searchParams.q} className="border border-neutral-300 px-3 py-2" />
        <select name="category" defaultValue={categoryFilter} className="border border-neutral-300 px-3 py-2">
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="border border-neutral-300 px-3 py-2">Фильтровать</button>
      </form>

      <div className="overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-500">
              <th className="py-2">Фото</th>
              <th>Название</th>
              <th>Категория</th>
              {locations.map((location) => (
                <th key={location.id}>{location.code}</th>
              ))}
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-neutral-100 align-top">
                <td className="py-2">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover" />
                  ) : (
                    <div className="h-12 w-12 bg-neutral-100" />
                  )}
                </td>
                <td className="py-2 font-medium">
                  {product.name}
                  {!product.is_active ? <span className="ml-2 text-xs text-orange-700">Скрыт</span> : null}
                </td>
                <td className="py-2">{product.categories?.name ?? '—'}</td>
                {locations.map((location) => {
                  const relation = prices.find((entry) => entry.product_id === product.id && entry.location_id === location.id);
                  return (
                    <td key={location.id} className="py-2">
                      <form action={quickUpdatePriceAction} className="space-y-1">
                        <input type="hidden" name="product_id" value={product.id} />
                        <input type="hidden" name="location_id" value={location.id} />
                        <input
                          type="number"
                          name="price"
                          defaultValue={relation?.price ?? ''}
                          placeholder="Цена"
                          className="w-20 border border-neutral-300 px-1 py-0.5"
                        />
                        <div className="flex gap-1 text-xs">
                          <label><input type="checkbox" name="is_visible" defaultChecked={relation?.is_visible ?? true} />Публ</label>
                          <label><input type="checkbox" name="is_available" defaultChecked={relation?.is_available ?? true} />В нал</label>
                        </div>
                        <button className="text-xs text-[#ac4e16]">OK</button>
                      </form>
                    </td>
                  );
                })}
                <td className="py-2">{product.is_active ? 'Активен' : 'Скрыт'}</td>
                <td className="py-2">
                  <Link href={`/admin/products/${product.id}`} className="text-[#ac4e16] underline">
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
