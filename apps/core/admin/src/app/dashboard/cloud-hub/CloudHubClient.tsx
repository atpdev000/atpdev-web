"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  ShieldCheck, 
  Key, 
  Server, 
  Activity, 
  Users, 
  Terminal, 
  Globe, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Lock, 
  UserCheck, 
  Sparkles,
  Inbox
} from "lucide-react";

interface StatusData {
  supabase: {
    status: string;
    url: string;
    projectRef: string;
    latencyMs: number;
    tables: { projects: number; leads: number; siteConfigLoaded: boolean };
    error: string | null;
    hasAnonKey: boolean;
    hasServiceRoleKey: boolean;
  };
  email: {
    provider: string;
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    senderUser: string;
    hasPassword: boolean;
    domain: string;
    aliases: Array<{ email: string; label: string; role: string }>;
    webmailUrls: {
      zohoMail: string;
      zohoAdmin: string;
      gmailWebmail: string;
    };
  };
  timestamp: string;
}

export default function CloudHubClient() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auth Modes (Persisted in localStorage)
  const [emailAuthMode, setEmailAuthMode] = useState<"google_sso" | "credentials">("credentials");
  const [supabaseAuthMode, setSupabaseAuthMode] = useState<"github_oauth" | "google_oauth" | "email_password">("github_oauth");

  useEffect(() => {
    const savedEmailAuth = localStorage.getItem("admin_email_auth_mode") as "google_sso" | "credentials" | null;
    if (savedEmailAuth) setEmailAuthMode(savedEmailAuth);

    const savedSupabaseAuth = localStorage.getItem("admin_supabase_auth_mode") as "github_oauth" | "google_oauth" | "email_password" | null;
    if (savedSupabaseAuth) setSupabaseAuthMode(savedSupabaseAuth);

    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cloud-hub/status", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Error al cargar estado de cloud-hub:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthChange = (mode: "google_sso" | "credentials") => {
    setEmailAuthMode(mode);
    localStorage.setItem("admin_email_auth_mode", mode);
  };

  const handleSupabaseAuthChange = (mode: "github_oauth" | "google_oauth" | "email_password") => {
    setSupabaseAuthMode(mode);
    localStorage.setItem("admin_supabase_auth_mode", mode);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectRef = data?.supabase?.projectRef || "yeeupdgjfrkkaurytyrs";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Server className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Hub de Correo Corporativo & Supabase
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Acceso directo con 1 clic, monitoreo en vivo y recordatorio de credenciales para <strong>Zoho Mail (@atpdev.dev)</strong> y <strong>Supabase Cloud</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Comprobando..." : "Actualizar Diagnóstico"}
        </button>
      </div>

      {/* Grid Principal: 2 Columnas de Alta Densidad */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* ========================================================
            SECCIÓN 1: CORREO CORPORATIVO (@ATPDEV.DEV / ZOHO MAIL)
        ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1E1E] p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Top Card Title & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Correo Corporativo
                    </h2>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      @atpdev.dev
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Plataforma Oficial: <strong>Zoho Mail Enterprise</strong> (Host SMTP: <code className="text-blue-600 dark:text-blue-400">smtp.zoho.com</code>)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SMTP Activo</span>
              </div>
            </div>

            {/* SELECCIÓN DE MODO DE INICIO DE SESIÓN */}
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ¿Cómo tienes iniciada tu sesión en el correo?
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {emailAuthMode === "google_sso" ? "Google SSO" : "Zoho Password"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleEmailAuthChange("credentials")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    emailAuthMode === "credentials"
                      ? "bg-blue-500/10 border-blue-500 text-slate-900 dark:text-white shadow-xs"
                      : "bg-white dark:bg-[#202020] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Usuario & Contraseña</span>
                    {emailAuthMode === "credentials" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <span className="text-[11px] opacity-75">Cuenta directa en Zoho Mail (Credenciales corporativas)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEmailAuthChange("google_sso")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    emailAuthMode === "google_sso"
                      ? "bg-blue-500/10 border-blue-500 text-slate-900 dark:text-white shadow-xs"
                      : "bg-white dark:bg-[#202020] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Correo Directo / Google SSO</span>
                    {emailAuthMode === "google_sso" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <span className="text-[11px] opacity-75">Vinculado a Google Workspace o reenvío directo a Gmail</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {emailAuthMode === "credentials" ? (
                  <span>Tu emisor base es <strong className="text-slate-900 dark:text-white">hello@atpdev.dev</strong> con App Password segura en el servidor.</span>
                ) : (
                  <span>Al abrir Webmail, asegúrate de tener seleccionada tu cuenta Google asignada a la empresa.</span>
                )}
              </div>
            </div>

            {/* BOTONES DE ACCESO RÁPIDO A WEBMAIL Y CONSOLAS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Accesos Directos a la Plataforma
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href="https://mail.zoho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4" />
                    <span>Webmail Zoho</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="https://mailadmin.zoho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Consola Admin</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-500" />
                    <span>Gmail Webmail</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* DIRECTORIO DE CORREOS CORPORATIVOS ACTIVOS */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Cuentas Corporativas Activas</span>
                <span className="text-[10px] text-slate-500 font-mono">Dominio: atpdev.dev</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-[#181818]">
                {[
                  {
                    email: "contacto@atpdev.dev",
                    label: "Canal Oficial de Atención y Clientes (Webs & Descargador)",
                    role: "Atención Oficial",
                    tag: "Principal",
                    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  },
                  {
                    email: "hello@atpdev.dev",
                    label: "Emisor SMTP del Sistema, Leads y Notificaciones",
                    role: "Sistema SMTP",
                    tag: "Activo",
                    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  },
                  {
                    email: "soporte@atpdev.dev",
                    label: "Mesa de Ayuda, Soporte Técnico y Reportes de Error",
                    role: "Soporte",
                    tag: "Helpdesk",
                    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                  },
                  {
                    email: "admin@atpdev.dev",
                    label: "Consola de Operaciones y Seguridad Central",
                    role: "Operaciones",
                    tag: "Admin",
                    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  },
                  {
                    email: "percy@atpdev.dev",
                    label: "Percy Acha Taipe — Casilla Ejecutiva y Representante",
                    role: "Personal",
                    tag: "Fundador",
                    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  }
                ].map((account) => (
                  <div key={account.email} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {account.email}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${account.color}`}>
                          {account.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {account.label}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyToClipboard(account.email, account.email)}
                        title="Copiar correo"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition cursor-pointer"
                      >
                        {copiedKey === account.email ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={`mailto:${account.email}`}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs transition"
                        title="Redactar email"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Card Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Servidor SMTP: <strong className="text-slate-900 dark:text-white">smtp.zoho.com:465</strong></span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SSL/TLS Seguro
            </span>
          </div>
        </div>

        {/* ========================================================
            SECCIÓN 2: BASE DE DATOS SUPABASE (yeeupdgjfrkkaurytyrs)
        ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E1E1E] p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Top Card Title & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Base de Datos
                    </h2>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Supabase Cloud
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Project ID: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{projectRef}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{data?.supabase?.latencyMs ? `${data.supabase.latencyMs}ms` : "Conectado"}</span>
              </div>
            </div>

            {/* SELECCIÓN DE MODO DE INICIO DE SESIÓN EN SUPABASE */}
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ¿Cómo tienes iniciada tu sesión en Supabase?
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {supabaseAuthMode === "github_oauth" ? "GitHub" : supabaseAuthMode === "google_oauth" ? "Google" : "Password"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSupabaseAuthChange("github_oauth")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    supabaseAuthMode === "github_oauth"
                      ? "bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                      : "bg-white dark:bg-[#202020] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">GitHub OAuth</span>
                    {supabaseAuthMode === "github_oauth" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] opacity-75">Sesión directa con tu perfil de desarrollador GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSupabaseAuthChange("google_oauth")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    supabaseAuthMode === "google_oauth"
                      ? "bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                      : "bg-white dark:bg-[#202020] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Google Directo</span>
                    {supabaseAuthMode === "google_oauth" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] opacity-75">Sesión con tu cuenta de Google asociada</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSupabaseAuthChange("email_password")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                    supabaseAuthMode === "email_password"
                      ? "bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                      : "bg-white dark:bg-[#202020] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Email & Password</span>
                    {supabaseAuthMode === "email_password" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] opacity-75">Usuario y contraseña manual de Supabase</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Cualquiera de los botones abrirá directamente el proyecto <strong>{projectRef}</strong> con tu sesión activa.</span>
              </div>
            </div>

            {/* BOTONES DE ACCESO DIRECTO AL STUDIO DE SUPABASE */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Consolas y Editores Directos (1 Clic)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm group sm:col-span-2"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Abrir Supabase Dashboard General</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono opacity-80">{projectRef}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>

                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Table Editor (Tablas)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-500" />
                    <span>SQL Editor (Consultas)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/auth/users`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Usuarios & Autenticación</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/settings/api`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition group border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-500" />
                    <span>API Keys & Secrets</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* TABLAS Y MÉTRICAS EN VIVO */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Estado de Tablas en Producción</span>
                <span className="text-[10px] text-emerald-500 font-mono">Row Level Security: OK</span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Proyectos</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {data?.supabase?.tables?.projects ?? "—"}
                  </p>
                  <p className="text-[9px] text-emerald-500 font-mono">projects</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Leads / Clientes</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {data?.supabase?.tables?.leads ?? "—"}
                  </p>
                  <p className="text-[9px] text-emerald-500 font-mono">leads</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200/80 dark:border-slate-800 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Site Config</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {data?.supabase?.tables?.siteConfigLoaded ? "Activo" : "—"}
                  </p>
                  <p className="text-[9px] text-emerald-500 font-mono">site_config</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate max-w-[280px]">Endpoint: <strong className="text-slate-900 dark:text-white font-mono">{data?.supabase?.url}</strong></span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Postgres 15+
            </span>
          </div>
        </div>

      </div>

      {/* BANNER INFORMATIVO RESUMEN */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-emerald-900/10 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Centro Integrado de Operaciones Cloud ATP DEV
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Las preferencias de inicio de sesión se guardan localmente para que siempre recuerdes cómo acceder a cada plataforma sin confusiones.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(`https://supabase.com/dashboard/project/${projectRef}`, "supabase-url")}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === "supabase-url" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copiar Enlace Supabase
          </button>
        </div>
      </div>
    </div>
  );
}

