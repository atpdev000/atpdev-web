'use client'

import { FEATURES } from '@/lib/featureFlags'

interface TopNavProps {
    activePlatform: 'facebook' | 'youtube' | 'tiktok'
    onPlatformChange: (platform: 'facebook' | 'youtube' | 'tiktok') => void
}

export default function TopNav({ activePlatform, onPlatformChange }: TopNavProps) {
    const allTabs = [
        {
            id: 'facebook' as const,
            label: 'Facebook',
            color: 'bg-blue-600',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
            )
        },
        {
            id: 'youtube' as const,
            label: 'YouTube',
            color: 'bg-red-600',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'tiktok' as const,
            label: 'TikTok',
            color: 'bg-black',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v-3H4v19h5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            )
        }
    ]

    // Filter tabs based on feature flags
    const tabs = FEATURES.YOUTUBE_ENABLED
        ? allTabs
        : allTabs.filter(tab => tab.id !== 'youtube')

    // Adjust grid columns based on number of tabs
    const gridClass = tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'

    return (
        <div className="bg-white shadow-sm pt-1 pb-1 px-1 fixed top-20 left-0 right-0 z-30">
            <div className={`grid ${gridClass} gap-1`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onPlatformChange(tab.id)}
                        className={`flex flex-col items-center justify-center space-y-1 py-2 px-0 rounded-lg text-xs font-medium transition-all duration-200 border w-full ${activePlatform === tab.id
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
