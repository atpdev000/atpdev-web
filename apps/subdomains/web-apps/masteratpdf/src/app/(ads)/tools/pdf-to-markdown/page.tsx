'use client';

import React, { useState } from 'react';
import { 
    Sparkles, 
    Copy, 
    Check, 
    Download, 
    Trash2, 
    FileCode, 
    Eye, 
    Layers, 
    Cpu 
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
import { loadPdfDocument, formatPdfError, extractPdfTextItems } from '@/lib/pdf/pdfHelper';
import { postToBackend, isHttpClientError } from '@/lib/pdf/backendClient';

export default function PdfToMarkdownPage() {
    const tool = getTool('pdf-to-markdown');
    const { stage, progress, message, run, download, backToEdit, reset, error, setError, result } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
    const [copied, setCopied] = useState<boolean>(false);
    const [engineUsed, setEngineUsed] = useState<string>('OpenDataLoader SOTA');

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
            setMarkdownContent('');
            processPdfToMarkdown(f);
        }
    };

    const processPdfToMarkdown = (f: File) => {
        run(async (setProgress) => {
            setProgress(15, 'Analizando estructura semántica y orden de lectura…');

            try {
                const formData = new FormData();
                formData.append('file', f);

                setProgress(35, 'Ejecutando motor OpenDataLoader / PyMuPDF…');
                const response = await postToBackend('/api/convert/pdf-to-markdown', formData, 180000);
                const data = await response.json();
                setProgress(90, 'Formateando Markdown estructurado…');
                const mdText = data.markdown || '';
                setMarkdownContent(mdText);
                setEngineUsed(data.engine || 'OpenDataLoader PDF #1 SOTA');
                setProgress(100, '¡Markdown listo!');

                const baseName = f.name.replace(/\.pdf$/i, '');
                return {
                    blob: new Blob([mdText], { type: 'text/markdown;charset=utf-8' }),
                    fileName: `${baseName}.md`,
                };
            } catch (err: unknown) {
                if (isHttpClientError(err)) {
                    throw err;
                }
                console.warn('Backend unavailable, running client-side Markdown extractor:', err);
            }

            // Client-side fallback con detección de encabezados por tamaño tipográfico
            setProgress(40, 'Extrayendo jerarquía tipográfica en navegador…');
            let pdfDoc;
            try {
                const buffer = await f.arrayBuffer();
                pdfDoc = await loadPdfDocument(buffer);
            } catch (err) {
                throw new Error(formatPdfError(err));
            }
            const numPages = pdfDoc.numPages;
            setPageCount(numPages);

            const allLineObjs: Array<{ page: number; y: number; maxSize: number; text: string }> = [];
            const fontSizes: number[] = [];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const percent = 40 + Math.round(((pageNum - 0.5) / numPages) * 45);
                setProgress(percent, `Procesando página ${pageNum} de ${numPages}…`);

                const page = await pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                const items = extractPdfTextItems(textContent.items)
                    .filter((item) => item.str && item.str.trim() !== '')
                    .map((item) => {
                        const size = Math.round(Math.hypot(item.transform[0], item.transform[1]) * 10) / 10;
                        fontSizes.push(size);
                        return { str: item.str, x: item.transform[4], y: item.transform[5], size };
                    });

                items.sort((a, b) => b.y - a.y);
                const grouped: Array<{ y: number; items: typeof items }> = [];
                for (const item of items) {
                    const g = grouped.find((grp) => Math.abs(grp.y - item.y) <= 5);
                    if (g) g.items.push(item);
                    else grouped.push({ y: item.y, items: [item] });
                }

                for (const g of grouped) {
                    g.items.sort((a, b) => a.x - b.x);
                    const text = g.items.map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim();
                    const maxSize = Math.max(...g.items.map((i) => i.size));
                    if (text) allLineObjs.push({ page: pageNum, y: g.y, maxSize, text });
                }
            }

            fontSizes.sort((a, b) => a - b);
            const bodySize = fontSizes.length > 0 ? fontSizes[Math.floor(fontSizes.length * 0.5)] : 11;

            let generatedMd = `# ${f.name.replace(/\.pdf$/i, '')}\n\n`;
            let currentPage = 0;
            for (const line of allLineObjs) {
                if (numPages > 1 && line.page !== currentPage) {
                    currentPage = line.page;
                    generatedMd += `\n## Página ${currentPage}\n\n`;
                }
                if (line.maxSize >= bodySize * 1.4 && line.text.length < 120) {
                    generatedMd += `# ${line.text}\n\n`;
                } else if (line.maxSize >= bodySize * 1.18 && line.text.length < 140) {
                    generatedMd += `### ${line.text}\n\n`;
                } else if (/^[•\-*]\s+/.test(line.text)) {
                    generatedMd += `- ${line.text.replace(/^[•\-*]\s+/, '')}\n`;
                } else {
                    generatedMd += `${line.text}\n\n`;
                }
            }

            setMarkdownContent(generatedMd.trim());
            setEngineUsed('Motor Local WebAssembly (Jerárquico)');
            setProgress(100, '¡Markdown generado!');

            const baseName = f.name.replace(/\.pdf$/i, '');
            return {
                blob: new Blob([generatedMd.trim()], { type: 'text/markdown;charset=utf-8' }),
                fileName: `${baseName}.md`,
            };
        });
    };

    const handleCopy = () => {
        if (!markdownContent) return;
        navigator.clipboard.writeText(markdownContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleRestart = () => {
        setFile(null);
        setMarkdownContent('');
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
        return <ProcessingView title="Extrayendo Markdown estructurado…" progress={progress} message={message} />;
    }

    const wordsCount = markdownContent ? markdownContent.trim().split(/\s+/).filter(Boolean).length : 0;
    const linesCount = markdownContent ? markdownContent.split('\n').length : 0;

    // Stage 3 & 4: Preview and Download
    return (
        <Workspace
            title={tool.name}
            actionLabel="Descargar archivo Markdown (.md)"
            onAction={download}
            actionDisabled={!markdownContent}
            error={error}
            toolbar={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            {wordsCount.toLocaleString()} palabras extraídas
                        </span>
                        {file && (
                            <span className="text-xs text-muted">
                                ({file.name} · {formatBytes(file.size)})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-line bg-canvas p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'preview'
                                        ? 'bg-surface text-ink shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Vista previa</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('raw')}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === 'raw'
                                        ? 'bg-surface text-ink shadow-xs'
                                        : 'text-muted hover:text-ink'
                                }`}
                            >
                                <FileCode className="w-3.5 h-3.5" />
                                <span>Código (.md)</span>
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-brand hover:text-brand text-xs font-bold text-ink transition-colors shadow-xs cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-danger hover:text-danger text-xs font-semibold text-muted transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cambiar</span>
                        </button>
                    </div>
                </div>
            }
            options={
                <div className="space-y-6">
                    <SidebarSection title="Métricas del documento">
                        <StatRow label="Palabras" value={wordsCount.toLocaleString()} />
                        <StatRow label="Líneas" value={linesCount.toLocaleString()} />
                        <StatRow label="Motor activo" value={engineUsed} />
                        <StatRow label="Compatibilidad" value="LLMs / ChatGPT / Claude" />
                    </SidebarSection>

                    <SidebarSection title="Acciones de salida">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="w-full py-2.5 px-4 rounded-xl border border-line bg-surface hover:bg-canvas text-xs font-bold text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4 text-brand" />}
                            <span>{copied ? '¡Markdown copiado!' : 'Copiar para ChatGPT / Claude'}</span>
                        </button>
                    </SidebarSection>

                    <Notice tone="info">
                        Formato optimizado con jerarquías `# H1`, `## H2` y tablas aptas para Inteligencia Artificial y RAG.
                    </Notice>
                </div>
            }
        >
            <div className="w-full max-w-4xl mx-auto space-y-4">
                {activeTab === 'raw' ? (
                    <div className="w-full bg-[#111625] text-slate-200 border border-line rounded-2xl p-5 shadow-card font-mono text-xs whitespace-pre-wrap max-h-[650px] overflow-y-auto leading-relaxed select-text">
                        {markdownContent || 'Sin contenido Markdown disponible.'}
                    </div>
                ) : (
                    <div className="w-full bg-surface border border-line rounded-2xl p-6 sm:p-8 shadow-card prose prose-sm dark:prose-invert max-w-none max-h-[650px] overflow-y-auto leading-relaxed select-text">
                        <div className="whitespace-pre-wrap font-sans text-ink">
                            {markdownContent}
                        </div>
                    </div>
                )}
            </div>
        </Workspace>
    );
}
