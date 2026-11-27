import { NextResponse } from 'next/server';

export async function GET() {
  const yapePhone = (process.env.YAPE_PHONE || '').trim();
  const plinPhone = (process.env.PLIN_PHONE || yapePhone).trim();
  const yapeHolder = (process.env.YAPE_HOLDER || 'Percy Acha Taipe (ATP Dev Perú)').trim();
  const whatsappPhone = (process.env.WHATSAPP_PHONE || yapePhone).replace(/[^\d]/g, '');

  return NextResponse.json({
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    yapePhone: yapePhone || null,
    plinPhone: plinPhone || null,
    yapeHolder,
    whatsappPhone: whatsappPhone || null,
  });
}
