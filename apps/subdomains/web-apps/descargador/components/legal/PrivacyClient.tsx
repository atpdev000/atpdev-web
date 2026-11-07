'use client'

import Link from 'next/link'
import { Shield, Lock, FileText, CheckCircle2, ArrowLeft, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { privacyTranslations } from '@/lib/content/legal-translations'

export default function PrivacyClient({ siteTitle, contactEmail }: { siteTitle: string; contactEmail: string }) {
  const { locale } = useI18n()
  const t = privacyTranslations[locale] || privacyTranslations.es

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
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
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
        {/* Tarjeta de Resumen Clave */}
        <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 shadow-xs">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed space-y-2">
              <p className="font-bold text-sm sm:text-base">{t.guaranteeTitle}</p>
              <p>{t.guaranteeDesc.replace('{siteTitle}', siteTitle)}</p>
            </div>
          </div>
        </div>

        {/* Sección 1: Información que procesamos */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.sec1Title}</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.sec1Sub1Title}</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t.noAccountsTitle}</strong> {t.noAccountsDesc}</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t.noStorageTitle}</strong> {t.noStorageDesc}</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t.noSellingTitle}</strong> {t.noSellingDesc}</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>{t.localHistoryTitle}</strong> {t.localHistoryDesc}</span>
              </li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">{t.sec1Sub2Title}</h3>
            <p>{t.sec1Sub2Desc}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>{t.urlPublicTitle}</strong> {t.urlPublicDesc}</li>
              <li><strong>{t.userAgentTitle}</strong> {t.userAgentDesc}</li>
              <li><strong>{t.ipAnonTitle}</strong> {t.ipAnonDesc}</li>
            </ul>
          </div>
        </div>

        {/* Sección 2: Google AdSense y Publicidad de Terceros */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec2Title}
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{t.sec2Desc}</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{t.dartCookieTitle}</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>{t.dartCookieItem1}</li>
                <li>{t.dartCookieItem2}</li>
                <li>
                  {t.dartCookieItem3}{' '}
                  <a 
                    href="https://adssettings.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    {t.dartCookieLink1}
                  </a>.
                </li>
                <li>
                  {t.dartCookieItem4}{' '}
                  <a 
                    href="https://www.aboutads.info/choices/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    {t.dartCookieLink2}
                  </a>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección 3: Tabla de Cookies y Almacenamiento Local */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec3Title}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                  <th className="p-3 font-bold text-slate-900 dark:text-white">{t.thCategory}</th>
                  <th className="p-3 font-bold text-slate-900 dark:text-white">{t.thPurpose}</th>
                  <th className="p-3 font-bold text-slate-900 dark:text-white">{t.thTypeDuration}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{t.row1Cat}</td>
                  <td className="p-3">{t.row1Pur}</td>
                  <td className="p-3">{t.row1Dur}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{t.row2Cat}</td>
                  <td className="p-3">{t.row2Pur}</td>
                  <td className="p-3">{t.row2Dur}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{t.row3Cat}</td>
                  <td className="p-3">{t.row3Pur}</td>
                  <td className="p-3">{t.row3Dur}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{t.row4Cat}</td>
                  <td className="p-3">{t.row4Pur}</td>
                  <td className="p-3">{t.row4Dur}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección 4: Derechos RGPD y CCPA */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.sec4Title}
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{t.sec4Desc}</p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t.rightAccessTitle}</h4>
                <p className="text-xs">{t.rightAccessDesc}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t.rightDeleteTitle}</h4>
                <p className="text-xs">{t.rightDeleteDesc}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t.rightObjectTitle}</h4>
                <p className="text-xs">{t.rightObjectDesc}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{t.rightPurgeTitle}</h4>
                <p className="text-xs">{t.rightPurgeDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 5: Contacto Oficial */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.sec5Title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.sec5Desc}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <a 
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{contactEmail}</span>
            </a>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{t.contactFormButton}</span>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {t.responseTime}
          </p>
        </div>
      </div>
    </div>
  )
}

