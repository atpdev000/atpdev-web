'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import HistoryModal from '@/components/HistoryModal'
import { useDownloadHistory } from '@/hooks/useDownloadHistory'

export default function AppHeader() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const { history, unreadCount, markAllAsRead, clearHistory, deleteItem } = useDownloadHistory()

    return (
        <>
            <div className="bg-white shadow-sm py-4 px-6 fixed top-0 left-0 right-0 z-40 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FTY Downloader
                </h1>

                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
                    aria-label="Ver Historial"
                >
                    <Clock className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </button>
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
