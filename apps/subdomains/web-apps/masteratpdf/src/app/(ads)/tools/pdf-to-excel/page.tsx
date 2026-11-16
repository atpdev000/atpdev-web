'use client';

import React, { useState } from 'react';
import { 
    Table, 
    FileSpreadsheet, 
    Layers, 
    Trash2, 
    Check, 
    Sparkles, 
    ShieldCheck 
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
import { convertPdfToExcel } from '@/lib/pdf/pdfToExcel';

type SheetMode = 'single-sheet' | 'multi-sheet';

export default function PdfToExcelPage() {
    const tool = getTool('pdf-to-excel');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile } = usePageThumbnails();

    const [sheetMode, setSheetMode] = useState<SheetMode>('single-sheet');

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
            const res = await convertPdfToExcel(originalFile, {
                mode: sheetMode,
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
                dropLabel="o arrastra el PDF aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    // Stage 3: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Extrayendo tablas a Excel…" progress={progress} message={message} />;
    }

    // Stage 4: Download
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu archivo Excel está listo!"
                downloadLabel="Descargar Excel (.xlsx)"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="pdf-to-excel"
            />
        );
    }

    // Stage 2: Edit Workspace
    return (
        <>
            {loading && <PdfLoadingOverlay progress={loadingProgress} />}

            <Workspace
                title={tool.name}
                actionLabel="Convertir a Excel"
                onAction={handleConvert}
                actionDisabled={pages.length === 0}
                error={error}
                toolbar={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {pages.length} páginas seleccionadas
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
                        <SidebarSection title="Estructura de hojas en Excel">
                            <div className="space-y-2.5">
                                <OptionCard
                                    icon={FileSpreadsheet}
                                    title="Una sola hoja de cálculo"
                                    description="Todas las páginas se consolidan en una única hoja correlativa."
                                    selected={sheetMode === 'single-sheet'}
                                    onSelect={() => setSheetMode('single-sheet')}
                                />
                                <OptionCard
                                    icon={Layers}
                                    title="Una pestaña por página"
                                    description="Crea una hoja independiente para cada página del documento."
                                    selected={sheetMode === 'multi-sheet'}
                                    onSelect={() => setSheetMode('multi-sheet')}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen del documento">
                            <StatRow label="Páginas a procesar" value={`${pages.length} págs`} />
                            <StatRow label="Modo seleccionado" value={sheetMode === 'single-sheet' ? '1 Hoja unificada' : `${pages.length} Hojas`} />
                            <StatRow label="Formato de salida" value="Microsoft Excel (.xlsx)" />
                        </SidebarSection>

                        <Notice tone="info">
                            El análisis tabular se realiza en el motor de tu navegador sin enviar tus datos a la nube.
                        </Notice>
                    </div>
                }
            >

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {pages.map((p, idx) => (
                        <ThumbCard
                            key={p.id}
                            title={`Página ${idx + 1}`}
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
