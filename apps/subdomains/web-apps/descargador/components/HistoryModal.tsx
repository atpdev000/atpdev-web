'use client';

import { X, Trash2, Clock, Share2, Play, Music, ExternalLink, Download } from 'lucide-react';
import { HistoryItem } from '@/hooks/useDownloadHistory';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileOpener } from '@capacitor-community/file-opener';
import { Dialog } from '@capacitor/dialog';
import { Share } from '@capacitor/share';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { shareNativeMedia, NativeWhatsAppStatus } from '@/lib/nativeBridge';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onClear: () => void;
    onDelete: (id: string) => void;
}

export default function HistoryModal({ isOpen, onClose, history = [], onClear, onDelete }: HistoryModalProps) {
    const [mounted, setMounted] = useState(false);
    const [selectedPreview, setSelectedPreview] = useState<HistoryItem | null>(null);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setVideoError(false);
    }, [selectedPreview]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedPreview) {
                    setSelectedPreview(null);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, selectedPreview]);

    if (!mounted || !isOpen || typeof document === 'undefined') return null;

    const handleClose = (e?: React.SyntheticEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setSelectedPreview(null);
        onClose();
    };

    const handleItemClick = (item: HistoryItem) => {
        setSelectedPreview(item);
    };

    const handleOpenExternal = async (filePath: string, mimeType?: string) => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await NativeWhatsAppStatus.openMedia({ filePath });
        } catch (e) {
            try {
                await FileOpener.open({
                    filePath,
                    contentType: mimeType || 'video/mp4'
                });
            } catch (err) {
                console.warn('Error abriendo con reproductor externo:', err);
            }
        }
    };

    const handleShare = async (e: React.SyntheticEvent, item: HistoryItem) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            // 1. Archivo nativo en Android (WhatsApp, Telegram o app externa mediante FileProvider)
            if (item.filePath && Capacitor.isNativePlatform()) {
                try {
                    const shared = await shareNativeMedia(item.filePath, item.title, item.originalUrl);
                    if (shared) return;
                } catch (e) {
                    console.warn('Fallo en shareNativeMedia:', e);
                }

                // Intento alternativo con Capacitor Share pasando el archivo directamente
                try {
                    await Share.share({
                        title: item.title || 'Compartir archivo',
                        url: item.filePath,
                        dialogTitle: 'Compartir archivo de video'
                    });
                    return;
                } catch {}
            }

            // Si el archivo en nativo está vacío o no se guardó
            if (Capacitor.isNativePlatform() && (!item.filePath || item.fileSize === '0 Bytes' || item.fileSize === '0 B')) {
                await Dialog.alert({
                    title: 'Archivo no disponible',
                    message: 'El archivo no se encuentra guardado en el teléfono o la descarga no finalizó. Por favor vuelve a descargarlo para poder compartir el video.'
                });
                return;
            }

            // 2. Enlace compartido mediante Capacitor Share o Web Share como último recurso
            const shareUrl = item.originalUrl || item.filePath || (typeof window !== 'undefined' ? window.location.href : '');
            const shareTitle = item.title || 'FTY Downloader Pro';

            if (Capacitor.isNativePlatform()) {
                try {
                    await Share.share({
                        title: shareTitle,
                        text: `Descargado con FTY Downloader Pro: ${shareTitle}`,
                        url: shareUrl,
                        dialogTitle: 'Compartir descarga'
                    });
                    return;
                } catch (shareErr) {
                    console.warn('Share.share falló:', shareErr);
                }
            }

            if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: shareTitle,
                        url: shareUrl
                    });
                    return;
                } catch (err: any) {
                    if (err?.name === 'AbortError') return;
                }
            }

            // Fallback portapapeles
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                try {
                    await Toast.show({ text: '📋 Enlace copiado al portapapeles', duration: 'short' });
                } catch {
                    alert('📋 Enlace copiado al portapapeles');
                }
            }
        } catch (error: any) {
            console.error('Error al compartir:', error);
        }
    };

    const handleDelete = (e: React.SyntheticEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            onDelete(id);
            if (Capacitor.isNativePlatform()) {
                Toast.show({
                    text: 'Descarga eliminada del historial',
                    duration: 'short',
                    position: 'bottom'
                }).catch(() => {});
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const handleClearAll = async (e: React.SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();
        let confirmed = false;
        try {
            if (Capacitor.isNativePlatform()) {
                const confirmPromise = Dialog.confirm({
                    title: '¿Borrar todo el historial?',
                    message: 'Se eliminarán todos los registros de descargas de la lista.',
                    okButtonTitle: 'Borrar Todo',
                    cancelButtonTitle: 'Cancelar'
                });
                const timeoutPromise = new Promise<{ value: boolean }>((res) => 
                    setTimeout(() => res({ value: window.confirm('¿Borrar todo el historial?') }), 4000)
                );
                const { value } = await Promise.race([confirmPromise, timeoutPromise]);
                confirmed = value;
            } else {
                confirmed = window.confirm('¿Deseas eliminar todo el historial de descargas?');
            }
        } catch {
            confirmed = window.confirm('¿Deseas eliminar todo el historial de descargas?');
        }

        if (confirmed) {
            onClear();
            try {
                if (Capacitor.isNativePlatform()) {
                    await Toast.show({ text: 'Historial vaciado', duration: 'short' });
                }
            } catch {}
        }
    };

    const safeHistory = Array.isArray(history) ? history : [];

    const modalContent = (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 animate-in fade-in duration-150"
            style={{
                paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
                paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
                paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose(e);
            }}
        >
            <div 
                className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Superior Limpio y Siempre Visible */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 mr-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 pointer-events-none" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                                    Historial de Descargas
                                </h2>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                                    {safeHistory.length}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                {safeHistory.length === 0 ? 'Sin descargas registradas' : `${safeHistory.length} ${safeHistory.length === 1 ? 'archivo guardado' : 'archivos guardados'}`}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700 rounded-full shrink-0 cursor-pointer touch-manipulation z-30"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>

                {/* Lista de Descargas con Estilos Pro Dark & Light */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
                    {safeHistory.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-slate-800/80 flex items-center justify-center text-gray-400 dark:text-slate-500">
                                <Clock className="w-8 h-8 opacity-60 pointer-events-none" />
                            </div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">No hay descargas recientes</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                                Los videos y audios que descargues en cualquier plataforma se guardarán aquí para reproducirlos o compartirlos.
                            </p>
                        </div>
                    ) : (
                        safeHistory.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50/90 dark:bg-slate-800/70 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl relative"
                            >
                                {/* Indicador de no leído */}
                                {!item.read && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900 pointer-events-none"></span>
                                )}

                                {/* Área clickeable para abrir multimedia (independiente de botones) */}
                                <div 
                                    className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 cursor-pointer active:opacity-75 touch-manipulation select-none"
                                    onClick={() => handleItemClick(item)}
                                >
                                    {/* Thumbnail o Ícono Multimedia */}
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-slate-700 relative shadow-xs">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover pointer-events-none"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (item.thumbnail && !target.src.includes('/api/download/proxy/image')) {
                                                        target.src = `/api/download/proxy/image?url=${encodeURIComponent(item.thumbnail)}`;
                                                    } else {
                                                        target.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${item.mimeType?.includes('audio') ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-400'}`}>
                                                {item.mimeType?.includes('audio') ? (
                                                    <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}

                                        {/* Overlay Botón Play sutil */}
                                        <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-xs">
                                                <Play className="w-2.5 h-2.5 fill-current ml-0.5 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Badge de plataforma sobre la thumbnail */}
                                        <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded flex items-center justify-center shadow-xs ${
                                            item.platform === 'youtube' ? 'bg-red-600' :
                                            item.platform === 'facebook' ? 'bg-blue-600' :
                                            item.platform === 'instagram' ? 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600' :
                                            item.platform === 'twitter' ? 'bg-black' :
                                            item.platform === 'threads' ? 'bg-zinc-800' :
                                            item.platform === 'whatsapp' ? 'bg-emerald-600' :
                                            'bg-black'
                                        }`}>
                                            {item.platform === 'youtube' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                            )}
                                            {item.platform === 'facebook' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                            )}
                                            {item.platform === 'tiktok' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12v8.76c-.52 4.03-3.71 6.83-7.79 6.83-4.08 0-7.39-3.23-7.39-7.22 0-3.99 3.32-7.22 7.4-7.22.51-.01 1.02.04 1.53.12v4.06c-.36-.12-.73-.2-1.11-.2-1.89 0-3.41 1.53-3.41 3.42s1.52 3.42 3.41 3.42c1.67 0 3.08-1.2 3.36-2.81.07-.38.08-.77.08-1.15V.02z" /></svg>
                                            )}
                                            {item.platform === 'instagram' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                            )}
                                            {item.platform === 'twitter' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                            )}
                                            {item.platform === 'threads' && (
                                                <span className="text-white text-[8px] font-bold pointer-events-none">@</span>
                                            )}
                                            {item.platform === 'whatsapp' && (
                                                <svg className="w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Información del archivo */}
                                    <div className="flex-1 min-w-0 pr-1">
                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                                            {item.title}
                                        </h3>
                                        
                                        <div className="flex items-center text-[10px] sm:text-[11px] text-gray-500 dark:text-slate-400 gap-1 mt-0.5 flex-wrap">
                                            <span className="capitalize font-medium text-gray-700 dark:text-slate-300">{item.platform}</span>
                                            <span>•</span>
                                            <span>{new Date(item.date).toLocaleDateString()}</span>
                                            {item.format && (
                                                <>
                                                    <span>•</span>
                                                    <span className="uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1 py-0.2 rounded text-[9px] font-bold">
                                                        {item.format}
                                                    </span>
                                                </>
                                            )}
                                            {item.fileSize && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-gray-400 dark:text-slate-400">{item.fileSize}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones independientes: Compartir y Borrar */}
                                <div className="flex items-center gap-1.5 shrink-0 z-30">
                                    <button
                                        type="button"
                                        onClick={(e) => handleShare(e, item)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:bg-blue-200 dark:active:bg-blue-500/30 border border-blue-200/60 dark:border-blue-500/20 rounded-xl flex items-center justify-center shadow-xs cursor-pointer touch-manipulation"
                                        title="Compartir archivo"
                                        aria-label="Compartir archivo"
                                    >
                                        <Share2 className="w-4 h-4 pointer-events-none" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => handleDelete(e, item.id)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 dark:active:bg-red-500/30 border border-red-200/60 dark:border-red-500/20 rounded-xl flex items-center justify-center shadow-xs cursor-pointer touch-manipulation"
                                        title="Eliminar del historial"
                                        aria-label="Eliminar del historial"
                                    >
                                        <Trash2 className="w-4 h-4 pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer con Botón de Vaciar Historial */}
                {safeHistory.length > 0 && (
                    <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/90 shrink-0">
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="w-full py-2.5 sm:py-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:bg-red-100 dark:active:bg-red-500/20 border border-red-200/60 dark:border-red-500/20 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer touch-manipulation"
                        >
                            <Trash2 className="w-4 h-4 pointer-events-none" />
                            Borrar Todo el Historial
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const isAudio = Boolean(
        selectedPreview?.mimeType?.includes('audio') ||
        selectedPreview?.format?.toLowerCase().includes('audio') ||
        selectedPreview?.format?.toLowerCase().includes('mp3') ||
        selectedPreview?.title?.toLowerCase().endsWith('.mp3') ||
        selectedPreview?.title?.toLowerCase().endsWith('.m4a')
    );
    const isImage = Boolean(
        selectedPreview?.mimeType?.includes('image') ||
        selectedPreview?.format?.toLowerCase().includes('foto') ||
        selectedPreview?.title?.toLowerCase().endsWith('.jpg') ||
        selectedPreview?.title?.toLowerCase().endsWith('.png') ||
        selectedPreview?.title?.toLowerCase().endsWith('.jpeg') ||
        selectedPreview?.title?.toLowerCase().endsWith('.webp')
    );

    let mediaSrc = '';
    if (selectedPreview) {
        const path = selectedPreview.filePath || selectedPreview.originalUrl || '';
        if (path) {
            if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
                mediaSrc = path;
            } else if (Capacitor.isNativePlatform()) {
                mediaSrc = Capacitor.convertFileSrc(path);
            } else {
                mediaSrc = path;
            }
        }
        if (!mediaSrc && selectedPreview.thumbnail) {
            mediaSrc = selectedPreview.thumbnail;
        }
    }

    const previewModalContent = selectedPreview ? (
        <div 
            className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
            style={{
                paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedPreview(null);
            }}
        >
            <div 
                className="relative max-w-lg w-full max-h-[92vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header del Reproductor */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between text-white border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-2 min-w-0 mr-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white shrink-0 ${
                            selectedPreview.platform === 'youtube' ? 'bg-red-600' :
                            selectedPreview.platform === 'facebook' ? 'bg-blue-600' :
                            selectedPreview.platform === 'instagram' ? 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600' :
                            selectedPreview.platform === 'tiktok' ? 'bg-zinc-800' :
                            selectedPreview.platform === 'threads' ? 'bg-zinc-800' :
                            selectedPreview.platform === 'whatsapp' ? 'bg-emerald-600' :
                            'bg-blue-600'
                        }`}>
                            {selectedPreview.platform}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-800 text-slate-300 shrink-0">
                            {isImage ? 'FOTO' : (isAudio ? 'AUDIO' : (selectedPreview.format || 'HD'))}
                        </span>
                        <span className="font-bold text-xs sm:text-sm truncate text-slate-100">{selectedPreview.title}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedPreview(null)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 text-sm font-bold cursor-pointer shrink-0 transition-colors active:scale-95"
                        aria-label="Cerrar visor"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Reproductor / Visor Multimedia */}
                <div className="flex-1 overflow-hidden flex items-center justify-center bg-black p-2 min-h-[300px] max-h-[70vh] relative">
                    {isImage ? (
                        <img
                            src={mediaSrc}
                            alt={selectedPreview.title}
                            className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                        />
                    ) : isAudio ? (
                        <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Music className="w-12 h-12 text-white animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold text-sm truncate max-w-xs">{selectedPreview.title}</p>
                                <p className="text-slate-400 text-xs mt-1">{selectedPreview.fileSize || 'Pista de Audio'}</p>
                            </div>
                            {mediaSrc ? (
                                <audio
                                    key={selectedPreview.id}
                                    src={mediaSrc}
                                    controls
                                    autoPlay
                                    className="w-full max-w-md"
                                />
                            ) : (
                                <p className="text-xs text-slate-400">Audio guardado en la carpeta FTYdownloaderPro Audio</p>
                            )}
                        </div>
                    ) : (selectedPreview.filePath && !videoError) ? (
                        <video
                            key={selectedPreview.id}
                            src={mediaSrc}
                            controls
                            autoPlay
                            playsInline
                            onError={(e) => {
                                console.warn('Error en reproductor HTML5 interno:', e);
                                setVideoError(true);
                            }}
                            className="max-h-[68vh] w-full rounded-xl object-contain bg-black shadow-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Play className="w-8 h-8 ml-1" />
                            </div>
                            <p className="font-bold text-base">Video guardado en el dispositivo</p>
                            <p className="text-xs text-slate-300 max-w-xs">
                                Este archivo fue descargado en tu Galería de videos o en la carpeta <span className="text-blue-400 font-mono">FTYdownloaderPro Video</span> de tu teléfono.
                            </p>
                            {selectedPreview.filePath && Capacitor.isNativePlatform() && (
                                <button
                                    type="button"
                                    onClick={() => handleOpenExternal(selectedPreview.filePath!, selectedPreview.mimeType)}
                                    className="mt-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    <span>Abrir con Reproductor Externo</span>
                                </button>
                            )}
                            {selectedPreview.originalUrl && (
                                <button
                                    type="button"
                                    onClick={() => window.open(selectedPreview.originalUrl, '_blank')}
                                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all active:scale-95"
                                >
                                    Visitar enlace original
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Barra de Acciones del Modal */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    {selectedPreview.filePath && Capacitor.isNativePlatform() && (
                        <button
                            type="button"
                            onClick={() => handleOpenExternal(selectedPreview.filePath!, selectedPreview.mimeType)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                            title="Abrir en reproductor nativo del teléfono"
                        >
                            <Play className="w-3.5 h-3.5 text-blue-400" />
                            <span>Reproductor Externo</span>
                        </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                        {selectedPreview.originalUrl && (
                            <button
                                type="button"
                                onClick={() => window.open(selectedPreview.originalUrl, '_blank')}
                                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                                title="Ver enlace original"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Enlace</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={(e) => handleShare(e, selectedPreview)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Compartir</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    return createPortal(
        <>
            {modalContent}
            {previewModalContent}
        </>,
        document.body
    );
}
