import { NextRequest } from 'next/server';
import { syncRealSorteosUser } from '@atpdev/database';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/billing/confirm { planId, sessionId }
 * Seguridad estricta:
 * - Solo permite bajar a 'free' sin comprobación externa.
 * - Para 'pro' / 'business' / 'enterprise' exige verificación real contra Stripe Checkout Sessions API.
 */
export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const planId = cleanStr(body.planId || body.plan, 20).toLowerCase();
  const sessionId = cleanStr(body.sessionId, 120);

  if (!['free', 'pro', 'business', 'enterprise'].includes(planId)) {
    return fail('Plan inválido.', 400);
  }
  const user = db.users.get(auth.userId);
  if (!user) return fail('Usuario no encontrado.', 404);

  if (planId === 'free') {
    user.plan = 'free';
    user.updatedAt = new Date().toISOString();
    db.users.set(user);
    return ok({ message: 'Plan Free activo.', plan: 'free' });
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  const hasRealStripeKey =
    (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_')) &&
    stripeKey.length > 24 &&
    !/placeholder|dummy|xxx/i.test(stripeKey);

  if (!hasRealStripeKey || !sessionId.startsWith('cs_')) {
    return fail(
      'No se puede activar un plan pago sin verificación de pago. Usa Yape/Plin, MercadoPago QR, Tarjeta Stripe o tu clave privada de licencia.',
      402
    );
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
      signal: AbortSignal.timeout(15000),
    });
    const session = (await res.json().catch(() => ({}))) as {
      payment_status?: string;
      status?: string;
      client_reference_id?: string;
      metadata?: { userId?: string; planId?: string };
    };

    const ownerMatch =
      session.client_reference_id === user.id || session.metadata?.userId === user.id;
    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    if (!res.ok || !ownerMatch || !isPaid) {
      return fail('La sesión de Stripe aún no está pagada o no corresponde a tu cuenta.', 402);
    }

    const verifiedPlan = (session.metadata?.planId || planId) as 'pro' | 'business' | 'enterprise';
    user.plan = verifiedPlan;
    user.updatedAt = new Date().toISOString();
    db.users.set(user);
    try {
      await syncRealSorteosUser({
        id: user.id,
        name: user.name,
        email: user.email,
        plan: verifiedPlan as any,
        status: user.status as any,
      });
    } catch {}

    audit(auth.userId, 'billing.confirm_stripe', 'subscription', auth.userId, { plan: verifiedPlan, session: sessionId });
    logEvent('billing.confirm', { userId: auth.userId, plan: verifiedPlan });
    return ok({ message: `Plan ${verifiedPlan.toUpperCase()} verificado y activado.`, plan: verifiedPlan });
  } catch {
    return fail('Error verificando el pago con Stripe.', 502);
  }
}
