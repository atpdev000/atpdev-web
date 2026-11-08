'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'
import { useI18n } from '@/lib/i18n/context'

export default function MainHeader() {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  const [siteTitle, setSiteTitle] = useState('Descargador Pro')
  const [apkConfig, setApkConfig] = useState<{
    enabled?: boolean
    version?: string
    file_url?: string
  }>({
    enabled: true,
    version: 'v1.2.0',
    file_url: '/downloads/DescargadorPro.apk'
  })

  useEffect(() => {
    setMounted(true)
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.branding?.site_title) {
          setSiteTitle(data.branding.site_title)
        }
        if (data?.apk) {
          setApkConfig(data.apk)
        }
      })
      .catch(() => { })

    try {
      const channel = new BroadcastChannel('descargador_theme_channel')
      channel.onmessage = (event) => {
        if (event.data?.type === 'UPDATE_DESCARGADOR_CONFIG' && event.data.payload) {
          if (event.data.payload.branding?.site_title) {
            setSiteTitle(event.data.payload.branding.site_title)
          }
          if (event.data.payload.apk) {
            setApkConfig(event.data.payload.apk)
          }
        }
      }
      return () => channel.close()
    } catch (e) { }
  }, [])

  return (
    <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50 transition-colors duration-200" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo y Nombre de Marca */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {siteTitle}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                {t.nav.subtitle}
              </p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center space-x-5 text-xs sm:text-sm font-semibold" suppressHydrationWarning>
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/tools" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t.nav.tools}
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t.nav.blog}
            </Link>
            <Link href="/faq" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t.nav.faq}
            </Link>
            <Link
              href="/planes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.plans}</span>
            </Link>

            {mounted && apkConfig?.enabled && (
              <a
                href={apkConfig.file_url || '/downloads/DescargadorPro.apk'}
                download
                suppressHydrationWarning
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
                title="Descargar APK"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1084-.188.0438-.429-.1442-.5374-.188-.1085-.429-.0439-.5374.1442l-2.0227 3.5033c-1.4827-.6786-3.1384-1.0583-4.9232-1.0583-1.7848 0-3.4405.3797-4.9232 1.0583L5.3032 5.4713c-.1084-.188-.3494-.2527-.5374-.1442-.188.1084-.2526.3494-.1442.5374l1.996 3.4572C3.0645 11.2384 1 14.8329 1 19h22c0-4.1671-2.0645-7.7616-5.1185-9.6786" />
                </svg>
                <span>APK {apkConfig.version || 'v1.2.0'}</span>
              </a>
            )}
          </nav>

          {/* Acciones: Idioma, Tema y Botón Inicio / Contacto */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageSelector />
            <ThemeToggle />

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.downloader.downloadBtn}</span>
            </Link>

            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

