'use client';

import React, { useState } from 'react';
import { Wrench, Trash2, CheckCircle2, FileWarning } from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { repairPdfDocument } from '@/lib/pdf/pdfRepairer';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { Workspace, SidebarSection, StatRow, Notice } from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';

export default function RepairPage() {
    const tool = getTool('repair');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();
    const [file, setFile] = useState<File | null>(null);

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
        }
    };

    const handleRepair = () => {
        if (!file) return;
        run(async (setProgress) => {
            setProgress(20, 'Inspeccionando cabeceras y tabla XRef…');
            setProgress(55, 'Reconstruyendo objetos y flujos PDF…');
            const res = await repairPdfDocument(file);
            setProgress(100, '¡Documento recuperado!');

            const baseName = file.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([new Uint8Array(res.pdfBytes)], { type: 'application/pdf' }),
                fileName: `${baseName}-reparado.pdf`,
                meta: {
                    engine: res.engine,
                    repairedPages: res.repairedPages,
                    details: res.details,
                },
            };
        });
    };

    const handleRestart = () => {
        setFile(null);
        reset();
    };

    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar PDF dañado"
                dropLabel="o arrastra el archivo PDF aquí"
                error={error}
                onFiles={handleUpload}
            />
        );
    }

    if (stage === 'processing') {
        return <ProcessingView title="Reparando estructura del PDF…" progress={progress} message={message} />;
    }

    if (stage === 'done') {
        const meta = result?.meta as { engine?: string; repairedPages?: number; details?: string } | undefined;
        return (
            <DownloadView
                title="¡Documento PDF reparado!"
                downloadLabel="Descargar PDF Reparado"
                onDownload={download}
                onBack={backToEdit}
                onRestart={handleRestart}
                toolId="repair"
            >
                {meta && (
                    <div className="max-w-md mx-auto p-5 rounded-2xl bg-surface border border-line shadow-card text-left space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-bold text-ok">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Recuperación completada ({meta.repairedPages} páginas)</span>
                        </div>
                        <p className="text-ink-2">{meta.details}</p>
                    </div>
                )}
            </DownloadView>
        );
    }

    return (
        <Workspace
            title={tool.name}
            actionLabel="Reparar PDF ahora"
            onAction={handleRepair}
            actionDisabled={!file}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            1 archivo listo para diagnóstico
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cambiar archivo</span>
                    </button>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Resumen">
                        <StatRow label="Archivo" value={file?.name || ''} />
                        <StatRow label="Tamaño" value={file ? formatBytes(file.size) : ''} />
                        <StatRow label="Recuperación" value="PyMuPDF + pdf-lib XRef" />
                    </SidebarSection>
                    <Notice tone="info">
                        Reconstruye tablas de referencias cruzadas (XRef), limpia flujos corruptos y linealiza el documento para compatibilidad estándar.
                    </Notice>
                </div>
            }
        >
            <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-brand/10 text-brand flex items-center justify-center shadow-lift">
                    <Wrench className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-ink">{file?.name}</h2>
                <p className="text-xs text-muted leading-relaxed">
                    El archivo se analizará sin renderizar miniaturas previas para evitar bloqueos si su estructura interna está dañada.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line text-xs text-ink-2">
                    <FileWarning className="w-3.5 h-3.5 text-warn" />
                    <span>Peso original: {file ? formatBytes(file.size) : '0 B'}</span>
                </div>
            </div>
        </Workspace>
    );
}

