'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Star, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Wifi, 
  User, 
  MessageSquare, 
  FileText, 
  Mail, 
  Phone,
  QrCode,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { ScannedCode, CodeType } from '../../types';
import Link from 'next/link';

export default function HistorialPage() {
  const [history, setHistory] = useState<ScannedCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | CodeType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cargar historial
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('lectorqr_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Error reading history', e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Guardar cambios
  const updateStorage = (updated: ScannedCode[]) => {
    setHistory(updated);
    try {
      localStorage.setItem('lectorqr_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating storage', e);
    }
  };

  // Alternar favorito
  const toggleFavorite = (id: string) => {
    const updated = history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    updateStorage(updated);
  };

  // Eliminar un elemento
  const deleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    updateStorage(updated);
  };

  // Borrar todo el historial
  const clearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todo tu historial de escaneos? Esta acción no se puede deshacer.')) {
      updateStorage([]);
    }
  };

  // Copiar texto
  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Exportar a CSV
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Tipo', 'Formato', 'Fecha', 'Favorito', 'Contenido'];
    const rows = history.map((item) => [
      item.id,
      item.type,
      item.format,
      new Date(item.timestamp).toISOString(),
      item.isFavorite ? 'SI' : 'NO',
      `"${item.rawText.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_lectorqr_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar a JSON
  const exportJSON = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_lectorqr_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrado
  const filteredItems = history.filter((item) => {
    const matchesSearch = 
      item.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'favorites') {
      return item.isFavorite;
    }
    if (activeFilter !== 'all') {
      return item.type === activeFilter;
    }
    return true;
  });

  const getIcon = (type: CodeType) => {
    switch (type) {
      case 'url': return Globe;
      case 'wifi': return Wifi;
      case 'contact': return User;
      case 'whatsapp': return MessageSquare;
      case 'email': return Mail;
      case 'phone': return Phone;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider font-mono mb-2">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Registro Local en Dispositivo</span>
          </div>
          <h1 className="text-3xl font-black text-white font-display">
            Historial de Escaneos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Consulta, filtra o exporta tus códigos escaneados guardados de forma segura en tu navegador.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Descargar reporte en formato Excel / CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={exportJSON}
              className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Descargar copia de seguridad en JSON"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="py-2.5 px-3.5 rounded-xl bg-rose-950/40 border border-rose-900/40 hover:bg-rose-900/60 text-xs font-bold text-rose-300 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Vaciar todo el historial"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vaciar</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por contenido, enlace o tipo..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({history.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-all ${
              activeFilter === 'favorites'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favoritos ({history.filter(i => i.isFavorite).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('url')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Enlaces Web
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('wifi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === 'wifi' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Wi-Fi
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('contact')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === 'contact' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Contactos
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('whatsapp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeFilter === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp
          </button>
        </div>

      </div>

      {/* History Items List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type);
            const dateStr = new Date(item.timestamp).toLocaleString('es-PE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono">
                        {item.type}
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-[11px] text-slate-400">
                        {dateStr}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white break-all line-clamp-2">
                      {item.rawText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  
                  {/* Favorite Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.id)}
                    aria-label="Alternar Favorito"
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      item.isFavorite 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Copy */}
                  <button
                    type="button"
                    onClick={() => copyText(item.id, item.rawText)}
                    aria-label="Copiar Contenido"
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Generate / Edit as QR */}
                  <Link
                    href={`/generar?text=${encodeURIComponent(item.rawText)}&type=${item.type}`}
                    aria-label="Abrir en Generador"
                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    aria-label="Eliminar del historial"
                    className="p-2 rounded-xl text-slate-500 hover:bg-rose-950/40 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white font-display">
            {searchTerm || activeFilter !== 'all' ? 'Sin resultados para tu filtro' : 'Aún no tienes escaneos guardados'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {searchTerm || activeFilter !== 'all' 
              ? 'Prueba modificando la búsqueda o seleccionando otro filtro de categoría.'
              : 'Los códigos QR o de barras que escanees con tu cámara o subas como imagen aparecerán organizados aquí.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Comenzar a Escanear</span>
          </Link>
        </div>
      )}

    </div>
  );
}
