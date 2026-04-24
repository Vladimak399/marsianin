import { redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import { saveCategoryAction } from '@/app/admin/actions';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getCategories } from '@/lib/menu-data';

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const categories = await getCategories();

  return (
    <AdminShell title="Категории">
      <div className="space-y-3">
        {categories.map((category) => (
          <form key={category.id} action={saveCategoryAction} className="grid gap-2 border border-neutral-200 p-3 sm:grid-cols-6">
            <input type="hidden" name="id" value={category.id} />
            <input name="name" defaultValue={category.name} className="border border-neutral-300 px-2 py-1" />
            <input name="slug" defaultValue={category.slug} className="border border-neutral-300 px-2 py-1" />
            <input name="description" defaultValue={category.description ?? ''} className="border border-neutral-300 px-2 py-1" />
            <input name="sort_order" type="number" defaultValue={category.sort_order} className="border border-neutral-300 px-2 py-1" />
            <label className="text-sm"><input type="checkbox" name="is_active" defaultChecked={category.is_active} /> Активна</label>
            <button className="sm:col-span-6 justify-self-start bg-[#ff8a42] px-3 py-1 text-white">Сохранить</button>
          </form>
        ))}

        <form action={saveCategoryAction} className="grid gap-2 border border-neutral-300 bg-neutral-50 p-3 sm:grid-cols-6">
          <input name="name" placeholder="Новая категория" className="border border-neutral-300 px-2 py-1" />
          <input name="slug" placeholder="slug" className="border border-neutral-300 px-2 py-1" />
          <input name="description" placeholder="Описание" className="border border-neutral-300 px-2 py-1" />
          <input name="sort_order" type="number" defaultValue={0} className="border border-neutral-300 px-2 py-1" />
          <label className="text-sm"><input type="checkbox" name="is_active" defaultChecked /> Активна</label>
          <button className="sm:col-span-6 justify-self-start bg-neutral-900 px-3 py-1 text-white">Добавить</button>
        </form>
      </div>
    </AdminShell>
  );
}
