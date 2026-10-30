'use client'

import { FEATURES } from '@/lib/featureFlags'
import { Platform } from '@/components/PlatformTabs'

interface TopNavProps {
    activePlatform: Platform
    onPlatformChange: (platform: Platform) => void
}

export default function TopNav({ activePlatform, onPlatformChange }: TopNavProps) {
    const allTabs = [
        {
            id: 'facebook' as Platform,
            label: 'Facebook',
            color: 'bg-blue-600',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
            )
        },
        {
            id: 'tiktok' as Platform,
            label: 'TikTok',
            color: 'bg-slate-900',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v-3H4v19h5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            )
        },
        {
            id: 'instagram' as Platform,
            label: 'Instagram',
            color: 'bg-pink-600',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
                </svg>
            )
        },
        {
            id: 'twitter' as Platform,
            label: 'Twitter / 𝕏',
            color: 'bg-black',
            icon: (
                <span className="font-black text-xs leading-none">𝕏</span>
            )
        },
        {
            id: 'threads' as Platform,
            label: 'Threads',
            color: 'bg-zinc-800',
            icon: (
                <span className="font-bold text-xs leading-none">@</span>
            )
        },
        ...(FEATURES.YOUTUBE_ENABLED ? [{
            id: 'youtube' as Platform,
            label: 'Multimedia',
            color: 'bg-red-600',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }] : [])
    ]

    return (
        <div className="bg-white shadow-sm pt-1 pb-1 px-1 fixed top-20 left-0 right-0 z-30 overflow-x-auto no-scrollbar">
            <div className="flex space-x-1 min-w-max">
                {allTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onPlatformChange(tab.id)}
                        className={`flex items-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 border whitespace-nowrap ${activePlatform === tab.id
                            ? `${tab.color} text-white border-transparent shadow-md`
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
