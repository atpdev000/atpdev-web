'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, PenTool, Trash2, Type, Upload, X } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { loadPdfDocument, formatPdfError } from '@/lib/pdf/pdfHelper';
import { applySignaturesToPdf, type SignaturePlacement } from '@/lib/pdf/pdfSigner';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { Workspace, SidebarSection, Segmented, StatRow, Notice } from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

interface PlacedSig {
    id: string;
    pageIndex: number;
    x: number; // left 0..1
    topY: number; // top 0..1 (for UI preview)
    width: number; // 0..1
    height: number; // 0..1
    dataUrl: string;
}

export default function SignPage() {
    const tool = getTool('sign');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pageAspect, setPageAspect] = useState<number>(595 / 842);

    const [sigMode, setSigMode] = useState<'draw' | 'type' | 'upload'>('draw');
    const [inkColor, setInkColor] = useState<string>('#111827');
    const [typedName, setTypedName] = useState<string>('');
    const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
    const [sigAspect, setSigAspect] = useState<number>(2.5);
    const [sigWidthPct, setSigWidthPct] = useState<number>(0.24);
    const [placements, setPlacements] = useState<PlacedSig[]>([]);

    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const sigInputRef = useRef<HTMLInputElement>(null);

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
                setPageAspect(vp.width / vp.height);

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

    // Generar firma a partir de texto
    useEffect(() => {
        if (sigMode !== 'type') return;
        const raf = window.requestAnimationFrame(() => {
            const text = typedName.trim();
            if (!text) {
                setSignatureDataUrl('');
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 160;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = inkColor;
            ctx.font = 'italic 54px Georgia, "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            setSigAspect(500 / 160);
            setSignatureDataUrl(canvas.toDataURL('image/png'));
        });
        return () => window.cancelAnimationFrame(raf);
    }, [typedName, inkColor, sigMode]);

    const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        drawingRef.current = true;
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) return;
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const handleCanvasPointerUp = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        const canvas = drawCanvasRef.current;
        if (canvas) {
            setSigAspect(canvas.width / canvas.height);
            setSignatureDataUrl(canvas.toDataURL('image/png'));
        }
    };

    const handleClearCanvas = () => {
        const canvas = drawCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        setSignatureDataUrl('');
    };

    const handleUploadSignatureImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const imgFile = e.target.files?.[0];
        if (!imgFile) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || '');
            const img = new Image();
            img.onload = () => {
                setSigAspect(img.naturalWidth / Math.max(1, img.naturalHeight));
                setSignatureDataUrl(dataUrl);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(imgFile);
    };

    const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!signatureDataUrl) {
            setError('Primero dibuja, escribe o sube tu firma en el panel derecho.');
            return;
        }
        setError(null);
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / rect.width;
        const clickY = (e.clientY - rect.top) / rect.height;

        const w = sigWidthPct;
        const h = Math.min(0.45, (w * pageAspect) / Math.max(0.4, sigAspect));
        const x = Math.max(0, Math.min(1 - w, clickX - w / 2));
        const topY = Math.max(0, Math.min(1 - h, clickY - h / 2));

        setPlacements((prev) => [
            ...prev,
            {
                id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                pageIndex: currentPage,
                x,
                topY,
                width: w,
                height: h,
                dataUrl: signatureDataUrl,
            },
        ]);
    };

    const handleUploadPdf = (files: File[]) => {
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
            setPlacements([]);
        }
    };

    const handleSignSave = () => {
        if (!file || placements.length === 0) return;

        run(async (setProgress) => {
            setProgress(25, 'Preparando firmas incrustadas…');
            const buffer = await file.arrayBuffer();
            const pdfPlacements: SignaturePlacement[] = placements.map((p) => ({
                pageIndex: p.pageIndex,
                x: p.x,
                y: Math.max(0, 1 - (p.topY + p.height)),
                width: p.width,
                height: p.height,
                signatureDataUrl: p.dataUrl,
            }));

            setProgress(70, 'Estampando firmas sobre el PDF…');
            const outBytes = await applySignaturesToPdf(buffer, pdfPlacements);
            setProgress(100, '¡PDF firmado con éxito!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-firmado.pdf`,
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        setPreviewUrl(null);
        setPlacements([]);
        reset();
    };

    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar PDF a firmar"
                dropLabel="o arrastra el archivo PDF aquí"
                error={error}
                onFiles={handleUploadPdf}
            />
        );
    }

    if (stage === 'processing') {
        return <ProcessingView title="Estampando firma en tu PDF…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        return (
            <DownloadView
                title="¡PDF firmado con éxito!"
                downloadLabel="Descargar PDF Firmado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="sign"
            />
        );
    }

    const currentPlacements = placements.filter((p) => p.pageIndex === currentPage);

    return (
        <Workspace
            title={tool.name}
            actionLabel="Firmar y descargar"
            onAction={handleSignSave}
            actionDisabled={placements.length === 0}
            actionHint={placements.length === 0 ? 'Haz clic sobre el documento para colocar tu firma.' : undefined}
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
                <div className="space-y-5">
                    <SidebarSection title="Crear firma">
                        <Segmented
                            value={sigMode}
                            onChange={(v) => setSigMode(v as 'draw' | 'type' | 'upload')}
                            options={[
                                { value: 'draw', label: 'Dibujar', icon: <PenTool className="w-3.5 h-3.5" /> },
                                { value: 'type', label: 'Escribir', icon: <Type className="w-3.5 h-3.5" /> },
                                { value: 'upload', label: 'Imagen', icon: <Upload className="w-3.5 h-3.5" /> },
                            ]}
                        />

                        {sigMode === 'draw' && (
                            <div className="space-y-2 pt-2">
                                <canvas
                                    ref={drawCanvasRef}
                                    width={360}
                                    height={140}
                                    onPointerDown={handleCanvasPointerDown}
                                    onPointerMove={handleCanvasPointerMove}
                                    onPointerUp={handleCanvasPointerUp}
                                    onPointerLeave={handleCanvasPointerUp}
                                    className="w-full h-32 rounded-xl border border-line bg-white cursor-crosshair touch-none"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {['#111827', '#1d4ed8', '#b91c1c'].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setInkColor(c)}
                                                className={`w-5 h-5 rounded-full border-2 cursor-pointer ${
                                                    inkColor === c ? 'border-brand scale-110' : 'border-line'
                                                }`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClearCanvas}
                                        className="text-xs font-semibold text-muted hover:text-danger cursor-pointer"
                                    >
                                        Limpiar trazo
                                    </button>
                                </div>
                            </div>
                        )}

                        {sigMode === 'type' && (
                            <div className="space-y-2 pt-2">
                                <input
                                    type="text"
                                    value={typedName}
                                    onChange={(e) => setTypedName(e.target.value)}
                                    placeholder="Escribe tu nombre o firma…"
                                    className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-sm font-serif italic text-ink"
                                />
                            </div>
                        )}

                        {sigMode === 'upload' && (
                            <div className="pt-2">
                                <input
                                    ref={sigInputRef}
                                    type="file"
                                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                                    className="hidden"
                                    onChange={handleUploadSignatureImage}
                                />
                                <button
                                    type="button"
                                    onClick={() => sigInputRef.current?.click()}
                                    className="w-full py-2.5 rounded-xl border border-dashed border-line-strong bg-canvas text-xs font-bold text-ink hover:border-brand cursor-pointer"
                                >
                                    Subir imagen PNG / JPG de firma
                                </button>
                            </div>
                        )}
                    </SidebarSection>

                    <SidebarSection title={`Tamaño de firma: ${Math.round(sigWidthPct * 100)}%`}>
                        <input
                            type="range"
                            min={0.12}
                            max={0.5}
                            step={0.02}
                            value={sigWidthPct}
                            onChange={(e) => setSigWidthPct(Number(e.target.value))}
                            className="w-full accent-[var(--brand)] cursor-pointer"
                        />
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <StatRow label="Firmas colocadas" value={`${placements.length}`} />
                        <StatRow label="Estado firma" value={signatureDataUrl ? 'Lista para estampar' : 'Sin definir'} />
                    </SidebarSection>

                    <Notice tone="info">
                        Crea tu firma arriba y luego haz clic en cualquier punto del documento para estamparla. Puedes añadir varias firmas en distintas páginas.
                    </Notice>
                </div>
            }
        >
            <div className="flex justify-center">
                <div
                    onClick={handlePageClick}
                    className="relative inline-block bg-white rounded-xl shadow-lift border border-line overflow-hidden cursor-crosshair"
                >
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt={`Página ${currentPage + 1}`}
                            className="max-h-[72vh] w-auto object-contain select-none"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-[420px] h-[560px] flex items-center justify-center text-xs text-muted">
                            Renderizando página…
                        </div>
                    )}

                    {currentPlacements.map((p) => (
                        <div
                            key={p.id}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute border border-dashed border-brand bg-brand/5 group"
                            style={{
                                left: `${p.x * 100}%`,
                                top: `${p.topY * 100}%`,
                                width: `${p.width * 100}%`,
                                height: `${p.height * 100}%`,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.dataUrl} alt="Firma" className="w-full h-full object-contain pointer-events-none" />
                            <button
                                type="button"
                                onClick={() => setPlacements((prev) => prev.filter((item) => item.id !== p.id))}
                                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center shadow-sm cursor-pointer"
                                title="Quitar firma"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Workspace>
    );
}

