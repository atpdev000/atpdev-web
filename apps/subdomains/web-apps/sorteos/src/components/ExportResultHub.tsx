"use client";

import React, { useState } from 'react';
import { 
  Download, FileSpreadsheet, FileText, Image as ImageIcon, 
  Share2, Check, Copy, Printer, Sparkles, X, Loader2
} from 'lucide-react';
import { 
  exportTeamsToExcel, 
  exportTeamsToWord, 
  exportTeamsToPdf, 
  exportTeamsToImage,
  TeamExportData 
} from '@/lib/teamResultExporter';

interface ExportResultHubProps {
  teams: TeamExportData[];
  drawTitle?: string;
  auditHash?: string;
  captureElementId?: string;
  onCopyAll?: () => void;
  copiedAll?: boolean;
}

export const ExportResultHub: React.FC<ExportResultHubProps> = ({
  teams,
  drawTitle = 'División de Equipos',
  auditHash = '',
  captureElementId = 'teams-results-container',
  onCopyAll,
  copiedAll = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = async (type: 'excel' | 'word' | 'pdf' | 'image' | 'copy') => {
    setExportSuccess(null);

    if (type === 'excel') {
      await exportTeamsToExcel(teams, drawTitle, auditHash);
      setExportSuccess('Excel (.xlsx) descargado con éxito');
    } else if (type === 'word') {
      exportTeamsToWord(teams, drawTitle, auditHash);
      setExportSuccess('Word (.doc) generado con éxito');
    } else if (type === 'pdf') {
      exportTeamsToPdf(teams, drawTitle, auditHash);
      setExportSuccess('Vista PDF oficial lista');
    } else if (type === 'image') {
      setIsExportingImage(true);
      try {
        await exportTeamsToImage(captureElementId, `equipos-${Date.now()}.png`);
        setExportSuccess('Imagen HD (.png) descargada con éxito');
      } catch (err: any) {
        alert(err.message || 'Error al generar imagen');
      } finally {
        setIsExportingImage(false);
      }
    } else if (type === 'copy') {
      onCopyAll?.();
      setExportSuccess('¡Copiado para WhatsApp / Portapapeles!');
    }

    setTimeout(() => setExportSuccess(null), 3000);
  };

  return (
    <>
      {/* Botón Principal para Abrir el Centro de Exportación */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          title="Guardar o Exportar resultados en PDF, Word, Excel o Imagen"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Resultados (PDF, Word, Excel, Imagen)</span>
        </button>
      </div>

      {/* Modal Hub de Exportación */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-6 relative">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">
                    Guardar y Exportar Resultados
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {teams.length} equipos formados &bull; Elige tu formato preferido
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opciones de Exportación en Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Opción PDF */}
              <button
                type="button"
                onClick={() => handleExport('pdf')}
                className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-left transition-all group cursor-pointer active:scale-95"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    Vector A4
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Documento PDF Oficial
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                  Reporte oficial con sello de verificación criptográfica listo para imprimir o guardar.
                </p>
              </button>

              {/* Opción Word (.docx) */}
              <button
                type="button"
                onClick={() => handleExport('word')}
                className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-left transition-all group cursor-pointer active:scale-95"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                    .DOC / DOCX
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Documento Microsoft Word
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                  Tablas formateadas con colores y capitanes, 100% editable.
                </p>
              </button>

              {/* Opción Excel (.xlsx) */}
              <button
                type="button"
                onClick={() => handleExport('excel')}
                className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-left transition-all group cursor-pointer active:scale-95"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    .XLSX / CSV
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Planilla Microsoft Excel
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                  Columnas estructuradas con Equipo, Número, Integrante y Capitán.
                </p>
              </button>

              {/* Opción Imagen HD (.png) */}
              <button
                type="button"
                disabled={isExportingImage}
                onClick={() => handleExport('image')}
                className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 hover:bg-purple-50 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 text-left transition-all group cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                    PNG HD
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Imagen para Redes Sociales
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                  Foto en alta resolución de los equipos lista para WhatsApp o Instagram.
                </p>
              </button>
            </div>

            {/* Opción Copiar para WhatsApp / Portapapeles */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  ¿Prefieres solo texto?
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleExport('copy')}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedAll ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
              </button>
            </div>

            {/* Mensaje de confirmación */}
            {exportSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{exportSuccess}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ExportResultHub;

