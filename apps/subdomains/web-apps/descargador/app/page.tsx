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
import EzoicAd from '@/components/EzoicAd'
import VideoRewardsAds from '@/components/Layout/VideoRewardsAds'
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

  // 🧩 Módulos controlados desde CMS Admin
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

  // Cargar módulos iniciales y escuchar cambios en vivo
  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data?.modules) {
          setModules(data.modules)
        }
      })
      .catch(() => {})

    try {
      const channel = new BroadcastChannel('atp_descargador_theme_channel')
      channel.onmessage = (event) => {
        if (event.data?.modules) {
          setModules(event.data.modules)
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
  const handlePlatformChange = async (platform: Platform) => {
    if (isNative) {
      await showInterstitial()
    }
    setActivePlatform(platform)
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-safe pt-32 transition-colors">
        <SmartClipboardDetector onDetected={handleClipboardDetected} />
        <AppHeader />
        <TopNav activePlatform={activePlatform} onPlatformChange={handlePlatformChange} modules={modules} />

        {/* Contenido Centrado Limpio */}
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-white mb-6 text-center capitalize">
              {t.toolsCard.title}
            </h2>

            {renderPlatform()}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              FTYDownloader Pro • v1.0.0
            </p>
          </div>
        </main>

        <AdMobBanner />
      </div>
    )
  }

  // 🌐 MODO WEB
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SmartClipboardDetector onDetected={handleClipboardDetected} />
      <Header />

      {/* SIDEBARS GLOBALES - FUERA DEL MAIN */}
      <div className="flex">
        {/* Sidebar Left */}
        <aside className="hidden lg:block w-64 fixed left-0 top-20 h-[calc(100vh-5rem)] z-30 p-4">
          <EzoicAd placeholderId={104} className="h-full" />
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 container mx-auto px-4 py-8 main-with-sidebars">
          {/* 1. Hero Section */}
          <HeroSection onSelectPlatform={setActivePlatform} modules={modules} />

          {/* Banner Top (Top of Page) */}
          {modules.adsense_enabled !== false && (
            <div className="max-w-4xl mx-auto mb-8">
              <EzoicAd placeholderId={101} />
            </div>
          )}

          {/* 2. Herramientas - CON ID PARA SCROLL */}
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

              {/* Platform Content + Under Title Ad */}
              <div className="max-w-4xl mx-auto">
                {modules.adsense_enabled !== false && (
                  <div className="mb-6">
                    <EzoicAd placeholderId={102} />
                  </div>
                )}
                {renderPlatform()}
              </div>

              {/* Video Rewards - DENTRO DE HERRAMIENTAS */}
              <div className="max-w-4xl mx-auto mt-8">
                <VideoRewardsAds position="left" />
              </div>

              {/* Aviso Legal */}
              <div className="max-w-4xl mx-auto mt-8 p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 text-center">
                  <strong>{t.toolsCard.legalNoticeTitle}</strong> {t.toolsCard.legalNoticeText}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Blog Preview (controlado por módulo) */}
          {modules.blog_enabled !== false && (
            <section className="max-w-4xl mx-auto mb-16">
              <BlogPreview />
            </section>
          )}

          {/* Video Rewards - DESPUÉS DEL BLOG */}
          <div className="max-w-4xl mx-auto mb-16">
            <VideoRewardsAds position="left" />
          </div>

          {/* 5. SEO Content Section */}
          <section className="mb-16">
            <SEOContentSection />
          </section>

          {/* 6. Expertise Section */}
          <section className="mb-16">
            <ExpertiseSection />
          </section>

          {/* 4. Features Section */}
          <FeaturesSection />

          {/* Video Rewards - ANTES DEL FINAL */}
          <div className="max-w-4xl mx-auto mt-8">
            <VideoRewardsAds position="right" />
          </div>

          {/* Banner Final (Bottom of Page) */}
          <div className="max-w-4xl mx-auto mt-16">
            <EzoicAd placeholderId={103} />
          </div>
        </main>

        {/* Sidebar Right */}
        <aside className="hidden lg:block w-64 fixed right-0 top-20 h-[calc(100vh-5rem)] z-30 p-4">
          <EzoicAd placeholderId={105} className="h-full" />
        </aside>
      </div>

      <Footer />
    </div>
  )
}