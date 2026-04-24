import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_LOGIN = process.env.ADMIN_LOGIN ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'mars2026';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'marsianin-session-secret';
const ADMIN_COOKIE_NAME = 'marsianin_admin_session';

const hashToken = (login: string, password: string) =>
  createHash('sha256').update(`${login}:${password}:${ADMIN_SESSION_SECRET}`).digest('hex');

const expectedToken = () => hashToken(ADMIN_LOGIN, ADMIN_PASSWORD);

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const validateAdminCredentials = (login: string, password: string) =>
  safeCompare(hashToken(login.trim(), password), expectedToken());

export const setAdminSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12
  });
};

export const clearAdminSessionCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });
};

export const isAdminAuthorized = async () => {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookieToken) return false;
  return safeCompare(cookieToken, expectedToken());
};
