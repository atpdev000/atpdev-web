'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, Copy, Check, Download, Upload, RotateCcw, Trash2, 
  FileSpreadsheet, Eye, ZoomIn, ZoomOut, Maximize2, ShieldCheck, FileText, Info, ArrowRight, X
} from 'lucide-react';
import { CvData, CvTemplateId } from './cv/types';
import { SAMPLE_CV_DATA } from './cv/sampleData';
import { CvTemplateSelector } from './cv/CvTemplateSelector';
import { CvForm } from './cv/CvForm';
import { TemplateServirCas } from './cv/templates/TemplateServirCas';
import { TemplateModernExecutive } from './cv/templates/TemplateModernExecutive';
import { TemplateMinimalAts } from './cv/templates/TemplateMinimalAts';
import { TemplateTechCreative } from './cv/templates/TemplateTechCreative';
import { generatePlainResumeText } from './cv/textExport';
import { downloadCvAsWord } from './cv/wordExport';

const STORAGE_KEY_DATA = 'chamba_pro_cv_data_v2';
const STORAGE_KEY_TEMPLATE = 'chamba_pro_cv_template_v2';

export function CvCasGenerator() {
  const [data, setData] = useState<CvData>(SAMPLE_CV_DATA);
  const [templateId, setTemplateId] = useState<CvTemplateId>('servir-cas');
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(85); // % zoom for preview
  const [showPrintTips, setShowPrintTips] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [showClearModal, setShowClearModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Close full screen on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Remove zoom scale during print events
  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Load saved state from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE) as CvTemplateId;
      if (savedTemplate) {
        setTemplateId(savedTemplate);
      }
    } catch (err) {
      console.warn('Error reading CV data from localStorage:', err);
    }
  }, []);

  // Auto-save changes to localStorage
  const handleDataChange = (updated: CvData) => {
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  const handleTemplateChange = (id: CvTemplateId) => {
    setTemplateId(id);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, id);
    } catch (e) {
      console.warn('LocalStorage template save failed:', e);
    }
  };

  // Actions
  const handleCopyText = () => {
    const text = generatePlainResumeText(data);
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('✓ Texto plano copiado al portapapeles');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadWord = () => {
    showToast('✓ Generando documento Word (.doc)...');
    downloadCvAsWord(data, templateId);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 60);
  };

  const handleLoadFilledExample = () => {
    const isMostlyEmpty =
      !data.personal.fullName || (data.experiences.length === 0 && data.education.length === 0);
    if (
      isMostlyEmpty ||
      confirm(
        '¿Deseas cargar la plantilla con los datos del modelo de ejemplo? Podrás ver cómo luce el diseño 100% completo con foto, experiencia y formación.'
      )
    ) {
      handleDataChange(SAMPLE_CV_DATA);
      showToast('✓ Modelo de ejemplo cargado con éxito');
    }
  };

  const handleResetExample = handleLoadFilledExample;

  const handleClearAll = () => {
    const emptyData: CvData = {
      personal: {
        fullName: '',
        headline: '',
        dni: '',
        ruc: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        colegiatoria: '',
        linkedin: '',
        website: '',
        photoUrl: '',
      },
      profileSummary: '',
      education: [],
      courses: [],
      experiences: [],
      skills: [],
      languages: [],
      swornStatementAccepted: true,
    };
    handleDataChange(emptyData);
    setShowClearModal(false);
    showToast('✓ Formulario vaciado para nuevo CV');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify({ templateId, data }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_CHAMBA_PRO_${data.personal.dni || 'BORRADOR'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Respaldo JSON descargado');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data) {
          handleDataChange(parsed.data);
          if (parsed.templateId) handleTemplateChange(parsed.templateId);
          showToast('✓ Respaldo JSON cargado exitosamente');
        }
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Render chosen template
  const renderTemplate = () => {
    switch (templateId) {
      case 'servir-cas':
        return <TemplateServirCas data={data} />;
      case 'modern-executive':
        return <TemplateModernExecutive data={data} />;
      case 'minimal-ats':
        return <TemplateMinimalAts data={data} />;
      case 'tech-creative':
        return <TemplateTechCreative data={data} />;
      default:
        return <TemplateServirCas data={data} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden input for importing JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />

      {/* Executive Command Header Bar (Print hidden) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden space-y-4">
        {/* Top Row: Title, live status & professional toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center font-bold shadow-sm shrink-0">
              <FileSpreadsheet size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white tracking-tight">
                  Editor de CV Profesional
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 font-mono text-[10.5px] font-bold">
                  ⚡ Calibrado A4 Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-guardado activo
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[280px] hidden sm:inline">
                  {data.personal.fullName || 'Nuevo CV'}
                </span>
              </p>
            </div>
          </div>

          {/* Secondary Actions Hub */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Ver Plantilla Llenada */}
            <button
              type="button"
              onClick={handleLoadFilledExample}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 font-bold text-xs transition-all border border-emerald-500/40 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
              title="Cargar modelo de ejemplo con datos completos para ver el diseño terminado"
            >
              <Eye size={14} className="text-emerald-400" />
              <span>Ver Ejemplo Llenado</span>
            </button>

            {/* Limpiar Formulario */}
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 font-bold text-xs transition-all border border-rose-500/30 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
              title="Limpiar todos los campos del CV de manera segura con confirmación"
            >
              <RotateCcw size={14} className="text-rose-400" />
              <span>Limpiar Formulario</span>
            </button>

            {/* Utility Group */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={handleCopyText}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copiar texto plano para mesas de partes virtuales"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Exportar respaldo de datos en archivo JSON"
              >
                <Download size={14} />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Importar respaldo desde archivo JSON"
              >
                <Upload size={14} />
              </button>

              <button
                type="button"
                onClick={() => setShowPrintTips(!showPrintTips)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showPrintTips ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/10 text-slate-400 hover:text-amber-300'
                }`}
                title="Instrucciones para exportar en PDF perfecto sin esperas"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Template Selector Section */}
        <div className="pt-2 border-t border-white/10">
          <CvTemplateSelector selectedId={templateId} onSelect={handleTemplateChange} />
        </div>
      </div>

      {/* Selector de Modo Móvil (Para smartphones y tablets) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-xs font-bold font-display print:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === 'editor'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText size={15} />
          <span>1. Formulario de Datos</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileTab('preview');
            if (typeof window !== 'undefined' && window.innerWidth < 640 && zoomLevel > 50) {
              setZoomLevel(45);
            }
          }}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={15} />
          <span>2. Vista Previa Hoja A4</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Main Grid: Left Editor + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Editor (Col 5) */}
        <div className={`lg:col-span-5 print:hidden ${mobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <CvForm
            data={data}
            onChange={handleDataChange}
          />
        </div>

        {/* Right Preview Column (Col 7 - Sticky pro workstation) */}
        <div className={`lg:col-span-7 space-y-3 lg:sticky lg:top-24 self-start ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          {/* Mobile Back Button to Editor */}
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className="lg:hidden w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 shadow-md cursor-pointer print:hidden"
          >
            <FileText size={14} />
            <span>← Volver al Formulario de Datos para seguir editando</span>
          </button>

          {/* Zoom and Preview Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-white/10 print:hidden text-xs shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <Eye size={15} className="text-emerald-400 shrink-0" />
              <span className="font-bold font-display text-white truncate">Vista Previa Hoja A4</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-white/10 text-[10px] font-mono text-slate-300 truncate hidden xl:inline">
                {templateId === 'servir-cas'
                  ? 'Ficha Resumen SERVIR'
                  : templateId === 'modern-executive'
                  ? 'Moderno Ejecutivo'
                  : templateId === 'minimal-ats'
                  ? 'Harvard ATS-Friendly'
                  : 'Tech & Contemporáneo'}
              </span>
            </div>

            {/* Quick Zoom Bar */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Alejar vista"
              >
                <ZoomOut size={13} />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(typeof window !== 'undefined' && window.innerWidth < 640 ? 45 : 75)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  (zoomLevel === 75 || zoomLevel === 45) ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {typeof window !== 'undefined' && window.innerWidth < 640 ? '45%' : '75%'}
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(85)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  zoomLevel === 85 ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                85%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  zoomLevel === 100 ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                100%
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(120, zoomLevel + 10))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Acercar vista"
              >
                <ZoomIn size={13} />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Vista previa inmersiva a pantalla completa"
              >
                <Maximize2 size={13} />
              </button>

              <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                A4: 210×297mm
              </span>

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              {/* Quick Export from Live Preview */}
              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
                title="Descargar Word (.DOC) editable con tablas"
              >
                <FileText size={12} />
                <span>Word</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-[11px] transition-all shadow-sm flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-98"
                title="Guardar o imprimir en formato PDF A4 oficial"
              >
                <Printer size={12} className="stroke-[2.5]" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Container with Pro Studio Desk Mat */}
          <div className="w-full overflow-x-auto p-2 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center print:border-none print:bg-transparent print:p-0 print:m-0 print:overflow-visible">
            <div
              id="cv-print-area"
              style={{
                transform: isPrinting ? 'none' : `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: isPrinting ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-full max-w-[820px] print:max-w-none print:w-full print:transform-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-slate-700/30 rounded-sm"
            >
              {renderTemplate()}
            </div>

            {/* Bottom Status Mat Info */}
            <div className="mt-4 pt-3 border-t border-white/5 w-full flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 print:hidden px-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Hoja A4 Calibrada (210mm × 297mm)
              </span>
              <span className="text-slate-500 hidden sm:inline">
                Exportación 100% nativa para Convocatorias CAS y Empleo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Banner (visible when education and experience are empty) */}
      {data.experiences.length === 0 && data.education.length === 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 text-xs text-slate-200 print:hidden shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">¿Tu formulario está en blanco?</p>
              <p className="text-slate-400 text-[11.5px] mt-0.5">
                Haz clic en <strong>&quot;Ver Ejemplo Llenado&quot;</strong> para cargar un modelo completo con foto, experiencia CAS/Privada y capacitaciones, y ver cómo luce en los 4 diseños.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadFilledExample}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-emerald-500/25 hover:scale-105"
          >
            <Eye size={15} />
            <span>Ver Ejemplo Llenado</span>
          </button>
        </div>
      )}

      {/* PDF Export Tips Banner (Collapsible) */}
      {showPrintTips && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5 print:hidden">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>¿Te sale &quot;Esperando conexión de impresora...&quot; en Windows?</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPrintTips(false)}
              className="text-amber-400 hover:text-white cursor-pointer"
            >
              Entendido ✕
            </button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Ese mensaje del sistema aparece cuando Windows intenta comunicarse con una impresora física que está apagada o desconectada. Para resolverlo en 1 segundo:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            <li>
              👉 <strong>Opción 1 (Más rápida):</strong> Pulsa el botón azul <strong className="text-blue-400 font-bold">&quot;Descargar Word (.DOC)&quot;</strong> en la barra de vista previa o al pie del formulario. Se descargará el archivo de inmediato, 100% editable en Microsoft Word o Google Docs, y puedes guardarlo como PDF cuando quieras.
            </li>
            <li>
              👉 <strong>Opción 2 (PDF directo sin impresora física):</strong> En la ventana de impresión de Windows, cambia la impresora a <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Microsoft Print to PDF</strong> o <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Guardar como PDF</strong>. De esa manera Windows no busca ninguna máquina física y genera el PDF al instante.
            </li>
            <li>
              👉 <strong>Disposición Vertical (Hoja A4):</strong> En la ventana de impresión, asegúrate de que la <strong>Disposición</strong> esté seleccionada en <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">Vertical</strong> para que la hoja encaje con exactitud y no se divida.
            </li>
            <li>
              👉 <strong>Gráficos de fondo:</strong> Recuerda verificar que la casilla <strong className="text-white">&quot;Gráficos de fondo&quot;</strong> esté marcada para que se impriman con máxima nitidez los bordes, insignias y colores institucionales.
            </li>
          </ul>
        </div>
      )}

      {/* Modal de Confirmación para Limpiar Formulario */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-bold">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  ¿Deseas limpiar todo el formulario?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Esta acción iniciará un CV 100% en blanco.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              ⚠️ <strong>Atención:</strong> Se vaciarán todos los datos personales, resumen, grados académicos, experiencia laboral y habilidades que hayas redactado.
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              💡 <em>Consejo:</em> Si deseas conservar tu información actual, puedes presionar <strong>&quot;Guardar JSON&quot;</strong> antes de vaciar el formulario.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Descargar copia de seguridad en JSON"
              >
                <Download size={14} />
                <span>Guardar JSON</span>
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Sí, Vaciar Todo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Conversion Banner (iLovePDF High-Impact Style, Print Hidden) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Documento Calibrado & Verificado
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            ¿Tu CV está listo para postular?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Genera de inmediato tu archivo en formato oficial para adjuntar a las convocatorias de SERVIR, ministerios o el sector corporativo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleDownloadWord}
            className="w-full sm:w-auto h-14 px-7 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-[0_8px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-blue-400/40"
          >
            <FileText size={18} />
            <span>Descargar Word (.DOC)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base transition-all shadow-[0_8px_30px_rgba(16,185,129,0.45)] ring-2 ring-emerald-300/60 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer size={20} className="stroke-[2.5]" />
            <span>Guardar / Imprimir PDF (A4)</span>
            <ArrowRight size={18} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Barra Flotante Inferior en Móviles */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-slate-900/95 backdrop-blur-xl border border-white/15 p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-2 print:hidden">
        <button
          type="button"
          onClick={() => {
            const next = mobileTab === 'editor' ? 'preview' : 'editor';
            setMobileTab(next);
            if (next === 'preview' && typeof window !== 'undefined' && window.innerWidth < 640 && zoomLevel > 50) {
              setZoomLevel(45);
            }
          }}
          className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 cursor-pointer"
        >
          {mobileTab === 'editor' ? <Eye size={14} className="text-emerald-400" /> : <FileText size={14} className="text-blue-400" />}
          <span>{mobileTab === 'editor' ? 'Ver A4' : 'Editar'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer"
          >
            <FileText size={14} />
            <span>Word</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-emerald-500/30 cursor-pointer"
          >
            <Printer size={14} />
            <span>PDF A4</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Zen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col print:hidden animate-in fade-in duration-200">
          {/* Top Floating Control Bar */}
          <div className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-white text-sm font-display truncate">
                  Vista Previa A4 Inmersiva
                </h3>
                <p className="text-[11px] font-mono text-slate-400 truncate">
                  {templateId === 'servir-cas'
                    ? 'Ficha Resumen SERVIR'
                    : templateId === 'modern-executive'
                    ? 'Moderno Ejecutivo'
                    : templateId === 'minimal-ats'
                    ? 'Harvard ATS-Friendly'
                    : 'Tech & Contemporáneo'} • {data.personal.fullName || 'Nuevo CV'}
                </p>
              </div>
            </div>

            {/* Quick Actions in Zen View */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] mr-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Alejar vista"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="px-2 text-slate-300 text-xs font-bold">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(120, zoomLevel + 10))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Acercar vista"
                >
                  <ZoomIn size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
                title="Descargar Word (.DOC) editable"
              >
                <FileText size={13} />
                <span className="hidden sm:inline">Word (.DOC)</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
                title="Guardar o imprimir en PDF A4"
              >
                <Printer size={13} className="stroke-[2.5]" />
                <span>PDF A4</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 transition-colors ml-2 cursor-pointer"
                title="Cerrar vista inmersiva (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Centered Scrollable Stage */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
              className="w-full max-w-[820px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-sm my-4"
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      )}

      {/* Floating Micro-Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-white font-medium text-xs shadow-2xl shadow-emerald-950/60 flex items-center gap-2.5 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
