'use client';

import React, { useState } from 'react';
import { 
    FileText, 
    Zap, 
    Trash2, 
    Check, 
    Sparkles, 
    Cpu, 
    ScanLine 
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
    Checkbox 
} from '@/components/tool/Workspace';
import { ThumbCard } from '@/components/tool/ThumbCard';
import { 
    ProcessingView, 
    DownloadView, 
    PdfLoadingOverlay 
} from '@/components/tool/FlowViews';

type ConversionMethod = 'auto' | 'pdf2docx' | 'pymupdf';

export default function PdfToWordPage() {
    const tool = getTool('pdf-to-word');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const { pages, loading, loadingProgress, addFiles, clearPages, originalFile } = usePageThumbnails();

    const [selectedMethod, setSelectedMethod] = useState<ConversionMethod>('auto');
    const [enableOCR, setEnableOCR] = useState(true);

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
            setProgress(15, 'Preparando documento para análisis tipográfico…');

            const formData = new FormData();
            formData.append('file', originalFile);
            formData.append('method', selectedMethod);
            formData.append('enable_ocr', String(enableOCR));

            setProgress(40, 'Reconstruyendo párrafos, estilos y tablas…');
            const backendUrl = process.env.NEXT_PUBLIC_PDF_BACKEND_URL || 'http://localhost:8000';

            try {
                const response = await fetch(`${backendUrl}/api/convert/pdf-to-word`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errJson = await response.json().catch(() => ({}));
                    throw new Error(errJson.detail || 'Fallo en la conversión DOCX');
                }

                setProgress(90, 'Generando archivo DOCX editable…');
                const blob = await response.blob();
                setProgress(100, '¡Documento convertido!');

                const baseName = originalFile.name.replace(/\.pdf$/i, '');
                return {
                    blob,
                    fileName: `${baseName}.docx`,
                };
            } catch (err: any) {
                // Si el microservicio externo no está activo, procesar 100% en el cliente sin fallar
                console.warn('Microservicio no disponible, usando motor DOCX local en navegador:', err);
                setProgress(45, 'Procesando directamente con el motor DOCX local en el navegador…');
                const { convertPdfToDocxClient } = await import('@/lib/pdf/pdfToDocxClient');
                const blob = await convertPdfToDocxClient(originalFile, {
                    onProgress: (p, msg) => setProgress(p, msg),
                });
                const baseName = originalFile.name.replace(/\.pdf$/i, '');
                return {
                    blob,
                    fileName: `${baseName}.docx`,
                };
            }
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
                error={error}
                onFiles={handleUpload}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Convirtiendo tu PDF a Word…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu archivo Word (DOCX) está listo!"
                downloadLabel="Descargar archivo DOCX"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="pdf-to-word"
            />
        );
    }

    return (
        <>
            {loading && (
                <PdfLoadingOverlay
                    progress={loadingProgress}
                    title="Cargando PDF"
                    subtitle="Extrayendo estructura y páginas para conversión a Word…"
                />
            )}

            <Workspace
                title="PDF a Word"
                actionLabel="Convertir a Word"
                onAction={handleConvert}
                actionDisabled={!originalFile}
                error={error}
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
                        <SidebarSection title="Motor de conversión">
                            <div className="space-y-2.5">
                                <OptionCard
                                    title="Automático Inteligente"
                                    description="Detecta si el documento tiene tablas complejas o texto plano para aplicar la mejor heurística."
                                    icon={Sparkles}
                                    selected={selectedMethod === 'auto'}
                                    onClick={() => setSelectedMethod('auto')}
                                />
                                <OptionCard
                                    title="Motor Tablas Avanzadas"
                                    description="Especializado en reconstruir matrices tabulares, columnas y cuadrículas financieras."
                                    icon={Cpu}
                                    selected={selectedMethod === 'pdf2docx'}
                                    onClick={() => setSelectedMethod('pdf2docx')}
                                />
                                <OptionCard
                                    title="Motor Alta Velocidad"
                                    description="Procesamiento ultrarrápido recomendado para libros, monografías y contratos extensos."
                                    icon={Zap}
                                    selected={selectedMethod === 'pymupdf'}
                                    onClick={() => setSelectedMethod('pymupdf')}
                                />
                            </div>
                        </SidebarSection>

                        <SidebarSection title="Opciones avanzadas">
                            <Checkbox
                                label="Reconocimiento Óptico (OCR)"
                                description="Detecta texto en documentos escaneados e imágenes incrustadas."
                                checked={enableOCR}
                                onChange={setEnableOCR}
                            />
                        </SidebarSection>

                        <SidebarSection title="Resumen">
                            <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                                <StatRow label="Archivo" value={originalFile?.name ?? ''} />
                                <StatRow label="Formato de salida" value="Microsoft Word (.docx)" />
                            </div>
                        </SidebarSection>

                        <Notice tone="info">
                            El archivo DOCX generado conserva fuentes, sangrías, encabezados, tablas y alineaciones para su edición directa en Word o Google Docs.
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
                            subtitle="DOCX"
                            thumbnail={p.thumbnail}
                            size="md"
                        />
                    ))}
                </div>
            </Workspace>
        </>
    );
}
