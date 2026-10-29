'use client'

import { FEATURES } from '@/lib/featureFlags'

export default function HeroSection() {
  const scrollToTools = () => {
    document.getElementById('herramientas')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <section className="text-center mb-16">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100 shadow-sm">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Herramienta Verificada y Segura - 2026
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        FTYDownloader <span className="text-blue-600">Pro</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        Descarga videos de Facebook y TikTok en alta calidad.
        Rápido, seguro y completamente gratis.
      </p>

      {/* Iconos de plataformas */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Facebook</span>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">TikTok</span>
        </div>

        {FEATURES.YOUTUBE_ENABLED && (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Multimedia</span>
          </div>
        )}
      </div>

      {/* Botones de acción principal */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a
          href="/blog"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold transition-all transform hover:scale-105 shadow-xl text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Explorar Tutoriales y Guías Pro
        </a>
        <button
          onClick={scrollToTools}
          className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-xl hover:bg-gray-50 font-semibold transition-all shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Ir al Descargador Web
        </button>
      </div>

      {/* SECCIÓN INTERACTIVA DE APP */}
      <div className="max-w-xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 shadow-sm mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          ¡Lleva FTY Downloader en tu Android!
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Botón Play Store */}
          <a
            href="https://play.google.com/store/apps/details?id=com.ftydownloader.pro&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-transform"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.156 2.156 0 0 1-.41-.708V2.522a2.156 2.156 0 0 1 .41-.708zm1.066-.341a2.13 2.13 0 0 1 1.763.15l13.064 7.625c.983.573.983 1.506 0 2.079L6.438 19.336a2.13 2.13 0 0 1-1.763.15L14.858 12 4.675 1.473zm-.11 20.31s-.001 0 0 0z" />
            </svg>
            <div className="text-left">
              <p className="text-[10px] uppercase leading-none">Ejemplos:</p>
              <p className="text-xl font-bold leading-tight">Google Play</p>
            </div>
          </a>

          {/* Botón Descarga Directa APK */}
          <a
            href="/downloads/app-release.apk"
            download
            className="flex items-center gap-3 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 hover:scale-105 transition-all shadow-md group"
          >
            <svg className="w-7 h-7 animate-bounce group-hover:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <div className="text-left">
              <p className="text-[10px] uppercase leading-none">Descarga Directa</p>
              <p className="text-xl font-bold leading-tight">Archivo APK</p>
            </div>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Instala la App para descargas más rápidas y sin límites de plataforma.
        </p>
      </div>

      {/* Características rápidas */}
      <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          100% Gratis
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Alta Calidad
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Sin Registro
        </span>
      </div>
    </section>
  )
}