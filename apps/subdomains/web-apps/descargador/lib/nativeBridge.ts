import { registerPlugin, Capacitor } from '@capacitor/core';

export interface WhatsAppStatusPluginInterface {
  checkPermission(): Promise<{ granted: boolean; isAllFiles: boolean; sdkVersion: number }>;
  requestPermission(): Promise<{ openedSettings?: boolean; type?: string }>;
  getStatuses(options?: { appType?: 'all' | 'whatsapp' | 'business' }): Promise<{
    statuses: Array<{
      id: string;
      name: string;
      path: string;
      type: 'image' | 'video';
      app: 'whatsapp' | 'business';
      sizeBytes: number;
      sizeFormatted: string;
      date: string;
      thumbnail?: string;
    }>;
    count: number;
  }>;
  saveToGallery(options: { filePath: string }): Promise<{ success: boolean; uri: string; fileName: string }>;
  openWhatsApp(options?: { target?: 'whatsapp' | 'business' }): Promise<{ success: boolean; package?: string }>;
  openMedia(options: { filePath: string }): Promise<{ success: boolean }>;
  shareFile(options: { filePath: string; title?: string }): Promise<{ success: boolean }>;
  getClipboard(): Promise<{ text: string }>;
}

export const NativeWhatsAppStatus = registerPlugin<WhatsAppStatusPluginInterface>('WhatsAppStatus');

/**
 * Comparte un archivo multimedia en Android usando el FileProvider nativo
 * o recurre a la API web en navegadores.
 */
export async function shareNativeMedia(filePath: string, title?: string, fallbackUrl?: string): Promise<boolean> {
  if (Capacitor.isNativePlatform() && filePath) {
    try {
      await NativeWhatsAppStatus.shareFile({ filePath, title: title || 'Compartir' });
      return true;
    } catch (err) {
      console.warn('Error en NativeWhatsAppStatus.shareFile:', err);
    }
  }

  // Fallback web / PWA
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: title || 'Compartir archivo',
        url: fallbackUrl || window.location.href
      });
      return true;
    } catch {}
  }

  return false;
}

/**
 * Lee el portapapeles en Android nativo usando ClipboardManager directamente
 * o recurre a navigator.clipboard en web.
 */
export async function readNativeClipboard(): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await NativeWhatsAppStatus.getClipboard();
      if (res && res.text) {
        return res.text.trim();
      }
    } catch (err) {
      console.warn('Error en NativeWhatsAppStatus.getClipboard:', err);
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
    try {
      const text = await navigator.clipboard.readText();
      if (text) return text.trim();
    } catch {}
  }

  return '';
}
