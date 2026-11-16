'use client';

import React, { useState } from 'react';
import { 
    FileText, 
    Copy, 
    Check, 
    Download, 
    Trash2, 
    Layers, 
    Sparkles, 
    FileCheck 
} from 'lucide-react';
import { getTool } from '@/lib/tools';
import { formatBytes, validateFiles } from '@/lib/files';
import { useToolFlow } from '@/hooks/useToolFlow';
import { ToolUpload } from '@/components/tool/ToolUpload';
import { 
    Workspace, 
    SidebarSection, 
    StatRow, 
    Notice 
} from '@/components/tool/Workspace';
import { ProcessingView, DownloadView } from '@/components/tool/FlowViews';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';

export default function PdfToTextPage() {
    const tool = getTool('pdf-to-text');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [copied, setCopied] = useState<boolean>(false);

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
            setExtractedText('');
            processTextExtraction(f);
        }
    };

    const processTextExtraction = (f: File) => {
        run(async (setProgress) => {
            setProgress(15, 'Cargando documento en memoria…');
            const buffer = await f.arrayBuffer();
            const pdfDoc = await loadPdfDocument(buffer);
            const numPages = pdfDoc.numPages;
            setPageCount(numPages);

            let fullText = '';

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const percent = 20 + Math.round(((pageNum - 0.5) / numPages) * 75);
                setProgress(percent, `Extrayendo texto de la página ${pageNum} de ${numPages}…`);

                const page = await pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageLines: string[] = [];

                let currentLine = '';
                let lastY: number | null = null;

                for (const item of textContent.items as any[]) {
                    if (!item.str) continue;
                    const y = item.transform[5];

                    if (lastY !== null && Math.abs(y - lastY) > 5) {
                        if (currentLine.trim()) pageLines.push(currentLine.trim());
                        currentLine = item.str;
                    } else {
                        currentLine += (currentLine ? ' ' : '') + item.str;
                    }
                    lastY = y;
                }

                if (currentLine.trim()) {
                    pageLines.push(currentLine.trim());
                }

                if (numPages > 1) {
                    fullText += `=== PÁGINA ${pageNum} ===\n\n`;
                }
                fullText += pageLines.join('\n') + '\n\n';
            }

            setProgress(98, 'Formateando texto…');
            const cleanText = fullText.trim();
            setExtractedText(cleanText);
            setProgress(100, '¡Texto extraído con éxito!');

            const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
            const baseName = f.name.replace(/\.pdf$/i, '');

            return {
                blob,
                fileName: `${baseName}-texto.txt`,
            };
        });
    };

    const handleCopy = () => {
        if (!extractedText) return;
        navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleRestart = () => {
        setFile(null);
        setExtractedText('');
        reset();
    };

    // Stage 1: Upload
    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar documento PDF"
                dropLabel="o arrastra el PDF aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    // Stage 2: Processing
    if (stage === 'processing') {
        return <ProcessingView title="Extrayendo texto del documento…" progress={progress} message={message} />;
    }

    const wordsCount = extractedText ? extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
    const charsCount = extractedText ? extractedText.length : 0;

    // Stage 3 & 4: Done / Preview
    return (
        <Workspace
            title={tool.name}
            actionLabel="Descargar archivo TXT"
            onAction={download}
            actionDisabled={!extractedText}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            {pageCount} páginas analizadas
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
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-brand hover:text-brand text-xs font-bold text-ink transition-colors shadow-xs cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar texto'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cambiar archivo</span>
                        </button>
                    </div>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Métricas de texto">
                        <StatRow label="Palabras totales" value={wordsCount.toLocaleString()} />
                        <StatRow label="Caracteres" value={charsCount.toLocaleString()} />
                        <StatRow label="Páginas" value={`${pageCount} págs`} />
                        <StatRow label="Codificación" value="UTF-8 (Universal)" />
                    </SidebarSection>

                    <SidebarSection title="Acciones rápidas">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-full py-2.5 px-4 rounded-xl border border-line bg-surface hover:bg-canvas text-xs font-bold text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4 text-brand" />}
                            <span>{copied ? '¡Copiado!' : 'Copiar todo al portapapeles'}</span>
                        </button>
                    </SidebarSection>

                    <Notice tone="info">
                        Extracción directa en memoria sin subir tu información a servidores externos.
                    </Notice>
                </div>
            }
        >
            <div className="w-full max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand" />
                        <span>Vista previa del texto extraído</span>
                    </h3>
                    <span className="text-xs text-muted font-medium">
                        {wordsCount.toLocaleString()} palabras
                    </span>
                </div>

                <div className="w-full bg-surface border border-line rounded-2xl p-5 shadow-card font-mono text-xs text-ink/90 whitespace-pre-wrap max-h-[650px] overflow-y-auto leading-relaxed select-text">
                    {extractedText || 'No se encontró texto seleccionable en el documento. Puede ser un PDF escaneado.'}
                </div>
            </div>
        </Workspace>
    );
}
