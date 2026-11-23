'use client';

import { Document, Paragraph, TextRun, Packer, PageBreak, HeadingLevel } from 'docx';
import { loadPdfDocument, formatPdfError, extractPdfTextItems } from './pdfHelper';

export interface ClientDocxOptions {
    onProgress?: (percent: number, message: string) => void;
}

/**
 * Client-side fallback converter from PDF to DOCX using pdfjs-dist and docx library.
 */
export async function convertPdfToDocxClient(
    file: File,
    options: ClientDocxOptions = {}
): Promise<Blob> {
    const { onProgress } = options;

    try {
        onProgress?.(15, 'Cargando documento en el motor local…');
        const buffer = await file.arrayBuffer();
        const pdf = await loadPdfDocument(buffer);
        const numPages = pdf.numPages;

        const docParagraphs: Paragraph[] = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const percent = 20 + Math.round(((pageNum - 0.5) / numPages) * 70);
            onProgress?.(percent, `Extrayendo párrafos y tipografía de la página ${pageNum} de ${numPages}…`);

            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            const rawItems = extractPdfTextItems(textContent.items)
                .filter((item) => item.str && item.str.trim() !== '')
                .map((item) => ({
                    str: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    size: Math.round(Math.hypot(item.transform[0], item.transform[1])),
                }));

            if (rawItems.length === 0) continue;

            rawItems.sort((a, b) => b.y - a.y);

            const lines: { y: number; items: typeof rawItems }[] = [];
            const yTolerance = 5;

            for (const item of rawItems) {
                let placed = false;
                for (const line of lines) {
                    if (Math.abs(line.y - item.y) <= yTolerance) {
                        line.items.push(item);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    lines.push({ y: item.y, items: [item] });
                }
            }

            for (const line of lines) {
                line.items.sort((a, b) => a.x - b.x);
                const maxLineSize = Math.max(...line.items.map((i) => i.size));
                const fullLineText = line.items.map((i) => i.str).join(' ').trim();

                if (maxLineSize >= 17 && fullLineText.length < 120) {
                    docParagraphs.push(
                        new Paragraph({
                            text: fullLineText,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 160, after: 100 },
                        })
                    );
                    continue;
                }

                const runs: TextRun[] = line.items.map(
                    (item) =>
                        new TextRun({
                            text: item.str + ' ',
                            size: Math.max(18, Math.min(48, item.size * 2)),
                            bold: item.size >= 13,
                        })
                );

                if (runs.length > 0) {
                    docParagraphs.push(
                        new Paragraph({
                            children: runs,
                            spacing: { after: 120 },
                        })
                    );
                }
            }

            if (pageNum < numPages) {
                docParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
            }
        }

        onProgress?.(92, 'Empaquetando documento Word (.docx)…');
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children:
                        docParagraphs.length > 0
                            ? docParagraphs
                            : [new Paragraph({ text: 'Documento PDF sin texto seleccionable (usa OCR PDF si es un escaneo).' })],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        onProgress?.(100, '¡Documento DOCX generado!');
        return blob;
    } catch (err) {
        throw new Error(formatPdfError(err, 'No se pudo convertir el PDF a Word.'));
    }
}
