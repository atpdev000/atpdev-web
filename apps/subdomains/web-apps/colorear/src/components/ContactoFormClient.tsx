'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import InlineNotice from './InlineNotice';

export default function ContactoFormClient() {
  const { isEn } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Activación de créditos KDP');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          tone: 'error',
          title: isEn ? 'Could not send message' : 'No se pudo enviar',
          message: data.error || 'Revisa tus datos e intenta nuevamente.',
        });
        return;
      }
      setName('');
      setEmail('');
      setMessage('');
      setNotice({
        tone: 'success',
        title: isEn ? 'Message received!' : '¡Mensaje enviado!',
        message: isEn
          ? 'Thanks for reaching out. We will reply to your email shortly.'
          : data.message || 'Te responderemos muy pronto a tu correo.',
      });
    } catch {
      setNotice({
        tone: 'error',
        title: isEn ? 'Network error' : 'Error de conexión',
        message: isEn ? 'Please try again in a few seconds.' : 'Inténtalo nuevamente en unos segundos.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4"
    >
      <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
        {isEn ? 'Send us a direct message' : 'Envíanos un mensaje directo'}
      </h2>

      {notice && (
        <InlineNotice
          tone={notice.tone}
          title={notice.title}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
            {isEn ? 'Your name *' : 'Tu nombre *'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEn ? 'Alex Rivera' : 'Ej. Carlos Quispe'}
            className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
            {isEn ? 'Email *' : 'Correo electrónico *'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
          {isEn ? 'Topic' : 'Asunto'}
        </label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white"
        >
          <option value="Activación de créditos KDP">
            {isEn ? 'KDP Credits & Billing (Stripe / Yape / Plin)' : 'Créditos KDP y pagos (Yape / Plin / Stripe)'}
          </option>
          <option value="Soporte Estudio Amazon KDP">
            {isEn ? 'Amazon KDP Trim / Bleed / Spine Support' : 'Soporte técnico de Amazon KDP (márgenes / lomo)'}
          </option>
          <option value="Sugerencia de categoría">
            {isEn ? 'Request a new free coloring category' : 'Sugerir nueva categoría gratuita de dibujos'}
          </option>
          <option value="Privacidad / Legal">
            {isEn ? 'Privacy or account deletion' : 'Privacidad o eliminación de cuenta'}
          </option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 block">
          {isEn ? 'Message *' : 'Mensaje *'}
        </label>
        <textarea
          required
          minLength={10}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isEn
              ? 'Tell us your order code or how we can help...'
              : 'Indícanos tu consulta o número de orden COL-XXXXXX...'
          }
          className="w-full rounded-xl border border-zinc-300 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950 p-3.5 text-sm text-zinc-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold btn-studio-primary inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{isEn ? 'Send message' : 'Enviar mensaje'}</span>
      </button>
    </form>
  );
}

