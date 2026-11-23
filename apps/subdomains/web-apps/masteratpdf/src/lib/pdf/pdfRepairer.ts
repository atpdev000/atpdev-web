import { PDFDocument } from 'pdf-lib';
import { getBackendUrl } from './backendClient';

export interface RepairResult {
    pdfBytes: Uint8Array;
    repairedPages: number;
    engine: 'client' | 'server';
    details: string;
}

/**
 * Repairs a damaged, corrupted, or unreadable PDF document.
 * Prioritizes server-side PyMuPDF deep XRef/stream repair when available,
 * with local pdf-lib reconstruction fallback.
 */
export async function repairPdfDocument(file: File): Promise<RepairResult> {
    // 1. Try server-side PyMuPDF deep repair first
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${getBackendUrl()}/api/convert/repair`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const pagesHeader = Number(res.headers.get('X-Pages-Recovered') || '0');
            const engineHeader = res.headers.get('X-Repair-Engine') || 'pymupdf';
            const blob = await res.blob();
            const arrayBuf = await blob.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuf);
            let pageCount = pagesHeader;
            if (!pageCount) {
                try {
                    const loaded = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                    pageCount = loaded.getPageCount();
                } catch {
                    pageCount = 1;
                }
            }
            return {
                pdfBytes,
                repairedPages: pageCount,
                engine: 'server',
                details: `Reparación profunda de streams y XRef completada (${engineHeader}, ${pageCount} páginas recuperadas).`,
            };
        }
    } catch {
        // Backend offline -> try client reconstruction
    }

    // 2. Local PDF-Lib structural reconstruction fallback
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
            updateMetadata: false,
        });

        const cleanDoc = await PDFDocument.create();
        const pageCount = pdfDoc.getPageCount();
        const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
        const copiedPages = await cleanDoc.copyPages(pdfDoc, pageIndices);

        for (const p of copiedPages) {
            cleanDoc.addPage(p);
        }

        const savedBytes = await cleanDoc.save();
        return {
            pdfBytes: savedBytes,
            repairedPages: pageCount,
            engine: 'client',
            details: `Estructura XRef y árbol de páginas reconstruidos localmente (${pageCount} páginas recuperadas).`,
        };
    } catch (clientErr) {
        console.warn('Client repair failed:', clientErr);
    }

    throw new Error(
        'El archivo PDF está severamente dañado y no se pudo recuperar automáticamente.'
    );
}
