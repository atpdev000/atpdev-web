'use client'

import { FEATURES } from '@/lib/featureFlags'

type Platform = 'facebook' | 'youtube' | 'tiktok'

interface PlatformTabsProps {
  activePlatform: Platform
  onPlatformChange: (platform: Platform) => void
}

const platforms = [
  {
    id: 'facebook' as Platform,
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-blue-600'
  },
  {
    id: 'tiktok' as Platform,
    name: 'TikTok',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
      </svg>
    ),
    color: 'bg-black'
  },
  ...(FEATURES.YOUTUBE_ENABLED ? [{
    id: 'youtube' as Platform,
    name: 'Multimedia',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: 'bg-red-600'
  }] : [])
]

export default function PlatformTabs({ activePlatform, onPlatformChange }: PlatformTabsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 justify-center w-full sm:w-auto sm:flex-1 ${activePlatform === platform.id
              ? `${platform.color} text-white shadow-md`
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {platform.icon}
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}