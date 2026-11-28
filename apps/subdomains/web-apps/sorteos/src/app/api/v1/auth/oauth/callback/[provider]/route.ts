import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { audit, fail, logEvent, ok } from '@/lib/server/http';

/**
 * GET /api/v1/auth/oauth/callback/:provider?code=… — RF-002.
 * Con GOOGLE_CLIENT_SECRET/META_APP_SECRET: intercambia el code en server-side
 * y vincula el email real. Sin secretos: modo mock-verified con auditoría completa.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const validProviders = ['google', 'facebook', 'x', 'twitter', 'tiktok', 'instagram', 'threads'];
  if (!validProviders.includes(provider)) return fail('Proveedor no soportado.', 400);
  const code = new URL(req.url).searchParams.get('code');
  if (!code) return fail('Código OAuth ausente.', 400);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const redirectUri = `${appUrl}/api/v1/auth/oauth/callback/${provider}`;
  const { exchangeOAuthCode } = await import('@/lib/server/socialProviders');
  const live = await exchangeOAuthCode(provider === 'google' ? 'google' : 'meta', code, redirectUri);
  const state = new URL(req.url).searchParams.get('state');

  // Si no se obtuvo sesión oficial OAuth con correo real de Google/Meta, jamás fabricar un usuario ficticio con plan pagado
  if (!live || !live.email) {
    if (code.startsWith('dev_') && process.env.NODE_ENV !== 'production') {
      return NextResponse.redirect(`${appUrl}/auth/login/${provider}?popup=true${state ? `&returnTo=${encodeURIComponent(state)}` : ''}`);
    }
    return NextResponse.redirect(`${appUrl}/login?oauth_error=1&provider=${encodeURIComponent(provider)}`);
  }

  const mode = 'live';

  const providerNames: Record<string, string> = {
    google: 'Google',
    facebook: 'Facebook',
    x: 'X (Twitter)',
    twitter: 'X (Twitter)',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    threads: 'Threads',
  };
  const providerName = providerNames[provider] || provider;
  const email = live.email.trim().toLowerCase();
  let id = db.usersByEmail.get(email);
  if (!id) {
    id = uid('usr');
    const { hash, salt } = hashPassword(`oauth-${provider}-${code}-${Date.now()}`);
    const now = new Date().toISOString();
    db.users.set({
      id,
      name: live.name || `Usuario ${providerName}`,
      email,
      passwordHash: hash,
      salt,
      role: 'user',
      status: 'active',
      plan: 'free',
      language: 'es',
      createdAt: now,
      updatedAt: now,
    });
    db.usersByEmail.set(email, id);
  }
  const user = db.users.get(id)!;
  if (live?.name && (user.name.startsWith('Usuario ') || user.name === 'Creador Demo')) {
    user.name = live.name;
  }

  // Sincronizar inmediatamente con @atpdev/database para reflejo en panel de administración
  try {
    const { syncRealSorteosUser } = await import('@atpdev/database');
    await syncRealSorteosUser({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan as any,
      status: user.status as any,
    });
  } catch {
    // noop
  }

  // Vincular la red social oficial correspondiente al usuario real
  let socialPlatform: 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads' = 'facebook';
  if (provider === 'google') socialPlatform = 'youtube';
  else if (provider === 'x' || provider === 'twitter') socialPlatform = 'x';
  else if (provider === 'tiktok') socialPlatform = 'tiktok';
  else if (provider === 'instagram') socialPlatform = 'instagram';
  else if (provider === 'threads') socialPlatform = 'threads';
  const existingAcc = db.socialAccounts.list().find((a) => a.userId === id && a.platform === socialPlatform);
  if (!existingAcc) {
    const accId = uid('acc');
    const now = new Date().toISOString();
    const handle = `@${email.split('@')[0]}`;
    const accName = live?.name ? `${live.name} (${socialPlatform === 'youtube' ? 'YouTube' : 'Facebook'})` : `Cuenta ${socialPlatform}`;
    const { encryptToken } = await import('@/lib/server/crypto');
    db.socialAccounts.set({
      id: accId,
      userId: id,
      platform: socialPlatform,
      name: accName,
      handle,
      encryptedToken: encryptToken(live?.accessToken || `oauth-${socialPlatform}-${code}`),
      status: 'connected',
      scopes: ['public_profile', 'comments_read'],
      connectedAt: now,
      expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    });
  } else if (live?.accessToken) {
    const { encryptToken } = await import('@/lib/server/crypto');
    existingAcc.encryptedToken = encryptToken(live.accessToken);
    existingAcc.status = 'connected';
    existingAcc.expiresAt = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();
    db.socialAccounts.set(existingAcc);
  }

  audit(id, 'user.oauth_login', 'user', id, { provider, mode });
  logEvent('auth.oauth', { provider, userId: id, mode });

  const token = signJwt(user.id, user.email, user.role);

  // Si se envió un state (ej. /sorteos/nuevo?platform=facebook&postUrl=...), retornar a esa página
  const targetBase = state && (state.startsWith('/') || state.startsWith('http'))
    ? (state.startsWith('/') ? `${appUrl}${state}` : state)
    : `${appUrl}/dashboard`;

  const sep = targetBase.includes('?') ? '&' : '?';
  const finalRedirect = `${targetBase}${sep}oauth=${provider}&token=${token}&accountConnected=true`;

  const response = NextResponse.redirect(finalRedirect);
  response.cookies.set('sorteos_jwt', token, { path: '/', httpOnly: false, maxAge: 30 * 24 * 3600 });
  return response;
}
