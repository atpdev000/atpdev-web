'use client';

import React from 'react';
import { Copy, Sparkles, Download, ShieldCheck, Zap } from 'lucide-react';

export function HowItWorksSteps() {
  const steps = [
    {
      number: '01',
      title: 'Copia el enlace del video',
      desc: 'Encuentra el video en Facebook, TikTok, Instagram, Twitter/X o YouTube y copia el enlace oficial desde el botón "Compartir".',
      icon: Copy,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Paso 1'
    },
    {
      number: '02',
      title: 'Pégalo en el buscador',
      desc: 'Pega la URL en la barra de búsqueda superior. Nuestro motor detectará automáticamente la plataforma y extraerá las fuentes oficiales en HD.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      badge: 'Paso 2'
    },
    {
      number: '03',
      title: 'Elige formato y descarga',
      desc: 'Selecciona la resolución que prefieras (MP4 1080p/4K o MP3 320kbps) y descarga directamente a tu galería o carpeta de descargas.',
      icon: Download,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Paso 3'
    }
  ];

  return (
    <section className="max-w-4xl mx-auto mb-16 px-2">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono tracking-wider uppercase">
          <Zap size={14} />
          <span>Guía Rápida de Descarga</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ¿Cómo descargar contenido en 3 simples pasos?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Sin registro, sin marcas de agua y compatible con cualquier navegador en Android, iOS, Windows y Mac.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-black font-mono text-slate-300 dark:text-slate-700 group-hover:text-blue-500/50 transition-colors">
                  {step.number}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${step.color} shadow-xs`}>
                  {step.badge}
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-100 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <Icon size={22} className="text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default HowItWorksSteps;

