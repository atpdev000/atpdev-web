'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, MessageSquare, ShieldCheck, ArrowLeft, 
  Send, CheckCircle2, Clock, Globe, HelpCircle 
} from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/siteConfig';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Soporte General', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Ocurrió un error al enviar el mensaje.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error al enviar mensaje Sorteos Pro:', err);
      setErrorMessage(err?.message || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al inicio</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-mono font-bold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Atención al Usuario & Soporte</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white">
          Contacto y Soporte Oficial
        </h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          ¿Tienes consultas técnicas sobre la certificación de sorteos, sugerencias para nuestras herramientas o necesitas asistencia con tu suscripción? Nuestro equipo te responde en menos de 24 horas hábiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 dark:text-zinc-500 font-bold">Correo Electrónico</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors block">
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 dark:text-zinc-500 font-bold">Tiempo de Respuesta</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Menos de 24 horas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 dark:text-zinc-500 font-bold">Cobertura</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Perú & Hispanoamérica</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0b0f19] p-8 sm:p-12 border border-slate-200 dark:border-white/10 shadow-xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">¡Mensaje Enviado con Éxito!</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
              Gracias por escribirnos. Uno de nuestros especialistas revisará tu consulta y te responderá al correo <strong className="text-slate-900 dark:text-white font-mono">{form.email}</strong>.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'Soporte General', message: '' }); }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold font-mono text-slate-700 dark:text-zinc-300">
                  Nombre Completo <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold font-mono text-slate-700 dark:text-zinc-300">
                  Correo Electrónico <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-slate-700 dark:text-zinc-300">
                Asunto del Mensaje
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
              >
                <option value="Soporte General">Soporte General y Consultas</option>
                <option value="Duda sobre Certificado SHA-256">Verificación de Certificado Criptográfico</option>
                <option value="Planes y Facturación">Planes Pro y Facturación</option>
                <option value="Sugerencia de Herramienta">Sugerencia de nueva función</option>
                <option value="Privacidad y Datos">Privacidad y Protección de Datos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-slate-700 dark:text-zinc-300">
                Mensaje o Consulta <span className="text-pink-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe tu consulta detalladamente..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Enviando mensaje..." : "Enviar Mensaje"}</span>
            </button>
          </form>
        )}
      </div>

      <div className="rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 space-y-6">
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-pink-500" />
          <span>Preguntas Frecuentes de Soporte</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-400">
          <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1.5">
            <p className="font-bold text-slate-900 dark:text-white">¿Las herramientas como la Ruleta y Dados tienen costo?</p>
            <p>No. Todas las herramientas independientes (Ruleta, Dados, Moneda, Lista, Equipos y Números) son 100% gratuitas e ilimitadas.</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1.5">
            <p className="font-bold text-slate-900 dark:text-white">¿Cómo se valida la transparencia de un sorteo?</p>
            <p>Cada sorteo genera un Certificado Digital único con hash criptográfico SHA-256 generado mediante el motor Web Crypto CSPRNG del navegador.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
