'use client';

import React, { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { 
    Scissors, 
    CheckSquare, 
    Square, 
    Trash2, 
    Download, 
    Archive, 
    Layers, 
    FileText 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { usePageThumbnails } from '@/hooks/usePageThumbnails';
import { useToolFlow } from '@/hooks/useToolFlow';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    OptionCard, 
    Segmented, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { ThumbCard } from '@/components/tool/ThumbCard';
import { 
    ProcessingView, 
    DownloadView, 
    PdfLoadingOverlay 
} from '@/components/tool/FlowViews';
import { PageZoomModal } from '@/components/tool/PageZoomModal';

export default function SplitPage() {
    const tool = getTool('split');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile, error: thumbError } = usePageThumbnails();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [rangeInput, setRangeInput] = useState<string>('');
    const [splitMode, setSplitMode] = useState<'extract' | 'ranges'>('extract');
    const [outputFormat, setOutputFormat] = useState<'merged' | 'zip'>('merged');
    const [zoomedPageIndex, setZoomedPageIndex] = useState<number | null>(null);

    // Parse comma-separated ranges e.g. "1-3, 5, 8-10"
    const parseRange = useCallback((text: string, maxPages: number): Set<number> => {
        const result = new Set<number>();
        const parts = text.split(',').map((p) => p.trim());

        for (const p of parts) {
            if (!p) continue;
            if (p.includes('-')) {
                const [startStr, endStr] = p.split('-').map(Number);
                if (!isNaN(startStr) && !isNaN(endStr)) {
                    const start = Math.max(1, Math.min(startStr, endStr));
                    const end = Math.min(maxPages, Math.max(startStr, endStr));
                    for (let i = start; i <= end; i++) {
                        result.add(i - 1);
                    }
                }
            } else {
                const n = Number(p);
                if (!isNaN(n) && n >= 1 && n <= maxPages) {
                    result.add(n - 1);
                }
            }
        }
        return result;
    }, []);

    const handleRangeChange = (text: string) => {
        setRangeInput(text);
        if (pages.length === 0) return;
        const indexSet = parseRange(text, pages.length);
        const newSelected = new Set<string>();
        pages.forEach((p) => {
            if (indexSet.has(p.pageIndex)) {
                newSelected.add(p.id);
            }
        });
        setSelectedIds(newSelected);
    };

    const handleTogglePage = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSelectAll = () => {
        setSelectedIds(new Set(pages.map((p) => p.id)));
    };

    const handleDeselectAll = () => {
        setSelectedIds(new Set());
        setRangeInput('');
    };

    const handleUpload = (incomingFiles: File[]) => {
        const { valid, errors } = validateFiles(incomingFiles, {
            accept: ['.pdf', 'application/pdf'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
            return;
        }

        if (valid.length > 0) {
            clearPages();
            setSelectedIds(new Set());
            setRangeInput('');
            addFiles(valid);
        }
    };

    const handleSplit = () => {
        if (!originalFile) {
            setError('Por favor sube un archivo PDF primero.');
            return;
        }

        if (selectedIds.size === 0) {
            setError('Selecciona al menos una página para extraer o dividir.');
            return;
        }

        run(async (setProgress) => {
            const selectedPages = pages
                .filter((p) => selectedIds.has(p.id))
                .sort((a, b) => a.pageIndex - b.pageIndex);

            const baseName = originalFile.name.replace(/\.pdf$/i, '');
            const { PDFDocument } = await import('pdf-lib');

            setProgress(10, 'Leyendo documento original…');
            const fileBuffer = await originalFile.arrayBuffer();
            const sourcePdf = await PDFDocument.load(fileBuffer);

            if (outputFormat === 'zip') {
                setProgress(20, 'Creando archivo comprimido ZIP…');
                const zip = new JSZip();
                const total = selectedPages.length;

                for (let i = 0; i < total; i++) {
                    const pg = selectedPages[i];
                    setProgress(
                        25 + Math.round((i / total) * 60),
                        `Extrayendo página ${pg.pageIndex + 1} (${i + 1} de ${total})…`
                    );

                    const singlePdf = await PDFDocument.create();
                    const [copied] = await singlePdf.copyPages(sourcePdf, [pg.pageIndex]);
                    singlePdf.addPage(copied);

                    const bytes = await singlePdf.save();
                    zip.file(`${baseName}-pagina-${pg.pageIndex + 1}.pdf`, new Uint8Array(bytes));
                }

                setProgress(90, 'Comprimiendo archivo ZIP final…');
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                setProgress(100, '¡Descarga lista!');

                return {
                    blob: zipBlob,
                    fileName: `${baseName}-paginas-separadas.zip`,
                };
            } else {
                setProgress(30, 'Extrayendo y uniendo páginas seleccionadas…');
                const newPdf = await PDFDocument.create();
                const pageIndices = selectedPages.map((p) => p.pageIndex);
                const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);

                copiedPages.forEach((p) => newPdf.addPage(p));

                setProgress(85, 'Guardando nuevo PDF…');
                const pdfBytes = await newPdf.save();
                setProgress(100, '¡Descarga lista!');

                return {
                    blob: new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }),
                    fileName: `${baseName}-dividido.pdf`,
                };
            }
        });
    };

    const handleRestartAll = () => {
        clearPages();
        setSelectedIds(new Set());
        setRangeInput('');
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
                error={error}
                onFiles={handleUpload}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Dividiendo tu PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡El PDF se ha dividido con éxito!"
                downloadLabel={outputFormat === 'zip' ? 'Descargar páginas en ZIP' : 'Descargar PDF dividido'}
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestartAll}
                toolId="split"
            />
        );
    }

    const selectedCount = selectedIds.size;
    const totalCount = pages.length;

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle={`Procesando vista previa (página ${Math.round((loadingProgress / 100) * totalCount || 0)} de ${totalCount || '...'})`}
                />
            )}

            {zoomedPageIndex !== null && (
                <PageZoomModal
                    file={originalFile}
                    pageIndex={zoomedPageIndex}
                    totalPages={pages.length}
                    initialThumbnail={pages[zoomedPageIndex]?.thumbnail}
                    onClose={() => setZoomedPageIndex(null)}
                    onNavigate={(newIdx) => setZoomedPageIndex(newIdx)}
                />
            )}

            <Workspace
                title="Dividir PDF"
                actionLabel={outputFormat === 'zip' ? 'Dividir en ZIP' : 'Dividir PDF'}
                onAction={handleSplit}
                actionDisabled={selectedCount === 0}
                actionHint={selectedCount === 0 ? 'Selecciona al menos una página.' : undefined}
                error={error || thumbError}
                toolbar={
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {selectedCount} de {totalCount} páginas seleccionadas
                            </span>
                            {originalFile && (
                                <span className="text-xs text-muted">
                                    ({originalFile.name} · {formatBytes(originalFile.size)})
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            >
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Seleccionar todas</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDeselectAll}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            >
                                <Square className="w-3.5 h-3.5" />
                                <span>Deseleccionar</span>
                            </button>
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
                }
                options={
                    <div className="space-y-6">
                        <SidebarSection title="Modo de división">
                            <Segmented
                                value={splitMode}
                                onChange={(val) => setSplitMode(val as 'extract' | 'ranges')}
                                options={[
                                    { value: 'extract', label: 'Extraer páginas' },
                                    { value: 'ranges', label: 'Por rangos' },
                                ]}
                            />
                        </SidebarSection>

                        {splitMode === 'ranges' && (
                            <SidebarSection title="Escribir rangos">
                                <label className="block text-xs text-ink-2 mb-1.5 font-medium">
                                    Ejemplo: <code className="text-brand font-bold">1-3, 5, 8-10</code>
                                </label>
                                <input
                                    type="text"
                                    value={rangeInput}
                                    onChange={(e) => handleRangeChange(e.target.value)}
                                    placeholder="1-5, 8, 11-12"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm font-mono placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                                />
                                <p className="text-[11px] text-muted mt-1.5">
                                    Escribe los números de página o intervalos que deseas extraer.
                                </p>
                            </SidebarSection>
                        )}

                        <SidebarSection title="Formato de salida">
                            <div className="space-y-2">
                                <OptionCard
                                    title="Unir en un solo PDF"
                                    description="Combina todas las páginas seleccionadas en un único documento nuevo."
                                    icon={Layers}
                                    selected={outputFormat === 'merged'}
                                    onClick={() => setOutputFormat('merged')}
                                />
                                <OptionCard
                                    title="Páginas por separado (ZIP)"
                                    description="Descarga cada página seleccionada en un archivo PDF independiente dentro de un ZIP."
                                    icon={Archive}
                                    selected={outputFormat === 'zip'}
                                    onClick={() => setOutputFormat('zip')}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas a extraer" value={`${selectedCount} de ${totalCount}`} />
                                <StatRow
                                    label="Formato"
                                    value={outputFormat === 'zip' ? 'Archivo ZIP' : 'PDF único'}
                                />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            Haz clic en cualquier página para seleccionarla o deseleccionarla visualmente.
                        </Notice>
                    </div>
                }
            >
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                    {pages.map((p) => {
                        const isSelected = selectedIds.has(p.id);
                        return (
                            <ThumbCard
                                key={p.id}
                                index={p.pageIndex + 1}
                                title={`Página ${p.pageIndex + 1}`}
                                thumbnail={p.thumbnail}
                                selected={isSelected}
                                size="md"
                                onClick={() => handleTogglePage(p.id)}
                                onZoom={() => setZoomedPageIndex(p.pageIndex)}
                                className="cursor-pointer"
                            />
                        );
                    })}
                </div>
            </Workspace>
        </>
    );
}
