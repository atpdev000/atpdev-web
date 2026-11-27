import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './crypto';
import { findUserById, StoredUser } from './store';

export const SESSION_COOKIE_NAME = 'colorear_session';

export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    const t = auth.slice(7).trim();
    if (t) return t;
  }
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return cookie || null;
}

export function getAuthenticatedUser(req: NextRequest): StoredUser | null {
  const token = extractToken(req);
  if (!token) return null;
  const payload = verifyJwt(token);
  if (!payload) return null;
  return findUserById(payload.sub) || null;
}

export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}

