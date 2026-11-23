'use client';

// Helper to reliably initialize pdfjs-dist on client side
let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

export const PDFJS_VERSION = '5.7.284';

export async function getPdfJs(): Promise<typeof import('pdfjs-dist')> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be loaded on client-side');
  }

  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      const origin = window.location.origin;
      pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/pdf.worker.min.mjs?v=${PDFJS_VERSION}`;
      return pdfjs;
    })();
  }

  return pdfjsPromise;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array) {
  const pdfjs = await getPdfJs();
  const uint8Data = data instanceof Uint8Array ? data : new Uint8Array(data);

  return pdfjs.getDocument({
    data: uint8Data,
    cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
  }).promise;
}

export function formatPdfError(err: unknown, fallback = 'No se pudo procesar el archivo PDF.'): string {
  const msg = err instanceof Error ? err.message : String(err || '');
  const lower = msg.toLowerCase();
  if (
    lower.includes('password') ||
    lower.includes('encrypted') ||
    lower.includes('no password given')
  ) {
    return 'Este PDF está protegido con contraseña. Desbloquéalo primero con la herramienta "Desbloquear PDF".';
  }
  if (lower.includes('invalid pdf') || lower.includes('corrupt') || lower.includes('xref')) {
    return 'El archivo PDF parece estar dañado o tiene una estructura inválida. Prueba repararlo en "Reparar PDF".';
  }
  return msg || fallback;
}

export interface PdfTextChunk {
  str: string;
  transform: number[];
  width: number;
  height: number;
}

export function extractPdfTextItems(items: readonly unknown[]): PdfTextChunk[] {
  const result: PdfTextChunk[] = [];
  for (const item of items) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'str' in item &&
      typeof (item as { str?: unknown }).str === 'string' &&
      'transform' in item &&
      Array.isArray((item as { transform?: unknown }).transform)
    ) {
      const candidate = item as { str: string; transform: number[]; width?: unknown; height?: unknown };
      result.push({
        str: candidate.str,
        transform: candidate.transform,
        width: typeof candidate.width === 'number' ? candidate.width : 0,
        height: typeof candidate.height === 'number' ? candidate.height : 0,
      });
    }
  }
  return result;
}
