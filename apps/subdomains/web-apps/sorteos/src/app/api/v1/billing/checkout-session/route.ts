import { NextRequest } from 'next/server';
import { PRICING_PLANS } from '@/lib/types';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/billing/checkout-session { planId, billingCycle } — RF-028.
 * Solo crea sesiones Stripe cuando STRIPE_SECRET_KEY (real) y STRIPE_PRICE_* existen.
 * Nunca devuelve un éxito simulado que active planes gratis.
 */
export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const planId = cleanStr(body.planId, 20);
  const billingCycle = cleanStr(body.billingCycle, 20) || 'monthly';
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return fail('Plan no encontrado.', 404);

  if (plan.id === 'free') {
    const u = db.users.get(auth.userId);
    if (u) {
      u.plan = 'free';
      db.users.set(u);
    }
    audit(auth.userId, 'billing.downgrade', 'subscription', auth.userId, { plan: 'free' });
    return ok({ message: 'Plan Free activado.', url: '/dashboard' });
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  const hasRealStripeKey =
    (stripeKey.startsWith('sk_live_') || stripeKey.startsWith('sk_test_')) &&
    stripeKey.length > 24 &&
    !/placeholder|dummy|xxx/i.test(stripeKey);
  const priceId = (process.env[`STRIPE_PRICE_${plan.id.toUpperCase()}_${billingCycle.toUpperCase()}`] || '').trim();
  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

  if (!hasRealStripeKey || !priceId.startsWith('price_')) {
    return fail('Checkout directo API Stripe no configurado; usa la pasarela Yape/Plin, MercadoPago QR o Stripe Payment Links.', 400);
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sorteos.atpdev.dev';
    const params = new URLSearchParams({
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan.id}`,
      cancel_url: `${appUrl}/planes?payment=cancelled`,
      'metadata[userId]': auth.userId,
      'metadata[planId]': plan.id,
      client_reference_id: auth.userId,
    });
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    });
    const session = (await res.json().catch(() => ({}))) as { id?: string; url?: string; error?: { message?: string } };
    if (!res.ok || !session.url) {
      logEvent('billing.checkout_failed', { userId: auth.userId, plan: plan.id, status: res.status });
      return fail(`Stripe rechazó la sesión: ${session.error?.message || res.status}.`, 502);
    }
    audit(auth.userId, 'billing.checkout', 'subscription', auth.userId, { plan: plan.id, session: session.id });
    logEvent('billing.checkout', { userId: auth.userId, plan: plan.id, amount: price, mode: 'live' });
    return ok({
      sessionId: session.id,
      url: session.url,
      plan: plan.name,
      planId: plan.id,
      amount: price,
      currency: 'USD',
      billingCycle,
      provider: 'stripe',
      mode: 'live',
    });
  } catch (e) {
    logEvent('billing.checkout_error', { userId: auth.userId, plan: plan.id, error: String(e) });
    return fail('Error contactando a Stripe.', 502);
  }
}
