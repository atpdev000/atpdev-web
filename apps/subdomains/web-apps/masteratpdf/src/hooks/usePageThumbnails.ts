'use client';

import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';
import { MAX_FILE_MB } from '@/lib/files';

export type Page = {
    id: string;
    file: File;
    pageIndex: number; // 0-based
    thumbnail: string;
    isReplaced?: boolean;
    isInserted?: boolean;
    sourceFileName?: string;
};

export function usePageThumbnails() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback(async (files: File[]) => {
        if (files.length === 0) return;

        setError(null);
        setLoading(true);
        setLoadingProgress(0);
        const newPages: Page[] = [];

        const file = files[0];
        setOriginalFile(file);

        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            setError(`El archivo supera el límite de ${MAX_FILE_MB}MB.`);
            setLoading(false);
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const doc = await loadPdfDocument(buffer);
            const totalPages = doc.numPages;

            for (let i = 0; i < totalPages; i++) {
                const page = await doc.getPage(i + 1);
                const viewport = page.getViewport({ scale: 0.25 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: ctx, viewport } as any).promise;

                newPages.push({
                    id: `${file.name}-${i}-${Math.random().toString(36).slice(2, 7)}`,
                    file,
                    pageIndex: i,
                    thumbnail: canvas.toDataURL('image/jpeg', 0.8),
                    sourceFileName: file.name,
                });

                const progress = Math.round(((i + 1) / totalPages) * 100);
                setLoadingProgress(progress);
            }

            setPages(newPages);
        } catch (err: any) {
            console.error('Error loading PDF:', err);
            const msg = err?.message || 'Error al procesar el documento PDF. Comprueba que el archivo sea válido.';
            setError(`Error al cargar el documento: ${msg}`);
        } finally {
            setLoading(false);
            setLoadingProgress(0);
        }
    }, []);

    // ➕ Insertar páginas desde otro PDF (al final o en una posición específica)
    const insertPagesFromPdf = useCallback(async (file: File, insertAfterIndex?: number) => {
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            setError(`El archivo a insertar supera el límite de ${MAX_FILE_MB}MB.`);
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const buffer = await file.arrayBuffer();
            const doc = await loadPdfDocument(buffer);
            const totalPages = doc.numPages;
            const newInsertedPages: Page[] = [];

            for (let i = 0; i < totalPages; i++) {
                const page = await doc.getPage(i + 1);
                const viewport = page.getViewport({ scale: 0.25 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: ctx, viewport } as any).promise;

                newInsertedPages.push({
                    id: `inserted-${file.name}-${i}-${Math.random().toString(36).slice(2, 7)}`,
                    file,
                    pageIndex: i,
                    thumbnail: canvas.toDataURL('image/jpeg', 0.8),
                    isInserted: true,
                    sourceFileName: file.name,
                });
            }

            setPages((prev) => {
                if (typeof insertAfterIndex === 'number') {
                    if (insertAfterIndex === -1) {
                        // Insert at the beginning
                        return [...newInsertedPages, ...prev];
                    }
                    if (insertAfterIndex >= 0 && insertAfterIndex < prev.length) {
                        const before = prev.slice(0, insertAfterIndex + 1);
                        const after = prev.slice(insertAfterIndex + 1);
                        return [...before, ...newInsertedPages, ...after];
                    }
                }
                // Default: append to the end
                return [...prev, ...newInsertedPages];
            });
        } catch (err: any) {
            console.error('Error inserting pages from PDF:', err);
            setError(`Error al insertar páginas: ${err?.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔄 Reemplazar una página específica por una página de otro PDF
    const replacePage = useCallback((pageId: string, newFile: File, newPageIndex: number, newThumbnail: string) => {
        setPages((prev) =>
            prev.map((p) => {
                if (p.id === pageId) {
                    return {
                        ...p,
                        file: newFile,
                        pageIndex: newPageIndex,
                        thumbnail: newThumbnail,
                        isReplaced: true,
                        sourceFileName: newFile.name,
                    };
                }
                return p;
            })
        );
    }, []);

    // 🔀 Mover página arrastrando (drag & drop)
    const movePage = useCallback((activeId: string, overId: string) => {
        setPages((prev) => {
            const oldIndex = prev.findIndex((p) => p.id === activeId);
            const newIndex = prev.findIndex((p) => p.id === overId);
            return arrayMove(prev, oldIndex, newIndex);
        });
    }, []);

    // 🎯 Mover página directamente a un índice numérico específico (0-based)
    const movePageToIndex = useCallback((pageId: string, targetIndex: number) => {
        setPages((prev) => {
            const currentIndex = prev.findIndex((p) => p.id === pageId);
            if (currentIndex === -1) return prev;
            const clampedIndex = Math.max(0, Math.min(prev.length - 1, targetIndex));
            return arrayMove(prev, currentIndex, clampedIndex);
        });
    }, []);

    // 📦 Mover lote de páginas seleccionadas en bloque a una posición de destino (1-based)
    const moveBatchToPosition = useCallback((pageIds: Set<string>, target1Based: number) => {
        setPages((prev) => {
            const selected = prev.filter((p) => pageIds.has(p.id));
            const remaining = prev.filter((p) => !pageIds.has(p.id));
            if (selected.length === 0) return prev;

            const insertIndex = Math.max(0, Math.min(remaining.length, target1Based - 1));
            return [
                ...remaining.slice(0, insertIndex),
                ...selected,
                ...remaining.slice(insertIndex),
            ];
        });
    }, []);

    const clearPages = useCallback(() => {
        setPages([]);
        setOriginalFile(null);
        setError(null);
    }, []);

    return {
        pages,
        setPages,
        loading,
        loadingProgress,
        addFiles,
        insertPagesFromPdf,
        replacePage,
        movePage,
        movePageToIndex,
        moveBatchToPosition,
        clearPages,
        originalFile,
        error,
        setError,
    };
}
