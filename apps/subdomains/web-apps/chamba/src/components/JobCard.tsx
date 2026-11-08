import Link from "next/link";
import { JobPosting, isCompetitorUrl } from "@atpdev/database";
import { ShieldCheck, MapPin, Users, GraduationCap, ArrowRight, FileText } from "lucide-react";
import { EntityLogo } from "@/components/EntityLogo";
import { JobCountdownClock } from "@/components/JobCountdownClock";

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  const rawBases = (job.bases_pdf_url && job.bases_pdf_url.startsWith('http') && !isCompetitorUrl(job.bases_pdf_url))
    ? job.bases_pdf_url
    : job.plazas?.find(p => p.bases_url && p.bases_url.startsWith('http') && !isCompetitorUrl(p.bases_url) && (
        p.bases_url.toLowerCase().includes('.pdf') ||
        p.bases_url.includes('drive.google.com') ||
        p.bases_url.includes('docs.google.com')
      ))?.bases_url;

  const isDirectBases = Boolean(
    rawBases && (
      rawBases.toLowerCase().includes('.pdf') ||
      rawBases.includes('drive.google.com') ||
      rawBases.includes('docs.google.com')
    )
  );

  return (
    <div className="p-5 sm:p-6 rounded-xl flex flex-col justify-between gap-5 relative group overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-md">
      {/* Top Banner & Entity Header */}
      <Link
        href={`/empleos/${job.slug}`}
        className="block group/entity"
        aria-label={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
        title={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
      >
        <div className="rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group-hover/entity:border-emerald-500/40 transition-all">
          <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="banner" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-2.5 px-0.5">
          <span className="block text-xs font-display font-bold text-slate-800 dark:text-slate-200 group-hover/entity:text-emerald-600 dark:group-hover/entity:text-emerald-400 transition-colors truncate">
            {job.entity_name}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isDirectBases ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-md shadow-sm" title="Bases oficiales en PDF disponibles">
                <FileText size={10} className="text-emerald-600 dark:text-emerald-400" />
                <span>PDF Bases</span>
              </span>
            ) : (
              job.entity_verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-1.5 py-0.5 rounded" title="RUC y entidad oficial verificada">
                  <ShieldCheck size={11} />
                  <span>Verificado</span>
                </span>
              )
            )}
          </div>
        </div>
      </Link>

      <div className="space-y-3.5">
        {/* Meta Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono">
            <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{job.region}</span>
          </div>

          {/* Regime Pill */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border flex-shrink-0 shadow-sm ${
              job.sector_type === 'CAS 1057' 
                ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40' 
                : job.sector_type === 'D.L. 728' 
                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40' 
                : 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/40'
            }`}>
              {job.sector_type}
            </span>
          </div>
        </div>

        {/* Position Title Link */}
        <Link
          href={`/empleos/${job.slug}`}
          className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors"
          aria-label={`Ver convocatoria para ${job.title}`}
        >
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:translate-x-0.5 transition-transform group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
            {job.title}
          </h3>
        </Link>

        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span className="salary-pill px-3 py-1 rounded-xl font-extrabold flex items-center gap-1.5 shadow-sm">
            {job.salary_text}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Users size={13} className="text-slate-500 dark:text-slate-400" />
            <span>{job.vacancies_count} vacante{job.vacancies_count > 1 ? 's' : ''}</span>
          </span>
          {job.plazas && job.plazas.length > 1 && (
            <span className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
              <span>{job.plazas.length} plazas</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap size={13} className="text-slate-500 dark:text-slate-400" />
            <span>{job.education_level}</span>
          </span>
        </div>
      </div>

      {/* Footer Row with countdown and single clear Details CTA */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
        {/* Dynamic Countdown Clock (Green, Orange, Red, Blue) */}
        <JobCountdownClock endDate={job.end_date} status={job.status} size="sm" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDirectBases && rawBases && (
            <a
              href={rawBases}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 font-bold font-mono text-xs transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700 hover:border-emerald-400/50 shadow-xs"
              title="Abrir o descargar documento oficial de bases"
            >
              <FileText size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Bases</span>
            </a>
          )}
          <Link
            href={`/empleos/${job.slug}`}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn cursor-pointer shadow-xs"
            aria-label={`Ver detalles, bases y requisitos de ${job.title}`}
          >
            <span>Ver Convocatoria</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
