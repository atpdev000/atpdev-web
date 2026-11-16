import Link from 'next/link';
import { ShieldCheck, Lock, Cookie, Eye, CheckCircle2, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Política de Privacidad & Protección de Datos',
  description: 'Política de privacidad de Chamba Pro conforme a la Ley 29733 de Protección de Datos Personales y políticas de cookies de terceros de Google AdSense.',
  alternates: {
    canonical: `${SITE_URL}/politica-de-privacidad`,
  },
  openGraph: {
    title: 'Política de Privacidad & Protección de Datos — Chamba Pro',
    description: 'Política de privacidad y cookies de Chamba Pro conforme a la Ley 29733.',
    url: `${SITE_URL}/politica-de-privacidad`,
    type: 'website',
  },
};

export default function PoliticaPrivacidadPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Política de Privacidad',
        item: `${SITE_URL}/politica-de-privacidad`,
      },
    ],
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-semibold">
            <ShieldCheck size={14} />
            <span>Transparencia & Cumplimiento Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Política de Privacidad & Tratamiento de Datos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Última actualización: Septiembre de 2026. Esta política describe cómo <strong>Chamba Pro</strong> (accesible desde <code>atpdev.dev</code> y <code>chamba.atpdev.dev</code>) gestiona la información, respeta la privacidad de los usuarios conforme a la legislación peruana y se adhiere a las directrices de publicación de <strong>Google AdSense</strong>.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          {/* Section 1: Compromiso y Marco Legal */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Lock className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>1. Marco Legal y Compromiso de Protección (Ley N° 29733 - Perú)</span>
            </h2>
            <p>
              Chamba Pro opera bajo los principios de licitud, consentimiento, finalidad, proporcionalidad y seguridad establecidos en la <strong>Ley N° 29733 (Ley de Protección de Datos Personales de la República del Perú)</strong> y su Reglamento aprobado por D.S. 003-2013-JUS.
            </p>
            <p>
              Chamba Pro <strong>NO solicita registros obligatorios, no vende bases de datos, no recopila contraseñas bancarias ni cobra a los postulantes</strong> por consultar convocatorias ni por postular a ofertas laborales del Estado (CAS 1057, D.L. 728, D.L. 276) o del sector privado.
            </p>
          </section>

          {/* Section 2: Cookies y Google AdSense */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Cookie className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>2. Uso de Cookies y Publicidad de Terceros (Google AdSense)</span>
            </h2>
            <p>
              Este sitio web utiliza cookies y tecnologías de seguimiento similares para mejorar la navegación del usuario, medir la audiencia y mostrar anuncios relevantes.
            </p>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">Información exigida por Google para suscriptores y visitantes:</p>
              <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Proveedores externos:</strong> Proveedores externos, incluido Google, utilizan cookies para publicar anuncios basados en las visitas anteriores del usuario a este sitio web o a otros sitios de Internet.
                </li>
                <li>
                  <strong>Cookie de publicidad de Google (DART / DoubleClick):</strong> El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios a los usuarios en función de sus visitas a Chamba Pro y a otros sitios web de Internet.
                </li>
                <li>
                  <strong>Inhabilitación de publicidad personalizada:</strong> Los usuarios pueden inhabilitar la publicidad personalizada consultando la sección de Preferencias de Anuncios de Google en{' '}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                  >
                    adssettings.google.com <ExternalLink size={11} />
                  </a>
                  {' '}o visitando el portal de autorregulación de la industria publicitaria en{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                  >
                    aboutads.info/choices <ExternalLink size={11} />
                  </a>
                  . Asimismo, puedes consultar cómo Google utiliza los datos cuando usas sitios o aplicaciones de sus socios en{' '}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                  >
                    policies.google.com/technologies/partner-sites <ExternalLink size={11} />
                  </a>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Archivos de Registro y Analítica */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Eye className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>3. Archivos de Registro (Log Files) y Métricas</span>
            </h2>
            <p>
              Al igual que la mayoría de portales web de alto rendimiento, Chamba Pro genera archivos de registro de servidor con propósitos estrictos de seguridad, prevención de ataques de denegación de servicio (DDoS) y análisis estadístico. Estos registros pueden incluir direcciones IP anonimizadas, tipo de navegador, proveedor de servicios de Internet (ISP), fecha/hora de acceso y páginas visitadas. Ninguno de estos datos se vincula a identidades personales reconocibles.
            </p>
          </section>

          {/* Section 4: Herramientas del Sitio (Calculadora, CV, Simulador IA) */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>4. Tratamiento de Datos en Herramientas Interactivas</span>
            </h2>
            <p>
              Nuestras herramientas de valor añadido (<strong>Calculadora de Sueldo Neto CAS</strong>, <strong>Generador de CV en formato estándar</strong> y <strong>Simulador de Entrevistas de Selección</strong>) procesan la información de manera <em>client-side</em> (directamente en el navegador del usuario) o mediante peticiones efímeras sin almacenamiento persistente de datos biográficos personales sensibles en bases de datos públicas.
            </p>
          </section>

          {/* Section 5: Enlaces a Terceros y Portales Oficiales */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <ExternalLink className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>5. Enlaces a Fuentes Oficiales y Sitios Externos</span>
            </h2>
            <p>
              Chamba Pro facilita enlaces directos hacia las fuentes institucionales oficiales de los convocantes (SERVIR, SUNAT, BCRP, ONPE, Poder Judicial, GOREs, etc.). Una vez que el usuario hace clic en <em>&quot;Ver Oferta Oficial&quot;</em> o <em>&quot;Descargar Bases PDF&quot;</em> y abandona nuestro dominio, rige la política de privacidad del respectivo portal gubernamental o privado.
            </p>
          </section>

          {/* Section 6: Ejercicio de Derechos ARCO y Contacto */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <HelpCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
              <span>6. Ejercicio de Derechos ARCO y Contacto</span>
            </h2>
            <p>
              Para ejercer cualquier derecho de Acceso, Rectificación, Cancelación u Oposición (Derechos ARCO), o formular consultas respecto a esta política de privacidad, puedes comunicarte a través de nuestra página de{' '}
              <Link href="/contacto" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Contacto Oficial
              </Link>{' '}
              o escribir a{' '}
              <a
                href="mailto:contacto@atpdev.dev"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono font-semibold"
              >
                contacto@atpdev.dev
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
