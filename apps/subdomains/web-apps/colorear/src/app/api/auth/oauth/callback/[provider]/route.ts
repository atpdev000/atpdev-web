import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import {
  exchangeGoogleCodeForProfile,
  getSiteUrl,
  OAUTH_STATE_COOKIE,
  verifySignedOAuthState,
} from '@/lib/server/oauth';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { upsertGoogleOAuthUser } from '@/lib/server/store';
import { attachSessionCookie } from '@/lib/server/session';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const provider = rawProvider.toLowerCase();
  const siteUrl = getSiteUrl();

  if (provider !== 'google') {
    return NextResponse.redirect(`${siteUrl}/cuenta?oauth_error=invalid_provider`);
  }

  const url = req.nextUrl;
  const oauthErr = url.searchParams.get('error');
  if (oauthErr) {
    return NextResponse.redirect(`${siteUrl}/cuenta?oauth_error=${encodeURIComponent(oauthErr)}`);
  }

  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state') || '';
  const stateCookie = req.cookies.get(OAUTH_STATE_COOKIE)?.value || '';

  if (!code || !stateParam || !stateCookie || stateParam !== stateCookie) {
    return NextResponse.redirect(`${siteUrl}/cuenta?oauth_error=invalid_state`);
  }

  const verifiedState = verifySignedOAuthState(stateParam);
  if (!verifiedState) {
    return NextResponse.redirect(`${siteUrl}/cuenta?oauth_error=expired_state`);
  }

  const { profile, errorReason } = await exchangeGoogleCodeForProfile(code);
  if (!profile) {
    return NextResponse.redirect(
      `${siteUrl}/cuenta?oauth_error=${encodeURIComponent(errorReason || 'exchange_failed')}`
    );
  }

  const { hash, salt } = hashPassword(`oauth-google-${randomBytes(24).toString('hex')}`);
  const { user, isNew } = upsertGoogleOAuthUser({
    googleUserId: profile.providerUserId,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    passwordHash: hash,
    salt,
  });

  const token = signJwt(user.id, user.email, user.role);
  const targetPath = verifiedState.returnTo || '/cuenta';
  const sep = targetPath.includes('?') ? '&' : '?';
  const redirectUrl = `${siteUrl}${targetPath}${sep}oauth=google&welcome=${isNew ? '1' : '0'}`;

  const res = NextResponse.redirect(redirectUrl);
  attachSessionCookie(res, token);
  res.cookies.set(OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}
