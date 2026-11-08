'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Crown } from 'lucide-react'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'
import { useI18n } from '@/lib/i18n/context'
import { useProPlan } from '@/hooks/useProPlan'

export default function MainHeader() {
  const { t } = useI18n()
  const { isPro } = useProPlan()
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-2.5 rounded-xl shadow-md shadow-blue-500/20 shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                Descargador <span className="text-blue-600 dark:text-blue-400">Pro</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 ${
                mounted && isPro
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 ring-1 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${mounted && isPro ? 'text-amber-300' : 'text-white'}`} />
              <span>{mounted && isPro ? 'Mi Membresía PRO' : t.nav.plans}</span>
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

            {/* Planes en móvil */}
            <Link
              href="/planes"
              className={`lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-xs ${
                mounted && isPro ? 'bg-emerald-600 ring-1 ring-emerald-400/50' : 'bg-amber-500'
              }`}
            >
              👑 {mounted && isPro ? 'Eres PRO' : 'PRO'}
            </Link>

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

