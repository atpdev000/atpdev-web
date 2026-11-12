import { NextResponse } from "next/server";
import { createLead } from "@atpdev/database";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor completa todos los campos requeridos (nombre, email y mensaje)." },
        { status: 400 }
      );
    }

    // Mapeo legible del asunto
    const subjectMap: Record<string, string> = {
      soporte: "Soporte Técnico de Descargas",
      error: "Reporte de Enlace / Error",
      sugerencia: "Sugerencia o Mejora",
      colaboracion: "Colaboración / Negocios",
      legal: "Consulta Legal / DMCA",
      otro: "Consulta General",
    };

    const subjectLabel = subjectMap[subject] || subject || "Soporte General";

    // Guardar en Supabase (tabla 'leads' de ATP DEV)
    const saved = await createLead({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      company: `Descargador Pro (${subjectLabel})`,
      phone: null,
      message: `[Asunto: ${subjectLabel}]\n\n${String(message).trim()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Tu mensaje ha sido recibido y registrado con éxito. Te responderemos al correo proporcionado.",
      savedInDatabase: saved,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error en /api/contact:", err);
    return NextResponse.json(
      { error: err?.message || "Ocurrió un error inesperado al registrar el mensaje." },
      { status: 500 }
    );
  }
}

