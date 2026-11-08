import { registerPlugin, Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
  downloadAndCombineMedia(options: {
    videoUrl?: string;
    audioUrl?: string;
    filename: string;
    isAudio?: boolean;
  }): Promise<{ success: boolean; uri: string; fileName: string }>;
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

/**
 * Guarda un Blob en el almacenamiento del dispositivo Android de forma segura,
 * por fragmentos para evitar saturación de memoria (OOM), con fallback automático
 * de directorios y registro en la Galería / Biblioteca de música nativa vía MediaStore.
 */
export async function saveNativeMediaFile(
  blob: Blob,
  filename: string,
  isAudio: boolean = false,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; uri: string; path: string }> {
  const baseFolder = 'Download/DescargadorPro/download';
  const typeFolder = isAudio ? 'DescargadorPro Audio' : 'DescargadorPro Video';

  // Helper para crear directorios tolerando directorios preexistentes sin arrojar excepción
  const safeMkdir = async (dirPath: string, directory: Directory): Promise<boolean> => {
    try {
      await Filesystem.mkdir({
        path: dirPath,
        directory,
        recursive: true
      });
      return true;
    } catch (err: any) {
      const msg = (err?.message || err?.toString() || '').toLowerCase();
      // Si el directorio ya existe, es completamente válido y seguro reutilizarlo
      if (
        msg.includes('already exists') ||
        msg.includes('already exist') ||
        msg.includes('exists') ||
        msg.includes('os_status_code: 17') ||
        msg.includes('eexist')
      ) {
        return true;
      }
      return false;
    }
  };

  let targetDirectory = Directory.ExternalStorage;
  let finalPath = `${baseFolder}/${typeFolder}/${filename}`;

  // Intentar ExternalStorage (Android < 11 o con permisos de almacenamiento)
  const extOk = await safeMkdir(`${baseFolder}/${typeFolder}`, Directory.ExternalStorage);
  if (!extOk) {
    console.warn('⚠️ No se pudo crear en ExternalStorage, probando Documents...');
    const docOk = await safeMkdir(`DescargadorPro/${typeFolder}`, Directory.Documents);
    if (docOk) {
      targetDirectory = Directory.Documents;
      finalPath = `DescargadorPro/${typeFolder}/${filename}`;
    } else {
      console.warn('⚠️ No se pudo crear en Documents, usando almacenamiento interno seguro Data...');
      targetDirectory = Directory.Data;
      finalPath = `${typeFolder}/${filename}`;
      await safeMkdir(typeFolder, Directory.Data);
    }
  }

  const blobToBase64 = (b: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        resolve(res.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(b);
    });
  };

  const CHUNK_SIZE = 1024 * 1024 * 4; // 4MB por chunk
  const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);

  try {
    await Filesystem.deleteFile({ path: finalPath, directory: targetDirectory });
  } catch {}

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, blob.size);
    const chunk = blob.slice(start, end);
    const base64Chunk = await blobToBase64(chunk);

    if (i === 0) {
      await Filesystem.writeFile({
        path: finalPath,
        data: base64Chunk,
        directory: targetDirectory
      });
    } else {
      await Filesystem.appendFile({
        path: finalPath,
        data: base64Chunk,
        directory: targetDirectory
      });
    }

    if (onProgress) {
      const pct = Math.round(((i + 1) / totalChunks) * 100);
      onProgress(pct);
    }
  }

  const uriResult = await Filesystem.getUri({
    path: finalPath,
    directory: targetDirectory
  });

  const savedUri = uriResult.uri;
  console.log('✅ Archivo físico escrito en:', savedUri);

  // Auto-indexar en Android MediaStore (Galería de videos o Biblioteca de música)
  try {
    const galleryResult = await NativeWhatsAppStatus.saveToGallery({ filePath: savedUri });
    console.log('✅ Indexado en MediaStore de Android:', galleryResult);
  } catch (gErr) {
    console.warn('⚠️ No se pudo indexar en MediaStore, el archivo sigue accesible en su ruta:', gErr);
  }

  return {
    success: true,
    uri: savedUri,
    path: finalPath
  };
}

/**
 * Descarga y combina flujos de video y audio directamente en el dispositivo Android
 * mediante MediaMuxer nativo por hardware, eludiendo restricciones de red y proxy.
 */
export async function downloadAndCombineNative(
  videoUrl?: string,
  audioUrl?: string,
  filename?: string,
  isAudio: boolean = false
): Promise<{ success: boolean; uri: string; fileName: string }> {
  return await NativeWhatsAppStatus.downloadAndCombineMedia({
    videoUrl: videoUrl || '',
    audioUrl: audioUrl || '',
    filename: filename || `media_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`,
    isAudio
  });
}

