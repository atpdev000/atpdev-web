'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Wifi, 
  User, 
  MessageSquare, 
  Mail, 
  Phone, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  RotateCcw, 
  Layers, 
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { ScannedCode, CodeType } from '../types';
import ScanResultCard from './ScanResultCard';

interface MultiScanResultCardProps {
  codes: ScannedCode[];
  onNewScan: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const MultiScanResultCard: React.FC<MultiScanResultCardProps> = ({
  codes,
  onNewScan,
  onToggleFavorite,
}) => {
  const [selectedCode, setSelectedCode] = useState<ScannedCode | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Si el usuario hace clic en ver el detalle de uno en particular
  if (selectedCode) {
    return (
      <div className="space-y-4 w-full max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setSelectedCode(null)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Volver a la lista ({codes.length} códigos detectados)</span>
        </button>

        <ScanResultCard
          code={selectedCode}
          onNewScan={onNewScan}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    );
  }

  const handleCopySingle = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = codes.map((c, i) => `${i + 1}. [${c.type.toUpperCase()}] ${c.rawText}`).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Nro', 'Tipo', 'Formato', 'Contenido'];
    const rows = codes.map((c, i) => [
      i + 1,
      c.type,
      c.format,
      `"${c.rawText.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `codigos_detectados_${codes.length}_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-fadeIn space-y-6">
      
      {/* Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
              <Sparkles className="w-3 h-3" />
              <span>Detección Múltiple Completada</span>
            </div>
            <h3 className="text-lg font-black text-white font-display">
              {codes.length} Códigos QR Detectados
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Se han decodificado todos los códigos individuales encontrados en la imagen o archivos.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Copiar lista de todos los códigos"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? '¡Copiados!' : 'Copiar Todos'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Exportar a Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* List of Detected Codes */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {codes.map((code, index) => {
          const Icon = getIcon(code.type);
          return (
            <div
              key={code.id || index}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-black text-[11px] flex items-center justify-center font-mono shrink-0 mt-0.5">
                  #{index + 1}
                </span>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 font-mono block">
                    {code.type}
                  </span>
                  <p className="text-xs font-semibold text-white truncate break-all">
                    {code.rawText}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {code.type === 'url' && code.parsedData.url && (
                  <a
                    href={code.parsedData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    title="Abrir enlace"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Abrir</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleCopySingle(index, code.rawText)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all"
                  title="Copiar contenido"
                >
                  {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCode(code)}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="Ver ficha técnica completa"
                >
                  <span>Detalles</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Scan Another Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNewScan}
          className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-black text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Escanear Otra Imagen</span>
        </button>
      </div>

    </div>
  );
};

export default MultiScanResultCard;
