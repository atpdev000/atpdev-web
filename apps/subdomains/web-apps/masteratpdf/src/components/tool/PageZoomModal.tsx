'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    X, 
    ZoomIn, 
    ZoomOut, 
    RotateCw, 
    ChevronLeft, 
    ChevronRight, 
    Maximize2, 
    Minimize2 
} from 'lucide-react';
import { loadPdfDocument } from '@/lib/pdf/pdfHelper';

interface PageZoomModalProps {
    file: File | null;
    pageIndex: number;
    totalPages: number;
    initialThumbnail?: string;
    rotation?: number;
    onClose: () => void;
    onNavigate?: (newPageIndex: number) => void;
    onRotate?: (pageIndex: number) => void;
}

export function PageZoomModal({
    file,
    pageIndex,
    totalPages,
    initialThumbnail,
    rotation = 0,
    onClose,
    onNavigate,
    onRotate,
}: PageZoomModalProps) {
    const [zoom, setZoom] = useState<number>(1);
    const [highResUrl, setHighResUrl] = useState<string | null>(null);
    const [loadingHighRes, setLoadingHighRes] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Render high resolution version of the page (scale 1.5)
    useEffect(() => {
        let isCancelled = false;

        const renderHighRes = async () => {
            if (!file) return;
            setLoadingHighRes(true);
            try {
                const buffer = await file.arrayBuffer();
                const pdf = await loadPdfDocument(buffer);
                if (isCancelled) return;

                const page = await pdf.getPage(pageIndex + 1);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport } as any).promise;
                    if (!isCancelled) {
                        setHighResUrl(canvas.toDataURL('image/jpeg', 0.95));
                    }
                }
            } catch (err) {
                console.error('Error rendering high res page:', err);
            } finally {
                if (!isCancelled) setLoadingHighRes(false);
            }
        };

        renderHighRes();

        return () => {
            isCancelled = true;
        };
    }, [file, pageIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft' && onNavigate && pageIndex > 0) {
                onNavigate(pageIndex - 1);
            } else if (e.key === 'ArrowRight' && onNavigate && pageIndex < totalPages - 1) {
                onNavigate(pageIndex + 1);
            } else if (e.key === '+' || e.key === '=') {
                setZoom((z) => Math.min(2.5, z + 0.25));
            } else if (e.key === '-') {
                setZoom((z) => Math.max(0.5, z - 0.25));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNavigate, pageIndex, totalPages]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn select-none">
            {/* Top Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between text-white py-2 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lift">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tracking-tight">
                        Página {pageIndex + 1} <span className="text-white/60">de {totalPages}</span>
                    </span>
                    {loadingHighRes && (
                        <span className="text-[11px] text-indigo-300 font-medium animate-pulse">
                            Cargando alta definición…
                        </span>
                    )}
                </div>

                {/* Center Controls */}
                <div className="flex items-center gap-1.5 bg-black/30 rounded-xl p-1 border border-white/10">
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                        className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                        title="Reducir zoom (-)"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold px-2 text-white/90">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                        className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                        title="Aumentar zoom (+)"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setZoom(1)}
                        className="px-2 py-1 rounded-lg hover:bg-white/15 text-[11px] font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                        Ajustar
                    </button>
                    {onRotate && (
                        <button
                            type="button"
                            onClick={() => onRotate(pageIndex)}
                            className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer border-l border-white/10 ml-1 pl-2"
                            title="Girar 90°"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Cerrar visor (Esc)"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main Stage with Page & Nav Chevrons */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-auto p-4">
                {/* Previous Page Chevron */}
                {onNavigate && pageIndex > 0 && (
                    <button
                        type="button"
                        onClick={() => onNavigate(pageIndex - 1)}
                        className="absolute left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-lift cursor-pointer hover:scale-105"
                        title="Página anterior (←)"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Page Image */}
                <div
                    className="transition-transform duration-200 shadow-2xl rounded-xl overflow-hidden bg-white max-h-[82vh] flex items-center justify-center"
                    style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={highResUrl || initialThumbnail}
                        alt={`Página ${pageIndex + 1}`}
                        className="max-h-[80vh] max-w-[80vw] object-contain"
                        draggable={false}
                    />
                </div>

                {/* Next Page Chevron */}
                {onNavigate && pageIndex < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={() => onNavigate(pageIndex + 1)}
                        className="absolute right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-lift cursor-pointer hover:scale-105"
                        title="Página siguiente (→)"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Bottom Info bar */}
            <div className="text-white/60 text-xs flex items-center gap-4 py-1">
                <span>Usa las flechas del teclado ← → para navegar</span>
                <span>·</span>
                <span>Pulsa Esc para salir</span>
            </div>
        </div>
    );
}
