'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, 
  MapPin, Building2, ExternalLink, Loader2, RefreshCw, Briefcase, 
  GraduationCap, Clock, Filter, ShieldCheck, ChevronRight
} from 'lucide-react';
import { EntityLogo } from '@/components/EntityLogo';

interface MatchedItem {
  job: {
    id: string;
    title: string;
    slug: string;
    entity_name: string;
    entity_logo?: string;
    entity_verified?: boolean;
    sector_type: string;
    region: string;
    salary_text: string;
    vacancies_count: number;
    end_date: string;
    apply_url: string;
    bases_pdf_url?: string;
    education_level: string;
  };
  score: number;
  matchReasons: string[];
  educationFit: string;
  careerMatch: boolean;
  regionMatch: boolean;
}

interface CandidateProfile {
  educationLevel: string;
  detectedCareer: string;
  experienceYears: number;
  detectedRegion: string;
  topKeywords: string[];
}

const SAMPLE_PROFILES = [
  {
    label: '💼 Bachiller en Contabilidad (3 años)',
    text: `Bachiller en Contabilidad con 3 años de experiencia en el sector público y privado. Manejo del sistema SIAF, conciliaciones bancarias, liquidación de impuestos y declaraciones juradas ante SUNAT. Radico en Lima.`
  },
  {
    label: '💻 Ing. de Sistemas / Informática',
    text: `Titulado en Ingeniería de Sistemas e Informática. 4 años de experiencia en desarrollo web, administración de bases de datos SQL y soporte técnico en entidades gubernamentales. Conocimientos en ciberseguridad y gestión de redes. Resido en Lima/Callao.`
  },
  {
    label: '⚖️ Abogado / Derecho',
    text: `Abogado colegiado con 2 años de experiencia en derecho administrativo, contrataciones con el Estado (OSCE) y elaboración de informes jurídicos. Experiencia en municipalidades y ministerios. Resido en Arequipa.`
  },
  {
    label: '🚐 Conductor Profesional (Licencia A-III)',
    text: `Conductor con licencia de conducir categoría A-IIIb con 5 años de experiencia en transporte de personal y comisiones de servicio para instituciones del Estado. Récord de conductor impecable sin infracciones graves. Radico en Lima.`
  }
];

