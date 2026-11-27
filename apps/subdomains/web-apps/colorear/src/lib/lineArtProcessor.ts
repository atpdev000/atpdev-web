export type KdpTrimSize = '8.5x11' | '8.5x8.5' | '6x9' | 'a4';

export interface TrimSpec {
  id: KdpTrimSize;
  label: string;
  widthIn: number;
  heightIn: number;
  widthPx300: number;
  heightPx300: number;
  note: string;
}

export const KDP_TRIM_SPECS: Record<KdpTrimSize, TrimSpec> = {
  '8.5x11': {
    id: '8.5x11',
    label: '8.5 × 11" (Estándar KDP Infantil)',
    widthIn: 8.5,
    heightIn: 11,
    widthPx300: 2550,
    heightPx300: 3300,
    note: 'Formato más vendido en Amazon KDP para libros de colorear infantiles y educativos.',
  },
  '8.5x8.5': {
    id: '8.5x8.5',
    label: '8.5 × 8.5" (Cuadrado Bold & Easy)',
    widthIn: 8.5,
    heightIn: 8.5,
    widthPx300: 2550,
    heightPx300: 2550,
    note: 'Formato viral estilo Coco Wyo / Cozy Coloring para jóvenes y adultos.',
  },
  '6x9': {
    id: '6x9',
    label: '6 × 9" (Compacto de Viaje)',
    widthIn: 6,
    heightIn: 9,
    widthPx300: 1800,
    heightPx300: 2700,
    note: 'Tamaño de bolsillo ideal para cuadernos de actividades y mandalas portátiles.',
  },
  a4: {
    id: 'a4',
    label: 'A4 (210 × 297 mm • Impresora Casa)',
    widthIn: 8.27,
    heightIn: 11.69,
    widthPx300: 2480,
    heightPx300: 3508,
    note: 'Estándar internacional para impresión escolar y doméstica en Perú y Europa.',
  },
};

export interface LineArtOptions {
  /** 0..255 luminance cutoff. Pixels below become pure black, above become pure white. */
  threshold: number;
  /** Reinforce black strokes slightly (0 = none, 1 = light thicken, 2 = bold). */
  boldness: 0 | 1 | 2;
  /** Draw a clean crisp rectangular KDP frame around the illustration. */
  addFrame: boolean;
  /** Optional caption at bottom inside safe margin. */
  caption?: string;
  /** Clean background smudges by pushing light grays to pure white. */
  pureBlackWhite: boolean;
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo decodificar la imagen seleccionada.'));
    img.src = src;
  });
}

/**
 * Convierte cualquier imagen (IA o subida por el usuario) en un PNG limpio a 300 DPI reales
 * con fondo blanco puro (#FFFFFF) y trazos negros nítidos (#000000), listo para impresión o KDP.
 */
export async function processImageToLineArt300Dpi(
  src: string,
  trim: KdpTrimSize,
  options: LineArtOptions,
  previewScale = 1
): Promise<string> {
  const spec = KDP_TRIM_SPECS[trim];
  const targetW = Math.round(spec.widthPx300 * previewScale);
  const targetH = Math.round(spec.heightPx300 * previewScale);

  const img = await loadImageElement(src);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Contexto Canvas 2D no disponible.');

  // Fondo blanco puro para evitar tonos crema o grises al imprimir
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetW, targetH);

  // Márgenes de seguridad KDP (0.55 in interior aproximado)
  const padX = Math.round(targetW * 0.075);
  const padTop = Math.round(targetH * 0.065);
  const padBottom = options.caption?.trim() ? Math.round(targetH * 0.11) : Math.round(targetH * 0.065);

  const boxW = targetW - padX * 2;
  const boxH = targetH - padTop - padBottom;

  // Ajuste proporcional 'contain'
  const imgRatio = img.width / img.height;
  const boxRatio = boxW / boxH;
  let drawW = boxW;
  let drawH = boxH;
  if (imgRatio > boxRatio) {
    drawH = Math.round(boxW / imgRatio);
  } else {
    drawW = Math.round(boxH * imgRatio);
  }
  const drawX = Math.round(padX + (boxW - drawW) / 2);
  const drawY = Math.round(padTop + (boxH - drawH) / 2);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // Limpieza Line-Art a blanco y negro puro (#000000 / #FFFFFF)
  if (options.pureBlackWhite) {
    const imgData = ctx.getImageData(drawX, drawY, drawW, drawH);
    const data = imgData.data;
    const cutoff = options.threshold;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 20) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
        continue;
      }
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Suavizado mínimo antialiasing cerca del umbral para bordes limpios sin dientes de sierra
      let val = 255;
      if (lum < cutoff - 18) {
        val = 0;
      } else if (lum < cutoff + 18) {
        val = Math.round(((lum - (cutoff - 18)) / 36) * 255);
      }
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    // Engrosado suave opcional de trazos negros (erosión morfológica 1px/2px)
    if (options.boldness > 0) {
      const copy = new Uint8ClampedArray(data);
      const radius = options.boldness;
      const w = drawW;
      const h = drawH;
      for (let y = radius; y < h - radius; y++) {
        for (let x = radius; x < w - radius; x++) {
          const idx = (y * w + x) * 4;
          if (copy[idx] < 60) continue;
          let minNeighbor = copy[idx];
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nIdx = ((y + dy) * w + (x + dx)) * 4;
              if (copy[nIdx] < minNeighbor) minNeighbor = copy[nIdx];
            }
          }
          if (minNeighbor < 50) {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
          }
        }
      }
    }

    ctx.putImageData(imgData, drawX, drawY);
  }

  // Marco limpio KDP opcional
  if (options.addFrame) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(3, Math.round(targetW * 0.0045));
    const fx = Math.round(targetW * 0.055);
    const fy = Math.round(targetH * 0.048);
    const fw = targetW - fx * 2;
    const fh = targetH - fy * 2;
    const r = Math.round(targetW * 0.02);
    ctx.beginPath();
    ctx.roundRect(fx, fy, fw, fh, r);
    ctx.stroke();
  }

  // Título inferior opcional dentro del margen seguro
  if (options.caption?.trim()) {
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = Math.max(16, Math.round(targetW * 0.028));
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(options.caption.trim(), targetW / 2, targetH - Math.round(targetH * 0.072));
  }

  return canvas.toDataURL('image/png');
}

