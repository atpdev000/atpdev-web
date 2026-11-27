import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const OAUTH_STATE_COOKIE = 'colorear_oauth_state';

export type OAuthProvider = 'google';

export interface OAuthProfile {
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://colorear.atpdev.dev').replace(/\/+$/, '');
}

export function getGoogleOAuthConfig() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const configured =
    Boolean(clientId && clientSecret) &&
    !clientId.includes('PENDIENTE') &&
    !clientSecret.includes('PENDIENTE');
  return {
    configured,
    clientId,
    clientSecret,
    redirectUri: `${getSiteUrl()}/api/auth/oauth/callback/google`,
  };
}

function getStateSecret(): string {
  return (
    process.env.COLOREAR_JWT_SECRET ||
    process.env.SORTEOS_JWT_SECRET ||
    'dev-only-colorear-oauth-state-secret'
  );
}

export function sanitizeReturnTo(raw?: string | null): string {
  if (!raw) return '/cuenta';
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/cuenta';
  return trimmed.slice(0, 180);
}

export function createSignedOAuthState(returnTo: string): string {
  const payloadObj = {
    p: 'google',
    r: sanitizeReturnTo(returnTo),
    n: randomBytes(12).toString('hex'),
    t: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySignedOAuthState(stateToken: string): { returnTo: string } | null {
  try {
    const [payload, sig] = stateToken.split('.');
    if (!payload || !sig) return null;
    const expectedSig = createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      p?: string;
      r?: string;
      t?: number;
    };
    if (decoded.p !== 'google') return null;
    if (!decoded.t || Date.now() - decoded.t > 10 * 60 * 1000) return null; // 10 min max
    return { returnTo: sanitizeReturnTo(decoded.r) };
  } catch {
    return null;
  }
}

export function buildGoogleAuthorizeUrl(state: string): string | null {
  const cfg = getGoogleOAuthConfig();
  if (!cfg.configured) return null;

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCodeForProfile(
  code: string
): Promise<{ profile: OAuthProfile | null; errorReason?: string }> {
  const cfg = getGoogleOAuthConfig();
  if (!cfg.configured) {
    return { profile: null, errorReason: 'not_configured' };
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri: cfg.redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
      signal: AbortSignal.timeout(15000),
    });

    const tokenJson = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
      error?: string;
    };
    if (!tokenRes.ok || !tokenJson.access_token) {
      return { profile: null, errorReason: tokenJson.error || 'google_token_failed' };
    }

    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      signal: AbortSignal.timeout(12000),
    });
    const info = (await infoRes.json().catch(() => ({}))) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!infoRes.ok || !info.sub || !info.email) {
      return { profile: null, errorReason: 'google_userinfo_failed' };
    }

    return {
      profile: {
        provider: 'google',
        providerUserId: info.sub,
        email: info.email.toLowerCase(),
        name: info.name || info.email.split('@')[0],
        avatarUrl: info.picture,
      },
    };
  } catch {
    return { profile: null, errorReason: 'network_error' };
  }
}
