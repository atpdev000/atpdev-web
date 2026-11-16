'use client';

import React, { useState } from 'react';
import { 
    FileType2, 
    Trash2, 
    Check, 
    FileText, 
    Sparkles, 
    ShieldCheck 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
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

export default function WordToPdfPage() {
    const tool = getTool('word-to-pdf');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError } = useToolFlow();
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = (files: File[]) => {
        const { valid, errors } = validateFiles(files, {
            accept: ['.docx', '.doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
            maxFiles: 1,
        });

        if (errors.length > 0) {
            setError(errors.map((e) => e.error).join(' · '));
            return;
        }

        if (valid.length > 0) {
            setFile(valid[0]);
        }
    };

    const handleConvert = () => {
        if (!file) return;

        run(async (setProgress) => {
            setProgress(15, 'Analizando estilos, fuentes y diseño del documento…');

            const formData = new FormData();
            formData.append('file', file);

            setProgress(45, 'Renderizando tipografía y tablas en vector PDF…');
            const backendUrl = process.env.NEXT_PUBLIC_PDF_BACKEND_URL || 'http://localhost:8000';

            try {
                const response = await fetch(`${backendUrl}/api/convert/word-to-pdf`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errJson = await response.json().catch(() => ({}));
                    throw new Error(errJson.detail || 'Fallo en la conversión a PDF');
                }

                setProgress(90, 'Generando archivo PDF con máxima fidelidad…');
                const blob = await response.blob();
                setProgress(100, '¡PDF listo!');

                const baseName = file.name.replace(/\.(docx|doc)$/i, '');
                return {
                    blob,
                    fileName: `${baseName}.pdf`,
                };
            } catch (err: any) {
                // Si el microservicio externo no está activo, procesar 100% en el cliente sin fallar
                console.warn('Microservicio no disponible, usando motor Word local en navegador:', err);
                setProgress(45, 'Procesando directamente con el motor Word local en el navegador…');
                const { convertWordToPdfClient } = await import('@/lib/pdf/wordToPdfClient');
                const blob = await convertWordToPdfClient(file, {
                    onProgress: (p, msg) => setProgress(p, msg),
                });
                const baseName = file.name.replace(/\.(docx|doc)$/i, '');
                return {
                    blob,
                    fileName: `${baseName}.pdf`,
                };
            }
        });
    };

    const handleRestart = () => {
        setFile(null);
        reset();
    };

    // Stage 1: Upload
    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                multiple={false}
                buttonLabel="Seleccionar documento Word"
                dropLabel="o arrastra y suelta tu archivo DOCX aquí"
                error={error}
                onFiles={handleUpload}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Convirtiendo tu Word a PDF…" progress={progress} message={message} />;
    }

    // Stage 3: Done
    if (stage === 'done') {
        return (
            <DownloadView
                title="¡Tu documento PDF está listo!"
                downloadLabel="Descargar archivo PDF"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="word-to-pdf"
            />
        );
    }

    return (
        <Workspace
            title="Word a PDF"
            actionLabel="Convertir a PDF"
            onAction={handleConvert}
            actionDisabled={!file}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            1 documento Word seleccionado
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
                        <span>Cambiar documento</span>
                    </button>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Fidelidad de conversión">
                        <div className="rounded-xl bg-canvas p-3 border border-line space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-ink">
                                <Sparkles className="w-4 h-4 text-brand" />
                                <span>Renderizado vectorial de alta fidelidad</span>
                            </div>
                            <p className="text-[11px] text-ink-2 leading-relaxed">
                                Convierte fuentes tipográficas, saltos de página, imágenes en alta resolución y diagramas en vectores nativos de PDF listos para imprimir.
                            </p>
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Resumen">
                        <div className="rounded-xl bg-canvas p-3 border border-line space-y-1">
                            <StatRow label="Archivo origen" value={file?.name ?? ''} />
                            <StatRow label="Peso" value={formatBytes(file?.size ?? 0)} />
                            <StatRow label="Formato salida" value="PDF Estándar ISO 32000" />
                        </div>
                    </SidebarSection>

                    <Notice tone="info">
                        El PDF resultante mantendrá el diseño idéntico a Microsoft Word en cualquier lector o dispositivo.
                    </Notice>
                </div>
            }
        >
            <div className="flex justify-center sm:justify-start">
                {file && (
                    <ThumbCard
                        title={file.name}
                        subtitle={formatBytes(file.size)}
                        badge={{ label: 'DOCX', tone: 'blue' }}
                        size="lg"
                        actions={[
                            {
                                icon: Trash2,
                                label: 'Quitar documento',
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
