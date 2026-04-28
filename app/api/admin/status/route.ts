import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/server/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const authorized = await isAdminAuthorized();

  return NextResponse.json(
    {
      authorized,
      blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN)
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}
