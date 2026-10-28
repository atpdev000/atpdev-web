import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, Landmark, Briefcase, FileCheck, ShieldCheck, 
  HelpCircle, ArrowRight, Award, CheckCircle2, Sparkles, FileText, Lock
} from 'lucide-react';
import { CvCasGenerator } from '@/components/CvCasGenerator';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Generador de CV SERVIR CAS y ATS 2026',
  description: 'Crea y descarga gratis tu CV SERVIR CAS y ATS Harvard en PDF A4 editable. Plantillas oficiales para convocatorias de trabajo en el Estado Peruano.',
  keywords: [
    'generador cv cas servir',
    'crear cv peru pdf gratis',
    'ficha resumen hoja de vida cas peru',
    'formato cv estado peru 2026',
    'declaracion jurada hoja de vida cas',
    'modelo cv convocatorias cas',
    'plantillas cv profesional peru',
    'cv ats friendly peru',
    'anexo formato hoja de vida servir',
    'curriculum vitae peru word editable'
  ],
  alternates: {
    canonical: `${SITE_URL}/crear-cv-cas`,
  },
  openGraph: {
    title: 'Generador de CV SERVIR CAS y ATS 2026 | chamba pro',
    description: 'Crea y descarga gratis tu CV SERVIR CAS y ATS Harvard en PDF A4 editable. Plantillas oficiales para convocatorias de trabajo en el Estado Peruano.',
    url: `${SITE_URL}/crear-cv-cas`,
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Generador de CV SERVIR CAS y ATS 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generador de CV SERVIR CAS y ATS 2026 | chamba pro',
    description: 'Crea tu CV para convocatorias del Estado (SERVIR CAS) o Sector Privado en PDF y Word editable 100% gratis.',
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Generador de CV Profesional Perú — Chamba Pro',
      url: `${SITE_URL}/crear-cv-cas`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PEN',
      },
      description: 'Herramienta online gratuita para crear, editar y exportar Curriculum Vitae calibrados para convocatorias del Estado peruano (SERVIR CAS) y sector corporativo.',
      featureList: [
        'Plantilla Oficial SERVIR Ficha Resumen CAS',
        'Plantilla Moderno Ejecutivo en 2 Columnas con Foto',
        'Plantilla Minimalista Harvard ATS Friendly',
        'Plantilla Tech & Contemporáneo con Stack de Habilidades',
        'Exportación nativa a Word (.DOC) editable con tablas y membrete',
        'Guardado e Impresión directa en PDF en hoja A4 exacta',
        'Auto-guardado continuo en el navegador sin almacenamiento de datos privados en servidores',
        'Validación en tiempo real con indicador de campos pendientes'
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: `${SITE_URL}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Generador de CV Profesional',
          item: `${SITE_URL}/crear-cv-cas`,
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'Cómo crear y descargar un CV profesional para convocatorias CAS y empresas en Perú',
      description: 'Guía paso a paso para elaborar una hoja de vida con los estándares oficiales de SERVIR y filtros de selección laboral.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Selecciona tu Plantilla de CV',
          text: 'Elige entre el modelo Oficial SERVIR / CAS (para convocatorias del Estado), Moderno Ejecutivo, Minimalista ATS o Tech.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Completa las 6 Secciones Clave',
          text: 'Ingresa tus datos personales, resumen ejecutivo, grados académicos, experiencia laboral acreditada, cursos y habilidades.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Descarga gratis en Word (.DOC) o PDF A4',
          text: 'Presiona Descargar en Word para obtener tu archivo 100% editable o Guardar / Imprimir PDF para imprimir de inmediato en hoja A4.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué formato de CV es obligatorio para postular a convocatorias CAS en Perú?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'En las convocatorias del Estado bajo los regímenes CAS (Decreto Legislativo N° 1057), Ley 728 y Ley 276, las bases exigen presentar el Anexo de Ficha Resumen de Hoja de Vida estandarizado por SERVIR. Dicho anexo contiene tablas formales con la acreditación de formación académica, experiencia general, experiencia específica y la Declaración Jurada de veracidad bajo la Ley N° 27444.',
          },
        },
        {
          '@type': 'Question',
          name: '¿El generador de CV de chamba pro es 100% gratuito y sin marca de agua?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, es 100% gratuito, libre de marcas de agua, sin publicidad intrusiva en el documento final y no requiere registro ni suscripción. Puedes exportar en PDF A4 o descargar en Word (.DOC) cuantas veces desees.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál es la diferencia entre Experiencia General y Experiencia Específica en convocatorias públicas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La Experiencia General se contabiliza desde la obtención del grado de egresado universitario o técnico en adelante, o el total de años laborados. La Experiencia Específica corresponde exclusivamente al tiempo desempeñado en funciones idénticas o afines al puesto al que estás postulando en el perfil de puesto (TDR).',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué formato se recomienda para postular al Sector Privado?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para empresas privadas, consultorías y multinacionales se recomienda el formato Minimalista ATS-Friendly (Estilo Harvard) o Moderno Ejecutivo. Los sistemas ATS (Applicant Tracking Systems) prefieren estructuras limpias en texto plano con títulos estandarizados para filtrar candidatos automáticamente.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Mis datos personales se guardan en algún servidor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. El generador funciona enteramente en tu navegador web mediante almacenamiento local (LocalStorage). Ningún dato personal (DNI, teléfono, dirección, correo) es enviado ni guardado en servidores externos, garantizando tu privacidad absoluta bajo la Ley de Protección de Datos Personales (Ley N° 29733).',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo editar el archivo descargado en Microsoft Word o Google Docs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Al hacer clic en "Descargar en Word (.DOC)", se genera un archivo de documento con tablas, estilos institucionales y formato de párrafo 100% editable en Microsoft Word, Google Docs y LibreOffice.',
          },
        },
      ],
    },
  ],
};

export default function CrearCvCasPage() {
  return (
    <>
      {/* Google Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-16 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Ruta de navegación" className="print:hidden flex items-center justify-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} className="text-slate-400" />
          <Link href="/empleos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Herramientas</Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Generador de CV SERVIR CAS</span>
        </nav>

        {/* Centered Hero Header */}
        <header className="print:hidden text-center space-y-3.5 max-w-4xl mx-auto">
          {/* Centered Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold shadow-sm">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Formatos Oficiales SERVIR CAS & Sector Privado</span>
          </div>

          {/* Centered H1 Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
            Generador de CV Formato SERVIR y ATS
          </h1>

          {/* Centered Short Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Diseña y descarga gratis tu hoja de vida en <strong>PDF A4 exacto</strong> o <strong>Word (.DOC) editable</strong> con las plantillas oficiales exigidas por el Estado y empresas.
          </p>

          {/* Centered Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shadow-sm">
              ✓ Ficha Resumen SERVIR
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 flex items-center gap-1.5 shadow-sm">
              ✓ Formato Harvard ATS
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
              ✓ 100% Gratuito y Privado
            </span>
          </div>
        </header>

        {/* Interactive Pro Generator Studio */}
        <main>
          <CvCasGenerator />
        </main>

        {/* Google AdSense / Sponsor Slot 2 */}
        <div className="print:hidden">
          <AdBannerSlot type="in-feed" className="my-8" />
        </div>

        {/* Guidelines & Documentation */}
        <section className="print:hidden space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          {/* Section 1 & 2 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <Landmark size={22} />
                <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                  Estructura de la Ficha Resumen SERVIR para el Estado Peruano
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Las convocatorias públicas en Perú bajo el régimen del <strong>Decreto Legislativo N° 1057 (CAS)</strong>, la Ley N° 728 y el D.L. N° 276 requieren presentar obligatoriamente la <strong>Ficha Resumen de Hoja de Vida</strong>. El comité de selección utiliza este documento como base para calificar los factores de evaluación curricular:
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Datos de Identificación y Colegiatura:</strong> Registro de DNI, RUC personal, teléfonos, dirección y número de colegiatura con condición de habilitado (si el puesto lo requiere por ley).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Formación Académica Acreditada:</strong> Grados registrados en SUNEDU (Secundaria, Técnico, Bachiller, Titulado, Maestría o Doctorado) especificando fechas de expedición del diploma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Experiencia General vs. Específica:</strong> Desglose exacto de periodos laborados, diferenciando la experiencia total de la experiencia directamente vinculada a las funciones del puesto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Declaración Jurada (Ley N° 27444):</strong> Cláusula formal que valida bajo juramento que toda la información consignada es verídica y verificable con certificados de trabajo o contratos.</span>
                </li>
              </ul>
            </div>

            {/* Section 2: Formatos ATS Harvard y Sector Privado */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2.5 text-sky-600 dark:text-sky-400">
                <Briefcase size={22} />
                <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                  Plantillas para el Sector Privado y Filtros ATS
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                En medianas y grandes empresas, consultorías y firmas multinacionales, los currículums son filtrados por sistemas de software de seguimiento de candidatos (<strong>ATS - Applicant Tracking Systems</strong>) antes de llegar a manos del reclutador humano:
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Formato Harvard ATS:</strong> Diseño lineal de 1 sola columna con tipografías estandarizadas, sin tablas complejas ni gráficos pesados que puedan confundir a los algoritmos de lectura.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Modelo Moderno Ejecutivo:</strong> Disposición en dos columnas con fotografía profesional tipo carné, ideal para cargos gerenciales, comerciales y postulaciones directas por correo o LinkedIn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Tech & Contemporáneo:</strong> Orientado a especialistas en desarrollo de software, ciencia de datos, marketing digital y startups, con énfasis visual en stacks de herramientas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Logros Cuantificables:</strong> Se recomienda redactar cada experiencia con verbos de acción y cifras (% de ahorro, incremento de ventas, tiempos reducidos).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Preguntas Frecuentes (FAQ) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                <HelpCircle size={22} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                  Preguntas Frecuentes sobre el Curriculum Vitae en Perú
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Respuestas claras sobre normativas laborales, formatos aceptados y exportación
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿El generador tiene costo o coloca marcas de agua?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. Esta herramienta desarrollada por <strong>Chamba Pro</strong> es 100% gratuita. Tus documentos se generan completamente limpios, sin logotipos impuestos ni restricciones de descarga.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿Qué plantilla elijo para Convocatorias del Estado?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Debes seleccionar la plantilla <strong>&quot;Oficial SERVIR / CAS&quot;</strong>. Es la única que cumple la estructura formal exigida por ministerios, municipalidades y entidades públicas peruanas bajo la Ley N° 27444.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿Cómo calcula el Estado el tiempo de experiencia?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Para profesionales universitarios o técnicos, la experiencia se contabiliza desde la fecha de expedición de la constancia de egresado. Si no presentas egresado, la comisión contará desde el diploma de bachiller o título.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿Por qué descargar en Word (.DOC)?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Descargar en Word te permite tener un archivo nativo editable en Microsoft Word o Google Docs. Puedes personalizar tipografías, añadir anexos adicionales o adecuarlo a las bases específicas de cada concurso público.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿Mis datos personales se guardan en internet?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. El generador procesa toda la información de manera local y aislada dentro de tu propio navegador. Ningún número de DNI, teléfono o dato privado es transmitido ni guardado en servidores externos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ¿Es obligatoria la foto en el CV en Perú?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  En el Estado (Ficha SERVIR) la foto es opcional, aunque la mayoría de postulantes adjunta su foto carné formal. En el sector privado moderno, los formatos ATS no requieren foto para evitar sesgos en la selección.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Internal Links to Other Tools */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award size={16} className="text-emerald-400" />
                Explora más herramientas oficiales para tu postulación laboral
              </h3>
              <p className="text-xs text-slate-300">
                Simula entrevistas de trabajo técnicas o calcula tu sueldo neto CAS descontando AFP / ONP y renta.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/calculadora-sueldo"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <span>Calculadora Sueldo CAS</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/empleos"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Ver Convocatorias CAS</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Google AdSense / Sponsor Slot 3: Bottom Leaderboard */}
          <div className="pt-2">
            <AdBannerSlot type="leaderboard" className="my-4" />
          </div>
        </section>
      </div>
    </>
  );
}
