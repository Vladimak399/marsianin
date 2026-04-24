import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'menu');
  await mkdir(uploadDir, { recursive: true });

  const extension = extensionByType[file.type] ?? 'jpg';
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const targetPath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  await writeFile(targetPath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/menu/${fileName}` });
}
