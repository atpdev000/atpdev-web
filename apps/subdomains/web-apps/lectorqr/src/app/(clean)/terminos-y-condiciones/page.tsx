import React from 'react';
import type { Metadata } from 'next';
import { FileCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  alternates: { canonical: '/terminos-y-condiciones' },
  title: 'Términos y Condiciones de Uso • Lector QR Pro',
  description: 'Términos y condiciones legales que regulan el uso del escáner y generador de códigos QR en línea Lector QR Pro.',
};

export default function TerminosCondicionesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Términos Legales del Servicio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Vigente desde el 9 de noviembre de 2026. Al utilizar Lector QR Pro aceptas los siguientes términos.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            1. Objeto y Descripción del Servicio
          </h2>
          <p>
            <strong>Lector QR Pro</strong> es una plataforma de software en línea desarrollada por <strong>ATP DEV</strong> que provee herramientas de utilidad gratuita para el escaneo, reconocimiento y decodificación de códigos QR y códigos de barras 1D/2D, así como un estudio creativo para la generación y exportación de códigos en alta resolución (PNG y SVG).
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            2. Uso Aceptable y Responsabilidad del Usuario
          </h2>
          <p>
            El usuario se compromete a no utilizar las herramientas de generación de códigos QR para distribuir malware, enlaces de phishing (*QRishing*), contenido difamatorio, ilegal o que infrinja los derechos de propiedad intelectual de terceros. ATP DEV se reserva el derecho de reportar a las autoridades competentes cualquier actividad maliciosa detectada en la plataforma.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            3. Descargo de Responsabilidad sobre Enlaces Externos
          </h2>
          <p>
            Lector QR Pro decodifica y muestra el contenido exacto codificado en la matriz visual del código. La aplicación no controla, valida ni garantiza la seguridad de los sitios web o enlaces de terceros escaneados. El usuario asume total responsabilidad al acceder a enlaces externos.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            4. Propiedad Intelectual
          </h2>
          <p>
            El diseño visual, código fuente, logotipos y componentes interactivos de la aplicación pertenecen en su totalidad a ATP DEV. Los códigos QR generados por los usuarios pueden ser utilizados libremente para fines personales, comerciales y publicitarios sin costo de regalías.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            5. Privacidad, Publicidad y Legislación Aplicable
          </h2>
          <p>
            Todo el procesamiento óptico de cámara, decodificación de matrices QR/barras y generación vectorial SVG/PNG se ejecuta localmente en la memoria del navegador del usuario sin almacenar capturas en servidores externos, conforme a nuestra Política de Privacidad y a la Ley N° 29733 de Protección de Datos Personales del Perú. El acceso gratuito a las secciones informativas y herramientas principales se sostiene mediante publicidad contextual gestionada con Google AdSense bajo Google Consent Mode v2.
          </p>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de la República del Perú y los estándares internacionales de servicios digitales. Para soporte técnico, consultas sobre licencias o reportes de uso indebido, puedes comunicarte con el equipo de ingeniería de ATP DEV en Lima, Perú escribiendo a{' '}
            <a href="mailto:contacto@atpdev.dev" className="text-cyan-400 underline font-semibold">
              contacto@atpdev.dev
            </a>
            .
          </p>
        </section>

      </div>

    </div>
  );
}

