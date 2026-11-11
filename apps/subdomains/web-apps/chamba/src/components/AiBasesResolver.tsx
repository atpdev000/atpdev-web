'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, ExternalLink, Loader2, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { isCompetitorUrl, decodeHtmlEntities, cleanEntityDisplayName } from '@/lib/entityUtils';

interface OfficialDoc {
  title: string;
  url: string;
  category?: string;
}

interface AiBasesResolverProps {
  slug?: string;
  jobTitle: string;
  entityName: string;
  region?: string;
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
  // Descartar plantillas genéricas internas; permitir únicamente el Word oficial (.docx) de SERVIR o URLs oficiales reales
  if (d.url.startsWith('/plantillas-anexos')) return false;
  if (d.url.startsWith('/api/bases-doc/')) {
    return d.url.includes('format=docx');
  }
  if (!d.url.startsWith('http') || isCompetitorUrl(d.url)) return false;

  const lowUrl = d.url.toLowerCase();
  const lowTitle = (d.title || '').toLowerCase();

  if (lowUrl.includes('aplicativo.pj.gob.pe/repositoriopsep')) return true;
  if (lowUrl.includes('archivos.mpfn.gob.pe/convoca/anexo-archivo/')) return true;
  if (lowUrl.includes('portal.mpfn.gob.pe/convoca/')) return true;

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

