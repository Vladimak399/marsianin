import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/products" className="border border-neutral-200 p-4 hover:border-[#ff8a42]">
          <h2 className="font-semibold">Меню</h2>
          <p className="text-sm text-neutral-600">Продукты, цены, наличие.</p>
        </Link>
        <Link href="/admin/categories" className="border border-neutral-200 p-4 hover:border-[#ff8a42]">
          <h2 className="font-semibold">Категории</h2>
          <p className="text-sm text-neutral-600">Названия и порядок.</p>
        </Link>
        <Link href="/admin/locations" className="border border-neutral-200 p-4 hover:border-[#ff8a42]">
          <h2 className="font-semibold">Точки</h2>
          <p className="text-sm text-neutral-600">Адреса и часы работы.</p>
        </Link>
      </div>
    </AdminShell>
  );
}
