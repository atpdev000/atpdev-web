'use client';

import { useState } from 'react';
import Link from 'next/link';
import { publishIngestaJobAction } from './actions';

export default function AdminIngestaPage() {
  const [rawText, setRawText] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Form State
  const [jobForm, setJobForm] = useState<{
    title: string;
    entity_name: string;
    vacancies_count: number;
    salary_text: string;
    region: string;
    sector_type: string;
    education_level: string;
    category: string;
    end_date: string;
    apply_url: string;
    bases_pdf_url: string;
    requirements: string[];
  } | null>(null);

  const handleParseWithAI = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setPublishSuccess(null);

    try {
      const res = await fetch('/api/ai/parse-bases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, applyUrl, pdfUrl })
      });

      const data = await res.json();
      if (data.success && data.extractedJob) {
        setJobForm(data.extractedJob);
      } else {
        alert(data.error || 'Error al extraer campos del texto');
      }
    } catch (err) {
      alert('Excepción al conectar con el asistente de IA');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePublishJob = async () => {
    if (!jobForm) return;
    setIsPublishing(true);

    try {
      const res = await publishIngestaJobAction({
        ...jobForm,
        featured: true
      });
      if (res.success) {
        setPublishSuccess(jobForm.title);
        setJobForm(null);
        setRawText('');
        setApplyUrl('');
        setPdfUrl('');
      } else {
        alert(res.error || 'Error al guardar la convocatoria');
      }
    } catch (err) {
      alert('Error al publicar la convocatoria');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
              ✨ Asistente de IA para Carga Rápida
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Panel de Ingesta Nivel Dios <span className="text-emerald-400">Chamba Pro</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Reduce la publicación de convocatorias complejas (ONPE, MINEDU, Poder Judicial) de 10 minutos a 3 segundos.
            </p>
          </div>
          <Link
            href="/empleos"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            ← Volver al Portal de Empleos
          </Link>
        </div>

        {/* Notificación de Éxito */}
        {publishSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
            <div>
              <span className="font-bold">🎉 ¡Convocatoria Publicada en Vivo!</span>
              <p className="text-xs text-emerald-400/80 mt-0.5">
                "{publishSuccess}" ya está disponible y visible para miles de postulantes en Chamba Pro.
              </p>
            </div>
            <Link
              href="/empleos"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-md transition"
            >
              Ver en Portal
            </Link>
          </div>
        )}

        {/* Paso 1: Pegar Texto de las Bases */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
              Pegar Texto de Bases / Convocatoria (PDF o Web)
            </h2>
            <span className="text-xs text-slate-500">Formato Libre / Copia y Pega</span>
          </div>

          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Pega aquí el texto completo copiado de las bases en PDF o página oficial de la entidad (Ej. ONPE, MINEDU, RENIEC, Poder Judicial, GORE)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-600 transition"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                URL Oficial de Postulación (Opcional)
              </label>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://reclutamiento.onpe.gob.pe/convocatorias"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                URL de Bases PDF (Opcional)
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://www.gob.pe/institucion/minedu/informes-publicaciones"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <button
            onClick={handleParseWithAI}
            disabled={isParsing || !rawText.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isParsing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Analizando y Estructurando con IA (3s)...</span>
              </>
            ) : (
              <>
                <span>✨ Extraer y Estructurar Campos con IA</span>
              </>
            )}
          </button>
        </div>

        {/* Paso 2: Revisión e Ingesta del Formulario Estructurado */}
        {jobForm && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-bold">2</span>
                Revisión e Ingesta Inmediata (Autocompletado con IA)
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                100% Estructurado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Título de la Convocatoria</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-bold text-white focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Entidad Pública Emisora</label>
                <input
                  type="text"
                  value={jobForm.entity_name}
                  onChange={(e) => setJobForm({ ...jobForm, entity_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Remuneración / Sueldo</label>
                <input
                  type="text"
                  value={jobForm.salary_text}
                  onChange={(e) => setJobForm({ ...jobForm, salary_text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Vacantes Totales</label>
                <input
                  type="number"
                  value={jobForm.vacancies_count}
                  onChange={(e) => setJobForm({ ...jobForm, vacancies_count: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Régimen Laboral</label>
                <select
                  value={jobForm.sector_type}
                  onChange={(e) => setJobForm({ ...jobForm, sector_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="CAS 1057">CAS 1057</option>
                  <option value="D.L. 728">D.L. 728</option>
                  <option value="D.L. 276">D.L. 276</option>
                  <option value="Locación / FAG">Locación de Servicios / FAG</option>
                  <option value="Prácticas">Prácticas Pre/Profesionales</option>
                  <option value="Privado">Sector Privado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Región / Ubicación</label>
                <input
                  type="text"
                  value={jobForm.region}
                  onChange={(e) => setJobForm({ ...jobForm, region: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha Límite de Postulación</label>
                <input
                  type="date"
                  value={jobForm.end_date}
                  onChange={(e) => setJobForm({ ...jobForm, end_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handlePublishJob}
                disabled={isPublishing}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-xl transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPublishing ? (
                  <span>Publicando Convocatoria...</span>
                ) : (
                  <span>🚀 CONFIRMAR Y PUBLICAR CONVOCATORIA EN VIVO</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
