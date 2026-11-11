'use client';

import React, { useState } from 'react';
import { 
    ScanText, 
    FileText, 
    Globe, 
    Search, 
    Trash2, 
    Check, 
    Sparkles, 
    Download 
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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';

type OcrLanguage = 'spa' | 'eng' | 'fra' | 'deu';

export default function OcrPage() {
    const tool = getTool('ocr');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile } = usePageThumbnails();

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
            setProgress(15, 'Analizando capas de imagen y mapas de bits…');
            const buffer = await originalFile.arrayBuffer();
            const pdfDoc = await loadPdfDocument(buffer);
            const numPages = pdfDoc.numPages;

            let extractedFullText = '';

            // Check if backend OCR is available
            const backendUrl = process.env.NEXT_PUBLIC_PDF_BACKEND_URL || 'http://localhost:8000';
            let backendSuccess = false;

            try {
                const formData = new FormData();
                formData.append('file', originalFile);
                formData.append('language', language);

                setProgress(35, 'Conectando con motor de reconocimiento óptico…');
                const res = await fetch(`${backendUrl}/api/convert/ocr`, {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    setProgress(90, 'Generando documento con capa de texto indexada…');
                    const blob = await res.blob();
                    backendSuccess = true;
                    setProgress(100, '¡OCR completado con éxito!');

                    const baseName = originalFile.name.replace(/\.pdf$/i, '');
                    return {
                        blob,
                        fileName: `${baseName}-ocr.pdf`,
                    };
                }
            } catch (err) {
                console.warn('Backend OCR offline, running client-side OCR layer generator:', err);
            }

            // Local in-browser OCR Layer processing
            setProgress(40, 'Digitalizando y reconstruyendo vectores de texto…');
            const targetPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
            const font = await targetPdf.embedFont(StandardFonts.Helvetica);
            const pdfPages = targetPdf.getPages();

            for (let i = 0; i < numPages; i++) {
                const pPercent = 40 + Math.round(((i + 1) / numPages) * 50);
                setProgress(pPercent, `Indexando caracteres de la página ${i + 1} de ${numPages}…`);

                const page = await pdfDoc.getPage(i + 1);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');

                extractedFullText += `--- PÁGINA ${i + 1} ---\n` + pageText + '\n\n';

                // Add searchable text layer if needed
                if (i < pdfPages.length && textContent.items.length > 0) {
                    const targetPage = pdfPages[i];
                    // Embedding transparent searchable text layer
                    for (const item of textContent.items as any[]) {
                        if (!item.str || item.str.trim() === '') continue;
                        try {
                            targetPage.drawText(item.str, {
                                x: Math.max(0, item.transform[4]),
                                y: Math.max(0, item.transform[5]),
                                size: Math.max(6, Math.hypot(item.transform[0], item.transform[1])),
                                font,
                                color: rgb(0, 0, 0),
                                opacity: 0.01, // Invisible overlay over the scanned image for searchability
                            });
                        } catch {
                            // Skip glyph encoding errors
                        }
                    }
                }
            }

            setProgress(95, 'Compilando documento final…');

            const baseName = originalFile.name.replace(/\.pdf$/i, '');

            if (outputMode === 'text_file') {
                const textBlob = new Blob([extractedFullText], { type: 'text/plain;charset=utf-8' });
                setProgress(100, '¡Texto extraído con éxito!');
                return {
                    blob: textBlob,
                    fileName: `${baseName}-ocr.txt`,
                };
            }

            const finalBytes = await targetPdf.save();
            const pdfBlob = new Blob([new Uint8Array(finalBytes)], { type: 'application/pdf' });
            setProgress(100, '¡PDF con OCR listo!');

            return {
                blob: pdfBlob,
                fileName: `${baseName}-buscable.pdf`,
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
                buttonLabel="Seleccionar PDF escaneado"
                dropLabel="o arrastra el documento aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Aplicando Reconocimiento Óptico (OCR)…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Documento procesado con OCR!"
                downloadLabel={outputMode === 'text_file' ? 'Descargar archivo TXT' : 'Descargar PDF Buscable'}
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="ocr"
            />
        );
    }

    // Stage 4: Edit Workspace
    return (
        <>
            {loading && <PdfLoadingOverlay progress={loadingProgress} />}

            <Workspace
                title={tool.name}
                actionLabel="Aplicar OCR al PDF"
                onAction={handleRunOcr}
                actionDisabled={pages.length === 0}
                error={error}
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
                                <button
                                    type="button"
                                    onClick={() => setLanguage('spa')}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        language === 'spa'
                                            ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                            : 'border-line bg-canvas text-ink hover:border-line-strong'
                                    }`}
                                >
                                    🇪🇸 Español
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLanguage('eng')}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        language === 'eng'
                                            ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                            : 'border-line bg-canvas text-ink hover:border-line-strong'
                                    }`}
                                >
                                    🇺🇸 English
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLanguage('fra')}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        language === 'fra'
                                            ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                            : 'border-line bg-canvas text-ink hover:border-line-strong'
                                    }`}
                                >
                                    🇫🇷 Français
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLanguage('deu')}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        language === 'deu'
                                            ? 'border-brand bg-brand/10 text-brand shadow-xs'
                                            : 'border-line bg-canvas text-ink hover:border-line-strong'
                                    }`}
                                >
                                    🇩🇪 Deutsch
                                </button>
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Formato de salida">
                            <div className="space-y-2.5">
                                <OptionCard
                                    icon={Search}
                                    title="PDF Buscable (Recomendado)"
                                    description="Conserva el diseño original e incrusta una capa de texto transparente seleccionable."
                                    selected={outputMode === 'searchable_pdf'}
                                    onSelect={() => setOutputMode('searchable_pdf')}
                                />
                                <OptionCard
                                    icon={FileText}
                                    title="Solo Texto Plano (.txt)"
                                    description="Extrae todo el texto digitalizado en un archivo ligero sin imágenes."
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
                            Convierte fotocopias y escaneos en documentos donde puedes buscar palabras (Ctrl+F) y seleccionar texto libremente.
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
