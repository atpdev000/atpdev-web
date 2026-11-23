import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const name = String(body?.name || '').trim();
        const email = String(body?.email || '').trim();
        const subject = String(body?.subject || '').trim();
        const message = String(body?.message || '').trim();

        if (name.length < 2 || !email.includes('@') || subject.length < 3 || message.length < 10) {
            return NextResponse.json(
                { error: 'Completa todos los campos correctamente (mensaje mínimo 10 caracteres).' },
                { status: 400 }
            );
        }

        // Si el backend Python está disponible en servidor, reenviar el ticket allí
        const backendUrl = process.env.NEXT_PUBLIC_PDF_BACKEND_URL;
        if (backendUrl) {
            try {
                const upstream = await fetch(`${backendUrl.replace(/\/$/, '')}/api/convert/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message }),
                });
                if (upstream.ok) {
                    const data = await upstream.json();
                    return NextResponse.json({ success: true, message: data.message });
                }
            } catch {
                // Continuar con registro estándar si backend externo no responde
            }
        }

        console.info('[MasterAtPDF Contact]', {
            timestamp: new Date().toISOString(),
            name,
            email,
            subject,
        });

        return NextResponse.json({
            success: true,
            message: 'Tu mensaje fue registrado correctamente. Nuestro equipo responderá en 24-48h hábiles.',
        });
    } catch {
        return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    }
}

