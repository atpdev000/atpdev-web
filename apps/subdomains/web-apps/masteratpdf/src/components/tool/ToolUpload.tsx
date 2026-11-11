'use client';

import React, { useRef } from 'react';
import { ShieldCheck, Server } from 'lucide-react';
import type { ToolDef } from '@/lib/tools';
import { MAX_FILE_MB } from '@/lib/files';
import { useWindowFileDrop } from '@/hooks/useWindowFileDrop';
import { DropOverlay } from './DropOverlay';

interface ToolUploadProps {
    tool: ToolDef;
    title?: string;
    description?: string;
    accept: string;
    multiple?: boolean;
    buttonLabel: string;
    dropLabel: string;
    /** 'local' = processed in the browser, 'server' = sent to the conversion backend. */
    processing?: 'local' | 'server';
    error?: string | null;
    onFiles: (files: File[]) => void;
}

/** The big centered landing every tool starts with. */
export function ToolUpload({
    tool,
    title,
    description,
    accept,
    multiple = false,
    buttonLabel,
    dropLabel,
    processing = 'local',
    error,
    onFiles,
}: ToolUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isDragging = useWindowFileDrop(onFiles);
    const Icon = tool.icon;

    return (
        <section className="animate-stage min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 text-center">
            <div
                className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${tool.color}1a`, color: tool.color }}
            >
                <Icon className="w-7 h-7" strokeWidth={2.2} />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
                {title ?? tool.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-ink-2 max-w-2xl leading-relaxed">
                {description ?? tool.description}
            </p>

            <div className="mt-10 flex flex-col items-center gap-3">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="min-w-[300px] px-10 py-6 rounded-2xl bg-brand hover:bg-brand-hover text-white text-xl md:text-2xl font-bold shadow-cta transition-colors cursor-pointer"
                >
                    {buttonLabel}
                </button>
                <p className="text-sm text-muted">{dropLabel}</p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) onFiles(Array.from(e.target.files));
                        e.target.value = '';
                    }}
                />
            </div>

            {error && (
                <p role="alert" className="mt-6 max-w-lg rounded-xl bg-danger-soft text-danger text-sm font-medium px-4 py-3">
                    {error}
                </p>
            )}

            <p className="mt-12 flex items-center gap-2 text-xs text-muted max-w-md">
                {processing === 'local' ? (
                    <>
                        <ShieldCheck className="w-4 h-4 text-ok shrink-0" />
                        Tus archivos se procesan en tu navegador y nunca salen de tu equipo. Hasta {MAX_FILE_MB} MB por archivo.
                    </>
                ) : (
                    <>
                        <Server className="w-4 h-4 text-ink-2 shrink-0" />
                        La conversión se hace en el servidor de conversión de MasterAtPDF. Hasta {MAX_FILE_MB} MB por archivo.
                    </>
                )}
            </p>

            <DropOverlay show={isDragging} label={multiple ? 'Suelta tus archivos aquí' : 'Suelta tu archivo aquí'} />
        </section>
    );
}
