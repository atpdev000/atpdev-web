'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Share2 } from 'lucide-react'
import { Share } from '@capacitor/share'
import { Capacitor } from '@capacitor/core'
import HistoryModal from '@/components/HistoryModal'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'

export default function AppHeader() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [shareNotice, setShareNotice] = useState<string | null>(null)
    const { history, unreadCount, markAllAsRead, clearHistory, deleteItem } = useDownloadHistory()

    const handleShareApp = async () => {
        const shareData = {
            title: 'Descargador Pro',
            text: '¡Descarga videos y fotos en HD/4K de Facebook, TikTok, Instagram, WhatsApp y más sin marcas de agua con Descargador Pro! 🚀',
            url: 'https://descargador.atpdev.dev',
            dialogTitle: 'Compartir Descargador Pro'
        }

        if (Capacitor.isNativePlatform()) {
            try {
                await Share.share(shareData)
                return
            } catch (err) {
                console.warn('Error al compartir nativo o diálogo cancelado:', err)
                return
            }
        }

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
                await navigator.share(shareData)
                return
            } catch (err) {
                return
            }
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
                setShareNotice('¡Enlace de Descargador Pro copiado!')
                setTimeout(() => setShareNotice(null), 2600)
            } catch (err) {
                console.error('Error al copiar:', err)
            }
        }
    }

    const handleLogoClick = (e: React.MouseEvent) => {
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
            e.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    return (
        <>
            <div className="py-2 px-2.5 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-2 transition-colors border-b border-gray-100 dark:border-slate-800/80 w-full max-w-full relative z-50">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="flex items-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity cursor-pointer group min-w-0 shrink"
                    title="Ir al inicio de Descargador Pro"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </div>
                    <h1 className="text-[15px] sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate min-w-0">
                        Descargador Pro
                    </h1>
                </Link>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <LanguageSelector />
                    <ThemeToggle />

                    <button
                        onClick={handleShareApp}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors shrink-0 cursor-pointer active:scale-95"
                        title="Compartir Descargador Pro"
                        aria-label="Compartir Descargador Pro"
                    >
                        <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    </button>

                    <button
                        onClick={() => {
                            markAllAsRead()
                            setIsHistoryOpen(true)
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 hover:bg-gray-200/70 dark:hover:bg-slate-700 transition-colors relative shrink-0 cursor-pointer active:scale-95"
                        title="Historial de Descargas"
                        aria-label="Historial de Descargas"
                    >
                        <Clock className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onClear={clearHistory}
                onDelete={deleteItem}
            />

            {shareNotice && (
                <div
                    role="status"
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg animate-in fade-in duration-150"
                >
                    {shareNotice}
                </div>
            )}
        </>
    )
}
