'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
    Files, 
    ChevronDown, 
    Menu, 
    X,
    ExternalLink,
    ShieldCheck,
    Layers,
    Scissors,
    LayoutGrid,
    Minimize2,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/lib/tools';

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close mega menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMegaMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const quickLinks = [
        { label: 'Unir PDF', href: '/tools/merge', color: '#e5322d' },
        { label: 'Dividir PDF', href: '/tools/split', color: '#f0712c' },
        { label: 'Organizar', href: '/tools/organize', color: '#d63f8c' },
        { label: 'Comprimir', href: '/tools/compress', color: '#1f9d55' },
        { label: 'PDF a Word', href: '/tools/pdf-to-word', color: '#2b6cd9' },
        { label: 'PDF a JPG', href: '/tools/pdf-to-jpg', color: '#e3a008' },
    ];

    const categoryGroups = [
        {
            title: 'Organizar PDF',
            color: '#e5322d',
            tools: TOOLS.filter(t => t.category === 'organize')
        },
        {
            title: 'Optimizar PDF',
            color: '#1f9d55',
            tools: TOOLS.filter(t => t.category === 'optimize')
        },
        {
            title: 'Convertir a PDF',
            color: '#2b6cd9',
            tools: TOOLS.filter(t => t.category === 'to-pdf')
        },
        {
            title: 'Convertir desde PDF',
            color: '#e3a008',
            tools: TOOLS.filter(t => t.category === 'from-pdf')
        },
        {
            title: 'Seguridad',
            color: '#4a5266',
            tools: TOOLS.filter(t => t.category === 'security')
        }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-line bg-surface/95 backdrop-blur-md transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Brand Logo - iLovePDF Style */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm shadow-brand/25 group-hover:scale-105 transition-transform">
                                <Files className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xl font-black tracking-tight text-ink">
                                        MasterAt<span className="text-brand">PDF</span>
                                    </span>
                                    <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                                        PRO
                                    </span>
                                </div>
                                <span className="text-[10px] text-muted font-medium -mt-0.5">
                                    100% Local · ATP DEV
                                </span>
                            </div>
                        </Link>

                        {/* Mega Menu Toggle */}
                        <div className="relative hidden lg:block" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                                    megaMenuOpen 
                                        ? 'bg-canvas text-brand' 
                                        : 'text-ink-2 hover:text-ink hover:bg-canvas'
                                }`}
                            >
                                <span>Todas las herramientas PDF</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Mega Menu */}
                            {megaMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[760px] rounded-2xl bg-surface border border-line shadow-lift p-6 grid grid-cols-3 gap-6 animate-fadeIn z-50">
                                    {categoryGroups.map((group) => (
                                        <div key={group.title} className="space-y-2">
                                            <div className="flex items-center gap-2 pb-1 border-b border-line">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">{group.title}</h4>
                                            </div>
                                            <div className="space-y-1">
                                                {group.tools.map((t) => {
                                                    const Icon = t.icon;
                                                    const isReady = t.status === 'ready';
                                                    return (
                                                        <Link
                                                            key={t.id}
                                                            href={t.href}
                                                            onClick={() => setMegaMenuOpen(false)}
                                                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                                isReady
                                                                    ? 'text-ink hover:bg-canvas hover:text-brand'
                                                                    : 'text-muted cursor-not-allowed opacity-60'
                                                            }`}
                                                        >
                                                            <span
                                                                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                                                                style={{ backgroundColor: `${t.color}15`, color: t.color }}
                                                            >
                                                                <Icon className="w-3.5 h-3.5" />
                                                            </span>
                                                            <span className="truncate">{t.name}</span>
                                                            {t.isNew && (
                                                                <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-pink-100 text-pink-700 font-bold">
                                                                    NUEVO
                                                                </span>
                                                            )}
                                                            {!isReady && (
                                                                <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-canvas text-muted font-bold">
                                                                    PRONTO
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation - Direct Quick Links */}
                    <nav className="hidden xl:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-3 py-2 rounded-xl text-ink-2 hover:text-ink hover:bg-canvas transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Action Bar */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>100% Local & Privado</span>
                        </div>

                        <a
                            href="https://atpdev.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-line bg-surface hover:bg-canvas text-ink transition-all shadow-xs"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>ATP DEV</span>
                            <ExternalLink className="w-3 h-3 text-muted" />
                        </a>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-ink-2 hover:bg-canvas transition-colors"
                        aria-label="Abrir menú"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-line space-y-4 max-h-[80vh] overflow-y-auto animate-fadeIn">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm font-bold text-brand bg-brand/5"
                        >
                            Página de Inicio
                        </Link>

                        {categoryGroups.map((group) => (
                            <div key={group.title} className="space-y-1 px-3">
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-muted mb-1">
                                    {group.title}
                                </h4>
                                <div className="grid grid-cols-2 gap-1">
                                    {group.tools.map((t) => {
                                        const Icon = t.icon;
                                        const isReady = t.status === 'ready';
                                        return (
                                            <Link
                                                key={t.id}
                                                href={t.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${
                                                    isReady ? 'text-ink hover:bg-canvas' : 'text-muted opacity-50'
                                                }`}
                                            >
                                                <span
                                                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: `${t.color}15`, color: t.color }}
                                                >
                                                    <Icon className="w-3 h-3" />
                                                </span>
                                                <span className="truncate">{t.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="pt-3 border-t border-line px-3">
                            <a
                                href="https://atpdev.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-ink bg-canvas rounded-xl"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Portal Principal ATP DEV
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-muted" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
