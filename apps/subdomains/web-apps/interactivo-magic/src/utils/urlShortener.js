import { SHORTENER_API, SHORTENER_TYPE, CUSTOM_SHORTENER_API_KEY } from '../config/appConfig';

/**
 * URL Shortener Utility supporting Custom API and Public Fallbacks
 * @param {string} longUrl - The original long URL to shorten
 * @returns {string} - The shortened URL or original if all fail
 */
export const shortenUrl = async (longUrl) => {
    if (!longUrl) return '';

    console.log('[urlShortener] Starting URL shortening process...');
    console.log(`[urlShortener] Original URL length: ${longUrl.length} characters`);

    // 1. Try Custom Backend if configured
    if (SHORTENER_TYPE === 'custom' && SHORTENER_API) {
        const endpoints = ['/api/v1/shorten', '/api/shorten', '/shorten'];

        for (const path of endpoints) {
            try {
                console.log(`[urlShortener] ⚡ Trying custom backend: ${SHORTENER_API}${path}`);
                const response = await fetch(`${SHORTENER_API}${path}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: longUrl, key: CUSTOM_SHORTENER_API_KEY })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.short_url) {
                        console.log(`[urlShortener] ✅ SUCCESS: ${data.short_url}`);
                        return data.short_url;
                    }
                    if (data.result_url) {
                        console.log(`[urlShortener] ✅ SUCCESS: ${data.result_url}`);
                        return data.result_url;
                    }
                    if (data.shortUrl) {
                        console.log(`[urlShortener] ✅ SUCCESS: ${data.shortUrl}`);
                        return data.shortUrl;
                    }
                } else {
                    console.warn(`[urlShortener] ❌ Custom backend (${path}) returned status: ${response.status}`);
                    try {
                        const errorData = await response.json();
                        console.warn('[urlShortener] Error Detail:', errorData);
                    } catch (e) { /* ignore parse error */ }
                }
            } catch (e) {
                console.warn(`[urlShortener] ⚠️ Endpoint ${path} connection failed:`, e.message);
            }
        }
    }

    console.log('[urlShortener] 🔄 Falling back to public shorteners...');

    // 2. Fallback to public services
    try {
        console.log('[urlShortener] 🔌 Shortening with CleanURI...');
        const response = await fetch('https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `url=${encodeURIComponent(longUrl)}`
        });
        if (response.ok) {
            const data = await response.json();
            if (data.result_url) {
                console.log(`[urlShortener] ✅ SUCCESS with CleanURI: ${data.result_url}`);
                return data.result_url;
            }
        } else {
            console.warn(`[urlShortener] CleanURI failed with status: ${response.status} (likely URL too long)`);
        }
    } catch (e) {
        console.warn('[urlShortener] CleanURI failed:', e.message);
    }

    try {
        console.log('[urlShortener] 🔌 Shortening with TinyURL...');
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            const short = await response.text();
            if (short && short.startsWith('http')) {
                console.log(`[urlShortener] ✅ SUCCESS with TinyURL: ${short}`);
                return short;
            }
        }
    } catch (e) {
        console.warn('[urlShortener] TinyURL failed:', e.message);
    }

    try {
        console.log('[urlShortener] 🔌 Shortening with is.gd...');
        const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            const short = await response.text();
            if (short && short.startsWith('http')) {
                console.log(`[urlShortener] ✅ SUCCESS with is.gd: ${short}`);
                return short;
            }
        }
    } catch (e) {
        console.warn('[urlShortener] is.gd failed:', e.message);
    }

    console.error('[urlShortener] ❌ ALL SHORTENERS FAILED - Returning original URL');
    return longUrl;
};
