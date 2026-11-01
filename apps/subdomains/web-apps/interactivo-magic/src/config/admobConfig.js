/**
 * AdMob Configuration
 * IDs de bloques de anuncios para Interactivo Magic
 */

// ============================================
// CONFIGURACIÓN PRINCIPAL
// ============================================

// Cambiar a true durante desarrollo para usar anuncios de prueba
export const USE_TEST_ADS = false;

// ============================================
// IDs DE PRODUCCIÓN (REAL)
// ============================================

export const ADMOB_CONFIG = {
    // ID de la aplicación en AdMob
    APP_ID: 'ca-app-pub-5414009811868137~3729869080',

    // IDs de bloques de anuncios
    ADS: {
        BANNER: 'ca-app-pub-5414009811868137/4899674043',
        INTERSTITIAL: 'ca-app-pub-5414009811868137/6291635005',
        REWARDED_INTERSTITIAL: 'ca-app-pub-5414009811868137/3586592379',
    }
};

// ============================================
// IDs DE PRUEBA (TESTING)
// ============================================

export const TEST_ADMOB_CONFIG = {
    ADS: {
        BANNER: 'ca-app-pub-3940256099942544/6300978111',
        INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
        REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
    }
};

// ============================================
// OBTENER CONFIGURACIÓN ACTIVA
// ============================================

/**
 * Obtiene los IDs de anuncios según el modo (test/producción)
 */
export const getAdConfig = () => {
    return USE_TEST_ADS ? TEST_ADMOB_CONFIG : ADMOB_CONFIG;
};

/**
 * Obtiene un ID de anuncio específico
 * @param {'BANNER' | 'INTERSTITIAL' | 'REWARDED_INTERSTITIAL'} adType - Tipo de anuncio
 */
export const getAdId = (adType) => {
    const config = getAdConfig();
    return config.ADS[adType];
};
