'use client'

import { FEATURES } from '@/lib/featureFlags'
import { Platform } from '@/components/PlatformTabs'
import { useI18n } from '@/lib/i18n/context'

interface TopNavProps {
    activePlatform: Platform
    onPlatformChange: (platform: Platform) => void
    modules?: Record<string, boolean>
}

export default function TopNav({ activePlatform, onPlatformChange, modules }: TopNavProps) {
    const { t } = useI18n()

    const allTabs = [
        {
            id: 'facebook' as Platform,
            label: t.platforms.facebook,
            color: 'bg-blue-600',
            activeClass: 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 font-bold',
            icon: (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
            )
        },
        {
            id: 'tiktok' as Platform,
            label: t.platforms.tiktok,
            color: 'bg-black',
            activeClass: 'bg-black text-white shadow-md ring-2 ring-pink-500 border border-cyan-400 font-bold',
            icon: (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v-3H4v19h5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            )
        },
        {
            id: 'instagram' as Platform,
            label: t.platforms.instagram,
            color: 'bg-pink-600',
            activeClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md ring-2 ring-pink-400 font-bold',
            icon: (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
                </svg>
            )
        },
        {
            id: 'twitter' as Platform,
            label: t.platforms.twitter,
            color: 'bg-black',
            activeClass: 'bg-slate-900 dark:bg-black text-white shadow-md ring-2 ring-slate-400 border border-slate-600 font-bold',
            icon: (
                <span className="font-black text-xs leading-none shrink-0">𝕏</span>
            )
        },
        {
            id: 'threads' as Platform,
            label: t.platforms.threads,
            color: 'bg-zinc-800',
            activeClass: 'bg-zinc-900 dark:bg-black text-white shadow-md ring-2 ring-zinc-400 border border-zinc-600 font-bold',
            icon: (
                <span className="font-bold text-xs leading-none shrink-0">@</span>
            )
        },
        {
            id: 'whatsapp' as Platform,
            label: 'WhatsApp',
            color: 'bg-emerald-600',
            activeClass: 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 font-bold',
            icon: (
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.211c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.001-.482-1.674-.693-2.736-2.42-2.82-2.53-.083-.11-.676-.901-.676-1.718 0-.818.431-1.218.583-1.385.153-.166.333-.208.444-.208.111 0 .222.002.319.006.102.005.239-.039.373.283.144.346.49 1.196.533 1.284.043.088.072.19.014.305-.058.115-.087.188-.173.289-.087.102-.183.228-.261.306-.087.087-.178.182-.077.355.101.173.45 1.742 1.488 2.666.804.717 1.48.939 1.69.1.043.21-.043.324-.117.41-.074.086-.168.201-.255.302-.087.1-.174.143-.246.216z"/>
                </svg>
            )
        },
        ...(FEATURES.YOUTUBE_ENABLED ? [{
            id: 'youtube' as Platform,
            label: t.platforms.multimedia,
            color: 'bg-red-600',
            activeClass: 'bg-red-600 text-white shadow-md ring-2 ring-red-400 font-bold',
            icon: (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }] : [])
    ]

    const tabs = allTabs.filter(tab => {
        if (!modules) return true
        const key = `${tab.id}_enabled`
        return modules[key] !== false
    })

    return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800 pt-2 pb-2 px-3 fixed top-14 left-0 right-0 z-30 overflow-x-auto no-scrollbar transition-colors">
            <div className="flex space-x-2 min-w-max">
                {tabs.map((tab) => {
                    const isActive = activePlatform === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onPlatformChange(tab.id)}
                            className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                                isActive
                                    ? tab.activeClass
                                    : 'bg-gray-100/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 border-gray-200/80 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
