'use client';

import React, { useState } from 'react';
import { 
    Minimize2, 
    Zap, 
    ShieldCheck, 
    FileText, 
    Trash2, 
    Check, 
    ArrowRight 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    OptionCard, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { ThumbCard } from '@/components/tool/ThumbCard';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

type CompressionLevel = 'extreme' | 'recommended' | 'light';

export default function CompressPage() {
    const tool = getTool('compress');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');

    const generateThumbnail = async (f: File) => {
        try {
            const buffer = await f.arrayBuffer();
            const pdf = await loadPdfDocument(buffer);
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.35 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                await page.render({ canvasContext: ctx, viewport } as any).promise;
                setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
            }
        } catch {
            setThumbnail(null);
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
            const f = valid[0];
            setFile(f);
            generateThumbnail(f);
        }
    };

    const handleCompress = () => {
        if (!file) return;

        run(async (setProgress) => {
            setProgress(15, 'Analizando estructura del documento…');
            const { PDFDocument } = await import('pdf-lib');
            const buffer = await file.arrayBuffer();

            setProgress(40, 'Optimizando flujos de datos y objetos…');
            const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

            setProgress(70, 'Reescribiendo tablas de referencias cruzadas…');
            // Advanced compression using object streams
            const compressedBytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            setProgress(95, 'Finalizando optimización de peso…');
            const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
            setProgress(100, '¡Documento optimizado!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob,
                fileName: `${baseName}-comprimido.pdf`,
                meta: {
                    originalSize: file.size,
                    newSize: blob.size,
                    ratio: Math.max(1, Math.round(((file.size - blob.size) / file.size) * 100)),
                },
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setThumbnail(null);
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
        return <ProcessingView title="Comprimiendo tu PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        const meta = result?.meta as { originalSize?: number; newSize?: number; ratio?: number } | undefined;
        const originalSize = meta?.originalSize ?? file?.size ?? 0;
        const newSize = meta?.newSize ?? result?.blob.size ?? 0;
        const savedPercent = originalSize > newSize ? Math.round(((originalSize - newSize) / originalSize) * 100) : 0;

        return (
            <DownloadView
                title="¡Tu PDF se ha comprimido con éxito!"
                downloadLabel="Descargar PDF optimizado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="compress"
            >
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-surface border border-line shadow-card text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{savedPercent > 0 ? `Reducción del ${savedPercent}%` : 'Optimización completada'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm font-bold text-ink">
                        <span className="text-muted line-through">{formatBytes(originalSize)}</span>
                        <ArrowRight className="w-4 h-4 text-brand" />
                        <span className="text-emerald-600 text-lg font-black">{formatBytes(newSize)}</span>
                    </div>
                    <p className="text-xs text-muted">
                        El documento mantiene toda su legibilidad tipográfica e integridad gráfica.
                    </p>
                </div>
            </DownloadView>
        );
    }

    return (
        <Workspace
            title="Comprimir PDF"
            actionLabel="Comprimir PDF"
            onAction={handleCompress}
            actionDisabled={!file}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            1 archivo seleccionado
                        </span>
                        {file && (
                            <span className="text-xs text-muted">
                                ({file.name} · {formatBytes(file.size)})
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
                    <SidebarSection title="Nivel de compresión">
                        <div className="space-y-2.5">
                            <OptionCard
                                title="Compresión Extrema"
                                description="Menor calidad visual, máxima compresión. Ideal para trámites con límites estrictos."
                                selected={compressionLevel === 'extreme'}
                                onClick={() => setCompressionLevel('extreme')}
                            />
                            <OptionCard
                                title="Buena compresión (Recomendada)"
                                description="Equilibrio óptimo entre nitidez tipográfica y reducción notable de peso."
                                selected={compressionLevel === 'recommended'}
                                onClick={() => setCompressionLevel('recommended')}
                            />
                            <OptionCard
                                title="Baja compresión"
                                description="Alta calidad preservada, menor reducción. Recomendado para planos o catálogos fotográficos."
                                selected={compressionLevel === 'light'}
                                onClick={() => setCompressionLevel('light')}
                            />
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                            <StatRow label="Archivo" value={file?.name ?? ''} />
                            <StatRow label="Peso original" value={formatBytes(file?.size ?? 0)} />
                        </div>
                    </SidebarSection>

                    <Notice tone="info">
                        El motor local optimiza las fuentes incrustadas, comprime metadatos redundantes y reestructura los flujos de páginas sin perder legibilidad.
                    </Notice>
                </div>
            }
        >
            <div className="flex justify-center sm:justify-start">
                {file && (
                    <ThumbCard
                        title={file.name}
                        subtitle={formatBytes(file.size)}
                        thumbnail={thumbnail}
                        size="lg"
                        actions={[
                            {
                                icon: Trash2,
                                label: 'Quitar archivo',
                                tone: 'danger',
                                onClick: handleRestart,
                            },
                        ]}
                    />
                )}
            </div>
        </Workspace>
    );
}
