import { NextRequest, NextResponse } from 'next/server';
import {
  listAllOrders,
  markOrderPaidByMatcher,
  rejectOrderByCode,
  sanitizeUser,
} from '@/lib/server/store';

function isAuthorizedAdmin(req: NextRequest): boolean {
  const secret = process.env.COLOREAR_ADMIN_SECRET?.trim();
  if (!secret || secret.length < 12) return false;
  const header =
    req.headers.get('x-admin-secret') ||
    (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  return header === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get('status') as 'pending' | 'paid' | 'rejected' | null;
  const orders = listAllOrders(status || undefined);
  return NextResponse.json({ count: orders.length, orders });
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orderCode = String(body.orderCode || '').trim();
  const action = String(body.action || 'approve').toLowerCase();

  if (!orderCode) {
    return NextResponse.json({ error: 'Falta orderCode (ej. COL-A1B2C3).' }, { status: 400 });
  }

  if (action === 'reject') {
    const rejected = rejectOrderByCode(orderCode, String(body.reason || 'Rechazada por verificación'));
    if (!rejected) {
      return NextResponse.json({ error: 'Orden no encontrada o ya pagada.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: rejected });
  }

  const result = markOrderPaidByMatcher({ orderCode });
  if (!result) {
    return NextResponse.json({ error: 'Orden no encontrada.' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    alreadyPaid: result.alreadyPaid,
    order: result.order,
    user: sanitizeUser(result.user),
  });
}

