'use client'

interface BottomNavProps {
    activePlatform: 'facebook' | 'youtube' | 'tiktok'
    onPlatformChange: (platform: 'facebook' | 'youtube' | 'tiktok') => void
}

export default function BottomNav({ activePlatform, onPlatformChange }: BottomNavProps) {
    const tabs = [
        {
            id: 'facebook',
            label: 'Facebook',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
            )
        },
        {
            id: 'youtube',
            label: 'YouTube',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'tiktok',
            label: 'TikTok',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v-3H4v19h5z" />
                    {/* Nota: Icono simplificado de música para TikTok */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            )
        }
    ] as const

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onPlatformChange(tab.id)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activePlatform === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
            {/* Spacer for safe area devices without physical home button */}
            <div className="h-4 bg-white" />
        </div>
    )
}
