import Link from 'next/link';
import React from 'react';
import { Files, ShieldCheck, Cpu, ArrowUpRight, Zap, Heart } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const organizeTools = TOOLS.filter(t => t.category === 'organize');
    const convertTools = TOOLS.filter(t => t.category === 'to-pdf' || t.category === 'from-pdf');
    const optimizeTools = TOOLS.filter(t => t.category === 'optimize' || t.category === 'security');

    return (
        <footer className="w-full border-t border-line bg-surface mt-20 transition-colors">
            {/* Top highlight bar */}
            <div className="border-b border-line bg-canvas">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span><strong>Privacidad 100% Garantizada:</strong> Procesamiento local en tu navegador. Tus archivos nunca salen de tu ordenador.</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                            <Cpu className="w-4 h-4 text-brand shrink-0" />
                            <span>Acelerado con WebAssembly & PDF.js v5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Columns */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                    
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-4 pr-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
                                <Files className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-black text-ink tracking-tight">
                                MasterAt<span className="text-brand">PDF</span> <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-bold border border-brand/20">PRO</span>
                            </span>
                        </Link>
                        <p className="text-xs text-ink-2 leading-relaxed max-w-sm">
                            La suite integral de herramientas PDF client-side con estándar profesional. Une, divide, comprime, rota, convierte y organiza documentos hasta 250MB con total privacidad y velocidad.
                        </p>
                        <div className="pt-2">
                            <a 
                                href="https://atpdev.dev" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                            >
                                <span>Explorar Ecosistema ATP DEV</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Organizar */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3.5">
                            Organizar PDF
                        </h3>
                        <ul className="space-y-2 text-xs">
                            {organizeTools.map(t => (
                                <li key={t.id}>
                                    <Link 
                                        href={t.href} 
                                        className="text-ink-2 hover:text-brand transition-colors flex items-center gap-1.5"
                                    >
                                        <span>{t.name}</span>
                                        {t.isNew && (
                                            <span className="text-[9px] px-1 py-0.2 rounded bg-pink-100 text-pink-700 font-bold">
                                                NUEVO
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Conversión */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3.5">
                            Conversión
                        </h3>
                        <ul className="space-y-2 text-xs">
                            {convertTools.slice(0, 5).map(t => (
                                <li key={t.id}>
                                    <Link 
                                        href={t.href} 
                                        className="text-ink-2 hover:text-brand transition-colors"
                                    >
                                        {t.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Optimización y Seguridad */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3.5">
                            Optimizar & Más
                        </h3>
                        <ul className="space-y-2 text-xs">
                            {optimizeTools.map(t => (
                                <li key={t.id}>
                                    <Link 
                                        href={t.href} 
                                        className="text-ink-2 hover:text-brand transition-colors"
                                    >
                                        {t.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <p>© {currentYear} MasterAtPDF · Diseñado con precisión por ATP DEV Ecosystem.</p>
                    <p className="flex items-center gap-1 text-[11px]">
                        <span>Hecho para profesionales de alto rendimiento</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
