import { NextResponse } from 'next/server';
import { trackPageView } from '@atpdev/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, path } = body;

    if (!domain || !path) {
      return NextResponse.json({ error: 'Faltan parámetros domain o path' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const success = await trackPageView({
      domain,
      path,
      user_agent: userAgent,
      session_id: 'anon',
    });

    if (!success) {
      return NextResponse.json({ error: 'Error guardando vista en BD' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in descargador /api/track:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
