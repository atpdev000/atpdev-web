import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Scale } from 'lucide-react';
import { ComparadorRegimenes } from '@/components/ComparadorRegimenes';
import { AdBannerSlot } from '@/components/AdBannerSlot';

import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Comparador de Regímenes Laborales Perú 2026',
  description: 'Compara derechos laborales, gratificaciones, CTS y vacaciones entre regímenes CAS 1057, D.L. 728, D.L. 276 y Locación de Servicios (RHO) en Perú.',
  alternates: {
    canonical: `${SITE_URL}/comparador-regimenes`,
  },
  openGraph: {
    title: 'Comparador de Regímenes Laborales Perú 2026 | chamba pro',
    description: 'Compara derechos laborales, gratificaciones, CTS y vacaciones entre regímenes CAS 1057, D.L. 728 y 276.',
    url: `${SITE_URL}/comparador-regimenes`,
    type: 'website',
  },
  keywords: [
    'diferencia cas 1057 y 728',
    'comparador regimenes laborales peru',
    'beneficios cas 1057 gratificacion cts',
    'regimen 728 vs cas peru 2026',
    'derechos locacion de servicios rho'
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
      name: "Comparador de Regímenes",
      item: `${SITE_URL}/comparador-regimenes`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es el régimen laboral con mayores beneficios en el Estado Peruano?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El régimen del D.L. 728 (actividad privada) otorga gratificaciones completas (1 sueldo en julio y diciembre) y depósito semestral de CTS. El régimen CAS (D.L. 1057) ofrece 30 días de vacaciones pero cuenta con aguinaldos fijados por ley de presupuesto.",
      },
    },
    {
      "@type": "Question",
      name: "¿La Locación de Servicios (RHO) otorga beneficios laborales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. La locación de servicios es un contrato de naturaleza civil regulado por el Código Civil. No genera vínculo laboral ni otorga vacaciones, CTS ni seguro pagado por la entidad.",
      },
    },
  ],
};

export default function ComparadorPage() {
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
          <span className="text-slate-200 font-semibold">Comparador de Regímenes</span>
        </nav>

      {/* Main Header (Centered & Professional) */}
      <div className="space-y-3 text-center max-w-3xl mx-auto pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <Scale size={14} />
          <span>Matriz Oficial de Derechos Laborales en el Sector Público & Privado</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Comparador de Regímenes Laborales en Perú
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compara al detalle tus beneficios de gratificación, CTS, vacaciones y salud en los regímenes CAS 1057, Ley 728 y Ley 276.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Interactive Matrix */}
      <ComparadorRegimenes />

      {/* Bottom Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="mt-8" />
    </div>
    </>
  );
}