export default function MatchCvPage() {
  const [cvText, setCvText] = useState('');
  const [preferredRegion, setPreferredRegion] = useState('');
  const [preferredSector, setPreferredSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [recommendations, setRecommendations] = useState<MatchedItem[]>([]);
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium'>('all');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCvText(text || '');
      };
      reader.readAsText(file);
    } else {
      // For PDF / Word files, extract plain text strings via FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (buffer) {
          const uint8 = new Uint8Array(buffer);
          let rawString = '';
          // Extract printable ASCII/UTF-8 strings from binary buffer
          for (let i = 0; i < uint8.length; i++) {
            const charCode = uint8[i];
            if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
              rawString += String.fromCharCode(charCode);
            } else if (charCode > 127) {
              rawString += ' ';
            }
          }
          // Clean up formatting
          const cleanedText = rawString
            .replace(/[\\\/\{\}\[\]\<\>\(\)]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (cleanedText.length > 50) {
            setCvText(cleanedText.slice(0, 4000));
          } else {
            setErrorMsg(`Archivo "${file.name}" cargado. Si el texto no aparece completo, por favor copia y pega el contenido de tu CV en el recuadro inferior.`);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim() || cvText.trim().length < 15) {
      setErrorMsg('Por favor ingresa o sube un resumen con tu formación y experiencia profesional.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch('/api/ai/match-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          preferredRegion: preferredRegion || undefined,
          preferredSector: preferredSector || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar el CV');
      }

      setProfile(data.candidateProfile);
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      console.error('Error matching CV:', err);
      setErrorMsg(err.message || 'No se pudo conectar con el motor de recomendación.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter((item) => {
    if (scoreFilter === 'high') return item.score >= 70;
    if (scoreFilter === 'medium') return item.score >= 50 && item.score < 70;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-28 sm:pb-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold tracking-wide">
          <Sparkles size={14} className="animate-pulse" />
          <span>RECOMENDADOR DE CONVOCATORIAS CON IA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight leading-tight">
          Encuentra la convocatoria perfecta para tu CV
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Sube tu Curriculum Vitae o pega tu resumen profesional. Nuestro motor de Inteligencia Artificial 
          evalúa tu nivel académico, especialidad y años de experiencia para recomendarte las convocatorias 
          del Estado (CAS 1057, 728, 276) y sector privado con mayor compatibilidad real.
        </p>
      </div>

      {/* Input Section Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6">
        {/* Quick Preload Profiles */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block font-mono">
            Prueba rápida con perfiles de ejemplo:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROFILES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCvText(sample.text)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop File Upload Area */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-50/50 dark:bg-slate-950/40">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Haz clic o arrastra aquí tu CV (PDF, Word o TXT)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extracción confidencial. No almacenamos datos sensibles. Conforme a la Ley N° 29733, nuestros{' '}
              <Link href="/terminos-y-condiciones" target="_blank" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Términos
              </Link>{' '}
              y{' '}
              <Link href="/politica-de-privacidad" target="_blank" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Privacidad
              </Link>.
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block font-mono">
            O pega directamente el texto de tu CV o perfil profesional:
          </label>
          <textarea
            rows={5}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Ejemplo: Bachiller en Contabilidad con 3 años de experiencia en gestión pública, manejo de SIAF y presupuesto en Lima..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
          />
        </div>

        {/* Optional Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">
              Región de Preferencia (Opcional)
            </label>
            <input
              type="text"
              value={preferredRegion}
              onChange={(e) => setPreferredRegion(e.target.value)}
              placeholder="Ej: Lima, Arequipa, Cusco, Remoto..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">
              Régimen Laboral Preferido (Opcional)
            </label>
            <select
              value={preferredSector}
              onChange={(e) => setPreferredSector(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">Cualquier Régimen (Todos)</option>
              <option value="CAS 1057">CAS 1057 (Estado)</option>
              <option value="D.L. 728">D.L. 728 (Planilla Estatal)</option>
              <option value="D.L. 276">D.L. 276 (Carrera Pública)</option>
              <option value="Locación / FAG">Locación de Servicios / FAG</option>
              <option value="Privado">Sector Privado</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !cvText.trim()}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base font-display transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analizando perfil y evaluando convocatorias...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Calcular Compatibilidad y Recomendar Convocatorias</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {profile && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Candidate Profile Radar */}
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 dark:bg-emerald-950/20 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
                  Diagnóstico IA de Perfil
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  Resumen de tu Perfil Profesional Detectado
                </h2>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs font-mono border border-emerald-500/30 self-start sm:self-auto">
                {recommendations.length} Convocatorias Compatibles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-mono block">Grado Académico</span>
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm sm:text-base">
                  {profile.educationLevel}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-mono block">Especialidad Principal</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-sm sm:text-base truncate">
                  {profile.detectedCareer}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-mono block">Experiencia Estimada</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block text-sm sm:text-base">
                  {profile.experienceYears} año(s)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-mono block">Región Base</span>
                <span className="font-extrabold text-sky-600 dark:text-sky-400 block text-sm sm:text-base">
                  {profile.detectedRegion}
                </span>
              </div>
            </div>

            {profile.topKeywords && profile.topKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">Habilidades clave:</span>
                {profile.topKeywords.map((kw, kIdx) => (
                  <span
                    key={kIdx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Filter size={18} className="text-emerald-500" />
              <span>Convocatorias Recomendadas por Compatibilidad</span>
            </h3>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setScoreFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  scoreFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todas ({recommendations.length})
              </button>
              <button
                type="button"
                onClick={() => setScoreFilter('high')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  scoreFilter === 'high'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Alta Afinidad &gt;70% ({recommendations.filter(r => r.score >= 70).length})
              </button>
              <button
                type="button"
                onClick={() => setScoreFilter('medium')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  scoreFilter === 'medium'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Media (50-70%) ({recommendations.filter(r => r.score >= 50 && r.score < 70).length})
              </button>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
                No hay convocatorias que coincidan con este filtro específico. Intenta seleccionando "Todas".
              </div>
            ) : (
              filteredRecommendations.map((item, idx) => {
                const isHighFit = item.score >= 70;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <EntityLogo entityName={item.job.entity_name} logoUrl={item.job.entity_logo} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {item.job.entity_name}
                            </span>
                            {item.job.entity_verified && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                                <ShieldCheck size={10} />
                                <span>Verificado</span>
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/empleos/${item.job.slug}`}
                            className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mt-0.5 block"
                          >
                            {item.job.title}
                          </Link>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                        <div className={`px-4 py-2 rounded-2xl border font-mono text-center ${
                          isHighFit
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-sky-300'
                        }`}>
                          <span className="text-lg sm:text-xl font-extrabold block leading-tight">
                            {item.score}%
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider block">
                            Compatibilidad
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        💰 {item.job.salary_text}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{item.job.region}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={13} className="text-slate-400" />
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
                          {item.job.sector_type}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap size={13} className="text-slate-400" />
                        <span>{item.job.education_level}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        <span>Vence: {item.job.end_date}</span>
                      </span>
                    </div>

                    {/* Match Reasons Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-mono block text-[11px]">
                        Por qué encajas en este puesto:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.matchReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <Link
                        href={`/empleos/${item.job.slug}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      >
                        <FileText size={14} />
                        <span>Ver Bases Oficiales y Requisitos</span>
                      </Link>

                      <a
                        href={item.job.apply_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>Postular en Portal Oficial</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
