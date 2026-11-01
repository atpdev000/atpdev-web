/**
 * Google AdSense Configuration
 * IDs de bloques de anuncios para la versión WEB
 */

// ============================================
// CONFIGURACIÓN PRINCIPAL
// ============================================

export const ADSENSE_CONFIG = {
    // ID del cliente de AdSense
    CLIENT_ID: 'ca-pub-5414009811868137',

    // IDs de bloques de anuncios
    ADS: {
        // Banner superior (Header)
        HEADER_BANNER: '4095225502',

        // Mid Landing (Hero section)
        MID_LANDING: '5051701068',

        // Result Screen (Pantalla de resultado)
        RESULT_SCREEN: '9155980495',

        // Footer Banner
        FOOTER_BANNER: '4095225502',

        // Lateral Ads (Formulario personalización)
        LATERAL_LEFT: '4095225502',
        LATERAL_RIGHT: '4095225502',
    }
};

/**
 * Obtiene el ID del cliente de AdSense
 */
export const getAdSenseClientId = () => {
    return ADSENSE_CONFIG.CLIENT_ID;
};

/**
 * Obtiene un ID de bloque de anuncios específico
 * @param {'HEADER_BANNER' | 'MID_LANDING' | 'RESULT_SCREEN' | 'FOOTER_BANNER' | 'LATERAL_LEFT' | 'LATERAL_RIGHT'} adSlot
 */
export const getAdSenseSlot = (adSlot) => {
    return ADSENSE_CONFIG.ADS[adSlot];
};
