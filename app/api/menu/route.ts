import { NextResponse } from 'next/server';
import { readCatalogFromFile } from '@/lib/server/menuCatalogFile';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const catalog = await readCatalogFromFile();
  return NextResponse.json(
    { catalog },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}
