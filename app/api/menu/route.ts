import { NextResponse } from 'next/server';
import { readCatalogFromFile } from '@/lib/server/menuCatalogFile';

export async function GET() {
  const catalog = await readCatalogFromFile();
  return NextResponse.json({ catalog });
}
