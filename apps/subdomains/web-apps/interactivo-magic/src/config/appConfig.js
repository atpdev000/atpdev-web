// Production Domain Configuration
export const PRODUCTION_DOMAIN = 'https://interactivomagic.ftydownloader.com';
export const SHORTENER_API = 'https://s.ftydownloader.com'; // Your custom shortener domain
export const SHORTENER_TYPE = 'custom'; // Enabled custom by default as requested
export const CUSTOM_SHORTENER_API_KEY = ''; // Optional: if your self-hosted API requires a key
export const LOCAL_DEV_IP = '192.168.1.13'; // Update this to your PC's IP for local mobile testing

// Get the appropriate base URL based on environment
export const getBaseUrl = () => {
    // In development (localhost), use production domain for share links
    // In production, use window.location.origin
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('capacitor');

        if (isLocalhost) {
            return PRODUCTION_DOMAIN;
        }

        return window.location.origin;
    }

    return PRODUCTION_DOMAIN;
};
