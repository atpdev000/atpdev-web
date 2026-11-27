import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/session';
import { listOrdersByUser, sanitizeUser } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null, orders: [] });
  }
  return NextResponse.json({
    authenticated: true,
    user: sanitizeUser(user),
    orders: listOrdersByUser(user.id),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}

