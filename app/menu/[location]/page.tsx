import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicMenuByLocationCode } from '@/lib/menu-data';

export const revalidate = 0;

export default async function LocationMenuPage({ params }: { params: { location: string } }) {
  const data = await getPublicMenuByLocationCode(params.location);
  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-[#f5f4f1] p-3 sm:p-6">
      <div className="mx-auto max-w-5xl border border-neutral-200 bg-white p-4 sm:p-6">
        <header className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{data.location.code}</p>
            <h1 className="text-3xl font-semibold">меню</h1>
            <p className="text-sm text-neutral-600">{data.location.address}</p>
          </div>
          <Link href="/" className="text-sm text-[#ac4e16] underline">
            сменить точку
          </Link>
        </header>

        <div className="space-y-6">
          {data.categories.map((category) => (
            <section key={category.id}>
              <h2 className="mb-3 border-b border-neutral-200 pb-1 text-xl font-semibold">{category.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.products.map((product: any) => (
                  <article key={product.id} className="border border-neutral-200 p-3">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt={product.name} className="mb-2 h-40 w-full object-cover" />
                    ) : null}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-lg font-semibold">{product.locationPrice.price} ₽</p>
                    </div>
                    {product.locationPrice.old_price ? (
                      <p className="text-sm text-neutral-400 line-through">{product.locationPrice.old_price} ₽</p>
                    ) : null}
                    {product.short_description ? <p className="mt-1 text-sm text-neutral-700">{product.short_description}</p> : null}
                    {product.composition ? <p className="mt-1 text-xs text-neutral-500">Состав: {product.composition}</p> : null}
                    <p className="mt-2 text-xs text-neutral-500">
                      КБЖУ: {product.calories ?? '—'} / {product.proteins ?? '—'} / {product.fats ?? '—'} / {product.carbs ?? '—'}
                    </p>
                    <p className="text-xs text-neutral-500">{product.weight || product.volume || '—'}</p>
                    {!product.locationPrice.is_available ? <p className="mt-1 text-xs text-neutral-400">Временно недоступно</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
