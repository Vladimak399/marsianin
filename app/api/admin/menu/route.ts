import { NextResponse } from 'next/server';
import { LocationId, locations } from '@/data/locations';
import { MenuCategory } from '@/data/menu';
import { isAdminAuthorized } from '@/lib/server/adminAuth';
import { readCatalogFromFile, writeCatalogToFile } from '@/lib/server/menuCatalogFile';
import { sanitizeMenuCatalog } from '@/lib/menuCatalog';

const getCatalogWarnings = (catalog: MenuCategory[]) => {
  const warnings: string[] = [];

  catalog.forEach((category) => {
    if (!category.category.trim()) warnings.push('Есть категория без названия');
    if (category.items.length === 0) warnings.push(`Категория «${category.category}» пустая`);

    category.items.forEach((item) => {
      if (!item.name.trim()) warnings.push(`В категории «${category.category}» есть позиция без названия`);
      if (!item.description.trim()) warnings.push(`Позиция «${item.name || item.id}» без описания`);

      const hasAnyPrice = locations.some((location) => item.priceByLocation[location.id as LocationId] > 0);
      if (!hasAnyPrice) warnings.push(`Позиция «${item.name || item.id}» без цены во всех точках`);
    });
  });

  return Array.from(new Set(warnings));
};

export async function GET() {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const catalog = await readCatalogFromFile();
  return NextResponse.json({ catalog });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { catalog } = await request.json().catch(() => ({ catalog: null }));
    const normalizedCatalog = sanitizeMenuCatalog(catalog);
    const warnings = getCatalogWarnings(normalizedCatalog);
    const saved = await writeCatalogToFile(normalizedCatalog);
    return NextResponse.json({ catalog: saved, warnings });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Не удалось сохранить меню' },
      { status: 500 }
    );
  }
}
