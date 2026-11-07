'use client'

import Link from 'next/link'
import { Cookie, ArrowLeft, Settings, Check, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cookiesTranslations } from '@/lib/content/legal-translations'

export default function CookiesClient({ siteTitle, contactEmail }: { siteTitle: string; contactEmail: string }) {
  const { locale } = useI18n()
  const t = cookiesTranslations[locale] || cookiesTranslations.es

  return (
    <div className="container mx-auto px-4 max-w-4xl" suppressHydrationWarning>
      {/* Navegación y Encabezado */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToDownloader}</span>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Introducción */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.intro.replace('FTY Downloader Pro', siteTitle)}
          </p>
        </div>

        {/* Tipos de cookies */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec1Title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.cookieTechTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.cookieTechDesc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.cookiePrefTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.cookiePrefDesc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.cookieHistoryTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.cookieHistoryDesc}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.cookieAdsTitle}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.cookieAdsDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Cómo gestionar cookies */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.sec2Title}</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
            <p>{t.sec2Desc}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t.chromeDesc}</li>
              <li>{t.firefoxDesc}</li>
              <li>{t.safariDesc}</li>
              <li>{t.edgeDesc}</li>
            </ul>
          </div>
        </div>

        {/* Contacto */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.contactTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {t.contactDesc} <a href={`mailto:${contactEmail}`} className="text-blue-600 dark:text-blue-400 font-bold underline">{contactEmail}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
