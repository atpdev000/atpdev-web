'use client';

import { Document, Paragraph, TextRun, Packer, PageBreak } from 'docx';
import { loadPdfDocument } from './pdfHelper';

export interface ClientDocxOptions {
    onProgress?: (percent: number, message: string) => void;
}

/**
 * Client-side in-browser converter from PDF to DOCX using pdfjs-dist and docx library.
 * Works 100% offline without external microservices.
 */
export async function convertPdfToDocxClient(
    file: File,
    options: ClientDocxOptions = {}
): Promise<Blob> {
    const { onProgress } = options;

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

        // Extraer items de texto con posición
        const rawItems = (textContent.items as any[])
            .filter((item) => item.str && item.str.trim() !== '')
            .map((item) => ({
                str: item.str,
                x: item.transform[4],
                y: item.transform[5],
                size: Math.round(Math.hypot(item.transform[0], item.transform[1])),
            }));

        if (rawItems.length === 0) continue;

        // Ordenar de arriba a abajo por Y (con tolerancia de 4 puntos)
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

        // Construir párrafos en el DOCX
        for (const line of lines) {
            line.items.sort((a, b) => a.x - b.x);

            const runs: TextRun[] = [];
            for (const item of line.items) {
                const isHeading = item.size >= 16;
                const isSubheading = item.size >= 13 && item.size < 16;

                runs.push(
                    new TextRun({
                        text: item.str + ' ',
                        size: Math.max(18, item.size * 2), // docx usa medios puntos (pt * 2)
                        bold: isHeading || isSubheading,
                    })
                );
            }

            if (runs.length > 0) {
                docParagraphs.push(
                    new Paragraph({
                        children: runs,
                        spacing: { after: 120 },
                    })
                );
            }
        }

        // Si no es la última página, insertar salto de página
        if (pageNum < numPages) {
            docParagraphs.push(
                new Paragraph({
                    children: [new PageBreak()],
                })
            );
        }
    }

    onProgress?.(92, 'Empaquetando documento Word (.docx)…');

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: docParagraphs.length > 0 ? docParagraphs : [new Paragraph({ text: 'Documento PDF sin texto seleccionable.' })],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    onProgress?.(100, '¡Documento DOCX generado!');

    return blob;
}
