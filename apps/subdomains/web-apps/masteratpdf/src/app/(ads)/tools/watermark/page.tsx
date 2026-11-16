'use client';

import React, { useState } from 'react';
import { 
    Stamp, 
    Trash2, 
    Check, 
    FileText, 
    Sparkles 
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

type WatermarkPlacement = 'diagonal' | 'center' | 'top' | 'bottom';
type WatermarkColor = 'gray' | 'red' | 'blue';

export default function WatermarkPage() {
    const tool = getTool('watermark');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile, error: thumbError } = usePageThumbnails();

    const [text, setText] = useState<string>('CONFIDENCIAL');
    const [placement, setPlacement] = useState<WatermarkPlacement>('diagonal');
    const [opacity, setOpacity] = useState<number>(0.25);
    const [color, setColor] = useState<WatermarkColor>('gray');
    const [fontSize, setFontSize] = useState<number>(48);

    // Zoom modal state
    const [zoomedPageIndex, setZoomedPageIndex] = useState<number | null>(null);

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

    const handleApplyWatermark = () => {
        if (!originalFile || pages.length === 0 || !text.trim()) {
            setError('Por favor escribe un texto para la marca de agua.');
            return;
        }

        run(async (setProgress) => {
            setProgress(10, 'Analizando páginas para incrustar marca…');
            const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
            const fileBuffer = await originalFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            const total = pdfDoc.getPageCount();

            // Color values
            let textColor = rgb(0.5, 0.5, 0.5);
            if (color === 'red') textColor = rgb(0.85, 0.2, 0.2);
            if (color === 'blue') textColor = rgb(0.15, 0.4, 0.85);

            setProgress(30, 'Estampando marca de agua en cada página…');

            for (let i = 0; i < total; i++) {
                const page = pdfDoc.getPage(i);
                const { width, height } = page.getSize();
                const textWidth = font.widthOfTextAtSize(text, fontSize);
                const textHeight = font.heightAtSize(fontSize);

                if (placement === 'diagonal') {
                    // Center diagonal 45 degrees
                    const angle = 45;
                    const rad = (angle * Math.PI) / 180;
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);

                    const x = (width - (textWidth * cos - textHeight * sin)) / 2;
                    const y = (height - (textWidth * sin + textHeight * cos)) / 2;

                    page.drawText(text, {
                        x,
                        y,
                        size: fontSize,
                        font,
                        color: textColor,
                        opacity,
                        rotate: degrees(angle),
                    });
                } else if (placement === 'center') {
                    page.drawText(text, {
                        x: (width - textWidth) / 2,
                        y: (height - textHeight) / 2,
                        size: fontSize,
                        font,
                        color: textColor,
                        opacity,
                    });
                } else if (placement === 'top') {
                    page.drawText(text, {
                        x: (width - textWidth) / 2,
                        y: height - 50,
                        size: Math.min(28, fontSize),
                        font,
                        color: textColor,
                        opacity,
                    });
                } else if (placement === 'bottom') {
                    page.drawText(text, {
                        x: (width - textWidth) / 2,
                        y: 40,
                        size: Math.min(28, fontSize),
                        font,
                        color: textColor,
                        opacity,
                    });
                }

                setProgress(
                    30 + Math.round(((i + 1) / total) * 60),
                    `Estampando página ${i + 1} de ${total}…`
                );
            }

            setProgress(92, 'Generando archivo final protegido…');
            const pdfBytes = await pdfDoc.save();
            setProgress(100, '¡Descarga lista!');

            const baseName = originalFile.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-marca-de-agua.pdf`,
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
                buttonLabel="Seleccionar archivo PDF"
                dropLabel="o arrastra y suelta el PDF aquí"
                error={error || thumbError}
                onFiles={handleUpload}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Estampando marca de agua…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu PDF con marca de agua está listo!"
                downloadLabel="Descargar PDF con marca de agua"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="watermark"
            />
        );
    }

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle="Generando vistas previas de las páginas…"
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
                title="Marca de agua"
                actionLabel="Insertar marca de agua"
                onAction={handleApplyWatermark}
                actionDisabled={!originalFile || !text.trim()}
                error={error || thumbError}
                toolbar={
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {pages.length} {pages.length === 1 ? 'página' : 'páginas'}
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
                        <SidebarSection title="Texto de la marca">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="CONFIDENCIAL, BORRADOR, etc."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm font-bold text-ink uppercase placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                            />
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {['CONFIDENCIAL', 'BORRADOR', 'NO COPIAR', 'ATP DEV'].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setText(preset)}
                                        className="px-2 py-1 rounded-md bg-surface border border-line text-[10px] font-bold text-ink-2 hover:border-line-strong hover:text-ink transition-colors cursor-pointer"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Posición">
                            <Segmented
                                value={placement}
                                onChange={(val) => setPlacement(val as WatermarkPlacement)}
                                options={[
                                    { value: 'diagonal', label: 'Diagonal 45°' },
                                    { value: 'center', label: 'Centro' },
                                    { value: 'top', label: 'Superior' },
                                    { value: 'bottom', label: 'Inferior' },
                                ]}
                            />
                        </SidebarSection>

                        <SidebarSection title="Color y Visibilidad">
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'gray', label: 'Gris Carbón', bg: '#64748b' },
                                    { id: 'red', label: 'Rojo Alerta', bg: '#ef4444' },
                                    { id: 'blue', label: 'Azul Oficial', bg: '#3b82f6' },
                                ].map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setColor(c.id as WatermarkColor)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                            color === c.id
                                                ? 'border-brand bg-brand-soft text-brand'
                                                : 'border-line bg-surface text-ink-2 hover:border-line-strong'
                                        }`}
                                    >
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.bg }} />
                                        <span>{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>

                        <SidebarSection title={`Transparencia: ${Math.round(opacity * 100)}%`}>
                            <input
                                type="range"
                                min={0.1}
                                max={0.8}
                                step={0.05}
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full accent-[var(--brand)] cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-muted font-medium mt-1">
                                <span>10% Discreto</span>
                                <span>30% Estándar</span>
                                <span>80% Intenso</span>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas a estampar" value={`${pages.length} págs`} />
                                <StatRow label="Posición" value={placement === 'diagonal' ? 'Diagonal 45°' : 'Centrado'} />
                                <StatRow label="Opacidad" value={`${Math.round(opacity * 100)}%`} />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            Haz clic en la lupa de cualquier página para inspeccionar el documento en alta definición.
                        </Notice>
                    </div>
                }
            >
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                    {pages.map((p) => (
                        <ThumbCard
                            key={p.id}
                            index={p.pageIndex + 1}
                            title={`Página ${p.pageIndex + 1}`}
                            subtitle={text || 'Marca'}
                            thumbnail={p.thumbnail}
                            size="md"
                            onZoom={() => setZoomedPageIndex(p.pageIndex)}
                        />
                    ))}
                </div>
            </Workspace>
        </>
    );
}
