'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, ExternalLink, ShieldCheck, GraduationCap, 
  Briefcase, Banknote, Search, Download 
} from 'lucide-react';
import type { Plaza } from '@atpdev/database';
import { isCompetitorUrl, decodeHtmlEntities, cleanEntityDisplayName } from '@/lib/entityUtils';

interface PlazasListProps {
  slug?: string;
  plazas: Plaza[];
  entityName: string;
  defaultApplyUrl?: string;
  globalBasesPdfUrl?: string;
  anexosUrl?: string;
}

export function PlazasList({
  slug,
  plazas,
  entityName,
  defaultApplyUrl,
  globalBasesPdfUrl,
  anexosUrl,
}: PlazasListProps) {
  const [filter, setFilter] = useState('');
  const cleanEntity = cleanEntityDisplayName(entityName) || decodeHtmlEntities(entityName) || entityName;
  const internalServirWordUrl = slug ? `/api/bases-doc/${encodeURIComponent(slug)}?format=docx` : undefined;

  const cleanedPlazas = useMemo(() => {
    if (!plazas) return [];
    return plazas.map(p => {
      let cleanUrl = p.bases_url;
      if (cleanUrl && (isCompetitorUrl(cleanUrl) || cleanUrl.startsWith('/api/bases-doc/'))) {
        cleanUrl = globalBasesPdfUrl || (defaultApplyUrl && !isCompetitorUrl(defaultApplyUrl) ? defaultApplyUrl : undefined);
      }
      return {
        ...p,
        cas_code: decodeHtmlEntities(p.cas_code) || p.cas_code,
        title: decodeHtmlEntities(p.title) || p.title,
        education: decodeHtmlEntities(p.education) || p.education,
        experience: decodeHtmlEntities(p.experience) || p.experience,
        bases_url: cleanUrl,
      };
    });
  }, [plazas, defaultApplyUrl, globalBasesPdfUrl]);

  const filteredPlazas = useMemo(() => {
    if (!filter.trim()) return cleanedPlazas;
    const q = filter.toLowerCase().trim();
    return cleanedPlazas.filter(p => {
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchCas = p.cas_code?.toLowerCase().includes(q);
      const matchEdu = p.education?.toLowerCase().includes(q);
      const matchExp = p.experience?.toLowerCase().includes(q);
      return matchTitle || matchCas || matchEdu || matchExp;
    });
  }, [cleanedPlazas, filter]);

  if (!plazas || plazas.length === 0) return null;

  const realGlobalPdf = (globalBasesPdfUrl && globalBasesPdfUrl.startsWith('http') && !isCompetitorUrl(globalBasesPdfUrl))
    ? globalBasesPdfUrl
    : undefined;
  const realPortalUrl = (defaultApplyUrl && defaultApplyUrl.startsWith('http') && !isCompetitorUrl(defaultApplyUrl))
    ? defaultApplyUrl
    : undefined;
  const realAnexosUrl = (anexosUrl && anexosUrl.startsWith('http') && !isCompetitorUrl(anexosUrl))
    ? anexosUrl
    : undefined;

  return (
    <div id="plazas-convocadas" className="p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-xs scroll-mt-24">
      {/* Header with Title and Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Plazas Convocadas y Bases Oficiales</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Requisitos mínimos registrados por la entidad, remuneración y enlaces reales a las bases oficiales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold whitespace-nowrap">
            {cleanedPlazas.length} Plaza(s) Registrada(s)
          </span>
        </div>
      </div>

      {/* Quick Access Official Document Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Bases oficiales y portal real de <b className="text-slate-900 dark:text-white">{cleanEntity}</b>:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {realGlobalPdf && (
            <a
              href={realGlobalPdf}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <FileText size={13} />
              <span>Descargar Bases Oficiales (PDF)</span>
              <ExternalLink size={11} />
            </a>
          )}
          {realAnexosUrl && (
            <a
              href={realAnexosUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Descargar Anexos Oficiales (PDF)</span>
              <ExternalLink size={11} />
            </a>
          )}
          {realPortalUrl && (
            <a
              href={realPortalUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Ir a la Página Oficial de las Bases</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {/* Filter Input if more than 3 plazas */}
      {cleanedPlazas.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar por puesto, especialidad (Derecho, Administración, Contabilidad) o código CAS..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {filter && (
            <button
              onClick={() => setFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Plazas Cards Grid */}
      <div className="space-y-3.5">
        {filteredPlazas.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            No se encontraron plazas con el filtro especificado.
          </div>
        ) : (
          filteredPlazas.map((plaza, idx) => {
            const candidateBases = (plaza.bases_url && plaza.bases_url.startsWith('http') && !isCompetitorUrl(plaza.bases_url)) 
              ? plaza.bases_url 
              : undefined;
            const rawUrl = candidateBases || realGlobalPdf || realPortalUrl;
            const lowPlazaUrl = (rawUrl || '').toLowerCase();
            const isDirectExternalDoc = (
              lowPlazaUrl.includes('.pdf') ||
              lowPlazaUrl.includes('drive.google.com') ||
              lowPlazaUrl.includes('docs.google.com') ||
              lowPlazaUrl.includes('archivos.mpfn.gob.pe') ||
              lowPlazaUrl.includes('/anexo-archivo/') ||
              lowPlazaUrl.includes('descargar_tdr') ||
              lowPlazaUrl.includes('descargar_bases') ||
              lowPlazaUrl.includes('download') ||
              lowPlazaUrl.includes('.docx') ||
              lowPlazaUrl.includes('.doc')
            );

            const directDocHref = isDirectExternalDoc && rawUrl
              ? (rawUrl.includes('drive.google.com/file/d/')
                  ? rawUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                  : rawUrl)
              : undefined;

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 transition-colors space-y-3.5 shadow-2xs"
              >
                {/* Plaza Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {plaza.cas_code && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shrink-0">
                          {plaza.cas_code}
                        </span>
                      )}
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug">
                        {plaza.title}
                      </h4>
                    </div>
                  </div>

                  {/* Remuneración & Vacantes Tags */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {plaza.vacancies && plaza.vacancies > 1 && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold shrink-0">
                        {plaza.vacancies} vacantes
                      </span>
                    )}
                    {plaza.salary && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0 flex items-center gap-1">
                        <Banknote size={13} />
                        <span>{plaza.salary}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Requirements details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {plaza.education && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wide">
                        <GraduationCap size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Formación Académica</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                        {plaza.education}
                      </p>
                    </div>
                  )}

                  {plaza.experience && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wide">
                        <Briefcase size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Experiencia Laboral</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                        {plaza.experience}
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Action Link for Official PDF bases & Official Portal */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Convocatoria oficial de {cleanEntity}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {directDocHref && (
                      <a
                        href={directDocHref}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText size={13} />
                        <span>Descargar Bases Oficiales (PDF)</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {internalServirWordUrl && slug?.startsWith('servir-') && (
                      <a
                        href={internalServirWordUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-800 dark:text-sky-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Word Oficial SERVIR (.docx)</span>
                      </a>
                    )}

                    {/* Botón TDR específico para convocatorias MINEDU */}
                    {rawUrl && rawUrl.includes('postulacioncas.minedu.gob.pe') && rawUrl.includes('idReq=') && (
                      <a
                        href={rawUrl.replace(/Descargar_Bases/i, 'Descargar_Tdr')}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>Ver TDR Oficial (PDF)</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {/* Botón para abrir la página oficial donde se encuentran las bases */}
                    {(() => {
                      const mineduIdMatch = rawUrl?.match(/idReq=(\d+)/i);
                      const targetPortalUrl = mineduIdMatch
                        ? `https://postulacioncas.minedu.gob.pe/PostulacionCas/Home/Convocatoria/${mineduIdMatch[1]}`
                        : realPortalUrl;

                      if (!targetPortalUrl) return null;

                      return (
                        <a
                          href={targetPortalUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{mineduIdMatch ? 'Convocatoria Oficial MINEDU' : 'Ir a la Página Oficial de las Bases'}</span>
                          <ExternalLink size={11} />
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
