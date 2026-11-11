'use client';

import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { 
    Image as ImageIcon, 
    Download, 
    Trash2, 
    Check, 
    Layers, 
    Archive 
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
import { 
    ProcessingView, 
    DownloadView, 
    PdfLoadingOverlay 
} from '@/components/tool/FlowViews';

interface ExtractedPage {
    index: number;
    thumbnail: string;
}

export default function PdfToJpgPage() {
    const tool = getTool('pdf-to-jpg');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<ExtractedPage[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [qualityScale, setQualityScale] = useState<number>(2.0); // 1.5 = Standard, 2.0 = HD, 3.0 = Ultra

    const loadPagesPreview = async (selectedFile: File) => {
        setLoading(true);
        setLoadingProgress(0);
        setPages([]);

        try {
            const buffer = await selectedFile.arrayBuffer();
            const pdf = await loadPdfDocument(buffer);
            const total = pdf.numPages;
            const previews: ExtractedPage[] = [];

            for (let i = 1; i <= total; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise;
                    previews.push({
                        index: i - 1,
                        thumbnail: canvas.toDataURL('image/jpeg', 0.8),
                    });
                }
                setLoadingProgress(Math.round((i / total) * 100));
            }

            setPages(previews);
        } catch (err) {
            console.error('Error loading PDF for JPG extraction:', err);
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
            loadPagesPreview(valid[0]);
        }
    };

    const handleConvert = () => {
        if (!file || pages.length === 0) return;

        run(async (setProgress) => {
            setProgress(5, 'Iniciando renderizado en alta definición…');
            const buffer = await file.arrayBuffer();
            const pdf = await loadPdfDocument(buffer);
            const total = pdf.numPages;
            const baseName = file.name.replace(/\.pdf$/i, '');

            if (total === 1) {
                // Single page export direct JPG
                setProgress(30, 'Renderizando página en resolución HD…');
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: qualityScale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas no disponible');

                await page.render({ canvasContext: ctx, viewport } as any).promise;
                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.95);
                });

                setProgress(100, '¡Imagen lista!');
                return {
                    blob,
                    fileName: `${baseName}-pagina-1.jpg`,
                };
            }

            // Multiple pages export to ZIP
            const zip = new JSZip();

            for (let i = 1; i <= total; i++) {
                setProgress(
                    10 + Math.round((i / total) * 80),
                    `Renderizando página ${i} de ${total} (${Math.round(qualityScale * 150)} DPI)…`
                );

                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: qualityScale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise;
                    const blob = await new Promise<Blob>((resolve) => {
                        canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.92);
                    });
                    zip.file(`${baseName}-pagina-${i}.jpg`, blob);
                }
            }

            setProgress(92, 'Generando archivo comprimido ZIP con todas las imágenes…');
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setProgress(100, '¡Descarga lista!');

            return {
                blob: zipBlob,
                fileName: `${baseName}-imagenes-jpg.zip`,
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
        return <ProcessingView title="Convirtiendo tu PDF a JPG…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        const isZip = pages.length > 1;
        return (
            <DownloadView
                title="¡Tus imágenes JPG están listas!"
                downloadLabel={isZip ? 'Descargar imágenes en ZIP' : 'Descargar imagen JPG'}
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="pdf-to-jpg"
            />
        );
    }

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle="Generando vistas previas de las páginas a convertir…"
                />
            )}

            <Workspace
                title="PDF a JPG"
                actionLabel="Convertir a JPG"
                onAction={handleConvert}
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
                        <SidebarSection title="Calidad de imagen">
                            <div className="space-y-2.5">
                                <OptionCard
                                    title="Estándar (Web / Móvil)"
                                    description="Resolución 150 DPI ligera. Rápida descarga para compartir por chat."
                                    selected={qualityScale === 1.5}
                                    onClick={() => setQualityScale(1.5)}
                                />
                                <OptionCard
                                    title="Alta Definición HD (Recomendada)"
                                    description="Resolución 300 DPI nítida. Excelente balance entre detalle y tamaño."
                                    selected={qualityScale === 2.0}
                                    onClick={() => setQualityScale(2.0)}
                                />
                                <OptionCard
                                    title="Ultra Definición Imprenta"
                                    description="Resolución máxima 450 DPI. Máxima fidelidad para impresiones profesionales."
                                    selected={qualityScale === 3.0}
                                    onClick={() => setQualityScale(3.0)}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen de exportación">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas a extraer" value={`${pages.length} imágenes`} />
                                <StatRow
                                    label="Formato de entrega"
                                    value={pages.length > 1 ? 'Archivo ZIP' : 'Imagen JPG directa'}
                                />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            Cada página de tu documento se renderizará fielmente como una imagen JPG independiente a todo color.
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
                            subtitle="JPG"
                            thumbnail={p.thumbnail}
                            size="md"
                        />
                    ))}
                </div>
            </Workspace>
        </>
    );
}
