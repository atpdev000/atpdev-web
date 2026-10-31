'use client'

import Link from 'next/link'
import { FEATURES } from '@/lib/featureFlags'
import { useI18n } from '@/lib/i18n/context'

export default function Footer() {
  const { t } = useI18n()

  const scrollToTools = () => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        document.getElementById('herramientas')?.scrollIntoView({
          behavior: 'smooth'
        })
      } else {
        window.location.href = '/#herramientas'
      }
    }
  }

  return (
    <footer className="bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-md text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800/80 py-12 mt-20 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-extrabold text-base mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FTYDownloader Pro
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t.footer.bio}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">
              {t.footer.linksTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/tools/facebook" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Video Facebook</Link></li>
              <li><Link href="/tools/tiktok" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Video TikTok</Link></li>
              {FEATURES.YOUTUBE_ENABLED && <li><Link href="/tools/youtube" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Video YouTube</Link></li>}
              <li><Link href="/tools" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Herramientas Pro</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">
              Sitemap
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.blog}</Link></li>
              <li><Link href="/planes" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.plans}</Link></li>
              <li><Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/faq" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.nav.faq}</Link></li>
              <li><Link href="/legal/privacidad" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/legal/terminos" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/legal/cookies" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} FTYDownloader Pro. {t.footer.rights}
          </p>
          <p className="mt-1 text-[11px] opacity-75">
            Facebook, TikTok, Instagram, Twitter / 𝕏, Threads — Marcas registradas de sus respectivos propietarios.
          </p>
        </div>
      </div>
    </footer>
  )
}