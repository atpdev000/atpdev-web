import { NextRequest, NextResponse } from 'next/server';
import { getPlanById } from '@/lib/plans';
import { verifyStripeWebhookSignature } from '@/lib/server/crypto';
import { markOrderPaidByMatcher } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const rawBody = await req.text().catch(() => '');

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET no configurado en el servidor.' },
      { status: 503 }
    );
  }

  const sig = req.headers.get('stripe-signature') || '';
  if (!verifyStripeWebhookSignature(rawBody, sig, webhookSecret)) {
    return NextResponse.json({ error: 'Firma Stripe inválida o expirada.' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  if (event?.type === 'checkout.session.completed') {
    const obj = event?.data?.object || {};
    const sessionId = String(obj.id || '');
    const meta = obj.metadata || {};
    const userId = String(meta.userId || obj.client_reference_id || '');
    const planId = String(meta.planId || 'creador').toLowerCase();
    const billingCycle = (meta.billingCycle || 'one_time') as 'one_time' | 'monthly' | 'annual';
    const plan = getPlanById(planId);

    if (sessionId && userId && plan && plan.id !== 'free') {
      const result = markOrderPaidByMatcher(
        { stripeSessionId: sessionId },
        {
          userId,
          planId: plan.id,
          credits: plan.credits,
          amountUsd: billingCycle === 'annual' ? plan.priceUsdAnnual : plan.priceUsdMonthly,
          amountPen: billingCycle === 'annual' ? plan.pricePenAnnual : plan.pricePenMonthly,
          billingCycle,
          stripeSessionId: sessionId,
        }
      );

      if (result) {
        return NextResponse.json({
          received: true,
          alreadyPaid: result.alreadyPaid,
          orderCode: result.order.orderCode,
          credits: result.user.credits,
        });
      }
    }
  }

  return NextResponse.json({ received: true, ignored: event?.type || 'unknown' });
}

