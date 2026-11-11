'use client';

import * as XLSX from 'xlsx';
import { loadPdfDocument } from './pdfHelper';

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

/**
 * Extracts tabular text from PDF pages and creates an Excel (.xlsx) workbook.
 * Runs 100% in-browser via WebAssembly / PDF.js & SheetJS.
 */
export async function convertPdfToExcel(
    file: File,
    options: PdfToExcelOptions = {}
): Promise<{ blob: Blob; fileName: string; totalSheets: number; totalRows: number }> {
    const { mode = 'single-sheet', onProgress } = options;

    onProgress?.(10, 'Cargando documento PDF...');
    const buffer = await file.arrayBuffer();
    const pdfDoc = await loadPdfDocument(buffer);
    const numPages = pdfDoc.numPages;

    const workbook = XLSX.utils.book_new();
    let totalRowsCount = 0;
    const allPagesRows: (string | number)[][] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const progress = 10 + Math.round(((pageNum - 0.5) / numPages) * 75);
        onProgress?.(progress, `Analizando tablas y celdas de la página ${pageNum} de ${numPages}...`);

        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extraer items con coordenadas
        const rawItems: TextItem[] = [];
        for (const item of textContent.items as any[]) {
            if (!item.str || item.str.trim() === '') continue;
            rawItems.push({
                str: item.str,
                x: Math.round(item.transform[4] * 10) / 10,
                y: Math.round(item.transform[5] * 10) / 10,
                width: item.width || 0,
                height: item.height || 0,
            });
        }

        // Si la página está vacía
        if (rawItems.length === 0) {
            continue;
        }

        // Agrupar por líneas (coordenada Y con tolerancia de 4 puntos)
        rawItems.sort((a, b) => b.y - a.y); // De arriba hacia abajo

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

        // Ordenar cada fila de izquierda a derecha por coordenada X
        const pageRows: (string | number)[][] = [];

        for (const line of lineGroups) {
            line.items.sort((a, b) => a.x - b.x);

            // Reconstruir celdas: si el espacio entre palabras es grande, es una nueva columna
            const cells: string[] = [];
            let currentCell = '';
            let prevItem: TextItem | null = null;
            const columnGapThreshold = 18; // Distancia para considerar una columna separada

            for (const item of line.items) {
                if (!prevItem) {
                    currentCell = item.str;
                } else {
                    const gap = item.x - (prevItem.x + prevItem.width);
                    if (gap > columnGapThreshold) {
                        cells.push(currentCell.trim());
                        currentCell = item.str;
                    } else {
                        // Concatenar texto en la misma celda con espacio
                        currentCell += (gap > 2 ? ' ' : '') + item.str;
                    }
                }
                prevItem = item;
            }

            if (currentCell.trim() !== '') {
                cells.push(currentCell.trim());
            }

            if (cells.length > 0) {
                // Convertir números limpios a tipo number de Excel
                const typedCells = cells.map((cell) => {
                    const clean = cell.replace(/,/g, '');
                    if (/^-?\d+(\.\d+)?$/.test(clean) && clean.length < 15) {
                        const num = Number(clean);
                        if (!isNaN(num)) return num;
                    }
                    return cell;
                });
                pageRows.push(typedCells);
            }
        }

        totalRowsCount += pageRows.length;

        if (mode === 'multi-sheet') {
            const worksheet = XLSX.utils.aoa_to_sheet(pageRows);
            // Auto-dimensionar columnas
            worksheet['!cols'] = calculateColumnWidths(pageRows);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Página ${pageNum}`);
        } else {
            // En modo single sheet agregamos separador si hay múltiples páginas
            if (numPages > 1) {
                allPagesRows.push([`--- PÁGINA ${pageNum} ---`]);
            }
            allPagesRows.push(...pageRows);
        }
    }

    if (mode === 'single-sheet') {
        const worksheet = XLSX.utils.aoa_to_sheet(allPagesRows);
        worksheet['!cols'] = calculateColumnWidths(allPagesRows);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos PDF');
    }

    onProgress?.(90, 'Generando archivo Excel (.xlsx)...');

    // Escribir a array buffer
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
    const fileName = `${baseName}.xlsx`;
    const totalSheets = workbook.SheetNames.length;

    return {
        blob,
        fileName,
        totalSheets,
        totalRows: totalRowsCount,
    };
}

/**
 * Calcula el ancho óptimo de columnas en base a la longitud del contenido
 */
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
