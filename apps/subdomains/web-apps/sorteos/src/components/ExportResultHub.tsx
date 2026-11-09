"use client";

import React, { useState } from 'react';
import { 
  Download, FileSpreadsheet, FileText, Image as ImageIcon, 
  Share2, Check, Copy, Sparkles, X, Loader2
} from 'lucide-react';
import { 
  exportTeamsToExcel, 
  exportTeamsToWord, 
  exportTeamsToPdf, 
  exportTeamsToImage,
  TeamExportData 
} from '@/lib/teamResultExporter';
import {
  exportSecretSantaToExcel,
  exportSecretSantaToWord,
  exportSecretSantaToPdf,
  exportSecretSantaToImage,
  exportSecretSantaToWhatsApp,
  exportDrawListToExcel,
  exportDrawListToWord,
  exportDrawListToPdf,
  exportDrawListToImage,
  exportDrawListToWhatsApp,
  exportNumbersToExcel,
  exportNumbersToWord,
  exportNumbersToPdf,
  exportNumbersToImage,
  exportNumbersToWhatsApp,
  SecretSantaMatch
} from '@/lib/universalResultExporter';

export type ExportVariant = 'teams' | 'secret-santa' | 'draw-list' | 'numbers';

export interface BaseExportProps {
  buttonText?: string;
  buttonClassName?: string;
  captureElementId?: string;
  onCopyAll?: () => void;
  copiedAll?: boolean;
}

export interface TeamsExportHubProps extends BaseExportProps {
  variant?: 'teams';
  teams: TeamExportData[];
  drawTitle?: string;
  auditHash?: string;
}

export interface SecretSantaExportHubProps extends BaseExportProps {
  variant: 'secret-santa';
  matches: SecretSantaMatch[];
  budget?: string;
  deadline?: string;
  drawTitle?: string;
  auditHash?: string;
}

export interface DrawListExportHubProps extends BaseExportProps {
  variant: 'draw-list';
  title?: string;
  winners: string[];
  substitutes?: string[];
  totalParticipants?: number;
  auditHash?: string;
}

export interface NumbersExportHubProps extends BaseExportProps {
  variant: 'numbers';
  numbers: number[];
  min: number;
  max: number;
  drawTitle?: string;
  auditHash?: string;
}

export type ExportResultHubProps = 
  | TeamsExportHubProps
  | SecretSantaExportHubProps
  | DrawListExportHubProps
  | NumbersExportHubProps;

