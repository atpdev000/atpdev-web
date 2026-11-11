'use client'

import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import PlatformTabs, { Platform } from '@/components/PlatformTabs'
import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'
import TiktokDownloader from '@/components/platforms/TiktokDownloader'
import InstagramDownloader from '@/components/platforms/InstagramDownloader'
import TwitterDownloader from '@/components/platforms/TwitterDownloader'
import ThreadsDownloader from '@/components/platforms/ThreadsDownloader'
import WhatsappStatusDownloader from '@/components/platforms/WhatsappStatusDownloader'
import FeaturesSection from '@/components/FeaturesSection'
import SEOContentSection from '@/components/SEOContentSection'
import BlogPreview from '@/components/blog/BlogPreview'
import HeroSection from '@/components/HeroSection'
import ExpertiseSection from '@/components/ExpertiseSection'
import AdMobBanner from '@/components/AdMobBanner'
import AdBannerSlot from '@/components/AdBannerSlot'
import AdLateralRail from '@/components/AdLateralRail'
import HowItWorksSteps from '@/components/HowItWorksSteps'
import { usePlatform } from '@/hooks/usePlatform'
import TopNav from '@/components/AppLayout/TopNav'
import AppHeader from '@/components/AppLayout/AppHeader'
import { useAdMobInterstitial } from '@/hooks/useAdMobInterstitial'
import { useEffect, useRef } from 'react'
import { FEATURES } from '@/lib/featureFlags'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Filesystem } from '@capacitor/filesystem'
import { useI18n } from '@/lib/i18n/context'

import SmartClipboardDetector from '@/components/SmartClipboardDetector'
import { DetectedUrlInfo } from '@/lib/clipboardDetector'
import AnnouncementBar from '@/components/Layout/AnnouncementBar'

