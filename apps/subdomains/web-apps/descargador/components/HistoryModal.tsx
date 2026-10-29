import { X, Trash2, Clock, CheckCircle, Share2, ExternalLink } from 'lucide-react';
import { HistoryItem } from '@/hooks/useDownloadHistory';
import { useEffect, useState } from 'react';
import { FileOpener } from '@capacitor-community/file-opener';
import { Dialog } from '@capacitor/dialog';
import { Share } from '@capacitor/share';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onClear: () => void;
    onDelete: (id: string) => void;
    onOpen: () => void;
}

export default function HistoryModal({ isOpen, onClose, history, onClear, onDelete, onOpen }: HistoryModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    if (!mounted || !isOpen) return null;

    const handleItemClick = async (item: HistoryItem) => {
        if (item.filePath) {
            try {
                await FileOpener.open({
                    filePath: item.filePath,
                    contentType: item.mimeType || 'video/mp4'
                });
            } catch (e) {
                console.warn('Error abriendo archivo local:', e);
                if (item.originalUrl) window.open(item.originalUrl, '_blank');
                else await Dialog.alert({
                    title: 'No se puede abrir',
                    message: 'El archivo no se encuentra en el dispositivo.'
                });
            }
        } else if (item.originalUrl) {
            window.open(item.originalUrl, '_blank');
        }
    };

    const handleShare = async (e: React.MouseEvent, item: HistoryItem) => {
        e.stopPropagation(); // Evitar abrir el archivo
        try {
            if (item.filePath) {
                await Share.share({
                    title: item.title,
                    text: `Mira este video de ${item.platform}: ${item.title}`,
                    url: item.filePath,
                    dialogTitle: 'Compartir archivo'
                });
            } else if (item.originalUrl) {
                await Share.share({
                    title: item.title,
                    url: item.originalUrl
                });
            }
        } catch (error) {
            console.error('Error al compartir:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Evitar abrir el archivo
        const { value } = await Dialog.confirm({
            title: '¿Eliminar descarga?',
            message: 'Esto borrará el registro del historial y el archivo de tu dispositivo.',
            okButtonTitle: 'Eliminar',
            cancelButtonTitle: 'Cancelar'
        });

        if (value) {
            onDelete(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-800">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold">Historial de Descargas</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No hay descargas recientes</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 relative group cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleItemClick(item)}
                            >
                                {/* Indicador de no leído */}
                                {!item.read && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}

                                {/* 🖼️ THUMBNAIL o ICONO */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative">
                                    {item.thumbnail ? (
                                        // Video thumbnail
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback si la imagen falla
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        // Audio icon o fallback
                                        <div className={`w-full h-full flex items-center justify-center ${item.mimeType?.includes('audio') ? 'bg-purple-100' : 'bg-gray-200'
                                            }`}>
                                            {item.mimeType?.includes('audio') ? (
                                                // 🎵 Icono para audio
                                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                            ) : (
                                                // 🎬 Icono para video sin thumbnail
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                    )}

                                    {/* Badge de plataforma sobre la thumbnail */}
                                    <div className={`absolute bottom-1 right-1 w-6 h-6 rounded flex items-center justify-center shadow-sm ${item.platform === 'youtube' ? 'bg-red-600' :
                                        item.platform === 'facebook' ? 'bg-blue-600' :
                                            'bg-black'
                                        }`}>
                                        {item.platform === 'youtube' && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                        )}
                                        {item.platform === 'facebook' && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        )}
                                        {item.platform === 'tiktok' && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12v8.76c-.52 4.03-3.71 6.83-7.79 6.83-4.08 0-7.39-3.23-7.39-7.22 0-3.99 3.32-7.22 7.4-7.22.51-.01 1.02.04 1.53.12v4.06c-.36-.12-.73-.2-1.11-.2-1.89 0-3.41 1.53-3.41 3.42s1.52 3.42 3.41 3.42c1.67 0 3.08-1.2 3.36-2.81.07-.38.08-.77.08-1.15V.02z" /></svg>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h3>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={(e) => handleShare(e, item)}
                                                className="p-1.5 text-blue-700 bg-blue-100 border border-blue-200 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center"
                                                title="Compartir archivo"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="p-1.5 text-red-700 bg-red-100 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center"
                                                title="Eliminar descarga"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
                                        <span className="capitalize">{item.platform}</span>
                                        <span>•</span>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                        {item.format && (
                                            <>
                                                <span>•</span>
                                                <span className="uppercase bg-gray-200 px-1 rounded text-[10px]">{item.format}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={onClear}
                            className="w-full py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Borrar Historial
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
