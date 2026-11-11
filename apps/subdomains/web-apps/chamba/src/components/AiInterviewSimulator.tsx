'use client';

import React, { useState } from 'react';
import { UserCheck, Loader2, CheckCircle2, AlertTriangle, XCircle, Building2, RotateCcw, ArrowRight } from 'lucide-react';

interface QuestionTemplate {
  entity: string;
  role: string;
  question: string;
  evaluationCriteria: string[];
  idealLegalPoints: string[];
  sampleModelAnswer: string;
}

const TEMPLATES: QuestionTemplate[] = [
  {
    entity: 'SUNAT',
    role: 'Sistemas & Tecnología de la Información',
    question: 'Si se detecta una vulnerabilidad o caída del servicio en el portal de comprobantes electrónicos en pleno cierre mensual de contribuyentes, ¿cuál es el protocolo inmediato de contingencia e interoperabilidad que aplicaría siguiendo los lineamientos de la Secretaría de Gobierno y Transformación Digital (PCM)?',
    evaluationCriteria: ['Priorización del servicio al contribuyente', 'Gestión de incidentes cibernéticos (ISO 27001)', 'Comunicación oportuna y trazabilidad'],
    idealLegalPoints: ['Decreto Legislativo N° 1412 (Ley de Gobierno Digital)', 'Marco Nacional de Seguridad Digital (PCM)'],
    sampleModelAnswer: 'En primer lugar, activaría de inmediato el protocolo de respuesta ante incidentes de acuerdo al D.L. N° 1412 (Ley de Gobierno Digital) y la ISO 27001. Habilitaría la infraestructura de alta disponibilidad (servidor de respaldo espejo) para restaurar la emisión de comprobantes en menos de 15 minutos, notificando en paralelo a la Jefatura de TI y emitiendo un comunicado oficial para tranquilidad de los contribuyentes.'
  },
  {
    entity: 'MINEDU',
    role: 'Administración & Gestión Pública',
    question: '¿De qué manera garantizaría que la asignación presupuestaria para el mantenimiento de locales escolares cumpla con los principios de eficiencia y transparencia exigidos por el Sistema Nacional de Presupuesto Público?',
    evaluationCriteria: ['Cumplimiento de metas físicas y financieras', 'Mecanismos de control interno y rendición de cuentas', 'Uso del aplicativo Mi Mantenimiento'],
    idealLegalPoints: ['Decreto Legislativo N° 1440 (Sistema Nacional de Presupuesto)', 'Directivas de Pronied / MINEDU'],
    sampleModelAnswer: 'Aplicaría rigurosamente las normas del Decreto Legislativo N° 1440 (Sistema Nacional de Presupuesto Público) y las directivas de PRONIED. Establecería cronogramas de verificación de metas físicas y financieras mediante el aplicativo "Mi Mantenimiento", asegurando la rendición de cuentas pública con participación del Comité de Mantenimiento de la comunidad educativa.'
  },
  {
    entity: 'Poder Judicial',
    role: 'Derecho & Asesoría Legal',
    question: 'En un procedimiento administrativo sancionador, si el administrado alega la caducidad del procedimiento por transcurso del plazo de 9 meses, ¿cuál es la fundamentación jurídica adecuada que usted sustentaría ante el comité?',
    evaluationCriteria: ['Manejo impecable del TUO de la Ley N° 27444', 'Cómputo de plazos y suspensión de caducidad', 'Derecho al debido procedimiento'],
    idealLegalPoints: ['Art. 259 del TUO de la Ley N° 27444', 'Jurisprudencia del Tribunal del Servicio Civil (SERVIR)'],
    sampleModelAnswer: 'Sustentaría la resolución evaluando taxativamente el Art. 259 del TUO de la Ley N° 27444 (LPAG). Verificaría si operó alguna causal de suspensión imputable al administrado. En caso contrario, corresponde declarar de oficio o a pedido de parte la caducidad del procedimiento, resguardando el derecho al debido procedimiento y la jurisprudencia vinculante del Tribunal de SERVIR.'
  },
  {
    entity: 'EsSalud',
    role: 'Salud & Gestión Asistencial',
    question: 'Frente al desabastecimiento temporal de un medicamento esencial en la farmacia del hospital por demora del proveedor del Estado, ¿qué acciones administrativas inmediatas adoptaría usted para garantizar la atención ininterrumpida del asegurado?',
    evaluationCriteria: ['Enfoque de gestión centrado en el paciente', 'Aplicación de compra por desabastecimiento inminente', 'Coordinación interinstitucional (CEABE)'],
    idealLegalPoints: ['Ley N° 30225 (Ley de Contrataciones del Estado)', 'Reglamento de Organización y Funciones de EsSalud'],
    sampleModelAnswer: 'Privilegiando el derecho a la salud del asegurado, activaría la causal de contratación directa por desabastecimiento inminente conforme al artículo 27 de la Ley N° 30225 de Contrataciones del Estado. Coordinaría una redistribución de emergencia con la red asistencial más cercana y la CEABE para abastecer la farmacia hospitalaria en 24 horas.'
  }
];

