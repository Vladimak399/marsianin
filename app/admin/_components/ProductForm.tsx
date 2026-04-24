import { saveProductAction } from '@/app/admin/actions';
import { Category, Location, Product, ProductLocationPrice } from '@/lib/menu-data';

export default function ProductForm({
  categories,
  locations,
  product,
  prices
}: {
  categories: Category[];
  locations: Location[];
  product?: Product;
  prices: ProductLocationPrice[];
}) {
  return (
    <form action={saveProductAction} className="space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="location_ids" value={locations.map((location) => location.id).join(',')} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Название</span>
          <input name="name" required defaultValue={product?.name} className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm">
          <span>Slug</span>
          <input name="slug" required defaultValue={product?.slug} className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span>Категория</span>
          <select name="category_id" required defaultValue={product?.category_id} className="w-full border border-neutral-300 px-3 py-2">
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span>Описание</span>
          <textarea name="short_description" defaultValue={product?.short_description ?? ''} className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span>Состав</span>
          <textarea name="composition" defaultValue={product?.composition ?? ''} className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm"><span>Калории</span><input name="calories" type="number" defaultValue={product?.calories ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Белки</span><input name="proteins" type="number" defaultValue={product?.proteins ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Жиры</span><input name="fats" type="number" defaultValue={product?.fats ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Углеводы</span><input name="carbs" type="number" defaultValue={product?.carbs ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Вес</span><input name="weight" defaultValue={product?.weight ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Объем</span><input name="volume" defaultValue={product?.volume ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Бейдж</span><input name="badge" defaultValue={product?.badge ?? ''} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm"><span>Порядок</span><input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className="w-full border border-neutral-300 px-3 py-2" /></label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span>Фото</span>
          <input name="image" type="file" accept="image/*" className="w-full border border-neutral-300 px-3 py-2" />
        </label>
        <label className="text-sm"><input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} /> Опубликован</label>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Цены и наличие по точкам</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {locations.map((location) => {
            const relation = prices.find((entry) => entry.location_id === location.id);
            return (
              <div key={location.id} className="border border-neutral-200 p-3">
                <h3 className="mb-2 font-semibold">{location.code}</h3>
                <label className="mb-1 block text-sm">Цена<input name={`price_${location.id}`} type="number" defaultValue={relation?.price ?? ''} className="mt-1 w-full border border-neutral-300 px-2 py-1" /></label>
                <label className="mb-1 block text-sm">Старая цена<input name={`old_price_${location.id}`} type="number" defaultValue={relation?.old_price ?? ''} className="mt-1 w-full border border-neutral-300 px-2 py-1" /></label>
                <label className="mr-2 text-sm"><input name={`is_visible_${location.id}`} type="checkbox" defaultChecked={relation?.is_visible ?? true} /> Показ</label>
                <label className="text-sm"><input name={`is_available_${location.id}`} type="checkbox" defaultChecked={relation?.is_available ?? true} /> В наличии</label>
              </div>
            );
          })}
        </div>
      </div>

      <button className="bg-[#ff8a42] px-4 py-2 text-white">Сохранить</button>
      <p className="text-sm text-neutral-500">После сохранения меню обновляется сразу.</p>
    </form>
  );
}
