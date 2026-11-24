'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, Server, CheckCircle2, HelpCircle } from 'lucide-react';
import type { ToolDef } from '@/lib/tools';
import { TOOL_GUIDES } from '@/lib/tool-guides';
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
    const guide = TOOL_GUIDES[tool.id];

    return (
        <>
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

        {guide && (
            <article className="border-t border-line bg-surface px-4 py-12 sm:py-14">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'SoftwareApplication',
                                    name: `${tool.name} — MasterAtPDF Pro`,
                                    applicationCategory: 'BusinessApplication',
                                    operatingSystem: 'All',
                                    url: `https://masteratpdf.atpdev.dev${tool.href}`,
                                    description: guide.intro,
                                    offers: {
                                        '@type': 'Offer',
                                        price: '0',
                                        priceCurrency: 'USD',
                                    },
                                },
                                {
                                    '@type': 'FAQPage',
                                    mainEntity: guide.faqs.map((faq) => ({
                                        '@type': 'Question',
                                        name: faq.q,
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: faq.a,
                                        },
                                    })),
                                },
                            ],
                        }),
                    }}
                />
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand">
                            Guía Práctica MasterAtPDF
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                            {guide.headline}
                        </h2>
                        <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
                            {guide.intro}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-line bg-surface-2 p-5 space-y-3">
                            <h3 className="text-sm font-bold text-ink">Pasos rápidos de uso</h3>
                            <ol className="space-y-2 text-xs sm:text-sm text-ink-2 list-decimal list-inside">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="leading-relaxed">
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="rounded-2xl border border-line bg-surface-2 p-5 space-y-3">
                            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-ok" />
                                <span>Ventajas y recomendaciones</span>
                            </h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-ink-2 list-disc list-inside">
                                {guide.tips.map((tip, i) => (
                                    <li key={i} className="leading-relaxed">
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-brand" />
                            <span>Preguntas frecuentes sobre {tool.name}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {guide.faqs.map((faq, i) => (
                                <div key={i} className="rounded-2xl border border-line bg-surface-2 p-4 space-y-1.5">
                                    <div className="text-xs sm:text-sm font-bold text-ink">{faq.q}</div>
                                    <p className="text-xs text-ink-2 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-line bg-surface-2 p-6 space-y-4">
                        <h3 className="text-base font-extrabold text-ink">
                            Arquitectura Técnica ISO 32000-2, Privacidad y Estándares de Calidad en {tool.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                            La herramienta <strong>{tool.name}</strong> de <strong>MasterAtPDF Pro</strong> ha sido desarrollada siguiendo la especificación internacional <strong>ISO 32000-2 (PDF 2.0)</strong> para garantizar que la estructura interna del documento —incluyendo árboles de páginas, tablas de referencias cruzadas (<code>xref</code>), fuentes tipográficas incrustadas, perfiles de color ICC, metadatos XMP y flujos de contenido comprimidos con FlateDecode— se preserve sin corrupción ni pérdida de legibilidad durante todo el procesamiento.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-ink-2 leading-relaxed">
                            <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
                                <h4 className="font-bold text-ink">
                                    {processing === 'local'
                                        ? 'Ejecución Local con WebAssembly y PDF.js'
                                        : 'Motor Híbrido con Conversión Efímera Cifrada'}
                                </h4>
                                <p>
                                    {processing === 'local'
                                        ? `Esta operación se ejecuta directamente en la memoria RAM de tu navegador mediante módulos WebAssembly de alto rendimiento, admitiendo expedientes de hasta ${MAX_FILE_MB} MB sin colas de espera y manteniendo tus archivos bajo custodia local en tu dispositivo.`
                                        : `Esta transformación combina previsualización local en navegador con nuestro motor de alta precisión basado en PyMuPDF C++ sobre HTTPS. Los documentos de hasta ${MAX_FILE_MB} MB se procesan en contenedores aislados por UUID y se eliminan automáticamente de forma definitiva inmediatamente después de generar el archivo resultante.`}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
                                <h4 className="font-bold text-ink">Compatibilidad Multiplataforma y Casos de Uso</h4>
                                <p>
                                    Optimizado para flujos de trabajo corporativos, expedientes judiciales y notariales, entregas académicas, facturación electrónica y archivos técnicos de ingeniería. El documento resultante es 100 % compatible con Adobe Acrobat Reader, visores PDF de navegadores modernos (Chrome, Edge, Firefox, Safari) y sistemas de gestión documental en Windows, macOS, Linux, Android e iOS.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                        <span>Procesamiento orientado a privacidad · ATP DEV</span>
                        <div className="flex flex-wrap gap-4 font-semibold">
                            <Link href="/" className="text-brand hover:underline">Todas las herramientas PDF</Link>
                            <Link href="/privacidad" className="text-ink-2 hover:underline">Privacidad</Link>
                            <Link href="/terminos" className="text-ink-2 hover:underline">Términos</Link>
                        </div>
                    </div>
                </div>
            </article>
        )}
    </>
    );
}
