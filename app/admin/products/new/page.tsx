import { redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import ProductForm from '@/app/admin/_components/ProductForm';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getCategories, getLocations } from '@/lib/menu-data';

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const [categories, locations] = await Promise.all([getCategories(), getLocations()]);

  return (
    <AdminShell title="Новый продукт">
      <ProductForm categories={categories} locations={locations} prices={[]} />
    </AdminShell>
  );
}
