'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Zap, Shield, Layers } from 'lucide-react'
import { FEATURES } from '@/lib/featureFlags'
import PlatformTabs, { Platform } from '@/components/PlatformTabs'
import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'
import TiktokDownloader from '@/components/platforms/TiktokDownloader'
import InstagramDownloader from '@/components/platforms/InstagramDownloader'
import ThreadsDownloader from '@/components/platforms/ThreadsDownloader'
import TwitterDownloader from '@/components/platforms/TwitterDownloader'

export default function ToolsPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook')

  const renderPlatform = () => {
    switch (activePlatform) {
      case 'facebook':
        return <FacebookDownloader />
      case 'youtube':
        return <YoutubeDownloader />
      case 'tiktok':
        return <TiktokDownloader />
      case 'instagram':
        return <InstagramDownloader />
      case 'threads':
        return <ThreadsDownloader />
      case 'twitter':
        return <TwitterDownloader />
      default:
        return <FacebookDownloader />
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      {/* Botón Volver */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Header de la página */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Herramientas Profesionales</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Descargador Multimedia Pro
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Descarga videos de Facebook, TikTok, YouTube, Instagram, Threads y Twitter en HD y extrae audio en MP3 de forma rápida, segura y 100% gratuita.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">100%</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Gratuito</div>
        </div>
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">7+</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Plataformas</div>
        </div>
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-1">HD / 4K</div>
          <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Fidelidad Máxima</div>
        </div>
      </div>

      {/* Descargador principal */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl p-5 sm:p-8 mb-12 border border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <PlatformTabs activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
          <div className="mt-8">
            {renderPlatform()}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <Link href="/tools/facebook" className="text-blue-600 dark:text-blue-400 hover:underline">Guía Facebook HD →</Link>
            <Link href="/tools/tiktok" className="text-pink-600 dark:text-pink-400 hover:underline">Guía TikTok Sin Logo →</Link>
            {FEATURES.YOUTUBE_ENABLED && <Link href="/tools/youtube" className="text-red-600 dark:text-red-400 hover:underline">Guía YouTube 4K →</Link>}
          </div>
        </div>
      </div>

      {/* Instrucciones de uso */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          ¿Cómo descargar videos en 3 pasos?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm shadow-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Copia el enlace</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Copia la URL del video desde Facebook, TikTok, YouTube o Instagram.
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm shadow-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Pega y busca</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Pega el enlace en la barra y pulsa Buscar Video para ver las calidades.
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm shadow-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">Descarga y disfruta</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Presiona Descargar. Tu video o audio se guardará directamente en tu equipo.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso legal */}
      <div className="max-w-4xl mx-auto p-5 sm:p-6 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl mb-8">
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 text-center leading-relaxed">
          <strong>Aviso Ético y Legal:</strong> FTYDownloader Pro es una plataforma independiente para la gestión y respaldo de contenido propio, dominio público o bajo excepciones de Uso Justo (Fair Use). Respeta los derechos de propiedad intelectual de los creadores originales.
        </p>
      </div>
    </div>
  )
}
