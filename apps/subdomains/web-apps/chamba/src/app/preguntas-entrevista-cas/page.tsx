import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';
import { PreguntasCasSimulator } from '@/components/PreguntasCasSimulator';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Banco de Preguntas y Examen CAS Perú 2026',
  description: 'Simulador gratuito de examen de conocimientos y entrevista de evaluación técnica para convocatorias CAS en el Estado (Ley 27444, Ley 30225 y Ética).',
  alternates: {
    canonical: `${SITE_URL}/preguntas-entrevista-cas`,
  },
  openGraph: {
    title: 'Banco de Preguntas & Examen de Entrevista CAS Perú 2026 | chamba pro',
    description: 'Simulador gratuito de examen de conocimientos y entrevista de evaluación técnica CAS.',
    url: `${SITE_URL}/preguntas-entrevista-cas`,
    type: 'website',
  },
  keywords: [
    'preguntas examen cas peru',
    'preguntas entrevista cas 2026',
    'examen de conocimientos cas minedu sunat',
    'ley 27444 preguntas examen',
    'ley de contrataciones del estado examen',
    'simulador evaluacion tecnica estado'
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: `${SITE_URL}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Banco de Preguntas CAS",
      item: `${SITE_URL}/preguntas-entrevista-cas`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué temas entran en el examen de conocimientos de una convocatoria CAS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los temas más evaluados en convocatorias del Estado Peruano incluyen la Ley N° 27444 (Ley del Procedimiento Administrativo General), la Ley N° 30225 (Ley de Contrataciones del Estado), Código de Ética de la Función Pública y conocimientos técnicos específicos según el perfil del puesto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es el puntaje mínimo aprobatorio en una evaluación técnica CAS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Por lo general, las bases oficiales establecen un puntaje mínimo aprobatorio de entre 12 y 14 sobre 20 en la evaluación de conocimientos o técnica para pasar a la etapa de entrevista personal.",
      },
    },
  ],
};

export default function PreguntasCasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <span className="text-slate-200 font-semibold">Simulador de Preguntas CAS</span>
        </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
          <HelpCircle size={14} />
          <span>Balotario Oficial para Evaluación Técnica y Entrevista Personal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Banco de Preguntas & Examen CAS Perú 2026
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Ponte a prueba con preguntas reales tomadas en las evaluaciones de conocimientos de la SUNAT, MINEDU, Poder Judicial, EsSalud y ONPE con fundamentación legal actualizada.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Interactive Questions Simulator */}
      <PreguntasCasSimulator />

      {/* Bottom Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="mt-8" />
    </div>
    </>
  );
}
