import { PDFDocument } from 'pdf-lib';

export interface CropMargins {
    topPercent: number; // 0 to 45
    bottomPercent: number; // 0 to 45
    leftPercent: number; // 0 to 45
    rightPercent: number; // 0 to 45
}

/**
 * Trims margins of a PDF document using CropBox and MediaBox.
 */
export async function cropPdfMargins(
    pdfBytes: ArrayBuffer,
    margins: CropMargins,
    pageIndices?: number[] // if omitted, applies to all pages
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const targets = new Set(pageIndices ?? pages.map((_, i) => i));

    for (let i = 0; i < pages.length; i++) {
        if (!targets.has(i)) continue;
        const page = pages[i];
        const { width, height } = page.getSize();

        const trimLeft = (margins.leftPercent / 100) * width;
        const trimRight = (margins.rightPercent / 100) * width;
        const trimTop = (margins.topPercent / 100) * height;
        const trimBottom = (margins.bottomPercent / 100) * height;

        const newX = trimLeft;
        const newY = trimBottom;
        const newWidth = Math.max(10, width - trimLeft - trimRight);
        const newHeight = Math.max(10, height - trimTop - trimBottom);

        page.setCropBox(newX, newY, newWidth, newHeight);
        page.setMediaBox(newX, newY, newWidth, newHeight);
    }

    return await pdfDoc.save();
}
