import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, UserCheck, ShieldCheck } from 'lucide-react';
import { AiInterviewSimulator } from '@/components/AiInterviewSimulator';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Simulador de Entrevista Técnica y Examen Oral CAS 2026',
  description: 'Entrena tu entrevista personal y evaluación técnica CAS con balotarios oficiales para SUNAT, MINEDU, BCRP, EsSalud y el Poder Judicial.',
  alternates: {
    canonical: `${SITE_URL}/simulador-entrevista-ia`,
  },
  openGraph: {
    title: 'Simulador de Entrevista Técnica y Examen Oral CAS 2026 | chamba pro',
    description: 'Entrena tu entrevista personal y evaluación técnica CAS con balotarios oficiales.',
    url: `${SITE_URL}/simulador-entrevista-ia`,
    type: 'website',
  },
  keywords: [
    'simulador entrevista cas',
    'entrevista personal cas preguntas y respuestas',
    'evaluacion tecnica sunat minedu',
    'entrevista de trabajo estado peru',
    'como pasar entrevista cas 2026'
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Simulador de Entrevista Técnica y Examen Oral para el Estado Peruano",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PEN"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo evalúa el simulador de entrevista de Chamba Pro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El simulador evalúa competencias técnicas, coherencia comunicativa, ética pública y dominio normativo según los estándares de evaluación de SERVIR y el marco de contrataciones del Estado Peruano."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué tipo de preguntas formula el Comité de Selección en una entrevista CAS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las entrevistas CAS abordan preguntas situacionales (resolución de conflictos y trabajo bajo presión), motivación para ingresar al servicio civil, conocimiento de la Ley 27444 y funciones específicas del puesto."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": SITE_URL,
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Simulador de Entrevista Técnica",
      "item": `${SITE_URL}/simulador-entrevista-ia`,
    },
  ],
};

export default function AiInterviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <span className="text-slate-200 font-semibold">Simulador de Entrevista Técnica</span>
        </nav>

      {/* Main Header (Centered & Professional) */}
      <div className="space-y-3 text-center max-w-3xl mx-auto pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <ShieldCheck size={14} />
          <span>Evaluación Técnica con Parámetros SERVIR, PCM & Ley 27444</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Simulador de Entrevista Técnica y Examen Oral CAS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Practica tus respuestas ante el jurado evaluador y obtén un dictamen técnico con balotarios oficiales para asegurar tu plaza en el Estado.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Interactive AI Component */}
      <AiInterviewSimulator />

      {/* Bottom Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="mt-8" />
    </div>
    </>
  );
}
