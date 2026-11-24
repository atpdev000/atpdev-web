import { Capacitor } from '@capacitor/core'

export const PLAYSTORE_UA_TOKEN = 'FTYChannel/playstore'
export const DIRECT_UA_TOKEN = 'FTYChannel/direct'

export const FEATURES = {
    /**
     * Enable YouTube platform support
     * - Web / AdSense Compliance: false on web by default to ensure 100% Google AdSense approval
     * - Play Store builds: false (compliance with YouTube ToS)
     * - Native / explicitly enabled APK: true via NEXT_PUBLIC_ENABLE_YOUTUBE=true
     */
    YOUTUBE_ENABLED: process.env.NEXT_PUBLIC_ENABLE_YOUTUBE === 'true' && process.env.NEXT_PUBLIC_APP_VERSION !== 'playstore',

    /**
     * Current app version identifier
     * - 'web': Full-featured web/APK version
     * - 'playstore': Play Store compliant version
     */
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'web',
} as const

export function isPlayStoreUserAgent(userAgent?: string | null): boolean {
    if (!userAgent) return false
    return userAgent.includes(PLAYSTORE_UA_TOKEN)
}

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
    return isPlayStoreBuild() ? 'playstore' : FEATURES.APP_VERSION
}

/**
 * Check if running Play Store build (compile-time env OR Android WebView User-Agent/native bridge marker)
 */
export function isPlayStoreBuild(): boolean {
    if (FEATURES.APP_VERSION === 'playstore') {
        return true
    }
    if (typeof window !== 'undefined') {
        if ((window as any).__FTY_CHANNEL === 'playstore') {
            return true
        }
        if (typeof navigator !== 'undefined' && isPlayStoreUserAgent(navigator.userAgent)) {
            return true
        }
    }
    return false
}

/**
 * Determine whether YouTube UI/routes should be visible on the current client.
 * - Play Store builds always keep YouTube disabled.
 * - Native APK/Capacitor builds (direct channel) enable YouTube using on-device extraction.
 * - Public web respects CMS modules.youtube_enabled (AdSense compliance).
 */
export function isYoutubeVisible(
    modules?: Record<string, boolean>,
    isNative: boolean = false,
    isPlayStore: boolean = false
): boolean {
    if (isPlayStore || isPlayStoreBuild()) {
        return false
    }
    if (isNative) {
        return true
    }
    if (modules && typeof modules.youtube_enabled === 'boolean') {
        return modules.youtube_enabled
    }
    return FEATURES.YOUTUBE_ENABLED
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
