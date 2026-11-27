import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ipTimestamps = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
    const last = ipTimestamps.get(ip) || 0;
    if (Date.now() - last < 15_000) {
      return NextResponse.json(
        { error: 'Espera unos segundos antes de enviar otro mensaje.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || '').trim().slice(0, 80);
    const email = String(body.email || '').trim().slice(0, 160);
    const topic = String(body.topic || 'Soporte general').trim().slice(0, 80);
    const message = String(body.message || '').trim().slice(0, 1500);

    if (name.length < 2) {
      return NextResponse.json({ error: 'Ingresa tu nombre.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Ingresa un correo válido.' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Cuéntanos brevemente tu consulta (mínimo 10 caracteres).' },
        { status: 400 }
      );
    }

    ipTimestamps.set(ip, Date.now());

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChat) {
      const text = [
        '📩 Nuevo mensaje de contacto — Colorear Pro',
        `Nombre: ${name}`,
        `Correo: ${email}`,
        `Tema: ${topic}`,
        `Mensaje:\n${message}`,
      ].join('\n');

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text }),
        signal: AbortSignal.timeout(10000),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      message: 'Mensaje enviado correctamente. Te responderemos muy pronto a tu correo.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'No pudimos enviar tu mensaje.' },
      { status: 500 }
    );
  }
}

