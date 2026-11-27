import { NextRequest, NextResponse } from 'next/server';
import { getDynamicPlanById } from '@/lib/server/ecosystemPayments';
import { getAuthenticatedUser } from '@/lib/server/session';
import { createOrder } from '@/lib/server/store';

/**
 * POST /api/billing/yape-order
 * Registra una orden pagada por Yape o Plin (Perú / LATAM) con código de operación
 * y teléfono para validación rápida y acreditación directa al saldo del usuario.
 */
export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      { error: 'Inicia sesión o regístrate antes de registrar tu comprobante Yape/Plin.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const planId = String(body.planId || '').toLowerCase();
    const method = String(body.method || 'yape').toLowerCase() === 'plin' ? 'plin' : 'yape';
    const billingCycleRaw = String(body.billingCycle || 'monthly').toLowerCase();
    const operationCode = String(body.operationCode || '').trim().slice(0, 40);
    const payerPhone = String(body.payerPhone || '').trim().slice(0, 30);

    const plan = getDynamicPlanById(planId);
    if (!plan || plan.id === 'free') {
      return NextResponse.json({ error: 'Plan inválido.' }, { status: 400 });
    }
    if (operationCode.length < 4) {
      return NextResponse.json(
        { error: 'Ingresa el número de operación o referencia de tu pago (mínimo 4 caracteres).' },
        { status: 400 }
      );
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

    const order = createOrder({
      userId: user.id,
      userEmail: user.email,
      planId: plan.id,
      billingCycle,
      credits: plan.credits,
      amountUsd,
      amountPen,
      method,
      operationCode,
      payerPhone: payerPhone || undefined,
    });

    // Notificación opcional a Telegram si el servidor tiene bot configurado
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://colorear.atpdev.dev').replace(/\/+$/, '');
    if (tgToken && tgChat) {
      const msg = [
        `🎨 Nueva orden ${method.toUpperCase()} en Colorear Pro`,
        `Orden: ${order.orderCode}`,
        `Usuario: ${user.email}`,
        `Plan: ${plan.es.name} (+${plan.credits} créditos)`,
        `Monto: S/ ${amountPen} ($${amountUsd})`,
        `N° Operación: ${operationCode}`,
        payerPhone ? `Tel: ${payerPhone}` : '',
        `Aprobar en 1 clic: ${siteUrl}/admin-pagos`,
      ]
        .filter(Boolean)
        .join('\n');

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: msg }),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      order,
      message: `Orden ${order.orderCode} registrada correctamente. Verificaremos la operación ${operationCode} y acreditaremos +${plan.credits} créditos en tu cuenta.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Error al registrar tu orden Yape/Plin.' },
      { status: 500 }
    );
  }
}

