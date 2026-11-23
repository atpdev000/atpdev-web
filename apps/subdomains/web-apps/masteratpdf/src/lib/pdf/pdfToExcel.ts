'use client';

import * as XLSX from 'xlsx';
import { loadPdfDocument, formatPdfError, extractPdfTextItems } from './pdfHelper';

export interface PdfToExcelOptions {
    mode?: 'single-sheet' | 'multi-sheet';
    onProgress?: (percent: number, message: string) => void;
}

interface TextItem {
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function parseCell(raw: string): string | number {
    const trimmed = raw.trim();
    const clean = trimmed.replace(/,/g, '');
    if (/^-?\d+(\.\d+)?$/.test(clean) && clean.length < 15) {
        const num = Number(clean);
        if (!Number.isNaN(num)) return num;
    }
    return trimmed;
}

/**
 * Extracts tabular text from PDF pages using page-wide column anchor clustering.
 */
export async function convertPdfToExcel(
    file: File,
    options: PdfToExcelOptions = {}
): Promise<{ blob: Blob; fileName: string; totalSheets: number; totalRows: number }> {
    const { mode = 'single-sheet', onProgress } = options;

    try {
        onProgress?.(10, 'Cargando documento PDF...');
        const buffer = await file.arrayBuffer();
        const pdfDoc = await loadPdfDocument(buffer);
        const numPages = pdfDoc.numPages;

        const workbook = XLSX.utils.book_new();
        let totalRowsCount = 0;
        const allPagesRows: (string | number)[][] = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const progress = 10 + Math.round(((pageNum - 0.5) / numPages) * 75);
            onProgress?.(progress, `Analizando tablas y columnas de la página ${pageNum} de ${numPages}...`);

            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();

            const rawItems: TextItem[] = [];
            for (const item of extractPdfTextItems(textContent.items)) {
                if (!item.str || item.str.trim() === '') continue;
                rawItems.push({
                    str: item.str,
                    x: Math.round(item.transform[4] * 10) / 10,
                    y: Math.round(item.transform[5] * 10) / 10,
                    width: item.width || 0,
                    height: item.height || 0,
                });
            }

            if (rawItems.length === 0) continue;

            // Agrupar filas por coordenada Y
            rawItems.sort((a, b) => b.y - a.y);
            const lineGroups: { y: number; items: TextItem[] }[] = [];
            const yTolerance = 4;

            for (const item of rawItems) {
                let placed = false;
                for (const group of lineGroups) {
                    if (Math.abs(group.y - item.y) <= yTolerance) {
                        group.items.push(item);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    lineGroups.push({ y: item.y, items: [item] });
                }
            }

            // Detectar anclas de columna globales en toda la página para alinear celdas verticalmente
            const sortedXs = [...rawItems].map((i) => i.x).sort((a, b) => a - b);
            const colAnchors: number[] = [];
            for (const x of sortedXs) {
                if (colAnchors.length === 0 || x - colAnchors[colAnchors.length - 1] > 28) {
                    colAnchors.push(x);
                }
            }

            const pageRows: (string | number)[][] = [];
            for (const line of lineGroups) {
                line.items.sort((a, b) => a.x - b.x);

                if (colAnchors.length <= 1) {
                    pageRows.push([parseCell(line.items.map((i) => i.str).join(' '))]);
                    continue;
                }

                const buckets = new Map<number, string[]>();
                let maxCol = 0;
                for (const item of line.items) {
                    let bestCol = 0;
                    let bestDist = Infinity;
                    for (let c = 0; c < colAnchors.length; c++) {
                        const dist = Math.abs(colAnchors[c] - item.x);
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestCol = c;
                        }
                    }
                    if (!buckets.has(bestCol)) buckets.set(bestCol, []);
                    buckets.get(bestCol)!.push(item.str);
                    if (bestCol > maxCol) maxCol = bestCol;
                }

                const row: (string | number)[] = [];
                for (let c = 0; c <= maxCol; c++) {
                    const parts = buckets.get(c);
                    row.push(parts ? parseCell(parts.join(' ')) : '');
                }
                if (row.some((cell) => cell !== '')) {
                    pageRows.push(row);
                }
            }

            totalRowsCount += pageRows.length;

            if (mode === 'multi-sheet') {
                const worksheet = XLSX.utils.aoa_to_sheet(pageRows);
                worksheet['!cols'] = calculateColumnWidths(pageRows);
                XLSX.utils.book_append_sheet(workbook, worksheet, `Página ${pageNum}`);
            } else {
                if (numPages > 1) {
                    allPagesRows.push([`--- PÁGINA ${pageNum} ---`]);
                }
                allPagesRows.push(...pageRows);
            }
        }

        if (mode === 'single-sheet') {
            const rowsToWrite = allPagesRows.length > 0 ? allPagesRows : [['No se detectó texto seleccionable en el documento.']];
            const worksheet = XLSX.utils.aoa_to_sheet(rowsToWrite);
            worksheet['!cols'] = calculateColumnWidths(rowsToWrite);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos PDF');
        } else if (workbook.SheetNames.length === 0) {
            const worksheet = XLSX.utils.aoa_to_sheet([['No se detectó texto seleccionable en el documento.']]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Página 1');
        }

        onProgress?.(90, 'Generando archivo Excel (.xlsx)...');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
            compression: true,
        });

        onProgress?.(100, '¡Archivo Excel listo!');
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const baseName = file.name.replace(/\.pdf$/i, '');
        return {
            blob,
            fileName: `${baseName}.xlsx`,
            totalSheets: workbook.SheetNames.length,
            totalRows: totalRowsCount,
        };
    } catch (err) {
        throw new Error(formatPdfError(err, 'No se pudo convertir el PDF a Excel.'));
    }
}

function calculateColumnWidths(rows: (string | number)[][]): { wch: number }[] {
    const colWidths: number[] = [];
    for (const row of rows) {
        row.forEach((cell, colIdx) => {
            const strVal = String(cell ?? '');
            const len = Math.min(50, Math.max(10, strVal.length + 3));
            colWidths[colIdx] = Math.max(colWidths[colIdx] || 10, len);
        });
    }
    return colWidths.map((wch) => ({ wch }));
}
