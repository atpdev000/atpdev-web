import { NextRequest, NextResponse } from 'next/server';
import { getPlanById } from '@/lib/plans';
import { getAuthenticatedUser } from '@/lib/server/session';
import { markOrderPaidByMatcher, sanitizeUser } from '@/lib/server/store';

/**
 * POST /api/billing/confirm { sessionId }
 * Verifica directamente contra Stripe API si una sesión regresada desde Checkout
 * ya está pagada (`payment_status === 'paid'`) y acredita idempotente los créditos.
 */
export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const sessionId = String(body.sessionId || '').trim();
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!sessionId || !stripeKey) {
    return NextResponse.json(
      { error: 'Falta sessionId o configuración Stripe activa.' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${stripeKey}` },
        signal: AbortSignal.timeout(15000),
      }
    );
    const session = (await res.json().catch(() => ({}))) as any;
    if (!res.ok) {
      return NextResponse.json({ error: 'No se pudo verificar la sesión en Stripe.' }, { status: 400 });
    }

    const paid = session.payment_status === 'paid' || session.status === 'complete';
    if (!paid) {
      return NextResponse.json({ paid: false, status: session.payment_status || 'unpaid' });
    }

    const meta = session.metadata || {};
    const ownerId = String(meta.userId || session.client_reference_id || '');
    if (ownerId && ownerId !== user.id) {
      return NextResponse.json({ error: 'Esta sesión pertenece a otra cuenta.' }, { status: 403 });
    }

    const plan = getPlanById(String(meta.planId || 'creador'));
    const billingCycle = (meta.billingCycle || 'one_time') as 'one_time' | 'monthly' | 'annual';

    const result = markOrderPaidByMatcher(
      { stripeSessionId: sessionId },
      plan && plan.id !== 'free'
        ? {
            userId: user.id,
            planId: plan.id,
            credits: plan.credits,
            amountUsd: billingCycle === 'annual' ? plan.priceUsdAnnual : plan.priceUsdMonthly,
            amountPen: billingCycle === 'annual' ? plan.pricePenAnnual : plan.pricePenMonthly,
            billingCycle,
            stripeSessionId: sessionId,
          }
        : undefined
    );

    if (!result) {
      return NextResponse.json({ error: 'No se encontró la orden asociada.' }, { status: 404 });
    }

    return NextResponse.json({
      paid: true,
      alreadyPaid: result.alreadyPaid,
      orderCode: result.order.orderCode,
      user: sanitizeUser(result.user),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error al confirmar el pago.' },
      { status: 500 }
    );
  }
}

