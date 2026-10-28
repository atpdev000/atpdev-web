'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, Sparkles, ExternalLink, Loader2, CheckCircle2, ShieldCheck, ArrowRight, Download } from 'lucide-react';
import { isCompetitorUrl } from '@atpdev/database';

interface OfficialDoc {
  title: string;
  url: string;
  category?: string;
}

interface AiBasesResolverProps {
  jobTitle: string;
  entityName: string;
  startDate?: string;
  endDate?: string;
  initialDocuments?: OfficialDoc[];
  canonicalPortalUrl?: string;
  canonicalPortalName?: string;
}

function extractTargetYear(startDate?: string, endDate?: string, title?: string): number {
  if (endDate) {
    const m = endDate.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (startDate) {
    const m = startDate.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  if (title) {
    const m = title.match(/\b(202[4-9]|203\d)\b/);
    if (m) return parseInt(m[1], 10);
  }
  return 2026;
}

function isLegitimateOfficialDoc(d: OfficialDoc, entityName?: string, targetYear?: number): boolean {
  if (!d || !d.url) return false;
  if (isCompetitorUrl(d.url)) return false;
  const lowUrl = d.url.toLowerCase();
  const lowTitle = (d.title || '').toLowerCase();

  // Excepción legítima: Poder Judicial sistema oficial PSEP
  if (lowUrl.includes('aplicativo.pj.gob.pe/repositoriopsep')) return true;

  // Descartar tesis y repositorios académicos
  const badUrlTokens = [
    'repositorio.', 'tesis.', 'cybertesis', 'bitstream', 'bitstreams',
    '/handle/', 'dspace', 'scielo', 'dialnet', 'redalyc', 'alicia.concytec',
    'pei-', 'poi-', 'rof-', 'mof-', 'tupa-', 'silabo', 'pedagogico', 'conflictividad'
  ];
  if (badUrlTokens.some(t => lowUrl.includes(t))) return false;

  const badTitleWords = [
    'tesis', 'grado académico', 'grado academico', 'para optar el grado',
    'maestro en', 'maestría en', 'maestria en', 'doctor en', 'doctorado',
    'licenciatura en', 'proyecto educativo', 'plan estratégico', 'plan estrategico',
    'plan operativo', 'manual de organización', 'tupa', 'silabo', 'balotario',
    'conflictividad', 'willaqniki', 'dialogo y prevencion', 'diálogo y prevención',
    'boletin', 'boletín', 'revista', 'informe mensual'
  ];
  if (badTitleWords.some(w => lowTitle.includes(w))) return false;

  // Filtro de año estricto: eliminar documentos obsoletos (ej: 2013, 2015, etc.)
  const year = targetYear || 2026;
  const minValidYear = year - 1;
  const yearMatches = (lowTitle + ' ' + lowUrl).match(/\b(19\d{2}|20\d{2})\b/g);
  if (yearMatches) {
    let hasAncient = false;
    let hasValid = false;
    for (const ym of yearMatches) {
      const y = parseInt(ym, 10);
      if (y >= 1990 && y <= year + 1) {
        if (y >= minValidYear) {
          hasValid = true;
        } else {
          hasAncient = true;
        }
      }
    }
    if (hasAncient && !hasValid) {
      return false;
    }
  }

  // Entidades de gobierno general no publican bases en dominios .edu.pe
  const isUniv = Boolean(
    entityName && (
      entityName.toUpperCase().includes('UNIVERSIDAD') ||
      /\b(UNI|UNMSM|UNAJMA|UNAAT|UNCP|UNAS|UNALM|UNT|UNSA|UNSAAC|UNSCH|UNP|UNAP|UNC|UNAC|UNSM)\b/.test(entityName.toUpperCase())
    )
  );
  if (!isUniv && lowUrl.includes('.edu.pe')) return false;

  return true;
}

export function AiBasesResolver({
  jobTitle,
  entityName,
  startDate,
  endDate,
  initialDocuments = [],
  canonicalPortalUrl,
  canonicalPortalName
}: AiBasesResolverProps) {
  const targetYear = extractTargetYear(startDate, endDate, jobTitle);
  // Filtrar de inmediato cualquier URL de agregadores o documentos espurios/antiguos
  const safeInitialDocs = (initialDocuments || []).filter(d => isLegitimateOfficialDoc(d, entityName, targetYear));
  const [documents, setDocuments] = useState<OfficialDoc[]>(safeInitialDocs);
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(safeInitialDocs.length > 0);
  const [portalInfo, setPortalInfo] = useState({
    name: canonicalPortalName || entityName,
    url: canonicalPortalUrl && !isCompetitorUrl(canonicalPortalUrl) ? canonicalPortalUrl : ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isMountedRef = useRef(false);
  const prevJobRef = useRef(jobTitle);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sincronizar estado SOLO si cambia el puesto (evitar bucle infinito de dependencias no primitivas)
  useEffect(() => {
    if (prevJobRef.current !== jobTitle) {
      prevJobRef.current = jobTitle;
      const nextSafeDocs = (initialDocuments || []).filter(d => isLegitimateOfficialDoc(d, entityName, targetYear));
      setDocuments(nextSafeDocs);
      setResolved(nextSafeDocs.length > 0);
      setPortalInfo({
        name: canonicalPortalName || entityName,
        url: canonicalPortalUrl && !isCompetitorUrl(canonicalPortalUrl) ? canonicalPortalUrl : ''
      });
      setErrorMsg(null);
    }
  }, [jobTitle, entityName, canonicalPortalUrl, canonicalPortalName, targetYear, initialDocuments]);

  const handleResolveBases = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch('/api/ai/resolve-bases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          entity_name: entityName,
          start_date: startDate,
          end_date: endDate
        })
      });

      if (!res.ok) {
        throw new Error('No se pudo completar la búsqueda asistida');
      }

      const data = await res.json();
      if (!isMountedRef.current) return;

      const verifiedDocs = (data.official_documents || []).filter((d: OfficialDoc) => isLegitimateOfficialDoc(d, entityName, targetYear));
      if (verifiedDocs.length > 0) {
        setDocuments(verifiedDocs);
        setResolved(true);
      } else {
        setErrorMsg(data.message || 'No se localizaron PDFs externos indexados para este periodo. Accede directamente al portal institucional verificado.');
      }

      if (data.portalUrl && !isCompetitorUrl(data.portalUrl)) {
        setPortalInfo({
          name: data.portalName || entityName,
          url: data.portalUrl
        });
      }
    } catch (err: any) {
      console.error('Error resolving bases:', err);
      if (isMountedRef.current) {
        setErrorMsg('No se encontraron PDFs adicionales para este rango de fecha. Accede directamente al portal oficial verificado.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Si ya tenemos documentos (iniciales o resueltos por la IA)
  const validDocuments = documents.filter(d => isLegitimateOfficialDoc(d, entityName));

  if (resolved && validDocuments.length > 0) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-950/10 dark:bg-emerald-950/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="text-emerald-600 dark:text-emerald-400" size={22} />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                Documentos y Etapas Oficiales del Concurso
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Bases oficiales, cronogramas y formatos emitidos por <b className="text-slate-900 dark:text-white">{entityName}</b>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold whitespace-nowrap">
              {validDocuments.length} Archivo(s) Verificado(s)
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {validDocuments.map((doc, dIdx) => {
            const lowDocUrl = doc.url.toLowerCase();
            const isPdf = lowDocUrl.includes('.pdf') || lowDocUrl.includes('drive.google.com') || lowDocUrl.includes('docs.google.com');
            const isDoc = lowDocUrl.includes('.doc') || lowDocUrl.includes('.docx');
            const isFile = isPdf || isDoc || lowDocUrl.includes('.xlsx') || lowDocUrl.includes('.zip');

            return (
              <div
                key={dIdx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isPdf ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30' :
                    isDoc ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30' :
                    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isPdf ? 'PDF' : isDoc ? 'DOCX' : (doc.category || 'OFICIAL')}
                  </span>
                  <div>
                    <span className="text-slate-900 dark:text-white text-xs sm:text-sm font-semibold block leading-tight">
                      {doc.title}
                    </span>
                    {doc.category && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Etapa: {doc.category}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`self-start sm:self-auto px-4 py-2 rounded-xl text-white text-xs font-bold font-display transition-all flex items-center gap-2 shadow-xs whitespace-nowrap cursor-pointer ${
                    isFile 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-teal-700 hover:bg-teal-800'
                  }`}
                >
                  {isFile ? <Download size={14} /> : <ExternalLink size={14} />}
                  <span>{isFile ? 'Descargar Archivo Oficial' : 'Ver Convocatoria Oficial'}</span>
                  {isFile && <ExternalLink size={12} />}
                </a>
              </div>
            );
          })}
        </div>

        {portalInfo.url && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Portal institucional verificado: <b>{portalInfo.name}</b></span>
            </span>
            <a
              href={portalInfo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              <span>Abrir portal de convocatorias</span>
              <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>
    );
  }

  // Estado inicial o cuando no hay documentos scrapeados de antemano
  return (
    <div className="p-6 sm:p-8 rounded-2xl space-y-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-600 dark:text-emerald-400 animate-pulse" size={20} />
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              Bases Oficiales y Documentación del Estado
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            ¿Deseas descargar las bases en PDF, anexos y cronograma de esta plaza en <b className="text-slate-900 dark:text-white">{entityName}</b>?
            Nuestro motor IA rastrea en tiempo real los servidores institucionales de gob.pe.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={handleResolveBases}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Buscando bases en servidores del Estado...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Localizar Bases y PDF Oficiales con IA</span>
            </>
          )}
        </button>

        {portalInfo.url && (
          <a
            href={portalInfo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <span>Ir al Portal Oficial de {portalInfo.name}</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
