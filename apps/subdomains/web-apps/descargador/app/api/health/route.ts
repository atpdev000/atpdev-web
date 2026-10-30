// app/api/health/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'descargador-pro',
    timestamp: Date.now(),
    uptime: process.uptime()
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
