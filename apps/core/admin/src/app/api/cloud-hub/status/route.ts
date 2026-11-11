import { NextResponse } from "next/server";
import { getProjects, getLeads, getSiteConfig } from "@atpdev/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let supabaseOk = false;
  let supabaseLatency = 0;
  let tablesStats = { projects: 0, leads: 0, siteConfigLoaded: false };
  let supabaseError: string | null = null;

  try {
    const [projects, leads, config] = await Promise.all([
      getProjects().catch(() => []),
      getLeads().catch(() => []),
      getSiteConfig().catch(() => null),
    ]);

    supabaseLatency = Date.now() - startTime;
    supabaseOk = true;
    tablesStats = {
      projects: Array.isArray(projects) ? projects.length : 0,
      leads: Array.isArray(leads) ? leads.length : 0,
      siteConfigLoaded: !!config,
    };
  } catch (err: any) {
    supabaseLatency = Date.now() - startTime;
    supabaseError = err?.message || "Error al conectar con Supabase";
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeeupdgjfrkkaurytyrs.supabase.co";
  const projectRef = supabaseUrl.replace("https://", "").split(".")[0] || "yeeupdgjfrkkaurytyrs";

  const emailUser = process.env.GMAIL_USER || "hello@atpdev.dev";
  const hasAppPassword = !!process.env.GMAIL_APP_PASSWORD;

  return NextResponse.json({
    supabase: {
      status: supabaseOk ? "online" : "error",
      url: supabaseUrl,
      projectRef,
      latencyMs: supabaseLatency,
      tables: tablesStats,
      error: supabaseError,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    email: {
      provider: "Zoho Mail Enterprise",
      smtpHost: "smtp.zoho.com",
      smtpPort: 465,
      smtpSecure: true,
      senderUser: emailUser,
      hasPassword: hasAppPassword,
      domain: "atpdev.dev",
      aliases: [
        { email: "contacto@atpdev.dev", label: "Atención al Cliente & Cotizaciones", role: "Principal" },
        { email: "hello@atpdev.dev", label: "Remitente SMTP & Notificaciones", role: "Sistema" },
        { email: "soporte@atpdev.dev", label: "Mesa de Ayuda & Soporte Técnico", role: "Soporte" },
        { email: "admin@atpdev.dev", label: "Consola & Operaciones", role: "Admin" },
        { email: "percy@atpdev.dev", label: "Percy Acha Taipe", role: "Fundador" },
      ],
      webmailUrls: {
        zohoMail: "https://mail.zoho.com",
        zohoAdmin: "https://mailadmin.zoho.com",
        gmailWebmail: "https://mail.google.com",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
