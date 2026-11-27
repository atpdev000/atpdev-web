import { NextRequest, NextResponse } from 'next/server';
import {
  buildGoogleAuthorizeUrl,
  createSignedOAuthState,
  getSiteUrl,
  OAUTH_STATE_COOKIE,
  sanitizeReturnTo,
} from '@/lib/server/oauth';

/**
 * GET /api/auth/oauth/[provider]
 * Redirige directamente a Google OAuth 2.0 con protección CSRF (`state` firmado).
 * Si se pasa `?format=json`, devuelve `{ authorizeUrl, configured }`.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const provider = rawProvider.toLowerCase();

  if (provider !== 'google') {
    return NextResponse.json(
      { error: 'Proveedor no soportado. Usa google.' },
      { status: 400 }
    );
  }

  const returnTo = sanitizeReturnTo(req.nextUrl.searchParams.get('returnTo'));
  const state = createSignedOAuthState(returnTo);
  const authorizeUrl = buildGoogleAuthorizeUrl(state);

  if (!authorizeUrl) {
    if (req.nextUrl.searchParams.get('format') === 'json') {
      return NextResponse.json({ provider: 'google', configured: false, authorizeUrl: null }, { status: 503 });
    }
    return NextResponse.redirect(`${getSiteUrl()}/cuenta?oauth_error=not_configured`);
  }

  if (req.nextUrl.searchParams.get('format') === 'json') {
    const res = NextResponse.json({ provider: 'google', configured: true, authorizeUrl });
    res.cookies.set(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 600,
    });
    return res;
  }

  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return res;
}
