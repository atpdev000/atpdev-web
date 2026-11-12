import { PDFDocument } from 'pdf-lib';

export interface RepairResult {
    pdfBytes: Uint8Array;
    repairedPages: number;
    engine: 'client' | 'server';
    details: string;
}

/**
 * Repairs a damaged, corrupted, or unreadable PDF document.
 */
export async function repairPdfDocument(file: File): Promise<RepairResult> {
    // 1. Try local PDF-Lib structural reconstruction
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
            updateMetadata: false,
        });

        // Create a pristine new document and copy over all recoverable pages
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
            details: `Estructura XREF y árbol de páginas reconstruidos con éxito (${pageCount} páginas recuperadas).`,
        };
    } catch (clientErr) {
        console.warn('Client repair failed, attempting server backend repair:', clientErr);
    }

    // 2. Try server-side PyMuPDF repair if backend is active
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:8000/api/convert/repair', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const blob = await res.blob();
            const arrayBuf = await blob.arrayBuffer();
            return {
                pdfBytes: new Uint8Array(arrayBuf),
                repairedPages: 1,
                engine: 'server',
                details: 'Reparación profunda a nivel de streams de bajo nivel completada con PyMuPDF.',
            };
        }
    } catch {
        // backend offline
    }

    throw new Error(
        'El archivo PDF está severamente dañado y no se pudo recuperar de forma automática.'
    );
}
