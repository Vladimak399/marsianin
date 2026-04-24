import { redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import { saveLocationAction } from '@/app/admin/actions';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getLocations } from '@/lib/menu-data';

export default async function AdminLocationsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const locations = await getLocations();

  return (
    <AdminShell title="Точки">
      <div className="space-y-3">
        {locations.map((location) => (
          <form key={location.id} action={saveLocationAction} className="grid gap-2 border border-neutral-200 p-3 sm:grid-cols-5">
            <input type="hidden" name="id" value={location.id} />
            <input value={location.code} disabled className="border border-neutral-200 bg-neutral-100 px-2 py-1" />
            <input name="name" defaultValue={location.name} className="border border-neutral-300 px-2 py-1" />
            <input name="address" defaultValue={location.address ?? ''} className="border border-neutral-300 px-2 py-1" />
            <input name="working_hours" defaultValue={location.working_hours ?? ''} className="border border-neutral-300 px-2 py-1" />
            <input name="sort_order" type="number" defaultValue={location.sort_order} className="border border-neutral-300 px-2 py-1" />
            <label className="text-sm"><input type="checkbox" name="is_active" defaultChecked={location.is_active} /> Активна</label>
            <button className="sm:col-span-5 justify-self-start bg-[#ff8a42] px-3 py-1 text-white">Сохранить</button>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
