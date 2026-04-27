import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/server/adminAuth';
import { readCatalogFromFile, writeCatalogToFile } from '@/lib/server/menuCatalogFile';
import { sanitizeMenuCatalog } from '@/lib/menuCatalog';

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
    const saved = await writeCatalogToFile(sanitizeMenuCatalog(catalog));
    return NextResponse.json({ catalog: saved });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Не удалось сохранить меню' },
      { status: 500 }
    );
  }
}
