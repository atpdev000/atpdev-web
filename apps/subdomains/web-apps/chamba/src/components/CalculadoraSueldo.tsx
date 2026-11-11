'use client';

import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, Award, Info, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export function CalculadoraSueldo() {
  const [sueldoBruto, setSueldoBruto] = useState<number>(4500);
  const [regimen, setRegimen] = useState<'CAS' | '728' | '276' | 'Locacion'>('CAS');
  const [pension, setPension] = useState<'AFP' | 'ONP' | 'Ninguno'>('AFP');
  const [afpType, setAfpType] = useState<'Integra' | 'Prima' | 'Profuturo' | 'Habitat'>('Integra');

  // Constantes Tributarias Perú 2026
  const UIT = 5150; // UIT proyectada 2026
  const DEDUCCION_7_UIT = 7 * UIT; // S/ 36,050

  // 1. Descuento de Pensiones
  let pctPension = 0;
  if (pension === 'ONP') {
    pctPension = 0.13; // 13%
  } else if (pension === 'AFP') {
    // Promedio AFP (Aporte 10% + Seguro 1.84% + Comisión ~1.0%)
    if (afpType === 'Habitat') pctPension = 0.1284;
    else if (afpType === 'Prima') pctPension = 0.1285;
    else if (afpType === 'Integra') pctPension = 0.1280;
    else pctPension = 0.1290; // Profuturo
  }

  const descuentoPension = regimen === 'Locacion' ? 0 : sueldoBruto * pctPension;

  // 2. Impuesto a la Renta de 5ta Categoría (Planilla / CAS / 728) o 4ta (Locación)
  let impuestoRentaMensual = 0;

  if (regimen === 'Locacion') {
    // 4ta Categoría: Retención del 8% si supera S/ 1,500
    if (sueldoBruto > 1500) {
      impuestoRentaMensual = sueldoBruto * 0.08;
    }
  } else {
    // 5ta Categoría
    const mesesAnual = regimen === '728' ? 14 : 12; // 728 incluye 2 gratificaciones completas
    const ingresoAnualBruto = sueldoBruto * mesesAnual;
    const baseImponible = Math.max(0, ingresoAnualBruto - DEDUCCION_7_UIT);

    let impuestoAnual = 0;
    if (baseImponible > 0) {
      const tramo1 = Math.min(baseImponible, 5 * UIT); // Hasta 5 UIT (8%)
      impuestoAnual += tramo1 * 0.08;

      if (baseImponible > 5 * UIT) {
        const tramo2 = Math.min(baseImponible - 5 * UIT, 15 * UIT); // De 5 a 20 UIT (14%)
        impuestoAnual += tramo2 * 0.14;
      }
      if (baseImponible > 20 * UIT) {
        const tramo3 = Math.min(baseImponible - 20 * UIT, 15 * UIT); // De 20 a 35 UIT (17%)
        impuestoAnual += tramo3 * 0.17;
      }
    }
    impuestoRentaMensual = impuestoAnual / mesesAnual;
  }

  // 3. Sueldo Neto Líquido
  const sueldoNeto = Math.max(0, sueldoBruto - descuentoPension - impuestoRentaMensual);

  // 4. Estimación de Beneficios Anuales según Régimen
  let gratificacionJulio = 0;
  let gratificacionDiciembre = 0;
  let ctsAnual = 0;
  let vacacionesDias = 30;

  if (regimen === 'CAS') {
    gratificacionJulio = 300; // Aguinaldo Fiesticostas CAS
    gratificacionDiciembre = 300; // Aguinaldo Navidad CAS
    ctsAnual = 0; // CAS no contempla CTS
    vacacionesDias = 30;
  } else if (regimen === '728') {
    gratificacionJulio = sueldoBruto * 1.09; // Sueldo + 9% Bonificación EsSalud
    gratificacionDiciembre = sueldoBruto * 1.09;
    ctsAnual = sueldoBruto * 1.1666; // 1 sueldo anual aprox de CTS + 1/6 grata
    vacacionesDias = 30;
  } else if (regimen === '276') {
    gratificacionJulio = 300;
    gratificacionDiciembre = 300;
    ctsAnual = 50 * 30; // Montos fijos según ley 276
    vacacionesDias = 30;
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
            <Calculator size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Calculadora de Sueldo Neto & Beneficios
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cálculo según marco normativo peruano (D.L. 1057 CAS, D.L. 728, D.L. 276 y Locación de Servicios)
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>UIT de Referencia: S/ {UIT.toLocaleString()}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 space-y-6">
          {/* Sueldo Bruto Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>Sueldo Bruto Mensual (PEN)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">S/ {sueldoBruto.toLocaleString()}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-lg">S/</span>
              <input
                type="number"
                value={sueldoBruto}
                onChange={(e) => setSueldoBruto(Math.max(0, Number(e.target.value)))}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors shadow-sm"
                placeholder="4500"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[2000, 3500, 5000, 7500, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSueldoBruto(val)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    sueldoBruto === val
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  S/ {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Régimen Laboral */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Régimen Laboral
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'CAS', label: 'CAS 1057', badge: 'Sector Público' },
                { key: '728', label: 'D.L. 728', badge: 'Planilla Priv./Púb.' },
                { key: '276', label: 'D.L. 276', badge: 'Carrera Adm.' },
                { key: 'Locacion', label: 'Locación (RHO)', badge: 'Honorarios' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRegimen(item.key as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    regimen === item.key
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-slate-900 dark:text-white">{item.label}</span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block mt-0.5">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sistema de Pensiones (AFP / ONP) */}
          {regimen !== 'Locacion' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                Sistema de Pensiones
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['AFP', 'ONP', 'Ninguno'].map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setPension(sys as any)}
                    className={`py-2.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                      pension === sys
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sys} {sys === 'ONP' ? '(13%)' : sys === 'AFP' ? '(~12.8%)' : ''}
                  </button>
                ))}
              </div>

              {pension === 'AFP' && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">Administradora AFP:</span>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
                    {(['Integra', 'Prima', 'Profuturo', 'Habitat'] as const).map((afp) => (
                      <button
                        key={afp}
                        type="button"
                        onClick={() => setAfpType(afp)}
                        className={`py-1.5 rounded-lg border transition-all ${
                          afpType === afp
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {afp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Calculation Output Card */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Net Result Box */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-lg relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Estimación de Sueldo Neto Líquido
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono font-medium">
                Mensual en Cuenta
              </span>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                S/ {Math.round(sueldoNeto).toLocaleString()}
                <span className="text-sm font-sans text-slate-400 font-normal ml-2">/ mes</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Monto líquido estimado abonado directamente a tu cuenta bancaria.
              </p>
            </div>

            {/* Deductions Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>(+) Sueldo Bruto Contratado:</span>
                <span className="font-bold text-white">S/ {sueldoBruto.toLocaleString()}</span>
              </div>
              {regimen !== 'Locacion' && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>(-) Fondo de Pensiones ({pension} {(pctPension * 100).toFixed(1)}%):</span>
                  <span className="font-bold">- S/ {Math.round(descuentoPension).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sky-300">
                <span>
                  (-) Impuesto Renta ({regimen === 'Locacion' ? '4ta Cat. 8%' : '5ta Cat. Progresivo'}):
                </span>
                <span className="font-bold">- S/ {Math.round(impuestoRentaMensual).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Annual Labor Benefits Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Award className="text-amber-500 dark:text-amber-400" size={18} />
              <span>Beneficios de Ley según Régimen {regimen}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">AGUINALDO / GRATIFICACIÓN</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                  {gratificacionJulio > 0 ? `S/ ${Math.round(gratificacionJulio).toLocaleString()} (x2 al año)` : 'No aplica'}
                </span>
                <span className="text-[10px] text-slate-500 block">Julio y Diciembre</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">CTS (COMPENSACIÓN)</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-sm block">
                  {ctsAnual > 0 ? `S/ ${Math.round(ctsAnual).toLocaleString()} / año` : 'No aplica en CAS'}
                </span>
                <span className="text-[10px] text-slate-500 block">Mayo y Noviembre</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">VACACIONES REMUNERADAS</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block">{vacacionesDias} Días Calendario</span>
                <span className="text-[10px] text-slate-500 block">Por cada año de servicios</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">COBERTURA DE SALUD</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">EsSalud 9%</span>
                <span className="text-[10px] text-slate-500 block">Aporte patronal obligatorio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
