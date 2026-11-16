"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Crown,
  Star,
  Film,
  Flame,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Award,
  Layers,
  HeartHandshake,
  TrendingUp,
  Gift
} from 'lucide-react';
import { PRICING_PLANS } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { PricingSection } from '@/components/PricingSection';

export default function PlanesPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Qué pasa si mi publicación supera el límite de comentarios de mi plan?',
      a: 'La plataforma te avisará con anticipación antes de procesar el sorteo. Podrás hacer un upgrade instantáneo con solo la diferencia o comprar un pase de sorteo individual para esa publicación específica sin perder tus comentarios ya extraídos.'
    },
    {
      q: '¿Las herramientas interactivas (Ruleta, Dados, Moneda, Lista) son realmente 100% gratuitas?',
      a: '¡Sí, totalmente! Todas las herramientas standalone son libres e ilimitadas para siempre. Puedes usarlas en tus directos de YouTube, Twitch o TikTok sin necesidad de registro ni tarjeta de crédito.'
    },
    {
      q: '¿Cómo garantiza Sorteos Pro que el sorteo sea 100% transparente y no manipulado?',
      a: 'Utilizamos Web Crypto CSPRNG (Generador de Números Pseudoaleatorios Criptográficamente Seguro) y barajado Fisher-Yates auditado. Cada sorteo finalizado genera un hash SHA-256 inmutable y una página pública verificable para que tus seguidores comprueben la autenticidad al instante.'
    },
    {
      q: '¿Puedo cancelar o cambiar mi plan cuando quiera?',
      a: 'Sí, sin ningún compromiso ni preguntas. Puedes pausar, cambiar de plan o cancelar tu suscripción con un solo clic desde tu panel de usuario en cualquier momento.'
    },
    {
      q: '¿Cumple Sorteos Pro con las políticas de promociones de Instagram, TikTok y YouTube?',
      a: 'Sí, operamos en estricto cumplimiento con las normativas oficiales de promociones de Meta, las Políticas de la Comunidad de YouTube y las pautas de TikTok, garantizando la seguridad de tu cuenta sin solicitar contraseñas privadas.'
    },
    {
      q: '¿Cómo funciona la descarga de Video Story animada para redes sociales?',
      a: 'Los planes Pro y superiores incluyen el generador de video a 30 FPS optimizado para formato vertical 9:16 (Stories y Reels). Renderiza automáticamente el conteo regresivo, el nombre del ganador y el trofeo con efectos visuales para compartir en segundos.'
    }
  ];

  // Matriz comparativa estilo Duolingo Super
  const comparisonFeatures = [
    {
      name: 'Comentarios procesados por sorteo',
      desc: 'Capacidad de extracción de comentarios en posts o reels',
      free: 'Hasta 100',
      pro: 'Hasta 2.500',
      business: 'Hasta 15.000',
      enterprise: '100.000+'
    },
    {
      name: 'Ganadores y Suplentes simultáneos',
      desc: 'Premios múltiples y suplentes automáticos en un solo sorteo',
      free: '1 Ganador + 1 Suplente',
      pro: 'Hasta 10 + 10',
      business: 'Hasta 50 + 20',
      enterprise: 'Ilimitados'
    },
    {
      name: 'Filtros Inteligentes Anti-Trampas',
      desc: 'Excluir duplicados, menciones mínimas y hashtags requeridos',
      free: 'Filtro básico de duplicados',
      pro: '✅ Todos los filtros avanzados',
      business: '✅ Todos + Lista negra personalizada',
      enterprise: '✅ Reglas a medida y validación IA'
    },
    {
      name: '🎬 Descarga de Video Story animado (9:16)',
      desc: 'Video a 30 FPS con conteo y trofeo listo para Instagram Stories y TikTok',
      free: false,
      pro: true,
      business: true,
      enterprise: true
    },
    {
      name: 'Certificado Criptográfico Oficial SHA-256',
      desc: 'Prueba matemática inmutable con landing pública para seguidores',
      free: 'Con sello estándar',
      pro: '✅ Sin marca de agua en HD',
      business: '✅ Con tu propio Logo y Marca',
      enterprise: '✅ Dominio y Marca Blanca Total'
    },
    {
      name: 'Sorteos Multi-Red (Combinar plataformas)',
      desc: 'Une comentarios de Instagram + TikTok + YouTube + Facebook en 1 lista',
      free: false,
      pro: 'Hasta 2 redes',
      business: '✅ Redes ilimitadas simultáneas',
      enterprise: '✅ Redes ilimitadas + API privada'
    },
    {
      name: 'Exportación de datos de participantes (CSV/Excel)',
      desc: 'Descarga de autores, comentarios y timestamps para auditorías',
      free: false,
      pro: true,
      business: true,
      enterprise: true
    },
    {
      name: 'Soporte al cliente',
      desc: 'Atención personalizada para tus campañas',
      free: 'Comunidad',
      pro: 'Prioritario por Email',
      business: '⚡ Chat WhatsApp VIP',
      enterprise: '👔 Account Manager Dedicado'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* ─── 1. HERO DUOLINGO STYLE: SUPER PRO BADGE & CHUNKY BILLING SWITCH ─── */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border-2 border-pink-500/30 text-pink-600 dark:text-pink-400 font-extrabold text-xs uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-[#d91a7a] animate-bounce" />
          <span>Sorteos Pro • Planes & Membresías</span>
          <Crown className="w-4 h-4 text-amber-500" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight">
          Sorteos transparentes con <span className="bg-gradient-to-r from-[#d91a7a] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">Super Poderes</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
          Cero trampas, certificados matemáticos inmutables y videos animados para Stories. Empieza 100% gratis y desbloquea funciones pro cuando tu audiencia explote.
        </p>

      </div>

      {/* ─── 2. TACTILE 3D CARDS GRID (Unified Component) ─────────── */}
      <PricingSection showTitle={false} />

      {/* ─── 3. DUOLINGO "GARANTÍA DE CONFIANZA EN 3 PASOS" ─────────────────── */}
      <div className="rounded-3xl p-8 sm:p-12 border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] shadow-sm space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-[#d91a7a] dark:text-pink-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#d91a7a]" />
            <span>Transparencia Criptográfica Garantizada</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            ¿Por qué los mejores creadores eligen Sorteos Pro?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Diseñado para máxima conversión y confianza: claridad absoluta, cero letra pequeña y valor instantáneo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-[#d91a7a] flex items-center justify-center font-black text-xl shadow-xs">
              🛡️
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white font-display">
              1. Cero Manipulación
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Algoritmo Fisher-Yates respaldado por CSPRNG criptográfico. Cada sorteo se sella con un hash SHA-256 público imposible de alterar.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl shadow-xs">
              ⚡
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white font-display">
              2. Sincronización Ultrarrápida
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Extracción directa de comentarios sin bloqueos para Instagram, TikTok, YouTube, Facebook y X, incluso en reels y directos virales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-[#d91a7a] flex items-center justify-center font-black text-xl shadow-xs">
              🎬
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white font-display">
              3. Videos Stories a 30 FPS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Convierte el resultado en un video vertical animado con efectos de confetti y trofeo dorado, listo para publicar en Stories en 5 segundos.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. MATRIZ COMPARATIVA ESTILO DUOLINGO SUPER (Interactive Table) ─ */}
      <div className="rounded-3xl p-6 sm:p-10 border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] shadow-sm space-y-8 overflow-hidden">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-black uppercase text-[#d91a7a] tracking-wider block">
            Tabla Comparativa Detallada
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Compara todas las características frente a frente
          </h2>
        </div>

        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                <th className="py-4 px-4 text-xs font-black uppercase text-slate-400 dark:text-slate-500">
                  Característica
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase text-slate-700 dark:text-slate-300 w-28">
                  Free
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase text-[#d91a7a] bg-[#d91a7a]/10 rounded-t-2xl w-36">
                  ⚡ Pro Creador
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase text-purple-600 dark:text-purple-400 w-32">
                  Business
                </th>
                <th className="py-4 px-4 text-center text-xs font-black uppercase text-slate-700 dark:text-slate-300 w-32">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="font-bold">{row.name}</div>
                    <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{row.desc}</div>
                  </td>
                  
                  {/* Free */}
                  <td className="py-4 px-4 text-center font-medium text-slate-600 dark:text-slate-400">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-slate-700 dark:text-slate-300 mx-auto stroke-[3]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                      )
                    ) : (
                      row.free
                    )}
                  </td>

                  {/* Pro Creador (Super Column) */}
                  <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white bg-[#d91a7a]/5">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-[#d91a7a] mx-auto stroke-[3]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                      )
                    ) : (
                      row.pro
                    )}
                  </td>

                  {/* Business */}
                  <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {typeof row.business === 'boolean' ? (
                      row.business ? (
                        <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto stroke-[3]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                      )
                    ) : (
                      row.business
                    )}
                  </td>

                  {/* Enterprise */}
                  <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="w-4 h-4 text-slate-800 dark:text-slate-200 mx-auto stroke-[3]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                      )
                    ) : (
                      row.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 5. FAQ ACORDIONES INTERACTIVOS TÁCTILES ────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d91a7a] font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{t('pricing_faq_title')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Todo lo que necesitas saber antes de lanzar tu primer sorteo
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                  isOpen 
                    ? 'border-[#d91a7a] dark:border-[#ec4899] bg-white dark:bg-[#0f172a] shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span className="text-[#d91a7a] font-black text-sm">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </h3>
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-pink-50 dark:bg-pink-950/40 text-[#d91a7a]' : 'text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 6. FINAL BOTTOM CTA BANNER (High Conversion Brand Push) ─────── */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white border-2 border-b-6 border-[#d91a7a] shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#d91a7a]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#7c3aed]/25 blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold text-xs border border-pink-500/30">
            <Gift className="w-4 h-4 text-pink-300" />
            <span>Comienza gratis hoy mismo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            ¿Listo para tu próximo sorteo viral?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            Únete a miles de influencers, marcas y agencias que eligen la transparencia oficial. Configura tu sorteo en menos de 2 minutos.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            href="/sorteos/nuevo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-black font-display text-sm tracking-wide uppercase transition-all duration-150 border-b-4 border-[#9f1239] active:border-b-0 active:translate-y-1 shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Crear Sorteo Gratis Ahora</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <Link
            href="/sorteos/nuevo?plan=pro"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold font-display text-sm tracking-wide transition-all border border-white/20 flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Desbloquear Plan Pro Creador</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
