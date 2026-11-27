import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/session';
import { getColorearPaymentsConfig } from '@/lib/server/ecosystemPayments';
import { redeemLicenseForUser, sanitizeUser } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      { error: 'Inicia sesión con Google o correo antes de canjear tu código de licencia.' },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const rawCode = String(body.code || '').trim().toUpperCase();
  if (rawCode.length < 4) {
    return NextResponse.json({ error: 'Ingresa un código de licencia válido.' }, { status: 400 });
  }

  const cfg = getColorearPaymentsConfig();
  if (!cfg.licenseKeys.includes(rawCode)) {
    return NextResponse.json(
      {
        error:
          'Código de licencia no válido o expirado. Verifica tu clave o escríbenos por WhatsApp.',
      },
      { status: 400 }
    );
  }

  const isEditorial = rawCode.includes('EDITORIAL') || rawCode.includes('400') || rawCode.includes('VIP');
  const planId = isEditorial ? 'editorial' : 'creador';
  const credits = isEditorial ? cfg.editorialCredits : cfg.kdpCredits;

  const result = redeemLicenseForUser({
    userId: user.id,
    licenseCode: rawCode,
    planId,
    credits,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    planId,
    creditsAdded: credits,
    orderCode: result.order.orderCode,
    user: sanitizeUser(result.user),
    message: `¡Licencia activada! Se acreditaron +${credits} créditos a tu cuenta (${result.order.orderCode}).`,
  });
}

