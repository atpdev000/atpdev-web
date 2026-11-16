import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, ShieldCheck } from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/siteConfig';

export const metadata = {
  alternates: { canonical: '/politica-de-cookies' },
  title: `Política de Cookies | ${SITE_NAME}`,
  description: `Información sobre las cookies técnicas, preferencias de navegador y cookies de Google AdSense utilizadas en ${SITE_NAME}.`,
};

export default function PoliticaCookiesPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold">
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookies, Consent Mode v2 & Transparencia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Política de Cookies
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Última actualización: 16 de noviembre de 2026 · Responsable: ATP DEV ({CONTACT_EMAIL})
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 text-sm text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">
            1. ¿Qué son las Cookies y Cómo se Usan en Sorteos Pro?
          </h2>
          <p>
            Las cookies son pequeños ficheros que tu navegador guarda temporal o persistentemente para conservar configuraciones básicas como tu idioma preferido, tema oscuro/claro, verificación de sesión autorizada y elección de privacidad. Los sorteos criptográficos y herramientas client-side operan en tu dispositivo sin comercializar listas de participantes.
          </p>
        </section>

        <section className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-500" />
            <span>2. Categorías de Cookies que Utilizamos</span>
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase font-mono">Cookies Técnicas y de Seguridad</h3>
              <p className="text-xs text-zinc-400">
                Imprescindibles para recordar tu estado de sesión, prevenir abuso en APIs de sorteo y almacenar tu preferencia en Google Consent Mode v2.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase font-mono">Cookies de Google AdSense</h3>
              <p className="text-xs text-zinc-400">
                Google y sus socios pueden utilizar cookies publicitarias (como DoubleClick/DART) para servir anuncios relevantes o no personalizados según el consentimiento otorgado y financiar nuestras herramientas gratuitas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <h3 className="text-xs font-bold text-white uppercase font-mono">Cookies Analíticas</h3>
              <p className="text-xs text-zinc-400">
                Condicionadas a tu aceptación explícita, permiten analizar el rendimiento técnico de la ruleta, trivias y validadores de certificados SHA-256.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-pink-500" />
            <span>3. Cómo Configurar o Desactivar las Cookies</span>
          </h2>
          <p>
            Puedes aceptar únicamente las cookies esenciales o habilitar la analítica y personalización desde el banner inicial de privacidad. Además, todos los navegadores modernos permiten bloquear, restringir o eliminar cookies almacenadas en tu equipo:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong className="text-white">Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies de terceros y datos de sitios.</li>
            <li><strong className="text-white">Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Protección mejorada contra rastreo y cookies.</li>
            <li><strong className="text-white">Apple Safari:</strong> Ajustes o Preferencias &gt; Privacidad &gt; Bloquear cookies y gestión de datos web.</li>
            <li><strong className="text-white">Microsoft Edge:</strong> Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.</li>
          </ul>
          <p>
            Para controlar específicamente los anuncios servidos por Google, puedes ajustar tus preferencias en{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">
              adssettings.google.com
            </a>
            , revisar cómo emplea Google la información de los sitios que usan sus servicios en{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">
              policies.google.com/technologies/partner-sites
            </a>{' '}
            o gestionar la exclusión de publicidad basada en intereses en{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">
              aboutads.info/choices
            </a>
            . Ten en cuenta que bloquear las cookies técnicas puede impedir recordar tu preferencia de idioma o tema visual. Consulta también nuestra{' '}
            <Link href="/politica-de-privacidad" className="text-pink-400 underline">
              Política de Privacidad
            </Link>{' '}
            o escríbenos a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

