'use client'

import Link from 'next/link'
import { Copyright, ArrowLeft, Shield, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { copyrightTranslations } from '@/lib/content/legal-translations'

export default function CopyrightClient({ siteTitle, contactEmail }: { siteTitle: string; contactEmail: string }) {
  const { locale } = useI18n()
  const t = copyrightTranslations[locale] || copyrightTranslations.es

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
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Copyright className="w-5 h-5" />
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
        {/* Resumen */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec1Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.sec1Desc.replace('FTY Downloader Pro', siteTitle)}
          </p>
        </div>

        {/* Uso Justo / Fair Use */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec2Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.sec2Desc}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li>{t.fairUseItem1}</li>
            <li>{t.fairUseItem2}</li>
            <li>{t.fairUseItem3}</li>
            <li>{t.fairUseItem4}</li>
          </ul>
        </div>

        {/* Procedimiento DMCA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-950 dark:text-purple-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{t.sec3Title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-900/90 dark:text-purple-300/90 leading-relaxed">
            {t.sec3Desc}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-purple-900/80 dark:text-purple-300/80">
            <li>{t.dmcaItem1}</li>
            <li>{t.dmcaItem2}</li>
            <li>{t.dmcaItem3}</li>
            <li>{t.dmcaItem4}</li>
            <li>{t.dmcaItem5}</li>
          </ul>
          <div className="pt-2">
            <a 
              href={`mailto:${contactEmail}?subject=Notificacion%20DMCA`} 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>{t.dmcaButtonText} ({contactEmail})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

