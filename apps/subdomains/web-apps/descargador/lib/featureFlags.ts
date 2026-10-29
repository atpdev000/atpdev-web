import { Capacitor } from '@capacitor/core'

export const FEATURES = {
    /**
     * Enable YouTube platform support
     * - Web/APK builds: true
     * - Play Store builds: false (compliance with YouTube ToS)
     * - Ezoic Compliance: false on web, true on native
     */
    YOUTUBE_ENABLED: process.env.NEXT_PUBLIC_ENABLE_YOUTUBE === 'true' || Capacitor.isNativePlatform(),

    /**
     * Current app version identifier
     * - 'web': Full-featured web/APK version
     * - 'playstore': Play Store compliant version
     */
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'web',
} as const

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
    return FEATURES[feature] === true
}

/**
 * Get app version
 */
export function getAppVersion(): string {
    return FEATURES.APP_VERSION
}

/**
 * Check if running Play Store build
 */
export function isPlayStoreBuild(): boolean {
    return FEATURES.APP_VERSION === 'playstore'
}

/**
 * Get available platforms based on feature flags
 */
export function getAvailablePlatforms() {
    const platforms = ['facebook', 'tiktok'] as const

    if (FEATURES.YOUTUBE_ENABLED) {
        return ['facebook', 'youtube', 'tiktok'] as const
    }

    return platforms
}
