import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import PlantillasClient, { PlantillaItem } from './PlantillasClient';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Plantillas y Anexos Oficiales CAS 2026 en Word y Texto',
  description: 'Descarga gratis declaraciones juradas de no antecedentes, no REDAM, ficha de postulante y formatos oficiales exigidos en convocatorias CAS del Estado Peruano.',
  keywords: [
    'declaracion jurada cas formato',
    'anexos convocatorias cas 2026',
    'declaracion jurada de antecedentes penales formato peru',
    'declaracion jurada redam word',
    'ficha postulante cas estado peruano',
    'plantillas anexos servir cas'
  ],
  alternates: {
    canonical: `${SITE_URL}/plantillas-anexos`,
  },
  openGraph: {
    title: 'Plantillas y Anexos Oficiales CAS 2026 — Chamba Pro',
    description: 'Formatos estándar de declaraciones juradas y fichas de inscripción para postular al Estado Peruano.',
    url: `${SITE_URL}/plantillas-anexos`,
    siteName: 'chamba pro',
    type: 'website',
    locale: 'es_PE',
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plantillas y Anexos Oficiales CAS 2026 — Chamba Pro',
    description: 'Declaraciones juradas y formatos oficiales listos para copiar y descargar.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const PLANTILLAS: PlantillaItem[] = [
  {
    id: 'dj-antecedentes',
    title: 'Declaración Jurada de No Registrar Antecedentes (Penales, Policiales y Judiciales)',
    category: 'Anexo Obligatorio CAS / 728',
    description: 'Formato estándar exigido por entidades públicas (SUNAT, MINEDU, Poder Judicial, ONPE, etc.) para constatar la inexistencia de antecedentes.',
    content: `DECLARACIÓN JURADA DE NO REGISTRAR ANTECEDENTES
(Ley N° 29607 y D.S. N° 075-2008-PCM)

Yo, [NOMBRES Y APELLIDOS COMPLETOS], identificado(a) con DNI N° [NÚMERO DE DNI], con domicilio legal en [DIRECCIÓN COMPLETA], departamento de [DEPARTAMENTO], provincia de [PROVINCIA], distrito de [DISTRITO].

DECLARO BAJO JURAMENTO QUE:

1. No registro Antecedentes Penales, Policiales ni Judiciales a la fecha de suscripción del presente documento.
2. No me encuentro inhabilitado(a) administrativa ni judicialmente para ejercer la función pública ni para contratar con el Estado.
3. No he sido destituido(a) ni separado(a) de la Administración Pública por sanción disciplinaria.
4. Toda la información consignada en mi Hoja de Vida (CV) y los documentos adjuntos son verdaderos y concuerdan con la realidad.

Formulo la presente declaración jurada en virtud del Principio de Presunción de Veracidad establecido en el Artículo 51° del Texto Único Ordenado de la Ley N° 27444, Ley del Procedimiento Administrativo General, sujetándome a las sanciones legales en caso de falsedad.

Dado en la ciudad de [CIUDAD], a los [DÍA] días del mes de [MES] de 2026.


________________________________________
Firma del Postulante
DNI N°: [NÚMERO DE DNI]`,
  },
  {
    id: 'dj-redam',
    title: 'Declaración Jurada de No Estar Inscrito en el REDAM / REDERESI',
    category: 'Anexo Obligatorio Estado',
    description: 'Declaración jurada sobre el Registro de Deudores Alimentarios Morosos conforme a la Ley N° 28970.',
    content: `DECLARACIÓN JURADA DE NO ESTAR INSCRITO EN EL REDAM Y REDERESI
(Ley N° 28970 y Ley N° 29988)

Yo, [NOMBRES Y APELLIDOS COMPLETOS], identificado(a) con DNI N° [NÚMERO DE DNI], postulante al proceso de Selección CAS N° [CÓDIGO DE CONVOCATORIA], para el puesto de [NOMBRE DEL PUESTO].

DECLARO BAJO JURAMENTO:

1. No estar registrado(a) en el Registro de Deudores Alimentarios Morosos - REDAM del Poder Judicial.
2. No registrar condena por los delitos señalados en la Ley N° 29988 (Terrorismo, apología, delitos contra la libertad sexual).
3. No tener nepotismo ni parentesco hasta el cuarto grado de consanguinidad o segundo de afinidad con funcionarios que tengan facultad de nombrar o contratar en la entidad.

Lima, [DÍA] de [MES] de 2026.


________________________________________
Firma del Postulante
DNI N°: [NÚMERO DE DNI]`,
  },
  {
    id: 'ficha-datos',
    title: 'Ficha de Inscripción y Datos Personales del Postulante',
    category: 'Formato Estándar Ficha CAS',
    description: 'Estructura modelo para completar tus datos académicos, laborales y de contacto según el expediente de postulación.',
    content: `FICHA DE INSCRIPCIÓN Y DATOS PERSONALES DEL POSTULANTE

1. DATOS PERSONALES:
- Apellido Paterno: [APELLIDO PATERNO]
- Apellido Materno: [APELLIDO MATERNO]
- Nombres: [NOMBRES COMPLETOS]
- N° DNI / CE: [DNI]
- RUC Personas (10): [RUC 10]
- Fecha de Nacimiento: [DD/MM/AAAA]
- Teléfono Celular: [TELÉFONO]
- Correo Electrónico: [CORREO]
- Dirección: [DIRECCIÓN RESIDENCIAL]

2. FORMACIÓN ACADÉMICA:
- Grado Académico: [Titulado / Bachiller / Técnico]
- Profesión / Especialidad: [CARRERA O ESPECIALIDAD]
- Universidad / Instituto: [INSTITUCIÓN EDUCATIVA]
- N° Colegiatura (si aplica): [CÓDIGO COLEGIATURA]

3. EXPERIENCIA LABORAL GENERAL Y ESPECÍFICA:
- Tiempo Total de Experiencia General: [X AÑOS Y Y MESES]
- Tiempo Total de Experiencia en el Sector Público: [X AÑOS]
- Último Centro de Trabajo: [NOMBRE DE ENTIDAD O EMPRESA]
- Cargo Desempeñado: [CARGO]`,
  },
];

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
      name: 'Plantillas y Anexos CAS',
      item: `${SITE_URL}/plantillas-anexos`,
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué declaraciones juradas son obligatorias para postular a convocatorias CAS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las declaraciones juradas básicas exigidas por las bases de convocatorias CAS incluyen: Declaración Jurada de no registrar antecedentes penales/policiales, Declaración Jurada de no estar en el REDAM (deudores alimentarios), Declaración Jurada de no nepotismo y Ficha de postulación con presunción de veracidad.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Debo legalizar notarialmente los anexos y declaraciones juradas CAS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. En virtud del Principio de Presunción de Veracidad (Ley N° 27444), las declaraciones juradas se presentan con firma manuscrita simple o digital. Solo si resultas ganador del concurso la entidad podrá solicitar la verificación o fedateo correspondiente.',
      },
    },
  ],
};

export default function PlantillasAnexosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Centro de Plantillas & Anexos CAS</span>
      </nav>

      {/* Main Header (Centered & Professional) */}
      <div className="space-y-3 text-center max-w-3xl mx-auto pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-400 text-xs font-mono font-bold shadow-sm">
          <FileText size={14} />
          <span>Formatos Gratuitos Listos para Copiar y Descargar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
          Plantillas y Anexos Oficiales CAS 2026
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Descarga o copia declaraciones juradas y fichas de inscripción oficiales obligatorias para postular a entidades del Estado.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Interactive Templates Client Component */}
      <PlantillasClient plantillas={PLANTILLAS} />

      {/* Bottom Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="mt-8" />
    </div>
  );
}
