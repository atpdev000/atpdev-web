import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server/session';
import { listOrdersByUser, sanitizeUser } from '@/lib/server/store';
import { getOAuthConfig } from '@/lib/server/oauth';

export async function GET(req: NextRequest) {
  const oauthProviders = {
    google: getOAuthConfig('google').configured,
    facebook: getOAuthConfig('facebook').configured,
  };
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.trim());

  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      orders: [],
      stripeConfigured,
      oauthProviders,
    });
  }
  return NextResponse.json({
    authenticated: true,
    user: sanitizeUser(user),
    orders: listOrdersByUser(user.id),
    stripeConfigured,
    oauthProviders,
  });
}
