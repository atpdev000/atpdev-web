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
