import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Check if the app is running in a native mobile environment
 */
export const isNativePlatform = () => {
    return Capacitor.isNativePlatform();
};

/**
 * Get the current platform name
 */
export const getPlatform = () => {
    return Capacitor.getPlatform();
};

/**
 * Share content using native share or web fallback
 */
export const shareContent = async ({ title, text, url }) => {
    if (isNativePlatform()) {
        try {
            await Share.share({
                title: title || 'Interactivo Magic',
                text: text || '',
                url: url || '',
                dialogTitle: 'Compartir mensaje mágico'
            });
            return { success: true, native: true };
        } catch (error) {
            console.error('Native share error:', error);
            return { success: false, error };
        }
    } else {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Interactivo Magic',
                    text: text || '',
                    url: url || ''
                });
                return { success: true, native: false };
            } catch (error) {
                console.error('Web share error:', error);
                return { success: false, error };
            }
        } else {
            try {
                await navigator.clipboard.writeText(url || text || '');
                return { success: true, fallback: 'clipboard' };
            } catch (error) {
                return { success: false, error };
            }
        }
    }
};

/**
 * Share a generated HTML file on mobile
 */
export const shareHTMLFile = async ({ fileName, htmlContent }) => {
    if (!isNativePlatform()) return { success: false, error: 'Not on native platform' };

    try {
        // Save the file to the cache directory first
        const result = await Filesystem.writeFile({
            path: fileName,
            data: htmlContent,
            directory: Directory.Cache,
            encoding: 'utf8'
        });

        // Share the file using its local URI
        await Share.share({
            title: 'Interactivo Magic',
            text: 'Te han enviado un mensaje mágico ✨',
            files: [result.uri],
            dialogTitle: 'Compartir archivo mágico'
        });

        return { success: true };
    } catch (error) {
        console.error('Share HTML file error:', error);
        return { success: false, error };
    }
};
