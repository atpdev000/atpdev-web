import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Filesystem } from '@capacitor/filesystem';

export interface HistoryItem {
    id: string;
    title: string;
    platform: 'facebook' | 'youtube' | 'tiktok' | 'instagram' | 'threads' | 'twitter' | string;
    thumbnail?: string;
    originalUrl?: string;
    date: number;
    status: 'completed' | 'failed';
    format?: string;
    read?: boolean;
    fileSize?: string;
    duration?: string;
    filePath?: string;
    mimeType?: string;
}

const MAX_ITEMS = 50;
const HISTORY_KEY = 'fty_download_history';

interface HistoryState {
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
    clearHistory: () => void;
    deleteItem: (id: string) => void;
    markAllAsRead: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            history: [],

            addToHistory: (item) => {
                const newItem: HistoryItem = {
                    ...item,
                    id: typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    date: Date.now(),
                    read: false,
                };
                set((state) => {
                    const current = Array.isArray(state.history) ? state.history : [];
                    const filtered = current.filter(i => i.id !== newItem.id);
                    return {
                        history: [newItem, ...filtered].slice(0, MAX_ITEMS)
                    };
                });
            },

            clearHistory: () => {
                set({ history: [] });
            },

            deleteItem: (id: string) => {
                const current = Array.isArray(get().history) ? get().history : [];
                const itemToDelete = current.find(i => i.id === id);

                set({
                    history: current.filter(i => i.id !== id)
                });

                if (itemToDelete?.filePath) {
                    Filesystem.deleteFile({
                        path: itemToDelete.filePath
                    }).catch(fsError => {
                        console.warn('No se pudo borrar el archivo físico:', fsError);
                    });
                }
            },

            markAllAsRead: () => {
                const current = Array.isArray(get().history) ? get().history : [];
                const hasUnread = current.some(i => !i.read);
                if (!hasUnread) return;

                set({
                    history: current.map(i => i.read ? i : { ...i, read: true })
                });
            }
        }),
        {
            name: HISTORY_KEY,
            storage: {
                getItem: (name) => {
                    if (typeof window === 'undefined') return null;
                    try {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        const parsed = JSON.parse(str);
                        // Compatibilidad retroactiva: si ya estaba guardado como array directo
                        if (Array.isArray(parsed)) {
                            return { state: { history: parsed }, version: 0 };
                        }
                        if (parsed && typeof parsed === 'object' && 'state' in parsed) {
                            return parsed;
                        }
                        return null;
                    } catch (e) {
                        console.warn('Error leyendo localStorage history:', e);
                        try { localStorage.removeItem(name); } catch {}
                        return null;
                    }
                },
                setItem: (name, value) => {
                    if (typeof window === 'undefined') return;
                    try {
                        localStorage.setItem(name, JSON.stringify(value));
                    } catch (e) {
                        console.warn('Error guardando history en localStorage:', e);
                    }
                },
                removeItem: (name) => {
                    if (typeof window === 'undefined') return;
                    try {
                        localStorage.removeItem(name);
                    } catch {}
                }
            }
        }
    )
);

export function useDownloadHistory() {
    const history = useHistoryStore((state) => state.history) || [];
    const addToHistory = useHistoryStore((state) => state.addToHistory);
    const clearHistory = useHistoryStore((state) => state.clearHistory);
    const deleteItem = useHistoryStore((state) => state.deleteItem);
    const markAllAsRead = useHistoryStore((state) => state.markAllAsRead);

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
