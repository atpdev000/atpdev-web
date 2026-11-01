// Versión actual de la aplicación (DEBE COINCIDIR con package.json)
export const CURRENT_VERSION = '1.2.0';

// URL donde se verifica la última versión disponible
export const VERSION_CHECK_URL = 'https://interactivomagic.ftydownloader.com/version.json';

// Enlaces de descarga
export const DOWNLOAD_LINKS = {
    // Placeholder - actualizar cuando esté en Play Store
    playStore: '#',
    // APK desde Vercel public folder
    apkDirect: 'https://interactivomagic.ftydownloader.com/downloads/app-release.apk'
};

/**
 * Compara dos versiones en formato semántico (ej: "1.2.3")
 * @param {string} v1 - Primera versión
 * @param {string} v2 - Segunda versión  
 * @returns {number} -1 si v1 < v2, 0 si v1 === v2, 1 si v1 > v2
 */
export function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;
        if (parts1[i] < parts2[i]) return -1;
    }

    return 0;
}

/**
 * Verifica si hay una nueva versión disponible
 * @returns {Promise<Object|null>} Información de actualización o null si hay error
 */
export async function checkForUpdates() {
    try {
        console.log('[Version Check] Iniciando verificación de versión...');
        console.log('[Version Check] Versión actual:', CURRENT_VERSION);
        console.log('[Version Check] URL de verificación:', VERSION_CHECK_URL);

        const response = await fetch(VERSION_CHECK_URL, {
            cache: 'no-store', // Evitar cache para siempre obtener la versión más reciente
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) {
            console.error('[Version Check] Error HTTP:', response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const latestVersion = data.version;

        console.log('[Version Check] Versión del servidor:', latestVersion);

        // Validar que ambas versiones sean válidas
        if (!latestVersion || !CURRENT_VERSION) {
            console.error('[Version Check] Versión inválida detectada');
            return null;
        }

        const comparison = compareVersions(CURRENT_VERSION, latestVersion);
        console.log('[Version Check] Resultado de comparación:', comparison);
        console.log('[Version Check] ¿Hay actualización?:', comparison === -1);

        const result = {
            hasUpdate: comparison === -1,
            currentVersion: CURRENT_VERSION,
            latestVersion,
            releaseDate: data.releaseDate,
            whatsNew: data.whatsNew || [],
            downloadLinks: DOWNLOAD_LINKS
        };

        console.log('[Version Check] Resultado final:', result);
        return result;
    } catch (error) {
        console.error('[Version Check] Error checking for updates:', error);
        return null;
    }
}
