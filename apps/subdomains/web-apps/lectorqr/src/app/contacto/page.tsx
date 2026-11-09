'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Atención al Usuario & Soporte Técnico</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Centro de Contacto
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          ¿Tienes consultas, sugerencias o requieres soporte corporativo para Lector QR Pro? Escríbenos directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Info Column (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white font-display">
              Información del Editor
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Correo Oficial:</span>
                  <a href="mailto:contacto@atpdev.pe" className="text-white font-bold hover:underline">
                    contacto@atpdev.pe
                  </a>
                  <p className="text-[11px] text-slate-500">soporte@atpdev.pe</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">WhatsApp & Teléfono:</span>
                  <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                    +51 987 654 321
                  </a>
                  <p className="text-[11px] text-slate-500">Lunes a Viernes de 9:00 a 18:00 (GMT-5)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Ubicación Corporativa:</span>
                  <p className="text-white font-bold">ATP DEV Perú</p>
                  <p className="text-[11px] text-slate-500">Lima, Perú</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Sitio Web Oficial Verificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white font-display">
              Envíanos un Mensaje
            </h3>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>¡Mensaje recibido con éxito! Nos comunicaremos contigo a la brevedad posible.</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Tu Nombre o Empresa:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Tu Correo Electrónico:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@ejemplo.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Consulta o Mensaje:
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje o sugerencia aquí..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Mensaje</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
