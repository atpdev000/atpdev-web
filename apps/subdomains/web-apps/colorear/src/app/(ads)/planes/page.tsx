import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Planes y Paquetes de Créditos — Colorear Pro & Estudio KDP',
  description:
    'Usa gratis la biblioteca de dibujos PDF 300 DPI y el compilador KDP, o activa paquetes de créditos Pro para producción intensiva de libros para colorear.',
  alternates: { canonical: 'https://colorear.atpdev.dev/planes' },
};

const PLANS = [
  {
    name: 'Plan Gratuito',
    price: 'S/ 0 / $0',
    period: 'Para siempre',
    badge: 'Familias y Docentes',
    highlight: false,
    description:
      'Acceso libre a toda la biblioteca imprimible, coloreador online interactivo y pruebas del Estudio KDP.',
    features: [
      'Descarga ilimitada de láminas PDF a 300 DPI',
      'Coloreador interactivo en pantalla sin registro',
      'Hasta 25 generaciones IA diarias con cuota justa',
      'Subida de hasta 60 dibujos propios al Estudio KDP',
      'Exportador PDF Interior 300 DPI + Portada con lomo exacto',
    ],
    ctaLabel: 'Empezar gratis ahora',
    ctaHref: '/estudio-kdp',
  },
  {
    name: 'Pack Creador KDP',
    price: 'S/ 29 / $9',
    period: 'Pago único • 120 créditos IA HD',
    badge: 'Más popular',
    highlight: true,
    description:
      'Pensado para publicar tus primeros 3 libros completos en Amazon KDP con motor de ilustración prioritario sin cuotas diarias.',
    features: [
      '120 ilustraciones IA HD sin límite diario ni esperas',
      'Estilo consistente por serie (Bold & Easy, Cozy, Kawaii)',
      'Limpieza automática blanco/negro puro 300 DPI',
      'Soporte directo para revisión de márgenes y sangrado KDP',
      'Activación inmediata por Yape, Plin o tarjeta',
    ],
    ctaLabel: 'Solicitar Pack Creador',
    ctaHref: '/contacto?plan=pack-creador-kdp',
  },
  {
    name: 'Estudio Editorial Pro',
    price: 'S/ 59 / $19',
    period: 'Mensual • 400 créditos/mes',
    badge: 'Catálogo KDP & Agencias',
    highlight: false,
    description:
      'Para autores independientes y docentes que publican colecciones mensuales en español e inglés.',
    features: [
      '400 ilustraciones IA HD prioritarias cada mes',
      'Planificador editorial ilimitado con SEO para Amazon',
      'Exportación PDF sin publicidad en el estudio',
      'Asesoría técnica en configuración W-8BEN y categorías KDP',
      'Cancelación libre en cualquier momento',
    ],
    ctaLabel: 'Activar Estudio Pro',
    ctaHref: '/contacto?plan=estudio-pro',
  },
];

export default function PlanesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      <header className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white">
          Empieza gratis y escala cuando publiques en Amazon KDP
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-slate-300 leading-relaxed">
          La biblioteca pública de dibujos y el compilador de PDF 300 DPI son gratuitos. Los paquetes
          de créditos financian el cómputo de generación IA de alta demanda sin obligarte a pagar
          suscripciones innecesarias.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 ${
              plan.highlight
                ? 'bg-zinc-950 text-white border-2 border-yellow-300 shadow-xl'
                : 'sheet-card bg-white dark:bg-slate-900 text-zinc-900 dark:text-white'
            }`}
          >
            <div className="space-y-4">
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                  plan.highlight
                    ? 'bg-yellow-300 text-zinc-950'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                }`}
              >
                {plan.badge}
              </span>
              <div>
                <h2 className="font-display font-bold text-2xl">{plan.name}</h2>
                <p className="font-display font-bold text-3xl mt-2">{plan.price}</p>
                <p
                  className={`text-xs mt-0.5 ${
                    plan.highlight ? 'text-zinc-400' : 'text-zinc-500 dark:text-slate-400'
                  }`}
                >
                  {plan.period}
                </p>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  plan.highlight ? 'text-zinc-300' : 'text-zinc-600 dark:text-slate-300'
                }`}
              >
                {plan.description}
              </p>

              <ul className="space-y-2.5 text-xs pt-2">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.highlight ? 'text-yellow-300' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={plan.ctaHref}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-center inline-flex items-center justify-center gap-2 ${
                plan.highlight ? 'btn-studio-sun' : 'btn-studio-primary'
              }`}
            >
              {plan.highlight ? <Sparkles className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              <span>{plan.ctaLabel}</span>
            </Link>
          </div>
        ))}
      </div>

      <section className="sheet-card rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
              Pagos flexibles para Perú, Latinoamérica y mercado global
            </h2>
            <p className="text-xs text-zinc-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Aceptamos Yape, Plin y transferencia bancaria en Perú, además de tarjetas internacionales.
              Los paquetes de créditos no caducan y nunca imponemos renovaciones ocultas.
            </p>
          </div>
        </div>
        <Link
          href="/contacto"
          className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 shrink-0"
        >
          Consultar por contacto
        </Link>
      </section>

      <AdBanner />
    </div>
  );
}

