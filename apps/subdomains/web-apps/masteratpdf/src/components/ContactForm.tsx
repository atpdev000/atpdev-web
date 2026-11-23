'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getBackendUrl } from '@/lib/pdf/backendClient';

export function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setSending(true);

        const payload = { name, email, subject, message };

        try {
            let ok = false;
            let replyMsg = 'Mensaje enviado correctamente. Te responderemos pronto.';

            try {
                const res = await fetch(`${getBackendUrl()}/api/convert/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const data = await res.json();
                    ok = true;
                    if (data?.message) replyMsg = data.message;
                }
            } catch {
                // fallback to Next.js local route
            }

            if (!ok) {
                const nextRes = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const nextData = await nextRes.json().catch(() => ({}));
                if (!nextRes.ok) {
                    throw new Error(nextData?.error || 'No se pudo enviar el mensaje.');
                }
                if (nextData?.message) replyMsg = nextData.message;
            }

            setStatus({ type: 'ok', text: replyMsg });
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '';
            setStatus({
                type: 'err',
                text: msg || 'Error al enviar el mensaje. También puedes escribirnos a contacto@atpdev.dev.',
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">Nombre completo</label>
                    <input
                        type="text"
                        required
                        minLength={2}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand"
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink">Correo electrónico</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-bold text-ink">Asunto</label>
                <input
                    type="text"
                    required
                    minLength={3}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Compatibilidad PDF, reporte técnico, consulta comercial…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-bold text-ink">Mensaje</label>
                <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe tu consulta o el comportamiento observado…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:border-brand"
                />
            </div>

            {status && (
                <div
                    role="alert"
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
                        status.type === 'ok'
                            ? 'bg-ok-soft text-ok'
                            : 'bg-danger-soft text-danger'
                    }`}
                >
                    {status.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{status.text}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors disabled:opacity-50 cursor-pointer"
            >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Enviando…' : 'Enviar mensaje de soporte'}</span>
            </button>
        </form>
    );
}

