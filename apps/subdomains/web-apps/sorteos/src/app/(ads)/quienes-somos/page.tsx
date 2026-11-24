import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowLeft, Award, Sparkles, 
  Lock, CheckCircle2, Cpu, Users, Eye 
} from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/siteConfig';

export const metadata = {
  alternates: { canonical: '/quienes-somos' },
  title: `Quiénes Somos y Manifiesto de Transparencia | ${SITE_NAME}`,
  description: `Conoce Sorteos Pro, la plataforma SaaS desarrollada por ATP DEV para realizar sorteos limpios, seguros y verificables con criptografía CSPRNG.`,
};

export default function QuienesSomosPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>E-E-A-T & Manifiesto Tecnológico</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white">
          Quiénes Somos & Manifiesto de Transparencia
        </h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          <strong>Sorteos Pro</strong> nació con una misión innegociable: erradicar los sorteos amañados, la opacidad y las dudas en concursos de redes sociales mediante algoritmos abiertos y criptografía verificable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Motor CSPRNG</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Utilizamos el generador de números pseudoaleatorios criptográficamente seguro de Web Crypto API, el mismo estándar de entropía usado en seguridad bancaria.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Hash SHA-256 Inmutable</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Cada resultado genera un certificado digital público con huella digital SHA-256. Nadie, ni siquiera nuestro equipo, puede alterar a los ganadores después del tiro.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Auditoría 100% Pública</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Cualquier participante puede comprobar en tiempo real el certificado de su sorteo desde cualquier navegador del mundo sin costo.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-white/10 space-y-8 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            1. Nuestra Historia & Equipo Desarrollador
          </h2>
          <p>
            Sorteos Pro es un producto de software desarrollado por <strong>ATP DEV</strong>, un equipo de ingenieros de software enfocado en crear herramientas web de alto rendimiento, accesibles y orientadas a la comunidad en Perú e Iberoamérica.
          </p>
          <p>
            Observamos que los creadores de contenido, marcas y comunidades enfrentaban constantes sospechas de favoritismo o manipulaciones en sorteos. Decidimos construir una solución que sustituyera la fe ciega por <strong>certeza matemática</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            2. Nuestros Principios Fundamentales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                Cero Manipulación Manual
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                El sorteo se ejecuta en vivo y el resultado queda fijado de inmediato en el certificado.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                Acceso Gratuito & Democrático
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                La ruleta, dados, monedas, lista de nombres y números son libres y no requieren tarjeta de crédito.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                Privacidad Respetada
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Solo procesamos información pública y nunca almacenamos credenciales personales.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                Publicidad Responsable
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Financiamos la infraestructura gratuita con anuncios limpios de Google AdSense sin popups abusivos.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            3. Metodología de Verificación Estadística y Contacto Directo
          </h2>
          <p>
            Antes de liberar cada versión de nuestro motor de selección aleatoria, sometemos el algoritmo de permutación de Fisher-Yates y muestreo por rechazo (<em>Rejection Sampling</em>) sobre <code>window.crypto.getRandomValues()</code> a pruebas estadísticas de bondad de ajuste Chi-cuadrado de Pearson con más de un millón de iteraciones simuladas, garantizando que ningún participante sufra sesgo de módulo ni alteración de probabilidades por posición en la lista.
          </p>
          <p>
            Para consultas institucionales, auditorías de sorteos corporativos, colaboraciones o soporte sobre certificaciones digitales, puedes escribir directamente a la dirección de ingeniería de ATP DEV en Lima, Perú al correo <strong className="text-slate-900 dark:text-white font-mono">{CONTACT_EMAIL}</strong> o visitar nuestra sección de{' '}
            <Link href="/contacto" className="text-pink-600 dark:text-pink-400 font-bold hover:underline">
              Contacto y Soporte
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
