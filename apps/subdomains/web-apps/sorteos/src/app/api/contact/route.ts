import { NextResponse } from "next/server";
import { createLead } from "@atpdev/database";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor completa todos los campos obligatorios." },
        { status: 400 }
      );
    }

    const subjectLabel = subject || "Soporte General";

    // Registrar en Supabase leads
    const saved = await createLead({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      company: `Sorteos Pro (${subjectLabel})`,
      phone: null,
      message: `[Asunto: ${subjectLabel}]\n\n${String(message).trim()}`,
    });

    // Notificación opcional a Telegram si está configurado
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChat) {
      const text = [
        `📩 Nuevo mensaje en Sorteos Pro`,
        `Nombre: ${String(name).trim()}`,
        `Email: ${String(email).trim().toLowerCase()}`,
        `Asunto: ${subjectLabel}`,
        `Mensaje: ${String(message).trim().slice(0, 600)}`,
      ].join('\n');
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Tu consulta ha sido enviada al equipo de Sorteos Pro.",
      savedInDatabase: saved,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error en /api/contact Sorteos Pro:", err);
    return NextResponse.json(
      { error: err?.message || "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

