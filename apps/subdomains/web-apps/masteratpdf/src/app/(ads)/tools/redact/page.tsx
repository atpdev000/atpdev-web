'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eraser, Trash2, X } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument, formatPdfError } from '@/lib/pdf/pdfHelper';
import { postToBackend, isHttpClientError } from '@/lib/pdf/backendClient';
import { type RedactionBox } from '@/lib/pdf/pdfRedactor';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { Workspace, SidebarSection, StatRow, Notice } from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

export default function RedactPage() {
    const tool = getTool('redact');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [redactions, setRedactions] = useState<RedactionBox[]>([]);
    const [dragBox, setDragBox] = useState<{ startX: number; startY: number; curX: number; curY: number } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const render = async () => {
            if (!file) return;
            try {
                const buf = await file.arrayBuffer();
                const pdf = await loadPdfDocument(buf);
                if (cancelled) return;
                setNumPages(pdf.numPages);
                const page = await pdf.getPage(Math.min(currentPage + 1, pdf.numPages));
                const vp = page.getViewport({ scale: 1.3 });
                const canvas = document.createElement('canvas');
                canvas.width = vp.width;
                canvas.height = vp.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
                    if (!cancelled) setPreviewUrl(canvas.toDataURL('image/jpeg', 0.92));
                }
            } catch (err) {
                if (!cancelled) setError(formatPdfError(err));
            }
        };
        render();
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
            setRedactions([]);
        }
    };

    const getRelCoords = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = containerRef.current;
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
            x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return;
        const pt = getRelCoords(e);
        setDragBox({ startX: pt.x, startY: pt.y, curX: pt.x, curY: pt.y });
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragBox) return;
        const pt = getRelCoords(e);
        setDragBox((prev) => (prev ? { ...prev, curX: pt.x, curY: pt.y } : null));
    };

    const handlePointerUp = () => {
        if (!dragBox) return;
        const x = Math.min(dragBox.startX, dragBox.curX);
        const y = Math.min(dragBox.startY, dragBox.curY);
        const width = Math.abs(dragBox.curX - dragBox.startX);
        const height = Math.abs(dragBox.curY - dragBox.startY);
        setDragBox(null);

        if (width > 0.015 && height > 0.01) {
            setRedactions((prev) => [
                ...prev,
                {
                    id: `red-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    pageIndex: currentPage,
                    x,
                    y,
                    width,
                    height,
                },
            ]);
        }
    };

    const handleApplyRedact = () => {
        if (!file || redactions.length === 0) return;

        run(async (setProgress) => {
            setProgress(15, 'Preparando áreas de censura irreversible…');
            const baseName = file.name.replace(/\.pdf$/i, '');

            // 1. Preferir PyMuPDF apply_redactions en servidor (purga texto y vectores del stream)
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('redactions', JSON.stringify(redactions));

                setProgress(45, 'Eliminando texto y objetos subyacentes del PDF…');
                const res = await postToBackend('/api/convert/redact', formData);
                const blob = await res.blob();
                setProgress(100, '¡Censura aplicada permanentemente!');
                return {
                    blob,
                    fileName: `${baseName}-censurado.pdf`,
                };
            } catch (err: unknown) {
                if (isHttpClientError(err)) {
                    throw err;
                }
            }

            // 2. Fallback seguro en navegador: rasterizar páginas censuradas para no dejar texto seleccionable oculto
            setProgress(35, 'Aplanando páginas censuradas para eliminación irreversible…');
            const buffer = await file.arrayBuffer();
            const pdfJsDoc = await loadPdfDocument(buffer);
            const { PDFDocument } = await import('pdf-lib');
            const targetPdf = await PDFDocument.load(buffer);

            const byPage = new Map<number, RedactionBox[]>();
            for (const r of redactions) {
                if (!byPage.has(r.pageIndex)) byPage.set(r.pageIndex, []);
                byPage.get(r.pageIndex)!.push(r);
            }

            for (const [pageIdx, boxes] of byPage.entries()) {
                setProgress(55, `Aplanando página ${pageIdx + 1}…`);
                const pdfJsPage = await pdfJsDoc.getPage(pageIdx + 1);
                const origVp = pdfJsPage.getViewport({ scale: 1 });
                const renderVp = pdfJsPage.getViewport({ scale: 2.0 });

                const canvas = document.createElement('canvas');
                canvas.width = renderVp.width;
                canvas.height = renderVp.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                await pdfJsPage.render({ canvasContext: ctx, canvas, viewport: renderVp }).promise;

                ctx.fillStyle = '#000000';
                for (const b of boxes) {
                    ctx.fillRect(
                        b.x * canvas.width,
                        b.y * canvas.height,
                        b.width * canvas.width,
                        b.height * canvas.height
                    );
                }

                const jpgBlob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.92);
                });
                const embedded = await targetPdf.embedJpg(await jpgBlob.arrayBuffer());

                targetPdf.removePage(pageIdx);
                const replacedPage = targetPdf.insertPage(pageIdx, [origVp.width, origVp.height]);
                replacedPage.drawImage(embedded, {
                    x: 0,
                    y: 0,
                    width: origVp.width,
                    height: origVp.height,
                });
            }

            const outBytes = await targetPdf.save();
            setProgress(100, '¡PDF censurado sin texto oculto!');
            return {
                blob: new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-censurado.pdf`,
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setPreviewUrl(null);
        setRedactions([]);
        reset();
    };

    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar PDF a censurar"
                dropLabel="o arrastra el documento aquí"
                error={error}
                onFiles={handleUpload}
            />
        );
    }

    if (stage === 'processing') {
        return <ProcessingView title="Censurando información sensible…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Documento censurado permanentemente!"
                downloadLabel="Descargar PDF Censurado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="redact"
            />
        );
    }

    const currentBoxes = redactions.filter((r) => r.pageIndex === currentPage);

    return (
        <Workspace
            title={tool.name}
            actionLabel="Censurar permanentemente"
            onAction={handleApplyRedact}
            actionDisabled={redactions.length === 0}
            actionHint={redactions.length === 0 ? 'Arrastra sobre la página para marcar un área confidencial.' : undefined}
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
                        {currentBoxes.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setRedactions((prev) => prev.filter((r) => r.pageIndex !== currentPage))}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-semibold text-ink cursor-pointer"
                            >
                                <Eraser className="w-3.5 h-3.5" />
                                <span>Limpiar página</span>
                            </button>
                        )}
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
                    <SidebarSection title="Resumen de censura">
                        <StatRow label="Zonas marcadas" value={`${redactions.length}`} />
                        <StatRow label="En esta página" value={`${currentBoxes.length}`} />
                        <StatRow label="Eliminación" value="Irreversible (sin texto oculto)" />
                    </SidebarSection>

                    <Notice tone="warn">
                        A diferencia de un simple rectángulo visual, esta herramienta purga realmente el texto debajo del bloque negro para que nadie pueda copiarlo.
                    </Notice>
                </div>
            }
        >
            <div className="flex justify-center">
                <div
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="relative inline-block bg-white rounded-xl shadow-lift border border-line overflow-hidden cursor-crosshair touch-none select-none"
                >
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt={`Página ${currentPage + 1}`}
                            className="max-h-[72vh] w-auto object-contain pointer-events-none"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-[420px] h-[560px] flex items-center justify-center text-xs text-muted">
                            Renderizando página…
                        </div>
                    )}

                    {currentBoxes.map((b) => (
                        <div
                            key={b.id}
                            className="absolute bg-black/85 border border-red-400"
                            style={{
                                left: `${b.x * 100}%`,
                                top: `${b.y * 100}%`,
                                width: `${b.width * 100}%`,
                                height: `${b.height * 100}%`,
                            }}
                        >
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRedactions((prev) => prev.filter((item) => item.id !== b.id));
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center shadow-sm cursor-pointer"
                                title="Eliminar censura"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {dragBox && (
                        <div
                            className="absolute bg-black/60 border-2 border-dashed border-brand pointer-events-none"
                            style={{
                                left: `${Math.min(dragBox.startX, dragBox.curX) * 100}%`,
                                top: `${Math.min(dragBox.startY, dragBox.curY) * 100}%`,
                                width: `${Math.abs(dragBox.curX - dragBox.startX) * 100}%`,
                                height: `${Math.abs(dragBox.curY - dragBox.startY) * 100}%`,
                            }}
                        />
                    )}
                </div>
            </div>
        </Workspace>
    );
}

