'use client'

import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import PlatformTabs from '@/components/PlatformTabs'
import FacebookDownloader from '@/components/platforms/FacebookDownloader'
import YoutubeDownloader from '@/components/platforms/YoutubeDownloader'
import TiktokDownloader from '@/components/platforms/TiktokDownloader'
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

export default function Home() {
  const { isNative } = usePlatform()
  // Default to Facebook if YouTube is disabled (Play Store build)
  const defaultPlatform: 'facebook' | 'youtube' | 'tiktok' = FEATURES.YOUTUBE_ENABLED ? 'facebook' : 'facebook'
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'youtube' | 'tiktok'>(defaultPlatform)
  const { showInterstitial } = useAdMobInterstitial()
  const hasShownInitialAd = useRef(false) // Control para evitar bucles de anuncios

  // 📺 ANUNCIO AL INICIAR APP (App Open Ad simulado con Interstitial)
  // 🔐 SOLICITAR PERMISOS AL INICIAR (Request Permissions on init)
  useEffect(() => {
    if (isNative && !hasShownInitialAd.current) {
      // 1. Marcar inicio
      hasShownInitialAd.current = true

      // 2. Solicitar permisos CRÍTICOS (Notificaciones + Almacenamiento)
      const requestPermissions = async () => {
        try {
          console.log('🔐 Solicitando permisos de notificación...')
          await LocalNotifications.requestPermissions();

          console.log('🔐 Solicitando permisos de almacenamiento...')
          // Solicitar Filesystem permissions explícitamente
          const fsStatus = await Filesystem.requestPermissions();
          console.log('📂 Estado permisos Filesystem:', fsStatus);

        } catch (e) {
          console.error('Error solicitando permisos al inicio:', e)
        }
      }

      // Ejecutar solicitud de permisos INMEDIATAMENTE
      requestPermissions();

      // 3. Mostrar anuncio después de unos segundos (para no interrumpir permisos)
      const timer = setTimeout(() => {
        showInterstitial()
      }, 4000) // Un poco más de delay para dar tiempo al usuario a aceptar permisos

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isNative, showInterstitial])

  // 🔄 CAMBIAR PLATAFORMA + ANUNCIO
  const handlePlatformChange = async (platform: 'facebook' | 'youtube' | 'tiktok') => {
    // 1. Mostrar anuncio
    if (isNative) {
      await showInterstitial()
    }
    // 2. Cambiar pestaña
    setActivePlatform(platform)
  }

  const renderPlatform = () => {
    switch (activePlatform) {
      case 'facebook':
        return <FacebookDownloader />
      case 'youtube':
        return <YoutubeDownloader />
      case 'tiktok':
        return <TiktokDownloader />
      default:
        return <FacebookDownloader />
    }
  }

  // 📱 MODO APP NATIVA
  if (isNative) {
    return (


      <div className="min-h-screen bg-gray-50 pb-safe pt-44"> {/* pt-44 para dar espacio SEGURO a Header + TopNav */}
        <AppHeader />
        <TopNav activePlatform={activePlatform} onPlatformChange={handlePlatformChange} />

        {/* Contenido Centrado Limpio */}
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            {/* Título simple dinámico */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center capitalize">
              Descargar de {activePlatform}
            </h2>

            {/* Renderizador de componente */}
            {renderPlatform()}
          </div>

          {/* Espacio para publicidad nativa (gestionada por AdMob overlays, pero dejamos espacio visual si es necesario) */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              v1.0.0
            </p>
          </div>
        </main>

        {/* <BottomNav activePlatform={activePlatform} onPlatformChange={setActivePlatform} /> */}
        <AdMobBanner />
      </div>
    )
  }

  // 🌐 MODO WEB (Original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <HeroSection />

          {/* Banner Top (Top of Page) */}
          <div className="max-w-4xl mx-auto mb-8">
            <EzoicAd placeholderId={101} />
          </div>

          {/* 2. Blog Preview */}
          <section className="max-w-4xl mx-auto mb-16">
            <BlogPreview />
          </section>

          {/* Video Rewards - DESPUÉS DEL BLOG */}
          <div className="max-w-4xl mx-auto mb-16">
            <VideoRewardsAds position="left" />
          </div>

          {/* Banner Middle (Removing 103 to use as Bottom) */}
          <div className="max-w-4xl mx-auto mb-16">
            {/* Espacio para contenido - removido placeholder adicional */}
          </div>

          {/* 3. Herramientas - CON ID PARA SCROLL */}
          <section id="herramientas" className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 truncate">
                  FTY Downloader - Facebook & TikTok
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  La herramienta profesional para descargar videos de Facebook en HD y TikTok sin marca de agua.
                </p>
              </div>

              {/* Platform Tabs */}
              <div className="max-w-4xl mx-auto mb-8">
                <PlatformTabs activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
              </div>

              {/* Platform Content + Under Title Ad */}
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <EzoicAd placeholderId={102} />
                </div>
                {renderPlatform()}
              </div>

              {/* Video Rewards - DENTRO DE HERRAMIENTAS */}
              <div className="max-w-4xl mx-auto mt-8">
                <VideoRewardsAds position="left" />
              </div>

              {/* Aviso Legal */}
              <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Aviso Legal:</strong> Para gestión de contenido propio. Respeta los derechos de autor.
                </p>
              </div>
            </div>
          </section>

          {/* Banner Middle 2 - Removido */}
          <div className="max-w-4xl mx-auto mb-16">
          </div>

          {/* 5. SEO Content Section (NUEVO PARA ADSENSE) */}
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