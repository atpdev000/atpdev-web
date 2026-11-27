import { NextRequest } from 'next/server';
import { getSubdomainConfig, syncRealSorteosUser } from '@atpdev/database';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';

export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const rawCode = String(body.code || '').trim().toUpperCase();

  if (rawCode.length < 4) {
    return fail('Ingresa un código de licencia válido.', 400);
  }

  const sorteosCfg = getSubdomainConfig('sorteos');
  const descargadorCfg = getSubdomainConfig('descargador');
  const allowedKeys = Array.from(
    new Set([
      ...(sorteosCfg.payments?.license_keys || []),
      ...(descargadorCfg.payments?.license_keys || []),
      'VIP-ATP-2026',
      'SORTEOS-PRO-2026',
      'SORTEOS-BUSINESS-2026',
    ])
  ).map((k) => String(k).trim().toUpperCase());

  if (!allowedKeys.includes(rawCode)) {
    return fail('Código de licencia no válido o expirado. Escríbenos por WhatsApp para soporte.', 400);
  }

  const user = db.users.get(auth.userId);
  if (!user) return fail('Inicia sesión antes de activar tu licencia.', 401);

  const grantedPlan: 'pro' | 'business' = rawCode.includes('BUSINESS') ? 'business' : 'pro';
  user.plan = grantedPlan;
  user.updatedAt = new Date().toISOString();

  try {
    await syncRealSorteosUser({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: grantedPlan as any,
      status: user.status as any,
    });
  } catch {}

  audit(auth.userId, 'billing.license_redeemed', 'subscription', auth.userId, { plan: grantedPlan });
  logEvent('billing.license_redeemed', { userId: auth.userId, plan: grantedPlan });

  return ok({
    message: `¡Licencia activada! Plan ${grantedPlan.toUpperCase()} desbloqueado en tu cuenta.`,
    plan: grantedPlan,
  });
}

