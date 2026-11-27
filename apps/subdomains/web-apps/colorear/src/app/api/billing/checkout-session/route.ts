import { NextRequest, NextResponse } from 'next/server';
import { getPlanById } from '@/lib/plans';
import { getAuthenticatedUser } from '@/lib/server/session';
import { createOrder } from '@/lib/server/store';

/**
 * POST /api/billing/checkout-session { planId, billingCycle }
 * Mismo motor directo Stripe REST que Sorteos Pro (sin SDK externo):
 * - Si STRIPE_SECRET_KEY está configurado: crea Checkout Session real en USD
 *   (usando STRIPE_PRICE_<PLAN>_<CYCLE> si existe, o price_data automático).
 * - Si aún no hay STRIPE_SECRET_KEY: responde indicando que use el canal Yape/Plin
 *   o que falta activar la clave Stripe en el servidor (nunca regala créditos sin pago).
 */
export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      { error: 'Inicia sesión o crea tu cuenta gratis antes de comprar créditos.' },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const planId = String(body.planId || '').toLowerCase();
  const billingCycleRaw = String(body.billingCycle || 'monthly').toLowerCase();
  const plan = getPlanById(planId);

  if (!plan || plan.id === 'free') {
    return NextResponse.json({ error: 'Selecciona un plan de pago válido.' }, { status: 400 });
  }

  const billingCycle: 'one_time' | 'monthly' | 'annual' =
    plan.mode === 'payment'
      ? 'one_time'
      : billingCycleRaw === 'annual'
        ? 'annual'
        : 'monthly';

  const amountUsd =
    billingCycle === 'annual' ? plan.priceUsdAnnual : plan.priceUsdMonthly;
  const amountPen =
    billingCycle === 'annual' ? plan.pricePenAnnual : plan.pricePenMonthly;

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://colorear.atpdev.dev';

  if (!stripeKey) {
    return NextResponse.json({
      mode: 'yape_recommended',
      stripeConfigured: false,
      planId: plan.id,
      billingCycle,
      amountUsd,
      amountPen,
      credits: plan.credits,
      message:
        'El pago automático con tarjeta Stripe se activa al configurar STRIPE_SECRET_KEY. Mientras tanto puedes pagar al instante por Yape o Plin (S/ ' +
        amountPen +
        ').',
    });
  }

  try {
    const priceEnvKey = `STRIPE_PRICE_COLOREAR_${plan.id.toUpperCase()}_${billingCycle.toUpperCase()}`;
    const configuredPriceId = process.env[priceEnvKey]?.trim();
    const isSub = plan.mode === 'subscription';

    const params = new URLSearchParams({
      mode: isSub ? 'subscription' : 'payment',
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${siteUrl}/cuenta?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan.id}`,
      cancel_url: `${siteUrl}/planes?payment=cancelled`,
      'metadata[userId]': user.id,
      'metadata[planId]': plan.id,
      'metadata[billingCycle]': billingCycle,
      'metadata[credits]': String(plan.credits),
      'line_items[0][quantity]': '1',
    });

    if (configuredPriceId) {
      params.set('line_items[0][price]', configuredPriceId);
    } else {
      params.set('line_items[0][price_data][currency]', 'usd');
      params.set('line_items[0][price_data][unit_amount]', String(Math.round(amountUsd * 100)));
      params.set(
        'line_items[0][price_data][product_data][name]',
        `Colorear Pro — ${plan.es.name} (${plan.credits} créditos IA)`
      );
      params.set(
        'line_items[0][price_data][product_data][description]',
        plan.es.tagline
      );
      if (isSub) {
        params.set(
          'line_items[0][price_data][recurring][interval]',
          billingCycle === 'annual' ? 'year' : 'month'
        );
      }
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      signal: AbortSignal.timeout(20000),
    });

    const session = (await res.json().catch(() => ({}))) as {
      id?: string;
      url?: string;
      error?: { message?: string };
    };

    if (!res.ok || !session.url || !session.id) {
      return NextResponse.json(
        { error: `Stripe rechazó la sesión: ${session.error?.message || res.status}` },
        { status: 502 }
      );
    }

    const order = createOrder({
      userId: user.id,
      userEmail: user.email,
      planId: plan.id,
      billingCycle,
      credits: plan.credits,
      amountUsd,
      amountPen,
      method: 'stripe',
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      mode: 'live',
      stripeConfigured: true,
      sessionId: session.id,
      orderCode: order.orderCode,
      url: session.url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error conectando con Stripe.' },
      { status: 502 }
    );
  }
}

