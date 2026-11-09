import jsQR from 'jsqr';
import { parseScannedContent } from './parser';
import { ScannedCode } from '../types';

/**
 * Decodifica TODOS los códigos QR o de barras presentes en un elemento Canvas o Imagen.
 * Soporta collages con múltiples códigos en cuadrícula (ej. 3x4, 4x3, 2x2) y múltiples archivos.
 */
export async function detectAllQRsInCanvas(
  canvas: HTMLCanvasElement,
  formatHint = 'QR_CODE'
): Promise<ScannedCode[]> {
  const foundCodesMap = new Map<string, ScannedCode>();

  // 1. Probar BarcodeDetector nativo (Detecta múltiples códigos simultáneamente a nivel de GPU)
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const detector = new (window as any).BarcodeDetector({
        formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'data_matrix', 'aztec', 'pdf417'],
      });
      const detected = await detector.detect(canvas);
      if (detected && detected.length > 0) {
        for (const item of detected) {
          if (item.rawValue && item.rawValue.trim()) {
            const raw = item.rawValue.trim();
            if (!foundCodesMap.has(raw)) {
              foundCodesMap.set(raw, parseScannedContent(raw, (item.format || formatHint).toUpperCase()));
            }
          }
        }
      }
    } catch (e) {
      // Fallback a jsQR con división de cuadrícula
    }
  }

  // 2. Si encontramos varios códigos con BarcodeDetector, retornamos
  if (foundCodesMap.size > 1) {
    return Array.from(foundCodesMap.values());
  }

  // 3. Fallback inteligente con jsQR (Escaneo completo + Multi-rejilla)
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return Array.from(foundCodesMap.values());

  const w = canvas.width;
  const h = canvas.height;

  // A) Escaneo del canvas completo
  try {
    const fullImgData = ctx.getImageData(0, 0, w, h);
    const fullResult = jsQR(fullImgData.data, w, h, { inversionAttempts: 'attemptBoth' });
    if (fullResult && fullResult.data) {
      const raw = fullResult.data.trim();
      if (!foundCodesMap.has(raw)) {
        foundCodesMap.set(raw, parseScannedContent(raw, 'QR_CODE'));
      }
    }
  } catch (e) {}

  // B) Si la imagen es grande (posible collage o múltiples QR como 3x4 o 4x3)
  // Dividir en cuadrícula con superposición (overlap) para asegurar que ningún QR quede cortado
  const gridConfigs = [
    { rows: 2, cols: 2 },
    { rows: 3, cols: 3 },
    { rows: 4, cols: 3 },
    { rows: 3, cols: 4 },
  ];

  for (const grid of gridConfigs) {
    // Si ya encontramos al menos 4 códigos en una cuadrícula anterior, podemos seguir buscando para ser exhaustivos
    const tileW = Math.floor(w / grid.cols);
    const tileH = Math.floor(h / grid.rows);
    const overlapX = Math.floor(tileW * 0.18);
    const overlapY = Math.floor(tileH * 0.18);

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const startX = Math.max(0, c * tileW - overlapX);
        const startY = Math.max(0, r * tileH - overlapY);
        const endX = Math.min(w, (c + 1) * tileW + overlapX);
        const endY = Math.min(h, (r + 1) * tileH + overlapY);
        const currentW = endX - startX;
        const currentH = endY - startY;

        if (currentW > 40 && currentH > 40) {
          try {
            const tileData = ctx.getImageData(startX, startY, currentW, currentH);
            const res = jsQR(tileData.data, currentW, currentH, { inversionAttempts: 'attemptBoth' });
            if (res && res.data) {
              const raw = res.data.trim();
              if (!foundCodesMap.has(raw)) {
                foundCodesMap.set(raw, parseScannedContent(raw, 'QR_CODE'));
              }
            }
          } catch (e) {}
        }
      }
    }

    // Si ya encontramos 3 o más códigos, terminamos la exploración
    if (foundCodesMap.size >= 8) break;
  }

  return Array.from(foundCodesMap.values());
}

/**
 * Procesa uno o varios archivos de imagen y devuelve la lista consolidada de códigos detectados
 */
export async function decodeImageFiles(files: FileList | File[]): Promise<ScannedCode[]> {
  const allResultsMap = new Map<string, ScannedCode>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;

    const codes = await new Promise<ScannedCode[]>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const detected = await detectAllQRsInCanvas(canvas);
            resolve(detected);
          } else {
            resolve([]);
          }
        };
        img.onerror = () => resolve([]);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve([]);
      reader.readAsDataURL(file);
    });

    for (const c of codes) {
      if (!allResultsMap.has(c.rawText)) {
        allResultsMap.set(c.rawText, c);
      }
    }
  }

  return Array.from(allResultsMap.values());
}
