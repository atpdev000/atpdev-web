'use client'

import Link from 'next/link'
import { ArrowLeft, AlertCircle, Scale, ShieldAlert, CheckCircle, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { termsTranslations } from '@/lib/content/legal-translations'

export default function TermsClient({ siteTitle, contactEmail }: { siteTitle: string; contactEmail: string }) {
  const { locale } = useI18n()
  const t = termsTranslations[locale] || termsTranslations.es

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
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
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
        {/* Aviso Importante */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
              <p className="font-bold text-sm sm:text-base">{t.importantNoticeTitle}</p>
              <p>{t.importantNoticeDesc.replace('{siteTitle}', siteTitle)}</p>
            </div>
          </div>
        </div>

        {/* Sección 1: Naturaleza del servicio */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec1Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.sec1Desc.replace('{siteTitle}', siteTitle)}
          </p>
        </div>

        {/* Sección 2: Uso Aceptable */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec2Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {t.sec2Desc}
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{t.itemOwnContentTitle}</strong> {t.itemOwnContentDesc}</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{t.itemPrivateUseTitle}</strong> {t.itemPrivateUseDesc}</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{t.itemResearchTitle}</strong> {t.itemResearchDesc}</span>
            </li>
            <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>{t.itemPublicDomainTitle}</strong> {t.itemPublicDomainDesc}</span>
            </li>
          </ul>
        </div>

        {/* Sección 3: Usos Prohibidos */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>{t.sec3Title}</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{t.sec3Desc}</p>
            <ul className="list-disc pl-5 space-y-2 text-red-600 dark:text-red-400">
              <li>{t.prohibited1}</li>
              <li>{t.prohibited2}</li>
              <li>{t.prohibited3}</li>
              <li>{t.prohibited4}</li>
            </ul>
          </div>
        </div>

        {/* Sección 4: Exención de Responsabilidad */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec4Title}
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>{t.sec4Desc.replace('{siteTitle}', siteTitle)}</p>
          </div>
        </div>

        {/* Sección 5: Marcas Registradas */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec5Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.sec5Desc.replace('{siteTitle}', siteTitle)}
          </p>
        </div>

        {/* Sección 6: Contacto */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.sec6Title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {t.sec6Desc}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a 
              href={`mailto:${contactEmail}`} 
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{contactEmail}</span>
            </a>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
            >
              <span>{t.helpDeskButton}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