export default function Home() {
  const { isNative } = usePlatform()
  const { t } = useI18n()
  const defaultPlatform: Platform = 'facebook'
  const [activePlatform, setActivePlatform] = useState<Platform>(defaultPlatform)
  const [autoSearchPayload, setAutoSearchPayload] = useState<{
    platform: Platform
    url: string
    autoSearch: boolean
  } | null>(null)
  const { showInterstitial } = useAdMobInterstitial()
  const hasShownInitialAd = useRef(false)

  // 🧩 Módulos y Branding controlados desde CMS Admin
  const [modules, setModules] = useState<Record<string, boolean>>({
    youtube_enabled: true,
    tiktok_enabled: true,
    facebook_enabled: true,
    instagram_enabled: true,
    twitter_enabled: true,
    threads_enabled: true,
    whatsapp_enabled: true,
    audio_extractor_enabled: true,
    ffmpeg_client_enabled: true,
    adsense_enabled: true,
    admob_enabled: true,
    blog_enabled: true
  })
  const [branding, setBranding] = useState<{
    site_title?: string
    hero_badge?: string
    hero_title_prefix?: string
    hero_title_highlight?: string
    hero_description?: string
    announcement_text?: string
    announcement_enabled?: boolean
  }>({
    site_title: 'Descargador Pro',
    hero_badge: 'Motor Ultra Rápido • Sin Marcas de Agua • 1080p/4K',
    hero_title_prefix: 'Descarga videos y audios gratis con',
    hero_title_highlight: 'Descargador Pro',
    hero_description: 'La herramienta más potente para descargar contenido multimedia de YouTube, TikTok, Facebook e Instagram en MP4 o MP3 al instante.',
    announcement_enabled: false
  })
  const [apkConfig, setApkConfig] = useState<{
    enabled?: boolean
    version?: string
    file_url?: string
    file_size?: string
    release_notes?: string
    playstore_url?: string
    direct_download_enabled?: boolean
  }>({
    enabled: true,
    version: 'v1.2.0',
    file_url: '/downloads/DescargadorPro.apk',
    file_size: '10.8 MB',
    release_notes: 'Descargas HD/4K sin marcas de agua, reproductor integrado en app tipo WhatsApp y solución de guardado.'
  })

  // Cargar configuración inicial y escuchar cambios en vivo
  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.modules) {
          setModules(data.modules)
        }
        if (data?.branding) {
          setBranding(data.branding)
        }
        if (data?.apk) {
          setApkConfig(data.apk)
        }
      })
      .catch(() => {})

    try {
      const channel = new BroadcastChannel('descargador_theme_channel')
      channel.onmessage = (event) => {
        if (event.data?.modules) {
          setModules(event.data.modules)
        }
        if (event.data?.type === 'UPDATE_DESCARGADOR_CONFIG' && event.data.payload) {
          if (event.data.payload.modules) setModules(event.data.payload.modules)
          if (event.data.payload.branding) setBranding(event.data.payload.branding)
          if (event.data.payload.apk) setApkConfig(event.data.payload.apk)
        }
      }
      return () => channel.close()
    } catch (e) {}
  }, [])

  // 📺 ANUNCIO AL INICIAR APP (App Open Ad simulado con Interstitial)
  // 🔐 SOLICITAR PERMISOS AL INICIAR (Request Permissions on init)
  useEffect(() => {
    if (isNative && !hasShownInitialAd.current) {
      hasShownInitialAd.current = true

      const requestPermissions = async () => {
        try {
          console.log('🔐 Solicitando permisos de notificación...')
          await LocalNotifications.requestPermissions();

          console.log('🔐 Solicitando permisos de almacenamiento...')
          const fsStatus = await Filesystem.requestPermissions();
          console.log('📂 Estado permisos Filesystem:', fsStatus);
        } catch (e) {
          console.error('Error solicitando permisos al inicio:', e)
        }
      }

      requestPermissions();

      const timer = setTimeout(() => {
        showInterstitial()
      }, 4000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isNative, showInterstitial])

  // 🔄 CAMBIAR PLATAFORMA + ANUNCIO
  const handlePlatformChange = (platform: Platform) => {
    setActivePlatform(platform)
    if (isNative) {
      showInterstitial().catch(() => {})
    }
  }

  const handleClipboardDetected = (info: DetectedUrlInfo, autoSearch: boolean) => {
    setActivePlatform(info.platform)
    setAutoSearchPayload({
      platform: info.platform,
      url: info.url,
      autoSearch: autoSearch
    })
  }

  const renderPlatform = () => {
    const isMatchingAutoSearch = autoSearchPayload?.platform === activePlatform
    const initialUrl = isMatchingAutoSearch ? autoSearchPayload.url : undefined
    const autoSearch = isMatchingAutoSearch ? autoSearchPayload.autoSearch : false

    switch (activePlatform) {
      case 'facebook':
        return <FacebookDownloader key={`fb-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'tiktok':
        return <TiktokDownloader key={`tt-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'instagram':
        return <InstagramDownloader key={`ig-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'twitter':
        return <TwitterDownloader key={`tw-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'threads':
        return <ThreadsDownloader key={`th-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'youtube':
        return <YoutubeDownloader key={`yt-${initialUrl || 'def'}`} initialUrl={initialUrl} autoSearch={autoSearch} />
      case 'whatsapp':
        return <WhatsappStatusDownloader key="wa-status" />
      default:
        return <FacebookDownloader key="fb-def" />
    }
  }

  // 📱 MODO APP NATIVA
  if (isNative) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-safe transition-colors">
        <SmartClipboardDetector onDetected={handleClipboardDetected} />
        
        {/* 📱 HEADER NATIVO LIMPIO Y STICKY */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-slate-800 transition-colors">
          <AppHeader />
        </header>

        {/* Contenido Centrado Limpio */}
        <main className="container mx-auto px-3.5 sm:px-4 py-4 max-w-xl">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-slate-800 transition-colors">
            {/* Selector de Plataformas Completo (Limpio y directo) */}
            <div className="mb-5">
              <PlatformTabs activePlatform={activePlatform} onPlatformChange={handlePlatformChange} modules={modules} />
            </div>

            {renderPlatform()}
          </div>

          <div className="mt-6 text-center pb-6">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Descargador Pro • v1.0.0
            </p>
          </div>
        </main>

        <AdMobBanner />
      </div>
    )
  }

  // 🌐 MODO WEB
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      <AnnouncementBar initialText={branding.announcement_text} initialEnabled={branding.announcement_enabled} />
      <SmartClipboardDetector onDetected={handleClipboardDetected} />
      <Header />

      {/* Rieles Panorámicos en Pantallas Anchas (Widescreen >= 1440px) */}
      <AdLateralRail />

      {/* CONTENIDO PRINCIPAL CENTRADO Y RESPONSIVE */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* 1. Hero Section */}
        <HeroSection onSelectPlatform={setActivePlatform} modules={modules} branding={branding} />

        {/* 📱 Promoción Oficial App Android APK */}
        {apkConfig?.enabled && (
          <div className="max-w-4xl mx-auto mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-blue-950/40 border border-emerald-500/30 shadow-xl shadow-emerald-950/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.1084-.188.0438-.429-.1442-.5374-.188-.1085-.429-.0439-.5374.1442l-2.0227 3.5033c-1.4827-.6786-3.1384-1.0583-4.9232-1.0583-1.7848 0-3.4405.3797-4.9232 1.0583L5.3032 5.4713c-.1084-.188-.3494-.2527-.5374-.1442-.188.1084-.2526.3494-.1442.5374l1.996 3.4572C3.0645 11.2384 1 14.8329 1 19h22c0-4.1671-2.0645-7.7616-5.1185-9.6786"/>
                  </svg>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      App Oficial Android
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {apkConfig.version || 'v1.2.0'} • {apkConfig.file_size || '10.8 MB'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Descarga {branding.site_title || 'Descargador Pro'} para Android
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {apkConfig.release_notes || 'Descargas ultra rápidas en segundo plano, soporte para estados de WhatsApp y reproductor nativo integrado.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href={apkConfig.file_url || '/downloads/DescargadorPro.apk'}
                  download
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Descargar APK</span>
                </a>
                {apkConfig.playstore_url && (
                  <a
                    href={apkConfig.playstore_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 transition-all"
                  >
                    Google Play
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🏆 Leaderboard de Alto RPM (Above the Fold) */}
        {modules.adsense_enabled !== false && (
          <div className="max-w-4xl mx-auto mb-6">
            <AdBannerSlot type="leaderboard" />
          </div>
        )}

        {/* 2. Herramientas de Descarga */}
        <section id="herramientas" className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600">
                {t.toolsCard.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mt-2">
                {t.toolsCard.subtitle}
              </p>
            </div>

            {/* Platform Tabs */}
            <div className="max-w-4xl mx-auto mb-8">
              <PlatformTabs activePlatform={activePlatform} onPlatformChange={setActivePlatform} modules={modules} />
            </div>

            {/* Platform Content + In-Feed Ad */}
            <div className="max-w-4xl mx-auto">
              {renderPlatform()}

              {modules.adsense_enabled !== false && activePlatform !== 'youtube' && (
                <div className="my-6">
                  <AdBannerSlot type="in-feed" />
                </div>
              )}
            </div>

            {/* Aviso Legal */}
            <div className="max-w-4xl mx-auto mt-8 p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 text-center">
                <strong>{t.toolsCard.legalNoticeTitle}</strong> {t.toolsCard.legalNoticeText}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Guía Paso a Paso */}
        <HowItWorksSteps />

        {/* 4. Blog Preview */}
        {modules.blog_enabled !== false && (
          <section className="max-w-4xl mx-auto mb-16">
            <BlogPreview />
          </section>
        )}

        {/* 5. SEO Content Section */}
        <section className="mb-16">
          <SEOContentSection />
        </section>

        {/* 6. Expertise Section */}
        <section className="mb-16">
          <ExpertiseSection />
        </section>

        {/* 7. Features Section */}
        <FeaturesSection />

        {/* 8. Billboard Final (Pre-Footer) */}
        {modules.adsense_enabled !== false && (
          <div className="max-w-4xl mx-auto my-12">
            <AdBannerSlot type="billboard" />
          </div>
        )}
      </main>

      <Footer modules={modules} />
    </div>
  )
}
