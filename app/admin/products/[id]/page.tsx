import { notFound, redirect } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import ProductForm from '@/app/admin/_components/ProductForm';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getCategories, getLocations, getProductLocationPrices, getProducts } from '@/lib/menu-data';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  const [products, categories, locations, allPrices] = await Promise.all([
    getProducts(),
    getCategories(),
    getLocations(),
    getProductLocationPrices()
  ]);

  const product = products.find((entry) => entry.id === params.id);
  if (!product) return notFound();

  const prices = allPrices.filter((entry) => entry.product_id === product.id);

  return (
    <AdminShell title={`Редактирование: ${product.name}`}>
      <ProductForm categories={categories} locations={locations} product={product} prices={prices} />
    </AdminShell>
  );
}
