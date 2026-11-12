import { PDFDocument } from 'pdf-lib';

export interface SignaturePlacement {
    pageIndex: number; // 0-based
    x: number; // percentage from left (0 to 1) or pt
    y: number; // percentage from bottom (0 to 1) or pt
    width: number; // percentage of page width or pt
    height: number; // percentage of page height or pt
    signatureDataUrl: string; // PNG base64 data url
}

/**
 * Places one or more signatures onto a PDF document.
 */
export async function applySignaturesToPdf(
    pdfBytes: ArrayBuffer,
    placements: SignaturePlacement[]
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    for (const p of placements) {
        if (p.pageIndex < 0 || p.pageIndex >= pages.length) continue;
        const page = pages[p.pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Convert base64 data url to bytes
        const base64Data = p.signatureDataUrl.split(',')[1] || p.signatureDataUrl;
        const binaryString = atob(base64Data);
        const imageBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            imageBytes[i] = binaryString.charCodeAt(i);
        }

        const isPng = p.signatureDataUrl.includes('image/png') || p.signatureDataUrl.startsWith('data:image/png');
        const embeddedImage = isPng
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        // Calculate absolute coordinates in PDF points (x from left, y from bottom)
        const absX = p.x <= 1 ? p.x * pageWidth : p.x;
        const absWidth = p.width <= 1 ? p.width * pageWidth : p.width;
        const absHeight = p.height <= 1 ? p.height * pageHeight : p.height;
        // In PDF coordinates, y=0 is at the bottom
        const absY = p.y <= 1 ? p.y * pageHeight : p.y;

        page.drawImage(embeddedImage, {
            x: Math.max(0, Math.min(pageWidth - absWidth, absX)),
            y: Math.max(0, Math.min(pageHeight - absHeight, absY)),
            width: absWidth,
            height: absHeight,
        });
    }

    return await pdfDoc.save();
}
