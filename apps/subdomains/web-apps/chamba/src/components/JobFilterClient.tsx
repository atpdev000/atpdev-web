"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search, RotateCcw, Award, MapPin, GraduationCap, ArrowUpDown, CheckCircle2, X, SlidersHorizontal, ChevronDown, Briefcase } from "lucide-react";

interface JobFilterClientProps {
  initialQ: string;
  initialRegion: string;
  initialRegimen: string;
  initialCategoria: string;
  initialEducacion: string;
  initialSueldo?: string;
  initialSort?: string;
  initialHideExpired?: boolean;
}

export function JobFilterClient({
  initialQ,
  initialRegion,
  initialRegimen,
  initialCategoria,
  initialEducacion,
  initialSueldo = "",
  initialSort = "ending_soon",
  initialHideExpired = true,
}: JobFilterClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initialQ);
  const [region, setRegion] = useState(initialRegion);
  const [regimen, setRegimen] = useState(initialRegimen);
  const [categoria, setCategoria] = useState(initialCategoria);
  const [educacion, setEducacion] = useState(initialEducacion);
  const [sueldo, setSueldo] = useState(initialSueldo);
  const [sort, setSort] = useState(initialSort);
  const [hideExpired, setHideExpired] = useState(initialHideExpired);

  // Synchronize state if props change from URL navigation (skip initial mount)
  const isInitialPropsSync = useRef(true);
  useEffect(() => {
    if (isInitialPropsSync.current) {
      isInitialPropsSync.current = false;
      return;
    }
    setQ(initialQ);
    setRegion(initialRegion);
    setRegimen(initialRegimen);
    setCategoria(initialCategoria);
    setEducacion(initialEducacion);
    setSueldo(initialSueldo);
    setSort(initialSort);
    setHideExpired(initialHideExpired);
  }, [initialQ, initialRegion, initialRegimen, initialCategoria, initialEducacion, initialSueldo, initialSort, initialHideExpired]);

  const applyFilters = (customParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    const currentQ = customParams?.q !== undefined ? customParams.q : q;
    const currentRegion = customParams?.region !== undefined ? customParams.region : region;
    const currentRegimen = customParams?.regimen !== undefined ? customParams.regimen : regimen;
    const currentCategoria = customParams?.categoria !== undefined ? customParams.categoria : categoria;
    const currentEducacion = customParams?.educacion !== undefined ? customParams.educacion : educacion;
    const currentSueldo = customParams?.sueldo !== undefined ? customParams.sueldo : sueldo;
    const currentSort = customParams?.sort !== undefined ? customParams.sort : sort;
    const currentHide = customParams?.hide_expired !== undefined ? customParams.hide_expired : String(hideExpired);

    if (currentQ.trim()) params.set("q", currentQ.trim());
    if (currentRegion) params.set("region", currentRegion);
    if (currentRegimen) params.set("regimen", currentRegimen);
    if (currentCategoria) params.set("categoria", currentCategoria);
    if (currentEducacion) params.set("educacion", currentEducacion);
    if (currentSueldo) params.set("sueldo", currentSueldo);
    if (currentSort && currentSort !== "ending_soon") params.set("sort", currentSort);
    if (currentHide === "false") params.set("hide_expired", "false");

    startTransition(() => {
      router.push(`/empleos?${params.toString()}`);
    });
  };

  // Debounced live search for keyword input
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (q !== initialQ) {
        applyFilters({ q });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [q]);

  const handleReset = () => {
    setQ("");
    setRegion("");
    setRegimen("");
    setCategoria("");
    setEducacion("");
    setSueldo("");
    setSort("ending_soon");
    setHideExpired(true);
    startTransition(() => {
      router.push("/empleos");
    });
  };

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const hasAdvancedFilters = Boolean(region || categoria || educacion || sueldo || sort !== "ending_soon" || !hideExpired);

  const hasActiveFilters = Boolean(
    q || region || regimen || categoria || educacion || sueldo || sort !== "ending_soon" || !hideExpired
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Filter size={16} />
          </div>
          <span>Filtros de Búsqueda</span>
          {isPending && (
            <span className="w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin ml-1.5 inline-block" />
          )}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer transition-colors px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:border-amber-500/40"
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={12} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Quick Pills for 1-Click Filtering */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Filtros Rápidos</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              const next = regimen === "CAS 1057" ? "" : "CAS 1057";
              setRegimen(next);
              applyFilters({ regimen: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              regimen === "CAS 1057"
                ? "bg-amber-50 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 shadow-sm"
                : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            CAS
          </button>
          <button
            type="button"
            onClick={() => {
              const next = regimen === "D.L. 728" ? "" : "D.L. 728";
              setRegimen(next);
              applyFilters({ regimen: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              regimen === "D.L. 728"
                ? "bg-emerald-50 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50 shadow-sm"
                : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            728
          </button>
          <button
            type="button"
            onClick={() => {
              const next = region === "Lima" ? "" : "Lima";
              setRegion(next);
              applyFilters({ region: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              region === "Lima"
                ? "bg-purple-50 dark:bg-purple-500/25 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/50 shadow-sm"
                : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Lima
          </button>
          <button
            type="button"
            onClick={() => {
              const next = sueldo === "3000-6000" ? "" : "3000-6000";
              setSueldo(next);
              applyFilters({ sueldo: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              sueldo === "3000-6000"
                ? "bg-cyan-50 dark:bg-cyan-500/25 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/50 shadow-sm"
                : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            S/. 3K+
          </button>
        </div>
      </div>

      {/* Instant Feedback Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 rounded-xl text-[11px] font-mono text-emerald-800 dark:text-emerald-300 shadow-sm">
        <span className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{isPending ? "Actualizando resultados..." : "Filtro dinámico activo"}</span>
        </span>
        {isPending && <span className="animate-spin text-xs">⏳</span>}
      </div>

      {/* Text Query Filter (Debounced) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Palabra Clave</span>
          {q && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Buscando</span>}
        </label>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Ej. SUNAT, Sistemas, Salud..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters({ q });
              }
            }}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                applyFilters({ q: "" });
              }}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Accordion Toggle for Advanced Filters */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center justify-between transition-all cursor-pointer ${
            hasAdvancedFilters || isMobileExpanded
              ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-sm"
              : "bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Filtros avanzados (Región, Sueldo, Nivel)</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            {hasAdvancedFilters && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                Activos
              </span>
            )}
            <ChevronDown size={15} className={`transition-transform duration-200 ${isMobileExpanded ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>

      {/* Advanced Dropdowns (Always open on desktop lg:block, collapsible on mobile) */}
      <div className={`space-y-5 ${isMobileExpanded ? "block" : "hidden lg:block"}`}>
        {/* Ordenar Convocatorias (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ArrowUpDown size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Ordenar Resultados</span>
          </label>
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              applyFilters({ sort: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
          >
            <option value="ending_soon" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🕒 Próximas a cerrar (Urgentes)</option>
            <option value="recent" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🚀 Más recientes (Nuevas)</option>
            <option value="salary_desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">💰 Mayor salario (Sueldo alto)</option>
            <option value="vacancies_desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👥 Convocatorias masivas (Más vacantes)</option>
          </select>
        </div>

        {/* Toggle Ocultar Convocatorias Finalizadas (Instant Auto-Apply) */}
        <label 
          htmlFor="hide-expired-chk"
          className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all"
        >
          <div className="space-y-0.5 select-none">
            <span className="text-xs font-display font-bold text-slate-800 dark:text-slate-200 block">
              Ocultar Vencidas
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              {hideExpired ? "Solo ofertas activas" : "Mostrando activas y concluidas"}
            </span>
          </div>
          <input
            id="hide-expired-chk"
            type="checkbox"
            checked={hideExpired}
            onChange={(e) => {
              const checked = e.target.checked;
              setHideExpired(checked);
              applyFilters({ hide_expired: checked ? "true" : "false" });
            }}
            className="w-4 h-4 rounded border-gray-400 dark:border-gray-700 bg-white dark:bg-slate-800 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer accent-emerald-500"
          />
        </label>

        {/* Régimen Laboral Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Régimen Laboral</span>
          </label>
          <select
            value={regimen}
            onChange={(e) => {
              const val = e.target.value;
              setRegimen(val);
              applyFilters({ regimen: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todos los Regímenes</option>
            <option value="CAS 1057" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">CAS (D.L. 1057)</option>
            <option value="D.L. 728" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">D.L. 728 (Planilla Privada/Pública)</option>
            <option value="D.L. 276" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">D.L. 276 (Carrera Administrativa)</option>
            <option value="Locación / FAG" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Locación / FAG</option>
            <option value="Privado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sector Privado</option>
            <option value="Prácticas" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Prácticas Pre/Profesionales</option>
          </select>
        </div>

        {/* Especialidad / Categoría Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Área Profesional / Especialidad</span>
          </label>
          <select
            value={categoria}
            onChange={(e) => {
              const val = e.target.value;
              setCategoria(val);
              applyFilters({ categoria: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todas las Especialidades</option>
            <option value="Administración y Gestión Pública" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Administración y Gestión Pública</option>
            <option value="Tecnología e Informática" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tecnología e Informática</option>
            <option value="Salud y Medicina" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Salud y Medicina</option>
            <option value="Educación y Docencia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Educación y Docencia</option>
            <option value="Derecho y Asesoría Legal" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Derecho y Asesoría Legal</option>
            <option value="Contabilidad y Finanzas" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Contabilidad y Finanzas</option>
            <option value="Ingeniería y Construcción" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ingeniería y Construcción</option>
            <option value="Atención al Ciudadano y Operativo" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Atención al Ciudadano y Operativo</option>
            <option value="Logística y Contrataciones del Estado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Logística y Abastecimiento (OSCE)</option>
            <option value="Seguridad y Vigilancia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Seguridad y Vigilancia</option>
            <option value="Servicios Generales y Mantenimiento" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Servicios Generales / Choferes</option>
          </select>
        </div>

        {/* Región Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Región / Departamento</span>
          </label>
          <select
            value={region}
            onChange={(e) => {
              const val = e.target.value;
              setRegion(val);
              applyFilters({ region: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todas las Regiones (25 Departamentos)</option>
            <option value="Amazonas" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Amazonas</option>
            <option value="Áncash" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Áncash</option>
            <option value="Apurímac" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Apurímac</option>
            <option value="Arequipa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Arequipa</option>
            <option value="Ayacucho" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ayacucho</option>
            <option value="Cajamarca" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cajamarca</option>
            <option value="Callao" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Callao</option>
            <option value="Cusco" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cusco</option>
            <option value="Huancavelica" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Huancavelica</option>
            <option value="Huánuco" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Huánuco</option>
            <option value="Ica" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ica</option>
            <option value="Junín" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Junín</option>
            <option value="La Libertad" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">La Libertad</option>
            <option value="Lambayeque" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lambayeque</option>
            <option value="Lima" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Lima & Callao</option>
            <option value="Loreto" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Loreto</option>
            <option value="Madre de Dios" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Madre de Dios</option>
            <option value="Moquegua" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Moquegua</option>
            <option value="Pasco" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pasco</option>
            <option value="Piura" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Piura</option>
            <option value="Puno" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Puno</option>
            <option value="San Martín" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">San Martín</option>
            <option value="Tacna" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tacna</option>
            <option value="Tumbes" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tumbes</option>
            <option value="Ucayali" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ucayali</option>
            <option value="Nacional / Remoto" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Nacional / Remoto</option>
          </select>
        </div>

        {/* Nivel Educativo Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-cyan-600 dark:text-cyan-400" />
            <span>Nivel Educativo</span>
          </label>
          <select
            value={educacion}
            onChange={(e) => {
              const val = e.target.value;
              setEducacion(val);
              applyFilters({ educacion: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todos los Niveles</option>
            <option value="Secundaria" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Secundaria</option>
            <option value="Técnico" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Técnico</option>
            <option value="Egresado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Egresado</option>
            <option value="Bachiller" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bachiller</option>
            <option value="Titulado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Titulado</option>
            <option value="Maestría / Doctorado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Maestría / Doctorado</option>
          </select>
        </div>

        {/* Rango de Sueldo Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">S/</span>
            <span>Rango de Remuneración</span>
          </label>
          <select
            value={sueldo}
            onChange={(e) => {
              const val = e.target.value;
              setSueldo(val);
              applyFilters({ sueldo: val });
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Todas las Remuneraciones</option>
            <option value="1000-3000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">S/ 1,025 — S/ 3,000 (Técnicos & Asistentes)</option>
            <option value="3000-6000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">S/ 3,000 — S/ 6,000 (Especialistas & Analistas)</option>
            <option value="6000-15000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">S/ 6,000+ (Jefaturas, FAG y Consultores)</option>
          </select>
        </div>
      </div>

      {/* Action Footer: Reset */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold font-display text-xs transition-all border border-slate-200 dark:border-white/15 hover:border-amber-500/40 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <RotateCcw size={13} className="text-amber-500 dark:text-amber-400" />
          <span>Restablecer Filtros</span>
        </button>
      )}
    </div>
  );
}