  const year = targetYear || 2026;
  const minValidYear = Math.min(2024, year - 2);
  const yearMatches = (lowTitle + ' ' + lowUrl).match(/\b(19\d{2}|20\d{2})\b/g);
  if (yearMatches) {
    let hasAncient = false;
    let hasValid = false;
    for (const ym of yearMatches) {
      const y = parseInt(ym, 10);
      if (y === 1057 || y === 276 || y === 728) continue;
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

  const isUniv = Boolean(
    entityName && (
      entityName.toUpperCase().includes('UNIVERSIDAD') ||
      /\b(UNI|UNMSM|UNAJMA|UNAAT|UNCP|UNAS|UNALM|UNT|UNSA|UNSAAC|UNSCH|UNP|UNAP|UNC|UNAC|UNSM)\b/.test(entityName.toUpperCase())
    )
  );
  if (!isUniv && lowUrl.includes('.edu.pe')) return false;

  return true;
}

function buildRealOfficialList(
  externalDocs: OfficialDoc[],
  cleanEntity: string,
  canonicalPortalUrl?: string,
  canonicalPortalName?: string
): OfficialDoc[] {
  const list: OfficialDoc[] = [...externalDocs];

  if (canonicalPortalUrl && !isCompetitorUrl(canonicalPortalUrl)) {
    const exists = list.some(d => d.url.toLowerCase() === canonicalPortalUrl.toLowerCase());
    if (!exists) {
      list.push({
        title: `Página Oficial de Convocatorias — ${decodeHtmlEntities(canonicalPortalName) || cleanEntity}`,
        url: canonicalPortalUrl,
        category: 'Página Oficial de las Bases'
      });
    }
  }

  return list;
}

export function AiBasesResolver({
  slug,
  jobTitle,
  entityName,
  region,
  startDate,
  endDate,
  initialDocuments = [],
  canonicalPortalUrl,
  canonicalPortalName
}: AiBasesResolverProps) {
  const cleanEntity = cleanEntityDisplayName(entityName) || decodeHtmlEntities(entityName) || entityName;
  const cleanJobTitle = decodeHtmlEntities(jobTitle) || jobTitle;
  const targetYear = extractTargetYear(startDate, endDate, cleanJobTitle);

  const safeInitialDocs = (initialDocuments || []).filter(d => isLegitimateOfficialDoc(d, cleanEntity, targetYear));
  const initialList = buildRealOfficialList(safeInitialDocs, cleanEntity, canonicalPortalUrl, canonicalPortalName);

  const [documents, setDocuments] = useState<OfficialDoc[]>(initialList);
  const [loading, setLoading] = useState(false);
  const [aiSearched, setAiSearched] = useState(false);
  const [portalInfo, setPortalInfo] = useState({
    name: decodeHtmlEntities(canonicalPortalName) || cleanEntity,
    url: canonicalPortalUrl && !isCompetitorUrl(canonicalPortalUrl) ? canonicalPortalUrl : ''
  });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const isMountedRef = useRef(false);
  const autoResolvedRef = useRef(false);
  const prevJobRef = useRef(cleanJobTitle);

  const handleResolveBases = async (isAuto = false) => {
    try {
      setLoading(true);
      if (!isAuto) setStatusMsg(null);

      const res = await fetch('/api/ai/resolve-bases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: cleanJobTitle,
          entity_name: cleanEntity,
          region,
          start_date: startDate,
          end_date: endDate
        })
      });

      if (!res.ok) {
        throw new Error('Error en la consulta');
      }

      const data = await res.json();
      if (!isMountedRef.current) return;

      const verifiedDocs = (data.official_documents || []).filter((d: OfficialDoc) =>
        isLegitimateOfficialDoc(d, cleanEntity, targetYear)
      );
      const nextPortalUrl = data.portalUrl && !isCompetitorUrl(data.portalUrl) ? data.portalUrl : portalInfo.url;
      const nextPortalName = decodeHtmlEntities(data.portalName) || portalInfo.name;

      const merged = buildRealOfficialList(verifiedDocs, cleanEntity, nextPortalUrl, nextPortalName);
      setDocuments(merged);
      setAiSearched(true);
      if (!isAuto) {
        setStatusMsg(data.message || 'Bases oficiales y páginas oficiales donde se encuentra la convocatoria verificadas al 100%.');
      }

      if (nextPortalUrl) {
        setPortalInfo({
          name: nextPortalName,
          url: nextPortalUrl
        });
      }
    } catch {
      if (isMountedRef.current && !isAuto) {
        setAiSearched(true);
        setStatusMsg('Se muestran los enlaces oficiales directos a las bases y al portal institucional de la entidad.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    // Si inicialmente no tiene archivos PDF/Word directos (solo el portal), resolver automáticamente las bases reales desde SERVIR y el portal de la entidad
    const hasInitialFiles = safeInitialDocs.some(d => {
      const low = d.url.toLowerCase();
      return low.includes('.pdf') || low.includes('/anexo-archivo/') || low.includes('format=docx') || low.includes('drive.google.com') || low.includes('descargar_bases');
    });
    if (!hasInitialFiles && !autoResolvedRef.current) {
      autoResolvedRef.current = true;
      handleResolveBases(true);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (prevJobRef.current !== cleanJobTitle) {
      prevJobRef.current = cleanJobTitle;
      autoResolvedRef.current = false;
      const nextSafeDocs = (initialDocuments || []).filter(d => isLegitimateOfficialDoc(d, cleanEntity, targetYear));
      setDocuments(buildRealOfficialList(nextSafeDocs, cleanEntity, canonicalPortalUrl, canonicalPortalName));
      setAiSearched(false);
      setPortalInfo({
        name: decodeHtmlEntities(canonicalPortalName) || cleanEntity,
        url: canonicalPortalUrl && !isCompetitorUrl(canonicalPortalUrl) ? canonicalPortalUrl : ''
      });
      setStatusMsg(null);
    }
  }, [slug, cleanJobTitle, cleanEntity, canonicalPortalUrl, canonicalPortalName, targetYear, initialDocuments]);

  const validDocuments = documents.filter(d => isLegitimateOfficialDoc(d, cleanEntity, targetYear));

  return (
    <div className="p-6 sm:p-8 rounded-2xl space-y-6 border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-950/10 dark:bg-emerald-950/20 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-600 dark:text-emerald-400" size={22} />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Bases Oficiales y Páginas Reales del Concurso
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Archivos oficiales emitidos por <b className="text-slate-900 dark:text-white">{cleanEntity}</b> y enlaces directos a la página oficial donde se encuentran las bases.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold whitespace-nowrap">
            {validDocuments.length} Enlace(s) Oficial(es) Real(es)
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {validDocuments.map((doc, dIdx) => {
          const lowDocUrl = doc.url.toLowerCase();
          const isServirWord = lowDocUrl.includes('format=docx');
          const isPdf =
            lowDocUrl.includes('.pdf') ||
            lowDocUrl.includes('/anexo-archivo/') ||
            lowDocUrl.includes('descargar_bases') ||
            lowDocUrl.includes('descargar_tdr') ||
            lowDocUrl.includes('drive.google.com') ||
            lowDocUrl.includes('docs.google.com');
          const isDoc = isServirWord || lowDocUrl.includes('.doc') || lowDocUrl.includes('.docx') || lowDocUrl.includes('.xlsx');
          const isFile = isPdf || isDoc;

          return (
            <div
              key={dIdx}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${isPdf ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30' :
                    isDoc ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30' :
                      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  }`}>
                  {isPdf ? 'PDF OFICIAL' : isServirWord ? 'WORD SERVIR' : isDoc ? 'ARCHIVO OFICIAL' : 'PÁGINA OFICIAL'}
                </span>
                <div className="min-w-0">
                  <span className="text-slate-900 dark:text-white text-xs sm:text-sm font-semibold block leading-tight">
                    {decodeHtmlEntities(doc.title)}
                  </span>
                  {doc.category && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                      {doc.category} {!doc.url.startsWith('/api/') ? `• ${doc.url}` : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold font-display transition-all flex items-center gap-2 shadow-xs whitespace-nowrap cursor-pointer ${isPdf
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : isDoc
                        ? 'bg-sky-600 hover:bg-sky-700'
                        : 'bg-teal-700 hover:bg-teal-800'
                    }`}
                >
                  {isFile ? <Download size={14} /> : <ExternalLink size={14} />}
                  <span>
                    {isPdf
                      ? 'Abrir / Descargar PDF Oficial'
                      : isServirWord
                        ? 'Descargar Word Oficial SERVIR'
                        : isDoc
                          ? 'Descargar Documento Oficial'
                          : 'Abrir Página Oficial de las Bases'}
                  </span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => handleResolveBases(false)}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-white dark:text-emerald-300 border border-slate-700 dark:border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Verificando bases oficiales en SERVIR y portal institucional...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>{aiSearched ? 'Actualizar Enlaces Oficiales Verificados' : 'Verificar Bases Oficiales y Portal en Tiempo Real'}</span>
            </>
          )}
        </button>

        {portalInfo.url && (
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span className="truncate max-w-[240px] sm:max-w-xs">Página oficial: <b>{portalInfo.name}</b></span>
            </span>
            <a
              href={portalInfo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              <span>Abrir página</span>
              <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
