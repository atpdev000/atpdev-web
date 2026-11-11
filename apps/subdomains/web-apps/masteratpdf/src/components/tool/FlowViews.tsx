'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, RotateCcw, ChevronRight } from 'lucide-react';
import { getTool } from '@/lib/tools';

/* ---------- Processing ---------- */

export function ProcessingView({ title, progress, message }: { title: string; progress: number | null; message?: string }) {
    return (
        <section className="animate-stage min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">{title}</h2>
            <p className="mt-3 text-sm text-ink-2 min-h-[1.25rem]">{message || 'No cierres esta pestaña mientras termina.'}</p>

            <div className="mt-10 w-full max-w-md">
                <div className="h-2.5 w-full rounded-full bg-line overflow-hidden" role="progressbar" aria-valuenow={progress ?? undefined} aria-valuemin={0} aria-valuemax={100}>
                    {progress === null ? (
                        <div className="h-full rounded-full bg-brand progress-indeterminate" />
                    ) : (
                        <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${progress}%` }} />
                    )}
                </div>
                {progress !== null && <p className="mt-3 text-sm font-bold text-ink tabular-nums">{progress}%</p>}
            </div>
        </section>
    );
}

/* ---------- Download ---------- */

interface DownloadViewProps {
    title: string;
    downloadLabel: string;
    onDownload: () => void;
    onBack: () => void;
    onRestart: () => void;
    toolId: string;
    /** Extra content between the button and "Continuar con…" (stats, previews). */
    children?: React.ReactNode;
}

export function DownloadView({ title, downloadLabel, onDownload, onBack, onRestart, toolId, children }: DownloadViewProps) {
    const tool = getTool(toolId);
    const related = (tool.related ?? []).map(getTool);

    return (
        <section className="animate-stage min-h-[calc(100vh-4rem)] flex flex-col items-center px-4 pt-16 pb-24 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink max-w-2xl">{title}</h2>

            <div className="mt-10 flex items-center gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    title="Volver a editar"
                    aria-label="Volver a editar"
                    className="w-12 h-12 rounded-full bg-surface border border-line text-ink-2 hover:text-ink hover:border-line-strong flex items-center justify-center shadow-card transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={onDownload}
                    className="px-10 py-5 rounded-2xl bg-brand hover:bg-brand-hover text-white text-lg md:text-xl font-bold flex items-center gap-3 shadow-cta transition-colors cursor-pointer"
                >
                    <Download className="w-6 h-6" strokeWidth={2.5} />
                    {downloadLabel}
                </button>

                <button
                    type="button"
                    onClick={onRestart}
                    title="Empezar de nuevo"
                    aria-label="Empezar de nuevo"
                    className="w-12 h-12 rounded-full bg-surface border border-line text-ink-2 hover:text-ink hover:border-line-strong flex items-center justify-center shadow-card transition-colors cursor-pointer"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <p className="mt-4 text-xs text-muted">La descarga empezó automáticamente. Si no la ves, pulsa el botón.</p>

            {children && <div className="mt-10 w-full max-w-4xl">{children}</div>}

            {related.length > 0 && (
                <div className="mt-16 w-full max-w-3xl text-left">
                    <h3 className="text-lg font-bold text-ink mb-4">Continuar con…</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {related.map((t) => {
                            const Icon = t.icon;
                            return (
                                <Link
                                    key={t.id}
                                    href={t.href}
                                    className="group flex items-center gap-3 rounded-xl bg-surface border border-line hover:border-line-strong px-4 py-3.5 shadow-card transition-colors"
                                >
                                    <span
                                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${t.color}1a`, color: t.color }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </span>
                                    <span className="flex-1 text-sm font-bold text-ink">{t.name}</span>
                                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

/* ---------- Loading PDF overlay (circular progress - Pro HUD) ---------- */

export function PdfLoadingOverlay({ 
    progress, 
    title = 'Cargando PDF', 
    subtitle = 'Procesando páginas del documento...' 
}: { 
    progress: number; 
    title?: string; 
    subtitle?: string;
}) {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.max(0, Math.min(100, progress)) / 100) * circumference;

    return (
        <div className="animate-fadeIn fixed inset-0 z-[80] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#121624] border border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.25)] p-8 text-center text-white">
                <div className="flex flex-col items-center gap-5">
                    {/* Circular Percentage Ring */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            {/* Track */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="6"
                                fill="none"
                            />
                            {/* Progress Stroke */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="#818cf8"
                                strokeWidth="6"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                                className="transition-[stroke-dashoffset] duration-200"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-indigo-400 tabular-nums">{progress}%</span>
                        </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full space-y-1.5 pt-2">
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-200 shadow-sm shadow-indigo-500/50" 
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium tabular-nums">{progress}% completado</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
