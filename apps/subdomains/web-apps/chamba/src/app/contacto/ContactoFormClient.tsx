'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactoFormClient() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Consulta General',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al enviar el mensaje.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error al enviar consulta:', err);
      setErrorMessage(err?.message || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 md:col-span-2 space-y-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
        <MessageSquare className="text-emerald-600 dark:text-emerald-400" size={20} />
        <span>Envíanos un Mensaje</span>
      </h2>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">¡Mensaje Enviado con Éxito!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Gracias por escribirnos, <strong>{formData.name}</strong>. Hemos recibido tu consulta y nos pondremos en contacto a través de <strong>{formData.email}</strong>.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tu Nombre Completo *</label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="juan.perez@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Asunto del Contacto</label>
            <select
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 shadow-sm"
            >
              <option value="Consulta General">Consulta General sobre el portal</option>
              <option value="Alerta de Convocatoria / Fraude">Reportar enlace caído o convocatoria sospechosa</option>
              <option value="Publicación de Puesto Institucional">Publicar vacantes para mi institución o empresa</option>
              <option value="Publicidad & Alianzas">Consultas sobre anuncios publicitarios</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tu Mensaje o Detalle *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe tu consulta, reporte o requerimiento con el mayor detalle posible..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 leading-relaxed shadow-sm"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs font-display transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
            <span>{isSubmitting ? "Enviando consulta..." : "Enviar Consulta al Equipo Editorial"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
