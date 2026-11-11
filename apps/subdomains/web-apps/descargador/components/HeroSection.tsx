'use client'

import { FEATURES } from '@/lib/featureFlags'
import { useI18n } from '@/lib/i18n/context'
import { Platform } from './PlatformTabs'

interface HeroSectionProps {
  onSelectPlatform?: (platform: Platform) => void
  modules?: Record<string, boolean>
  branding?: {
    hero_badge?: string
    hero_title_prefix?: string
    hero_title_highlight?: string
    hero_description?: string
  }
}

export default function HeroSection({ onSelectPlatform, modules, branding }: HeroSectionProps) {
  const { t } = useI18n()

  const heroBadge = branding?.hero_badge || t.hero.verifiedBadge
  const heroPrefix = branding?.hero_title_prefix || t.hero.titlePrefix
  const heroHighlight = branding?.hero_title_highlight || t.hero.titleHighlight
  const heroDescription = branding?.hero_description || t.hero.subtitle

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
    <section className="text-center mb-12 sm:mb-16 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Badge Superior */}
      <div className="inline-flex items-center gap-2 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-blue-200/80 dark:border-blue-800/60 shadow-xs backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
        <span className="font-mono">{heroBadge}</span>
      </div>

      {/* Título Principal */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.15]">
        {heroPrefix} <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">{heroHighlight}</span>
      </h1>

      {/* Subtítulo */}
      <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed text-pretty">
        {heroDescription}
      </p>

      {/* Mini Feature Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          Sin registro
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          Sin marcas de agua
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          Calidad Original 1080p & MP3 320k
        </span>
      </div>

      {/* Iconos de plataformas con min-height responsive para eliminar CLS en móviles */}
      <div className="flex justify-center items-center gap-6 sm:gap-8 mb-8 flex-wrap min-h-[170px] sm:min-h-[76px]">
        {modules?.facebook_enabled !== false && (
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
        )}

        {modules?.tiktok_enabled !== false && (
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
        )}

        {modules?.instagram_enabled !== false && (
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
        )}

        {modules?.twitter_enabled !== false && (
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
        )}

        {modules?.threads_enabled !== false && (
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
        )}

        {modules?.whatsapp_enabled !== false && (
          <button
            type="button"
            onClick={() => handlePlatformClick('whatsapp')}
            className="text-center group cursor-pointer focus:outline-none transition-transform hover:scale-110"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs group-hover:shadow-emerald-500/20 group-hover:border-emerald-500 transition-all">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.211c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.001-.482-1.674-.693-2.736-2.42-2.82-2.53-.083-.11-.676-.901-.676-1.718 0-.818.431-1.218.583-1.385.153-.166.333-.208.444-.208.111 0 .222.002.319.006.102.005.239-.039.373.283.144.346.49 1.196.533 1.284.043.088.072.19.014.305-.058.115-.087.188-.173.289-.087.102-.183.228-.261.306-.087.087-.178.182-.077.355.101.173.45 1.742 1.488 2.666.804.717 1.48.939 1.69.1.043.21-.043.324-.117.41-.074.086-.168.201-.255.302-.087.1-.174.143-.246.216z"/>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">WhatsApp</span>
          </button>
        )}

        {(modules && typeof modules.youtube_enabled === 'boolean' ? modules.youtube_enabled : FEATURES.YOUTUBE_ENABLED) && (
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
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">{(t.platforms as any).youtube || 'YouTube'}</span>
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
        <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          ¡Lleva Descargador Pro en tu Android!
        </h2>

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
              <p className="text-[10px] uppercase leading-none font-medium text-slate-200">Disponible en</p>
              <p className="text-lg font-bold leading-tight">Google Play</p>
            </div>
          </a>

          <a
            href="/downloads/DescargadorPro.apk"
            download
            className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-md group"
          >
            <svg className="w-6 h-6 animate-bounce group-hover:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <div className="text-left">
              <p className="text-[10px] uppercase leading-none font-medium text-emerald-100">Descarga Directa</p>
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