import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { QrCode, ShieldCheck, Lock, Cpu, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nosotros y Arquitectura de Escaneo Local • Lector QR Pro',
  description:
    'Conoce el motor de visión artificial client-side, las garantías de privacidad de cámara y el equipo de ingeniería de ATP DEV detrás de Lector QR Pro.',
  alternates: { canonical: '/sobre-nosotros' },
};

export default function SobreNosotrosQrPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span>Transparencia e Ingeniería Óptica Client-Side</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Sobre Nosotros: Lector QR Pro Web
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Desarrollado por Percy Acha Taipe (ATP DEV Perú) • lectorqr.atpdev.dev
        </p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed text-slate-300">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h2>1. Procesamiento Óptico 100% en tu Dispositivo</h2>
          </div>
          <p>
            <strong>Lector QR Pro</strong> fue diseñado para ofrecer una alternativa rápida, limpia y respetuosa con la privacidad frente a aplicaciones móviles invasivas que solicitan permisos de contactos o suben capturas de cámara a servidores externos.
          </p>
          <p>
            Nuestro motor decodifica matrices QR (ISO/IEC 18004), DataMatrix, Aztec y códigos de barras EAN/UPC a 60 cuadros por segundo directamente sobre el lienzo HTML5 Canvas del navegador usando las APIs nativas <code>BarcodeDetector</code> y WebAssembly. Ningún fotograma de tu cámara ni imagen subida abandona jamás tu teléfono o computadora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2>2. Prevención de Quishing (QR Phishing)</h2>
            </div>
            <p>
              Antes de abrir cualquier URL contenida en un código QR, Lector QR Pro muestra el dominio destino completo y su esquema de seguridad (HTTPS), evitando redirecciones automáticas ciegas a sitios fraudulentos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Award className="w-4 h-4 text-cyan-400" />
              <h2>3. Responsable Editorial y Técnico</h2>
            </div>
            <p>
              Lector QR Pro pertenece al ecosistema de herramientas web de <strong>ATP DEV</strong>, liderado por el Ing. <strong>Percy Acha Taipe</strong> en Lima, Perú. Puedes contactarnos en cualquier momento desde nuestra página de <Link href="/contacto" className="text-cyan-400 underline font-semibold">Contacto</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
