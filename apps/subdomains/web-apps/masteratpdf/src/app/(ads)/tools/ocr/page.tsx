'use client';

import React, { useState } from 'react';
import {
    FileText,
    Search,
    Trash2,
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
    Notice,
} from '@/components/tool/Workspace';
import { ThumbCard } from '@/components/tool/ThumbCard';
import {
    ProcessingView,
    DownloadView,
    PdfLoadingOverlay,
} from '@/components/tool/FlowViews';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { loadPdfDocument, formatPdfError, extractPdfTextItems } from '@/lib/pdf/pdfHelper';
import { postToBackend, isHttpClientError } from '@/lib/pdf/backendClient';

type OcrLanguage = 'spa' | 'eng' | 'fra' | 'deu';

export default function OcrPage() {
    const tool = getTool('ocr');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile, error: thumbError } = usePageThumbnails();

    const [language, setLanguage] = useState<OcrLanguage>('spa');
    const [outputMode, setOutputMode] = useState<'searchable_pdf' | 'text_file'>('searchable_pdf');

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

    const handleRunOcr = () => {
        if (!originalFile) return;

        run(async (setProgress) => {
            setProgress(10, 'Analizando capas del documento PDF…');
            const baseName = originalFile.name.replace(/\.pdf$/i, '');

            // 1. Intentar motor OCR en servidor (EasyOCR / Tesseract)
            try {
                const formData = new FormData();
                formData.append('file', originalFile);
                formData.append('language', language);
                formData.append('output_mode', outputMode);

                setProgress(30, 'Ejecutando reconocimiento óptico (OCR) en servidor…');
                const res = await postToBackend('/api/convert/ocr', formData, 180000);
                setProgress(90, 'Generando archivo con texto indexado…');
                const blob = await res.blob();
                setProgress(100, '¡OCR completado con éxito!');

                return {
                    blob,
                    fileName: outputMode === 'text_file' ? `${baseName}-ocr.txt` : `${baseName}-buscable.pdf`,
                    meta: { engine: `Servidor (${res.headers.get('X-Conversion-Method') || 'OCR'})` },
                };
            } catch (err: unknown) {
                if (isHttpClientError(err)) {
                    throw err;
                }
            }

            // 2. Fallback OCR real 100% en navegador con Tesseract.js (WebAssembly)
            setProgress(20, 'Inicializando motor OCR Tesseract WebAssembly local…');
            const buffer = await originalFile.arrayBuffer();

            let pdfDoc;
            try {
                pdfDoc = await loadPdfDocument(buffer);
            } catch (err) {
                throw new Error(formatPdfError(err));
            }

            const numPages = pdfDoc.numPages;
            const targetPdf = outputMode === 'searchable_pdf' ? await PDFDocument.load(buffer) : null;
            const font = targetPdf ? await targetPdf.embedFont(StandardFonts.Helvetica) : null;
            const pdfPages = targetPdf ? targetPdf.getPages() : [];

            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker(language);

            let extractedFullText = '';

            try {
                for (let i = 0; i < numPages; i++) {
                    const pPercent = 25 + Math.round(((i + 0.5) / numPages) * 68);
                    setProgress(pPercent, `Reconociendo texto (OCR) en página ${i + 1} de ${numPages}…`);

                    const page = await pdfDoc.getPage(i + 1);
                    const textContent = await page.getTextContent();
                    const nativeText = extractPdfTextItems(textContent.items)
                        .map((item) => item.str || '')
                        .join(' ')
                        .trim();

                    // Si la página ya tiene texto seleccionable suficiente, conservarlo
                    if (nativeText.split(/\s+/).filter(Boolean).length >= 8) {
                        extractedFullText += `--- PÁGINA ${i + 1} ---\n${nativeText}\n\n`;
                        continue;
                    }

                    // Renderizar página escaneada a canvas en alta resolución para OCR
                    const scale = 2.0;
                    const viewport = page.getViewport({ scale });
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) continue;

                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

                    const ocrRes = await worker.recognize(canvas, {}, { text: true, blocks: true });
                    const pageOcrText = (ocrRes.data.text || '').trim();
                    extractedFullText += `--- PÁGINA ${i + 1} ---\n${pageOcrText}\n\n`;

                    // Superponer capa de texto invisible exactamente sobre las palabras detectadas
                    if (targetPdf && font && i < pdfPages.length && ocrRes.data.blocks) {
                        const targetPage = pdfPages[i];
                        const { width: pdfW, height: pdfH } = targetPage.getSize();
                        const ratioX = pdfW / canvas.width;
                        const ratioY = pdfH / canvas.height;

                        for (const block of ocrRes.data.blocks) {
                            for (const para of block.paragraphs || []) {
                                for (const line of para.lines || []) {
                                    for (const word of line.words || []) {
                                        const wText = (word.text || '').trim();
                                        if (!wText) continue;
                                        const xPt = word.bbox.x0 * ratioX;
                                        const boxH = Math.max(6, (word.bbox.y1 - word.bbox.y0) * ratioY);
                                        const yPt = pdfH - word.bbox.y1 * ratioY;
                                        const safeText = wText.replace(/[^\x20-\xFF]/g, '');
                                        if (!safeText) continue;
                                        try {
                                            targetPage.drawText(safeText, {
                                                x: Math.max(0, xPt),
                                                y: Math.max(0, yPt),
                                                size: Math.min(72, Math.max(5, boxH * 0.85)),
                                                font,
                                                color: rgb(0, 0, 0),
                                                opacity: 0.01,
                                            });
                                        } catch {
                                            // Omitir glifos no compatibles con WinAnsi
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } finally {
                await worker.terminate();
            }

            setProgress(96, 'Compilando documento final…');

            if (outputMode === 'text_file') {
                const textBlob = new Blob([extractedFullText.trim() || 'No se detectó texto legible.'], {
                    type: 'text/plain;charset=utf-8',
                });
                setProgress(100, '¡Texto extraído con éxito!');
                return {
                    blob: textBlob,
                    fileName: `${baseName}-ocr.txt`,
                    meta: { engine: 'Tesseract.js WebAssembly' },
                };
            }

            const finalBytes = await targetPdf!.save();
            const pdfBlob = new Blob([new Uint8Array(finalBytes)], { type: 'application/pdf' });
            setProgress(100, '¡PDF con OCR listo!');

            return {
                blob: pdfBlob,
                fileName: `${baseName}-buscable.pdf`,
                meta: { engine: 'Tesseract.js WebAssembly' },
            };
        });
    };

    const handleRestart = () => {
        clearPages();
        reset();
    };

    if (!originalFile && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar PDF escaneado"
                dropLabel="o arrastra el documento aquí"
                onFiles={handleUpload}
                error={error || thumbError}
            />
        );
    }

    if (stage === 'processing') {
        return <ProcessingView title="Aplicando Reconocimiento Óptico (OCR)…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        const meta = result?.meta as { engine?: string } | undefined;
        return (
            <DownloadView
                title="¡Documento procesado con OCR!"
                downloadLabel={outputMode === 'text_file' ? 'Descargar archivo TXT' : 'Descargar PDF Buscable'}
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="ocr"
            >
                {meta?.engine && (
                    <p className="text-xs text-muted">Motor OCR utilizado: {meta.engine}</p>
                )}
            </DownloadView>
        );
    }

    return (
        <>
            {loading && <PdfLoadingOverlay progress={loadingProgress} />}

            <Workspace
                title={tool.name}
                actionLabel="Aplicar OCR al PDF"
                onAction={handleRunOcr}
                actionDisabled={pages.length === 0}
                error={error || thumbError}
                toolbar={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                                {pages.length} páginas listas para OCR
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
                        <SidebarSection title="Idioma del documento">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'spa', label: '🇪🇸 Español' },
                                    { id: 'eng', label: '🇺🇸 English' },
                                    { id: 'fra', label: '🇫🇷 Français' },
                                    { id: 'deu', label: '🇩🇪 Deutsch' },
                                ].map((lang) => (
                                    <button
                                        key={lang.id}
                                        type="button"
                                        onClick={() => setLanguage(lang.id as OcrLanguage)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                            language === lang.id
                                                ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                                : 'border-line bg-canvas text-ink hover:border-line-strong'
                                        }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Formato de salida">
                            <div className="space-y-2.5">
                                <OptionCard
                                    icon={Search}
                                    title="PDF Buscable (Recomendado)"
                                    description="Conserva las imágenes originales e incrusta una capa de texto transparente seleccionable."
                                    selected={outputMode === 'searchable_pdf'}
                                    onSelect={() => setOutputMode('searchable_pdf')}
                                />
                                <OptionCard
                                    icon={FileText}
                                    title="Solo Texto Plano (.txt)"
                                    description="Extrae todo el texto reconocido en un archivo de texto limpio."
                                    selected={outputMode === 'text_file'}
                                    onSelect={() => setOutputMode('text_file')}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <StatRow label="Páginas a procesar" value={`${pages.length} págs`} />
                            <StatRow label="Idioma" value={language.toUpperCase()} />
                            <StatRow label="Salida" value={outputMode === 'searchable_pdf' ? 'PDF Buscable' : 'Texto (.txt)'} />
                        </SidebarSection>

                        <Notice tone="info">
                            Usa OCR real (EasyOCR en servidor o Tesseract WebAssembly en navegador) para convertir escaneos en texto buscable.
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
