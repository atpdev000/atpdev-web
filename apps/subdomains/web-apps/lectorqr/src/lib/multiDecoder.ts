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

  // 2. Si BarcodeDetector encontró 12 o más códigos (rejilla completa), retornamos directo
  if (foundCodesMap.size >= 12) {
    return Array.from(foundCodesMap.values());
  }

  // 3. Fallback y complemento con jsQR (Escaneo completo + Multi-rejilla adaptativa)
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

  // B) Si la imagen es grande (posible collage o múltiples QR como 3x4, 4x3, 2x2, 4x4)
  // Dividir en cuadrícula con superposición (overlap) para asegurar que ningún QR quede cortado
  const gridConfigs = [
    { rows: 4, cols: 3 }, // Configuración típica de hojas de 12 QR (3 columnas x 4 filas)
    { rows: 3, cols: 4 }, // 4 columnas x 3 filas
    { rows: 3, cols: 3 }, // 9 QR
    { rows: 2, cols: 2 }, // 4 QR
    { rows: 4, cols: 4 }, // 16 QR
  ];

  for (const grid of gridConfigs) {
    const tileW = Math.floor(w / grid.cols);
    const tileH = Math.floor(h / grid.rows);
    const overlapX = Math.floor(tileW * 0.22);
    const overlapY = Math.floor(tileH * 0.22);

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const startX = Math.max(0, c * tileW - overlapX);
        const startY = Math.max(0, r * tileH - overlapY);
        const endX = Math.min(w, (c + 1) * tileW + overlapX);
        const endY = Math.min(h, (r + 1) * tileH + overlapY);
        const currentW = endX - startX;
        const currentH = endY - startY;

        if (currentW > 30 && currentH > 30) {
          try {
            const tileData = ctx.getImageData(startX, startY, currentW, currentH);
            let res = jsQR(tileData.data, currentW, currentH, { inversionAttempts: 'attemptBoth' });
            
            // Si no detecta en primera pasada, intentar normalización de contraste para QRs coloreados
            if (!res && currentW > 60) {
              const data = tileData.data;
              // Aumentar contraste para códigos de color claro (amarillo, celeste, etc.)
              const highContrastData = new Uint8ClampedArray(data.length);
              for (let p = 0; p < data.length; p += 4) {
                const r = data[p];
                const g = data[p + 1];
                const b = data[p + 2];
                // Luma estándar
                const luma = 0.299 * r + 0.587 * g + 0.114 * b;
                const enhanced = luma < 185 ? 0 : 255;
                highContrastData[p] = enhanced;
                highContrastData[p + 1] = enhanced;
                highContrastData[p + 2] = enhanced;
                highContrastData[p + 3] = 255;
              }
              res = jsQR(highContrastData, currentW, currentH, { inversionAttempts: 'attemptBoth' });
            }

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

