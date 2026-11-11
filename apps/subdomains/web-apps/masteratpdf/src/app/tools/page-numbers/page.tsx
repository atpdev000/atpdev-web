'use client';

import React, { useState } from 'react';
import { 
    FileDigit, 
    Trash2, 
    Check, 
    Layers, 
    FileText, 
    Hash, 
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

type NumberPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type NumberFormat = 'page_n_of_total' | 'page_n' | 'n_of_total' | 'only_n';

export default function PageNumbersPage() {
    const tool = getTool('page-numbers');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile, error: thumbError } = usePageThumbnails();

    const [position, setPosition] = useState<NumberPosition>('bottom-center');
    const [format, setFormat] = useState<NumberFormat>('page_n_of_total');
    const [startFromPage, setStartFromPage] = useState<number>(1);
    const [firstNumber, setFirstNumber] = useState<number>(1);
    const [fontSize, setFontSize] = useState<number>(11);
    const [fontFamily, setFontFamily] = useState<'Helvetica' | 'TimesRoman' | 'Courier'>('Helvetica');

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

    const handleApplyNumbers = () => {
        if (!originalFile || pages.length === 0) return;

        run(async (setProgress) => {
            setProgress(10, 'Analizando dimensiones de las páginas…');
            const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
            const fileBuffer = await originalFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);

            let embeddedFont;
            if (fontFamily === 'TimesRoman') {
                embeddedFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            } else if (fontFamily === 'Courier') {
                embeddedFont = await pdfDoc.embedFont(StandardFonts.Courier);
            } else {
                embeddedFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            }

            const total = pdfDoc.getPageCount();
            const startIdx = Math.max(0, startFromPage - 1);

            setProgress(30, 'Numerando páginas del documento…');

            for (let i = startIdx; i < total; i++) {
                const page = pdfDoc.getPage(i);
                const { width, height } = page.getSize();
                const currentNumber = firstNumber + (i - startIdx);

                let text = '';
                if (format === 'page_n_of_total') {
                    text = `Página ${currentNumber} de ${total - startIdx}`;
                } else if (format === 'page_n') {
                    text = `Página ${currentNumber}`;
                } else if (format === 'n_of_total') {
                    text = `${currentNumber} / ${total - startIdx}`;
                } else {
                    text = `${currentNumber}`;
                }

                const textWidth = embeddedFont.widthOfTextAtSize(text, fontSize);
                const margin = 35;

                let x = (width - textWidth) / 2;
                let y = margin;

                if (position === 'top-left') {
                    x = margin;
                    y = height - margin;
                } else if (position === 'top-center') {
                    x = (width - textWidth) / 2;
                    y = height - margin;
                } else if (position === 'top-right') {
                    x = width - margin - textWidth;
                    y = height - margin;
                } else if (position === 'bottom-left') {
                    x = margin;
                    y = margin;
                } else if (position === 'bottom-center') {
                    x = (width - textWidth) / 2;
                    y = margin;
                } else if (position === 'bottom-right') {
                    x = width - margin - textWidth;
                    y = margin;
                }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font: embeddedFont,
                    color: rgb(0.2, 0.2, 0.2),
                });

                setProgress(
                    30 + Math.round(((i - startIdx + 1) / (total - startIdx)) * 55),
                    `Numerando página ${i + 1} de ${total}…`
                );
            }

            setProgress(90, 'Generando archivo final…');
            const pdfBytes = await pdfDoc.save();
            setProgress(100, '¡Descarga lista!');

            const baseName = originalFile.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-numerado.pdf`,
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
        return <ProcessingView title="Insertando números de página…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu PDF se ha numerado con éxito!"
                downloadLabel="Descargar PDF numerado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="page-numbers"
            />
        );
    }

    const positions: { id: NumberPosition; label: string }[] = [
        { id: 'top-left', label: 'Arriba Izq' },
        { id: 'top-center', label: 'Arriba Centro' },
        { id: 'top-right', label: 'Arriba Der' },
        { id: 'bottom-left', label: 'Abajo Izq' },
        { id: 'bottom-center', label: 'Abajo Centro' },
        { id: 'bottom-right', label: 'Abajo Der' },
    ];

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
                title="Numerar páginas"
                actionLabel="Insertar números"
                onAction={handleApplyNumbers}
                actionDisabled={!originalFile}
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
                        <SidebarSection title="Posición en la página">
                            <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-canvas border border-line">
                                {positions.map((p) => {
                                    const isSelected = position === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPosition(p.id)}
                                            className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-brand text-white shadow-sm'
                                                    : 'bg-surface border border-line text-ink-2 hover:border-line-strong hover:text-ink'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Formato del número">
                            <div className="space-y-2">
                                <OptionCard
                                    title="Página 1 de N"
                                    description="Ejemplo: Página 1 de 24 (Ideal para informes y tesis)"
                                    selected={format === 'page_n_of_total'}
                                    onClick={() => setFormat('page_n_of_total')}
                                />
                                <OptionCard
                                    title="1 / N"
                                    description="Ejemplo: 1 / 24 (Compacto y moderno)"
                                    selected={format === 'n_of_total'}
                                    onClick={() => setFormat('n_of_total')}
                                />
                                <OptionCard
                                    title="Página 1"
                                    description="Ejemplo: Página 1"
                                    selected={format === 'page_n'}
                                    onClick={() => setFormat('page_n')}
                                />
                                <OptionCard
                                    title="Solo el número"
                                    description="Ejemplo: 1, 2, 3..."
                                    selected={format === 'only_n'}
                                    onClick={() => setFormat('only_n')}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Rango de aplicación">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                                        Empezar en pág.
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={pages.length || 1}
                                        value={startFromPage}
                                        onChange={(e) => setStartFromPage(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-xs font-bold text-ink"
                                    />
                                    <span className="text-[10px] text-muted block mt-0.5">
                                        (Pon 2 para saltar portada)
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                                        Primer número
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={firstNumber}
                                        onChange={(e) => setFirstNumber(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-xs font-bold text-ink"
                                    />
                                    <span className="text-[10px] text-muted block mt-0.5">
                                        Número inicial
                                    </span>
                                </div>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Tipografía y Tamaño">
                            <Segmented
                                value={fontFamily}
                                onChange={(val) => setFontFamily(val as any)}
                                options={[
                                    { value: 'Helvetica', label: 'Helvetica' },
                                    { value: 'TimesRoman', label: 'Times' },
                                    { value: 'Courier', label: 'Courier' },
                                ]}
                            />
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Páginas a numerar" value={`${Math.max(0, pages.length - startFromPage + 1)} págs`} />
                                <StatRow label="Tipografía" value={`${fontFamily} · ${fontSize}pt`} />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            Haz clic en la lupa de cualquier página para inspeccionarla en pantalla completa con alta resolución.
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
                            subtitle={p.pageIndex + 1 >= startFromPage ? `Nº ${firstNumber + (p.pageIndex - (startFromPage - 1))}` : 'Sin número'}
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
