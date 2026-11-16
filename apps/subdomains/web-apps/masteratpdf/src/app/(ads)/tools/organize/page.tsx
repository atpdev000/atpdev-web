'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { 
    RotateCw, 
    RotateCcw, 
    Trash2, 
    RefreshCw, 
    Plus, 
    Upload, 
    X, 
    Check, 
    FileText, 
    ArrowRightLeft, 
    ArrowUpDown, 
    ChevronsLeft, 
    ChevronsRight, 
    CheckSquare, 
    Square, 
    ListFilter, 
    Layers 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { usePageThumbnails, Page } from '@/hooks/usePageThumbnails';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { SortableThumb } from '@/components/tool/ThumbCard';
import { 
    ProcessingView, 
    DownloadView, 
    PdfLoadingOverlay 
} from '@/components/tool/FlowViews';
import { PageZoomModal } from '@/components/tool/PageZoomModal';

export default function OrganizePage() {
    const tool = getTool('organize');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const {
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
        error: thumbError,
    } = usePageThumbnails();

    const [rotations, setRotations] = useState<{ [pageId: string]: number }>({});
    const [deletedPages, setDeletedPages] = useState<Set<string>>(new Set());
    const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
    const [zoomedPageIndex, setZoomedPageIndex] = useState<number | null>(null);

    // Mover página individual modal state
    const [movingSingleTarget, setMovingSingleTarget] = useState<{ page: Page; currentIndex: number } | null>(null);
    const [singleTargetPositionInput, setSingleTargetPositionInput] = useState<number | string>(1);

    // Mover conjunto / lote de páginas modal state
    const [movingBatchOpen, setMovingBatchOpen] = useState<boolean>(false);
    const [batchTargetPositionInput, setBatchTargetPositionInput] = useState<number | string>(1);

    // Seleccionar por rango modal state
    const [showRangeModal, setShowRangeModal] = useState<boolean>(false);
    const [rangeFrom, setRangeFrom] = useState<number | string>(1);
    const [rangeTo, setRangeTo] = useState<number | string>(5);

    // Insertar páginas modal state
    const [showInsertModal, setShowInsertModal] = useState<boolean>(false);
    const [insertFileToProcess, setInsertFileToProcess] = useState<File | null>(null);
    const [insertSpecificPosition, setInsertSpecificPosition] = useState<boolean>(false);
    const [insertPositionType, setInsertPositionType] = useState<'start' | 'after_page' | 'end'>('end');
    const [insertAfterPageNumber, setInsertAfterPageNumber] = useState<number | string>(1);
    const insertInputRef = useRef<HTMLInputElement>(null);

    // Replace modal state
    const [replacingTarget, setReplacingTarget] = useState<Page | null>(null);
    const [replacementFile, setReplacementFile] = useState<File | null>(null);
    const [replacementDocPages, setReplacementDocPages] = useState<{ pageIndex: number; thumbnail: string }[]>([]);
    const [selectedReplacementIndex, setSelectedReplacementIndex] = useState<number>(0);
    const [loadingReplacement, setLoadingReplacement] = useState<boolean>(false);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleUploadInitial = (files: File[]) => {
        const { valid, errors } = validateFiles(files, {
            accept: ['.pdf', 'application/pdf'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
            return;
        }

        if (valid.length > 0) {
            clearPages();
            setRotations({});
            setDeletedPages(new Set());
            setSelectedPageIds(new Set());
            addFiles(valid);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            movePage(active.id as string, over.id as string);
        }
    };

    const handleRotateSingle = (pageId: string) => {
        setRotations((prev) => ({
            ...prev,
            [pageId]: ((prev[pageId] || 0) + 90) % 360,
        }));
    };

    const handleRotateAll = (delta: number) => {
        setRotations((prev) => {
            const next = { ...prev };
            pages.forEach((p) => {
                const current = next[p.id] || 0;
                next[p.id] = (current + delta + 360) % 360;
            });
            return next;
        });
    };

    const handleDeleteSingle = (pageId: string) => {
        setDeletedPages((prev) => {
            const next = new Set(prev);
            next.add(pageId);
            return next;
        });
        setSelectedPageIds((prev) => {
            const next = new Set(prev);
            next.delete(pageId);
            return next;
        });
    };

    const handleRestoreDeleted = () => {
        setDeletedPages(new Set());
    };

    const visiblePages = pages.filter((p) => !deletedPages.has(p.id));

    // Toggle selección de una página
    const handleToggleSelectPage = (pageId: string) => {
        setSelectedPageIds((prev) => {
            const next = new Set(prev);
            if (next.has(pageId)) {
                next.delete(pageId);
            } else {
                next.add(pageId);
            }
            return next;
        });
    };

    // Selección masiva
    const handleSelectAll = () => {
        setSelectedPageIds(new Set(visiblePages.map((p) => p.id)));
    };

    const handleDeselectAll = () => {
        setSelectedPageIds(new Set());
    };

    const handleSelectEven = () => {
        const next = new Set<string>();
        visiblePages.forEach((p, idx) => {
            if ((idx + 1) % 2 === 0) next.add(p.id);
        });
        setSelectedPageIds(next);
    };

    const handleSelectOdd = () => {
        const next = new Set<string>();
        visiblePages.forEach((p, idx) => {
            if ((idx + 1) % 2 !== 0) next.add(p.id);
        });
        setSelectedPageIds(next);
    };

    const handleApplyRangeSelection = () => {
        const fromNum = Number(rangeFrom) || 1;
        const toNum = Number(rangeTo) || 1;
        const start = Math.max(1, Math.min(fromNum, toNum));
        const end = Math.min(visiblePages.length, Math.max(fromNum, toNum));
        const next = new Set(selectedPageIds);
        for (let i = start - 1; i < end; i++) {
            if (visiblePages[i]) next.add(visiblePages[i].id);
        }
        setSelectedPageIds(next);
        setShowRangeModal(false);
    };

    // Mover página individual
    const handleOpenMoveSingle = (page: Page, currentIndex: number) => {
        setMovingSingleTarget({ page, currentIndex });
        setSingleTargetPositionInput(currentIndex + 1);
    };

    const handleConfirmMoveSingle = () => {
        if (!movingSingleTarget) return;
        const targetPos = Math.max(1, Math.min(visiblePages.length, Number(singleTargetPositionInput) || 1));
        const targetZeroBased = targetPos - 1;
        movePageToIndex(movingSingleTarget.page.id, targetZeroBased);
        setMovingSingleTarget(null);
    };

    // Mover lote/conjunto de páginas seleccionadas
    const handleOpenBatchMove = () => {
        if (selectedPageIds.size === 0) return;
        setBatchTargetPositionInput(1);
        setMovingBatchOpen(true);
    };

    const handleConfirmBatchMove = (target1Based?: number | string) => {
        if (selectedPageIds.size === 0) return;
        const targetNum = Math.max(1, Math.min(visiblePages.length, Number(target1Based ?? batchTargetPositionInput) || 1));
        moveBatchToPosition(selectedPageIds, targetNum);
        setMovingBatchOpen(false);
    };

    // Girar lote de páginas seleccionadas
    const handleRotateBatch = (delta: number) => {
        setRotations((prev) => {
            const next = { ...prev };
            selectedPageIds.forEach((id) => {
                next[id] = ((next[id] || 0) + delta + 360) % 360;
            });
            return next;
        });
    };

    // Eliminar lote de páginas seleccionadas
    const handleDeleteBatch = () => {
        setDeletedPages((prev) => {
            const next = new Set(prev);
            selectedPageIds.forEach((id) => next.add(id));
            return next;
        });
        setSelectedPageIds(new Set());
    };

    // Modal de inserción de nuevo PDF
    const handleOpenInsertModal = (targetAfterPage?: number) => {
        setInsertFileToProcess(null);
        if (typeof targetAfterPage === 'number') {
            setInsertSpecificPosition(true);
            setInsertPositionType('after_page');
            setInsertAfterPageNumber(targetAfterPage);
        } else {
            setInsertSpecificPosition(false);
            setInsertPositionType('end');
            setInsertAfterPageNumber(visiblePages.length || 1);
        }
        setShowInsertModal(true);
    };

    const handleConfirmInsert = async () => {
        if (!insertFileToProcess) return;

        let targetIndex: number | undefined = undefined;
        if (insertSpecificPosition) {
            if (insertPositionType === 'start') {
                targetIndex = -1; // Before first page
            } else if (insertPositionType === 'after_page') {
                const targetPos = Math.max(1, Math.min(visiblePages.length, Number(insertAfterPageNumber) || 1));
                targetIndex = targetPos - 1;
            } else {
                targetIndex = undefined; // At the end
            }
        }

        const fileToInsert = insertFileToProcess;
        setShowInsertModal(false);
        setInsertFileToProcess(null);

        await insertPagesFromPdf(fileToInsert, targetIndex);
    };

    // Replace modal
    const handleOpenReplace = (page: Page) => {
        setReplacingTarget(page);
        setReplacementFile(null);
        setReplacementDocPages([]);
        setSelectedReplacementIndex(0);
    };

    const handleReplacementFileSelected = async (file: File) => {
        const { valid, errors } = validateFiles([file], {
            accept: ['.pdf', 'application/pdf'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors[0].error);
            return;
        }

        setReplacementFile(valid[0]);
        setLoadingReplacement(true);

        try {
            const buffer = await valid[0].arrayBuffer();
            const doc = await loadPdfDocument(buffer);
            const total = doc.numPages;
            const previews: { pageIndex: number; thumbnail: string }[] = [];

            for (let i = 0; i < total; i++) {
                const p = await doc.getPage(i + 1);
                const viewport = p.getViewport({ scale: 0.25 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    await p.render({ canvasContext: ctx, viewport } as any).promise;
                    previews.push({
                        pageIndex: i,
                        thumbnail: canvas.toDataURL('image/jpeg', 0.8),
                    });
                }
            }

            setReplacementDocPages(previews);
            setSelectedReplacementIndex(0);
        } catch (err) {
            console.error('Error loading replacement PDF:', err);
            setError('Error al procesar el archivo PDF de reemplazo.');
        } finally {
            setLoadingReplacement(false);
        }
    };

    const handleConfirmReplacement = () => {
        if (!replacingTarget || !replacementFile || replacementDocPages.length === 0) return;
        const selectedThumb = replacementDocPages[selectedReplacementIndex]?.thumbnail;
        if (!selectedThumb) return;

        replacePage(replacingTarget.id, replacementFile, selectedReplacementIndex, selectedThumb);

        setRotations((prev) => {
            const next = { ...prev };
            delete next[replacingTarget.id];
            return next;
        });

        setReplacingTarget(null);
        setReplacementFile(null);
        setReplacementDocPages([]);
    };

    const handleOrganizeExport = () => {
        if (visiblePages.length === 0) {
            setError('No hay páginas visibles para exportar. Restaura algunas páginas.');
            return;
        }

        run(async (setProgress) => {
            setProgress(5, 'Iniciando reorganización documental…');
            const { PDFDocument, degrees } = await import('pdf-lib');

            const docCache = new Map<File, any>();
            for (const p of visiblePages) {
                if (!docCache.has(p.file)) {
                    const buf = await p.file.arrayBuffer();
                    const loaded = await PDFDocument.load(buf);
                    docCache.set(p.file, loaded);
                }
            }

            const newPdf = await PDFDocument.create();
            const total = visiblePages.length;

            for (let i = 0; i < total; i++) {
                const p = visiblePages[i];
                setProgress(
                    15 + Math.round((i / total) * 75),
                    `Procesando página ${i + 1} de ${total}…`
                );

                const sourceDoc = docCache.get(p.file);
                if (!sourceDoc) continue;

                const [copied] = await newPdf.copyPages(sourceDoc, [p.pageIndex]);
                const rot = rotations[p.id] || 0;
                if (rot > 0) {
                    const currentAngle = copied.getRotation().angle;
                    copied.setRotation(degrees((currentAngle + rot) % 360));
                }

                newPdf.addPage(copied);
            }

            setProgress(92, 'Generando documento final…');
            const bytes = await newPdf.save();
            setProgress(100, '¡Documento listo!');

            const baseName = originalFile?.name.replace(/\.pdf$/i, '') || 'documento';
            return {
                blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-organizado.pdf`,
            };
        });
    };

    const handleRestartAll = () => {
        clearPages();
        setRotations({});
        setDeletedPages(new Set());
        setSelectedPageIds(new Set());
        reset();
    };

    // Stage 1: Upload
    if (!originalFile && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar archivo PDF"
                dropLabel="o arrastra y suelta el PDF aquí"
                error={error || thumbError}
                onFiles={handleUploadInitial}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Organizando tu PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡El PDF se ha organizado con éxito!"
                downloadLabel="Descargar PDF organizado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestartAll}
                toolId="organize"
            />
        );
    }

    const replacedCount = visiblePages.filter((p) => p.isReplaced).length;
    const insertedCount = visiblePages.filter((p) => p.isInserted && !p.isReplaced).length;
    const selectedCount = selectedPageIds.size;
    const selectedPagesList = visiblePages.filter((p) => selectedPageIds.has(p.id));

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle="Generando miniaturas de las páginas del documento…"
                />
            )}

            {zoomedPageIndex !== null && (
                <PageZoomModal
                    file={originalFile}
                    pageIndex={zoomedPageIndex}
                    totalPages={pages.length}
                    initialThumbnail={pages[zoomedPageIndex]?.thumbnail}
                    rotation={rotations[pages[zoomedPageIndex]?.id] || 0}
                    onClose={() => setZoomedPageIndex(null)}
                    onNavigate={(newIdx) => setZoomedPageIndex(newIdx)}
                    onRotate={(idx) => {
                        const targetPage = pages[idx];
                        if (targetPage) handleRotateSingle(targetPage.id);
                    }}
                />
            )}

            <Workspace
                title="Organizar PDF"
                actionLabel="Organizar PDF"
                onAction={handleOrganizeExport}
                actionDisabled={visiblePages.length === 0}
                actionHint={visiblePages.length === 0 ? 'No hay páginas visibles.' : undefined}
                error={error || thumbError}
                addFiles={{
                    accept: '.pdf,application/pdf',
                    multiple: false,
                    label: 'Insertar páginas de otro PDF',
                    count: visiblePages.length,
                    onFiles: (files) => {
                        if (files[0]) {
                            setInsertFileToProcess(files[0]);
                            setShowInsertModal(true);
                        }
                    },
                }}
                toolbar={
                    <div className="flex flex-col gap-2.5">
                        {/* Fila principal del Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                    {visiblePages.length} {visiblePages.length === 1 ? 'página' : 'páginas'}
                                </span>
                                {originalFile && (
                                    <span className="text-xs text-muted">
                                        ({originalFile.name} · {formatBytes(originalFile.size)})
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Botones rápidos de selección */}
                                <button
                                    type="button"
                                    onClick={selectedCount === visiblePages.length ? handleDeselectAll : handleSelectAll}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                                    title="Seleccionar o deseleccionar todas las páginas"
                                >
                                    {selectedCount === visiblePages.length ? <CheckSquare className="w-3.5 h-3.5 text-brand" /> : <Square className="w-3.5 h-3.5 text-muted" />}
                                    <span>{selectedCount === visiblePages.length ? 'Deseleccionar todas' : 'Seleccionar todas'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRangeFrom(1);
                                        setRangeTo(Math.min(10, visiblePages.length));
                                        setShowRangeModal(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                                    title="Seleccionar un intervalo o rango de páginas"
                                >
                                    <ListFilter className="w-3.5 h-3.5 text-muted" />
                                    <span>Rango...</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOpenInsertModal()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20 hover:bg-brand/15 text-xs font-bold text-brand transition-colors cursor-pointer"
                                    title="Insertar páginas de otro PDF"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Insertar PDF</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRotateAll(90)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                                    title="Girar todas las páginas 90° a la derecha"
                                >
                                    <RotateCw className="w-3.5 h-3.5" />
                                    <span>Girar todas</span>
                                </button>

                                {deletedPages.size > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRestoreDeleted}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-brand transition-colors cursor-pointer"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Restaurar ({deletedPages.size})</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleRestartAll}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Cambiar archivo</span>
                                </button>
                            </div>
                        </div>

                        {/* BARRA FLOTANTE DE ACCIONES EN CONJUNTO (Aparece cuando hay 1 o más páginas seleccionadas) */}
                        {selectedCount > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-brand/10 border border-brand/25 text-ink animate-fadeIn shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-black shadow-xs">
                                        {selectedCount}
                                    </div>
                                    <span className="text-xs font-bold text-brand">
                                        {selectedCount} {selectedCount === 1 ? 'página seleccionada' : 'páginas seleccionadas en conjunto'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Mover lote a posición */}
                                    <button
                                        type="button"
                                        onClick={handleOpenBatchMove}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                                    >
                                        <ArrowRightLeft className="w-3.5 h-3.5" />
                                        <span>Mover {selectedCount} páginas a...</span>
                                    </button>

                                    {/* Girar seleccionadas */}
                                    <button
                                        type="button"
                                        onClick={() => handleRotateBatch(90)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-brand text-xs font-bold text-ink transition-colors cursor-pointer"
                                        title="Girar páginas seleccionadas 90°"
                                    >
                                        <RotateCw className="w-3.5 h-3.5 text-brand" />
                                        <span>Girar (+90°)</span>
                                    </button>

                                    {/* Eliminar seleccionadas */}
                                    <button
                                        type="button"
                                        onClick={handleDeleteBatch}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-danger hover:text-danger text-xs font-bold text-ink transition-colors cursor-pointer"
                                        title="Eliminar páginas seleccionadas"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-danger" />
                                        <span>Eliminar ({selectedCount})</span>
                                    </button>

                                    {/* Deseleccionar */}
                                    <button
                                        type="button"
                                        onClick={handleDeselectAll}
                                        className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                                        title="Deseleccionar todas"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                }
                options={
                    <div className="space-y-6">
                        <SidebarSection title="Girar todas las páginas">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleRotateAll(-90)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>-90° Izq</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRotateAll(90)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    <span>+90° Der</span>
                                </button>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Selección rápida de páginas">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleSelectOdd}
                                    className="px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors text-center cursor-pointer"
                                >
                                    Páginas Impares
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSelectEven}
                                    className="px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors text-center cursor-pointer"
                                >
                                    Páginas Pares
                                </button>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen del documento">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas finales" value={`${visiblePages.length} págs`} />
                                {selectedCount > 0 && (
                                    <StatRow label="Páginas seleccionadas" value={`${selectedCount} págs`} />
                                )}
                                {deletedPages.size > 0 && (
                                    <StatRow label="Páginas eliminadas" value={`${deletedPages.size} págs`} />
                                )}
                                {replacedCount > 0 && (
                                    <StatRow label="Páginas sustituidas" value={`${replacedCount} págs`} />
                                )}
                                {insertedCount > 0 && (
                                    <StatRow label="Páginas añadidas" value={`${insertedCount} págs`} />
                                )}
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            <strong>Selección en Conjunto:</strong> Haz clic sobre cualquier página para seleccionarla o usa <em>Rango...</em> para mover múltiples páginas en bloque a la posición que desees.
                        </Notice>
                    </div>
                }
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={visiblePages.map((p) => p.id)} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                            {visiblePages.map((page, idx) => {
                                const currentRot = rotations[page.id] || 0;
                                const isReplaced = page.isReplaced;
                                const isInserted = page.isInserted && !isReplaced;
                                const isSelected = selectedPageIds.has(page.id);

                                return (
                                    <SortableThumb
                                        key={page.id}
                                        id={page.id}
                                        index={idx + 1}
                                        title={`Pág. ${idx + 1}`}
                                        subtitle={
                                            isReplaced
                                                ? 'Reemplazada'
                                                : isInserted
                                                ? 'Añadida'
                                                : `Orig. ${page.pageIndex + 1}`
                                        }
                                        badge={
                                            isReplaced
                                                ? { label: 'Reemplazo', tone: 'green' }
                                                : isInserted
                                                ? { label: 'Añadida', tone: 'blue' }
                                                : undefined
                                        }
                                        thumbnail={page.thumbnail}
                                        rotation={currentRot}
                                        selected={isSelected}
                                        size="md"
                                        onClick={() => handleToggleSelectPage(page.id)}
                                        onZoom={() => setZoomedPageIndex(page.pageIndex)}
                                        actions={[
                                            {
                                                icon: RotateCw,
                                                label: 'Girar 90°',
                                                onClick: () => handleRotateSingle(page.id),
                                            },
                                            {
                                                icon: ArrowRightLeft,
                                                label: 'Mover a posición...',
                                                onClick: () => handleOpenMoveSingle(page, idx),
                                            },
                                            {
                                                icon: RefreshCw,
                                                label: 'Reemplazar por otra página',
                                                onClick: () => handleOpenReplace(page),
                                            },
                                            {
                                                icon: Trash2,
                                                label: 'Eliminar página',
                                                tone: 'danger',
                                                onClick: () => handleDeleteSingle(page.id),
                                            },
                                        ]}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </Workspace>

            {/* MODAL: MOVER CONJUNTO / LOTE DE PÁGINAS SELECCIONADAS */}
            {movingBatchOpen && selectedCount > 0 && (
                <div className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="w-full max-w-lg bg-surface border border-line rounded-3xl shadow-lift p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                                    <ArrowRightLeft className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ink">
                                        Mover {selectedCount} páginas en conjunto
                                    </h3>
                                    <p className="text-xs text-ink-2">
                                        Define hacia qué posición del documento deseas trasladar este bloque
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMovingBatchOpen(false)}
                                className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Resumen de páginas seleccionadas en tira horizontal */}
                            <div className="p-3.5 rounded-2xl bg-canvas border border-line space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-ink">
                                    <span>Páginas seleccionadas ({selectedCount}):</span>
                                    <span className="text-brand">Bloque correlativo</span>
                                </div>
                                <div className="max-h-24 overflow-x-auto flex items-center gap-2 py-1">
                                    {selectedPagesList.map((p) => {
                                        const pIdx = visiblePages.findIndex((v) => v.id === p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                className="w-12 h-16 rounded-lg bg-surface border border-line shrink-0 flex flex-col items-center justify-center overflow-hidden relative shadow-xs"
                                            >
                                                {p.thumbnail && (
                                                    <img
                                                        src={p.thumbnail}
                                                        alt={`Pág ${pIdx + 1}`}
                                                        className="max-w-full max-h-12 object-contain"
                                                    />
                                                )}
                                                <span className="text-[10px] font-bold text-ink bg-surface/90 w-full text-center py-0.5 border-t border-line">
                                                    {pIdx + 1}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Accesos rápidos de posición */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleConfirmBatchMove(1)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <ChevronsLeft className="w-3.5 h-3.5 text-brand" />
                                    <span>Al inicio del documento</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleConfirmBatchMove(visiblePages.length)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <span>Al final del documento</span>
                                    <ChevronsRight className="w-3.5 h-3.5 text-brand" />
                                </button>
                            </div>

                            {/* Input numérico de destino */}
                            <div className="space-y-1.5 pt-1">
                                <label className="block text-xs font-bold text-ink">
                                    O escribe el número de página a partir de la cual se colocarán:
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={batchTargetPositionInput}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (raw === '') {
                                                setBatchTargetPositionInput('');
                                                return;
                                            }
                                            const num = parseInt(raw, 10);
                                            if (num > visiblePages.length) {
                                                setBatchTargetPositionInput(visiblePages.length);
                                            } else {
                                                setBatchTargetPositionInput(num);
                                            }
                                        }}
                                        onBlur={() => {
                                            const num = Number(batchTargetPositionInput);
                                            if (!num || num < 1) {
                                                setBatchTargetPositionInput(1);
                                            } else if (num > visiblePages.length) {
                                                setBatchTargetPositionInput(visiblePages.length);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleConfirmBatchMove(batchTargetPositionInput);
                                            }
                                        }}
                                        placeholder="1"
                                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-base font-bold text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all tabular-nums"
                                    />
                                    <span className="text-xs text-muted font-bold shrink-0">
                                        de {visiblePages.length}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted leading-relaxed">
                                    Las {selectedCount} páginas se moverán en conjunto comenzando en la posición {batchTargetPositionInput || 1}.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                            <button
                                type="button"
                                onClick={() => setMovingBatchOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink hover:bg-canvas transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => handleConfirmBatchMove(batchTargetPositionInput)}
                                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                            >
                                Mover {selectedCount} páginas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: MOVER PÁGINA INDIVIDUAL */}
            {movingSingleTarget && (
                <div className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="w-full max-w-md bg-surface border border-line rounded-3xl shadow-lift p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                                    <ArrowRightLeft className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ink">Mover página</h3>
                                    <p className="text-xs text-ink-2">Posición actual: Pág. {movingSingleTarget.currentIndex + 1} de {visiblePages.length}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMovingSingleTarget(null)}
                                className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-2xl bg-canvas border border-line">
                                <div className="w-16 h-20 bg-surface rounded-lg border border-line flex items-center justify-center overflow-hidden shrink-0">
                                    {movingSingleTarget.page.thumbnail && (
                                        <img
                                            src={movingSingleTarget.page.thumbnail}
                                            alt="Página"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    )}
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-ink">Página {movingSingleTarget.currentIndex + 1}</p>
                                    <p className="text-muted">Documento: {movingSingleTarget.page.sourceFileName || originalFile?.name}</p>
                                    <p className="text-brand font-bold pt-1">
                                        Pasará a la posición: <span className="underline">Pág. {singleTargetPositionInput || 1}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSingleTargetPositionInput(1)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <ChevronsLeft className="w-3.5 h-3.5 text-brand" />
                                    <span>Al inicio (Pág. 1)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSingleTargetPositionInput(visiblePages.length)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <span>Al final (Pág. {visiblePages.length})</span>
                                    <ChevronsRight className="w-3.5 h-3.5 text-brand" />
                                </button>
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <label className="block text-xs font-bold text-ink">
                                    Escribe el número de página de destino:
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={singleTargetPositionInput}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (raw === '') {
                                                setSingleTargetPositionInput('');
                                                return;
                                            }
                                            const num = parseInt(raw, 10);
                                            if (num > visiblePages.length) {
                                                setSingleTargetPositionInput(visiblePages.length);
                                            } else {
                                                setSingleTargetPositionInput(num);
                                            }
                                        }}
                                        onBlur={() => {
                                            const num = Number(singleTargetPositionInput);
                                            if (!num || num < 1) {
                                                setSingleTargetPositionInput(1);
                                            } else if (num > visiblePages.length) {
                                                setSingleTargetPositionInput(visiblePages.length);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleConfirmMoveSingle();
                                            }
                                        }}
                                        placeholder="1"
                                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-canvas text-base font-bold text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all tabular-nums"
                                    />
                                    <span className="text-xs text-muted font-bold shrink-0">
                                        de {visiblePages.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                            <button
                                type="button"
                                onClick={() => setMovingSingleTarget(null)}
                                className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink hover:bg-canvas transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmMoveSingle}
                                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                            >
                                Confirmar Movimiento
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SELECCIONAR RANGO DE PÁGINAS */}
            {showRangeModal && (
                <div className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="w-full max-w-sm bg-surface border border-line rounded-3xl shadow-lift p-6 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <h3 className="text-base font-bold text-ink">Seleccionar rango</h3>
                            <button
                                onClick={() => setShowRangeModal(false)}
                                className="p-1 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-ink-2 mb-1">Desde pág.</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={rangeFrom}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (raw === '') {
                                                setRangeFrom('');
                                                return;
                                            }
                                            const num = parseInt(raw, 10);
                                            setRangeFrom(Math.min(visiblePages.length, num));
                                        }}
                                        onBlur={() => {
                                            const num = Number(rangeFrom);
                                            if (!num || num < 1) {
                                                setRangeFrom(1);
                                            } else if (num > visiblePages.length) {
                                                setRangeFrom(visiblePages.length);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleApplyRangeSelection();
                                        }}
                                        placeholder="1"
                                        className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm font-bold text-ink tabular-nums"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-ink-2 mb-1">Hasta pág.</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={rangeTo}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (raw === '') {
                                                setRangeTo('');
                                                return;
                                            }
                                            const num = parseInt(raw, 10);
                                            setRangeTo(Math.min(visiblePages.length, num));
                                        }}
                                        onBlur={() => {
                                            const num = Number(rangeTo);
                                            if (!num || num < 1) {
                                                setRangeTo(1);
                                            } else if (num > visiblePages.length) {
                                                setRangeTo(visiblePages.length);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleApplyRangeSelection();
                                        }}
                                        placeholder="1"
                                        className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm font-bold text-ink tabular-nums"
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-muted">
                                Se añadirán a la selección las páginas entre la {rangeFrom || 1} y la {rangeTo || visiblePages.length}.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                            <button
                                type="button"
                                onClick={() => setShowRangeModal(false)}
                                className="px-3 py-2 rounded-xl border border-line text-xs font-bold text-ink hover:bg-canvas transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleApplyRangeSelection}
                                className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                            >
                                Seleccionar páginas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: INSERTAR PÁGINAS DE OTRO PDF */}
            {showInsertModal && (
                <div className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="w-full max-w-lg bg-surface border border-line rounded-3xl shadow-lift p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-ink">Insertar páginas de otro PDF</h3>
                                    <p className="text-xs text-ink-2">Elige el archivo y define su posición</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowInsertModal(false);
                                    setInsertFileToProcess(null);
                                }}
                                className="p-1.5 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!insertFileToProcess ? (
                            <div className="text-center py-8 border-2 border-dashed border-line rounded-2xl bg-canvas p-6 space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mx-auto">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-ink">Selecciona el PDF que deseas agregar</h4>
                                    <p className="text-xs text-muted">Soporta hasta 250MB</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => insertInputRef.current?.click()}
                                    className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                                >
                                    Buscar archivo PDF
                                </button>
                                <input
                                    ref={insertInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setInsertFileToProcess(e.target.files[0]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-line">
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <FileText className="w-5 h-5 text-brand shrink-0" />
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-ink truncate">{insertFileToProcess.name}</p>
                                            <p className="text-[11px] text-muted">{formatBytes(insertFileToProcess.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setInsertFileToProcess(null)}
                                        className="text-xs font-semibold text-brand hover:underline shrink-0 ml-2"
                                    >
                                        Cambiar
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-canvas border border-line space-y-3">
                                    <label className="flex items-start gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={insertSpecificPosition}
                                            onChange={(e) => setInsertSpecificPosition(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 accent-[var(--brand)] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <span className="text-xs font-bold text-ink block">
                                                Insertar en una posición específica
                                            </span>
                                            <span className="text-[11px] text-muted block mt-0.5">
                                                {insertSpecificPosition
                                                    ? 'Define a continuación exactamente dónde se insertarán las páginas.'
                                                    : 'Desmarcado: Las páginas se enviarán y añadirán al final del documento.'}
                                            </span>
                                        </div>
                                    </label>

                                    {insertSpecificPosition && (
                                        <div className="pt-3 border-t border-line space-y-2.5 animate-fadeIn">
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insertPos"
                                                        checked={insertPositionType === 'start'}
                                                        onChange={() => setInsertPositionType('start')}
                                                        className="accent-[var(--brand)] cursor-pointer"
                                                    />
                                                    <span>Al inicio (antes de la página 1)</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insertPos"
                                                        checked={insertPositionType === 'after_page'}
                                                        onChange={() => setInsertPositionType('after_page')}
                                                        className="accent-[var(--brand)] cursor-pointer"
                                                    />
                                                    <span>Después de una página específica</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="insertPos"
                                                        checked={insertPositionType === 'end'}
                                                        onChange={() => setInsertPositionType('end')}
                                                        className="accent-[var(--brand)] cursor-pointer"
                                                    />
                                                    <span>Al final del documento</span>
                                                </label>
                                            </div>

                                            {insertPositionType === 'after_page' && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <span className="text-xs text-ink-2 font-medium">Insertar después de pág:</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={insertAfterPageNumber}
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => {
                                                            const raw = e.target.value.replace(/\D/g, '');
                                                            if (raw === '') {
                                                                setInsertAfterPageNumber('');
                                                                return;
                                                            }
                                                            const num = parseInt(raw, 10);
                                                            if (num > visiblePages.length) {
                                                                setInsertAfterPageNumber(visiblePages.length);
                                                            } else {
                                                                setInsertAfterPageNumber(num);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            const num = Number(insertAfterPageNumber);
                                                            if (!num || num < 1) {
                                                                setInsertAfterPageNumber(1);
                                                            } else if (num > visiblePages.length) {
                                                                setInsertAfterPageNumber(visiblePages.length);
                                                            }
                                                        }}
                                                        placeholder="1"
                                                        className="w-20 px-2.5 py-1.5 rounded-lg border border-line bg-surface text-xs font-bold text-ink tabular-nums"
                                                    />
                                                    <span className="text-[11px] text-muted font-medium">de {visiblePages.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowInsertModal(false);
                                    setInsertFileToProcess(null);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink hover:bg-canvas transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!insertFileToProcess}
                                onClick={handleConfirmInsert}
                                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Insertar páginas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: REEMPLAZAR PÁGINA ESPECÍFICA */}
            {replacingTarget && (
                <div className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="w-full max-w-2xl bg-surface border border-line rounded-3xl shadow-lift p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div>
                                <h3 className="text-xl font-bold text-ink">Reemplazar página específica</h3>
                                <p className="text-xs text-ink-2 mt-0.5">
                                    Sustituir la página original {replacingTarget.pageIndex + 1} cargando otro PDF
                                </p>
                            </div>
                            <button
                                onClick={() => setReplacingTarget(null)}
                                className="p-2 rounded-xl text-muted hover:text-ink hover:bg-canvas transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!replacementFile ? (
                            <div className="text-center py-10 border-2 border-dashed border-line rounded-2xl bg-canvas p-6 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-ink">Sube el PDF con la página de reemplazo</h4>
                                    <p className="text-xs text-muted">
                                        Selecciona un archivo PDF (hasta 250MB) para ver sus páginas
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => replaceInputRef.current?.click()}
                                    className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-cta transition-colors cursor-pointer"
                                >
                                    Seleccionar archivo PDF
                                </button>
                                <input
                                    ref={replaceInputRef}
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleReplacementFileSelected(e.target.files[0]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        ) : loadingReplacement ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-xs font-semibold text-ink-2">Cargando vistas previas del PDF de reemplazo…</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-ink">
                                        Selecciona la página que reemplazará a la actual:
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setReplacementFile(null)}
                                        className="text-xs text-brand font-semibold hover:underline"
                                    >
                                        Elegir otro PDF
                                    </button>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto p-2 rounded-xl bg-canvas border border-line flex flex-wrap gap-3 justify-center">
                                    {replacementDocPages.map((item) => {
                                        const isSelected = selectedReplacementIndex === item.pageIndex;
                                        return (
                                            <div
                                                key={item.pageIndex}
                                                onClick={() => setSelectedReplacementIndex(item.pageIndex)}
                                                className={`relative w-28 h-36 rounded-xl overflow-hidden bg-surface p-1.5 transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'ring-3 ring-brand shadow-lift'
                                                        : 'border border-line hover:border-line-strong'
                                                }`}
                                            >
                                                <div className="w-full h-28 bg-surface-2 rounded-lg flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={`Pág ${item.pageIndex + 1}`}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <div className="text-center text-[11px] font-bold text-ink mt-1">
                                                    Pág. {item.pageIndex + 1}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center shadow-xs">
                                                        <Check className="w-3 h-3" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                                    <button
                                        type="button"
                                        onClick={() => setReplacingTarget(null)}
                                        className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink hover:bg-canvas transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmReplacement}
                                        className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-cta transition-colors cursor-pointer"
                                    >
                                        Confirmar Reemplazo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
