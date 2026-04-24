import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'marsianin_admin_session';
const ONE_DAY = 60 * 60 * 24;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createSessionToken(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + ONE_DAY;
  const payload = `${email}|${expiresAt}`;
  const signature = sign(payload);
  return `${payload}|${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false;

  const [email, expiresAtRaw, signature] = token.split('|');
  if (!email || !expiresAtRaw || !signature) return false;

  const payload = `${email}|${expiresAtRaw}`;
  const expected = sign(payload);

  try {
    const ok = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) return false;
  } catch {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  return Number.isFinite(expiresAt) && Math.floor(Date.now() / 1000) < expiresAt;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_DAY
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function validateCredentials(email: string, password: string) {
  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;
  return Boolean(allowedEmail && allowedPassword && email === allowedEmail && password === allowedPassword);
}
