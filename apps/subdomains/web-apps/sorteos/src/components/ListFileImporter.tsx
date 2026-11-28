"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ClipboardPaste,
  Camera,
  Sparkles,
} from 'lucide-react';
import {
  extractParticipantsFromFile,
  parsePastedParticipantText,
} from '@/lib/fileListExtractor';

interface ListFileImporterProps {
  onImport: (names: string[], mode: 'replace' | 'append', fileName: string) => void;
  currentCount?: number;
  enableGlobalPaste?: boolean;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  return false;
}

export const ListFileImporter: React.FC<ListFileImporterProps> = ({
  onImport,
  currentCount = 0,
  enableGlobalPaste = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    count: number;
    name: string;
    sample: string[];
    mode: 'replace' | 'append';
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importModeRef = useRef(importMode);
  importModeRef.current = importMode;

  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  const onImportRef = useRef(onImport);
  onImportRef.current = onImport;

  // Limpiar objectURL de vista previa al desmontar o cambiar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileProcess = useCallback(async (file: File, sourceLabel?: string) => {
    if (isLoadingRef.current) return;

    const label = sourceLabel || file.name || 'Captura de pantalla';
    setIsLoading(true);
    setError(null);
    setSuccessInfo(null);
    setStatusText(
      file.type.startsWith('image/')
        ? 'Captura detectada. Optimizando imagen para OCR...'
        : 'Leyendo archivo...'
    );

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }

    try {
      const names = await extractParticipantsFromFile(file, (msg) => {
        setStatusText(msg);
      });

      if (!names || names.length === 0) {
        throw new Error(
          file.type.startsWith('image/')
            ? 'No se detectaron nombres legibles en la captura. Intenta recortar más cerca de la lista o subir mayor resolución.'
            : 'No se detectaron nombres legibles en este archivo. Verifica que contenga texto.'
        );
      }

      const activeMode = importModeRef.current;
      onImportRef.current(names, activeMode, label);
      setSuccessInfo({
        count: names.length,
        name: label,
        sample: names.slice(0, 3),
        mode: activeMode,
      });
    } catch (err: any) {
      setError(err?.message || 'Error al procesar el archivo o captura');
    } finally {
      setIsLoading(false);
      setStatusText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleTextPasteImport = useCallback((rawText: string, sourceLabel = 'Excel / Portapapeles') => {
    const { names, isBulkPaste } = parsePastedParticipantText(rawText);
    if (!isBulkPaste || names.length === 0) return false;

    setError(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    const activeMode = importModeRef.current;
    onImportRef.current(names, activeMode, sourceLabel);
    setSuccessInfo({
      count: names.length,
      name: sourceLabel,
      sample: names.slice(0, 3),
      mode: activeMode,
    });
    return true;
  }, []);

  // Botón directo "Pegar captura o Excel (Ctrl+V)" usando Clipboard API con fallback seguro
  const handleClipboardButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    setError(null);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && 'read' in navigator.clipboard) {
        const clipboardItems = await navigator.clipboard.read();
        // Prioridad 1: si trae texto (ej. celdas copiadas de Excel que también traen imagen secundaria),
        // leemos el texto primero para extracción 100% exacta e instantánea.
        for (const item of clipboardItems) {
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            const text = await blob.text();
            if (text.trim().length > 0) {
              if (handleTextPasteImport(text, 'Excel / Portapapeles')) {
                return;
              }
            }
          }
        }
        // Prioridad 2: captura de pantalla o imagen pura en el portapapeles
        for (const item of clipboardItems) {
          const imageType = item.types.find((type) => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const ext = imageType.split('/')[1] || 'png';
            const file = new File([blob], `captura-portapapeles.${ext}`, { type: imageType });
            await handleFileProcess(file, 'Captura pegada (OCR)');
            return;
          }
        }
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text.trim().length > 0 && handleTextPasteImport(text, 'Portapapeles')) {
          return;
        }
      }

      setError(
        'No encontramos una captura o lista en tu portapapeles. Copia filas de Excel o toma una captura y presiona Ctrl + V.'
      );
    } catch {
      setError(
        'Tu navegador bloqueó el acceso directo al portapapeles. Presiona Ctrl + V en cualquier parte de la página para pegar tu captura o lista de Excel.'
      );
    }
  };

  // Listener global de Ctrl+V y Drag & Drop en toda la ventana (estilo Lector QR Pro)
  useEffect(() => {
    if (!enableGlobalPaste) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      if (isLoadingRef.current) return;
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const plainText = clipboardData.getData('text/plain') || '';
      const items = clipboardData.items;
      let pastedImageFile: File | null = null;

      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const f = items[i].getAsFile();
            if (f) {
              pastedImageFile = f;
              break;
            }
          }
        }
      }

      // Regla clave para Excel en Windows: al copiar celdas, Excel incluye TANTO text/plain COMO image/png.
      // Si viene texto no vacío, NUNCA disparamos OCR sobre la miniatura secundaria de Excel.
      if (plainText.trim().length > 0) {
        // Si el usuario está escribiendo dentro de un input o textarea, dejamos que el propio campo
        // maneje su pegado inteligente sin duplicar.
        if (isEditableElement(e.target) || isEditableElement(document.activeElement)) {
          return;
        }
        const imported = handleTextPasteImport(plainText, 'Excel / Portapapeles');
        if (imported) {
          e.preventDefault();
        }
        return;
      }

      // Captura de pantalla pura (Win+Shift+S, Snipping Tool, foto copiada): funciona INCLUSO si el cursor está en un input.
      if (pastedImageFile) {
        e.preventDefault();
        const ext = pastedImageFile.type.split('/')[1] || 'png';
        const namedFile =
          pastedImageFile.name && pastedImageFile.name !== 'image.png'
            ? pastedImageFile
            : new File([pastedImageFile], `captura-ctrl-v.${ext}`, {
                type: pastedImageFile.type || 'image/png',
              });
        handleFileProcess(namedFile, 'Captura pegada (Ctrl+V)');
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes('Files')) return;
      e.preventDefault();
      setIsDraggingGlobal(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setIsDraggingGlobal(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) {
        setIsDraggingGlobal(false);
        return;
      }
      e.preventDefault();
      setIsDraggingGlobal(false);
      setIsDragging(false);
      handleFileProcess(e.dataTransfer.files[0]);
    };

    window.addEventListener('paste', handleWindowPaste);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('paste', handleWindowPaste);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [enableGlobalPaste, handleFileProcess, handleTextPasteImport]);

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
    e.stopPropagation();
    setIsDragging(false);
    setIsDraggingGlobal(false);
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
      {/* Overlay Universal de Arrastrar y Soltar (estilo Lector QR Pro) */}
      {isDraggingGlobal && (
        <div className="fixed inset-0 z-50 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-pink-500 dark:border-purple-400 p-6 pointer-events-none">
          <div className="w-20 h-20 rounded-3xl bg-pink-500/15 text-pink-600 dark:text-purple-400 flex items-center justify-center animate-bounce mb-4 shadow-lg">
            <Upload className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display text-center">
            Suelta tu captura o archivo aquí
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-300 font-medium mt-2 text-center max-w-md">
            Extraeremos todos los nombres en orden automáticamente desde Excel, Word, PDF, CSV o captura de imagen (OCR).
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.docx,.pdf,.csv,.txt,.tsv,image/png,image/jpeg,image/webp,image/jpg,image/bmp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Selector compacto de modo al importar cuando ya existen elementos */}
      {currentCount > 0 && (
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-500 dark:text-purple-400" />
            Al pegar o subir lista:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-white/5 p-0.5 border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setImportMode('replace')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                importMode === 'replace'
                  ? 'bg-white dark:bg-[#1e293b] text-pink-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              Reemplazar
            </button>
            <button
              type="button"
              onClick={() => setImportMode('append')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                importMode === 'append'
                  ? 'bg-white dark:bg-[#1e293b] text-pink-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              Agregar al final
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop + Ctrl+V Paste Zone */}
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
          <div className="flex flex-col items-center justify-center py-2 space-y-2.5 w-full">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Vista previa de captura pegada"
                className="max-h-24 max-w-full rounded-xl border border-slate-200 dark:border-white/15 shadow-xs object-contain bg-white"
              />
            )}
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-pink-600 dark:text-purple-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 animate-pulse">
                {statusText || 'Procesando captura o documento...'}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-purple-400">
              <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-bold font-display uppercase tracking-wider">
                Subir o Pegar Captura, Excel, Word o PDF
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Arrastra un archivo, haz clic o presiona{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-bold shadow-2xs">
                Ctrl + V
              </kbd>{' '}
              para pegar una captura de pantalla o filas copiadas de Excel en orden.
            </p>

            {/* Acción directa de Pegado desde Portapapeles */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleClipboardButtonClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Pegar captura o Excel (Ctrl+V)</span>
              </button>
            </div>

            {/* Badges de formatos soportados */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/30">
                <Camera className="w-3 h-3" /> Captura Ctrl+V
              </span>
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
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start justify-between gap-2 animate-fade-in shadow-xs">
          <div className="flex items-start gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <p>
                <strong>¡{successInfo.count} participantes</strong>{' '}
                {successInfo.mode === 'append' ? 'agregados en orden' : 'extraídos en orden'} desde{' '}
                <em>{successInfo.name}</em>!
              </p>
              {successInfo.sample.length > 0 && (
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 truncate">
                  1. {successInfo.sample[0]}
                  {successInfo.sample[1] ? ` · 2. ${successInfo.sample[1]}` : ''}
                  {successInfo.count > 2 ? ` · … (+${successInfo.count - 2})` : ''}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessInfo(null)}
            aria-label="Cerrar notificación"
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-0.5 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-start justify-between gap-2 animate-fade-in shadow-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Cerrar error"
            className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ListFileImporter;
