'use client';

import React, { useState } from 'react';
import { 
    RotateCw, 
    RotateCcw, 
    Trash2, 
    Check, 
    RefreshCw, 
    FileText 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
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

interface PageData {
    index: number;
    thumbnail: string;
    rotation: number;
}

export default function RotatePage() {
    const tool = getTool('rotate');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [zoomedPageIndex, setZoomedPageIndex] = useState<number | null>(null);

    const loadPdfPages = async (selectedFile: File) => {
        setLoading(true);
        setLoadingProgress(0);
        setPages([]);

        try {
            const buffer = await selectedFile.arrayBuffer();
            const pdf = await loadPdfDocument(buffer);
            const total = pdf.numPages;
            const loaded: PageData[] = [];

            for (let i = 1; i <= total; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.35 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise;
                    loaded.push({
                        index: i - 1,
                        thumbnail: canvas.toDataURL('image/jpeg', 0.85),
                        rotation: 0,
                    });
                }
                setLoadingProgress(Math.round((i / total) * 100));
            }

            setPages(loaded);
        } catch (err) {
            console.error('Error loading PDF:', err);
            setError('Error al procesar el documento PDF.');
        } finally {
            setLoading(false);
            setLoadingProgress(0);
        }
    };

    const handleUpload = (files: File[]) => {
        const { valid, errors } = validateFiles(files, {
            accept: ['.pdf', 'application/pdf'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
            return;
        }

        if (valid.length > 0) {
            setFile(valid[0]);
            loadPdfPages(valid[0]);
        }
    };

    const handleRotateSingle = (pageIndex: number, delta: number) => {
        setPages((prev) =>
            prev.map((p) =>
                p.index === pageIndex
                    ? { ...p, rotation: (p.rotation + delta + 360) % 360 }
                    : p
            )
        );
    };

    const handleRotateAll = (delta: number) => {
        setPages((prev) =>
            prev.map((p) => ({
                ...p,
                rotation: (p.rotation + delta + 360) % 360,
            }))
        );
    };

    const handleResetRotations = () => {
        setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 })));
    };

    const handleRotateSave = () => {
        if (!file || pages.length === 0) return;

        run(async (setProgress) => {
            setProgress(10, 'Cargando documento original…');
            const { PDFDocument, degrees } = await import('pdf-lib');
            const buffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(buffer);
            const pdfPages = pdfDoc.getPages();

            const total = pages.length;
            for (let i = 0; i < total; i++) {
                const p = pages[i];
                if (p.rotation !== 0 && pdfPages[p.index]) {
                    setProgress(
                        20 + Math.round((i / total) * 65),
                        `Rotando página ${p.index + 1} (${p.rotation}°)…`
                    );
                    const currentAngle = pdfPages[p.index].getRotation().angle;
                    pdfPages[p.index].setRotation(degrees((currentAngle + p.rotation) % 360));
                }
            }

            setProgress(90, 'Guardando nuevo PDF con rotación fija…');
            const pdfBytes = await pdfDoc.save();
            setProgress(100, '¡Documento listo!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-rotado.pdf`,
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setPages([]);
        reset();
    };

    // Stage 1: Upload
    if (!file && stage === 'edit') {
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
        return <ProcessingView title="Guardando rotación de tu PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu PDF se ha rotado con éxito!"
                downloadLabel="Descargar PDF rotado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="rotate"
            />
        );
    }

    const rotatedCount = pages.filter((p) => p.rotation !== 0).length;

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle="Generando miniaturas de alta resolución para rotación…"
                />
            )}

            {zoomedPageIndex !== null && (
                <PageZoomModal
                    file={file}
                    pageIndex={zoomedPageIndex}
                    totalPages={pages.length}
                    initialThumbnail={pages[zoomedPageIndex]?.thumbnail}
                    rotation={pages[zoomedPageIndex]?.rotation || 0}
                    onClose={() => setZoomedPageIndex(null)}
                    onNavigate={(newIdx) => setZoomedPageIndex(newIdx)}
                    onRotate={(idx) => handleRotateSingle(idx, 90)}
                />
            )}

            <Workspace
                title="Rotar PDF"
                actionLabel="Rotar PDF"
                onAction={handleRotateSave}
                actionDisabled={pages.length === 0}
                error={error}
                toolbar={
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
                            </span>
                            {file && (
                                <span className="text-xs text-muted">
                                    ({file.name} · {formatBytes(file.size)})
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleRotateAll(-90)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>-90° Izq</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRotateAll(90)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-ink transition-colors cursor-pointer"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>+90° Der</span>
                            </button>
                            {rotatedCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleResetRotations}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-line-strong text-xs font-semibold text-brand transition-colors cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Restablecer</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleRestart}
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
                        <SidebarSection title="Giro rápido para todas">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleRotateAll(-90)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Girar Izquierda</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRotateAll(90)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-line hover:border-line-strong text-xs font-bold text-ink transition-colors cursor-pointer"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    <span>Girar Derecha</span>
                                </button>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas totales" value={`${pages.length} págs`} />
                                <StatRow label="Páginas modificadas" value={`${rotatedCount} págs`} />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            Pasa el cursor por encima de cualquier página para girarla individualmente en incrementos de 90°.
                        </Notice>
                    </div>
                }
            >
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                    {pages.map((p) => (
                        <ThumbCard
                            key={p.index}
                            index={p.index + 1}
                            title={`Página ${p.index + 1}`}
                            subtitle={p.rotation > 0 ? `${p.rotation}° de rotación` : 'Orientación original'}
                            thumbnail={p.thumbnail}
                            rotation={p.rotation}
                            size="md"
                            onZoom={() => setZoomedPageIndex(p.index)}
                            badge={p.rotation > 0 ? { label: `${p.rotation}°`, tone: 'blue' } : undefined}
                            actions={[
                                {
                                    icon: RotateCcw,
                                    label: 'Girar 90° a la izquierda',
                                    onClick: () => handleRotateSingle(p.index, -90),
                                },
                                {
                                    icon: RotateCw,
                                    label: 'Girar 90° a la derecha',
                                    onClick: () => handleRotateSingle(p.index, 90),
                                },
                            ]}
                        />
                    ))}
                </div>
            </Workspace>
        </>
    );
}
