import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const OAUTH_STATE_COOKIE = 'colorear_oauth_state';

export type OAuthProvider = 'google' | 'facebook';

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

export function getOAuthConfig(provider: OAuthProvider) {
  if (provider === 'google') {
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

  const clientId = (process.env.META_APP_ID || process.env.FACEBOOK_APP_ID || '').trim();
  const clientSecret = (process.env.META_APP_SECRET || process.env.FACEBOOK_APP_SECRET || '').trim();
  const configured =
    Boolean(clientId && clientSecret) &&
    !clientId.includes('PENDIENTE') &&
    !clientSecret.includes('PENDIENTE');
  return {
    configured,
    clientId,
    clientSecret,
    redirectUri: `${getSiteUrl()}/api/auth/oauth/callback/facebook`,
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

export function createSignedOAuthState(provider: OAuthProvider, returnTo: string): string {
  const payloadObj = {
    p: provider,
    r: sanitizeReturnTo(returnTo),
    n: randomBytes(12).toString('hex'),
    t: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySignedOAuthState(
  stateToken: string,
  expectedProvider: OAuthProvider
): { returnTo: string } | null {
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
    if (decoded.p !== expectedProvider) return null;
    if (!decoded.t || Date.now() - decoded.t > 10 * 60 * 1000) return null; // 10 min max
    return { returnTo: sanitizeReturnTo(decoded.r) };
  } catch {
    return null;
  }
}

export function buildAuthorizeUrl(provider: OAuthProvider, state: string): string | null {
  const cfg = getOAuthConfig(provider);
  if (!cfg.configured) return null;

  if (provider === 'google') {
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

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  });
  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}

export async function exchangeCodeForProfile(
  provider: OAuthProvider,
  code: string
): Promise<{ profile: OAuthProfile | null; errorReason?: string }> {
  const cfg = getOAuthConfig(provider);
  if (!cfg.configured) {
    return { profile: null, errorReason: 'not_configured' };
  }

  try {
    if (provider === 'google') {
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
    }

    // Facebook / Meta Graph API v21.0
    const tokenParams = new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: cfg.redirectUri,
      code,
    });
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`,
      { signal: AbortSignal.timeout(15000) }
    );
    const tokenJson = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
      error?: { message?: string };
    };
    if (!tokenRes.ok || !tokenJson.access_token) {
      return { profile: null, errorReason: 'facebook_token_failed' };
    }

    const meRes = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(tokenJson.access_token)}`,
      { signal: AbortSignal.timeout(12000) }
    );
    const info = (await meRes.json().catch(() => ({}))) as {
      id?: string;
      name?: string;
      email?: string;
      picture?: { data?: { url?: string } };
    };
    if (!meRes.ok || !info.id) {
      return { profile: null, errorReason: 'facebook_profile_failed' };
    }

    const resolvedEmail = (info.email || `fb_${info.id}@facebook.colorear.atpdev.dev`).toLowerCase();
    return {
      profile: {
        provider: 'facebook',
        providerUserId: info.id,
        email: resolvedEmail,
        name: info.name || 'Usuario Facebook',
        avatarUrl: info.picture?.data?.url,
      },
    };
  } catch {
    return { profile: null, errorReason: 'network_error' };
  }
}