export const ExportResultHub: React.FC<ExportResultHubProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const variant = props.variant || 'teams';

  // Metadatos dinámicos por variante
  let modalTitle = 'Guardar y Exportar Resultados';
  let modalSubtitle = 'Elige tu formato preferido';
  let pdfDesc = 'Reporte oficial con sello de verificación criptográfica listo para imprimir o guardar.';
  let wordDesc = 'Documento con tablas formateadas y estilos corporativos, 100% editable.';
  let excelDesc = 'Columnas estructuradas y fórmulas listas para abrir en Excel o Google Sheets.';
  let imageDesc = 'Foto en alta resolución lista para publicar en WhatsApp, Instagram o Facebook.';

  if (variant === 'teams') {
    const p = props as TeamsExportHubProps;
    modalSubtitle = `${p.teams?.length || 0} equipos formados • Elige tu formato preferido`;
    excelDesc = 'Columnas estructuradas con Equipo, Número, Integrante y Capitán.';
    imageDesc = 'Tarjeta gráfica con los equipos, insignias de capitanes y sello inmutable.';
  } else if (variant === 'secret-santa') {
    const p = props as SecretSantaExportHubProps;
    modalTitle = 'Exportar Sorteo de Amigo Invisible';
    modalSubtitle = `${p.matches?.length || 0} emparejamientos secretos • Elige tu formato preferido`;
    pdfDesc = 'Reporte oficial y tarjetas secretas individuales listas para recortar o compartir en A4.';
    wordDesc = 'Acta oficial editable y tarjetas secretas de regalo con presupuesto y fecha.';
    excelDesc = 'Columnas con Quien Regala, Amigo Invisible, Presupuesto y Fecha de Entrega.';
    imageDesc = 'Tarjeta oficial conmemorativa de intercambio para el grupo.';
  } else if (variant === 'draw-list') {
    const p = props as DrawListExportHubProps;
    modalTitle = 'Certificar y Exportar Ganadores';
    modalSubtitle = `${p.winners?.length || 0} ganadores seleccionados • Elige tu formato preferido`;
    pdfDesc = 'Certificado oficial de ganadores con sellos y algoritmo CSPRNG inmutable en A4.';
    wordDesc = 'Acta oficial de premiación con ganadores titulares y suplentes de reserva.';
    excelDesc = 'Planilla con puestos, ganadores titulares, suplentes y hash de auditoría.';
    imageDesc = 'Placa gráfica oficial de ganadores en alta resolución para redes sociales.';
  } else if (variant === 'numbers') {
    const p = props as NumbersExportHubProps;
    modalTitle = 'Exportar Números Extraídos';
    modalSubtitle = `${p.numbers?.length || 0} números sorteados • Elige tu formato preferido`;
    pdfDesc = 'Acta oficial de extracción con esferas gráficas y sello de verificación en A4.';
    wordDesc = 'Documento Word con la lista de números y datos de la extracción.';
    excelDesc = 'Planilla con número de bola, valor extraído y rango configurado.';
    imageDesc = 'Placa con esferas 3D y números extraídos lista para compartir.';
  }

  const handleExport = async (type: 'excel' | 'word' | 'pdf' | 'image' | 'copy') => {
    setExportSuccess(null);

    try {
      if (variant === 'teams') {
        const p = props as TeamsExportHubProps;
        const title = p.drawTitle || 'División de Equipos';
        const hash = p.auditHash || '';

        if (type === 'excel') {
          await exportTeamsToExcel(p.teams, title, hash);
          setExportSuccess('Excel (.xlsx) descargado con éxito');
        } else if (type === 'word') {
          exportTeamsToWord(p.teams, title, hash);
          setExportSuccess('Word (.doc) generado con éxito');
        } else if (type === 'pdf') {
          exportTeamsToPdf(p.teams, title, hash);
          setExportSuccess('Vista PDF oficial lista');
        } else if (type === 'image') {
          setIsExportingImage(true);
          try {
            await exportTeamsToImage(p.teams, title, hash, `equipos-sorteopro-${Date.now()}.png`);
            setExportSuccess('Imagen HD (.png) descargada con éxito');
          } finally {
            setIsExportingImage(false);
          }
        } else if (type === 'copy') {
          p.onCopyAll?.();
          setExportSuccess('¡Copiado para WhatsApp / Portapapeles!');
        }

      } else if (variant === 'secret-santa') {
        const p = props as SecretSantaExportHubProps;
        const data = {
          matches: p.matches,
          budget: p.budget,
          deadline: p.deadline,
          drawTitle: p.drawTitle || 'Amigo Invisible Oficial',
          auditHash: p.auditHash || ''
        };

        if (type === 'excel') {
          await exportSecretSantaToExcel(data);
          setExportSuccess('Excel (.xlsx) descargado con éxito');
        } else if (type === 'word') {
          exportSecretSantaToWord(data);
          setExportSuccess('Word (.doc) generado con éxito');
        } else if (type === 'pdf') {
          exportSecretSantaToPdf(data);
          setExportSuccess('Vista PDF oficial con tarjetas lista');
        } else if (type === 'image') {
          setIsExportingImage(true);
          try {
            await exportSecretSantaToImage(data, `amigo-invisible-${Date.now()}.png`);
            setExportSuccess('Imagen HD (.png) descargada con éxito');
          } finally {
            setIsExportingImage(false);
          }
        } else if (type === 'copy') {
          const text = exportSecretSantaToWhatsApp(data);
          navigator.clipboard.writeText(text);
          p.onCopyAll?.();
          setExportSuccess('¡Mensaje de WhatsApp copiado al portapapeles!');
        }

      } else if (variant === 'draw-list') {
        const p = props as DrawListExportHubProps;
        const data = {
          title: p.title || 'Sorteo Oficial de Ganadores',
          winners: p.winners,
          substitutes: p.substitutes || [],
          totalParticipants: p.totalParticipants || p.winners.length,
          auditHash: p.auditHash || ''
        };

        if (type === 'excel') {
          await exportDrawListToExcel(data);
          setExportSuccess('Excel (.xlsx) descargado con éxito');
        } else if (type === 'word') {
          exportDrawListToWord(data);
          setExportSuccess('Word (.doc) generado con éxito');
        } else if (type === 'pdf') {
          exportDrawListToPdf(data);
          setExportSuccess('Certificado PDF oficial listo');
        } else if (type === 'image') {
          setIsExportingImage(true);
          try {
            await exportDrawListToImage(data, `ganadores-sorteo-${Date.now()}.png`);
            setExportSuccess('Imagen HD (.png) descargada con éxito');
          } finally {
            setIsExportingImage(false);
          }
        } else if (type === 'copy') {
          const text = exportDrawListToWhatsApp(data);
          navigator.clipboard.writeText(text);
          p.onCopyAll?.();
          setExportSuccess('¡Ganadores copiados para WhatsApp!');
        }

      } else if (variant === 'numbers') {
        const p = props as NumbersExportHubProps;
        const data = {
          numbers: p.numbers,
          min: p.min,
          max: p.max,
          drawTitle: p.drawTitle || 'Extracción de Números al Azar',
          auditHash: p.auditHash || ''
        };

        if (type === 'excel') {
          await exportNumbersToExcel(data);
          setExportSuccess('Excel (.xlsx) descargado con éxito');
        } else if (type === 'word') {
          exportNumbersToWord(data);
          setExportSuccess('Word (.doc) generado con éxito');
        } else if (type === 'pdf') {
          exportNumbersToPdf(data);
          setExportSuccess('Vista PDF oficial lista');
        } else if (type === 'image') {
          setIsExportingImage(true);
          try {
            await exportNumbersToImage(data, `numeros-${Date.now()}.png`);
            setExportSuccess('Imagen HD (.png) descargada con éxito');
          } finally {
            setIsExportingImage(false);
          }
        } else if (type === 'copy') {
          const text = exportNumbersToWhatsApp(data);
          navigator.clipboard.writeText(text);
          p.onCopyAll?.();
          setExportSuccess('¡Números copiados para WhatsApp!');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error al exportar resultados');
    }

    setTimeout(() => setExportSuccess(null), 3500);
  };

  const defaultBtnText = props.buttonText || 'Guardar y Exportar Resultados';
  const defaultBtnClass = props.buttonClassName || 'px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95';

  return (
    <>
      {/* Botón Principal para Abrir el Centro de Exportación */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={defaultBtnClass}
          title="Guardar o Exportar resultados en PDF, Word, Excel o Imagen"
        >
          <Download className="w-4 h-4" />
          <span>{defaultBtnText}</span>
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
                    {modalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {modalSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
                  {pdfDesc}
                </p>
              </button>

              {/* Opción Word (.docx / .doc) */}
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
                  {wordDesc}
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
                  {excelDesc}
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
                  {imageDesc}
                </p>
              </button>
            </div>

            {/* Opción Copiar para WhatsApp / Portapapeles */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  ¿Prefieres compartir solo texto?
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleExport('copy')}
                className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {props.copiedAll ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{props.copiedAll ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
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
