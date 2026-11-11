'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import HistoryModal from '@/components/HistoryModal'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'

export default function AppHeader() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const { history, unreadCount, markAllAsRead, clearHistory, deleteItem } = useDownloadHistory()

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
            <div className="py-2 px-3 sm:px-4 flex items-center justify-between transition-colors border-b border-gray-100 dark:border-slate-800/80 max-w-full relative z-50">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group"
                    title="Ir al inicio de Descargador Pro"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </div>
                    <h1 className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate min-w-0 mr-1 sm:mr-2">
                        Descargador Pro
                    </h1>
                </Link>

                <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                    <LanguageSelector />
                    <ThemeToggle />

                    <button
                        onClick={() => {
                            markAllAsRead()
                            setIsHistoryOpen(true)
                        }}
                        className="p-1.5 sm:p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative shrink-0 cursor-pointer"
                        title="Historial de Descargas"
                        aria-label="Historial de Descargas"
                    >
                        <Clock className="w-5 h-5" />
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
        </>
    )
}
