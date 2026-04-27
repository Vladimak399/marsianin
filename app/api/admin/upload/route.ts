import { randomUUID } from 'crypto';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/server/adminAuth';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const extensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
};

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { message: 'Не настроен BLOB_READ_WRITE_TOKEN в Vercel Environment Variables' },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Файл не найден' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ message: 'Разрешены только JPG, PNG, WEBP или AVIF' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: 'Файл больше 5MB' }, { status: 400 });
  }

  const extension = extensionByType[file.type] ?? 'jpg';
  const fileName = `menu/${Date.now()}-${randomUUID()}.${extension}`;

  const blob = await put(fileName, file, {
    access: 'public',
    contentType: file.type
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
