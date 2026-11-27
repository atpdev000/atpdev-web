import { NextResponse } from 'next/server';
import { getColorearPaymentsConfig, getDynamicColorearPlans } from '@/lib/server/ecosystemPayments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cfg = getColorearPaymentsConfig();
  const plans = getDynamicColorearPlans();

  return NextResponse.json({
    stripeConfigured: cfg.stripeApiConfigured,
    yapePhone: cfg.yapePhoneDisplay,
    plinPhone: cfg.yapePhoneDisplay,
    yapeHolder: cfg.yapeHolder,
    yapeQrUrl: cfg.yapeQrUrl,
    whatsappPhone: cfg.whatsappNumber,
    notificationEmail: cfg.notificationEmail,
    stripeMonthlyUrl: cfg.stripeMonthlyUrl,
    stripeAnnualUrl: cfg.stripeAnnualUrl,
    stripeEditorialAnnualUrl: cfg.stripeEditorialAnnualUrl,
    mercadopagoMonthlyUrl: cfg.mercadopagoMonthlyUrl,
    mercadopagoAnnualUrl: cfg.mercadopagoAnnualUrl,
    mercadopagoEditorialAnnualUrl: cfg.mercadopagoEditorialAnnualUrl,
    welcomeCredits: cfg.welcomeCredits,
    annualDiscountPercent: cfg.annualDiscountPercent,
    plans,
    licenseEnabled: true,
  });
}
