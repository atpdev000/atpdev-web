import { NextResponse } from 'next/server';
import { getColorearPaymentsConfig } from '@/lib/server/ecosystemPayments';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cfg = getColorearPaymentsConfig();
  return NextResponse.json({
    stripeConfigured: cfg.stripeApiConfigured,
    yapePhone: cfg.yapePhoneDisplay,
    plinPhone: cfg.yapePhoneDisplay,
    yapeHolder: cfg.yapeHolder,
    whatsappPhone: cfg.whatsappNumber,
    stripeMonthlyUrl: cfg.stripeMonthlyUrl,
    stripeAnnualUrl: cfg.stripeAnnualUrl,
    mercadopagoMonthlyUrl: cfg.mercadopagoMonthlyUrl,
    mercadopagoAnnualUrl: cfg.mercadopagoAnnualUrl,
    licenseEnabled: true,
  });
}
