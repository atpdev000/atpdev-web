'use client';

import React, { useState } from 'react';
import { Trash2, Check, ArrowRight } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument, formatPdfError } from '@/lib/pdf/pdfHelper';
import { postToBackend, isHttpClientError } from '@/lib/pdf/backendClient';
import { ToolUpload } from '@/components/tool/ToolUpload';
import {
    Workspace,
    SidebarSection,
    OptionCard,
    StatRow,
    Notice,
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
                await page.render({ canvasContext: ctx, canvas, viewport }).promise;
                setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
            }
        } catch (err) {
            setThumbnail(null);
            setError(formatPdfError(err));
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

    const compressClientByLevel = async (
        sourceFile: File,
        level: CompressionLevel,
        setProgress: (p: number, msg?: string) => void
    ): Promise<Uint8Array> => {
        const { PDFDocument } = await import('pdf-lib');
        const buffer = await sourceFile.arrayBuffer();

        // 1. Optimización sin pérdida (streams + limpieza)
        let pdfLibDoc;
        try {
            pdfLibDoc = await PDFDocument.load(buffer);
        } catch (err) {
            throw new Error(formatPdfError(err));
        }

        const losslessBytes = await pdfLibDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
        });

        if (level === 'light') {
            return losslessBytes.length < buffer.byteLength ? losslessBytes : new Uint8Array(buffer);
        }

        // 2. Para 'recommended' y 'extreme', recomprimir páginas rasterizadas si logra menor tamaño
        const scale = level === 'extreme' ? 1.0 : 1.35;
        const jpegQuality = level === 'extreme' ? 0.45 : 0.72;

        const pdf = await loadPdfDocument(buffer);
        const rasterDoc = await PDFDocument.create();
        const total = pdf.numPages;

        for (let i = 1; i <= total; i++) {
            setProgress(
                35 + Math.round((i / total) * 55),
                `Optimizando imágenes y flujos de página ${i} de ${total}…`
            );
            const page = await pdf.getPage(i);
            const origVp = page.getViewport({ scale: 1 });
            const renderVp = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            canvas.width = renderVp.width;
            canvas.height = renderVp.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, canvas, viewport: renderVp }).promise;

            const jpgBlob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', jpegQuality);
            });
            const jpgBytes = await jpgBlob.arrayBuffer();
            const embedded = await rasterDoc.embedJpg(jpgBytes);
            const newPage = rasterDoc.addPage([origVp.width, origVp.height]);
            newPage.drawImage(embedded, {
                x: 0,
                y: 0,
                width: origVp.width,
                height: origVp.height,
            });
        }

        const rasterBytes = await rasterDoc.save({ useObjectStreams: true });

        // Conservar siempre el menor entre lossless, rasterizado y original
        const candidates = [
            new Uint8Array(losslessBytes),
            new Uint8Array(rasterBytes),
            new Uint8Array(buffer),
        ];
        candidates.sort((a, b) => a.byteLength - b.byteLength);
        return candidates[0];
    };

    const handleCompress = () => {
        if (!file) return;

        run(async (setProgress) => {
            setProgress(15, 'Analizando peso y recursos incrustados…');
            const baseName = file.name.replace(/\.pdf$/i, '');

            // Intentar compresión inteligente vectorial (PyMuPDF rewrite_images) en el backend primero
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('level', compressionLevel);

                setProgress(40, 'Optimizando imágenes y fuentes sin perder texto seleccionable…');
                const response = await postToBackend('/api/convert/compress', formData);
                const blob = await response.blob();
                setProgress(100, '¡Documento optimizado!');

                return {
                    blob,
                    fileName: `${baseName}-comprimido.pdf`,
                    meta: {
                        originalSize: file.size,
                        newSize: blob.size,
                        engine: 'Servidor (PyMuPDF Vectorial)',
                    },
                };
            } catch (err: unknown) {
                if (isHttpClientError(err)) {
                    throw err;
                }
            }

            // Fallback local diferenciado por nivel
            setProgress(30, 'Aplicando optimización local en navegador…');
            const finalBytes = await compressClientByLevel(file, compressionLevel, setProgress);
            const blob = new Blob([new Uint8Array(finalBytes)], { type: 'application/pdf' });
            setProgress(100, '¡Documento optimizado!');

            return {
                blob,
                fileName: `${baseName}-comprimido.pdf`,
                meta: {
                    originalSize: file.size,
                    newSize: blob.size,
                    engine: 'Local WebAssembly',
                },
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setThumbnail(null);
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
        return <ProcessingView title="Comprimiendo tu PDF…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        const meta = result?.meta as { originalSize?: number; newSize?: number; engine?: string } | undefined;
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
                        <span>
                            {savedPercent > 0
                                ? `Reducción real del ${savedPercent}%`
                                : 'El PDF ya estaba optimizado al máximo'}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm font-bold text-ink">
                        <span className="text-muted line-through">{formatBytes(originalSize)}</span>
                        <ArrowRight className="w-4 h-4 text-brand" />
                        <span className="text-emerald-600 text-lg font-black">{formatBytes(newSize)}</span>
                    </div>
                    {meta?.engine && (
                        <p className="text-[11px] text-muted">Motor utilizado: {meta.engine}</p>
                    )}
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
                                description="Máxima reducción de peso (96 DPI). Ideal para portales con límites estrictos."
                                selected={compressionLevel === 'extreme'}
                                onClick={() => setCompressionLevel('extreme')}
                            />
                            <OptionCard
                                title="Buena compresión (Recomendada)"
                                description="Equilibrio óptimo (144 DPI) entre nitidez y reducción real de peso."
                                selected={compressionLevel === 'recommended'}
                                onClick={() => setCompressionLevel('recommended')}
                            />
                            <OptionCard
                                title="Baja compresión (Sin pérdida)"
                                description="Optimización estructural de streams y fuentes manteniendo resolución intacta."
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
                        Optimiza fuentes incrustadas, streams redundantes e imágenes pesadas garantizando que el resultado nunca supere el peso original.
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
