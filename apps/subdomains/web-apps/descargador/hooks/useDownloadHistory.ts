import { useState, useEffect } from 'react';
import { Filesystem } from '@capacitor/filesystem';

export interface HistoryItem {
    id: string;
    title: string;
    platform: 'facebook' | 'youtube' | 'tiktok';
    thumbnail?: string;
    originalUrl?: string;
    date: number;
    status: 'completed' | 'failed';
    format?: string;
    read?: boolean;
    fileSize?: string; // "14MB"
    duration?: string; // "04:20"
    filePath?: string; // "file:///storage/..."
    mimeType?: string; // "video/mp4"
}

const HISTORY_KEY = 'fty_download_history';
const MAX_ITEMS = 50;

export function useDownloadHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const loadHistory = () => {
            try {
                const stored = localStorage.getItem(HISTORY_KEY);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        // Validar que sea un array
                        if (Array.isArray(parsed)) {
                            setHistory(parsed);
                        } else {
                            console.warn('Historia corrupta, limpiando...');
                            localStorage.removeItem(HISTORY_KEY);
                            setHistory([]);
                        }
                    } catch (parseError) {
                        console.error('Error parsing history, limpiando...', parseError);
                        // Si hay error al parsear, limpiar el localStorage
                        localStorage.removeItem(HISTORY_KEY);
                        setHistory([]);
                    }
                } else {
                    setHistory([]);
                }
            } catch (storageError) {
                console.error('Error accediendo a localStorage:', storageError);
                setHistory([]);
            }
        };

        loadHistory();

        const handleStorageChange = () => {
            try {
                loadHistory();
            } catch (e) {
                console.error('Error en handleStorageChange:', e);
            }
        };

        // Listen to custom event for intra-app updates and storage event for cross-tab
        window.addEventListener('history-updated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('history-updated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
        try {
            const newItem: HistoryItem = {
                ...item,
                id: crypto.randomUUID(),
                date: Date.now(),
            };

            const stored = localStorage.getItem(HISTORY_KEY);
            const currentHistory: HistoryItem[] = stored ? JSON.parse(stored) : [];

            const updated = [newItem, ...currentHistory].slice(0, MAX_ITEMS);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

            // Update local state
            setHistory(updated);

            // Notify other components
            window.dispatchEvent(new Event('history-updated'));
            console.log('✅ History updated:', newItem.title);
        } catch (error) {
            console.error('Error adding to history:', error);
        }
    };

    const clearHistory = () => {
        try {
            setHistory([]);
            localStorage.removeItem(HISTORY_KEY);
            window.dispatchEvent(new Event('history-updated'));
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            if (stored) {
                const currentItems: HistoryItem[] = JSON.parse(stored);
                const itemToDelete = currentItems.find(i => i.id === id);

                // 🔥 Borrar archivo físico si existe
                if (itemToDelete?.filePath) {
                    try {
                        await Filesystem.deleteFile({
                            path: itemToDelete.filePath
                        });
                        console.log('🗑️ Archivo físico eliminado:', itemToDelete.filePath);
                    } catch (fsError) {
                        console.warn('No se pudo borrar el archivo físico (tal vez ya no existe):', fsError);
                    }
                }

                const updated = currentItems.filter(i => i.id !== id);
                setHistory(updated);
                localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
                window.dispatchEvent(new Event('history-updated'));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const markAllAsRead = () => {
        try {
            setHistory(prev => {
                const updated = prev.map(item => ({ ...item, read: true }));
                localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
                window.dispatchEvent(new Event('history-updated'));
                return updated;
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const unreadCount = history.filter(item => !item.read).length;

    return {
        history,
        unreadCount,
        addToHistory,
        clearHistory,
        deleteItem,
        markAllAsRead
    };
}
