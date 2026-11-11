'use client';

import React, { useState, useCallback } from 'react';
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
    arrayMove,
} from '@dnd-kit/sortable';
import { Trash2, ArrowUpDown, ArrowDownUp, RefreshCw } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { Workspace, SidebarSection, StatRow, Notice } from '@/components/tool/Workspace';
import { SortableThumb } from '@/components/tool/ThumbCard';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

interface PDFFile {
    id: string;
    file: File;
    name: string;
    size: number;
    thumbnail: string | null;
}

export default function MergePage() {
    const tool = getTool('merge');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const [files, setFiles] = useState<PDFFile[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const generateThumbnail = async (file: File): Promise<string> => {
        try {
            const buffer = await file.arrayBuffer();
            const pdf = await loadPdfDocument(buffer);
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.35 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                await page.render({ canvasContext: ctx, viewport } as any).promise;
                return canvas.toDataURL('image/jpeg', 0.85);
            }
            return '';
        } catch (err) {
            console.error('Error generating thumbnail:', err);
            return '';
        }
    };

    const handleAddFiles = useCallback(async (newFiles: File[]) => {
        const { valid, errors } = validateFiles(newFiles, { accept: ['.pdf', 'application/pdf'] });
        if (errors.length > 0) {
            setError(errors.map((e) => `${e.file.name}: ${e.error}`).join(' · '));
        }
        if (valid.length === 0) return;

        const newItems: PDFFile[] = valid.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            file,
            name: file.name,
            size: file.size,
            thumbnail: null,
        }));

        setFiles((prev) => [...prev, ...newItems]);

        // Generate thumbnails asynchronously
        for (const item of newItems) {
            const thumb = await generateThumbnail(item.file);
            setFiles((prev) =>
                prev.map((f) => (f.id === item.id ? { ...f, thumbnail: thumb } : f))
            );
        }
    }, [setError]);

    const handleRemove = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleSortAZ = () => {
        setFiles((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const handleSortZA = () => {
        setFiles((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleMerge = () => {
        if (files.length < 2) {
            setError('Añade al menos 2 archivos PDF para unirlos.');
            return;
        }

        run(async (setProgress) => {
            setProgress(5, 'Iniciando unión de documentos…');
            const { PDFDocument } = await import('pdf-lib');
            const mergedPdf = await PDFDocument.create();

            const total = files.length;
            for (let i = 0; i < total; i++) {
                const f = files[i];
                setProgress(
                    10 + Math.round((i / total) * 75),
                    `Procesando ${f.name} (${i + 1} de ${total})…`
                );

                const buffer = await f.file.arrayBuffer();
                const pdf = await PDFDocument.load(buffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((p) => mergedPdf.addPage(p));
            }

            setProgress(90, 'Generando archivo final optimizado…');
            const bytes = await mergedPdf.save();
            setProgress(100, '¡Documento listo!');

            const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
            return {
                blob,
                fileName: 'documento-unido.pdf',
            };
        });
    };

    const handleResetAll = () => {
        setFiles([]);
        reset();
    };

    // Stage 1: Upload landing
    if (files.length === 0 && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple
                buttonLabel="Seleccionar archivos PDF"
                dropLabel="o arrastra y suelta los PDF aquí"
                error={error}
                onFiles={handleAddFiles}
            />
        );
    }

    // Stage 2: Processing stage
    if (stage === 'processing') {
        return <ProcessingView title="Uniendo tus PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done / Download stage
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Los PDF se han unido con éxito!"
                downloadLabel="Descargar el PDF unido"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleResetAll}
                toolId="merge"
            />
        );
    }

    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    return (
        <Workspace
            title="Unir PDF"
            actionLabel="Unir PDF"
            onAction={handleMerge}
            actionDisabled={files.length < 2}
            actionHint={files.length < 2 ? 'Necesitas al menos 2 archivos para unir.' : undefined}
            error={error}
            toolbar={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-2">
                        {files.length} {files.length === 1 ? 'archivo' : 'archivos'} · {formatBytes(totalBytes)}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSortAZ}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            title="Ordenar por nombre A-Z"
                        >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                            <span>A → Z</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSortZA}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            title="Ordenar por nombre Z-A"
                        >
                            <ArrowDownUp className="w-3.5 h-3.5" />
                            <span>Z → A</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                            title="Limpiar todo"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            }
            addFiles={{
                accept: '.pdf,application/pdf',
                multiple: true,
                count: files.length,
                label: 'Añadir más archivos',
                onFiles: handleAddFiles,
            }}
            options={
                <div className="space-y-6">
                    <SidebarSection title="Orden de los archivos">
                        <p className="text-xs text-ink-2 leading-relaxed">
                            Arrastra y suelta las tarjetas para reordenar los documentos antes de unirlos, o usa el ordenamiento rápido:
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleSortAZ}
                                className="px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors text-center cursor-pointer"
                            >
                                A → Z
                            </button>
                            <button
                                type="button"
                                onClick={handleSortZA}
                                className="px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors text-center cursor-pointer"
                            >
                                Z → A
                            </button>
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                            <StatRow label="Documentos a unir" value={`${files.length} archivos`} />
                            <StatRow label="Peso estimado total" value={formatBytes(totalBytes)} />
                        </div>
                    </SidebarSection>

                    <Notice tone="info">
                        El archivo resultante contendrá todas las páginas de los documentos en el orden exacto mostrado a la izquierda.
                    </Notice>
                </div>
            }
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                        {files.map((item, idx) => (
                            <SortableThumb
                                key={item.id}
                                id={item.id}
                                index={idx + 1}
                                title={item.name}
                                subtitle={formatBytes(item.size)}
                                thumbnail={item.thumbnail}
                                size="lg"
                                actions={[
                                    {
                                        icon: Trash2,
                                        label: 'Quitar archivo',
                                        tone: 'danger',
                                        onClick: () => handleRemove(item.id),
                                    },
                                ]}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </Workspace>
    );
}
