import { NextResponse } from 'next/server';
import { setAdminSessionCookie, validateAdminCredentials } from '@/lib/server/adminAuth';

export async function POST(request: Request) {
  const { login, password } = await request.json().catch(() => ({ login: '', password: '' }));

  if (!validateAdminCredentials(String(login ?? ''), String(password ?? ''))) {
    return NextResponse.json({ message: 'Неверный логин или пароль' }, { status: 401 });
  }

  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
