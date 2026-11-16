"use client";

import React, { useState } from 'react';
import { Hash, Copy, Check, Sparkles, Filter, CheckSquare, Square } from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';

interface HashtagGroup {
  id: string;
  name: string;
  tags: string[];
}

const HASHTAG_GROUPS: HashtagGroup[] = [
  {
    id: 'virales',
    name: '🔥 Virales y Globales (Alto Alcance)',
    tags: ['#sorteo', '#giveaway', '#sorteos', '#concurso', '#participaygana', '#sorteointernacional', '#premios', '#ganador', '#suerte', '#sorteoactivo']
  },
  {
    id: 'peru',
    name: '🇵🇪 Perú & Latinoamérica',
    tags: ['#sorteoperu', '#sorteosperu', '#sorteope', '#sorteolima', '#peru', '#limaperu', '#sorteolatam']
  },
  {
    id: 'mexico',
    name: '🇲🇽 México',
    tags: ['#sorteomexico', '#giveawaymexico', '#sorteosmx', '#sorteocdmx', '#mexico', '#sorteomty']
  },
  {
    id: 'espana',
    name: '🇪🇸 España',
    tags: ['#sorteoespaña', '#giveawayespaña', '#sorteomadrid', '#sorteobarcelona', '#españa', '#concursoespaña']
  },
  {
    id: 'colombia',
    name: '🇨🇴 Colombia',
    tags: ['#sorteocolombia', '#giveawaycolombia', '#sorteobogota', '#sorteomedellin', '#colombia']
  },
  {
    id: 'tech',
    name: '📱 Tecnología & Gaming',
    tags: ['#sorteotech', '#sorteoiphone', '#sorteogaming', '#tecnologia', '#giveawaytech', '#ps5', '#pcgamer']
  },
  {
    id: 'beauty',
    name: '💄 Moda, Belleza & Skincare',
    tags: ['#sorteobelleza', '#sorteomaquillaje', '#sorteomoda', '#skincare', '#beautygiveaway', '#outfit']
  }
];

export default function HashtagsPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '#sorteo', '#giveaway', '#sorteos', '#participaygana', '#sorteointernacional', '#sorteoperu', '#sorteolatam'
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const selectGroup = (tags: string[]) => {
    setSelectedTags((prev) => Array.from(new Set([...prev, ...tags])));
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(selectedTags.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center mx-auto shadow-xs">
          <Hash className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Generador de Hashtags para Sorteos
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
          Encuentra los hashtags con mayor tráfico y visibilidad para aumentar el alcance de tu sorteo en Instagram y TikTok.
        </p>
      </div>

      {/* Selected Output Card */}
      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono">
              Hashtags Seleccionados:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 text-xs font-mono font-bold">
              {selectedTags.length} / 30 tags
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={selectedTags.length === 0}
              className="btn-pro-primary px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiados!' : 'Copiar Hashtags'}</span>
            </button>
          </div>
        </div>

        {/* Selected Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-white/10 min-h-[70px] text-xs font-mono text-pink-600 dark:text-pink-400 flex flex-wrap gap-2 items-center">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 cursor-pointer hover:line-through"
                title="Click para quitar"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-slate-400 dark:text-zinc-500">
              Selecciona tags abajo para armar tu lista...
            </span>
          )}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-6">
        {HASHTAG_GROUPS.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-[#0f172a] p-5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {group.name}
              </h2>
              <button
                type="button"
                onClick={() => selectGroup(group.tags)}
                className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
              >
                + Añadir todos
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
