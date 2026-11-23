'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Copy,
    Check,
    Trash2,
    Tag,
    RefreshCw,
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
    Notice,
} from '@/components/tool/Workspace';
import { ProcessingView } from '@/components/tool/FlowViews';
import { loadPdfDocument, formatPdfError, extractPdfTextItems } from '@/lib/pdf/pdfHelper';
import { postToBackend, isHttpClientError } from '@/lib/pdf/backendClient';
import { summarizeTextLocal, type SummaryOutput, type SummaryStyle } from '@/lib/pdf/textRankSummary';

export default function AiSummaryPage() {
    const tool = getTool('ai-summary');
    const { stage, progress, message, run, download, reset, error, setError } = useToolFlow();

    const [file, setFile] = useState<File | null>(null);
    const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('executive');
    const [summaryResult, setSummaryResult] = useState<SummaryOutput | null>(null);
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
            setSummaryResult(null);
            executeSummary(f, summaryStyle);
        }
    };

    const buildMarkdown = (summaryObj: SummaryOutput, sourceFile: File, numPagesLabel: string) => {
        return (
            `# Resumen (${summaryStyle}): ${summaryObj.title}\n\n` +
            `**Documento original:** ${sourceFile.name} (${formatBytes(sourceFile.size)})\n` +
            `**Extensión:** ${summaryObj.totalWords.toLocaleString()} palabras · ${numPagesLabel}\n` +
            `**Motor:** ${summaryObj.engine}\n` +
            `**Lectura estimada:** De ${summaryObj.readingTimeOriginalMin} min a ${summaryObj.readingTimeSummaryMin} min\n\n` +
            `---\n\n` +
            `## Síntesis General\n\n${summaryObj.executiveSummary}\n\n` +
            `## Puntos Clave\n\n` +
            summaryObj.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') +
            `\n\n## Temas Identificados\n\n` +
            summaryObj.topics.map((t) => `- ${t}`).join('\n')
        );
    };

    const executeSummary = (f: File, style: SummaryStyle) => {
        run(async (setProgress) => {
            setProgress(15, 'Analizando contenido del documento…');

            // 1. Intentar motor del backend (LLM si configurado o TextRank Python)
            try {
                const formData = new FormData();
                formData.append('file', f);
                formData.append('style', style);

                setProgress(45, 'Sintetizando conceptos clave e ideas principales…');
                const response = await postToBackend('/api/convert/ai-summary', formData);
                const data = await response.json();

                const summaryObj: SummaryOutput = {
                    title: data.title || f.name.replace(/\.pdf$/i, ''),
                    executiveSummary: data.executive_summary || '',
                    keyPoints: data.key_points || [],
                    topics: data.topics || [],
                    readingTimeOriginalMin: data.reading_time_original_min || 1,
                    readingTimeSummaryMin: data.reading_time_summary_min || 1,
                    totalWords: data.total_words || 0,
                    engine: data.engine || 'Servidor NLP/LLM',
                };

                setSummaryResult(summaryObj);
                setProgress(100, '¡Resumen completado!');

                const md = buildMarkdown(summaryObj, f, `${data.page_count || '?'} páginas`);
                return {
                    blob: new Blob([md], { type: 'text/markdown;charset=utf-8' }),
                    fileName: `${f.name.replace(/\.pdf$/i, '')}-resumen.md`,
                };
            } catch (err: unknown) {
                if (isHttpClientError(err)) {
                    throw err;
                }
            }

            // 2. Fallback 100% local con TextRank + TF-IDF real en navegador
            let pdfDoc;
            try {
                const buffer = await f.arrayBuffer();
                pdfDoc = await loadPdfDocument(buffer);
            } catch (err) {
                throw new Error(formatPdfError(err));
            }

            const numPages = pdfDoc.numPages;
            let fullText = '';

            for (let i = 1; i <= numPages; i++) {
                const percent = 20 + Math.round(((i - 0.5) / numPages) * 50);
                setProgress(percent, `Leyendo página ${i} de ${numPages}…`);

                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = extractPdfTextItems(textContent.items).map((item) => item.str).join(' ');
                fullText += pageText + ' ';
            }

            if (fullText.trim().split(/\s+/).filter(Boolean).length < 10) {
                throw new Error(
                    'El documento no contiene texto seleccionable suficiente (si es un escaneo, pásalo primero por OCR PDF).'
                );
            }

            setProgress(80, 'Calculando relevancia semántica (TextRank + TF-IDF)…');
            const summaryObj = summarizeTextLocal(fullText, f.name, style);
            setSummaryResult(summaryObj);
            setProgress(100, '¡Resumen completado con éxito!');

            const md = buildMarkdown(summaryObj, f, `${numPages} páginas`);
            return {
                blob: new Blob([md], { type: 'text/markdown;charset=utf-8' }),
                fileName: `${f.name.replace(/\.pdf$/i, '')}-resumen.md`,
            };
        });
    };

    const handleChangeStyle = (nextStyle: SummaryStyle) => {
        setSummaryStyle(nextStyle);
        if (file) {
            executeSummary(file, nextStyle);
        }
    };

    const handleCopy = () => {
        if (!summaryResult) return;
        const textToCopy =
            `Resumen (${summaryStyle}): ${summaryResult.title}\n\n` +
            `${summaryResult.executiveSummary}\n\nPuntos Clave:\n` +
            summaryResult.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleRestart = () => {
        setFile(null);
        setSummaryResult(null);
        reset();
    };

    if (!file && stage === 'edit') {
        return (
            <ToolUpload
                tool={tool}
                accept=".pdf,application/pdf"
                multiple={false}
                buttonLabel="Seleccionar documento PDF"
                dropLabel="o arrastra el documento aquí"
                onFiles={handleUpload}
                error={error}
            />
        );
    }

    if (stage === 'processing') {
        return <ProcessingView title="Sintetizando documento…" progress={progress} message={message} />;
    }

    const origMin = summaryResult?.readingTimeOriginalMin || 1;
    const sumMin = summaryResult?.readingTimeSummaryMin || 1;
    const savedPct = origMin > sumMin ? Math.round(((origMin - sumMin) / origMin) * 100) : 0;

    return (
        <Workspace
            title={tool.name}
            actionLabel="Descargar Resumen (.md)"
            onAction={download}
            actionDisabled={!summaryResult}
            error={error}
            toolbar={
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                            Resumen generado
                        </span>
                        {file && (
                            <span className="text-xs text-muted">
                                ({file.name} · {formatBytes(file.size)})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {file && (
                            <button
                                type="button"
                                onClick={() => executeSummary(file, summaryStyle)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-brand hover:text-brand text-xs font-semibold text-ink transition-colors cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Regenerar</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-brand hover:text-brand text-xs font-bold text-ink transition-colors shadow-xs cursor-pointer"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? '¡Copiado!' : 'Copiar resumen'}</span>
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
                    <SidebarSection title="Estilo de síntesis">
                        <div className="space-y-2">
                            <OptionCard
                                title="Resumen Ejecutivo"
                                description="Síntesis equilibrada en 4 ideas centrales y 5 puntos clave."
                                selected={summaryStyle === 'executive'}
                                onSelect={() => handleChangeStyle('executive')}
                            />
                            <OptionCard
                                title="Puntos Clave (Bullets)"
                                description="Introducción breve y hasta 8 hallazgos ordenados por relevancia."
                                selected={summaryStyle === 'bullets'}
                                onSelect={() => handleChangeStyle('bullets')}
                            />
                            <OptionCard
                                title="Análisis Detallado"
                                description="Extracto amplio preservando el hilo argumental completo."
                                selected={summaryStyle === 'detailed'}
                                onSelect={() => handleChangeStyle('detailed')}
                            />
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Ahorro de tiempo estimado">
                        <div className="p-4 rounded-2xl bg-brand/10 border border-brand/20 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-ink">
                                <span>Lectura completa:</span>
                                <span className="line-through text-muted">{origMin} min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-black text-brand">
                                <span>Lectura con resumen:</span>
                                <span>{sumMin} min</span>
                            </div>
                            <div className="w-full h-1.5 bg-brand/20 rounded-full overflow-hidden">
                                <div className="h-full bg-brand rounded-full" style={{ width: `${Math.max(15, savedPct)}%` }} />
                            </div>
                            <p className="text-[10px] text-muted text-right font-medium">
                                {savedPct > 0 ? `${savedPct}% de tiempo ahorrado` : 'Lectura rápida'}
                            </p>
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Métricas del análisis">
                        <StatRow label="Palabras analizadas" value={summaryResult?.totalWords.toLocaleString() || '0'} />
                        <StatRow label="Puntos clave" value={`${summaryResult?.keyPoints.length || 0} identificados`} />
                        <StatRow label="Motor" value={summaryResult?.engine || 'TextRank + TF-IDF'} />
                    </SidebarSection>

                    <Notice tone="info">
                        Análisis mediante algoritmo de centralidad TextRank y TF-IDF (o LLM si hay clave configurada en servidor).
                    </Notice>
                </div>
            }
        >
            {summaryResult && (
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <div className="bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
                                {summaryStyle === 'detailed'
                                    ? 'Análisis Detallado'
                                    : summaryStyle === 'bullets'
                                    ? 'Puntos Clave'
                                    : 'Resumen Ejecutivo'}
                            </span>
                            <span className="text-xs text-muted font-medium">
                                Documento: {file?.name}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                            {summaryResult.title}
                        </h2>
                        <p className="text-sm text-ink-2 leading-relaxed text-justify">
                            {summaryResult.executiveSummary}
                        </p>

                        {summaryResult.topics.length > 0 && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                                <Tag className="w-3.5 h-3.5 text-muted" />
                                {summaryResult.topics.map((topic, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-full bg-canvas border border-line text-[11px] font-semibold text-ink-2"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
                        <h3 className="text-base font-bold text-ink flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand" />
                            <span>Puntos Clave y Hallazgos Principales</span>
                        </h3>
                        <div className="space-y-3">
                            {summaryResult.keyPoints.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line">
                                    <span className="w-6 h-6 rounded-lg bg-brand/10 text-brand text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <p className="text-xs text-ink leading-relaxed font-medium">
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Workspace>
    );
}
