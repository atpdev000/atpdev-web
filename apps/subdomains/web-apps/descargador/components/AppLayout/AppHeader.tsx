'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import HistoryModal from '@/components/HistoryModal'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'
import { ThemeToggle } from '@/components/Layout/ThemeToggle'
import { LanguageSelector } from '@/components/Layout/LanguageSelector'

export default function AppHeader() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const { history, unreadCount, markAllAsRead, clearHistory, deleteItem } = useDownloadHistory()

    return (
        <>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800 py-3 px-4 fixed top-0 left-0 right-0 z-40 flex items-center justify-between transition-colors">
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FTY Downloader Pro
                </h1>

                <div className="flex items-center space-x-2">
                    <LanguageSelector />
                    <ThemeToggle />

                    <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                        aria-label="Ver Historial"
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
                onOpen={markAllAsRead}
            />
        </>
    )
}
