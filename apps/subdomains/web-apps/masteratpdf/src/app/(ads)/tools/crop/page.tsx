'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Crop, RefreshCw, Trash2 } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument, formatPdfError } from '@/lib/pdf/pdfHelper';
import { cropPdfMargins, type CropMargins } from '@/lib/pdf/pdfCropper';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { Workspace, SidebarSection, Segmented, StatRow, Notice } from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

export default function CropPage() {
    const tool = getTool('crop');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [applyScope, setApplyScope] = useState<'all' | 'current'>('all');
    const [margins, setMargins] = useState<CropMargins>({
        topPercent: 5,
        bottomPercent: 5,
        leftPercent: 5,
        rightPercent: 5,
    });

    useEffect(() => {
        let cancelled = false;
        const renderPage = async () => {
            if (!file) return;
            try {
                const buf = await file.arrayBuffer();
                const pdf = await loadPdfDocument(buf);
                if (cancelled) return;
                setNumPages(pdf.numPages);
                const page = await pdf.getPage(Math.min(currentPage + 1, pdf.numPages));
                const vp = page.getViewport({ scale: 1.2 });
                const canvas = document.createElement('canvas');
                canvas.width = vp.width;
                canvas.height = vp.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
                    if (!cancelled) setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
                }
            } catch (err) {
                if (!cancelled) setError(formatPdfError(err));
            }
        };
        renderPage();
        return () => {
            cancelled = true;
        };
    }, [file, currentPage, setError]);

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
            setCurrentPage(0);
            setPreviewUrl(null);
        }
    };

    const handleCrop = () => {
        if (!file) return;
        if (margins.leftPercent + margins.rightPercent >= 90 || margins.topPercent + margins.bottomPercent >= 90) {
            setError('El recorte total no puede superar el 90% del ancho o alto.');
            return;
        }

        run(async (setProgress) => {
            setProgress(25, 'Calculando cajas CropBox y MediaBox…');
            const buffer = await file.arrayBuffer();
            const indices = applyScope === 'current' ? [currentPage] : undefined;

            setProgress(65, 'Recortando márgenes del documento…');
            const bytes = await cropPdfMargins(buffer, margins, indices);
            setProgress(100, '¡PDF recortado con éxito!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-recortado.pdf`,
            };
        });
    };

    const handleResetMargins = () => {
        setMargins({ topPercent: 0, bottomPercent: 0, leftPercent: 0, rightPercent: 0 });
    };

    const handleRestart = () => {
        setFile(null);
        setPreviewUrl(null);
        setNumPages(0);
        reset();
    };

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

    if (stage === 'processing') {
        return <ProcessingView title="Recortando páginas del PDF…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        return (
            <DownloadView
                title="¡PDF recortado con éxito!"
                downloadLabel="Descargar PDF Recortado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="crop"
            />
        );
    }

    return (
        <Workspace
            title={tool.name}
            actionLabel="Recortar PDF"
            onAction={handleCrop}
            actionDisabled={!file}
            error={error}
            toolbar={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            Página {currentPage + 1} de {numPages || 1}
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
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage <= 0}
                            className="p-1.5 rounded-lg bg-surface border border-line disabled:opacity-40 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(Math.max(0, numPages - 1), p + 1))}
                            disabled={currentPage >= numPages - 1}
                            className="p-1.5 rounded-lg bg-surface border border-line disabled:opacity-40 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleResetMargins}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-semibold text-ink cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Restablecer</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cambiar archivo</span>
                        </button>
                    </div>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Aplicar recorte a">
                        <Segmented
                            value={applyScope}
                            onChange={(v) => setApplyScope(v as 'all' | 'current')}
                            options={[
                                { value: 'all', label: 'Todas las páginas' },
                                { value: 'current', label: `Solo pág. ${currentPage + 1}` },
                            ]}
                        />
                    </SidebarSection>

                    <SidebarSection title="Márgenes a recortar (%)">
                        <div className="space-y-3">
                            {(
                                [
                                    { key: 'topPercent', label: 'Superior' },
                                    { key: 'bottomPercent', label: 'Inferior' },
                                    { key: 'leftPercent', label: 'Izquierdo' },
                                    { key: 'rightPercent', label: 'Derecho' },
                                ] as const
                            ).map((item) => (
                                <div key={item.key} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-ink">
                                        <span>{item.label}</span>
                                        <span className="tabular-nums text-brand">{margins[item.key]}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={40}
                                        step={1}
                                        value={margins[item.key]}
                                        onChange={(e) =>
                                            setMargins((prev) => ({
                                                ...prev,
                                                [item.key]: Number(e.target.value),
                                            }))
                                        }
                                        className="w-full accent-[var(--brand)] cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <StatRow label="Alcance" value={applyScope === 'all' ? `${numPages} páginas` : `Página ${currentPage + 1}`} />
                        <StatRow
                            label="Área conservada"
                            value={`${100 - margins.leftPercent - margins.rightPercent}% × ${100 - margins.topPercent - margins.bottomPercent}%`}
                        />
                    </SidebarSection>

                    <Notice tone="info">
                        La zona sombreada roja se recortará de las páginas seleccionadas modificando su CropBox y MediaBox.
                    </Notice>
                </div>
            }
        >
            <div className="flex justify-center">
                <div className="relative inline-block bg-white rounded-xl shadow-lift border border-line overflow-hidden">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt={`Página ${currentPage + 1}`}
                            className="max-h-[70vh] w-auto object-contain select-none"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-[420px] h-[560px] flex items-center justify-center text-xs text-muted">
                            Renderizando página…
                        </div>
                    )}

                    {/* Zonas recortadas */}
                    {previewUrl && (
                        <>
                            <div
                                className="absolute top-0 left-0 right-0 bg-red-500/25 border-b-2 border-dashed border-red-500 pointer-events-none"
                                style={{ height: `${margins.topPercent}%` }}
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-red-500/25 border-t-2 border-dashed border-red-500 pointer-events-none"
                                style={{ height: `${margins.bottomPercent}%` }}
                            />
                            <div
                                className="absolute top-0 bottom-0 left-0 bg-red-500/25 border-r-2 border-dashed border-red-500 pointer-events-none"
                                style={{ width: `${margins.leftPercent}%` }}
                            />
                            <div
                                className="absolute top-0 bottom-0 right-0 bg-red-500/25 border-l-2 border-dashed border-red-500 pointer-events-none"
                                style={{ width: `${margins.rightPercent}%` }}
                            />
                        </>
                    )}
                </div>
            </div>
        </Workspace>
    );
}

