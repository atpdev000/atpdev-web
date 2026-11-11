'use client';

import React, { useState } from 'react';
import { 
    Presentation, 
    MonitorPlay, 
    Trash2, 
    Check, 
    Sparkles, 
    Layers 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { usePageThumbnails } from '@/hooks/usePageThumbnails';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    OptionCard, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { ThumbCard } from '@/components/tool/ThumbCard';
import { 
    ProcessingView, 
    DownloadView, 
    PdfLoadingOverlay 
} from '@/components/tool/FlowViews';
import { convertPdfToPptx } from '@/lib/pdf/pdfToPptx';

export default function PdfToPptPage() {
    const tool = getTool('pdf-to-ppt');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile } = usePageThumbnails();

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
            clearPages();
            addFiles(valid);
        }
    };

    const handleConvert = () => {
        if (!originalFile) return;

        run(async (setProgress) => {
            const res = await convertPdfToPptx(originalFile, {
                onProgress: (p, msg) => setProgress(p, msg),
            });

            return {
                blob: res.blob,
                fileName: res.fileName,
            };
        });
    };

    const handleRestart = () => {
        clearPages();
        reset();
    };

    // Stage 1: Upload
    if (!originalFile && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar documento PDF"
                dropLabel="o arrastra el documento aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Generando presentación PowerPoint (.pptx)…" progress={progress} message={message} />;
    }

    // Stage 3: Download
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Presentación PowerPoint lista!"
                downloadLabel="Descargar archivo PPTX"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="pdf-to-ppt"
            />
        );
    }

    // Stage 4: Edit Workspace
    return (
        <>
            {loading && <PdfLoadingOverlay progress={loadingProgress} />}

            <Workspace
                title={tool.name}
                actionLabel="Convertir a PowerPoint"
                onAction={handleConvert}
                actionDisabled={pages.length === 0}
                error={error}
                toolbar={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {pages.length} diapositivas a generar
                            </span>
                            {originalFile && (
                                <span className="text-xs text-muted">
                                    ({originalFile.name} · {formatBytes(originalFile.size)})
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cambiar archivo</span>
                        </button>
                    </div>
                }
                options={
                    <div className="space-y-6">
                        <SidebarSection title="Formato de presentación">
                            <OptionCard
                                icon={MonitorPlay}
                                title="Pantalla Panorámica (16:9)"
                                description="Cada página se adapta como diapositiva para proyectores, Google Slides y PowerPoint."
                                selected={true}
                                onSelect={() => {}}
                            />
                        </SidebarSection>

                        <SidebarSection title="Resumen de diapositivas">
                            <StatRow label="Páginas / Diapositivas" value={`${pages.length} diapositivas`} />
                            <StatRow label="Formato de salida" value="Microsoft PowerPoint (.pptx)" />
                            <StatRow label="Resolución" value="Full HD Retina (1.5x)" />
                        </SidebarSection>

                        <Notice tone="info">
                            Compatible con Microsoft PowerPoint, Google Slides, LibreOffice Impress y Apple Keynote.
                        </Notice>
                    </div>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {pages.map((p, idx) => (
                        <ThumbCard
                            key={p.id}
                            title={`Diapositiva ${idx + 1}`}
                            subtitle={originalFile?.name}
                            index={idx + 1}
                            thumbnail={p.thumbnail}
                            className="w-full"
                        />
                    ))}
                </div>
            </Workspace>
        </>
    );
}
