'use client';

import React, { useState } from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';

export interface PreguntaCas {
  id: string;
  category: 'Ley 27444 (LPAG)' | 'Ley 30225 (Contrataciones)' | 'Ley 27815 (Ética)' | 'Gestión Pública (SIAF/SIGA)';
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  legalBase: string;
}

const PREGUNTAS: PreguntaCas[] = [
  {
    id: 'lpag-1',
    category: 'Ley 27444 (LPAG)',
    question: '¿En qué consiste el Principio de Presunción de Veracidad en el procedimiento administrativo?',
    options: [
      'Que la administración pública debe dudar siempre de los documentos del administrado.',
      'Que se responde que todos los documentos y declaraciones juradas presentadas por los administrados corresponden a la verdad de los hechos.',
      'Que el administrado debe legalizar notarialmente todos los documentos que adjunte.',
      'Que el funcionario público no puede ser sancionado si comete un error.'
    ],
    correctIdx: 1,
    explanation: 'En la tramitación del procedimiento administrativo, se presume que los documentos y declaraciones presentados por los administrados responden a la verdad de los hechos que ellos afirman.',
    legalBase: 'Art. 51 del TUO de la Ley N° 27444',
  },
  {
    id: 'lpag-2',
    category: 'Ley 27444 (LPAG)',
    question: '¿Qué es el Silencio Administrativo Negativo (SAN)?',
    options: [
      'Un acto por el cual la entidad aprueba automáticamente lo solicitado por el ciudadano.',
      'Un mecanismo por el cual el transcurso del tiempo sin pronunciamiento habilita al administrado a interponer los recursos administrativos correspondientes.',
      'Una sanción disciplinaria al funcionario público.',
      'Una multa aplicable al postulante que no firma su declaración jurada.'
    ],
    correctIdx: 1,
    explanation: 'El Silencio Administrativo Negativo desestima la solicitud a efectos de que el administrado pueda interponer los recursos administrativos o acudiera a la vía contencioso administrativa.',
    legalBase: 'Art. 38 del TUO de la Ley N° 27444',
  },
  {
    id: 'contrataciones-1',
    category: 'Ley 30225 (Contrataciones)',
    question: '¿Cuál es el sistema oficial para la publicación de los procesos de selección y contrataciones del Estado en Perú?',
    options: [
      'SIAF (Sistema de Administración Financiera)',
      'SEACE (Sistema Electrónico de Contrataciones del Estado)',
      'SIGA (Sistema de Gestión Administrativa)',
      'SUNAT Operaciones en Línea'
    ],
    correctIdx: 1,
    explanation: 'El SEACE es el sistema electrónico que permite el intercambio de información y difusión de las contrataciones del Estado, administrado por el OSCE.',
    legalBase: 'Art. 47 de la Ley N° 30225',
  },
  {
    id: 'etica-1',
    category: 'Ley 27815 (Ética)',
    question: '¿Qué principio de la función pública obliga a actuar con rectitud, honradez y honestidad?',
    options: [
      'Principio de Eficiencia',
      'Principio de Probidad',
      'Principio de Transparencia',
      'Principio de Veracidad'
    ],
    correctIdx: 1,
    explanation: 'El principio de Probidad exige que el servidor público actúe con rectitud, honradez y honestidad, desechando todo provecho o ventaja personal.',
    legalBase: 'Art. 6 inc. 2 de la Ley N° 27815',
  },
  {
    id: 'gestion-1',
    category: 'Gestión Pública (SIAF/SIGA)',
    question: '¿Qué documento constituye la certificación que garantiza la disponibilidad de crédito presupuestario para realizar un gasto en el Estado?',
    options: [
      'La Orden de Compra',
      'La Certificación de Crédito Presupuestario (CCP)',
      'El Cuadro de Necesidades',
      'La Factura Electrónica'
    ],
    correctIdx: 1,
    explanation: 'La Certificación del Crédito Presupuestario garantiza que la entidad cuenta con el presupuesto asignado y disponible para asumir un compromiso de gasto.',
    legalBase: 'Decreto Legislativo N° 1440 del Sistema Nacional de Presupuesto Público',
  },
];

export function PreguntasCasSimulator() {
  const [selectedCat, setSelectedCat] = useState<string>('Todas');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  const filtered = selectedCat === 'Todas'
    ? PREGUNTAS
    : PREGUNTAS.filter((p) => p.category === selectedCat);

  const handleSelectOption = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleShowAnswer = (qId: string) => {
    setShowAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {['Todas', 'Ley 27444 (LPAG)', 'Ley 30225 (Contrataciones)', 'Ley 27815 (Ética)', 'Gestión Pública (SIAF/SIGA)'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filtered.map((item, idx) => {
          const userAns = userAnswers[item.id];
          const isRevealed = showAnswers[item.id];

          return (
            <div
              key={item.id}
              className="p-6 rounded-xl space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold border border-slate-200 dark:border-slate-700">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Pregunta {idx + 1} de {filtered.length}</span>
              </div>

              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white leading-snug">
                {item.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-2 pt-2">
                {item.options.map((opt, optIdx) => {
                  let optStyle = 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                  if (userAns === optIdx) {
                    if (isRevealed) {
                      optStyle = optIdx === item.correctIdx
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                    } else {
                      optStyle = 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-bold';
                    }
                  } else if (isRevealed && optIdx === item.correctIdx) {
                    optStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(item.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-sans transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5 text-slate-700 dark:text-slate-300">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action and Legal Explanation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleShowAnswer(item.id)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{isRevealed ? 'Ocultar Fundamento Jurídico' : 'Ver Respuesta y Base Legal Oficial'}</span>
                </button>

                {userAns !== undefined && !isRevealed && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    Respuesta registrada. Haz clic en ver base legal.
                  </span>
                )}
              </div>

              {/* Legal Explanation Box */}
              {isRevealed && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Respuesta Correcta: Opción {String.fromCharCode(65 + item.correctIdx)}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.explanation}</p>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                    ⚖️ <strong className="text-slate-900 dark:text-white">Base Normativa:</strong> {item.legalBase}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
