import { NextResponse } from 'next/server';
import { setAdminSessionCookie, validateAdminCredentials } from '@/lib/server/adminAuth';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const globalForLoginRateLimit = globalThis as typeof globalThis & {
  marsianinLoginAttempts?: Map<string, LoginAttempt>;
};

const loginAttempts = globalForLoginRateLimit.marsianinLoginAttempts ?? new Map<string, LoginAttempt>();
globalForLoginRateLimit.marsianinLoginAttempts = loginAttempts;

const getClientKey = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  return forwardedFor || realIp || 'unknown';
};

const isRateLimited = (key: string) => {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return false;
  }

  return attempt.count >= MAX_ATTEMPTS;
};

const recordFailedAttempt = (key: string) => {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  loginAttempts.set(key, { ...attempt, count: attempt.count + 1 });
};

const clearFailedAttempts = (key: string) => {
  loginAttempts.delete(key);
};

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { message: 'Слишком много попыток входа. Подождите 10 минут и попробуйте снова' },
      { status: 429 }
    );
  }

  const { login, password } = await request.json().catch(() => ({ login: '', password: '' }));

  if (!validateAdminCredentials(String(login ?? ''), String(password ?? ''))) {
    recordFailedAttempt(clientKey);
    return NextResponse.json({ message: 'Неверный логин или пароль' }, { status: 401 });
  }

  clearFailedAttempts(clientKey);
  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
