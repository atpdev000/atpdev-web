import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

import { SITE_NAME, CONTACT_EMAIL } from '@/lib/siteConfig';

export const metadata = {
  alternates: { canonical: '/terminos-y-condiciones' },
  title: `Términos y Condiciones | ${SITE_NAME}`,
  description: `Términos y condiciones legales de uso de la plataforma ${SITE_NAME} y cumplimiento con directrices de plataformas y comercio digital.`
};

export default function TerminosPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Aviso Legal y Condiciones de Servicio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Última actualización: 22 de septiembre de 2026. Vigente para todos los usuarios y suscriptores de Sorteos Pro.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 text-sm text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">1. Objeto y Alcance del Servicio</h2>
          <p>
            Sorteos Pro (operado por ATP Dev) es una plataforma tecnológica que provee herramientas para la extracción de comentarios públicos, filtrado de participantes y selección aleatoria de ganadores mediante algoritmos criptográficos (Web Crypto CSPRNG). El usuario organizador es el único responsable legal del cumplimiento de las bases del sorteo, entrega de los premios y leyes aplicables en su jurisdicción.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">2. Cumplimiento con Políticas de Plataformas Terceras (Meta & YouTube)</h2>
          <p>
            Al organizar promociones y sorteos a través de Sorteos Pro en Instagram, Facebook o YouTube, el organizador reconoce expresamente que:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>La promoción no está patrocinada, avalada, administrada ni asociada de modo alguno a Instagram, Meta Platforms Inc., ni YouTube (Google LLC).</li>
            <li>El anfitrión debe incluir una exoneración completa de responsabilidades a favor de dichas plataformas en la publicación oficial de la promoción.</li>
            <li>Sorteos Pro no requiere ni almacena contraseñas de las cuentas sociales de los participantes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">3. Imparcialidad y Algoritmo Criptográfico</h2>
          <p>
            Sorteos Pro garantiza que los procesos de selección aleatoria se realizan mediante CSPRNG (Generador de Números Pseudoaleatorios Criptográficamente Seguro) respaldado por la entropía del navegador y el sistema operativo. Se emite un certificado digital con hash SHA-256 inmutable que acredita que el sorteo se ejecutó sin alteración humana.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">4. Planes, Pagos y Cancelaciones</h2>
          <p>
            Los planes de suscripción (Pro Creador, Business y Enterprise) se cobran por adelantado en ciclos mensuales o anuales. El usuario puede cancelar la renovación automática en cualquier momento desde su panel de usuario. Las herramientas standalone (Ruleta, Dados, Moneda, etc.) son de libre acceso sin costo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">5. Limitación de Responsabilidad</h2>
          <p>
            ATP Dev no se responsabiliza por fallos de conectividad con las APIs externas de redes sociales ocasionados por cambios de terceros, caídas masivas de servidores de Instagram/Meta/YouTube o bloqueos de cuentas derivados de prácticas de spam realizadas por el usuario organizador.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">6. Contacto y Soporte Legal</h2>
          <p>
            Para consultas respecto a estos términos, derechos ARCO o requerimientos de auditoría, puedes escribir a nuestro canal oficial <span className="text-pink-400 font-mono font-bold">{CONTACT_EMAIL}</span> o visitar nuestro formulario de <Link href="/contacto" className="text-pink-400 underline font-semibold hover:text-pink-300">atención y contacto</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
