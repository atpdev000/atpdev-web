import { NextResponse } from "next/server";
import { createLead } from "@atpdev/database";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor completa todos los campos requeridos." },
        { status: 400 }
      );
    }

    const subjectLabel = subject || "Consulta General";

    // Registrar en Supabase leads
    const saved = await createLead({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      company: `Chamba Pro (${subjectLabel})`,
      phone: null,
      message: `[Asunto: ${subjectLabel}]\n\n${String(message).trim()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Tu consulta ha sido enviada al equipo de Chamba Pro.",
      savedInDatabase: saved,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error en /api/contact Chamba Pro:", err);
    return NextResponse.json(
      { error: err?.message || "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

