'use client'

import { FEATURES } from '@/lib/featureFlags'
import { useI18n } from '@/lib/i18n/context'
import { Platform } from './PlatformTabs'

interface HeroSectionProps {
  onSelectPlatform?: (platform: Platform) => void
  modules?: Record<string, boolean>
}

export default function HeroSection({ onSelectPlatform, modules }: HeroSectionProps) {
  const { t } = useI18n()

  const scrollToTools = () => {
    document.getElementById('herramientas')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const handlePlatformClick = (platform: Platform) => {
    if (onSelectPlatform) {
      onSelectPlatform(platform)
    }
    scrollToTools()
  }

  return (
    <section className="text-center mb-16">
      {/* Badge Superior */}
      <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800/60 shadow-xs backdrop-blur-sm">
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {t.hero.verifiedBadge}
      </div>

      {/* Título Principal */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
        {t.hero.titlePrefix} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t.hero.titleHighlight}</span>
      </h1>

      {/* Subtítulo */}
      <p className="text-base sm:text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
        {t.hero.subtitle}
      </p>

      {/* Iconos de plataformas */}
      <div className="flex justify-center items-center gap-6 sm:gap-8 mb-8 flex-wrap">
        <button
          type="button"
          onClick={() => handlePlatformClick('facebook')}
          className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-blue-500/20 group-hover:border-blue-500 transition-all">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Facebook</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlatformClick('tiktok')}
          className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-pink-500/20 group-hover:border-pink-500 transition-all">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-pink-500 transition-colors">TikTok</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlatformClick('instagram')}
          className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-purple-500/30 group-hover:scale-105 transition-all">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-purple-500 transition-colors">Instagram</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlatformClick('twitter')}
          className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-black border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-white/20 group-hover:border-slate-500 transition-all">
            <span className="font-black text-xl text-white">𝕏</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-white transition-colors">Twitter / 𝕏</span>
        </button>

        <button
          type="button"
          onClick={() => handlePlatformClick('threads')}
          className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-zinc-500/20 group-hover:border-zinc-500 transition-all">
            <span className="font-bold text-xl text-white">@</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-zinc-200 transition-colors">Threads</span>
        </button>

        {FEATURES.YOUTUBE_ENABLED && (
          <button
            type="button"
            onClick={() => handlePlatformClick('youtube')}
            className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-red-500/20 group-hover:border-red-500 transition-all">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">Multimedia</span>
          </button>
        )}
      </div>

      {/* Botones de acción principal */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          onClick={scrollToTools}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 text-base sm:text-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t.hero.ctaDownload}
        </button>

        <a
          href="/blog"
          className="flex items-center justify-center gap-2 bg-white/90 dark:bg-slate-900/90 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-800 px-8 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 font-semibold transition-all shadow-xs text-base backdrop-blur-sm"
        >
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {t.hero.ctaFeatures}
        </a>
      </div>

      {/* SECCIÓN INTERACTIVA DE APP ANDROID */}
      <div className="max-w-xl mx-auto bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-slate-900/90 dark:to-slate-800/90 p-6 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-sm mb-12 backdrop-blur-md">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          ¡Lleva FTY Downloader en tu Android!
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.ftydownloader.pro&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-transform shadow-md"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.156 2.156 0 0 1-.41-.708V2.522a2.156 2.156 0 0 1 .41-.708zm1.066-.341a2.13 2.13 0 0 1 1.763.15l13.064 7.625c.983.573.983 1.506 0 2.079L6.438 19.336a2.13 2.13 0 0 1-1.763.15L14.858 12 4.675 1.473zm-.11 20.31s-.001 0 0 0z" />
            </svg>
            <div className="text-left">
              <p className="text-[10px] uppercase leading-none opacity-80">Disponible en</p>
              <p className="text-lg font-bold leading-tight">Google Play</p>
            </div>
          </a>

          <a
            href="/FTYdownloaderPro.apk"
            download
            className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-md group"
          >
            <svg className="w-6 h-6 animate-bounce group-hover:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <div className="text-left">
              <p className="text-[10px] uppercase leading-none opacity-80">Descarga Directa</p>
              <p className="text-lg font-bold leading-tight">Archivo APK</p>
            </div>
          </a>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-4">
          Instala la App para descargas más rápidas con guardado directo en galería.
        </p>
      </div>

      {/* Características rápidas */}
      <div className="flex justify-center gap-6 mt-6 text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          100% {t.nav.freeBadge.replace('✅ ', '')}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {t.features.feature2Title}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {t.features.feature1Title}
        </span>
      </div>
    </section>
  )
}