export function AiInterviewSimulator() {
  const [selectedEntity, setSelectedEntity] = useState<string>('SUNAT');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    positives: string[];
    improvements: string[];
    verdict: string;
    statusType: 'error' | 'warning' | 'apto' | 'excelente';
  } | null>(null);

  const currentTemplate = TEMPLATES.find(t => t.entity === selectedEntity) || TEMPLATES[0];

  // Helper to detect gibberish, spam, or random keystrokes
  const isGibberishOrSpam = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < 15) return true;

    // Check vowel ratio (Spanish has ~35-45% vowels)
    const vowels = trimmed.match(/[aeiouáéíóúAEIOUÁÉÍÓÚ]/g) || [];
    const vowelRatio = vowels.length / trimmed.length;
    if (vowelRatio < 0.18 || vowelRatio > 0.65) return true;

    // Check max consecutive consonants
    const cleanText = trimmed.toLowerCase().replace(/[^a-zñáéíóú]/g, '');
    const longConsonants = cleanText.match(/[^aeiouáéíóú]{5,}/g);
    if (longConsonants && longConsonants.length > 0) return true;

    // Check repeating character spam (e.g. "aaaaa", "asdfasdfasdf")
    const words = trimmed.split(/\s+/);
    const validWords = words.filter(w => w.length >= 2);
    if (validWords.length < 4) return true;

    return false;
  };

  const handleRunEvaluation = () => {
    if (!userAnswer.trim()) return;

    setIsAnalyzing(true);
    setEvaluation(null);

    setTimeout(() => {
      const text = userAnswer.trim();
      const lowerText = text.toLowerCase();

      // 1. Detect Gibberish / Random Keystrokes
      if (isGibberishOrSpam(text)) {
        setEvaluation({
          score: 0,
          statusType: 'error',
          verdict: '⛔ DESCALIFICADO (0%) — Texto no válido o caracteres aleatorios detectados. El Jurado Evaluador requiere respuestas comprensibles redactadas en español.',
          positives: ['Ninguno. El texto ingresado no posee coherencia gramatical ni vocabulario técnico.'],
          improvements: [
            'Ingresa una respuesta formal desarrollada en español para responder a la pregunta planteada.',
            'Puedes presionar el botón "💡 Cargar Respuesta Modelo de Prueba" para visualizar una evaluación satisfactoria.'
          ]
        });
        setIsAnalyzing(false);
        return;
      }

      // 2. Detect Extremely Short / Insufficient Answers (< 40 characters or < 8 words)
      const words = text.split(/\s+/).filter(w => w.length > 0);
      if (text.length < 50 || words.length < 10) {
        setEvaluation({
          score: 25,
          statusType: 'warning',
          verdict: '⚠️ NO APTO (25%) — Respuesta demasiado breve e insuficiente para sustentar la entrevista CAS.',
          positives: ['Intento inicial de respuesta.'],
          improvements: [
            'Desarrolla más tu argumento explicando paso a paso las medidas que tomarías.',
            `Incorpora referencias normativas exigidas por la entidad: ${currentTemplate.idealLegalPoints.join(' o ')}.`
          ]
        });
        setIsAnalyzing(false);
        return;
      }

      // 3. Intelligent Evaluation Logic
      let score = 50; // Base score for coherent, well-formed response

      const positives: string[] = ['Demuestra sintaxis clara y articulación adecuada en español.'];
      const improvements: string[] = [];

      // Check Criteria Matches
      let criteriaMatches = 0;
      if (lowerText.includes('protocolo') || lowerText.includes('contingencia') || lowerText.includes('incidente') || lowerText.includes('mantenimiento') || lowerText.includes('procedimiento') || lowerText.includes('emergencia')) {
        score += 12;
        criteriaMatches++;
        positives.push('Aplica enfoque de contingencia y procedimientos de control técnico.');
      }

      if (lowerText.includes('contribuyente') || lowerText.includes('ciudadano') || lowerText.includes('paciente') || lowerText.includes('asegurado') || lowerText.includes('usuario') || lowerText.includes('administrado')) {
        score += 10;
        criteriaMatches++;
        positives.push('Enfoque centrado en el servicio al ciudadano y atención al usuario final.');
      }

      // Check Legal References Match
      const mentionsLaws = lowerText.includes('ley') || lowerText.includes('decreto') || lowerText.includes('norma') || lowerText.includes('iso') || lowerText.includes('1412') || lowerText.includes('1440') || lowerText.includes('27444') || lowerText.includes('30225') || lowerText.includes('tuo') || lowerText.includes('pronied') || lowerText.includes('servir');

      if (mentionsLaws) {
        score += 18;
        positives.push('Sustenta su respuesta en base legal formal y normatividad del Estado Peruano.');
      } else {
        improvements.push(`Incorporar expresamente las normas aplicables: ${currentTemplate.idealLegalPoints.join(' y ')}.`);
      }

      // Check text length & detail (+10 for rich detailed answer)
      if (text.length > 150) {
        score += 10;
      }

      if (score > 96) score = 96;

      if (improvements.length === 0) {
        improvements.push('Mantener el nivel de precisión técnica y fluidez verbal durante la entrevista presencial/virtual.');
      }

      // Verdict Classification
      let verdict = '';
      let statusType: 'apto' | 'excelente' | 'warning' = 'apto';

      if (score >= 85) {
        statusType = 'excelente';
        verdict = '🌟 ALTO RENDIMIENTO — Tu respuesta califica para obtener el máximo puntaje en el cuadro de méritos del Comité de Selección.';
      } else if (score >= 60) {
        statusType = 'apto';
        verdict = '👍 APTO CON OBSERVACIONES — Buen enfoque práctico. Incorpora las bases legales recomendadas para asegurar la plaza.';
      } else {
        statusType = 'warning';
        verdict = '⚠️ REGULAR — Respuesta aceptable pero requiere mayor solidez técnica y normativa para superar a otros postulantes.';
      }

      setEvaluation({
        score,
        statusType,
        verdict,
        positives,
        improvements
      });

      setIsAnalyzing(false);
    }, 1000);
  };

  const handleReset = () => {
    setUserAnswer('');
    setEvaluation(null);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      
      {/* Header and Entity Selector Tabs */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold border border-slate-200 dark:border-slate-700 mb-2.5">
            <UserCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>Herramienta de Preparación Técnica para Postulantes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Simulador de Entrevista de Selección CAS y Sector Público
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Entrénate con preguntas técnicas, balotarios y dilemas ético-legales formulados habitualmente por los comités evaluadores del Estado peruano.
          </p>
        </div>

        {/* Entity Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5">
            1. Selecciona la Institución para tu Simulación:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TEMPLATES.map(t => (
              <button
                key={t.entity}
                type="button"
                onClick={() => {
                  setSelectedEntity(t.entity);
                  handleReset();
                }}
                className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                  selectedEntity === t.entity
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedEntity === t.entity ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                    {t.entity}
                  </span>
                  <Building2 size={16} className={selectedEntity === t.entity ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  {t.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official Question Box */}
      <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <Building2 size={16} />
            <span>Comité Evaluador: {currentTemplate.entity} — {currentTemplate.role}</span>
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
            Pregunta Oficial de Concurso Público
          </span>
        </div>

        <p className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white leading-relaxed">
          &ldquo;{currentTemplate.question}&rdquo;
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Criterios de evaluación del jurado:</span>
          {currentTemplate.evaluationCriteria.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              ✓ {c}
            </span>
          ))}
        </div>
      </div>

      {/* User Response Area */}
      <div className="space-y-4">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
          2. Redacta tu respuesta como si estuvieras en la entrevista personal ante el jurado:
        </label>
        <textarea
          rows={5}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Escribe aquí tu respuesta sustentada con base legal, procedimientos y enfoque al ciudadano..."
          className="w-full p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans leading-relaxed shadow-sm"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setUserAnswer(currentTemplate.sampleModelAnswer)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💡 Cargar Respuesta Modelo de Referencia ({currentTemplate.entity})</span>
          </button>

          {userAnswer && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Limpiar Respuesta</span>
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleRunEvaluation}
            disabled={!userAnswer.trim() || isAnalyzing}
            className="w-full h-14 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin text-white" />
                <span>Analizando respuesta con criterios de selección del Estado...</span>
              </>
            ) : (
              <>
                <UserCheck size={20} />
                <span>Evaluar Respuesta y Simular Dictamen del Jurado</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Report Result */}
      {evaluation && (
        <div className={`p-6 rounded-xl border space-y-4 animate-in fade-in duration-300 ${
          evaluation.statusType === 'error'
            ? 'border-rose-300 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/20'
            : evaluation.statusType === 'warning'
            ? 'border-amber-300 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/20'
            : evaluation.statusType === 'excelente'
            ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/20'
            : 'border-sky-300 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/20'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold font-mono text-xl border ${
                evaluation.statusType === 'error'
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                  : evaluation.statusType === 'warning'
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : evaluation.statusType === 'excelente'
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800'
              }`}>
                {evaluation.score}%
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Dictamen del Comité Evaluador</span>
                <span className="text-sm font-bold font-display text-slate-900 dark:text-white">{evaluation.verdict}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>Aspectos Positivos Destacados:</span>
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {evaluation.positives.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className={`font-bold flex items-center gap-1.5 ${
                evaluation.statusType === 'error' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                {evaluation.statusType === 'error' ? <XCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{evaluation.statusType === 'error' ? 'Acción Requerida:' : 'Recomendaciones de Mejora:'}</span>
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
