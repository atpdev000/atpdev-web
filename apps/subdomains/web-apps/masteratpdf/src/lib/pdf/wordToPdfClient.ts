'use client';

import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

export interface ClientWordToPdfOptions {
    onProgress?: (percent: number, message: string) => void;
}

interface ParsedBlock {
    kind: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'table';
    text?: string;
    rows?: string[][];
}

function parseHtmlBlocks(html: string): ParsedBlock[] {
    if (typeof DOMParser === 'undefined') {
        return [{ kind: 'p', text: html.replace(/<[^>]+>/g, ' ').trim() }];
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const blocks: ParsedBlock[] = [];

    const walk = (el: Element) => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
            const text = (el.textContent || '').trim();
            if (text) blocks.push({ kind: tag, text });
            return;
        }
        if (tag === 'p') {
            const text = (el.textContent || '').trim();
            if (text) blocks.push({ kind: 'p', text });
            return;
        }
        if (tag === 'ul' || tag === 'ol') {
            el.querySelectorAll(':scope > li').forEach((li, idx) => {
                const text = (li.textContent || '').trim();
                if (text) {
                    const prefix = tag === 'ol' ? `${idx + 1}. ` : '• ';
                    blocks.push({ kind: 'li', text: `${prefix}${text}` });
                }
            });
            return;
        }
        if (tag === 'table') {
            const rows: string[][] = [];
            el.querySelectorAll('tr').forEach((tr) => {
                const cells: string[] = [];
                tr.querySelectorAll('th, td').forEach((cell) => {
                    cells.push((cell.textContent || '').replace(/\s+/g, ' ').trim());
                });
                if (cells.length > 0) rows.push(cells);
            });
            if (rows.length > 0) blocks.push({ kind: 'table', rows });
            return;
        }
        for (const child of Array.from(el.children)) {
            walk(child);
        }
    };

    for (const child of Array.from(doc.body.children)) {
        walk(child);
    }

    if (blocks.length === 0) {
        const fallback = (doc.body.textContent || '').trim();
        if (fallback) blocks.push({ kind: 'p', text: fallback });
    }
    return blocks;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        let width = 0;
        try {
            width = font.widthOfTextAtSize(test, fontSize);
        } catch {
            width = test.length * fontSize * 0.52;
        }
        if (width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = test;
        }
    }
    if (current) lines.push(current);
    return lines;
}

/**
 * Client-side fallback converter from Word (DOCX) to structured vector PDF.
 * Parses headings, lists, paragraphs, and tables via mammoth.convertToHtml + pdf-lib.
 */
export async function convertWordToPdfClient(
    file: File,
    options: ClientWordToPdfOptions = {}
): Promise<Blob> {
    const { onProgress } = options;

    onProgress?.(20, 'Analizando estructura, títulos y tablas del archivo Word…');
    const arrayBuffer = await file.arrayBuffer();

    let blocks: ParsedBlock[] = [];
    try {
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        blocks = parseHtmlBlocks(htmlResult.value || '');
    } catch {
        const raw = await mammoth.extractRawText({ arrayBuffer });
        blocks = (raw.value || '')
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
            .map((text) => ({ kind: 'p', text }));
    }

    onProgress?.(55, 'Maquetando documento PDF vectorial…');
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;

    let currentPage: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    const ensureSpace = (needed: number) => {
        if (currentY - needed < margin) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
        }
    };

    const drawSafe = (
        page: PDFPage,
        text: string,
        opts: { x: number; y: number; size: number; font: PDFFont; color: ReturnType<typeof rgb> }
    ) => {
        try {
            page.drawText(text, opts);
        } catch {
            // Reemplazar caracteres fuera de WinAnsi sin fallar
            const safe = text.replace(/[^\x20-\xFF]/g, '?');
            page.drawText(safe, opts);
        }
    };

    for (const block of blocks) {
        if (block.kind === 'table' && block.rows && block.rows.length > 0) {
            const colCount = Math.max(...block.rows.map((r) => r.length));
            const colW = maxWidth / colCount;
            const tableFontSize = 9.5;
            const rowPad = 5;

            for (let rIdx = 0; rIdx < block.rows.length; rIdx++) {
                const row = block.rows[rIdx];
                const isHeader = rIdx === 0;
                const cellFont = isHeader ? fontBold : fontRegular;
                const wrappedCells = row.map((cell) => wrapText(cell || '', cellFont, tableFontSize, colW - 8));
                const maxLines = Math.max(1, ...wrappedCells.map((c) => c.length));
                const rowHeight = maxLines * 13 + rowPad * 2;

                ensureSpace(rowHeight + 4);

                for (let cIdx = 0; cIdx < colCount; cIdx++) {
                    const cellX = margin + cIdx * colW;
                    const cellY = currentY - rowHeight;

                    currentPage.drawRectangle({
                        x: cellX,
                        y: cellY,
                        width: colW,
                        height: rowHeight,
                        borderColor: rgb(0.78, 0.82, 0.88),
                        borderWidth: 0.7,
                        color: isHeader ? rgb(0.95, 0.96, 0.98) : undefined,
                    });

                    const lines = wrappedCells[cIdx] || [];
                    lines.forEach((line, lIdx) => {
                        drawSafe(currentPage, line, {
                            x: cellX + 4,
                            y: currentY - rowPad - 10 - lIdx * 13,
                            size: tableFontSize,
                            font: cellFont,
                            color: rgb(0.12, 0.13, 0.18),
                        });
                    });
                }

                currentY -= rowHeight;
            }
            currentY -= 10;
            continue;
        }

        const text = block.text || '';
        if (!text) continue;

        const isHeading = block.kind === 'h1' || block.kind === 'h2' || block.kind === 'h3';
        const fontSize = block.kind === 'h1' ? 18 : block.kind === 'h2' ? 14 : block.kind === 'h3' ? 12 : 10.5;
        const lineHeight = fontSize * 1.45;
        const font = isHeading ? fontBold : fontRegular;
        const xOffset = block.kind === 'li' ? margin + 12 : margin;
        const availW = block.kind === 'li' ? maxWidth - 12 : maxWidth;

        if (isHeading) currentY -= 4;

        const lines = wrapText(text, font, fontSize, availW);
        for (const line of lines) {
            ensureSpace(lineHeight);
            drawSafe(currentPage, line, {
                x: xOffset,
                y: currentY,
                size: fontSize,
                font,
                color: rgb(0.1, 0.11, 0.15),
            });
            currentY -= lineHeight;
        }
        currentY -= isHeading ? 6 : 4;
    }

    onProgress?.(90, 'Generando archivo PDF final…');
    const pdfBytes = await pdfDoc.save();
    onProgress?.(100, '¡PDF generado con éxito!');

    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}
