import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/server/adminAuth';
import { importSeedCatalogToFile } from '@/lib/server/menuCatalogFile';

const getCatalogSummary = (catalog: Awaited<ReturnType<typeof importSeedCatalogToFile>>) => {
  const itemCount = catalog.reduce((sum, category) => sum + category.items.length, 0);
  return {
    categories: catalog.length,
    items: itemCount
  };
};

export async function POST() {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const catalog = await importSeedCatalogToFile();
    return NextResponse.json({ catalog, summary: getCatalogSummary(catalog) });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Не удалось загрузить seed-меню' },
      { status: 500 }
    );
  }
}
