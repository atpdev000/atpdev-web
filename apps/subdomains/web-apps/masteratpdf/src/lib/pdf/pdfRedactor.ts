import { PDFDocument, rgb } from 'pdf-lib';

export interface RedactionBox {
    id: string;
    pageIndex: number; // 0-based
    // Coordinates normalized 0..1 relative to page preview
    x: number; // percentage from left
    y: number; // percentage from top in preview
    width: number;
    height: number;
}

/**
 * Permanently burns opaque black redaction rectangles onto a PDF.
 */
export async function applyRedactionsToPdf(
    pdfBytes: ArrayBuffer,
    redactions: RedactionBox[]
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    for (const r of redactions) {
        if (r.pageIndex < 0 || r.pageIndex >= pages.length) continue;
        const page = pages[r.pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Convert top-left based coords (preview) to bottom-left based coords (PDF points)
        const absX = r.x * pageWidth;
        const absWidth = r.width * pageWidth;
        const absHeight = r.height * pageHeight;
        // In PDF points, y is measured from bottom: bottomY = pageHeight - (topY + height)
        const absY = pageHeight - (r.y * pageHeight + absHeight);

        page.drawRectangle({
            x: Math.max(0, absX),
            y: Math.max(0, absY),
            width: Math.min(pageWidth - absX, absWidth),
            height: Math.min(pageHeight - absY, absHeight),
            color: rgb(0, 0, 0),
            opacity: 1.0,
        });
    }

    return await pdfDoc.save();
}
