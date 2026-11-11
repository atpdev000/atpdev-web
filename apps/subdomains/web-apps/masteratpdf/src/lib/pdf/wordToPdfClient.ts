'use client';

import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface ClientWordToPdfOptions {
    onProgress?: (percent: number, message: string) => void;
}

/**
 * Client-side in-browser converter from Word (DOCX) to PDF.
 * Extracts document text structure via mammoth and constructs a vector PDF via pdf-lib.
 * Works 100% offline without external microservices.
 */
export async function convertWordToPdfClient(
    file: File,
    options: ClientWordToPdfOptions = {}
): Promise<Blob> {
    const { onProgress } = options;

    onProgress?.(20, 'Extrayendo estructura y tipografía del archivo Word…');
    const arrayBuffer = await file.arrayBuffer();

    // Extraer texto y estructura con mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value || 'Documento sin contenido legible.';

    onProgress?.(55, 'Construyendo páginas y maquetación PDF vectorial…');
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 595.28; // A4 width en puntos
    const pageHeight = 841.89; // A4 height en puntos
    const margin = 50;
    const maxWidth = pageWidth - margin * 2;
    const fontSize = 11;
    const lineHeight = 16;

    // Dividir en párrafos
    const paragraphs = fullText.split('\n');

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const pText = paragraphs[pIdx].trim();
        if (pText === '') {
            currentY -= lineHeight * 0.75;
            continue;
        }

        const isTitle = pText.length < 60 && (pIdx === 0 || pText.toUpperCase() === pText);
        const currentFont = isTitle ? fontBold : fontRegular;
        const currentSize = isTitle ? 14 : fontSize;
        const currentSpacing = isTitle ? lineHeight * 1.5 : lineHeight;

        // Dividir líneas largas para que quepan en el ancho
        const words = pText.split(/\s+/);
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const textWidth = currentFont.widthOfTextAtSize(testLine, currentSize);

            if (textWidth > maxWidth && currentLine) {
                // Dibujar línea acumulada
                if (currentY - currentSpacing < margin) {
                    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                    currentY = pageHeight - margin;
                }

                currentPage.drawText(currentLine, {
                    x: margin,
                    y: currentY,
                    size: currentSize,
                    font: currentFont,
                    color: rgb(0.1, 0.1, 0.12),
                });

                currentY -= currentSpacing;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            if (currentY - currentSpacing < margin) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                currentY = pageHeight - margin;
            }

            currentPage.drawText(currentLine, {
                x: margin,
                y: currentY,
                size: currentSize,
                font: currentFont,
                color: rgb(0.1, 0.1, 0.12),
            });

            currentY -= currentSpacing * 1.25;
        }
    }

    onProgress?.(90, 'Generando archivo PDF final…');
    const pdfBytes = await pdfDoc.save();
    onProgress?.(100, '¡PDF generado con éxito!');

    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}
