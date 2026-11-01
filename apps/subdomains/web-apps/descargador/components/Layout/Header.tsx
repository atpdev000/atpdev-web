'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'
import { useI18n } from '@/lib/i18n/context'
import HistoryModal from '@/components/HistoryModal'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'

export default function Header() {
  const { t } = useI18n()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { history, unreadCount, markAllAsRead, clearHistory, deleteItem } = useDownloadHistory()

  const scrollToTools = () => {
    document.getElementById('herramientas')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <>
      <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo y nombre con enlace a Home */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  FTYDownloader <span className="text-blue-600 dark:text-blue-400">Pro</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
                  {t.nav.subtitle}
                </p>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t.nav.home}
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t.nav.blog}
              </Link>
              <button
                onClick={scrollToTools}
                className="text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {t.nav.download}
              </button>
              <Link href="/faq" className="text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {t.nav.faq}
              </Link>
              <Link
                href="/planes"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xs shadow-xs hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-105"
              >
                {t.nav.plans}
              </Link>
            </nav>

            {/* Controles de Idioma, Tema, Historial y Contacto */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {/* Badges en pantallas medianas */}
              <div className="hidden xl:flex items-center space-x-2 text-xs font-semibold">
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full">
                  {t.nav.freeBadge}
                </span>
                <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-full">
                  {t.nav.fastBadge}
                </span>
                <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 px-2.5 py-1 rounded-full">
                  {t.nav.secureBadge}
                </span>
              </div>

              {/* Selector de Idiomas */}
              <LanguageSelector />

              {/* Selector de Modo Oscuro / Claro */}
              <ThemeToggle />

              {/* Botón de Historial de Descargas */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative cursor-pointer shrink-0"
                title="Historial de Descargas"
                aria-label="Historial de Descargas"
              >
                <Clock className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>

              {/* Planes en móvil */}
              <Link
                href="/planes"
                className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs"
              >
                👑 PRO
              </Link>

              {/* Botón Contacto */}
              <Link
                href="/contact"
                className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-semibold transition-colors text-xs shadow-xs shadow-blue-500/20"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={clearHistory}
        onDelete={deleteItem}
        onOpen={markAllAsRead}
      />
    </>
  )
}