'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    Search, 
    ShieldCheck, 
    Zap, 
    HardDrive, 
    Sparkles, 
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { TOOLS, CATEGORIES, ToolCategory } from '@/lib/tools';

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredTools = useMemo(() => {
        return TOOLS.filter((tool) => {
            const matchesCategory =
                selectedCategory === 'all' || tool.category === selectedCategory;
            const matchesSearch =
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-canvas">
            {/* Hero Section - Authentic iLovePDF Style */}
            <section className="relative pt-16 pb-14 md:pt-20 md:pb-16 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>MasterAtPDF 2.0 · Estándar Profesional Client-Side</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight leading-tight">
                        Cada herramienta que necesitas para usar PDFs, <span className="text-brand">en un solo lugar</span>
                    </h1>

                    <p className="text-sm md:text-base text-ink-2 max-w-2xl mx-auto leading-relaxed">
                        Todas las herramientas son <strong>100% locales, privadas y sin límites</strong>. Une, divide, comprime, convierte, rota y organiza tus archivos PDF hasta 250MB directamente en tu navegador.
                    </p>

                    {/* Search Bar */}
                    <div className="pt-4 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar herramienta (ej. unir, dividir, comprimir, jpg...)"
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-line bg-surface text-ink text-sm placeholder:text-muted focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-card"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-semibold px-2 py-1 rounded"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                                    selectedCategory === cat.id
                                        ? 'bg-ink text-white shadow-sm'
                                        : 'bg-surface border border-line text-ink-2 hover:border-line-strong hover:text-ink'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tool Grid Section */}
            <section id="herramientas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {filteredTools.length === 0 ? (
                    <div className="text-center py-16 bg-surface rounded-2xl border border-line p-8 max-w-md mx-auto">
                        <p className="text-sm text-ink-2 font-medium">No se encontraron herramientas con "{searchQuery}"</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="mt-3 text-xs font-bold text-brand hover:underline"
                        >
                            Ver todas las herramientas
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTools.map((tool) => {
                            const Icon = tool.icon;
                            const isReady = tool.status === 'ready';

                            const CardContent = (
                                <div className={`relative h-full flex flex-col p-6 rounded-2xl bg-surface border border-line transition-all duration-200 ${
                                    isReady
                                        ? 'shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-line-strong cursor-pointer group'
                                        : 'opacity-70 border-dashed bg-surface/50 cursor-not-allowed'
                                }`}>
                                    {/* Tool Accent Color Bar */}
                                    <div 
                                        className="absolute top-0 left-6 right-6 h-1 rounded-b"
                                        style={{ backgroundColor: tool.color }}
                                    />

                                    {/* Icon & Badges */}
                                    <div className="flex items-center justify-between mb-4 pt-1">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                                            style={{
                                                backgroundColor: `${tool.color}15`,
                                                color: tool.color,
                                            }}
                                        >
                                            <Icon className="w-6 h-6" strokeWidth={2.2} />
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {tool.isNew && (
                                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                                                    NUEVO
                                                </span>
                                            )}
                                            {!isReady && (
                                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-canvas text-muted border border-line">
                                                    PRONTO
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-brand transition-colors">
                                        {tool.name}
                                    </h3>
                                    <p className="text-xs text-ink-2 leading-relaxed flex-1">
                                        {tool.description}
                                    </p>

                                    {/* Bottom Arrow Indicator */}
                                    {isReady && (
                                        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-muted group-hover:text-brand transition-colors">
                                            <span>Abrir herramienta</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </div>
                            );

                            return isReady ? (
                                <Link key={tool.id} href={tool.href} className="block">
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={tool.id}>{CardContent}</div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Why Choose MasterAtPDF Section */}
            <section className="border-t border-line bg-surface py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight">
                            ¿Por qué los profesionales prefieren MasterAtPDF?
                        </h2>
                        <p className="mt-2 text-sm text-ink-2">
                            Ingeniería documental sin concesiones en seguridad, velocidad y privacidad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-canvas border border-line space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-ink">100% Privado en tu Navegador</h3>
                            <p className="text-xs text-ink-2 leading-relaxed">
                                A diferencia de otros servicios en la nube, MasterAtPDF ejecuta todo el procesamiento localmente mediante WebAssembly. Tus documentos confidenciales nunca se suben a ningún servidor.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-canvas border border-line space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                <HardDrive className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-ink">Capacidad Masiva hasta 250 MB</h3>
                            <p className="text-xs text-ink-2 leading-relaxed">
                                Diseñado para manejar sin esfuerzo expedientes judiciales, planos de ingeniería, tesis y catálogos pesados sin advertencias molestas ni límites reducidos de tamaño.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-canvas border border-line space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-ink">Velocidad Instantánea Sin Esperas</h3>
                            <p className="text-xs text-ink-2 leading-relaxed">
                                Sin colas de espera, sin tiempo de carga ni de descarga a servidores remotos. El motor local aprovecha al máximo la CPU y memoria de tu dispositivo para resultados instantáneos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
