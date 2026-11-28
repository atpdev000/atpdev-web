import { NextRequest } from 'next/server';
import { getSubdomainConfig } from '@atpdev/database';
import { db, uid, SorteosOrderRecord } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

function numOr(val: unknown, fallback: number): number {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * POST /api/v1/billing/yape-order
 * Registra un comprobante Yape/Plin para validación y activación en 1 clic desde admin.atpdev.dev/dashboard/sorteos.
 */
export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const user = db.users.get(auth.userId);
  if (!user) {
    return fail('Inicia sesión antes de registrar tu comprobante de pago.', 401);
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const planIdRaw = cleanStr(body.planId, 20).toLowerCase();
  const billingCycle = cleanStr(body.billingCycle, 20).toLowerCase() === 'annual' ? 'annual' : 'monthly';
  const method = cleanStr(body.method, 10).toLowerCase() === 'plin' ? 'plin' : 'yape';
  const operationCode = cleanStr(body.operationCode, 40);
  const payerPhone = cleanStr(body.payerPhone, 30);

  if (planIdRaw !== 'pro' && planIdRaw !== 'business') {
    return fail('Plan inválido para comprobante Yape/Plin.', 400);
  }
  if (operationCode.length < 4) {
    return fail('Ingresa el número de operación de tu pago (mínimo 4 caracteres).', 400);
  }

  const pay = getSubdomainConfig('sorteos').payments || {};
  const amountUsd =
    planIdRaw === 'business'
      ? billingCycle === 'annual'
        ? numOr(pay.business_annual_price, 239.9)
        : numOr(pay.business_monthly_price, 24.99)
      : billingCycle === 'annual'
        ? numOr(pay.pro_annual_price, 95.9)
        : numOr(pay.pro_monthly_price, 9.99);

  const amountPen =
    planIdRaw === 'business'
      ? billingCycle === 'annual'
        ? numOr(pay.business_annual_price_pen, 890)
        : numOr(pay.business_monthly_price_pen, 92)
      : billingCycle === 'annual'
        ? numOr(pay.pro_annual_price_pen, 355)
        : numOr(pay.pro_monthly_price_pen, 37);

  const orderCode = `SRT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const order: SorteosOrderRecord = {
    id: uid('ord'),
    orderCode,
    userId: user.id,
    userEmail: user.email,
    planId: planIdRaw,
    billingCycle,
    amountUsd,
    amountPen,
    method,
    status: 'pending',
    operationCode,
    payerPhone: payerPhone || undefined,
    createdAt: new Date().toISOString(),
  };

  db.orders.set(order);
  audit(user.id, 'billing.yape_order_created', 'order', order.id, {
    orderCode,
    planId: planIdRaw,
    billingCycle,
    amountPen,
    operationCode,
  });
  logEvent('billing.yape_order', { userId: user.id, orderCode, planId: planIdRaw });

  // Notificación instantánea opcional a Telegram
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = [
      `🎁 Nueva orden ${method.toUpperCase()} en Sorteos Pro`,
      `Orden: ${orderCode}`,
      `Usuario: ${user.email}`,
      `Plan: ${planIdRaw.toUpperCase()} (${billingCycle})`,
      `Monto: S/ ${amountPen} ($${amountUsd})`,
      `N° Operación: ${operationCode}`,
      payerPhone ? `WhatsApp: ${payerPhone}` : '',
      `Aprobar en 1 clic: https://admin.atpdev.dev/dashboard/sorteos`,
    ]
      .filter(Boolean)
      .join('\n');

    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChat, text }),
    }).catch(() => {});
  }

  return ok({
    order,
    message: `Orden ${orderCode} registrada. Validaremos la operación ${operationCode} y activaremos tu plan ${planIdRaw.toUpperCase()} al instante.`,
  });
}

