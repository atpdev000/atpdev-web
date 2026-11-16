import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, Calculator, ShieldCheck, HelpCircle } from 'lucide-react';
import { CalculadoraSueldo } from '@/components/CalculadoraSueldo';
import { AdBannerSlot } from '@/components/AdBannerSlot';

import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Calculadora de Sueldo Neto CAS 1057 & 728 Perú 2026',
  description: 'Calcula gratis tu sueldo líquido neto, descuentos de AFP/ONP e impuesto a la renta para convocatorias laborales en el Estado y Sector Privado en Perú.',
  alternates: {
    canonical: `${SITE_URL}/calculadora-sueldo`,
  },
  keywords: [
    'calculadora sueldo cas 1057',
    'cuanto gana cas 1057 neto',
    'calculadora afp onp peru',
    'calculadora sueldo liquido peru',
    'descuentos cas peru',
    'aguinaldo cas 2026',
    'sueldo neto 728 peru'
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué descuentos se aplican al contrato CAS 1057?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los trabajadores CAS aportan obligatoriamente al sistema de pensiones (ONP 13% o AFP ~12.8%). Asimismo, si la remuneración anual bruta excede las 7 UIT (S/ 36,050), se descuenta Impuesto a la Renta de 5ta Categoría."
      }
    },
    {
      "@type": "Question",
      "name": "¿A cuántos aguinaldos tiene derecho un servidor CAS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Por Ley N° 31639, los servidores bajo régimen CAS reciben dos aguinaldos al año (Fiestas Patrias en Julio y Navidad en Diciembre) fijados por Ley de Presupuesto (S/ 300 cada uno)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Diferencia entre CAS (1057) y Planilla D.L. 728?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El régimen D.L. 728 incluye gratificaciones equivalentes a 1 sueldo completo en Julio y Diciembre (+9% EsSalud) más depósito de CTS (1.16 sueldos por año), mientras que el CAS otorga aguinaldos fijos y no incluye CTS."
      }
    },
    {
      "@type": "Question",
      "name": "¿Locación de Servicios (RHO) descuenta AFP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. El contrato por Locación de Servicios es de naturaleza civil y no incluye aportes a fondos de pensión obligatorios ni vacaciones. Solo aplica la retención del 8% por Renta de 4ta Categoría si el recibo supera S/ 1,500."
      }
    }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Calculadora de Sueldo Neto CAS & 728 Perú",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PEN"
  }
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
      "name": "Calculadora de Sueldo CAS",
      "item": `${SITE_URL}/calculadora-sueldo`,
    },
  ],
};

export default function CalculadoraSueldoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Calculadora de Sueldo CAS & 728</span>
      </nav>

      {/* Main Hero Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold shadow-sm">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Herramienta Oficial Gratuita — Legislación Laboral Peruana</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Calculadora de Sueldo Neto & Descuentos de Ley
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Simula en tiempo real tu remuneración líquida al banco, descuentos de AFP/ONP y Quinta Categoría según tu régimen laboral.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Calculator Interactive Component */}
      <CalculadoraSueldo />

      {/* In-feed / Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="my-6" />

      {/* Informative FAQ / Educational Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <HelpCircle className="text-emerald-600 dark:text-emerald-400" size={22} />
          <span>Preguntas Frecuentes sobre Regímenes y Remuneraciones en el Estado</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">¿Qué descuentos se aplican al contrato CAS 1057?</h3>
            <p className="leading-relaxed">
              Los trabajadores CAS aportan obligatoriamente al sistema de pensiones (ONP 13% o AFP ~12.8%). Asimismo, si la remuneración anual bruta excede las 7 UIT (S/ 36,050), se descuenta Impuesto a la Renta de 5ta Categoría.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">¿A cuántos aguinaldos tiene derecho un servidor CAS?</h3>
            <p className="leading-relaxed">
              Por Ley N° 31639, los servidores bajo régimen CAS reciben dos aguinaldos al año (Fiestas Patrias en Julio y Navidad en Diciembre) fijados por Ley de Presupuesto (S/ 300 cada uno).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">¿Diferencia entre CAS (1057) y Planilla D.L. 728?</h3>
            <p className="leading-relaxed">
              El régimen D.L. 728 incluye gratificaciones equivalentes a 1 sueldo completo en Julio y Diciembre (+9% EsSalud) más depósito de CTS (1.16 sueldos por año), mientras que el CAS otorga aguinaldos fijos y no incluye CTS.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">¿Locación de Servicios (RHO) descuenta AFP?</h3>
            <p className="leading-relaxed">
              No. El contrato por Locación de Servicios es de naturaleza civil y no incluye aportes a fondos de pensión obligatorios ni vacaciones. Solo aplica la retención del 8% por Renta de 4ta Categoría si el recibo supera S/ 1,500.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
}
