import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'marsianin_admin_session';

const DEV_ADMIN_LOGIN = 'admin';
const DEV_ADMIN_PASSWORD = 'mars2026';
const DEV_ADMIN_SESSION_SECRET = 'marsianin-session-secret';

const isProduction = process.env.NODE_ENV === 'production';

const getAdminEnv = (key: 'ADMIN_LOGIN' | 'ADMIN_PASSWORD' | 'ADMIN_SESSION_SECRET', developmentFallback: string) => {
  const value = process.env[key];
  if (value) return value;

  if (!isProduction) return developmentFallback;

  throw new Error(`Missing required admin auth environment variable: ${key}`);
};

const getAdminConfig = () => ({
  login: getAdminEnv('ADMIN_LOGIN', DEV_ADMIN_LOGIN),
  password: getAdminEnv('ADMIN_PASSWORD', DEV_ADMIN_PASSWORD),
  sessionSecret: getAdminEnv('ADMIN_SESSION_SECRET', DEV_ADMIN_SESSION_SECRET)
});

const hashToken = (login: string, password: string, sessionSecret: string) =>
  createHash('sha256').update(`${login}:${password}:${sessionSecret}`).digest('hex');

const expectedToken = () => {
  const { login, password, sessionSecret } = getAdminConfig();
  return hashToken(login, password, sessionSecret);
};

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const validateAdminCredentials = (login: string, password: string) => {
  const { sessionSecret } = getAdminConfig();
  return safeCompare(hashToken(login.trim(), password, sessionSecret), expectedToken());
};

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
