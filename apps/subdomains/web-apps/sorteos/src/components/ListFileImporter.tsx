"use client";

import React, { useState, useRef } from 'react';
import { 
  Upload, FileSpreadsheet, FileText, Image as ImageIcon, 
  FileCheck, Loader2, AlertCircle, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { extractParticipantsFromFile } from '@/lib/fileListExtractor';

interface ListFileImporterProps {
  onImport: (names: string[], mode: 'replace' | 'append', fileName: string) => void;
  currentCount?: number;
}

export const ListFileImporter: React.FC<ListFileImporterProps> = ({ onImport, currentCount = 0 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSuccessInfo(null);
    setStatusText('Leyendo archivo...');

    try {
      const names = await extractParticipantsFromFile(file, (msg) => {
        setStatusText(msg);
      });

      if (!names || names.length === 0) {
        throw new Error('No se detectaron nombres legibles en este archivo. Verifica que contenga texto.');
      }

      // Por defecto si hay participantes existentes y son más de 0, preguntar o anexar/reemplazar
      onImport(names, 'replace', file.name);
      setSuccessInfo({ count: names.length, name: file.name });
    } catch (err: any) {
      setError(err.message || 'Error al procesar el archivo');
    } finally {
      setIsLoading(false);
      setStatusText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  return (
    <div className="space-y-2.5 pt-1">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.docx,.pdf,.csv,.txt,.tsv,image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative rounded-2xl p-4 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group ${
          isDragging
            ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/30 scale-[1.01]'
            : 'border-slate-200 dark:border-white/10 hover:border-pink-400 dark:hover:border-purple-500/50 bg-slate-50/70 hover:bg-pink-50/20 dark:bg-[#1e293b]/40 dark:hover:bg-[#1e293b]/70'
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-pink-600 dark:text-purple-400" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 animate-pulse">
              {statusText || 'Procesando documento...'}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-purple-400">
              <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-bold font-display uppercase tracking-wider">
                Subir Lista en Word, Excel, PDF o Foto
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-sm leading-tight">
              Arrastra tu archivo aquí o haz clic para importar automáticamente los participantes.
            </p>

            {/* Badges de formatos soportados */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30">
                <FileSpreadsheet className="w-3 h-3" /> Excel (.xlsx)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30">
                <FileText className="w-3 h-3" /> Word (.docx)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/30">
                <FileText className="w-3 h-3" /> PDF
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30">
                <ImageIcon className="w-3 h-3" /> Imagen OCR
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10">
                CSV / TXT
              </span>
            </div>
          </>
        )}
      </div>

      {/* Success Notification Banner */}
      {successInfo && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>¡{successInfo.count} participantes</strong> importados con éxito desde <em>{successInfo.name}</em>!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessInfo(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ListFileImporter;

