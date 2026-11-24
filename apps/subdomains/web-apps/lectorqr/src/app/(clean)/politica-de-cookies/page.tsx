import React from 'react';
import type { Metadata } from 'next';
import { Cookie, Settings, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  alternates: { canonical: '/politica-de-cookies' },
  title: 'Política de Cookies • Lector QR Pro',
  description: 'Información detallada sobre las cookies utilizadas en Lector QR Pro, cookies de Google AdSense y cómo configurarlas en tu navegador.',
};

export default function PoliticaCookiesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Cookie className="w-4 h-4 text-cyan-400" />
          <span>Gestión de Cookies & Privacidad</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Política de Cookies
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Última actualización: 9 de noviembre de 2026.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            1. ¿Qué son las Cookies?
          </h2>
          <p>
            Una cookie es un pequeño archivo de texto que un sitio web almacena en tu navegador para recordar información sobre tu visita, como tus preferencias de idioma, configuración técnica o para permitir la entrega de publicidad relevante.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display">
            2. Tipos de Cookies que Utilizamos
          </h2>
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cookies Técnicas Necesarias</h3>
              <p className="text-xs text-slate-400">
                Permiten la navegación fluida y la memorización de tus preferencias en el escáner (sonido activado, linterna y modo oscuro).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cookies Publicitarias de Google AdSense</h3>
              <p className="text-xs text-slate-400">
                Google utiliza cookies para publicar anuncios en nuestro sitio web basándose en las visitas anteriores del usuario. Permiten ofrecer anuncios personalizados según la normativa europea de protección de datos (RGPD).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cookies Analíticas</h3>
              <p className="text-xs text-slate-400">
                Nos ayudan a comprender de forma anónima cuántos códigos se procesan diariamente y qué formatos son los más utilizados para mejorar el rendimiento del motor de visión.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            3. Cómo Gestionar o Desactivar las Cookies
          </h2>
          <p>
            Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Google Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
            <li>Mozilla Firefox: Ajustes &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
            <li>Apple Safari: Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
            <li>Microsoft Edge: Configuración &gt; Permisos del sitio &gt; Cookies y datos del sitio.</li>
          </ul>
          <p className="pt-2">
            Adicionalmente, Lector QR Pro implementa <strong>Google Consent Mode v2</strong> con señales predeterminadas denegadas (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code> y <code>analytics_storage</code>) hasta que otorgues tu consentimiento explícito en el banner de privacidad. Puedes administrar la personalización de anuncios directamente en{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">
              adssettings.google.com
            </a>
            , revisar el uso de datos en sitios asociados de Google en{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">
              policies.google.com/technologies/partner-sites
            </a>{' '}
            o ejercer opciones globales de exclusión publicitaria en{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">
              www.aboutads.info/choices/
            </a>
            . Ninguna cookie almacena ni transmite las imágenes o códigos QR que escaneas localmente en tu navegador. Para cualquier consulta adicional, escríbenos a{' '}
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

