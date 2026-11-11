"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Building2, TrendingUp, ShieldCheck, FileCheck2, ArrowRight } from "lucide-react";
import type { SubdomainBranding } from "@atpdev/database";

interface JobSearchHeroProps {
  totalJobs: number;
  totalVacancies: number;
  branding?: SubdomainBranding;
  accentColor?: string;
}

export function JobSearchHero({ totalJobs, totalVacancies, branding }: JobSearchHeroProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("region", region);
    startTransition(() => {
      router.push(`/empleos?${params.toString()}`);
    });
  };

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070a12] transition-colors duration-200">
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Verification and Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{branding?.hero_badge || "Portal de Convocatorias y Empleo en el Perú"}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs">
            <Building2 size={13} className="text-slate-500 dark:text-slate-400" />
            <span>Bases Oficiales SERVIR • Gob.pe • Empresas Verificadas</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-3.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            {branding?.hero_title_prefix ? (
              <>
                {branding.hero_title_prefix}{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {branding.hero_title_highlight || "Chamba Pro"}
                </span>{" "}
                en Perú
              </>
            ) : (
              <>
                Bolsa de Trabajo y Convocatorias <span className="text-emerald-600 dark:text-emerald-400">Oficiales</span> en el Perú
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal text-pretty">
            {branding?.hero_description || (
              <>
                Convocatorias del Estado (<strong className="font-semibold text-slate-900 dark:text-white">CAS 1057, D.L. 728, 276</strong>) y vacantes del sector privado en las 25 regiones. Acceso libre a bases oficiales en PDF y postulación directa sin intermediarios.
              </>
            )}
          </p>
        </div>

        {/* Live Search Engine Bar */}
        <form onSubmit={handleSearch} className="p-2 sm:p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/90 shadow-sm sm:flex items-center gap-2 transition-all">
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus-within:border-emerald-500 transition-colors">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <label htmlFor="search-input" className="sr-only">Puesto, profesión o institución</label>
            <input
              id="search-input"
              aria-label="Puesto, profesión o institución"
              type="text"
              placeholder="Puesto, profesión o institución (ej. Abogado, SUNAT, Administrador)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white sm:w-56 focus-within:border-emerald-500 transition-colors mt-2 sm:mt-0">
            <MapPin size={18} className="text-slate-400 flex-shrink-0" />
            <label htmlFor="search-region-select" className="sr-only">Departamento o región</label>
            <select
              id="search-region-select"
              aria-label="Departamento o región"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Todas las Regiones (25 Dept.)</option>
              <option value="Amazonas" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Amazonas</option>
              <option value="Áncash" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Áncash</option>
              <option value="Apurímac" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Apurímac</option>
              <option value="Arequipa" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Arequipa</option>
              <option value="Ayacucho" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Ayacucho</option>
              <option value="Cajamarca" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Cajamarca</option>
              <option value="Callao" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Callao</option>
              <option value="Cusco" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Cusco</option>
              <option value="Huancavelica" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Huancavelica</option>
              <option value="Huánuco" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Huánuco</option>
              <option value="Ica" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Ica</option>
              <option value="Junín" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Junín</option>
              <option value="La Libertad" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">La Libertad</option>
              <option value="Lambayeque" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Lambayeque</option>
              <option value="Lima" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Lima & Callao</option>
              <option value="Loreto" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Loreto</option>
              <option value="Madre de Dios" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Madre de Dios</option>
              <option value="Moquegua" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Moquegua</option>
              <option value="Pasco" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Pasco</option>
              <option value="Piura" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Piura</option>
              <option value="Puno" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Puno</option>
              <option value="San Martín" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">San Martín</option>
              <option value="Tacna" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Tacna</option>
              <option value="Tumbes" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Tumbes</option>
              <option value="Ucayali" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Ucayali</option>
              <option value="Nacional / Remoto" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Nacional / Remoto</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 disabled:opacity-75 disabled:cursor-wait shadow-sm transition-colors mt-2 sm:mt-0"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Buscar Empleos</span>
              </>
            )}
          </button>
        </form>

        {/* Trending Search Tags Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Búsquedas frecuentes:</span>
          </span>
          {[
            { tag: 'SUNAT', q: 'SUNAT' },
            { tag: 'ONPE', q: 'ONPE' },
            { tag: 'CAS 1057', q: 'CAS' },
            { tag: 'Bachiller', q: 'Bachiller' },
            { tag: 'Poder Judicial', q: 'Poder Judicial' },
            { tag: 'Sueldos S/ 4,000+', q: '4000' },
          ].map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => router.push(`/empleos?q=${encodeURIComponent(item.q)}`)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-xs font-medium shadow-2xs"
            >
              {item.tag}
            </button>
          ))}
        </div>

        {/* Call to action: Evaluador de Convocatorias Oficiales */}
        <div className="pt-1">
          <Link
            href="/match-cv"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] shadow-xs group"
          >
            <FileCheck2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>¿Buscas postular sobre seguro? Coteja tu CV con los requisitos de las bases oficiales</span>
            <span className="font-bold underline flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-emerald-800 dark:text-emerald-200">
              Cotejar mi CV <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        {/* Real Live Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <div
              suppressHydrationWarning
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
            >
              {totalJobs.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Convocatorias Vigentes</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <div
              suppressHydrationWarning
              className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
            >
              {totalVacancies.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Plazas Disponibles</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <div 
              suppressHydrationWarning
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
            >
              25
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Regiones del País</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <div 
              suppressHydrationWarning
              className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
            >
              100%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Gratuito y Oficial</p>
          </div>
        </div>
      </div>
    </div>
  );
}
